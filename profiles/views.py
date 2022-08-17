from django.shortcuts import render, redirect
from django.http import Http404
from .models import Profile
from .forms import ProfileForm

import ipdb

def profile_update_view(request, *args, **kwargs):
	ipdb.set_trace()
	user = request.user
	if not user.is_authenticated:
		return redirect('/account/login?next=/profile/update')
	profile = user.profile
	user_data = {
		'username': user.username,
		'first_name': user.first_name,
		'last_name': user.last_name,
		'email': user.email
	}
	form = ProfileForm(
		request.POST or None, 
		instance=profile,
		initial=user_data
	)
	if form.is_valid():
		profile = form.save(commit=False)
		f_name = form.cleaned_data.get('first_name')
		l_name = form.cleaned_data.get('last_name')
		email = form.cleaned_data.get('email')
		user.first_name = f_name
		user.last_name = l_name
		user.email = email
		user.save()
		profile.save()
		
	context = {
		'form': form,
		'btn_label': 'Save',
		'title': 'update profile'
	}
	return render(request, 'profiles/form.html', context)


def profile_detail_view(request, username, *args, **kwargs):
	ipdb.set_trace()
	qs = Profile.objects.filter(user__username=username)
	if not qs.exists():
		raise Http404('profile is not exists!')
	profile_obj = qs.first()
	context = {
		'username': username,
		'profile': profile_obj
	}
	return render(request, 'profiles/detail.html', context)
