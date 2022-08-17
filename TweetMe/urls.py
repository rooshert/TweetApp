from django.contrib import admin
from django.urls import path, re_path, include

from django.conf.urls.static import static
from django.conf import settings

app_name = 'rootProject'
urlpatterns = [
    path('', include('tweetApp.urls')),  # main sys
    path('account/', include('accounts.urls')),  # auth sys
    re_path(r'profiles?/', include('profiles.urls')),  # profiles sys
    re_path(r'api/profiles?/', include('profiles.rest_api.urls')),  # profiles api sys

    path('admin/', admin.site.urls),
]

if settings.DEBUG:
	urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
