"""
Django settings for skyfall_backend project.
"""

from pathlib import Path
import os
from dotenv import load_dotenv
import dj_database_url # 🔥 Hakikisha umeinstall: pip install dj-database-url


# Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY', 'django-insecure-default-key-change-this')

# SECURITY WARNING: don't run with debug turned on in production!
#DEBUG = os.getenv('DEBUG', 'True') == 'True'

# 🔥 BADILISHA KUWA TRUE ILI UONE ERRORS KWENYE RENDER LOGS!
#DEBUG = False 

DEBUG = os.getenv('DEBUG', 'True').lower() == 'true'

#ALLOWED_HOSTS = ['localhost', '127.0.0.1']

ALLOWED_HOSTS = [
    'skyfall.co.tz',                    # Domain yako (bila www)
    'www.skyfall.co.tz',                # Domain yako (na www)
    'shop-online-r9z4.onrender.com',    # Backend yako ya Live!
    'shop-online-tan.vercel.app',       # Frontend yako ya Live!
    'localhost', 
    '127.0.0.1'
]


EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'  # 🔥 Inatumia SMTP halisi (Gmail)
EMAIL_HOST = os.getenv('EMAIL_HOST', 'smtp.gmail.com')
EMAIL_PORT = int(os.getenv('EMAIL_PORT', 587))
EMAIL_USE_TLS = os.getenv('EMAIL_USE_TLS', 'True') == 'True'
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.getenv('DEFAULT_FROM_EMAIL', 'noreply@skyfall.com')

# Application definition
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'rest_framework.authtoken',   # 🔥 ONGEZA HII HAPA! (Iko chini ya 'rest_framework')
    'rest_framework_simplejwt',
    'corsheaders',
    'django_filters',  
    'cloudinary',
     # 'cloudinary_storage', # 🔥 FUTE HII KABISA!



     'dj_rest_auth',
    'django.contrib.sites',
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google',

    

    'api',
   'users',
    'products',
    'orders',
  'django.contrib.postgres',  # 🔥 ONGEZA HII!

]


SITE_ID = 1


# ==================== DJ-REST-AUTH CONFIGURATION ====================
REST_AUTH = {
    'TOKEN_MODEL': None,
    'USE_JWT': True,
    'JWT_AUTH_COOKIE': 'access_token',
    'JWT_AUTH_REFRESH_COOKIE': 'refresh_token',
    'REGISTER_SERIALIZER': 'dj_rest_auth.registration.serializers.RegisterSerializer',  # ✅ HII SAHIHI
}

AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
    'allauth.account.auth_backends.AuthenticationBackend',
]


AUTH_USER_MODEL = 'users.User'  # Sio 'products.Profile'!


MIDDLEWARE = [
    'skyfall_backend.middleware.RemoveServerHeaderMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', # 🔥 ONGEZA HII! (Inapaswa kuwa chini ya SecurityMiddleware)
    'corsheaders.middleware.CorsMiddleware',  # Must be at the top!
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
     'allauth.account.middleware.AccountMiddleware',

]

ROOT_URLCONF = 'skyfall_backend.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
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

WSGI_APPLICATION = 'skyfall_backend.wsgi.application'

DATABASES = {
    'default': dj_database_url.config(default=os.getenv('DATABASE_URL'))
}

# ==================== AUTHENTICATION ====================
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

# ==================== INTERNATIONALIZATION ====================
LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_TZ = True

# ==================== STATIC & MEDIA FILES ====================
STATIC_URL = 'static/'
STATIC_ROOT = BASE_DIR / 'staticfiles'

MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# ==================== CORS CONFIGURATION ====================
CORS_ALLOWED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://shop-online-tan.vercel.app',
    'https://skyfall.co.tz',           
    'https://www.skyfall.co.tz',  
    'https://skyfall-admin-ten.vercel.app',
   
]

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOW_CREDENTIALS = True

# ==================== CSRF TRUSTED ORIGINS (ONGEZA HII!) ====================
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://shop-online-tan.vercel.app',
]

# ==================== SOCIALACCOUNT PROVIDERS ====================
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': os.getenv('GOOGLE_CLIENT_ID'),  # 🔥 Soma kutoka .env
            'secret': os.getenv('GOOGLE_CLIENT_SECRET'),  # 🔥 Soma kutoka .env
            'key': ''
        }
    }
}

# ==================== REST FRAMEWORK CONFIGURATION ====================

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticatedOrReadOnly',
    ),
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '1000/hour',     # ✅ Mtumiaji asiyeingia: 1000 kwa saa
        'user': '5000/hour'      # ✅ Mtumiaji aliyeingia: 5000 kwa saa
    }
}

# ==================== JWT CONFIGURATION ====================
from datetime import timedelta

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(days=7),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=30),
    'ROTATE_REFRESH_TOKENS': False,
    'BLACKLIST_AFTER_ROTATION': True,
    'UPDATE_LAST_LOGIN': False,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': os.getenv('JWT_SECRET', SECRET_KEY),
    'VERIFYING_KEY': None,
    'AUDIENCE': None,
    'ISSUER': None,
    'AUTH_HEADER_TYPES': ('Bearer',),
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'USER_AUTHENTICATION_RULE': 'rest_framework_simplejwt.authentication.default_user_authentication_rule',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
    'JTI_CLAIM': 'jti',
}

# ==================== CUSTOM USER MODEL ====================
#AUTH_USER_MODEL = 'products.Profile'

# ==================== CLOUDINARY CONFIGURATION ====================
CLOUDINARY_STORAGE = {
    'CLOUD_NAME': os.getenv('CLOUDINARY_CLOUD_NAME'),
    'API_KEY': os.getenv('CLOUDINARY_API_KEY'),
    'API_SECRET': os.getenv('CLOUDINARY_API_SECRET'),
}


# ==================== SECURITY HEADERS ====================
# Zuia MIME sniffing
SECURE_CONTENT_TYPE_NOSNIFF = True

# Zuia kufichua taarifa za URL kwenye browser nyingine
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'

# Zuia Clickjacking
X_FRAME_OPTIONS = 'DENY'

if DEBUG:
    SESSION_COOKIE_SECURE = False   
    CSRF_COOKIE_SECURE = False     
else:
    SESSION_COOKIE_SECURE = True    
    CSRF_COOKIE_SECURE = True       

# ============================================================
# 🔐 SKYFALL SECURITY SETTINGS
# LOCAL DEVELOPMENT + PRODUCTION (RENDER)
# ============================================================

# 1. HTTPS AND HSTS CONFIGURATION
# ============================================================

# Render uses HTTPS through its reverse proxy
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

if not DEBUG:

    # Force HTTPS in production only
    SECURE_SSL_REDIRECT = True

    # HSTS - Force browser to use HTTPS
    SECURE_HSTS_SECONDS = 31536000  # 1 Year

    SECURE_HSTS_INCLUDE_SUBDOMAINS = True

    SECURE_HSTS_PRELOAD = True

else:

    # Local development - Allow HTTP
    SECURE_SSL_REDIRECT = False

    SECURE_HSTS_SECONDS = 0

    SECURE_HSTS_INCLUDE_SUBDOMAINS = False

    SECURE_HSTS_PRELOAD = False


# 2. SECURE COOKIE CONFIGURATION
# ============================================================

SESSION_COOKIE_HTTPONLY = True

CSRF_COOKIE_HTTPONLY = True

SESSION_COOKIE_SAMESITE = 'Lax'

CSRF_COOKIE_SAMESITE = 'Lax'


# Secure cookies only in production
if not DEBUG:

    SESSION_COOKIE_SECURE = True

    CSRF_COOKIE_SECURE = True

else:

    SESSION_COOKIE_SECURE = False

    CSRF_COOKIE_SECURE = False


# 3. SECURITY HEADERS
# ============================================================

# Prevent MIME type sniffing
SECURE_CONTENT_TYPE_NOSNIFF = True

# Prevent clickjacking
X_FRAME_OPTIONS = 'DENY'

# Referrer policy
SECURE_REFERRER_POLICY = 'strict-origin-when-cross-origin'


# 4. DIRECTORY LISTING PROTECTION
# ============================================================

# Django does not enable directory listing by default.
# No additional setting is required here.


# 5. SECURITY LOGGING
# ============================================================

LOGGING = {

    'version': 1,

    'disable_existing_loggers': False,

    'formatters': {

        'verbose': {
            'format': '{levelname} {asctime} {name} {message}',
            'style': '{',
        },

    },

    'handlers': {

        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },

    },

    'loggers': {

        'django.security': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': True,
        },

        'django.request': {
            'handlers': ['console'],
            'level': 'WARNING',
            'propagate': True,
        },

    },

}