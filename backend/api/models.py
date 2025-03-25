from django.db import models
from django.contrib.auth.models import User

class Trip(models.Model): 
    driver = models.ForeignKey(User, on_delete=models.CASCADE)
    start_location = models.CharField(max_length=255)
    end_location = models.CharField(max_length=255)
    distance_miles = models.FloatField(default=100)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    total_hours = models.FloatField()
    fuel_stops = models.IntegerField(default=0)
    rest_stops = models.IntegerField(default=0)
    pickup_delay = models.FloatField(default=1)
    dropoff_delay = models.FloatField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    def calculate_stops(self):
        self.fuel_stops = int(self.distance_miles//1000)
        self.rest_stops = int(self.total_hours // 8)

    def save(self, *args, **kwargs):
        self.calculate_stops()
        super().save(*args, **kwargs)


    def __str__(self): 
        return f"{self.driver.username} - {self.start_location} to {self.end_location}"
    
class LogEntry(models.Model):
    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="logs")
    log_time = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50, choices=[("Driving", "Driving"), ("Resting", "Resting")])

    def __str__(self):
        return f"{self.trip.driver.username} - {self.status} at {self.log_time}"