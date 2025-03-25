from rest_framework import viewsets
from .models import Trip, LogEntry
from .serializers import TripSerializer, LogEntrySerializer
from rest_framework.permissions import IsAuthenticated

class TripViewSet(viewsets.ModelViewSet): 
    queryset= Trip.objects.all()
    serializer_class = TripSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(driver=self.request.user)

class LogEntryViewSet(viewsets.ModelViewSet): 
    queryset = LogEntry.objects.all()
    serializer_class= LogEntrySerializer
    permission_classes= [IsAuthenticated]