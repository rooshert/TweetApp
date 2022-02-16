from django.urls import path, include
from django.views.generic import TemplateView
from .views import (
        tweets_homepage, # используем базовые HTML-шаблоны Django
        # DRF API 
        tweets_list_view, 
        tweet_detail_view, 
        tweet_create_view, 
        tweet_action_view,
        tweet_delete_view
    )

TWEET_LIST_NAME = 'tweets-list'
TWEET_DETAIL_NAME = 'tweet-detail'
TWEET_CREATE_NAME = 'tweet-create'
TWEET_DELETE_NAME = 'tweet-delete'
TWEET_ACTION_NAME = 'tweet-action'

# Контроллеры, в которых используется DRF
api_urlpatterns = [
    path('tweets/', tweets_list_view, name=TWEET_LIST_NAME),
    path('tweet/<int:tweet_id>/detail/', tweet_detail_view, name=TWEET_DETAIL_NAME),
    path('tweet/create/', tweet_create_view, name=TWEET_CREATE_NAME),
    path('tweet/delete/', tweet_delete_view, name=TWEET_DELETE_NAME),
    path('tweet/action', tweet_action_view, name=TWEET_ACTION_NAME)
]

from django.urls import re_path

app_name = 'tweetApp'
urlpatterns = [
    path('', tweets_homepage, name='tweets-homepage'),
    path('api/', include(api_urlpatterns)),
    path('react/', TemplateView.as_view(template_name='react.html')),
]

