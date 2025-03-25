from django.contrib import admin
from .models import Trip, LogEntry


admin.site.register(Trip)
admin.site.register(LogEntry)