from django.conf.urls import url,include
from django.contrib import admin
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^oauth/', include('social_django.urls', namespace='social')), 
    url(r'', include ('GameApp.urls')),
]

if(settings.DEBUG):
  urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
