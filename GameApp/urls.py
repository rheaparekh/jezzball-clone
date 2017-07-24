from django.conf.urls import url,include

from GameApp import views

urlpatterns=[
    url(r'^$',views.index,name='index'),
    url(r'^scores$',views.score_view,name='score'),
    url(r'^save_scores$',views.score_save,name="save_score"),
    url(r'^save_highscores$',views.HighScoreSave,name="highscoresave"),
    url(r'^login$',views.login_view,name='login'),
    url(r'^logout$',views.logout_view,name='logout'),
    url(r'^signup$',views.signup,name='signup'),
]
