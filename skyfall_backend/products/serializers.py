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

# ============================================================
# 🔥 PRODUCTS ENGINE SERIALIZER (Imetengenezwa na Debug logs)
# ============================================================
class ProductsEngineSerializer(serializers.ModelSerializer):
    leaf_categories = LeafCategorySerializer(source='leaf_category', read_only=True)
    
    # 🔥 Hizi ndizo zinakubali faili kutoka Frontend
    cover_image = serializers.ImageField(write_only=True, required=False)
    gallery_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False),
        write_only=True,
        required=False
    )
    video_file = serializers.FileField(write_only=True, required=False)

    class Meta:
        model = ProductsEngine
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

    def create(self, validated_data):
        import traceback  # 🔥 Kwa debugging

        print("📦 [DEBUG] Starting Product Creation...")

        # 1. Toa data za picha/video kabla ya kuunda bidhaa
        cover_image = validated_data.pop('cover_image', None)
        gallery_images = validated_data.pop('gallery_images', [])
        video_file = validated_data.pop('video_file', None)

        # 2. Unda bidhaa (ProductsEngine)
        try:
            print("  🔧 [DEBUG] Creating ProductsEngine instance...")
            product = super().create(validated_data)
            print(f"  ✅ [DEBUG] Product created with ID: {product.id}")
        except Exception as e:
            print("❌ [CRITICAL ERROR] Failed to create ProductsEngine!")
            print(traceback.format_exc())
            raise e

        # 3. Hifadhi Cover Image
        if cover_image:
            print(f"  📸 [DEBUG] Attempting to upload Cover Image...")
            try:
                result = cloudinary.uploader.upload(cover_image, folder="product_covers")
                ProductMedia.objects.create(
                    product=product,
                    media_type='cover',
                    media_url=result['secure_url'],
                    display_order=0
                )
                print("  ✅ [DEBUG] Cover Image uploaded and saved to ProductMedia.")
            except cloudinary.api.Error as e:
                print(f"❌ [CLOUDINARY ERROR] Cover Image upload failed: {e}")
            except Exception as e:
                print(f"❌ [UNKNOWN ERROR] Cover Image processing failed: {e}")
                print(traceback.format_exc())

        # 4. Hifadhi Gallery Images
        if gallery_images:
            print(f"  🖼️ [DEBUG] Attempting to upload {len(gallery_images)} Gallery Images...")
            for idx, img in enumerate(gallery_images):
                try:
                    print(f"    - Uploading gallery image {idx+1}...")
                    result = cloudinary.uploader.upload(img, folder="product_gallery")
                    ProductMedia.objects.create(
                        product=product,
                        media_type='gallery',
                        media_url=result['secure_url'],
                        display_order=idx + 1
                    )
                    print(f"      ✅ Gallery image {idx+1} saved.")
                except cloudinary.api.Error as e:
                    print(f"❌ [CLOUDINARY ERROR] Gallery image {idx+1} failed: {e}")
                except Exception as e:
                    print(f"❌ [UNKNOWN ERROR] Gallery image {idx+1} failed: {e}")

        # 5. Hifadhi Video (Kwenye Cloudinary)
        if video_file:
            print(f"  🎬 [DEBUG] Attempting to upload Video...")
            try:
                result = cloudinary.uploader.upload(video_file, resource_type="video", folder="product_videos")
                ProductMedia.objects.create(
                    product=product,
                    media_type='video',
                    media_url=result['secure_url'],
                    is_promo_video=True
                )
                print("  ✅ [DEBUG] Video uploaded and saved to ProductMedia.")
            except cloudinary.api.Error as e:
                print(f"❌ [CLOUDINARY ERROR] Video upload failed: {e}")
            except Exception as e:
                print(f"❌ [UNKNOWN ERROR] Video processing failed: {e}")
                print(traceback.format_exc())

        print("🏁 [DEBUG] Product Creation Finished.")
        return product

# ============================================================
# 🔥 PRODUCT MEDIA SERIALIZER (MUHIMU: Ondoa read_only kwenye media_url!)
# ============================================================
class ProductMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMedia
        fields = ['id', 'media_type', 'media_url', 'display_order', 'is_promo_video']
        # 🔥 MUHIMU: Tunaondoa read_only_fields kabisa ili media_url iweze kujazwa na Cloudinary!
        read_only_fields = [] 


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