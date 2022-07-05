from .models import Tweet
from django.db.models import Q

from .forms import TweetForm

from django.shortcuts import render

from rest_framework.response import Response
from rest_framework.authentication import SessionAuthentication
from rest_framework.decorators import (
        api_view, 
        permission_classes, 
        authentication_classes) 
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .serializers import (TweetSerializer, TweetCreateSerializer, TweetActionSerializer, RetweetSerializer)

import ipdb

def tweets_homepage(request, *args, **kwargs):
    tweet_form = TweetForm()
    return render(
        request, 
        'tweetApp/pages/homepage.html',
        context={'tweet_form': tweet_form},
        status=200
    )

@api_view(['GET']) # К контроллеру можно получить доступ только с помощью http метода GET
def tweets_list_view(request, *args, **kwargs):
    # Вывод списка твитов
    qs = Tweet.objects.all()
    username = request.GET.get('username')  # ?username=dmitry
    if username:
        qs = qs.filter(user__username__iexact=username)

    serial = TweetSerializer(qs, many=True) # Сериализация объекта твитов в примитивный тип Python
    return Response(serial.data, status=200)  # Возвращает JSON с данными и статусом 200 - запрос выполнен успешно
    

@api_view(['GET']) # К контроллеру можно получить доступ только с помощью http метода GET
def tweet_detail_view(request, tweet_id, *args, **kwargs):
    # Вывод детальной информации о твите
    qs = Tweet.objects.filter(id=tweet_id)
    if not qs.exists():
        # Если твит не найден - возвращаем информацио об ошибке в JSON формате
        return Response({'message': 'tweet not found'}, status=404)

    tweet_obj = qs.first()
    serial = TweetSerializer(tweet_obj) # Сериализация конкретного объекта твита в примитивный тип Python
    return Response(serial.data, status=200) # Возвращает JSON с данными и статусом 200 - запрос выполнен успешно


@api_view(['POST']) # К контроллеру можно получить доступ только с помощью http метода POST
@permission_classes([IsAuthenticated]) # Не аутентифицированный пользователь не может получить доступ к контроллеру
# Будет возвращён http код 403 - пользователь не аутентифицирован
def tweet_create_view(request, *args, **kwargs):
    '''
        Контроллер создания твита:
            - Поддерживает только метод HTTP POST
            - Не аутентифицированные пользователи создавать твиты не могут
            - Поддержка AJAX запросов
            - Используем TweetCreateSerializer для создания объекта твита
    '''
    serial = TweetCreateSerializer(data=request.data or None) # Заполняем сериализатор данными, которые пришли в HTTP body
    if serial.is_valid(): # Проверка данных полей сериализатора на валидность
        tweet_obj = serial.save(user=request.user) # Создаём новый объект твита, указываем отправившего твит пользователя.
        serial = TweetSerializer(tweet_obj)
        return Response(serial.data, status=201) # Возвращает JSON с данными и статусом 201 - успешно создан новый объект
    if serial.errors: # Данные полей сериализатора не вылидны. Проверяем наличие ошибок
        return Response({'error_messages': serial.errors}, status=400) # Возвращаем информацию об ошибе.

    return Response({}, status=404) # Поведение не обработано...


@api_view(['DELETE', 'POST']) # К контроллеру можно получить доступ только с помощью http метода DELETE и POST
@permission_classes([IsAuthenticated])
def tweet_delete_view(request, *args, **kwargs):
    '''
        Контроллер удаления твита:
            - Контроллер получает HTTP body 'id=xxx'
            - id - обязательный параметр
    '''
    tweet_id = request.POST.get('id')
    # qs = Tweet.objects.filter(Q(id=int(tweet_id)) & Q(user=request.user))
    qs = Tweet.objects.filter(id=int(tweet_id))
    if not qs.exists():
        return Response({'message': 'You cannot delete this tweet'}, status=404)

    tweet = qs.first()
    if request.user.id != tweet.user.id:
        return Response({'message': 'Cross user delete error'}, status=400)

    tweet.delete()
    return Response({'message': 'Tweet was deleted'}, status=200)


@api_view(['POST']) # К контроллеру можно получить доступ только с помощью http метода DELETE и POST
@permission_classes([IsAuthenticated]) 
def tweet_action_view(request, *args, **kwargs):
    '''
        Контроллер обработки действий над твитом.
            - Контроллер получает HTTP body 'id=xxx&action=yyy&content=zzz'
            - id - обязательный параметр
            - Действия над твитом: like, unlike, retweet
    '''
    action_serial = TweetActionSerializer(data=request.data) # Заполняем сериализатор данными, которые пришли в HTTP body
    if action_serial.is_valid(): # Проверка данных полей сериализатора на валидность
        data = action_serial.validated_data # Получаем проверенные данные 
        tweet_id = data.get('id')
        tweet_action = data.get('action')
        tweet_content = data.get('content')
        qs = Tweet.objects.filter(id=tweet_id)

        if not qs.exists():
            # Твит не найден! возвращаем информацию об ошибке со статусом 404 - ресурс не найден.
            return Response({'message': 'Sorry, tweet not found!'}, status=404)
        tweet = qs.first()
        if tweet_action.lower() == 'socialscore':
            user = request.user
            if tweet.likes.contains(user):
                tweet.likes.remove(user)
            else:
                tweet.likes.add(user) 
            tweet_serial = TweetSerializer(tweet)  # Сериализуем объект твита в примитивный тип Python
        elif tweet_action.lower() == 'retweet':
            parent_tweet = tweet
            new_tweet = Tweet.objects.create(
                    text_content=tweet_content,
                    user=request.user, 
                    parent=parent_tweet)
            tweet_serial = TweetSerializer(new_tweet)
            return Response(tweet_serial.data, status=201)

    if action_serial.errors: # Если поля сериализатора не валидны - возвращаем сообщение об ошибке с кодом 400 - запрос не обработан
        return Response({'message': action_serial.errors}, status=400)
    
    return Response(tweet_serial.data, status=200)  # Возвращаем данные обработанного твита в формате JSON со статусным кодом 200

