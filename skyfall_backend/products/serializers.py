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
# 🔥 PRODUCT MEDIA SERIALIZER (MUHIMU: Ondoa read_only kwenye media_url!)
# ============================================================
class ProductMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMedia
        fields = '__all__'
        read_only_fields = ['media_url'] 


# ============================================================
# 🔥 PRODUCTS ENGINE SERIALIZER (FINAL - Full Response Edition)
# ============================================================
class ProductsEngineSerializer(serializers.ModelSerializer):
    leaf_categories = LeafCategorySerializer(source='leaf_category', read_only=True)
    cover_image_url = serializers.SerializerMethodField()
    
    # 🔥 Fields za kupokea faili (write_only)
    cover_image = serializers.ImageField(write_only=True, required=False, allow_null=True)
    gallery_images = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False),
        write_only=True,
        required=False,
        allow_null=True
    )
    video_file = serializers.FileField(write_only=True, required=False, allow_null=True)
    color_image_files = serializers.ListField(
        child=serializers.ImageField(allow_empty_file=False),
        write_only=True,
        required=False,
        allow_null=True
    )

    # 🔥 NYONGEZA HII: Inarudisha picha zilizopakiwa kwenye Response!
    media = ProductMediaSerializer(many=True, read_only=True)

    class Meta:
        model = ProductsEngine
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'cover_image']

       # 🔥 REKEBISHA HAPA: KAGUA NA ONGEZA 'media/' IKIWA HIPO!
    def get_cover_image_url(self, obj):
        if not obj.cover_image:
            return None
        CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
        if not CLOUD_NAME:
            return None
        
        # Pata path ya picha na uongeze 'media/' mbele ikiwa haipo
        path = str(obj.cover_image)
        if not path.startswith('media/') and not path.startswith('product_media/'):
            path = f"media/{path}"  # 🔥 Hii inatengeneza URL sahihi kwa bidhaa za zamani!
            
        safe_path = urllib.parse.quote(path)
        return f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"

    # 🔥 PIA FANYA HIVYO KWA get_color_image_url (Variations)
    def get_color_image_url(self, obj):
        if not obj.color_image:
            return None
        CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
        if not CLOUD_NAME:
            return None
        
        path = str(obj.color_image)
        # Kagua na rekebisha path kama inahitajika
        safe_path = urllib.parse.quote(path) # (Kwa variations folder ni 'product_variations')
        return f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"

    # 🔥 Iko sawa kwa variations, hakikisha pia imetumia str()
    def get_color_image_url(self, obj):
        if not obj.color_image:
            return None
        CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
        if not CLOUD_NAME:
            return None
        safe_path = urllib.parse.quote(str(obj.color_image))
        return f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"

    # 🔥 DEBUG: Angalia kama serializer inaitwa!
    def to_internal_value(self, data):
        request = self.context.get('request')
        
        print(f"🔍 [DEBUG] to_internal_value called! Request FILES keys: {request.FILES.keys() if request else 'No Request'}", flush=True)
        
        self._gallery_files = []
        self._cover_image = None
        self._video_file = None
        self._color_image_files = []
        
        if request:
            self._gallery_files = request.FILES.getlist('gallery_images')
            self._cover_image = request.FILES.get('cover_image')
            self._video_file = request.FILES.get('video_file')
            self._color_image_files = request.FILES.getlist('color_image_files')
            
            print(f"🔍 [DEBUG] Gallery images received in backend: {len(self._gallery_files)}", flush=True)
            
        return super().to_internal_value(data)

    def create(self, validated_data):
        import traceback
        import cloudinary.uploader

        print("📦 [DEBUG] Starting Product Creation...", flush=True)

        # Chukua faili kutoka self
        gallery_images = self._gallery_files
        cover_image = self._cover_image
        video_file = self._video_file
        color_image_files = self._color_image_files

        # ============================================================
        # 🔥 MUHIMU SANA: Ondoa hizi fields kutoka validated_data!
        # (Kwa sababu hazipo kwenye model ya ProductsEngine)
        # ============================================================
        validated_data.pop('gallery_images', None)
        validated_data.pop('cover_image', None)
        validated_data.pop('video_file', None)
        validated_data.pop('color_image_files', None)

        # 2. Unda bidhaa (Sasa haitatoa TypeError!)
        try:
            print("  🔧 [DEBUG] Creating ProductsEngine instance...", flush=True)
            product = super().create(validated_data)
            print(f"  ✅ [DEBUG] Product created with ID: {product.id}", flush=True)
        except Exception as e:
            print("❌ [CRITICAL ERROR] Failed to create ProductsEngine!", flush=True)
            print(traceback.format_exc(), flush=True)
            raise e

        # 3. Hifadhi Cover Image 🔥 FIX: ONGEZA FOLDER
        if cover_image:
            print(f"  📸 [DEBUG] Attempting to upload Cover Image...", flush=True)
            try:
                result = cloudinary.uploader.upload(cover_image, folder="product_media")
                ProductMedia.objects.create(
                    product=product,
                    media_type='cover',
                    media_url=result['secure_url'],
                    display_order=0
                )
                print("  ✅ [DEBUG] Cover Image uploaded and saved to ProductMedia.", flush=True)
                product.cover_image = result.get('public_id')
                product.save(update_fields=['cover_image'])
            except cloudinary.api.Error as e:
                print(f"❌ [CLOUDINARY ERROR] Cover Image upload failed: {e}", flush=True)
            except Exception as e:
                print(f"❌ [UNKNOWN ERROR] Cover Image processing failed: {e}", flush=True)
                print(traceback.format_exc(), flush=True)

        # 4. Hifadhi Gallery Images 🔥 FIX: ONGEZA FOLDER
        if gallery_images:
            print(f"  🖼️ [DEBUG] Attempting to upload {len(gallery_images)} Gallery Images...", flush=True)
            for idx, img in enumerate(gallery_images):
                try:
                    print(f"    - Uploading gallery image {idx+1}...", flush=True)
                    result = cloudinary.uploader.upload(img, folder="product_media")
                    ProductMedia.objects.create(
                        product=product,
                        media_type='gallery',
                        media_url=result['secure_url'],
                        display_order=idx + 1
                    )
                    print(f"      ✅ Gallery image {idx+1} saved.", flush=True)
                except cloudinary.api.Error as e:
                    print(f"❌ [CLOUDINARY ERROR] Gallery image {idx+1} failed: {e}", flush=True)
                except Exception as e:
                    print(f"❌ [UNKNOWN ERROR] Gallery image {idx+1} failed: {e}", flush=True)

        # 5. Hifadhi Video 🔥 FIX: ONGEZA FOLDER
        if video_file:
            print(f"  🎬 [DEBUG] Attempting to upload Video...", flush=True)
            try:
                result = cloudinary.uploader.upload(video_file, resource_type="video", folder="product_media")
                ProductMedia.objects.create(
                    product=product,
                    media_type='video',
                    media_url=result['secure_url'],
                    is_promo_video=True
                )
                print("  ✅ [DEBUG] Video uploaded and saved to ProductMedia.", flush=True)
            except cloudinary.api.Error as e:
                print(f"❌ [CLOUDINARY ERROR] Video upload failed: {e}", flush=True)
            except Exception as e:
                print(f"❌ [UNKNOWN ERROR] Video processing failed: {e}", flush=True)
                print(traceback.format_exc(), flush=True)

        # 6. Hifadhi Color Images 🔥 FIX: ONGEZA FOLDER
        if color_image_files:
            print(f"  🎨 [DEBUG] Uploading {len(color_image_files)} Color Images...", flush=True)
            for file in color_image_files:
                try:
                    result = cloudinary.uploader.upload(file, folder="product_media")
                    ProductMedia.objects.create(
                        product=product,
                        media_type='color_image',
                        media_url=result['secure_url'],
                        display_order=10
                    )
                    print(f"    ✅ Color image uploaded and saved.", flush=True)
                except Exception as e:
                    print(f"❌ [ERROR] Failed to upload color image: {e}", flush=True)

        print("🏁 [DEBUG] Product Creation Finished.", flush=True)
        return product

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
               # result = cloudinary.uploader.upload(color_image_file) # 🔥 ONDOA folder parameter ukitaka
                
                # 🔥 Chaguo bora: Weka folder ya 'product_variations'
                result = cloudinary.uploader.upload(color_image_file, folder="product_variations")# 🔥 Chaguo bora: Weka folder ya 'product_variations'


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