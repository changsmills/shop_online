from rest_framework import serializers
import cloudinary.uploader 
import os
import urllib.parse


from products.models import (
    Category, SubCategory, ProductsEngine, LeafCategory, Advertisement, 
    StoreEngine, ProductMedia, Message, Profile,
    ShippingMethod, Brand, Lead, ProductVariation  
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
    
    # 🔥 ONGEZA HII FIELD MPYA (Inatuma URL kamili ya Cloudinary kwa Frontend)
    cover_image_url = serializers.SerializerMethodField()
    
    # 🔥 Hizi ndizo zinakubali faili kutoka Frontend
    cover_image = serializers.ImageField(write_only=True, required=False)
    gallery_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False),
        write_only=True,
        required=False
    )
    video_file = serializers.FileField(write_only=True, required=False)

    # 🔥 ONGEZA HII (Ili kupokea files za rangi kutoka Frontend)
    color_image_files = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False),
        write_only=True,
        required=False
    )

    class Meta:
        model = ProductsEngine
        fields = '__all__'
        read_only_fields = ['user', 'created_at']

       # 🔥 ONGEZA METHOD HII (Inajenga URL ya Cloudinary kwa kutumia CLOUD_NAME)
    def get_cover_image_url(self, obj):
        if not obj.cover_image:
            return None
        # 🔥 Chukua Cloud Name kutoka Environment Variables
        CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
        if not CLOUD_NAME:
            return None  # Kama hakuna Cloud Name, rudisha None
        
        # 🔥 ONGEZA 'media/' MWANZONI NA USAFISHE NAFASI
        full_path = f"media/{obj.cover_image}"
        safe_path = urllib.parse.quote(full_path)
        
        return f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"

    def create(self, validated_data):
        import traceback

        print("📦 [DEBUG] Starting Product Creation...")

        # 1. Toa data za picha/video
        cover_image = validated_data.pop('cover_image', None)
        gallery_images = validated_data.pop('gallery_images', [])
        video_file = validated_data.pop('video_file', None)
        color_image_files = validated_data.pop('color_image_files', [])

        # 2. Unda bidhaa
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
                result = cloudinary.uploader.upload(cover_image)  # 🔥 ONDOA folder="product_covers"
                
                # 🔥 1. Hifadhi URL kwenye ProductMedia
                ProductMedia.objects.create(
                    product=product,
                    media_type='cover',
                    media_url=result['secure_url'],
                    display_order=0
                )
                print("  ✅ [DEBUG] Cover Image uploaded and saved to ProductMedia.")
                
                # 🔥 2. MUHIMU SANA: Sasisha product.cover_image ili ipatikane na serializer!
                product.cover_image = result['public_id']  # Hii inahifadhi jina la picha (kama media/product_covers/chacha)
                product.save(update_fields=['cover_image'])
                
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
                    result = cloudinary.uploader.upload(img)  # 🔥 ONDOA folder="product_gallery"
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

        # 5. Hifadhi Video
        if video_file:
            print(f"  🎬 [DEBUG] Attempting to upload Video...")
            try:
                result = cloudinary.uploader.upload(video_file, resource_type="video")  # 🔥 ONDOA folder="product_videos"
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

        # 6. Hifadhi Color Images (Rangi za bidhaa)
        if color_image_files:
            print(f"  🎨 [DEBUG] Uploading {len(color_image_files)} Color Images...")
            for file in color_image_files:
                try:
                    result = cloudinary.uploader.upload(file)
                    # Hifadhi kwenye ProductMedia kama media_type='color_image'
                    ProductMedia.objects.create(
                        product=product,
                        media_type='color_image',   # 🔥 Tumia hii kuainisha
                        media_url=result['secure_url'],
                        display_order=10  # Au weka order sahihi
                    )
                    print(f"    ✅ Color image uploaded and saved.")
                except Exception as e:
                    print(f"❌ [ERROR] Failed to upload color image: {e}")

        print("🏁 [DEBUG] Product Creation Finished.")
        return product
    
# ============================================================
# 🔥 PRODUCT MEDIA SERIALIZER (MUHIMU: Ondoa read_only kwenye media_url!)
# ============================================================
class ProductMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMedia
        fields = '__all__'
        read_only_fields = ['media_url']  # 🔥 MUHIMU: Usiruhusu mteja kuweka URL, mfumo wa Cloudinary ndio uweke.

class StoreEngineSerializer(serializers.ModelSerializer):
    sub_categories = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()

    # 🔥 ONGEZA FIELD HIZI MPYA ZA URL (Zitatumwa kwa Frontend)
    store_logo_url = serializers.SerializerMethodField()
    store_banner_url = serializers.SerializerMethodField()
    tin_image_url = serializers.SerializerMethodField()
    office_image_1_url = serializers.SerializerMethodField()
    office_image_2_url = serializers.SerializerMethodField()

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

    # ------------------------------------------------------------------
    # 🔥 Methods za URL (Zote zimesahihishwa kuwa na media/ + urllib.parse.quote)
    # ------------------------------------------------------------------
    def get_store_logo_url(self, obj):
        if not obj.store_logo:
            return None
        CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
        if not CLOUD_NAME:
            return None
        full_path = f"media/{obj.store_logo}"
        safe_path = urllib.parse.quote(full_path)
        return f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"

    def get_store_banner_url(self, obj):
        if not obj.store_banner:
            return None
        CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
        if not CLOUD_NAME:
            return None
        full_path = f"media/{obj.store_banner}"
        safe_path = urllib.parse.quote(full_path)
        return f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"

    def get_tin_image_url(self, obj):
        if not obj.tin_image:
            return None
        CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
        if not CLOUD_NAME:
            return None
        full_path = f"media/{obj.tin_image}"
        safe_path = urllib.parse.quote(full_path)
        return f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"

    def get_office_image_1_url(self, obj):
        if not obj.office_image_1:
            return None
        CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
        if not CLOUD_NAME:
            return None
        full_path = f"media/{obj.office_image_1}"
        safe_path = urllib.parse.quote(full_path)
        return f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"

    def get_office_image_2_url(self, obj):
        if not obj.office_image_2:
            return None
        CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
        if not CLOUD_NAME:
            return None
        full_path = f"media/{obj.office_image_2}"
        safe_path = urllib.parse.quote(full_path)
        return f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"

    # ------------------------------------------------------------------
    # 🔥 Create method (Iko sawa, usibadilishe)
    # ------------------------------------------------------------------
    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            raise serializers.ValidationError({"owner": "Mtumiaji hana Profile. Tafadhali unda profile kwanza."})
        validated_data['owner'] = profile
        return super().create(validated_data)

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
        read_only_fields = ['id', 'created_at', 'color_image'] # 🔥 'color_image' sasa ni read-only kwa sababu tunapakia kwa Cloudinary

    def get_color_image_url(self, obj):
        """Inatengeneza URL ya Cloudinary kutoka public_id iliyohifadhiwa"""
        if not obj.color_image:
            return None
        CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
        if not CLOUD_NAME:
            return None
        # 🔥 Hakikisha path inaanza na 'media/' kama ilivyo kwenye ProductsEngine
        full_path = f"media/{obj.color_image}"
        safe_path = urllib.parse.quote(full_path)
        return f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"

    def create(self, validated_data):
        import traceback
        print("🎨 [DEBUG] Creating ProductVariation...")

        # 🔥 1. Toa picha kutoka validated_data
        color_image_file = validated_data.pop('color_image_file', None)
        
        # 🔥 2. Unda variation (bila picha kwanza)
        try:
            variation = super().create(validated_data)
            print(f"  ✅ [DEBUG] Variation created with ID: {variation.id}")
        except Exception as e:
            print("❌ [CRITICAL ERROR] Failed to create ProductVariation!")
            print(traceback.format_exc())
            raise e

        # 🔥 3. Ikiwa picha ipo, ipakie Cloudinary
        if color_image_file:
            print(f"  📸 [DEBUG] Uploading color_image for {variation.color_name}...")
            try:
                # 🔥 Upload kwenye Cloudinary (Folder inaweza kuwa 'variation_colors')
                result = cloudinary.uploader.upload(color_image_file) # 🔥 ONDOA folder parameter ukitaka
                
                # 🔥 4. Hifadhi public_id kwenye field ya 'color_image' kwenye DB
                variation.color_image = result['public_id'] 
                variation.save(update_fields=['color_image'])
                
                print(f"  ✅ [DEBUG] Color Image uploaded! Public ID: {result['public_id']}")
                
            except cloudinary.api.Error as e:
                print(f"❌ [CLOUDINARY ERROR] Color Image upload failed: {e}")
            except Exception as e:
                print(f"❌ [UNKNOWN ERROR] Color Image processing failed: {e}")
                print(traceback.format_exc())

        print("🏁 [DEBUG] ProductVariation creation finished.")
        return variation