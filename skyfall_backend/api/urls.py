from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from api.views import (
    CategoryViewSet, OrderItemViewSet, SubCategoryViewSet, ProductsEngineViewSet,
    LeafCategoryViewSet, AdvertisementViewSet,
    StoreEngineViewSet, ProductMediaViewSet, MessageViewSet,
    RegisterView, ProfileView,
    ShippingMethodViewSet, BrandViewSet, LeadViewSet,
    ProductVariationViewSet, 
    # 🔥 ONGEZA HIZI ZOTE! (Zilizokosekana)
    ChangePasswordView, DeleteAccountView,
    ChangeEmailView, PasswordResetView,
   OrderViewSet

)

router = DefaultRouter()
router.register(r'categories', CategoryViewSet)
router.register(r'subcategories', SubCategoryViewSet)
router.register(r'products', ProductsEngineViewSet)
router.register(r'leaf-categories', LeafCategoryViewSet)
router.register(r'advertisements', AdvertisementViewSet)
router.register(r'stores', StoreEngineViewSet)
router.register(r'product-media', ProductMediaViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'shipping-methods', ShippingMethodViewSet)
router.register(r'brands', BrandViewSet)
router.register(r'leads', LeadViewSet)
router.register(r'product-variations', ProductVariationViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    # 🔥 MIPANGILIO YA AKIUNTI:
    path('change-email/', ChangeEmailView.as_view(), name='change_email'),
    path('password-reset/', PasswordResetView.as_view(), name='password_reset'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('delete-account/', DeleteAccountView.as_view(), name='delete_account'),
]

from django.conf import settings
from django.conf.urls.static import static
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)