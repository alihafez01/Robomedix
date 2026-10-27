import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage

# Load env
load_dotenv()
groq_api_key = os.getenv("GROQ_API_KEY")
if not groq_api_key:
    raise ValueError("GROQ_API_KEY missing.")

model = ChatGroq(model="Gemma2-9b-It", groq_api_key=groq_api_key)

conversation_context = {
    "symptoms": [],
    "details": {},
    "asked_questions": []
}

UNETHICAL_WORDS = ["sex", "horny", "romantic", "nude", "erotic", "porn", "sexually"]
CRITICAL_KEYWORDS = ["chest pain", "shortness of breath", "difficulty breathing", "unconscious", "bleeding", "seizure"]
MAX_FOLLOW_UP_QUESTIONS = 5


def validate_input(user_input):
    user_input = user_input.strip().lower()
    if not user_input or user_input.isdigit():
        return False
    if any(word in user_input for word in UNETHICAL_WORDS):
        return False
    return True


def classify_intent(user_input):
    prompt = (
        f"Classify the user's intent from the following input: \"{user_input}\".\n"
        "Possible intents: [symptom_reporting, general_question, greeting, farewell, irrelevant]\n"
        "Respond with only the intent."
    )
    try:
        response = model.invoke([HumanMessage(content=prompt)])
        return response.content.strip().lower()
    except:
        return "symptom_reporting"


def extract_symptoms(user_input):
    prompt = (
        f"You are a medical assistant. Extract only clinical symptoms from this input:\n"
        f"\"{user_input}\"\nReturn symptoms separated by commas."
    )
    try:
        response = model.invoke([HumanMessage(content=prompt)])
        symptoms = [s.strip().lower() for s in response.content.split(",") if s.strip()]
        return list(set(symptoms))
    except:
        return []


def analyze_for_emergency(session_context=None):
    if session_context is None:
        session_context = conversation_context

    # ✅ Convert all values to strings
    all_details = [str(val) for val in session_context["details"].values()]
    combined = " ".join(session_context["symptoms"] + all_details).lower()

    if any(term in combined for term in CRITICAL_KEYWORDS):
        print("\n🚨 WARNING: Your symptoms may indicate a medical emergency.")
        print("Please seek immediate medical attention.\n")




def needs_clarification(answer):
    answer_str = str(answer).strip().lower()
    return any(word in answer_str for word in ["sometimes", "maybe", "not sure", "don’t know"])


def generate_next_question(session_context=None):
    try:
        if session_context is None:
            session_context = conversation_context  # fallback to global context

        print("Debug: session_context['symptoms']:", session_context.get('symptoms'))
        print("Debug: session_context['details']:", session_context.get('details'))

        # Debug each key-value type and value in details
        for k, v in session_context.get("details", {}).items():
            print(f"Key: {k}, Value type: {type(v)}, Value: {v}")

        context_summary = (
            f"Symptoms: {', '.join(set(session_context.get('symptoms', [])))}\n"
            "Answers:\n" +
            "\n".join(f"{k}: {str(v)}" for k, v in session_context.get("details", {}).items())
        )

        print("Debug: context_summary:", context_summary)

        prompt = (
            f"You are a smart medical assistant. Based on the context below, ask one helpful follow-up medical question.\n"
            f"Don't repeat any question already asked.\n"
            f"Context:\n{context_summary}\n"
            "Respond with only the next question."
        )

        print("Debug: prompt:", prompt)

        response = model.invoke([HumanMessage(content=prompt)])
        next_question = response.content.strip()

        print("Debug: next_question from model:", next_question)
        return next_question

    except Exception as e:
        print("Error in generate_next_question:", e)
        return None




def ask_follow_up(sensor_data=None):
    # Inject sensor values first
    if sensor_data:
        if "bpm" in sensor_data:
            conversation_context["details"]["Heart Rate (BPM)"] = sensor_data["bpm"]
        if "spo2" in sensor_data:
            conversation_context["details"]["Blood Oxygen (SpO2)"] = sensor_data["spo2"]
        if "temperature" in sensor_data:
            conversation_context["details"]["Body Temperature (F)"] = sensor_data["temperature"]

    question_count = 0

    # Ask about age
    age_question = "What is your age?"
    if age_question not in conversation_context["asked_questions"]:
        conversation_context["asked_questions"].append(age_question)
        answer = input(f"\nBot: {age_question} ").strip()
        if answer:
            conversation_context["details"][age_question] = answer

    # Ask about gender
    gender_question = "What is your gender? (e.g., male, female, non-binary)"
    if gender_question not in conversation_context["asked_questions"]:
        conversation_context["asked_questions"].append(gender_question)
        answer = input(f"\nBot: {gender_question} ").strip()
        if answer:
            conversation_context["details"][gender_question] = answer

    # Ask about blood pressure
    bp_question = "What is your current blood pressure reading, if available?"
    if bp_question not in conversation_context["asked_questions"]:
        conversation_context["asked_questions"].append(bp_question)
        answer = input(f"\nBot: {bp_question} ").strip()
        if answer:
            conversation_context["details"][bp_question] = answer
            analyze_for_emergency()

    while question_count < MAX_FOLLOW_UP_QUESTIONS:
        question = generate_next_question()

        if question and "temperature" in question.lower():
            continue
        if not question or question in conversation_context["asked_questions"]:
            break

        conversation_context["asked_questions"].append(question)
        answer = input(f"\nBot: {question} ").strip()
        if not answer or answer.lower() in ["no", "none", "nothing"]:
            continue
        if needs_clarification(answer):
            print("Bot: Could you be more specific?")
            continue

        conversation_context["details"][question] = answer
        question_count += 1
        analyze_for_emergency()


def summarize_conversation():
    print("\n================= 🩺 Robomedix Summary Report =================")
    print("\n🩻 Symptoms Reported:")
    for symptom in set(conversation_context["symptoms"]):
        print(f" - {symptom.capitalize()}")

    if conversation_context["details"]:
        print("\n📋 Medical Details:")
        for q, a in conversation_context["details"].items():
            print(f"🔹 {q}\n   ↳ {a}")

    print("\n==============================================================")
    print("⚠️  This is a preliminary assessment. Please consult a medical professional.")
    print("==============================================================\n")


def start_conversation():
    print("👋 Welcome to Robomedix Symptom Checker!")
    print("Bot: Let me know how you're feeling today. (Type 'exit' to quit)")

    while True:
        user_input = input("\nUser: ").strip()
        if user_input.lower() in ["exit", "quit"]:
            print("Bot: Thank you for using Robomedix. Take care!")
            break

        if not validate_input(user_input):
            print("Bot: That input wasn't helpful. Could you describe your symptoms more clearly?")
            continue

        intent = classify_intent(user_input)
        if intent != "symptom_reporting":
            if intent == "greeting":
                print("Bot: Hi there! Let me know if you're experiencing any symptoms.")
            elif intent == "farewell":
                print("Bot: Goodbye! Stay healthy.")
                break
            else:
                print("Bot: I'm here to check on health. Please describe how you're feeling.")
            continue

        symptoms = extract_symptoms(user_input)
        if not symptoms:
            print("Bot: I couldn't identify any symptoms. Please describe them again.")
            continue

        for symptom in symptoms:
            if symptom not in conversation_context["symptoms"]:
                conversation_context["symptoms"].append(symptom)

        print("\nBot: I have identified the following symptoms:")
        for s in symptoms:
            print(f" - {s}")

        ask_follow_up()
        summarize_conversation()


def get_next_question(sensor_data=None, session_context=None):
    if session_context is None:
        session_context = {
            "symptoms": [],
            "details": {},
            "asked_questions": []
        }

    # Inject sensor values first
    if sensor_data:
        if "bpm" in sensor_data:
            session_context["details"]["Heart Rate (BPM)"] = sensor_data["bpm"]
        if "spo2" in sensor_data:
            session_context["details"]["Blood Oxygen (SpO2)"] = sensor_data["spo2"]
        if "temperature" in sensor_data:
            session_context["details"]["Body Temperature (F)"] = sensor_data["temperature"]

    preset_questions = [
        "What is your age?",
        "What is your gender? (e.g., male, female, non-binary)",
        "What is your current blood pressure reading, if available?"
    ]
    asked = session_context.get("asked_questions", [])
    asked = [q for q in asked if q and q != "null"]  # 🧼 Clean list
    for q in preset_questions:
        if q not in session_context["asked_questions"]:
            return q

    if len(session_context["asked_questions"]) >= MAX_FOLLOW_UP_QUESTIONS + len(preset_questions):
        return None

    question = generate_next_question(session_context=session_context)
    if question and question not in session_context["asked_questions"]:
        return question

    return None


def store_user_response(question, answer, session_context=None):
    if session_context is None:
        session_context = conversation_context

    if not question or question == "null" or not answer:
        print("❌ Invalid or null question passed. Skipping.")
        return "Invalid input."

    session_context["asked_questions"].append(question)
    session_context["details"][question] = str(answer).strip()
    analyze_for_emergency(session_context)
    return "Answer stored."






def process_user_message(user_input, sensor_data=None, session_context=None):
    if session_context is None:
        session_context = {
            "symptoms": [],
            "details": {},
            "asked_questions": []
        }

    if not validate_input(user_input):
        return {
            "status": "invalid",
            "message": "That input wasn't helpful. Could you describe your symptoms more clearly?"
        }

    intent = classify_intent(user_input)
    if intent != "symptom_reporting":
        responses = {
            "greeting": "Hi there! Let me know if you're experiencing any symptoms.",
            "farewell": "Goodbye! Stay healthy.",
            "default": "I'm here to check on health. Please describe how you're feeling."
            }
        print("📥 Symptoms input received:", user_input)
        print("🧠 Symptoms extracted:", symptoms)
        print("🧾 Asked Questions So Far:", session_context["asked_questions"])
        print("🧪 Getting next question now...")
        return {
            "status": "non_symptom",
            "message": responses.get(intent, responses["default"]),
            "next_question": None,  # ✅ Ensure key always exists
            "session_context": session_context  # ✅ include this always
        }

    symptoms = extract_symptoms(user_input)
    if not symptoms:
        return {
            "status": "no_symptoms",
            "message": "I couldn't identify any symptoms. Please describe them again."
        }

    # ✅ Use session_context only
    for symptom in symptoms:
        if symptom not in session_context["symptoms"]:
            session_context["symptoms"].append(symptom)

    response_lines = ["I have identified the following symptoms:"]
    for s in symptoms:
        response_lines.append(f" - {s}")

    next_question = get_next_question(sensor_data=sensor_data, session_context=session_context)
    print("➡️ Next Question Generated:", next_question)
    return {
        "status": "symptom_reported",
        "message": "\n".join(response_lines),
        "next_question": next_question,
        "session_context": session_context  # 👈 Pass updated context back
    }

def get_summary(session_context=None):
    if session_context is None:
        session_context = conversation_context

    summary_lines = [
        "\n🩻 Symptoms Reported:",
        *[f" - {s.capitalize()}" for s in set(session_context.get("symptoms", []))]
    ]

    if session_context.get("details"):
        summary_lines.append("\n📋 Medical Details:")
        for q, a in session_context["details"].items():
            summary_lines.append(f"🔹 {q}\n   ↳ {a}")

    summary_lines.append("\n⚠️  This is a preliminary assessment. Please consult a medical professional.")
    return "\n".join(summary_lines)


def format_summary(session_context):
    formatted = {
        'Age': None,
        'Gender': None,
        'Symptom_1': None,
        'Symptom_2': None,
        'Symptom_3': None,
        'Heart_Rate_bpm': None,
        'Body_Temperature_C': None,
        'Blood_Pressure_mmHg': None,
        'Oxygen_Saturation_%': None
    }

    details = session_context.get("details", {})
    base_symptoms = set(session_context.get("symptoms", []))

    # --- Extract known medical values ---
    for question, answer in details.items():
        q_lower = question.lower().strip()
        a_str = str(answer).strip()

        if "age" in q_lower:
            try:
                formatted["Age"] = int(a_str)
            except:
                pass

        elif "gender" in q_lower:
            formatted["Gender"] = a_str.capitalize()

        elif "blood pressure" in q_lower:
            formatted["Blood_Pressure_mmHg"] = a_str

        elif "heart rate" in q_lower or "bpm" in q_lower:
            try:
                formatted["Heart_Rate_bpm"] = int(a_str)
            except:
                pass

        elif "oxygen" in q_lower or "spo2" in q_lower:
            try:
                formatted["Oxygen_Saturation_%"] = int(a_str)
            except:
                pass

        elif "temperature" in q_lower:
            try:
                f = float(a_str)
                formatted["Body_Temperature_C"] = round((f - 32) * 5 / 9, 1)
            except:
                pass

        elif "other symptoms" in q_lower:
            # ✅ Extract extra symptoms like: "body pain, headache"
            extras = [s.strip().lower() for s in a_str.split(",") if s.strip()]
            base_symptoms.update(extras)

    # --- Attach top 3 symptoms ---
    sorted_symptoms = sorted(base_symptoms)
    for i, symptom in enumerate(sorted_symptoms[:3]):
        formatted[f"Symptom_{i + 1}"] = symptom.capitalize()

    return formatted





if __name__ == "__main__":
    start_conversation()