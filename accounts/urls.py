from django.urls import path, include

from .views import ( 
    register_view, 
    login_view, 
    logout_view
)

app_name = 'accountsApp'
urlpatterns = [
    path('register/', register_view, name='register_view'),
    path('login/', login_view, name='login_view'),
    path('logout/', logout_view, name='logout_view'),
]
