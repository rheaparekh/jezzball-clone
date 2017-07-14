from django.shortcuts import render,redirect
from django.contrib.auth import login, authenticate, logout
from django.contrib.auth.models import User
from GameApp.forms import UserCreateForm, AuthenticateForm
from GameApp.models import Score
from django.http import HttpResponse
from django.views.decorators.csrf import requires_csrf_token

def index(request,auth_form=None,user_form=None):
  if request.user.is_authenticated():
         user=request.user
         return render(request,'game.html')
  else:
         auth_form=auth_form or AuthenticateForm()
         user_form=user_form or UserCreateForm()
         return render(request,'signupbase.html',{'auth_form':auth_form,'user_form':user_form})

def score_view(request):
  if request.user.is_authenticated():
     score_list=Score.objects.order_by('date')
     context={'score_list':score_list}
     return render(request,'score.html',context)

def score_save(request):
   if request.user.is_authenticated():
       user=request.user
       score=request.POST.get('score')
       date=request.POST.get('date')
       scoresave=Score.objects.create(user=user,score=score,date=date)
       return HttpResponse("")

def login_view(request):
     if request.method=="POST":
         form = AuthenticateForm(data=request.POST)
         if form.is_valid():
               login(request,form.get_user())
               return redirect('/')
         else:
               return index(request,auth_form=form)
     return redirect('/')

def logout_view(request):
    logout(request)
    return redirect('/')
 
def signup(request):
     user_form=UserCreateForm(data=request.POST)
     if request.method =='POST':
        if user_form.is_valid():
            username=user_form.cleaned_data['username']
            password=user_form.clean_password2()
            user_form.save()
            user=authenticate(username=username,password=password)
            login(request,user)
            return redirect('/')
        else:
            return index(request,user_form=user_form)
     return redirect('/')
