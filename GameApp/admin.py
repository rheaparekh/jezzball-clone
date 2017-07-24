from django.contrib import admin
from .models import Score,HighScore

class ScoreAdmin(admin.ModelAdmin):
  list_display=('id','date','user','score')

admin.site.register(Score,ScoreAdmin)

class HighScoreAdmin(admin.ModelAdmin):
  list_display=('date','user','score')

admin.site.register(HighScore,HighScoreAdmin)
