from rest_framework import serializers
import cloudinary.uploader 
import os
import urllib.parse
from django.conf import settings  # 🔥 ONGEZA HII MBELE!




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

    # 🔥 1. ONGEZA HII: Inakagua data kabla ya kuhifadhi
    def validate(self, data):
        # Angalia kama 'name' ipo
        if not data.get('name'):
            raise serializers.ValidationError({"name": "Jina la kategoria linahitajika!"})
        
        # Angalia kama 'sub_category' ipo (kwa sababu ni ForeignKey)
        if not data.get('sub_category'):
            raise serializers.ValidationError({"sub_category": "Sub category inahitajika!"})
        
        # Rudisha data kama hakuna tatizo
        return data

    # 🔥 2. ONGEZA HII: Inaboresha ujumbe wa makosa (Error Messages)
    def to_representation(self, instance):
        # Hii inabadilisha jinsi data inavyoonekana kwa Frontend
        representation = super().to_representation(instance)
        
        # 🔥 Hakikisha jina linatumwa (Ikiwa ni null, tumia 'Hakuna Jina')
        if not representation.get('name'):
            representation['name'] = "Hakuna Jina"
            
        # 🔥 Hakikisha 'name_sw' pia ipo
        if not representation.get('name_sw'):
            representation['name_sw'] = representation.get('name')
            
        return representation



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
    leaf_category_id = serializers.UUIDField(source='leaf_category.id', read_only=True)
    cover_image_url = serializers.SerializerMethodField()
    leaf_category_name = serializers.SerializerMethodField()  # ✅ ONGEZA HII
    discount = serializers.SerializerMethodField()

    leaf_category_name = serializers.SerializerMethodField()  # Ulikuwa nayo
    sub_category_name = serializers.SerializerMethodField()   # ✅ ONGEZA HII
    category_name = serializers.SerializerMethodField() 


    
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


        # ------------------------------------------------------------------
    # 🔥 1. LEAF CATEGORY NAME (Umeshakwisha)
    # ------------------------------------------------------------------
    def get_leaf_category_name(self, obj):
        if obj.leaf_category:
            return obj.leaf_category.name
        return None
    
    # ------------------------------------------------------------------
    # 🔥 2. SUB CATEGORY NAME (Imeongezwa)
    # ------------------------------------------------------------------
    def get_sub_category_name(self, obj):
        # Leaf inaungana na Subcategory
        if obj.leaf_category and obj.leaf_category.sub_category:
            return obj.leaf_category.sub_category.name
        return None

    # ------------------------------------------------------------------
    # 🔥 3. MAIN CATEGORY NAME (Imeongezwa)
    # ------------------------------------------------------------------
    def get_category_name(self, obj):
        # Subcategory inaungana na Category kuu (parent)
        if obj.leaf_category and obj.leaf_category.sub_category and obj.leaf_category.sub_category.category:
            return obj.leaf_category.sub_category.category.name
        return None

     # 🔥 ONGEZA HII METHOD
    def get_discount(self, obj):
        if obj.original_price and obj.price and obj.original_price > obj.price:
            return round(((obj.original_price - obj.price) / obj.original_price) * 100, 2)
        return 0

        # 🔥 KWA PICHA ZA COVER (Sahihi 100%)
        # ==========================================================
    # 🔥 DEBUGGING VERSION - KWA COVER IMAGES
    # ==========================================================
    def get_cover_image_url(self, obj):
        print(f"📸 [DEBUG] get_cover_image_url called for obj.id: {obj.id}", flush=True)
        
        if not obj.cover_image:
            print("  ⚠️ [DEBUG] obj.cover_image is None or empty", flush=True)
            return None
        
        # 1. Jaribu kupata Cloud Name
        CLOUD_NAME = settings.CLOUDINARY_STORAGE.get('CLOUD_NAME')
        if not CLOUD_NAME:
            CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
            
        if not CLOUD_NAME:
            print("❌ [ERROR] CLOUD_NAME is None! Check .env or settings.", flush=True)
            return None
        else:
            print(f"✅ [DEBUG] CLOUD_NAME found: {CLOUD_NAME}", flush=True)

        path = str(obj.cover_image)
        print(f"  📂 [DEBUG] Raw path from DB: {path}", flush=True)
        
        # 2. Logic ya path
        if path.startswith('product_media/') or path.startswith('product_variations/'):
            safe_path = path
            print(f"  ✅ Path is new style (product_media/). Using full path.", flush=True)
        elif path.startswith('product_covers/'):
            safe_path = path.split('/')[-1]
            print(f"  🔄 Path is old style (product_covers/). Extracted filename: {safe_path}", flush=True)
        else:
            safe_path = path
            print(f"  ℹ️ Path is unknown format. Using as is: {safe_path}", flush=True)

        safe_path = urllib.parse.quote(safe_path, safe='/')
        final_url = f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"
        print(f"✅ [SUCCESS] Final Cloudinary URL: {final_url}", flush=True)
        return final_url

    # ==========================================================
    # 🔥 DEBUGGING VERSION - KWA VARIATIONS (RANGI)
    # ==========================================================
    def get_color_image_url(self, obj):
        print(f"🎨 [DEBUG] get_color_image_url called for obj.id: {obj.id}", flush=True)
        
        if not obj.color_image:
            print("  ⚠️ [DEBUG] obj.color_image is None or empty", flush=True)
            return None
        
        # 1. Tafuta Cloud Name
        CLOUD_NAME = settings.CLOUDINARY_STORAGE.get('CLOUD_NAME')
        if not CLOUD_NAME:
            CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
            
        if not CLOUD_NAME:
            print("❌ [ERROR] CLOUD_NAME is None! Check .env or settings.", flush=True)
            return None
        else:
            print(f"✅ [DEBUG] CLOUD_NAME found: {CLOUD_NAME}", flush=True)

        path = str(obj.color_image)
        print(f"  📂 [DEBUG] Raw path from DB: {path}", flush=True)
        
        # 2. Logic ya path
        if path.startswith('product_variations/') or path.startswith('product_media/'):
            safe_path = path
            print(f"  ✅ Path is new style. Using full path.", flush=True)
        elif path.startswith('product_covers/'):
            safe_path = path.split('/')[-1]
            print(f"  🔄 Path is old style. Extracted filename: {safe_path}", flush=True)
        else:
            safe_path = path
            print(f"  ℹ️ Path is unknown format. Using as is: {safe_path}", flush=True)

        safe_path = urllib.parse.quote(safe_path, safe='/')
        final_url = f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"
        print(f"✅ [SUCCESS] Final Cloudinary URL: {final_url}", flush=True)
        return final_url

    def get_color_image_url(self, obj):
        if not obj.color_image:
            return None
        # 🔥 BADILISHA HAPA PIA:
        CLOUD_NAME = settings.CLOUDINARY_STORAGE.get('CLOUD_NAME')
        if not CLOUD_NAME:
            return None

        path = str(obj.color_image)
        if path.startswith('product_variations/') or path.startswith('product_media/'):
            safe_path = path
        elif path.startswith('product_covers/'):
            safe_path = path.split('/')[-1]
        else:
            safe_path = path

        safe_path = urllib.parse.quote(safe_path, safe='/')
        return f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"

     # ✅ ONGEZA HAPA (baada ya get_cover_image_url)
    def get_leaf_category_name(self, obj):
        if obj.leaf_category:
            return obj.leaf_category.name
        return None
    
    
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

    store_logo_url = serializers.SerializerMethodField()
    store_banner_url = serializers.SerializerMethodField()
    tin_image_url = serializers.SerializerMethodField()
    office_image_1_url = serializers.SerializerMethodField()
    office_image_2_url = serializers.SerializerMethodField()
    office_image_3_url = serializers.SerializerMethodField()
    owner_profile_id = serializers.UUIDField(source='owner.id', read_only=True)
    owner_id = serializers.UUIDField(source='owner.id', read_only=True)

    class Meta:
        model = StoreEngine
        fields = [
            'id', 'owner', 'owner_id', 'owner_profile_id',
            'store_name', 'store_slug', 'description',
            'status', 'is_active', 'is_verified', 'verification_status',
            'created_at',
            'store_logo', 'store_logo_url',
            'store_banner', 'store_banner_url',
            'tin_image', 'tin_image_url',
            'office_image_1', 'office_image_1_url',
            'office_image_2', 'office_image_2_url',
            'office_image_3', 'office_image_3_url',
            'category', 'category_id', 'category_name',
            'sub_category_ids', 'sub_categories',
            'phone_number', 'email', 'physical_address', 'city',
            'instagram_handle', 'whatsapp_number', 'twitter_handle', 'tiktok_handle',
            'youtube_link', 'google_maps_url',
            'business_type', 'tin_number', 'lead_time', 'moq',
            'packaging_type', 'supply_capacity', 'working_hours',
            'specialist_tags',
            'total_sales', 'average_rating',
            'store_index',
        ]
        read_only_fields = ['owner']

    # ------------------------------------------------------------------
    # 🔥 HELPER METHOD - KUUNDA CLOUDINARY URL
    # ------------------------------------------------------------------
    def _get_cloudinary_url(self, field_value, field_name, store_id):
        """Helper method to generate Cloudinary URL"""
        if not field_value:
            print(f"⚠️ [DEBUG] {field_name} haipo kwa store: {store_id}", flush=True)
            return None

        CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
        if not CLOUD_NAME:
            print("❌ [ERROR] CLOUDINARY_CLOUD_NAME haipo kwenye .env!", flush=True)
            return None

        public_id = str(field_value)
        safe_path = urllib.parse.quote(public_id)
        final_url = f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/v1/{safe_path}"

        print(f"✅ [DEBUG] {field_name} imeundwa: {final_url}", flush=True)
        return final_url

    # ------------------------------------------------------------------
    # 🔥 CATEGORY & SUBCATEGORY METHODS
    # ------------------------------------------------------------------
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
    # 🔥 URL METHODS (Zinatumia Helper)
    # ------------------------------------------------------------------
    def get_store_logo_url(self, obj):
        return self._get_cloudinary_url(obj.store_logo, 'store_logo_url', obj.id)

    def get_store_banner_url(self, obj):
        return self._get_cloudinary_url(obj.store_banner, 'store_banner_url', obj.id)

    def get_tin_image_url(self, obj):
        return self._get_cloudinary_url(obj.tin_image, 'tin_image_url', obj.id)

    def get_office_image_1_url(self, obj):
        if not obj.office_image_1:
            print(f"⚠️ [DEBUG] office_image_1 haipo kwa store: {obj.id}", flush=True)
            return None
        print(f"✅ [DEBUG] office_image_1 URL: {obj.office_image_1}", flush=True)
        return obj.office_image_1

    def get_office_image_2_url(self, obj):
        if not obj.office_image_2:
            print(f"⚠️ [DEBUG] office_image_2 haipo kwa store: {obj.id}", flush=True)
            return None
        print(f"✅ [DEBUG] office_image_2 URL: {obj.office_image_2}", flush=True)
        return obj.office_image_2

    def get_office_image_3_url(self, obj):
        if not obj.office_image_3:
            print(f"⚠️ [DEBUG] office_image_3 haipo kwa store: {obj.id}", flush=True)
            return None
        print(f"✅ [DEBUG] office_image_3 URL: {obj.office_image_3}", flush=True)
        return obj.office_image_3

    # ============================================================
    # 🔥 TO_INTERNAL_VALUE - Kukusanya Files
    # ============================================================
    def to_internal_value(self, data):
        request = self.context.get('request')

        print(f"🔍 [DEBUG] StoreSerializer to_internal_value called! Request FILES keys: {request.FILES.keys() if request else 'No Request'}", flush=True)

        self._store_logo = None
        self._store_banner = None
        self._tin_image = None
        self._office_images = []

        if request:
            self._store_logo = request.FILES.get('store_logo')
            self._store_banner = request.FILES.get('store_banner')
            self._tin_image = request.FILES.get('tin_image')
            self._office_images = request.FILES.getlist('office_images')

            print(f"🔍 [DEBUG] Store Logo received: {self._store_logo is not None}", flush=True)
            print(f"🔍 [DEBUG] Store Banner received: {self._store_banner is not None}", flush=True)
            print(f"🔍 [DEBUG] TIN Image received: {self._tin_image is not None}", flush=True)
            print(f"🔍 [DEBUG] Office Images count: {len(self._office_images)}", flush=True)

        return super().to_internal_value(data)

    # ============================================================
    # 🔥 CREATE METHOD
    # ============================================================
    def create(self, validated_data):
        import cloudinary.uploader
        import traceback
        request = self.context.get('request')
        user = request.user

        print("📦 [DEBUG] Starting Store Creation (Like ProductsEngine)...", flush=True)

        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            print("❌ [ERROR] Profile haipo!", flush=True)
            raise serializers.ValidationError({"owner": "Mtumiaji hana Profile. Tafadhali unda profile kwanza."})

        # 🔥 1. PAKUA CATEGORY_ID KUTOKA REQUEST
        category_id = request.data.get('category_id') or request.data.get('category')
        if category_id:
            validated_data['category_id'] = category_id
            print(f"✅ [DEBUG] Category ID imepakiwa: {category_id}", flush=True)

        # 🔥 2. PAKUA SUB_CATEGORY_IDS
        sub_category_ids = request.data.get('sub_category_ids')
        if sub_category_ids:
            import json
            if isinstance(sub_category_ids, str):
                try:
                    sub_category_ids = json.loads(sub_category_ids)
                except json.JSONDecodeError:
                    sub_category_ids = sub_category_ids.split(',')
            validated_data['sub_category_ids'] = sub_category_ids
            print(f"✅ [DEBUG] Sub Category IDs: {sub_category_ids}", flush=True)

        # 🔥 3. TOA PICHA KUTOKA self (Zilizokusanywa na to_internal_value)
        store_logo_file = self._store_logo
        store_banner_file = self._store_banner
        tin_image_file = self._tin_image
        office_images = self._office_images

        # 🔥 4. ONDOA FIELDS ZA PICHA KUTOKA validated_data
        validated_data.pop('store_logo', None)
        validated_data.pop('store_banner', None)
        validated_data.pop('tin_image', None)
        validated_data.pop('office_images', None)

        # 🔥 5. UNDA DUKA (BILA PICHA KWANZA)
        validated_data['owner'] = profile
        try:
            print("  🔧 [DEBUG] Creating StoreEngine instance...", flush=True)
            store = super().create(validated_data)
            print(f"  ✅ [DEBUG] Store created with ID: {store.id}", flush=True)
        except Exception as e:
            print("❌ [CRITICAL ERROR] Failed to create StoreEngine!", flush=True)
            print(traceback.format_exc(), flush=True)
            raise e

        # 🔥 6. PAKIA NA KUHIFADHI PICHA KWENYE CLOUDINARY
        # Store Logo
        if store_logo_file:
            print(f"  📸 [DEBUG] Attempting to upload Store Logo...", flush=True)
            try:
                result = cloudinary.uploader.upload(store_logo_file, folder="store_logos")
                store.store_logo = result['public_id']
                store.save(update_fields=['store_logo'])
                print(f"    ✅ Store Logo uploaded! Public ID: {result['public_id']}", flush=True)
            except Exception as e:
                print(f"❌ [ERROR] Store Logo upload failed: {e}", flush=True)
                print(traceback.format_exc(), flush=True)

        # Store Banner
        if store_banner_file:
            print(f"  📸 [DEBUG] Attempting to upload Store Banner...", flush=True)
            try:
                result = cloudinary.uploader.upload(store_banner_file, folder="store_banners")
                store.store_banner = result['public_id']
                store.save(update_fields=['store_banner'])
                print(f"    ✅ Store Banner uploaded! Public ID: {result['public_id']}", flush=True)
            except Exception as e:
                print(f"❌ [ERROR] Store Banner upload failed: {e}", flush=True)
                print(traceback.format_exc(), flush=True)

        # TIN Image
        if tin_image_file:
            print(f"  📸 [DEBUG] Attempting to upload TIN Image...", flush=True)
            try:
                result = cloudinary.uploader.upload(tin_image_file, folder="tin_verification")
                store.tin_image = result['public_id']
                store.save(update_fields=['tin_image'])
                print(f"    ✅ TIN Image uploaded! Public ID: {result['public_id']}", flush=True)
            except Exception as e:
                print(f"❌ [ERROR] TIN Image upload failed: {e}", flush=True)
                print(traceback.format_exc(), flush=True)

        # Office Images
        if office_images:
            print(f"  🏢 [DEBUG] Attempting to upload {len(office_images)} Office Images...", flush=True)
            if len(office_images) == 0:
                print("❌ [ERROR] Hakuna office images zilizopatikana!", flush=True)
            else:
                for i, file in enumerate(office_images[:3]):
                    try:
                        print(f"    - Uploading office image {i+1}...", flush=True)
                        result = cloudinary.uploader.upload(file, folder="store_offices")

                        if i == 0:
                            store.office_image_1 = result['secure_url']
                        elif i == 1:
                            store.office_image_2 = result['secure_url']
                        elif i == 2:
                            store.office_image_3 = result['secure_url']

                        store.save(update_fields=['office_image_1', 'office_image_2', 'office_image_3'])
                        print(f"      ✅ Office image {i+1} uploaded! URL: {result['secure_url']}", flush=True)

                    except Exception as e:
                        print(f"❌ [ERROR] Office image {i+1} failed: {e}", flush=True)
                        print(traceback.format_exc(), flush=True)

        print("🏁 [DEBUG] Store Creation Finished (Like ProductsEngine).", flush=True)
        return store


# ============================================================
# 🔥 PRODUCT VARIATION SERIALIZER (SAHIHI - Imeondoa read_only!)
# ============================================================
class ProductVariationSerializer(serializers.ModelSerializer):
    # 🔥 1. Hii ndiyo itatumwa kwa Frontend (URL kamili ya Cloudinary)
    color_image_url = serializers.SerializerMethodField()
    
    # 🔥 2. Hii inakubali File kutoka Frontend na kuihifadhi kwenye Cloudinary
    color_image_file = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = ProductVariation
        fields = '__all__'
        # ✅ MUHIMU SANA: Ondoa 'color_image' kwenye read_only_fields!
        read_only_fields = ['id', 'created_at']  

    def get_color_image_url(self, obj):
        if not obj.color_image:
            return None
        
        # Tafuta Cloud Name kwa usalama
        CLOUD_NAME = settings.CLOUDINARY_STORAGE.get('CLOUD_NAME')
        if not CLOUD_NAME:
            CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
        if not CLOUD_NAME:
            return None

        # ✅ SAHIHI: Tumia public_id moja kwa moja (sio kuongeza 'media/')
        safe_path = urllib.parse.quote(str(obj.color_image), safe='/')
        return f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"
    
    # 🔥 ONGEZA HII METHOD ili kuona ni data ipi inakosea kwenye 400!
    def validate(self, data):
        print("🔍 [VALIDATE] Data received:", data)
        print("🔍 [VALIDATE] Fields present:", data.keys())
        return data

    def create(self, validated_data):
        import traceback
        import cloudinary.uploader
        import cloudinary.api
        import cloudinary.exceptions

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
                result = cloudinary.uploader.upload(
                    color_image_file, 
                    folder="product_variations",
                    timeout=60
                )
                
                # ✅ Sasa hii itafanya kazi kwa sababu color_image HAIPO kwenye read_only!
                variation.color_image = result['public_id'] 
                variation.save(update_fields=['color_image'])
                
                print(f"  ✅ [DEBUG] Color Image uploaded! Public ID: {result['public_id']}")
            except Exception as e:
                print(f"❌ [ERROR] Color Image upload failed: {e}")
                print(traceback.format_exc())

        print("🏁 [DEBUG] ProductVariation creation finished.")
        return variation
