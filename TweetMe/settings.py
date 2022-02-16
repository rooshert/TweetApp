import os
from pathlib import Path

from .tweet_settings import *

BASE_DIR = Path(__file__).resolve().parent.parent  # поднимаемся на уровень директории проекта

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-1$355$-r!vgtey#(g0j8c6eqo+h4d*ht=p5l_5pu6$sy7ztc=h'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['127.0.0.1', 'localhost', ]

LOGIN_URL = '/login-page'

INSTALLED_APPS = [
    # django default libs
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # third-party libs
    'rest_framework',
    'corsheaders',
    
    # custom libs
    'tweetApp'
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',

    # CORS middleware
    'corsheaders.middleware.CorsMiddleware',

    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'TweetMe.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [os.path.join(BASE_DIR, 'templates'), ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'TweetMe.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_L10N = True

USE_TZ = True


# STATIC FILES SETTINGS
STATIC_URL = '/static/'

REACT_STATIC = str(BASE_DIR.joinpath('tweetapp-frontend').joinpath('build').joinpath('static'))  # path to react static files

STATICFILES_DIRS = (
	REACT_STATIC,
)

STATIC_ROOT = os.path.join(BASE_DIR, 'static-root')

# MEDIA SETTINGS
MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')


# Default primary key field type
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# CORS SETTINGS
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://127.0.0.1:3000',
    'http://192.168.0.103:3000'
]

CORS_URLS_REGEX = r'^/api/.*$'


# REST FRAMEWORK SETTINGS

DEFAULT_RENDERER_CLASSES = [
    'rest_framework.renderers.JSONRenderer',
]

DEFAULT_AUTHENTICATION_CALSSES = [
    'rest_framework.authentication.SessionAuthentication',
]

if DEBUG:
    DEFAULT_RENDERER_CLASSES += ['rest_framework.renderers.BrowsableAPIRenderer']
    DEFAULT_AUTHENTICATION_CALSSES += ['TweetMe.rest_api.dev.DevAuthentication']  # Пример пордключения кастомной аутентификации

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': DEFAULT_AUTHENTICATION_CALSSES,
    'DEFAULT_RENDERER_CLASSES': DEFAULT_RENDERER_CLASSES
}

