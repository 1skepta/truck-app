from datetime import timedelta
from django.utils.timezone import now
from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.exceptions import ValidationError
from .models import Trip, LogEntry
from .serializers import TripSerializer, LogEntrySerializer, UserSerializer, DriverProfileSerializer
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas
from django.http import HttpResponse

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

    def perform_create(self, serializer):
        driver = self.request.user
        trip = serializer.validated_data.get("trip")
        new_status = serializer.validated_data.get("status")
        log_time = serializer.validated_data.get("log_time", now()) 

        eight_days_ago = log_time - timedelta(days=8)
        recent_logs = LogEntry.objects.filter(trip__driver=driver, log_time__gte=eight_days_ago).order_by("log_time")

        last_24_hours = log_time - timedelta(hours=24)
        driving_hours = sum(
            (log.log_time - prev_log.log_time).total_seconds() / 3600
            for log, prev_log in zip(recent_logs[1:], recent_logs[:-1])
            if prev_log.status == "Driving" and log.log_time >= last_24_hours
        )
        if new_status == "Driving" and driving_hours >= 11:
            raise ValidationError("HOS Violation: Cannot exceed 11 hours of driving in 24 hours.")

        shift_start = None
        on_duty_hours = 0
        for log in recent_logs:
            if log.status in ["Driving", "On Duty"]:
                if shift_start is None:
                    shift_start = log.log_time
                on_duty_hours += (log.log_time - shift_start).total_seconds() / 3600
                shift_start = log.log_time
        if on_duty_hours >= 14:
            raise ValidationError("HOS Violation: Cannot exceed 14 hours in a single shift.")

        last_off_duty = next((log.log_time for log in reversed(recent_logs) if log.status == "Off Duty"), None)
        if last_off_duty and (log_time - last_off_duty) < timedelta(hours=10):
            raise ValidationError("HOS Violation: 10-hour reset required before starting a new shift.")

        if new_status == "Driving":
            last_break = next((log.log_time for log in reversed(recent_logs) if log.status == "Resting"), None)
            if last_break and (log_time - last_break) < timedelta(minutes=30):
                raise ValidationError("HOS Violation: 30-minute break required after 8 hours of driving.")

        total_hours_last_8_days = sum(
            (log.log_time - prev_log.log_time).total_seconds() / 3600
            for log, prev_log in zip(recent_logs[1:], recent_logs[:-1])
            if prev_log.status in ["Driving", "On Duty"]
        )
        if total_hours_last_8_days >= 70:
            raise ValidationError("HOS Violation: Cannot exceed 70 hours in 8 days.")

        serializer.save()


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def generate_log_sheet(request):
   
    driver = request.user
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = f'attachment; filename="logsheet_{driver.username}.pdf"'

    p = canvas.Canvas(response, pagesize=letter)
    width, height = letter

    p.setFont("Helvetica-Bold", 14)
    p.drawString(200, height - 50, "Driver's Daily Log Sheet")

    p.setFont("Helvetica", 12)
    p.drawString(50, height - 80, f"Driver: {driver.get_full_name()}")
    p.drawString(50, height - 100, f"Date: {now().strftime('%Y-%m-%d')}")

    draw_log_grid(p, width, height - 150)

    today_logs = LogEntry.objects.filter(
        trip__driver=driver, log_time__date=now().date()
    ).order_by("log_time")

    plot_log_entries(p, today_logs, width, height - 150)

    p.showPage()
    p.save()
    return response

def draw_log_grid(p, width, y_start):
 
    p.setLineWidth(1)
    p.rect(50, y_start, width - 100, 200)

    for i in range(1, 25):
        x = 50 + (i * ((width - 100) / 24))
        p.line(x, y_start, x, y_start + 200)

    status_labels = ["Off Duty", "Sleeper", "Driving", "On Duty"]
    for i in range(1, 4):
        y = y_start + (i * 50)
        p.line(50, y, width - 50, y)

    for i, label in enumerate(status_labels):
        p.drawString(10, y_start + (i * 50) + 20, label)

    for i in range(0, 25, 2):
        x = 50 + (i * ((width - 100) / 24))
        p.drawString(x - 5, y_start - 15, str(i))

def plot_log_entries(p, logs, width, y_start):
  
    if not logs:
        return

    x_start = 50
    time_unit = (width - 100) / 24  

    status_y = {
        "Off Duty": y_start + 150,
        "Sleeper": y_start + 100,
        "Driving": y_start + 50,
        "On Duty": y_start,
    }

    prev_x = x_start
    prev_y = status_y["Off Duty"] 

    for log in logs:
        hour_fraction = log.log_time.hour + (log.log_time.minute / 60)
        x_new = x_start + (hour_fraction * time_unit)
        y_new = status_y.get(log.status, prev_y)

        p.line(prev_x, prev_y, x_new, prev_y) 
        p.line(x_new, prev_y, x_new, y_new)  

        prev_x, prev_y = x_new, y_new