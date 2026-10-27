from django.shortcuts import render

# views.py
from rest_framework.views import APIView
from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework import status
from .models import Todo, Customer
from .serializers import TodoSerializer, CustomerSignupSerializer, CustomerLoginSerializer
from django.contrib.auth.hashers import check_password
from django.http import JsonResponse
from firebase.firebase_service import get_sensor_data
from django.views import View
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from .chatbotlogic import process_user_message, store_user_response, get_next_question, get_summary, format_summary
from .predict_disease import predict_disease_transformer
from .inferencepipeline import predict_medicines


class TodoViewSet(viewsets.ModelViewSet):
    queryset = Todo.objects.all()
    serializer_class = TodoSerializer

class CustomerSignupView(APIView):
    def post(self, request):
        serializer = CustomerSignupSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data['username']
            email = serializer.validated_data['email']

            if Customer.objects.filter(email=email).exists():
                return Response({'error': 'Email already exists'}, status=status.HTTP_400_BAD_REQUEST)
            if Customer.objects.filter(username=username).exists():
                return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response({'message': 'Signup successful'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class CustomerLoginView(APIView):
    def post(self, request):
        serializer = CustomerLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            password = serializer.validated_data['password']

            customer = Customer.get_customer_by_email(email)

            if customer and check_password(password, customer.password):
                return Response({'message': 'Login successful'}, status=status.HTTP_200_OK)
            
            else:
                return Response({'error': 'Invalid email or password'}, status=status.HTTP_401_UNAUTHORIZED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class SensorDataAPIView(APIView):
    def get(self, request):
        data = get_sensor_data()  # Get actual sensor data

        # Return the data directly, with fallback defaults if missing
        return Response({
            "temperature": data.get("temperature", None),
            "heart_rate": data.get("bpm", None),
            "oxygen_level": data.get("spo2", None),
        })
    

@method_decorator(csrf_exempt, name='dispatch')
class ChatbotMessageAPIView(APIView):
    def post(self, request, *args, **kwargs):
        user_input = request.data.get('message', '')

        if not user_input:
            return Response({'error': 'Message field is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # 🧼 Init or clean session context
        ctx = request.session.get('conversation_context', {
            "symptoms": [],
            "details": {},
            "asked_questions": []
        })

        # 🧹 Sanitize corrupted keys
        if "null" in ctx.get("asked_questions", []):
            print("🧹 Removing 'null' from asked_questions")
            ctx["asked_questions"] = [q for q in ctx["asked_questions"] if q and q != "null"]

        if "null" in ctx.get("details", {}):
            print("🧹 Removing 'null' from details")
            del ctx["details"]["null"]

        request.session["conversation_context"] = ctx
        request.session.modified = True

        session_context = ctx

        try:
            sensor_data = get_sensor_data()
            result = process_user_message(user_input, sensor_data=sensor_data, session_context=session_context)

            request.session["conversation_context"] = result["session_context"]
            request.session.modified = True

            return Response({
                'response': result.get('message', 'Sorry, something went wrong.'),
                'next_question': result.get('next_question')
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error: {e}")
            return Response({'error': 'An internal error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



@method_decorator(csrf_exempt, name='dispatch')
class ChatbotFollowupAPIView(APIView):
    def post(self, request, *args, **kwargs):
        question = request.data.get("question")
        answer = request.data.get("answer")

        print("=== 🧪 Incoming Follow-up Request ===")
        print("Question:", question)
        print("Answer:", answer)

        if not question or not answer:
            print("❌ Missing question or answer.")
            return Response({"error": "Missing question or answer"}, status=status.HTTP_400_BAD_REQUEST)

        if 'conversation_context' not in request.session:
            print("❌ No active conversation found in session.")
            return Response({'error': 'No active conversation found.'}, status=status.HTTP_400_BAD_REQUEST)

        session_context = request.session['conversation_context']

        try:
            print("✅ Calling store_user_response()...")
            response = store_user_response(question, answer, session_context=session_context)
            print("✅ store_user_response returned:", response)

            request.session['conversation_context'] = session_context
            request.session.modified = True

            next_question = get_next_question(sensor_data=None, session_context=session_context)

            print("➡️ Next Question:", next_question)

            return Response({
                'next_question': next_question
            }, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"🔥 Follow-up Error: {e}")
            return Response({'error': 'An internal error occurred.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@method_decorator(csrf_exempt, name='dispatch')
class ChatbotSummaryAPIView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            session_context = request.session.get('conversation_context', {
                "symptoms": [],
                "details": {},
                "asked_questions": []
            })

            summary = get_summary(session_context=session_context)
            structured = format_summary(session_context=session_context)  # ✅ structured version

            # Optionally clear session after summary
            if 'conversation_context' in request.session:
                del request.session['conversation_context']
                request.session.modified = True

            return Response({'summary': summary, 'structured': structured}, status=status.HTTP_200_OK)
            
        

        except Exception as e:
            print(f"Summary Error: {e}")
            return Response({'error': 'Could not generate summary.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

        
class DiseasePredictionAPIView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            patient_data = request.data  # structured summary
            predicted_disease = predict_disease_transformer(patient_data)
            return Response({'disease': predicted_disease}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Prediction Error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        


class MedicationAPIView(APIView):
    def post(self, request):
        try:
            disease = request.data.get("disease", "")
            symptoms = request.data.get("symptoms", "")
            meds = predict_medicines(disease, symptoms)
            return Response({"medicines": meds}, status=200)
        except Exception as e:
            print("Med Prediction Error:", e)
            return Response({"error": str(e)}, status=400)