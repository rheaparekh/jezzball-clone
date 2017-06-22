from rest_framework import serializers
from GameApp.models import Score

class ScoreSerializer(serializers.ModelSerializer):
   class Meta:
      model=Score
      fields=('id','user','score','date')

