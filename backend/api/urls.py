from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import TripViewSet, LogEntryViewSet, register_user, get_driver_profile, update_driver_profile

router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'logs', LogEntryViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', register_user, name="register"),
    path('profile/', get_driver_profile, name="get_profile"), 
    path('profile/update/', update_driver_profile, name="update_profile")
]
