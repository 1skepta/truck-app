from rest_framework import serializers
from .models import Trip, LogEntry
from django.contrib.auth.models import User

class TripSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Trip
        fields = '__all__'

class LogEntrySerializer(serializers.ModelSerializer): 
    class Meta: 
        model = LogEntry
        fields = "__all__"

class UserSerializer(serializers.ModelSerializer): 
    password = serializers.CharField(write_only=True)

    class Meta: 
        model = User
        fields = ["id", "username", "email", "password"]

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data["username"], 
            email=validated_data["email"], 
            password=validated_data["password"]
        )

        return user