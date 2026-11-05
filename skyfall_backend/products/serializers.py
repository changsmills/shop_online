import traceback

from rest_framework import serializers
import os
import urllib.parse
from django.conf import settings  # 🔥 ONGEZA HII MBELE!
from PIL import Image, ImageOps
from io import BytesIO
from django.core.files.base import ContentFile
from pathlib import Path

import os
import uuid
import urllib.parse
from supabase import create_client, Client

# ============================================================
# 🔥 SUPABASE STORAGE CONFIGURATION
# ============================================================
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
BUCKET_NAME = "media"

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_to_supabase(file, folder="general"):
    """Inapakia faili kwenye Supabase Storage na kurudisha path."""
    if not file:
        return None
    file_extension = file.name.split('.')[-1]
    file_name = f"{folder}/{uuid.uuid4()}.{file_extension}"
    file.seek(0)
    file_content = file.read()
    try:
        supabase.storage.from_(BUCKET_NAME).upload(
            path=file_name,
            file=file_content,
            file_options={"content-type": file.content_type}
        )
        print(f"✅ [Supabase] Uploaded: {file_name}")
        return file_name
    except Exception as e:
        print(f"❌ [Supabase Upload Error]: {e}")
        return None

def get_supabase_url(path):
    """Inarudisha URL kamili ya picha kutoka Supabase."""
    if not path:
        return None
    path_str = str(path)
    if path_str.startswith("http"):
        return path_str
    try:
        res = supabase.storage.from_(BUCKET_NAME).get_public_url(path_str)
        return res
    except Exception as e:
        print(f"❌ [Supabase URL Error]: {e}")
        return None




from products.models import (
    Category, SubCategory, ProductsEngine, LeafCategory, Advertisement, 
    StoreEngine, ProductMedia, Message, Profile,
    ShippingMethod, Brand, Lead, ProductVariation  
)



def optimize_image_for_upload(image_file, quality=80, max_width=1920, max_height=1920):
    """
    Resize and compress uploaded image to WebP before Cloudinary upload.
    """

    if not image_file:
        return None

    image_file.seek(0)

    try:
        with Image.open(image_file) as img:

            # Rekebisha orientation ya picha kutoka simu
            img = ImageOps.exif_transpose(img)

            # Punguza dimensions bila kuharibu aspect ratio
            img.thumbnail(
                (max_width, max_height),
                Image.Resampling.LANCZOS
            )

            # Hifadhi transparency
            if img.mode in ("RGBA", "LA") or (
                img.mode == "P" and "transparency" in img.info
            ):
                img = img.convert("RGBA")
            else:
                img = img.convert("RGB")

            output = BytesIO()

            img.save(
                output,
                format="WEBP",
                quality=quality,
                method=6
            )

            original_size = image_file.size
            optimized_size = output.tell()

            output.seek(0)

            filename = Path(image_file.name).stem + ".webp"

            optimized_file = ContentFile(
                output.read(),
                name=filename
            )

            print(
                f"🖼️ Optimization: {original_size / 1024:.2f} KB "
                f"→ {optimized_size / 1024:.2f} KB",
                flush=True
            )

            return optimized_file

    except Exception as e:
        raise serializers.ValidationError(
            {"image": f"Image optimization failed: {str(e)}"}
        )

    finally:
        try:
            image_file.seek(0)
        except Exception:
            pass


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
# 🔥 PRODUCTS ENGINE SERIALIZER (SUPABASE STORAGE VERSION)
# ============================================================
class ProductsEngineSerializer(serializers.ModelSerializer):
    leaf_category_id = serializers.UUIDField(source='leaf_category.id', read_only=True)
    cover_image_url = serializers.SerializerMethodField()
    leaf_category_name = serializers.SerializerMethodField()
    discount = serializers.SerializerMethodField()
    sub_category_name = serializers.SerializerMethodField()
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

    # Inarudisha picha zilizopakiwa kwenye Response
    media = ProductMediaSerializer(many=True, read_only=True)

    class Meta:
        model = ProductsEngine
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'cover_image']

    # ------------------------------------------------------------------
    # 🔥 1. LEAF CATEGORY NAME
    # ------------------------------------------------------------------
    def get_leaf_category_name(self, obj):
        if obj.leaf_category:
            return obj.leaf_category.name
        return None
    
    # ------------------------------------------------------------------
    # 🔥 2. SUB CATEGORY NAME
    # ------------------------------------------------------------------
    def get_sub_category_name(self, obj):
        if obj.leaf_category and obj.leaf_category.sub_category:
            return obj.leaf_category.sub_category.name
        return None

    # ------------------------------------------------------------------
    # 🔥 3. MAIN CATEGORY NAME
    # ------------------------------------------------------------------
    def get_category_name(self, obj):
        if obj.leaf_category and obj.leaf_category.sub_category and obj.leaf_category.sub_category.category:
            return obj.leaf_category.sub_category.category.name
        return None

    # ------------------------------------------------------------------
    # 🔥 4. DISCOUNT
    # ------------------------------------------------------------------
    def get_discount(self, obj):
        if obj.original_price and obj.price and obj.original_price > obj.price:
            return round(((obj.original_price - obj.price) / obj.original_price) * 100, 2)
        return 0

    # ------------------------------------------------------------------
    # 🔥 5. COVER IMAGE URL (Supabase)
    # ------------------------------------------------------------------
    def get_cover_image_url(self, obj):
        # Tumia helper function yetu ya Supabase
        return get_supabase_url(obj.cover_image)

    # ------------------------------------------------------------------
    # 🔥 6. TO_INTERNAL_VALUE (Kukusanya Files)
    # ------------------------------------------------------------------
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

    # ------------------------------------------------------------------
    # 🔥 7. CREATE METHOD (Supabase Version)
    # ------------------------------------------------------------------
    def create(self, validated_data):
        import traceback

        print("📦 [DEBUG] Starting Product Creation...", flush=True)

        # Chukua faili kutoka self
        gallery_images = self._gallery_files
        cover_image = self._cover_image
        video_file = self._video_file
        color_image_files = self._color_image_files

        # Ondoa hizi fields kutoka validated_data
        validated_data.pop('gallery_images', None)
        validated_data.pop('cover_image', None)
        validated_data.pop('video_file', None)
        validated_data.pop('color_image_files', None)

        # 1. Unda bidhaa
        try:
            print("  🔧 [DEBUG] Creating ProductsEngine instance...", flush=True)
            product = super().create(validated_data)
            print(f"  ✅ [DEBUG] Product created with ID: {product.id}", flush=True)
        except Exception as e:
            print("❌ [CRITICAL ERROR] Failed to create ProductsEngine!", flush=True)
            print(traceback.format_exc(), flush=True)
            raise e

        # 2. Hifadhi Cover Image kwenye Supabase
        if cover_image:
            print(f"  📸 [DEBUG] Uploading Cover Image to Supabase...", flush=True)
            saved_path = upload_to_supabase(cover_image, folder="product_media")
            if saved_path:
                # Hifadhi path kwenye product.cover_image
                product.cover_image = saved_path
                product.save(update_fields=['cover_image'])
                
                # Hifadhi URL kamili kwenye ProductMedia
                public_url = get_supabase_url(saved_path)
                ProductMedia.objects.create(
                    product=product,
                    media_type='cover',
                    media_url=public_url,
                    display_order=0
                )
                print("  ✅ [DEBUG] Cover Image uploaded and saved to ProductMedia.", flush=True)

        # 3. Hifadhi Gallery Images kwenye Supabase
        if gallery_images:
            print(f"🖼️ [DEBUG] Uploading {len(gallery_images)} Gallery Images...", flush=True)
            for idx, img in enumerate(gallery_images):
                try:
                    # Optimize kwanza (tumia function iliyopo)
                    optimized_img = optimize_image_for_upload(img)
                    
                    saved_path = upload_to_supabase(optimized_img, folder="product_media")
                    if saved_path:
                        public_url = get_supabase_url(saved_path)
                        ProductMedia.objects.create(
                            product=product,
                            media_type='gallery',
                            media_url=public_url,
                            display_order=idx + 1
                        )
                        print(f"      ✅ Gallery image {idx+1} uploaded.", flush=True)
                except Exception as e:
                    print(f"❌ [ERROR] Gallery image {idx+1} failed: {e}", flush=True)

        # 4. Hifadhi Video kwenye Supabase
        if video_file:
            print(f"  🎬 [DEBUG] Uploading Video to Supabase...", flush=True)
            saved_path = upload_to_supabase(video_file, folder="product_media")
            if saved_path:
                public_url = get_supabase_url(saved_path)
                ProductMedia.objects.create(
                    product=product,
                    media_type='video',
                    media_url=public_url,
                    is_promo_video=True
                )
                print("  ✅ [DEBUG] Video uploaded.", flush=True)

        # 5. Hifadhi Color Images kwenye Supabase
        if color_image_files:
            print(f"  🎨 [DEBUG] Uploading {len(color_image_files)} Color Images...", flush=True)
            for file in color_image_files:
                saved_path = upload_to_supabase(file, folder="product_media")
                if saved_path:
                    public_url = get_supabase_url(saved_path)
                    ProductMedia.objects.create(
                        product=product,
                        media_type='color_image',
                        media_url=public_url,
                        display_order=10
                    )
                    print(f"    ✅ Color image uploaded.", flush=True)

        print("🏁 [DEBUG] Product Creation Finished.", flush=True)
        return product

    # ------------------------------------------------------------------
    # 🔥 8. TO_REPRESENTATION (Kuhakikisha store_id ipo)
    # ------------------------------------------------------------------
    def to_representation(self, instance):
        data = super().to_representation(instance)
        
        if hasattr(instance, 'store_id') and instance.store_id:
            data['store_id'] = str(instance.store_id)
        elif hasattr(instance, 'store') and instance.store:
            data['store_id'] = str(instance.store_id)
            data['store'] = str(instance.store_id)
            
        return data
    
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
            'store_index', 'latitude', 'longitude', 
        ]
        
        read_only_fields = ['owner']

    # ------------------------------------------------------------------
    # 🔥 1. CATEGORY & SUBCATEGORY METHODS (Hazibadiliki)
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
    # 🔥 2. URL METHODS (Zinatumia Supabase Sasa!)
    # ------------------------------------------------------------------
    def get_store_logo_url(self, obj):
        return get_supabase_url(obj.store_logo)

    def get_store_banner_url(self, obj):
        return get_supabase_url(obj.store_banner)

    def get_tin_image_url(self, obj):
        return get_supabase_url(obj.tin_image)

    def get_office_image_1_url(self, obj):
        # Kumbuka: office_image_1 ilikuwa inahifadhi URL kamili tangu zamani
        if not obj.office_image_1:
            return None
        # Kama ni ya Supabase (path), get_supabase_url itaitoa. Kama ni ya zamani (http), itairudisha.
        return get_supabase_url(obj.office_image_1)

    def get_office_image_2_url(self, obj):
        if not obj.office_image_2:
            return None
        return get_supabase_url(obj.office_image_2)

    def get_office_image_3_url(self, obj):
        if not obj.office_image_3:
            return None
        return get_supabase_url(obj.office_image_3)

    # ============================================================
    # 🔥 3. TO_INTERNAL_VALUE - Kukusanya Files
    # ============================================================
    def to_internal_value(self, data):
        request = self.context.get('request')
        
        self._store_logo = None
        self._store_banner = None
        self._tin_image = None
        self._office_images = []

        if request:
            self._store_logo = request.FILES.get('store_logo')
            self._store_banner = request.FILES.get('store_banner')
            self._tin_image = request.FILES.get('tin_image')
            self._office_images = request.FILES.getlist('office_images')

        return super().to_internal_value(data)

    # ============================================================
    # 🔥 4. CREATE METHOD (Supabase Version)
    # ============================================================
    def create(self, validated_data):
        import traceback
        request = self.context.get('request')
        user = request.user

        print("📦 [DEBUG] Starting Store Creation...", flush=True)

        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            raise serializers.ValidationError({"owner": "Mtumiaji hana Profile. Tafadhali unda profile kwanza."})

        # 1. Pakua Category ID
        category_id = request.data.get('category_id') or request.data.get('category')
        if category_id:
            validated_data['category_id'] = category_id

        # 2. Pakua Sub Category IDs
        sub_category_ids = request.data.get('sub_category_ids')
        if sub_category_ids:
            import json
            if isinstance(sub_category_ids, str):
                try:
                    sub_category_ids = json.loads(sub_category_ids)
                except json.JSONDecodeError:
                    sub_category_ids = sub_category_ids.split(',')
            validated_data['sub_category_ids'] = sub_category_ids

        # 3. Toa picha kutoka self
        store_logo_file = self._store_logo
        store_banner_file = self._store_banner
        tin_image_file = self._tin_image
        office_images = self._office_images

        # 4. Ondoa fields za picha kutoka validated_data
        validated_data.pop('store_logo', None)
        validated_data.pop('store_banner', None)
        validated_data.pop('tin_image', None)
        validated_data.pop('office_images', None)

        # 5. Unda Duka (Bila Picha Kwanza)
        validated_data['owner'] = profile
        try:
            store = super().create(validated_data)
            print(f"  ✅ [DEBUG] Store created with ID: {store.id}", flush=True)
        except Exception as e:
            print("❌ [CRITICAL ERROR] Failed to create StoreEngine!", flush=True)
            print(traceback.format_exc(), flush=True)
            raise e

        # 6. Pakia Picha kwenye Supabase
        # Store Logo
        if store_logo_file:
            saved_path = upload_to_supabase(store_logo_file, folder="store_logos")
            if saved_path:
                store.store_logo = saved_path
                store.save(update_fields=['store_logo'])
                print(f"    ✅ Store Logo uploaded to Supabase: {saved_path}", flush=True)

        # Store Banner
        if store_banner_file:
            saved_path = upload_to_supabase(store_banner_file, folder="store_banners")
            if saved_path:
                store.store_banner = saved_path
                store.save(update_fields=['store_banner'])
                print(f"    ✅ Store Banner uploaded to Supabase: {saved_path}", flush=True)

        # TIN Image
        if tin_image_file:
            saved_path = upload_to_supabase(tin_image_file, folder="tin_verification")
            if saved_path:
                store.tin_image = saved_path
                store.save(update_fields=['tin_image'])
                print(f"    ✅ TIN Image uploaded to Supabase: {saved_path}", flush=True)

        # Office Images
        if office_images:
            print(f"  🏢 [DEBUG] Uploading {len(office_images)} Office Images...", flush=True)
            for i, file in enumerate(office_images[:3]):
                saved_path = upload_to_supabase(file, folder="store_offices")
                if saved_path:
                    # Hifadhi URL kamili kwa sababu model inatumia CharField
                    public_url = get_supabase_url(saved_path)
                    if i == 0:
                        store.office_image_1 = public_url
                    elif i == 1:
                        store.office_image_2 = public_url
                    elif i == 2:
                        store.office_image_3 = public_url
            store.save(update_fields=['office_image_1', 'office_image_2', 'office_image_3'])
            print("      ✅ Office images uploaded.", flush=True)

        print("🏁 [DEBUG] Store Creation Finished.", flush=True)
        return store

# ============================================================
# 🔥 PRODUCT VARIATION SERIALIZER (Supabase Storage Version)
# ============================================================
class ProductVariationSerializer(serializers.ModelSerializer):
    # Hii ndiyo itatumwa kwa Frontend (URL kamili kutoka Supabase)
    color_image_url = serializers.SerializerMethodField()
    
    # Hii inakubali File kutoka Frontend
    color_image_file = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = ProductVariation
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

    def get_color_image_url(self, obj):
        # 🔥 Tumia helper function yetu ya Supabase
        return get_supabase_url(obj.color_image)
    
    # Hii method inasaidia kuona data inayokuja kwenye 400 errors
    def validate(self, data):
        print("🔍 [VALIDATE] Data received:", data)
        print("🔍 [VALIDATE] Fields present:", data.keys())
        return data

    def create(self, validated_data):
        import traceback

        print("🎨 [DEBUG] Creating ProductVariation...")

        # 1. Toa picha kutoka validated_data
        color_image_file = validated_data.pop('color_image_file', None)
        
        # 2. Unda variation (bila picha kwanza)
        try:
            variation = super().create(validated_data)
            print(f"  ✅ [DEBUG] Variation created with ID: {variation.id}")
        except Exception as e:
            print("❌ [CRITICAL ERROR] Failed to create ProductVariation!")
            print(traceback.format_exc())
            raise e

        # 3. Ikiwa picha ipo, ipakie Supabase Storage
        if color_image_file:
            print(f"  📸 [DEBUG] Uploading color_image for {variation.color_name} to Supabase...")

            try:
                # 1. Optimize picha kwanza (tumia function iliyopo)
                optimized_image = optimize_image_for_upload(
                    color_image_file,
                    quality=80,
                    max_width=1920,
                    max_height=1920
                )

                # 2. Upload picha iliyoboreshwa Supabase
                saved_path = upload_to_supabase(optimized_image, folder="product_variations")

                if saved_path:
                    # 3. Hifadhi path kwenye database
                    variation.color_image = saved_path
                    variation.save(update_fields=['color_image'])
                    print(f"  ✅ [DEBUG] Color Image uploaded to Supabase: {saved_path}")
                else:
                    print(f"❌ [SUPABASE ERROR] Color Image upload failed for variation {variation.id}")

            except Exception as e:
                print(f"❌ [ERROR] Color Image processing failed: {e}")
                print(traceback.format_exc())

        print("🏁 [DEBUG] ProductVariation creation finished.")
        return variation