from django.urls import path 

from .views import action_follow_view

'''
    URL = /api/profiles/
'''
urlpatterns = [
	path(
        '<str:username>/follow', 
        action_follow_view, 
        name='action_follow_view'
    ),
]