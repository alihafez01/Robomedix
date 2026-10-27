"""
URL configuration for robomedix project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from app.views import TodoViewSet, CustomerSignupView, CustomerLoginView, SensorDataAPIView, ChatbotMessageAPIView, ChatbotFollowupAPIView, ChatbotSummaryAPIView, DiseasePredictionAPIView, MedicationAPIView

router = DefaultRouter()
router.register(r'todos', TodoViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include(router.urls)),
    path('signup/', CustomerSignupView.as_view(), name='signup'),
    path('login/', CustomerLoginView.as_view(), name='customer-login'),
    path("sensors/", SensorDataAPIView.as_view(), name="sensor-data"),
    path('api/chatbot/message/', ChatbotMessageAPIView.as_view(), name='chatbot-message'),
    path('api/chatbot/followup/', ChatbotFollowupAPIView.as_view(), name='chatbot-followup'),   # 🆕
    path('api/chatbot/summary/', ChatbotSummaryAPIView.as_view(), name='chatbot-summary'),      # 🆕
    path("api/predict-disease/", DiseasePredictionAPIView.as_view(), name="predict-disease"),
    path("api/predict-meds/", MedicationAPIView.as_view(), name="predict-meds"),


]


