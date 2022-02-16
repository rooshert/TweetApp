from django.contrib import admin
from .models import Tweet, TweetLike
from django.contrib.sessions.models import Session


class TweetLikeAdmin(admin.TabularInline):
    model = TweetLike


class TweetAdmin(admin.ModelAdmin):
    inlines = [TweetLikeAdmin]
    list_display = ['text_content', 'user']
    search_fields = ['text_content', 'user__username', 'user__email']

    class Meta:
        model = Tweet

admin.site.register(Tweet, TweetAdmin)
admin.site.register(Session)

