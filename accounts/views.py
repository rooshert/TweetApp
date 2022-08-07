from django.shortcuts import render
from django.contrib.auth import login, logout, authenticate

from django.contrib.auth.forms import AuthenticationForm, UserCreationForm


def login_view(request, *args, **kwargs):
	form = AuthenticationForm(request, data=request.POST or None)
	form = LogUserForm(request.POST or None)

	if form.is_valid():
		username = form.cleaned_data.get('username')
		user = authenticate(username, password)


		user = form.get_user()
		login(request, user)
		return redirect("/")

	return render(request, "form.html", {})


def login_view(request, *args, **kwargs):
	if request.method == 'POST':
		logout(request)
		return redirect('/')

	return render(request, "accounts/logout.html")


def login_view(request, *args, **kwargs):
	form = UserCreationForm(request, data=request.POST or None)

	if form.is_valid():
		username = form.cleaned_data.get('username')
		user = authenticate(username, password)

	return render(request, "form.html", {form: form})