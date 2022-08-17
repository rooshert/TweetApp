from django.db import models
from django.contrib.auth import get_user_model

from django.db.models.signals import post_save 

USER = get_user_model()

class Following2FollowersRelation(models.Model):
	following = models.ForeignKey(
		'Profile', 
		on_delete=models.CASCADE, 
		related_name='following'
	)  # Те кого ты отслеживаешь
	followers = models.ForeignKey(
		'Profile', 
		on_delete=models.CASCADE, 
		related_name='followers'
	)  # Тот кто тебя отслеживает
	follow_reason = models.TextField(null=True, blank=True)
	follow_date = models.DateTimeField(auto_now_add=True)


class Profile(models.Model):
	user = models.OneToOneField(USER, on_delete=models.CASCADE)
	location = models.CharField(max_length=100, null=True, blank=True)	
	bio = models.TextField(blank=True, null=True)
	follow_to = models.ManyToManyField(
		to='self',
		through=Following2FollowersRelation,
		symmetrical=False, 
		blank=True
	)
	timestamp = models.DateTimeField(auto_now_add=True)
	updated = models.DateTimeField(auto_now=True)


def user_model_save_rcv(sender, instance, created, *args, **kwargs):
	'''
		Обработчик post_save сигнала модели User:
			- Необходим для автоматического создания профиля пользователя;
			- Запускается после отработки метода save() модели User;
			- Создает запись в модели Profile, если была СОЗДАНА новая запись модели User
	'''
	if created:
		Profile.objects.get_or_create(user=instance)

post_save.connect(user_model_save_rcv, sender=USER)