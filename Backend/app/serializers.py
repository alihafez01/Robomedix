# serializers.py
from rest_framework import serializers
from .models import Todo, Customer
from rest_framework import serializers
from django.contrib.auth.hashers import make_password

class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = '__all__'

class CustomerSignupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = ['username', 'email', 'password']

    def create(self, validated_data):
        validated_data['password'] = make_password(validated_data['password'])
        customer = Customer(**validated_data)
        customer.register()
        return customer


class CustomerLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)