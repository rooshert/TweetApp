from django.conf import settings
from django.db import models

USER = settings.AUTH_USER_MODEL

class Profile(models.Model):
	user = models.OneToOneField(USER, on_delete=models.CASCADE)
	location = models.CharField(max_length=100, null=True, blank=True)	
	bio = models.TextField(blank=True, null=True)
