import ipdb
from django.contrib.auth import get_user_model
from django.urls import reverse
from . import urls as u

from .models import Tweet

from django.test import TestCase
from rest_framework.test import APIClient

User = get_user_model()

class TweetTestCase(TestCase):

    @classmethod
    def setUpClass(cls):
        # SET HERE PATH TO ENDPOINTS
        super().setUpClass()
        path_pattern = '%s:%s'
        cls.TWEET_LIST_PATH = reverse(path_pattern % (u.app_name, u.TWEET_LIST_NAME))
        cls.TWEET_DETAIL_PATH = path_pattern % (u.app_name, u.TWEET_DETAIL_NAME)
        cls.TWEET_CREATE_PATH = reverse(path_pattern % (u.app_name, u.TWEET_CREATE_NAME))
        cls.TWEET_DELETE_PATH = reverse(path_pattern % (u.app_name, u.TWEET_DELETE_NAME))
        cls.TWEET_ACTION_PATH = reverse(path_pattern % (u.app_name, u.TWEET_ACTION_NAME))

    def setUp(self):
        '''
            1. Создаём тестового пользователя
            2. Создаём тестовые твиты
        '''
        # SET HERE TOTAL TEST TWEET OBJECTS
        self.TESTED_TWEET_OBJECTS = 5

        self.user = User.objects.create_user(username='abc', password='12345')
        for i in range(self.TESTED_TWEET_OBJECTS):
            Tweet.objects.create(text_content='test %s' % i, user=self.user)
        self.total_tweets = Tweet.objects.count()

    def get_client(self, username=None):
        '''
            1. Получаем клиента, от имени которого будем совершать запросы к API endpoints.
            2. Логиним пользователя.
        '''
        c = APIClient()
        if username:
            c.login(username=username, password='12345')
            return c

        c.login(username=self.user.username, password='12345')
        return c

    def test_tweet_created(self):
        '''
            Проверяем логику создания твита
        '''
        tweet = Tweet.objects.last()
        self.assertEqual(tweet.id, 1)
        self.assertEqual(tweet.user, self.user)

    def test_tweet_list(self):
        '''
            Обращаемся к ресурсу по URL, который должен вернуть статус 200 и список твитов
        '''
        client = self.get_client()
        response = client.get(self.TWEET_LIST_PATH)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.json()), self.TESTED_TWEET_OBJECTS)

    def test_tweet_detail(self):
        '''
            Проверка логики получения твита по id.
        '''
        client = self.get_client()
        url = reverse(self.TWEET_DETAIL_PATH, kwargs={'tweet_id': 1})
        response = client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('id'), 1)

    def test_tweet_delete(self):
        '''
            Проверка логики удаления твита по id.
        '''
        client = self.get_client()
        response = client.post(self.TWEET_DELETE_PATH, {'id': 1})
        self.assertEqual(response.status_code, 200)

    def test_tweet_double_delete_one_object(self):
        '''
            Удаляем один объект твита 2 раза
                1. Первый раз получаем статус 200 с сообщением об удалении.
                2. Вротой раз получаем ошибку 404 (объект твита не найден)
        '''
        client = self.get_client()
        response = client.post(self.TWEET_DELETE_PATH, {'id': 1})
        self.assertEqual(response.status_code, 200)
        
        response = client.post(self.TWEET_DELETE_PATH, {'id': 1})
        self.assertEqual(response.status_code, 404)
    
    def test_tweet_cross_user_delete(self):
        u1 = User.objects.create_user(username='abc1', password='12345')
        u2 = User.objects.create_user(username='abc2', password='12345')

        t = Tweet.objects.create(text_content='test', user=u1)  # Пользователь u1 создал твит
            
        client = self.get_client(username=u2.username)
        response = client.post(self.TWEET_DELETE_PATH, {'id': t.id})  # Пользователь u2 пытаетсья удалить твит
        self.assertEqual(response.status_code, 400)

    def test_action_like(self):
        '''
            Проверка логики совершения действия лайка на функцианальную верность.
        '''
        client = self.get_client()
        response = client.post(self.TWEET_ACTION_PATH, {'id': 1, 'action': 'like'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('likes'), 1)    
    
    def test_action_unlike(self):
        '''
            Проверка логики совершения действия удаления лайка на функцианальную верность.
        '''
        client = self.get_client()
        response = client.post(self.TWEET_ACTION_PATH, {'id': 2, 'action': 'like'})  # добавляем лайк
        self.assertEqual(response.status_code, 200)
    
        response = client.post(self.TWEET_ACTION_PATH, {'id': 2, 'action': 'unlike'})  # убираем лайк
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json().get('likes'), 0)

    def test_action_retweet(self):
        '''
            Проверка логики совершения действия ретвита на функцианальную верность.
        '''
        client = self.get_client()
        response = client.post(self.TWEET_ACTION_PATH, {'id': 3, 'action': 'retweet'})  # ретвитим твит с id=3
        self.assertEqual(response.status_code, 201)
        self.assertTrue(response.json().get('is_retweet'), True)
        self.assertEqual(self.total_tweets + 1, response.json().get('id'))

    def test_tweet_create(self):
        '''
            Проверка логики создания твита на функцианальную верность.
        '''
        data = {'text_content': 'this is test tweet'}
        client = self.get_client()
        response = client.post(self.TWEET_CREATE_PATH, data)
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.total_tweets + 1, response.json().get('id'))

