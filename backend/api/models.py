from django.db import models
from django.contrib.auth.models import User

class Trip(models.Model): 
    driver = models.ForeignKey(User, on_delete=models.CASCADE)
    start_location = models.CharField(max_length=255)
    end_location = models.CharField(max_length=255)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    total_hours = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self): 
        return f"{self.driver.username} - {self.start_location} to {self.end_location}"
    
class LogEntry(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="logs")
    log_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=[("Driving", "Driving"), ("Resting", "Resting")])

    def __str__(self):
        return f"{self.trip.driver.username} - {self.status} at {self.log_time}"