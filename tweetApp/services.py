from collections import namedtuple
import ipdb


class TweetCore:
    
    def __init__(self, model):
        from django.db.models.base import ModelBase
        if not isinstance(model, ModelBase):
            raise TypeError('model argument is not a django model')

        self.tweet_model = model


class TweetsCollection(TweetCore):
    
    def __init__(self, model):
        super().__init__(model)
    
    def _get_file_url(self, tweet):
        try:
            f_url = tweet.file_content.url
        except ValueError:
            f_url = None
        
        return f_url

    def get_tweet_by_format(self, tweet):
        import random
        file_url = self._get_file_url(tweet)
        dc = tweet.date_created.strftime('%H:%M %d.%m.%y')
        return {
                    'id': tweet.id, 
                    'content': tweet.text_content, 
                    'file': file_url,
                    'likes': random.randint(1, 10_000_000),
                    'date_created': dc
                }

    def get_tweets_list(self):
        import random
        tweets = {'data': []}

        for t in self.tweet_model.objects.all():
            file_url = self._get_file_url(t)
            dc = t.date_created.strftime('%H:%M %d.%m.%y')
            tweets['data'].append(
                    {
                        'id': t.id,
                        'content': t.text_content,
                        'file': file_url,
                        'likes': random.randint(1, 10_000_000),
                        'date_created': dc
                    }
                )
        return tweets


class TweetCreator(TweetCore):
    
    def __init__(self, model):
        super().__init__(model)

    def create_tweet(self, user, data, form):
        t_create_resp = namedtuple('tweet_create_response', 
                ['tweet_obj', 'form', 'is_valid', 'errors']
            )
        t_form = form({'text_content': data['text_content']})
        if t_form.is_valid():
            t_obj = t_form.save(commit=False)
            t_obj.user = user
            t_obj.save()
            return t_create_resp(
                    tweet_obj=t_obj,
                    form=t_form,
                    is_valid=True,
                    errors=None
                )
        
        return t_create_resp(
                tweet_obj=None,
                form=t_form,
                is_valid=False, 
                errors=t_form.errors
            )

