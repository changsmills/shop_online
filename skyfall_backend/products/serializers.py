from rest_framework import serializers
from products.models import (
    Category, SubCategory, ProductsEngine, LeafCategory, Advertisement, 
    StoreEngine, ProductMedia, Message, Profile,
    ShippingMethod, Brand, Lead, ProductVariation  # 🔥 ONGEZA ProductVariation hapa!
)

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class SubCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = SubCategory
        fields = '__all__'

class ProductsEngineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductsEngine
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

class LeafCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LeafCategory
        fields = '__all__'

class AdvertisementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Advertisement
        fields = '__all__'

class StoreEngineSerializer(serializers.ModelSerializer):
    sub_categories = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()

    class Meta:
        model = StoreEngine
        fields = '__all__'
        read_only_fields = ['owner']

    def get_sub_categories(self, obj):
        if not obj.sub_category_ids:
            return []
        sub_cats = SubCategory.objects.filter(id__in=obj.sub_category_ids)
        return SubCategorySerializer(sub_cats, many=True).data

    def get_category_name(self, obj):
        if not obj.category_id:
            return None
        try:
            cat = Category.objects.get(id=obj.category_id)
            return cat.name
        except Category.DoesNotExist:
            return None

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            raise serializers.ValidationError({"owner": "Mtumiaji hana Profile. Tafadhali unda profile kwanza."})
        validated_data['owner'] = profile
        return super().create(validated_data)

class ProductMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMedia
        fields = '__all__'

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = '__all__'

class ShippingMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingMethod
        fields = '__all__'

class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brand
        fields = '__all__'

class LeadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lead
        fields = '__all__'

# 🔥 HAPA MWISHONI (MARA MOJA TU!):
class ProductVariationSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariation
        fields = '__all__'