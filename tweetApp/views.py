from django.shortcuts import render


def home_view(request, *args, **kwargs):
    # return render(request, "pages/feed.html")
    return render(request, "pages/home.html")

def tweets_list_view(request, *args, **kwargs):
    return render(request, "tweets/list.html")

def tweets_detail_view(request, tweet_id, *args, **kwargs):
    return render(request, "tweets/detail.html", context={"tweet_id": tweet_id})

def tweet_userprofile_view(request, username, *args, **kwargs):
    return render(request, 'tweets/profile.html', context={'username': username})
