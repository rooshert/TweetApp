from django.shortcuts import render


def profile_detail_view(request, *args, **kwargs): 
	return render(request, 'profiles/detail.html', {})
	