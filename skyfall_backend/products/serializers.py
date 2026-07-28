from rest_framework import serializers
import cloudinary.uploader  # 🔥 ONGEZA MSTARI HUU HAPA (Chini ya import ya rest_framework)!

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

class LeafCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = LeafCategory
        fields = '__all__'

class ProductsEngineSerializer(serializers.ModelSerializer):
    leaf_categories = LeafCategorySerializer(source='leaf_category', read_only=True)

    class Meta:
        model = ProductsEngine
        fields = '__all__'
        read_only_fields = ['user', 'created_at']


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

class AdvertisementSerializer(serializers.ModelSerializer):
    media_file = serializers.FileField(write_only=True, required=False)

    class Meta:
        model = Advertisement
        # 🔥 ONGEZA HII: Tumia 'exclude' ili DRF asikague 'user' kabisa!
        exclude = ['user']
        read_only_fields = ['media_url', 'status', 'created_at', 'approved_at', 'rejected_at']

    def create(self, validated_data):
        # 🔥 1. Chukua mtumiaji aliyeingia (Profile) kutoka request
        request = self.context.get('request')
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            raise serializers.ValidationError({"user": "Mtumiaji hana Profile. Tafadhali unda profile kwanza."})
        
        # Weka profile kwenye validated_data (sasa hii itakubalika kwa sababu hatujaijumuishwa kwenye validation!)
        validated_data['user'] = profile

        # 2. Toa file kutoka validated data
        media_file = validated_data.pop('media_file', None)
        
        # 3. Upload kwenye Cloudinary
        if media_file:
            try:
                
                # Upload file kwenye folder ya 'ads' kwenye Cloudinary
                result = cloudinary.uploader.upload(media_file, folder="ads")
                validated_data['media_url'] = result['secure_url']
                
                # 4. Weka media_type kulingana na aina ya faili
                if not validated_data.get('media_type'):
                    if media_file.content_type and media_file.content_type.startswith('video'):
                        validated_data['media_type'] = 'video'
                    else:
                        validated_data['media_type'] = 'image'
            except Exception as e:
                raise serializers.ValidationError({"media_file": f"Imeshindwa kupakia faili: {str(e)}"})
        
        # 5. Endelea kuunda record kama kawaida
        return super().create(validated_data)