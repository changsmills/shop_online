from rest_framework import viewsets, filters, status
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
from .serializers import (
    CategorySerializer, SubCategorySerializer, ProductsEngineSerializer,
    StoreEngineSerializer, LeafCategorySerializer, ProductMediaSerializer,
    ProductVariationSerializer
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
# 🔥 ProductsEngineViewSet – Inahitaji JWTAuthentication
# ==========================================================
class ProductsEngineViewSet(viewsets.ModelViewSet):
    queryset = ProductsEngine.objects.all()
    serializer_class = ProductsEngineSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]
    authentication_classes = [JWTAuthentication]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['store_id', 'leaf_category_id', 'parent_category', 'is_approved']
    ordering_fields = ['views', 'price', 'created_at']
    pagination_class = LimitOffsetPagination

    def perform_create(self, serializer):
        try:
            profile = Profile.objects.get(user=self.request.user)
        except Profile.DoesNotExist:
            raise serializers.ValidationError({"user": "Mtumiaji hana Profile."})
        serializer.save(
            user=profile,
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

    def perform_create(self, serializer):
        serializer.save()

class ProductVariationViewSet(viewsets.ModelViewSet):
    queryset = ProductVariation.objects.all()
    serializer_class = ProductVariationSerializer
    permission_classes = [IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save()