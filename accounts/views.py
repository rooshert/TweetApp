from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm

import ipdb

def register_view(request, *args, **kwargs):
	form = UserCreationForm(request.POST or None)
	if form.is_valid():
		user = form.save(commit=True)
		password = form.cleaned_data.get('password1')
		user.set_password(password)
		login(request, user)
		return redirect("/")
	context = {
		'form': form, 
		'btn_label': 'Registration',
		'title': 'Registration'
	}
	return render(request, "accounts/auth.html", context)


def login_view(request, *args, **kwargs):
	form = AuthenticationForm(request, data=request.POST or None)
	if form.is_valid():
		user = form.get_user()
		login(request, user)
		return redirect("/")
	context = {
		'form': form, 
		'btn_label': 'Login',
		'title': 'Login'
	}
	return render(request, "accounts/auth.html", context)


def logout_view(request, *args, **kwargs):
	if request.method == 'POST':
		logout(request)
		return redirect('/')
	context = {
		'form': None, 
		'description': 'Are you sure you want to log out of your account?', 
		'btn_label': 'Confirm',
		'title': 'Logout'
	}
	return render(request, "accounts/auth.html", context)
