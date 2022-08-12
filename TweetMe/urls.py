from django.contrib import admin
from django.urls import path, re_path, include

from django.conf.urls.static import static
from django.conf import settings

app_name = 'rootProject'
urlpatterns = [
    path('', include('tweetApp.urls')),
    path('account/', include('accounts.urls')),
    re_path(r'profiles?/', include('profiles.urls')),

    path('admin/', admin.site.urls),
]

if settings.DEBUG:
	urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
