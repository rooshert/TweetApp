from django.urls import path, include
from django.views.generic import TemplateView

from .views import ( 
    home_view, 
    tweets_list_view, 
    tweets_detail_view,
    tweet_userprofile_view
)

app_name = 'tweetApp'
urlpatterns = [
    path('', tweets_list_view, name='home_view'),  
    path('<int:tweet_id>', tweets_detail_view, name='tweets_detail_view'),
    path('profile/<str:username>', tweet_userprofile_view, name='tweet_userprofile_view'),

    path('api/', include('tweetApp.rest_api.urls')),

    # path('tweets/', tweets_list_view, name='tweets_list_view'),
    # path('react/', TemplateView.as_view(template_name='react.html')),
    path('react/', TemplateView.as_view(template_name='react_via_dj.html')),
]
