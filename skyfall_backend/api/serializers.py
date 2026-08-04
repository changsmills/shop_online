from rest_framework import serializers
import os
import urllib.parse
from django.conf import settings  # 🔥 MUHIMU!
import cloudinary.uploader
import cloudinary.api
import cloudinary.exceptions

from products.models import (
    Category, OrderItem, SubCategory, ProductsEngine, LeafCategory, Advertisement,
    StoreEngine, ProductMedia, Message, Profile,
    ShippingMethod, Brand, Lead,
    ProductVariation ,
        Order

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
    # 🔥 Ongeza hii field ya kupokea file
    media_file = serializers.FileField(write_only=True, required=False)
    
    class Meta:
        model = Advertisement
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at', 'status', 'media_url']

    def create(self, validated_data):
        # 🔥 Toa media_file
        media_file = validated_data.pop('media_file', None)
        
        # 🔥 Unda advertisement
        advertisement = Advertisement.objects.create(**validated_data)
        
        # 🔥 Ikiwa kuna file, pakia Cloudinary
        if media_file:
            try:
                result = cloudinary.uploader.upload(
                    media_file,
                    folder="advertisements",
                    timeout=60,
                    resource_type="auto"
                )
                advertisement.media_url = result['secure_url']
                advertisement.save(update_fields=['media_url'])
                print(f"✅ [Cloudinary] Upload successful! URL: {result['secure_url']}")
            except Exception as e:
                print(f"❌ [Cloudinary] Upload failed: {e}")
        
        return advertisement


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

# ============================================================
# 🔥 PRODUCT VARIATION SERIALIZER (Imerekebishwa Sana!)
# ============================================================
class ProductVariationSerializer(serializers.ModelSerializer):
    # 🔥 1. Hii ndiyo itatumwa kwa Frontend (URL kamili ya Cloudinary)
    color_image_url = serializers.SerializerMethodField()
    
    # 🔥 2. Hii inakubali File kutoka Frontend na kuihifadhi kwenye Cloudinary
    color_image_file = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = ProductVariation
        fields = '__all__'
        read_only_fields = ['id', 'created_at']  # 🔥 Ondoa 'color_image' hapa!

    def get_color_image_url(self, obj):
        if not obj.color_image:
            return None

        CLOUD_NAME = settings.CLOUDINARY_STORAGE.get('CLOUD_NAME')
        if not CLOUD_NAME:
            CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
        if not CLOUD_NAME:
            return None

        path = str(obj.color_image)
        safe_path = urllib.parse.quote(path, safe='/')
        return f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"
    
    def create(self, validated_data):
        import traceback
        import cloudinary.uploader
        import cloudinary.api
        import cloudinary.exceptions

        print("🎨 [DEBUG] Creating ProductVariation...")

        # 🔥 1. Toa picha kutoka validated_data
        color_image_file = validated_data.pop('color_image_file', None)
        
        # 🔥 2. Check kama color_image_file ipo na sio tupu
        if color_image_file:
            print(f"  📸 [DEBUG] color_image_file received: {color_image_file.name}, size: {color_image_file.size} bytes")
            if color_image_file.size == 0:
                print("❌ [ERROR] color_image_file is empty (0 bytes)!")
                raise serializers.ValidationError({"color_image_file": "Faili la picha ni tupu (0 bytes)."})
            if color_image_file.size > 10 * 1024 * 1024:
                print("❌ [ERROR] color_image_file is too large (> 10MB)!")
                raise serializers.ValidationError({"color_image_file": "Faili la picha ni kubwa sana (> 10MB)."})
        else:
            print("  ℹ️ [INFO] Hakuna color_image_file, endelea bila picha.")

        # 🔥 3. Unda variation (bila picha kwanza) na catch errors za model
        print("  🔧 [DEBUG] Creating variation (without image)...")
        try:
            variation = super().create(validated_data)
            print(f"  ✅ [DEBUG] Variation created with ID: {variation.id}")
        except serializers.ValidationError as ve:
            print(f"❌ [VALIDATION ERROR] Validation failed before saving variation: {ve.detail}")
            print(traceback.format_exc())
            raise ve
        except Exception as e:
            print("❌ [CRITICAL ERROR] Failed to create ProductVariation! (Before upload)")
            print(traceback.format_exc())
            raise e

        # 🔥 4. Ikiwa picha ipo, ipakie Cloudinary na catch errors
        if color_image_file:
            print(f"  📸 [DEBUG] Uploading color_image for {variation.color_name}...")
            try:
                # 🔥 Upload kwenye Cloudinary
                result = cloudinary.uploader.upload(
                    color_image_file, 
                    folder="product_variations",
                    timeout=60  # 🔥 Ongeza timeout kwa mtandao mdogo
                )
                
                # 🔥 5. Hifadhi public_id kwenye field ya 'color_image' kwenye DB
                print(f"  ✅ [DEBUG] Upload successful! Public ID before save: {result['public_id']}")
                variation.color_image = result['public_id']
                variation.save(update_fields=['color_image'])
                
                print(f"  ✅ [DEBUG] Color Image uploaded and saved! Public ID: {result['public_id']}")
                print(f"  🔗 [DEBUG] Full Cloudinary URL: {result['secure_url']}")
                
            except cloudinary.exceptions.BadRequest as e:
                print(f"❌ [CLOUDINARY BAD REQUEST] Upload failed: {e}")
                print("  🔍 [DEBUG] Common reasons: Invalid file format, empty file, or unsupported image type.")
                print(traceback.format_exc())
                raise serializers.ValidationError({"color_image_file": f"Upload failed (Bad Request): {str(e)}"})
                
            except cloudinary.exceptions.Unauthorized as e:
                print(f"❌ [CLOUDINARY UNAUTHORIZED] Upload failed: {e}")
                print("  🔍 [DEBUG] Check CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET in .env.")
                print(traceback.format_exc())
                raise serializers.ValidationError({"color_image_file": f"Cloudinary authentication failed: {str(e)}"})
                
            except cloudinary.exceptions.TimeoutError as e:
                print(f"❌ [CLOUDINARY TIMEOUT] Upload timed out: {e}")
                print("  🔍 [DEBUG] Network issue or Cloudinary server is slow.")
                print(traceback.format_exc())
                raise serializers.ValidationError({"color_image_file": f"Upload timed out. Please try again: {str(e)}"})
                
            except cloudinary.exceptions.Error as e:
                print(f"❌ [CLOUDINARY ERROR] Upload failed: {e}")
                print("  🔍 [DEBUG] Generic Cloudinary error. Check file or network.")
                print(traceback.format_exc())
                raise serializers.ValidationError({"color_image_file": f"Cloudinary error: {str(e)}"})
                
            except Exception as e:
                print(f"❌ [UNKNOWN ERROR] Unexpected error during upload: {e}")
                print("  🔍 [DEBUG] This could be a file handling or network issue.")
                print(traceback.format_exc())
                raise serializers.ValidationError({"color_image_file": f"Unexpected error: {str(e)}"})

        print("🏁 [DEBUG] ProductVariation creation finished.")
        return variation

 # ============================================================
 # 🔥 SERIALIZERS MPYA ZA ORDERS NA ORDER ITEMS
 # ============================================================

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'
        # 🔥 'order_number' na 'customer' zinajazwa na backend (toka kwenye perform_create)
        read_only_fields = ['customer']


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'