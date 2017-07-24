from __future__ import unicode_literals
from django.contrib.auth.models import User
from django.db import models

class Score(models.Model):
    score = models.IntegerField()
    user = models.ForeignKey(User)
    date=models.DateTimeField(auto_now=True,blank=True)
   
    class Meta:
        ordering=['user','score','date']
   
    def __unicode__(self):
         return unicode(self.score)

class HighScore(models.Model):
   score= models.IntegerField()
   user= models.ForeignKey(User)
   date= models.DateTimeField(auto_now=True,blank=True)

   def __unicode__(self):
      return unicode(self.score)
