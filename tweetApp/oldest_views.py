from django.views.generic import View, ListView
from django.shortcuts import render, redirect
from django.urls import reverse_lazy
from django.conf import settings

from django.db.models import Q
from .models import Tweet
from .forms import TweetForm
from .services import (TweetsCollection, TweetCreator)

from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (api_view, 
        permission_classes, 
        authentication_classes) 
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
# from .api.serializers import TweetSerializer

import ipdb


def tweets_homepage(request, *args, **kwargs):
    tweet_form = TweetForm()
    return render(
        request, 
        'tweetApp/pages/homepage.html',
        context={'tweet_form': tweet_form},
        status=200
    )


@api_view(['GET'])
def tweets_list_view(request, *args, **kwargs):
    # qs = Tweet.objects.all()
    # serial = TweetSerializer(qs, many=True)
    # return Response(serial.data, status=200)
    ipdb.set_trace()
    t_coll = TweetsCollection(model=Tweet)
    tweets = t_coll.get_tweets_list()
    return Response(tweets)
    

@api_view(['GET'])
def tweet_detail_view(request, tweet_id, *args, **kwargs):
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        return Response({'message': 'tweet not found'}, status=404)

    tweet_obj = qs.first()
    # serial = TweetSerializer(tweet_obj)
    return Response(serial.data, status=200)


@api_view(['POST'])
@permission_classes([IsAuthenticated]) 
def tweet_create_view(request, *args, **kwargs):
    ipdb.set_trace()
    serial = TweetSerializer(data=request.POST or None)
    if serial.is_valid():
        serial.save(user=request.user)
        if request.is_ajax():
            return Response(serial.data, status=201)
    if serial.errors:
        if request.is_ajax():
            return Response(serial.errors, status=400)

    return Response({}, status=404)

@api_view(['DELETE', 'POST'])
@permission_classes([IsAuthenticated])
def tweet_delete_view(request, tweet_id, *args, **kwargs):
    ipdb.set_trace()
    qs = Tweet.objects.filter(Q(id=tweet_id) & Q(user=request.user))
    if not qs.exists():
        return Response({'message': 'You cannot delete this tweet'}, status=404)
    
    tweet = qs.first()
    tweet.delete()
    return Response({'message': 'Tweet was deleted'}, status=200)


class TweetsHomePage(APIView):
    template = 'tweetApp/pages/homepage.html' 
    form = TweetForm
    model = Tweet
    to_next_page = reverse_lazy('tweetApp:tweets-homepage')

    def get(self, request, *args, **kwargs):
        tweet_form = self.form()
        return render(
                request, 
                self.template,
                context={'tweet_form': tweet_form},
                status=200
            )

    def post(self, request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            if request.is_ajax():
                return Response({}, status=401)
            return redirect(settings.LOGIN_URL)

        # serial = TweetSerializer(data=request.POST or None)
        if serial.is_valid():
            serial.save(user=request.user)
            if request.is_ajax():
                return Response(serial.data, status=201)
        if serial.errors:
            if request.is_ajax():
                return Response(serial.errors, status=400)

        return Response({}, status=404)


class TweetsListView(ListView):
    model = Tweet

    def get(self, request, *args, **kwargs):
        t_coll = TweetsCollection(model=self.model)
        t_list = t_coll.get_tweets_list()
        return JsonResponse(t_list)


class TweetDetailView(APIView):
    model = Tweet
    # serializer = TweetSerializer

    def get(self, request, tweet_id, *args, **kwargs):
        qs = self.model.objects.filter(id=tweet_id)
        if not qs.exists():
            return Response({}, status=404)

        tweet = qs.first()
        serial = self.serializer(tweet)
        return Response(serial.data, status=200)
    
