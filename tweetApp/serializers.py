import ipdb

from rest_framework import serializers
from django.conf import settings

from .models import Tweet
from .bad_request_messages import (
        LONG_TWEET_MESSAGE, 
        WRONG_ACTION_FORMAT_MESSAGE, 
        ACTION_OPTION_NOT_DEFINED_MESSAGE,
        ACTION_ID_WAS_NEGATIVE_MESSAGE)
from django.contrib.auth import get_user_model


'''
    Сериализаторы по действиям подразделены на:
        - Вывод списка твитов (read only)
        - Создание нового твита (create only)
        - Обработка действий над твитами (read only)
    Сериализаторы твитов подразделены на:
        - Сериализатор создания объекта твита - TweetCreateSerializer (create only serializer)
        - Сериализатор обработки действия над твитом - TweetActionSerializer (read only serializer)
'''


class TweetCreateSerializer(serializers.ModelSerializer):
    '''
        create only serializer
        Сериализатор создание нового объекта твита
    '''
    text_content = serializers.CharField()
    
    class Meta:
        model = Tweet
        fields = ['id', 'text_content']
        extra_kwargs = {'text_content': {'required': True}}

    def get_likes(self, obj):
        return obj.likes.count()

    def validate_text_content(self, value):
        if len(value) > settings.MAX_TWEET_LENGTH:
            raise serializers.ValidationError(LONG_TWEET_MESSAGE)
        return value


class RetweetSerializer(serializers.ModelSerializer):
    text_content = serializers.SerializerMethodField(read_only=True)
    parent = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Tweet
        fields = ['id', 'text_content', 'parent', 'likes', 'date_created']
    
    def get_parent(self, obj):
        '''
            obj - экземпляр модели Tweet
        '''
        if obj.parent and not obj.parent.text_content:
            obj = self.get_parent(obj.parent)
        return obj

    def get_text_content(self, obj):
        return obj.text_content


class TweetSerializer(serializers.ModelSerializer):
    '''
            read only serializer
        Сериализатор получения твита\твитов
        Используется для получения [списка твитов\одного объекта твита]
    '''
    user = serializers.SerializerMethodField(read_only=True)
    parent = serializers.SerializerMethodField(read_only=True)
    likes = serializers.SerializerMethodField(read_only=True)
    date_created = serializers.DateTimeField(required=False, format='%H:%M %d.%m.%y')
    is_retweet = serializers.SerializerMethodField(read_only=True)
    retweet_with_comment = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Tweet
        fields = ['id', 'user', 'text_content', 'likes', 'date_created', 'is_retweet', 'retweet_with_comment', 'parent']
        extra_kwargs = {'text_content': {'required': True}}

    def get_user(self, obj):
        # Возвращаем информацио о пользователе
        return obj.user.username

    def get_parent(self, obj):
        '''
            obj - экземпляр модели Tweet
        '''
        if obj.parent and not obj.parent.text_content:
            obj = self.get_parent(obj.parent)
            return obj

        if not obj.is_retweet:
            return None
        return {
                    'id': obj.parent.id, 
                    'user': obj.parent.user.username,
                    'text_content': obj.parent.text_content, 
                    'likes': obj.parent.likes.count(), 
                    'is_retweet': obj.parent.is_retweet,
                    'retweet_with_comment': obj.parent.retweet_with_comment,
                    'date_created': obj.parent.date_by_format
                }

    def get_likes(self, obj):
        '''
            Метод возвращает общее количество лайков текущего твита
        '''
        return obj.likes.count()
    
    def get_is_retweet(self, obj):
        '''
            Если у твита есть поле parent, то это ретвит
        '''
        return obj.is_retweet

    def get_retweet_with_comment(self, obj):
        '''
            Если твит является ретвитом и у него есть текстовый контент, то это ретвит с комментарием
        '''
        return True if obj.is_retweet and obj.text_content else False

    def validate_text_content(self, value):
        if len(value) > settings.MAX_TWEET_LENGTH:
            raise serializers.ValidationError(LONG_TWEET_MESSAGE)
        return value


class TweetActionSerializer(serializers.Serializer):
    '''
        read only serializer
        Сериализатор обработки действий над твитами
    '''
    id = serializers.IntegerField() # Идентификатор твита
    action = serializers.CharField() # Действие над твитом, доступно 3 основных: like, unlike, retweet
    content = serializers.CharField(allow_blank=True, required=False) # контент твита. На случай, если action=retweet

    class Meta:
        extra_kwargs = {'id': {'required': True}}  # id - обязательный параметр
        extra_kwargs = {'action': {'required': True}}

    def validate_id(self, value):
        if value < 0:
            raise serializers.ValidationError(ACTION_ID_WAS_NEGATIVE_MESSAGE)
        return value
    
    def validate_action(self, value):
        if not isinstance(value, str): 
            raise serializers.ValidationError(WRONG_ACTION_FORMAT_MESSAGE)
        value = value.lower().strip()
        if value not in settings.TWEET_ACTION_OPTIONS:
            raise serializers.ValidationError(ACTION_OPTION_NOT_DEFINED_MESSAGE)
        return value

