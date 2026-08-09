from rest_framework import viewsets, filters, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.pagination import LimitOffsetPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth import authenticate, update_session_auth_hash
from django.core.mail import send_mail  # 🔥 ONGEZA HII
from django.conf import settings  # 🔥 ONGEZA HII
import random  # 🔥 ONGEZA HII
from django.utils import timezone  # 🔥 ONGEZA HII
from datetime import timedelta  # 🔥 ONGEZA HII



# 🔥 MODELS IMPORTS:
from products.models import (
    Category, ProductVariation, SubCategory, ProductsEngine, LeafCategory, Advertisement, 
    StoreEngine, ProductMedia, Message, ShippingMethod, Brand, Lead, Order, OrderItem,  OTPModel  
)

# 🔥 ONGEZA HII IMPORT MUHIMU KABISA (Inaingiza ViewSet kutoka products.views):
from products.views import ProductVariationViewSet
from products.serializers import ProductsEngineSerializer
from products.serializers import StoreEngineSerializer




# 🔥 SERIALIZERS IMPORTS:
from .serializers import (
    CategorySerializer, SubCategorySerializer,
    LeafCategorySerializer, AdvertisementSerializer,
    ProductMediaSerializer, MessageSerializer, ProfileSerializer,
    ShippingMethodSerializer, BrandSerializer, LeadSerializer, OrderSerializer, OrderItemSerializer 
)

User = get_user_model()

# ==========================================
# 1. VIEWS ZA KATEGORIA (Hazibadiliki)
# ==========================================
class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [AllowAny]

    # 🔥 ONGEZA HII METHOD (Inachuja kwa category AU category_id)!
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # 1. Angalia kama Frontend imetuma 'category_id' (ndiyo inayotumika sasa)
        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(category=category_id)
            
        # 2. Angalia kama Frontend imetuma 'category' (kwa usalama wa baadae)
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
            
        return queryset

class LeafCategoryViewSet(viewsets.ModelViewSet):
    queryset = LeafCategory.objects.all()
    serializer_class = LeafCategorySerializer
    permission_classes = [AllowAny]

    # 🔥 BADILISHA HAPA: Inachuja kwa kutumia 'sub_category' AU 'sub_category_id'!
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Angalia kama Frontend imetuma 'sub_category'
        sub_cat = self.request.query_params.get('sub_category')
        if sub_cat:
            queryset = queryset.filter(sub_category=sub_cat)
            
        # Angalia kama Frontend imetuma 'sub_category_id'
        sub_cat_id = self.request.query_params.get('sub_category_id')
        if sub_cat_id:
            queryset = queryset.filter(sub_category=sub_cat_id)
            
        return queryset

    # 🔥 ONGEZA HII METHOD ILI KUONA ID INAYOFIKA KUTOKA FRONTEND
    def retrieve(self, request, *args, **kwargs):
        leaf_id = kwargs.get('pk')
        print(f"🔍 [BACKEND DEBUG] LeafCategory retrieve called with ID: {leaf_id}")
        
        try:
            # Jaribu kupata leaf kwa ID
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            print(f"✅ [BACKEND] Leaf found: {instance.name} (ID: {instance.id})")
            return Response(serializer.data)
        except Exception as e:
            print(f"❌ [BACKEND ERROR] Failed to retrieve Leaf with ID {leaf_id}: {e}")
            # Ruhusu Django kushughulikia error (kama 404)
            raise e

class ProductsEngineViewSet(viewsets.ModelViewSet):
    queryset = ProductsEngine.objects.all()
    serializer_class = ProductsEngineSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [JWTAuthentication]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['store_id', 'leaf_category', 'parent_category', 'is_approved', 'sub_category']  # ✅ Tumia jina la field!    ordering_fields = ['views', 'price', 'created_at']
    pagination_class = LimitOffsetPagination

    def perform_create(self, serializer):
        serializer.save(
            user=self.request.user.profile,
            store_id=self.request.data.get('store_id')
        )

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        product = self.get_object()
        product.views += 1
        product.save()
        return Response({'status': 'view incremented'})

    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        product = self.get_object()
        rating = request.data.get('rating')
        if rating:
            current_total = product.total_reviews or 0
            current_avg = product.average_rating or 0
            new_total = current_total + 1
            new_avg = ((current_avg * current_total) + float(rating)) / new_total
            product.total_reviews = new_total
            product.average_rating = new_avg
            product.save()
            return Response({'status': 'rated', 'new_average': new_avg}, status=status.HTTP_200_OK)
        return Response({'error': 'Rating not provided'}, status=status.HTTP_400_BAD_REQUEST)

class AdvertisementViewSet(viewsets.ModelViewSet):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['store_id', 'status', 'ad_type']

    def perform_create(self, serializer):
        print("🔍 [DEBUG] Saving advertisement...")
        print(f"  User: {self.request.user}")
        print(f"  Profile: {self.request.user.profile}")
        try:
            serializer.save(user=self.request.user.profile)
            print("✅ [DEBUG] Saved successfully!")
        except Exception as e:
            print(f"❌ [DEBUG] Error: {e}")
            raise e

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Advertisement.objects.all()
        return Advertisement.objects.filter(user=user.profile)

class StoreEngineViewSet(viewsets.ModelViewSet):
    queryset = StoreEngine.objects.all()
    serializer_class = StoreEngineSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [JWTAuthentication]
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['owner']

    def get_object(self):
        pk = self.kwargs.get('pk')
        if pk:
            pk = pk.replace('-', '')
        return StoreEngine.objects.get(id=pk)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

    # ✅ ONGEZA GET_QUERYSET HAPA (Nje ya perform_create, kwenye level ya class)!
    def get_queryset(self):
        # Ruhusu wageni waone maduka yote
        if self.action in ['list', 'retrieve']:
            return StoreEngine.objects.all()
        
        # Kwa kuunda/kuhariri - zuia kwa mmiliki tu
        user = self.request.user
        if user.is_authenticated:
            return StoreEngine.objects.filter(owner__user=user)
        return StoreEngine.objects.none()  

class ProductMediaViewSet(viewsets.ModelViewSet):
    queryset = ProductMedia.objects.all()
    serializer_class = ProductMediaSerializer
    permission_classes = [AllowAny] # Unaweza kubadilisha kuwa IsAuthenticatedOrReadOnly kama unataka

    # 🔥 MUHIMU SANA: ONGEZA HII METHOD HAPA (Sio kwenye products/views.py, bali HAPA!)
    def get_queryset(self):
        queryset = super().get_queryset()
        product_id = self.request.query_params.get('product_id')
        if product_id:
            # Futa hyphens kama ni UUID string (kwa usalama)
            clean_id = str(product_id).replace('-', '')
            queryset = queryset.filter(product=clean_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save()

class MessageViewSet(viewsets.ModelViewSet):
    queryset = Message.objects.all()
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

# ==========================================
# 2. 🔥 VIEWS ZA SHIPPING, BRAND, NA LEAD
# ==========================================
class ShippingMethodViewSet(viewsets.ModelViewSet):
    queryset = ShippingMethod.objects.all()
    serializer_class = ShippingMethodSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        store_id = self.request.query_params.get('store_id')
        if store_id:
            return self.queryset.filter(store_id=store_id)
        return self.queryset

class BrandViewSet(viewsets.ModelViewSet):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = [AllowAny]

class LeadViewSet(viewsets.ModelViewSet):
    queryset = Lead.objects.all()
    serializer_class = LeadSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        store_id = self.request.query_params.get('store_id')
        if store_id:
            return self.queryset.filter(store_id=store_id)
        return self.queryset
# ==========================================
# 3. VIEWS ZA REGISTRATION NA PROFILE
# ==========================================
class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        full_name = request.data.get('full_name')

        if not email or not password:
            return Response({'error': 'Email na Password zinahitajika'}, status=400)

        if User.objects.filter(email=email).exists():
            return Response({'email': ['Barua pepe hii tayari imesajiliwa.']}, status=400)

        from rest_framework_simplejwt.tokens import RefreshToken
        from products.models import Profile
        
        user = User.objects.create_user(username=email, email=email, password=password)
        Profile.objects.create(user=user, full_name=full_name, role='buyer')

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token)
        }, status=201)

class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from products.models import Profile
        
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            profile = Profile.objects.create(
                user=request.user,
                full_name=request.user.username or request.user.email,
                role='buyer'
            )
        
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)

    # ==========================================
    # 4. 🔥 VIEWS ZA MIPANGILIO (ZIWE NJE YA ProfileView!)
    # ==========================================
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old = request.data.get('old_password')
        new = request.data.get('new_password')
        
        if not user.check_password(old):
            return Response({'error': 'Password ya sasa si sahihi'}, status=400)
        
        user.set_password(new)
        user.save()
        update_session_auth_hash(request, user)
        return Response({'status': 'password_updated'}, status=200)

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({'status': 'account_deleted'}, status=200)

class ChangeEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        new_email = request.data.get('new_email')
        if not new_email:
            return Response({'error': 'Tafadhali weka email mpya'}, status=400)
        
        user = request.user
        user.email = new_email
        user.save()
        return Response({'status': 'email_updated'}, status=200)

class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Tafadhali weka email'}, status=400)
        
        from django.core.mail import send_mail
        # Hapa unatuma email ya reset (Logic inategemea mfumo wako)
        # Mfano rahisi:
        # send_mail('Reset Password', 'Link yako...', 'from@example.com', [email])
        
        return Response({'status': 'reset_link_sent'}, status=200)
    


    # ==========================================
# 4. 🔥 VIEWS ZA MIPANGILIO
# ==========================================
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        old = request.data.get('old_password')
        new = request.data.get('new_password')
        
        if not user.check_password(old):
            return Response({'error': 'Password ya sasa si sahihi'}, status=400)
        
        user.set_password(new)
        user.save()
        update_session_auth_hash(request, user)
        return Response({'status': 'password_updated'}, status=200)

class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({'status': 'account_deleted'}, status=200)

class ChangeEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        new_email = request.data.get('new_email')
        if not new_email:
            return Response({'error': 'Tafadhali weka email mpya'}, status=400)
        
        user = request.user
        user.email = new_email
        user.save()
        return Response({'status': 'email_updated'}, status=200)

class PasswordResetView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Tafadhali weka email'}, status=400)
        
        # Hapa unatuma email ya reset (Logic inategemea mfumo wako)
        return Response({'status': 'reset_link_sent'}, status=200)

# ==========================================
# 5. 🔥 PASSWORD RESET REQUEST & VERIFY VIEWS (MPYA)
# ==========================================
class PasswordResetRequestView(APIView):
    """
    Endpoint ya kutuma OTP kwa email ili kubadili password
    POST: /api/password-reset/request/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        
        if not email:
            return Response(
                {'detail': 'Email is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            # Kwa usalama, tusimwambie mtumiaji kama email ipo au la
            return Response(
                {'detail': 'If this email exists, an OTP has been sent'}, 
                status=status.HTTP_200_OK
            )
        
        # Generate OTP (6-digit)
        otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        
        # Save OTP kwenye database
        OTPModel.objects.create(
            email=email,
            otp=otp,
            created_at=timezone.now()
        )
        
        # Tuma OTP kwa email
        try:
            send_mail(
                subject='Password Reset OTP',
                message=f'Your OTP for password reset is: {otp}\n\nThis OTP will expire in 5 minutes.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
        except Exception as e:
            return Response(
                {'detail': f'Failed to send email: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
        
        return Response(
            {'detail': 'OTP sent to your email successfully'}, 
            status=status.HTTP_200_OK
        )


class PasswordResetVerifyView(APIView):
    """
    Endpoint ya kuthibitisha OTP na kubadili password
    POST: /api/password-reset/verify/
    """
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')
        
        # Check required fields
        if not all([email, otp, new_password]):
            return Response(
                {'detail': 'Email, OTP, and new password are required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Verify OTP
        try:
            otp_record = OTPModel.objects.filter(
                email=email,
                otp=otp,
                is_used=False
            ).latest('created_at')
        except OTPModel.DoesNotExist:
            return Response(
                {'detail': 'Invalid OTP'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check if OTP is expired (5 minutes)
        if otp_record.is_expired():
            return Response(
                {'detail': 'OTP has expired. Please request a new one.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Check password strength
        if len(new_password) < 8:
            return Response(
                {'detail': 'Password must be at least 8 characters long'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Reset password
        try:
            user = User.objects.get(email=email)
            user.set_password(new_password)
            user.save()
            
            # Mark OTP as used
            otp_record.is_used = True
            otp_record.save()
            
            return Response(
                {'detail': 'Password reset successfully'}, 
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {'detail': 'User not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
    
       # ==========================================
       # 5. 🔥 VIEWS ZA ORDERS NA ORDER ITEMS
       # ==========================================
class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]

    def perform_create(self, serializer):
        # Hakikisha customer ni profile ya mtumiaji aliyeingia
        serializer.save(customer=self.request.user.profile)


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [IsAuthenticated]
    authentication_classes = [JWTAuthentication]
