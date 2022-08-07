from django.urls import path 

from .views import profile_detail_view

urlpatterns += [
	path('profile/<str:username>', profile_detail_view)
]