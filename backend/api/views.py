from rest_framework import viewsets, status
from .models import Trip, LogEntry, DriverProfile
from .serializers import TripSerializer, LogEntrySerializer, UserSerializer, DriverProfileSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes

@api_view(["POST"])
@permission_classes([AllowAny])
def register_user(request): 
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid(): 
        user = serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_driver_profile(request):
    profile = request.user.profile
    serializer = DriverProfileSerializer(profile)
    return Response(serializer.data)

@api_view(["PUT"])
@permission_classes([IsAuthenticated])
def update_driver_profile(request):
    profile = request.user.profile  
    serializer = DriverProfileSerializer(profile, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]  

    def get_queryset(self):
        if self.request.user.is_authenticated:
            return Trip.objects.filter(driver=self.request.user)
        return Trip.objects.none()

    def perform_create(self, serializer):
        serializer.save(driver=self.request.user)

class LogEntryViewSet(viewsets.ModelViewSet): 
    queryset = LogEntry.objects.all()
    serializer_class = LogEntrySerializer
    permission_classes = [IsAuthenticated]
