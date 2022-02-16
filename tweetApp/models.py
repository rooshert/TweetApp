from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class TweetLike(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    tweet = models.ForeignKey("Tweet", on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return 'user: %s; tweet: %s' % (self.user.id, self.tweet.id)

class Tweet(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(
            User,
            on_delete=models.CASCADE,
            related_name='tweets',
            related_query_name='tweets_query')
    likes = models.ManyToManyField(
            User, 
            related_name='likes',
            related_query_name='likes_query',
            through=TweetLike)
    parent = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL) # Retweet field
    text_content = models.TextField(blank=True, null=True)
    file_content = models.FileField(upload_to='files/', blank=True, null=True)
    date_created = models.DateTimeField(auto_now_add=True)
    date_updated = models.DateTimeField(auto_now=True, null=True)

    class Meta: 
        ordering = ['-date_created']

    @property
    def date_by_format(self):
        return self.date_created.strftime('%H:%M %d.%m.%y')

    @property
    def is_retweet(self):
        '''
            Проверяем является ли текущий твит ретвитом
        '''
        return self.parent != None

    @property
    def retweet_with_comment(self):
        '''
            Если твит является ретвитом и у него есть текстовый контент, то это ретвит с комментарием
        '''
        return True if self.is_retweet and self.text_content else False

    @property
    def retweet_info(self):
        ...

    def __str__(self):
        return "<id: %s; date: %s>" % (self.id, self.date_created.strftime('%Y-%m-%d'))

