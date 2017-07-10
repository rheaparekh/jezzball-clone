from rest_framework import serializers
from GameApp.models import Score
from django.contrib.auth.models import User

class ScoreSerializer(serializers.Serializer):
       user=serializers.ForeignKey(User)
       score=serializer.IntegerField()
       date=serializer.DateTimeField()
