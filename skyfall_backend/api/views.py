from rest_framework import viewsets, filters, mixins, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly, IsAdminUser
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
from products.models import OTPModel, Profile
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser
import cloudinary.uploader


# Juu ya file
import google.auth
import google.auth.transport.requests
import google.oauth2.id_token





# 🔥 MODELS IMPORTS:
from products.models import (
    Category, ProductVariation, SubCategory, ProductsEngine, LeafCategory, Advertisement, 
    StoreEngine, ProductMedia, Message, ShippingMethod, Brand, Lead, Order, OrderItem,  
)

# 🔥 ONGEZA HII IMPORT MUHIMU KABISA (Inaingiza ViewSet kutoka products.views):
from products.serializers import ProductsEngineSerializer
from products.serializers import StoreEngineSerializer
from products.serializers import ProductVariationSerializer




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
    pagination_class = LimitOffsetPagination  # ✅ ONGEZA HII - inapunguza data kubwa

    def get_queryset(self):
        queryset = super().get_queryset()
        
        # 1. Filter kwa sub_category (kwa subcategory moja)
        sub_cat = self.request.query_params.get('sub_category')
        if sub_cat:
            queryset = queryset.filter(sub_category=sub_cat)
            print(f"🔍 [FILTER] SubCategory: {sub_cat}, Results: {queryset.count()}")
            
        # 2. Filter kwa sub_category_id (kama frontend inatumia hili)
        sub_cat_id = self.request.query_params.get('sub_category_id')
        if sub_cat_id:
            queryset = queryset.filter(sub_category=sub_cat_id)
            print(f"🔍 [FILTER] SubCategory ID: {sub_cat_id}, Results: {queryset.count()}")
        
        # 3. Filter kwa parent category (kupitia subcategory)
        category_id = self.request.query_params.get('category_id')
        if category_id:
            queryset = queryset.filter(sub_category__category_id=category_id)
            print(f"🔍 [FILTER] Category: {category_id}, Results: {queryset.count()}")
        
        # 4. Search (hiari - kama unataka kutafuta kwa jina)
        search = self.request.query_params.get('search')
        if search:
            queryset = queryset.filter(name__icontains=search)
            print(f"🔍 [SEARCH] Query: {search}, Results: {queryset.count()}")
            
        return queryset

    def retrieve(self, request, *args, **kwargs):
        leaf_id = kwargs.get('pk')
        print(f"🔍 [BACKEND DEBUG] LeafCategory retrieve called with ID: {leaf_id}")
        
        try:
            instance = self.get_object()
            serializer = self.get_serializer(instance)
            print(f"✅ [BACKEND] Leaf found: {instance.name} (ID: {instance.id})")
            return Response(serializer.data)
        except Exception as e:
            print(f"❌ [BACKEND ERROR] Failed to retrieve Leaf with ID {leaf_id}: {e}")
            raise e


class ProductsEngineViewSet(viewsets.ModelViewSet):
    queryset = ProductsEngine.objects.all()
    serializer_class = ProductsEngineSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [JWTAuthentication]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['store_id', 'leaf_category', 'parent_category', 'is_approved', 'sub_category','is_flash_sale', 'is_featured','original_price', 'created_at', 'order_count','views', 'average_rating', ]
    ordering_fields = ['views', 'price', 'created_at','order_count', 'discount']
    pagination_class = LimitOffsetPagination
    search_fields = ['name', 'description', 'sku']


       # 🆕 ONGEZA HII METHOD (NDANI YA CLASS HII)
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # Chukua thamani ya original_price__gt kutoka URL (mfano: ?original_price__gt=0)
        original_price_gt = self.request.query_params.get('original_price__gt')
        
        if original_price_gt is not None:
            from django.db.models import F
            
            # 1. Hakikisha original_price (bei ya punguzo) ni kubwa kuliko 0
            queryset = queryset.filter(original_price__gt=original_price_gt)
            
            # 2. Hakikisha original_price (bei ya punguzo) ni NDOGO kuliko price (bei halisi)
            # Hii inazuiya bidhaa ambazo zina original_price = 0 au original_price > price zisionekane.
            queryset = queryset.filter(original_price__lt=F('price'))



            # 🔥 BADILISHA HII BLOCK (Search)
        search = self.request.query_params.get('search')
        if search:
            from django.contrib.postgres.search import SearchVector, SearchQuery, SearchRank
            vector = SearchVector('name', weight='A')
            query = SearchQuery(search)
            queryset = queryset.annotate(
                rank=SearchRank(vector, query)
            ).filter(rank__gte=0.1).order_by('-rank')
        
        return queryset

    def perform_create(self, serializer):
        try:
            # 🔥 1. Hakikisha store_id imetumwa
            store_id = self.request.data.get('store_id')
            if not store_id:
                return Response(
                    {'error': 'store_id is required to create a product.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 🔥 2. Hakikisha mtumiaji ameingia na ana profile
            if not self.request.user.is_authenticated:
                return Response(
                    {'error': 'User must be authenticated.'}, 
                    status=status.HTTP_401_UNAUTHORIZED
                )
            
            serializer.save(
                user=self.request.user.profile,
                store_id=store_id
            )
        except Exception as e:
            # 🔥 3. Catch ya jumla kwa makosa yasiyotarajiwa
            print(f"❌ [perform_create] Error: {e}")
            return Response(
                {'error': f'Failed to create product: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def increment_views(self, request, pk=None):
        try:
            product = self.get_object()
            product.views += 1
            product.save()
            return Response({'status': 'view incremented'}, status=status.HTTP_200_OK)
        except ProductsEngine.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"❌ [increment_views] Error: {e}")
            return Response(
                {'error': f'Failed to increment views: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        try:
            product = self.get_object()
            rating = request.data.get('rating')
            
            # 🔥 1. Thibitisha kama rating imetumwa na ni nambari sahihi
            if rating is None:
                return Response(
                    {'error': 'Rating is required.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            try:
                rating_float = float(rating)
            except (ValueError, TypeError):
                return Response(
                    {'error': 'Rating must be a valid number.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # 🔥 2. Hakikisha rating iko kati ya 1 na 5 (kwa kawaida)
            if rating_float < 0 or rating_float > 5:
                return Response(
                    {'error': 'Rating must be between 0 and 5.'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )

            # 🔥 3. Hesabu average rating kwa usalama
            current_total = product.total_reviews or 0
            current_avg = float(product.average_rating or 0)
            
            new_total = current_total + 1
            new_avg = ((current_avg * current_total) + rating_float) / new_total
            
            product.total_reviews = new_total
            product.average_rating = new_avg
            product.save()
            
            return Response(
                {'status': 'rated', 'new_average': new_avg}, 
                status=status.HTTP_200_OK
            )

        except ProductsEngine.DoesNotExist:
            return Response({'error': 'Product not found.'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"❌ [rate] Error: {e}")
            return Response(
                {'error': f'Failed to rate product: {str(e)}'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class AdvertisementViewSet(viewsets.ModelViewSet):
    queryset = Advertisement.objects.all()
    serializer_class = AdvertisementSerializer
    
    # ✅ MUHIMU: Badilisha hii kutoka [IsAuthenticated] kwenda [IsAuthenticatedOrReadOnly]
    # Hii inaruhusu wageni (GET) kuona matangazo, lakini waliosajiliwa tu ndio wanaweza kuongeza au kufuta.
    permission_classes = [IsAuthenticatedOrReadOnly]
    
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
        
        # ✅ Ikiwa ni mgeni (hajalogin), ruhusu waone matangazo yote.
        # Hapa 'all()' inaruhusu DjangoFilterBackend kufanya kazi yake (kuchuja kwa status=active)
        if user.is_anonymous:
            return Advertisement.objects.all()
        
        # ✅ Ikiwa ni admin, waone yote
        if user.is_staff or user.is_superuser:
            return Advertisement.objects.all()
        
        # ✅ Ikiwa ni mtumiaji aliyesajiliwa wa kawaida, waone matangazo yao tu
        return Advertisement.objects.filter(user=user.profile)

class StoreEngineViewSet(viewsets.ModelViewSet):
    queryset = StoreEngine.objects.all()
    serializer_class = StoreEngineSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [JWTAuthentication]
    
    # 🔥 ONGEZA HII:
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]  # 🔥 ONGEZA OrderingFilter
    filterset_fields = ['owner', 'status', 'verification_status', 'category_id', 'is_verified']
    ordering_fields = ['created_at', 'store_name']  # 🔥 ONGEZA ordering
    pagination_class = LimitOffsetPagination  # 🔥 ONGEZA pagination kwa ?limit=50

    def get_object(self):
        pk = self.kwargs.get('pk')
        if pk:
            pk = pk.replace('-', '')
        return StoreEngine.objects.get(id=pk)

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

    # ✅ GET_QUERYSET IKO SAHIHI
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
    
    # 🔥 ONGEZA HIZI - Inaruhusu Backend kupokea Picha + Maandishi!
    parser_classes = [MultiPartParser, FormParser] 

    def get_queryset(self):
        queryset = super().get_queryset()
        user_id = self.request.query_params.get('user_id')
        
        # 🔥 Hii inachukua messages zote za user huyu (Supplier au Buyer)
        if user_id:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(sender_id=user_id) | Q(receiver_id=user_id)
            )
        
        # 🔥 MUHIMU SANA: Hii inachuja kwa MTEJA (Partner) MAALUM!
        # Hii inazuia messages za mteja mmoja kuchanganyika na mteja mwingine!
        partner_id = self.request.query_params.get('partner_id')
        if partner_id:
            from django.db.models import Q
            queryset = queryset.filter(
                Q(sender_id=partner_id) | Q(receiver_id=partner_id)
            )
        
        # 🔥 MUHIMU SANA: Hii inaweka mpangilio sahihi (Zamani kwanza)!
        return queryset.order_by('created_at')

    def perform_create(self, serializer):
        # 🔥 BADILISHA HII - Weka validation bora
        sender_id = self.request.data.get('sender')
        receiver_id = self.request.data.get('receiver')
        content = self.request.data.get('content', '') # 🔥 Badilisha hii: Ruhusu content kuwa tupu kama kuna picha
        image_file = self.request.FILES.get('image') # 🔥 ONGEZA HII: Pata picha kutoka FormData!
        
        # 🔥 Angalia kama data zote zipo (Maandishi AU Picha)
        if not content and not image_file:
            return Response(
                {'detail': 'Unahitaji kuandika ujumbe au kupakia picha.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # 🔥 Thibitisha kama sender na receiver ni UUID sahihi
        import uuid
        try:
            uuid.UUID(str(sender_id))
            uuid.UUID(str(receiver_id))
        except ValueError:
            return Response(
                {'detail': 'sender na receiver lazima ziwe UUID sahihi.'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # 🔥 PAKIA PICHA KWA CLOUDINARY (Kama ipo)
        image_url = None
        if image_file:
            try:
                upload_result = cloudinary.uploader.upload(image_file, folder="chat_images")
                image_url = upload_result['secure_url']
                print(f"✅ [Cloudinary] Chat image uploaded: {image_url}")
            except Exception as e:
                return Response(
                    {'detail': f'Imeshindikana kupakia picha: {str(e)}'}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        # 🔥 Hifadhi message
        try:
            from django.utils import timezone  # 🔥 ONGEZA HII!
            
            message = serializer.save(
                sender_id=sender_id,
                receiver_id=receiver_id,
                content=content,
                image=image_url, # 🔥 ONGEZA HII: Hifadhi URL ya picha kwenye database!
                created_at=timezone.now()  # ✅ ONGEZA HII!
            )
            return Response(
                MessageSerializer(message).data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            print(f"❌ [ERROR] Failed to save message: {e}")
            return Response(
                {'detail': f'Failed to save message: {str(e)}'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
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
    
    # 🔥 MUHIMU SANA: Hii inaruhusu Backend kupokea Picha (FormData)!
    parser_classes = [MultiPartParser, FormParser]

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

    # 🔥 ONGEZA HII: Inasasisha Profile kupitia PATCH (Edit Profile)
    def patch(self, request, *args, **kwargs):
        try:
            profile = request.user.profile
        except Profile.DoesNotExist:
            return Response({'detail': 'Profile not found.'}, status=404)

        # 🔥 Tumia serializer mpya (ambayo ina avatar_file)
        serializer = ProfileSerializer(profile, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()  # 🔥 Hii itaenda kwenye 'update' method ya Serializer yako!
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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


# ==========================================
# 🔥 ALL STORES VIEW - Kwa AllStores.jsx
# ==========================================
class AllStoresView(APIView):
    """
    GET /api/stores/all/
    GET /api/stores/all/?category_id=xxx
    """
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            # 1. Pata category_id kutoka query params
            category_id = request.query_params.get('category_id')
            print(f"🔍 [DEBUG] AllStoresView called with category_id: {category_id}")
            
            # 2. Build query - stores zote active (status='active')
            query = StoreEngine.objects.filter(status='active')
            
            # 3. Filter kwa category ikiwa ipo
            category_name = None
            if category_id:
                try:
                    query = query.filter(category_id=category_id)
                    category = Category.objects.get(id=category_id)
                    category_name = category.name
                    print(f"✅ [DEBUG] Filtering by category: {category_name} (ID: {category_id})")
                except Category.DoesNotExist:
                    print(f"⚠️ [DEBUG] Category with ID {category_id} not found")
                    category_name = None
                except Exception as e:
                    print(f"❌ [ERROR] Category filter failed: {e}")
            
            # 4. Order by created_at (newest first)
            stores = query.order_by('-created_at')
            print(f"📊 [DEBUG] Found {stores.count()} stores")
            
            # 5. Serialize data
            serializer = StoreEngineSerializer(stores, many=True, context={'request': request})
            
            # 6. Return response - Format inayotarajiwa na AllStores.jsx
            return Response({
                'status': 'success',
                'data': {
                    'stores': serializer.data,
                    'total': stores.count(),
                    'category_name': category_name,
                    'selected_category_id': category_id
                }
            }, status=status.HTTP_200_OK)
            
        except Exception as e:
            print(f"❌ [ERROR] AllStoresView failed: {e}")
            return Response({
                'status': 'error',
                'message': str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SellerOTPRequestView(APIView):
    """
    Endpoint ya kutuma OTP kwa email ili kuthibitisha akaunti ya supplier
    POST: /api/seller/otp/request/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        email = user.email

        print(f"🔍 [SellerOTPRequest] Request received for user: {user.id} ({email})")

        # 1. Pata au unda Profile kwa usalama (kuzuia 500 Error)
        profile, created = Profile.objects.get_or_create(user=user)
        if created:
            print(f"✅ [SellerOTPRequest] Profile iliundwa kwa user: {user.id}")

        # 2. Kama ameverify, usitume OTP tena
        if profile.is_otp_verified:
            print(f"⚠️ [SellerOTPRequest] User {user.id} tayari ameverify.")
            return Response({'detail': 'Akaunti yako tayari imethibitishwa.'}, status=400)

        # 3. Generate OTP (6-digit)
        otp = ''.join([str(random.randint(0, 9)) for _ in range(6)])
        print(f"✅ [SellerOTPRequest] OTP imetengenezwa: {otp}")

        # 4. Hifadhi kwenye OTPModel
        OTPModel.objects.create(
            email=email,
            otp=otp,
            created_at=timezone.now()
        )
        print(f"✅ [SellerOTPRequest] OTP imehifadhiwa kwenye database.")

        # 5. Tuma kwa email
        try:
            send_mail(
                subject='Seller Verification OTP',
                message=f'Your OTP to verify your Seller account is: {otp}\n\nThis OTP will expire in 5 minutes.',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[email],
                fail_silently=False,
            )
            print(f"✅ [SellerOTPRequest] Email imetumwa kwa {email} na OTP: {otp}")
            return Response({'detail': 'OTP sent to your email successfully'}, status=200)
        except Exception as e:
            print(f"❌ [SellerOTPRequest] Email failed: {e}")
            return Response({'detail': f'Failed to send email: {str(e)}'}, status=500)


class SellerOTPVerifyView(APIView):
    """
    Endpoint ya kuthibitisha OTP na kubadili is_otp_verified kuwa True
    POST: /api/seller/otp/verify/
    """
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        otp = request.data.get('otp')
        email = user.email

        print(f"🔍 [SellerOTPVerify] Verify attempt for user: {user.id}, OTP: {otp}")

        # 1. Pata au unda Profile kwa usalama
        profile, created = Profile.objects.get_or_create(user=user)
        if created:
            print(f"✅ [SellerOTPVerify] Profile iliundwa kwa user: {user.id}")

        # 2. Kama ameverify, usirudie
        if profile.is_otp_verified:
            print(f"⚠️ [SellerOTPVerify] User {user.id} tayari ameverify.")
            return Response({'detail': 'Akaunti yako tayari imethibitishwa.'}, status=400)

        # 3. Verify OTP
        try:
            otp_record = OTPModel.objects.filter(
                email=email,
                otp=otp,
                is_used=False
            ).latest('created_at')
        except OTPModel.DoesNotExist:
            print(f"❌ [SellerOTPVerify] OTP si sahihi: {otp}")
            return Response({'detail': 'Invalid OTP'}, status=400)

        # 4. Check expiry (5 mins)
        if otp_record.is_expired():
            print(f"❌ [SellerOTPVerify] OTP imeisha muda: {otp}")
            return Response({'detail': 'OTP has expired. Please request a new one.'}, status=400)

        # 5. Mark user as verified and OTP as used
        profile.is_otp_verified = True
        profile.save()

        otp_record.is_used = True
        otp_record.save()

        print(f"✅ [SellerOTPVerify] User {user.id} amethibitishwa kikamilifu!")

        return Response({'detail': 'OTP verified successfully. You can now access the Seller Dashboard.'}, status=200)

class SupplierLogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
            # 🔥 Weka OTP kuwa False (inamruhusu kuulizwa tena)
            profile.is_otp_verified = False
            profile.save()
            
            # Futa token (hiari)
            return Response({'detail': 'Logged out successfully. OTP will be required on next login.'}, status=200)
        except Profile.DoesNotExist:
            return Response({'detail': 'Profile not found.'}, status=400)

        

CLIENT_ID = "897025267638-ef196t913o7kt77dbgld9d7tmv01ftbp.apps.googleusercontent.com"

@method_decorator(csrf_exempt, name='dispatch')
class GoogleAuthView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        access_token = request.data.get('access_token')
        if not access_token:
            return Response({'error': 'access_token is required'}, status=400)

        try:
            from rest_framework_simplejwt.tokens import RefreshToken

            # 1. Thibitisha token kutoka Google
            idinfo = google.oauth2.id_token.verify_oauth2_token(
                access_token, google.auth.transport.requests.Request(), CLIENT_ID
            )

            email = idinfo['email']
            full_name = idinfo.get('name', '')

            # 2. Tafuta au unda User
            user, created = User.objects.get_or_create(
                username=email,
                defaults={'email': email}
            )

            # 🔥 BADILISHA HAPA: Tumia get_or_create kwa Profile
            profile, profile_created = Profile.objects.get_or_create(
                user=user,
                defaults={
                    'full_name': full_name, 
                    'role': 'buyer'  # Hii ni default TU kama ni mtumiaji mpya kabisa
                }
            )

            # 🔥 MUHIMU SANA: Kama profile ilikuwa ipo (user ni wa zamani),
            # hakikisha unachukua ROLE Yake HALISI (si default ya buyer)
            if not profile_created:
                # Sasisha jina kamili kama halipo kwenye profile
                if full_name and not profile.full_name:
                    profile.full_name = full_name
                    profile.save()

            # 🔥 Pata role halisi kutoka kwenye profile (iwe ni buyer au supplier)
            user_role = profile.role

            # 3. Tengeneza JWT Tokens
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
                'user': {
                    'email': email, 
                    'role': user_role,  # 🔥 HAPA NDIPO ROLE HALISI INARUDISHWA!
                    'id': user.id,
                    'is_otp_verified': profile.is_otp_verified  # 🔥 Muhimu kwa Supplier!
                }
            }, status=200)

        except ValueError:
            return Response({'error': 'Invalid Google Token'}, status=400)
        

class ProductVariationViewSet(viewsets.ModelViewSet):
    queryset = ProductVariation.objects.all()
    serializer_class = ProductVariationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # 🔥 MUHIMU SANA: Hii inachuja variations kwa bidhaa moja!
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # 1. Angalia kama Frontend imetuma product_id
        product_id = self.request.query_params.get('product_id')
        if product_id:
            # Safisha hyphens kama ni UUID string (kwa usalama)
            clean_id = str(product_id).replace('-', '')
            # 🔥 HAPA NDIYO SAHIHI: Tumia 'product__id' badala ya 'product_id'
            # Kwa sababu 'product' ni Foreign Key!
            queryset = queryset.filter(product__id=clean_id)
        
        # 2. Pia unaweza kuchuja kwa 'product' (kama API inatumia hili)
        product = self.request.query_params.get('product')
        if product:
            queryset = queryset.filter(product=product)
        
        # 3. Rudisha queryset iliyochujwa
        return queryset

    def perform_create(self, serializer):
        serializer.save()

class AdminStoreApprovalViewSet(viewsets.ModelViewSet):
    """
    Admin pekee ndiye anaweza kuona na kupitisha maduka.
    Endpoint: /api/admin/stores/?verification_status=pending
    """
    queryset = StoreEngine.objects.all()
    serializer_class = StoreEngineSerializer
    permission_classes = [IsAdminUser]  # 🔥 Ni Admin tu!
    authentication_classes = [JWTAuthentication]

    def get_queryset(self):
        queryset = super().get_queryset()
        # Chuja kwa verification_status (mfano: pending)
        status_filter = self.request.query_params.get('verification_status')
        if status_filter:
            queryset = queryset.filter(verification_status=status_filter)
        return queryset

    # 🔥 ONGEZA HII HAPA (Ni muhimu sana!)
    def perform_update(self, serializer):
        store = serializer.save()  # Hifadhi mabadiliko ya store

        # Kama store imepitishwa (approved), sasisha profile ya mmiliki
        if store.verification_status == 'approved':
            profile = store.owner  # Hii ni Profile ya mtumiaji aliyeomba
            profile.role = 'supplier'  # Weka kuwa Supplier
            profile.is_otp_verified = True  # Mruhusu aingle bila OTP tena
            profile.save()
            print(f"✅ Profile ya {profile.user.email} imewekwa kuwa supplier!")