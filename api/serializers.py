from django.contrib.auth.models import User
from api.models import Information
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'is_staff']
        
class InformationSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(source="user.username", read_only=True)
    class Meta: 
        model = Information
        fields = ["user", 'camera', 'image', 'dateTime', 'prob_dog', 'prob_leash', 'location', 'add']
