# Ongeza serializers hapa juu kabisa kwenye views.py:
from rest_framework import viewsets, filters, status, serializers
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly, AllowAny
from rest_framework.pagination import LimitOffsetPagination
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework_simplejwt.authentication import JWTAuthentication  # 🔥 ONGEZA HII!
from products.models import (
    Category, SubCategory, ProductsEngine, LeafCategory, StoreEngine,
    ProductMedia, ProductVariation, Profile
)

from products.serializers import ProductVariationSerializer  # ✅ ONGEZA HII!

from .serializers import (
    CategorySerializer, SubCategorySerializer, ProductsEngineSerializer,
    StoreEngineSerializer, LeafCategorySerializer, ProductMediaSerializer
)

class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [AllowAny]

class SubCategoryViewSet(viewsets.ModelViewSet):
    queryset = SubCategory.objects.all()
    serializer_class = SubCategorySerializer
    permission_classes = [AllowAny]

# ==========================================================
# 🔥 ProductsEngineViewSet – Imerekebishwa (Real Fix)
# ==========================================================
class ProductsEngineViewSet(viewsets.ModelViewSet):
    queryset = ProductsEngine.objects.all()
    serializer_class = ProductsEngineSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [JWTAuthentication]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]  # 🔥 ONGEZA SearchFilter!
    filterset_fields = ['store_id', 'leaf_category_id', 'parent_category', 'is_approved', 'sub_category']   
    search_fields = ['name', 'description', 'sku', 'barcode']  # 🔥 ONGEZA HIZI (Inaruhusu search!)
    ordering_fields = ['views', 'price', 'created_at']
    pagination_class = LimitOffsetPagination

    # ==========================================================
    # 🔥 ONGEZA HII METHOD KWA AJILI YA DEBUGGING NA CATCH
    # ==========================================================
    def get_queryset(self):
        queryset = super().get_queryset()
        
        # 1. Chapisha parameters zote zinazoingia kutoka Frontend
        print(f"🔍 [PRODUCTS DEBUG] Full Request Query Params: {self.request.query_params}")
        
        # 2. Angalia hasa 'leaf_category_id' inayotumwa
        leaf_category_id = self.request.query_params.get('leaf_category_id')
        if leaf_category_id:
            print(f"✅ [PRODUCTS] Received leaf_category_id: {leaf_category_id}")
            # Kama ID ina hyphens, thibitisha ni UUID sahihi (kwa kujaribu kuitafuta)
            try:
                import uuid
                uuid.UUID(leaf_category_id)  # Hii inatupa error kama si UUID halisi
                print(f"  ℹ️ [PRODUCTS] leaf_category_id is a valid UUID.")
            except ValueError:
                print(f"❌ [PRODUCTS] WARNING: leaf_category_id '{leaf_category_id}' is NOT a valid UUID!")
                # Unaweza kurudisha queryset tupu kama ID si sahihi, badala ya kurudisha 500
                # return self.queryset.none()
        else:
            print(f"ℹ️ [PRODUCTS] No leaf_category_id provided in query params.")

        # 3. Angalia store_id (kama ipo)
        store_id = self.request.query_params.get('store_id')
        if store_id:
            print(f"✅ [PRODUCTS] Received store_id: {store_id}")
        
        # 4. Angalia sub_category_id
        sub_category_id = self.request.query_params.get('sub_category_id')
        if sub_category_id:
            print(f"✅ [PRODUCTS] Received sub_category_id: {sub_category_id}")

        # 5. Rudisha queryset (DjangoFilterBackend itashughulikia filtering)
        return queryset

    def perform_create(self, serializer):
        try:
            profile = Profile.objects.get(user=self.request.user)
        except Profile.DoesNotExist:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({"user": "Mtumiaji hana Profile."})
        
        # 🔥 Chukua store_id kutoka kwenye request
        raw_store_id = self.request.data.get('store_id')
        
        # Pata StoreEngine object ikiwa store_id ipo (kama model yako inatumia FK kwa StoreEngine)
        store_instance = None
        if raw_store_id:
            # Hakikisha tunaondoa hyphens kama ni UUID String
            clean_store_id = str(raw_store_id).replace('-', '')
            try:
                store_instance = StoreEngine.objects.get(id=clean_store_id)
            except StoreEngine.DoesNotExist:
                # Kama store_id ni CharField au UUID simple kwenye ProductsEngine model:
                store_instance = raw_store_id

        # 🔥 Save serializer ikiwa na profile na store
        if store_instance:
            serializer.save(user=profile, store_id=store_instance)
        else:
            serializer.save(user=profile)

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
    
# ==========================================================
# ✅ StoreEngineViewSet – Inahitaji JWTAuthentication pia
# ==========================================================
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

    def get_queryset(self):
        if self.action in ['list', 'retrieve']:
            return StoreEngine.objects.all()
        user = self.request.user
        if user.is_authenticated:
            return StoreEngine.objects.filter(owner__user=user)
        return StoreEngine.objects.none()

    def perform_create(self, serializer):
        try:
            profile = Profile.objects.get(user=self.request.user)
        except Profile.DoesNotExist:
            raise serializers.ValidationError({"owner": "Mtumiaji hana Profile."})
        serializer.save(owner=profile)

class LeafCategoryViewSet(viewsets.ModelViewSet):
    queryset = LeafCategory.objects.all()
    serializer_class = LeafCategorySerializer
    permission_classes = [AllowAny]

    # 🔥 ONGEZA HIZI MBILI HAPA CHINI (Ili izingatie parameter ya ?sub_category=...)
    filter_backends = [DjangoFilterBackend]
    filterset_fields = ['sub_category']  # 'sub_category' ni jina la ForeignKey kwenye models.py
    

class ProductMediaViewSet(viewsets.ModelViewSet):
    queryset = ProductMedia.objects.all()
    serializer_class = ProductMediaSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    # 🔥 ONGEZA HII METHOD (Inachuja kwa product_id kutoka URL)
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

class ProductVariationViewSet(viewsets.ModelViewSet):
    queryset = ProductVariation.objects.all()
    serializer_class = ProductVariationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save()