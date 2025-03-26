from rest_framework import serializers
from .models import Trip, LogEntry, DriverProfile
from django.contrib.auth.models import User

class TripSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Trip
        fields = '__all__'
        read_only_fields = ['driver', 'created_at']

class LogEntrySerializer(serializers.ModelSerializer): 
    class Meta: 
        model = LogEntry
        fields = "__all__"

class DriverProfileSerializer(serializers.ModelSerializer):
    class Meta: 
        model = DriverProfile
        fields = ["license_number", "truck_type", "years_of_experience"]

class UserSerializer(serializers.ModelSerializer): 
    password = serializers.CharField(write_only=True)
    profile = DriverProfileSerializer(required=False)

    class Meta: 
        model = User
        fields = ["id", "username", "email", "password", "profile"]

    def create(self, validated_data):
        profile_data = validated_data.pop("profile", {})
        user = User.objects.create_user(
            username=validated_data["username"], 
            email=validated_data["email"], 
            password=validated_data["password"]
        )
        DriverProfile.objects.create(user=user, **profile_data)
        return user

    def update(self, instance, validated_data):
        profile_data = validated_data.pop("profile", {})
        instance.username = validated_data.get("username", instance.username)
        instance.email = validated_data.get("email", instance.email)
        instance.save()
        profile = instance.profile
        profile.license_number = profile_data.get("license_number", profile.license_number)
        profile.truck_type = profile_data.get("truck_type", profile.truck_type)
        profile.years_of_experience = profile_data.get("years_of_experience", profile.years_of_experience)
        profile.save()
        return instance
