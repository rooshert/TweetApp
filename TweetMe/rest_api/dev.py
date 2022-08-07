import ipdb

from django.contrib.auth import get_user_model
from rest_framework import authentication as auth 


User = get_user_model()

class DevAuthentication(auth.BasicAuthentication):

    def authenticate(self, request):
        qs = User.objects.all()
        user = qs.order_by('?').first()  # Групируем пользователей по рандомному значению (?).
        return (user, None)
        