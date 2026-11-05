from rest_framework import serializers
import os
import urllib.parse
import uuid
from supabase import create_client, Client

# ============================================================
# 🔥 SUPABASE STORAGE CONFIGURATION
# ============================================================
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
BUCKET_NAME = "media"  # Badilisha kama jina la bucket yako ni tofauti

# Anzisha Supabase Client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def upload_to_supabase(file, folder="general"):
    """Inapakia faili kwenye Supabase Storage na kurudisha path."""
    if not file:
        return None
    
    # Tengeneza jina la kipekee la faili
    file_extension = file.name.split('.')[-1]
    file_name = f"{folder}/{uuid.uuid4()}.{file_extension}"
    
    # Soma faili
    file.seek(0)
    file_content = file.read()
    
    try:
        # Pakia Supabase
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
    
    # 🔥 Kama ni picha ya zamani ya Cloudinary (inaanza na http au ina 'cloudinary'), irudishe kama ilivyo
    if path_str.startswith("http"):
        return path_str
    
    # Kama ni public_id ya Cloudinary ya zamani (haina http), tengeneza URL ya Cloudinary
    # (Hii inasaidia picha za zamani zisionekane zimevunjika)
    if not path_str.startswith("product_") and not path_str.startswith("store_") and not path_str.startswith("profile_") and not path_str.startswith("chat_") and not path_str.startswith("advertisements"):
        CLOUD_NAME = os.getenv('CLOUDINARY_CLOUD_NAME')
        if CLOUD_NAME:
            safe_path = urllib.parse.quote(path_str, safe='/')
            return f"https://res.cloudinary.com/{CLOUD_NAME}/image/upload/{safe_path}"

    try:
        # Tengeneza public URL kutoka kwenye path iliyohifadhiwa (mpya ya Supabase)
        res = supabase.storage.from_(BUCKET_NAME).get_public_url(path_str)
        return res
    except Exception as e:
        print(f"❌ [Supabase URL Error]: {e}")
        return None
    
from django.conf import settings  # 🔥 MUHIMU!


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
    # Hii inakubali File kutoka Frontend
    media_file = serializers.FileField(write_only=True, required=False)
    
    class Meta:
        model = Advertisement
        fields = '__all__'
        # ✅ Tunasoma 'media_url' kwa sababu backend inaandika URL kamili hapo
        read_only_fields = ['user', 'created_at', 'updated_at', 'status']

    def create(self, validated_data):
        # 1. Toa media_file kutoka kwenye data
        media_file = validated_data.pop('media_file', None)
        
        # 2. Unda advertisement kwanza bila picha
        advertisement = Advertisement.objects.create(**validated_data)
        
        # 3. Ikiwa kuna file, pakia Supabase
        if media_file:
            print(f"📸 [DEBUG] Uploading advertisement media: {media_file.name}")
            
            # Tumia helper function yetu ya Supabase
            # (Tumia folder 'advertisements' au lolote unalopenda)
            saved_path = upload_to_supabase(media_file, folder="advertisements")
            
            if saved_path:
                # Hifadhi URL kamili ya Supabase kwenye database
                advertisement.media_url = get_supabase_url(saved_path)
                advertisement.save(update_fields=['media_url'])
                print(f"✅ [Supabase] Advertisement media uploaded: {advertisement.media_url}")
            else:
                print(f"❌ [Supabase] Advertisement media upload failed for ad {advertisement.id}")
        
        return advertisement

class StoreEngineSerializer(serializers.ModelSerializer):
    sub_categories = serializers.SerializerMethodField()
    category_name = serializers.SerializerMethodField()

    # 🔥 Ongeza fields hizi za kupokea picha kutoka Frontend
    store_logo = serializers.ImageField(write_only=True, required=False)
    store_banner = serializers.ImageField(write_only=True, required=False)
    tin_image = serializers.ImageField(write_only=True, required=False)
    office_images = serializers.ListField(
        child=serializers.ImageField(), write_only=True, required=False
    )

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
        # 1. Toa picha zote kutoka validated_data
        store_logo_file = validated_data.pop('store_logo', None)
        store_banner_file = validated_data.pop('store_banner', None)
        tin_image_file = validated_data.pop('tin_image', None)
        office_images_files = validated_data.pop('office_images', [])

        request = self.context.get('request')
        user = request.user
        try:
            profile = Profile.objects.get(user=user)
        except Profile.DoesNotExist:
            raise serializers.ValidationError({"owner": "Mtumiaji hana Profile. Tafadhali unda profile kwanza."})
        
        validated_data['owner'] = profile
        store = super().create(validated_data)

        # 2. Pakia picha kwenye Supabase na hifadhi PATH (sio URL kamili)
        if store_logo_file:
            path = upload_to_supabase(store_logo_file, folder="store_logos")
            if path: 
                store.store_logo = path
                store.save(update_fields=['store_logo'])

        if store_banner_file:
            path = upload_to_supabase(store_banner_file, folder="store_banners")
            if path: 
                store.store_banner = path
                store.save(update_fields=['store_banner'])

        if tin_image_file:
            path = upload_to_supabase(tin_image_file, folder="tin_verification")
            if path: 
                store.tin_image = path
                store.save(update_fields=['tin_image'])

        if office_images_files:
            for i, file in enumerate(office_images_files[:3]):
                path = upload_to_supabase(file, folder="store_offices")
                if path:
                    # Hifadhi URL kamili kwa sababu model inatumia CharField
                    full_url = get_supabase_url(path)
                    if i == 0: store.office_image_1 = full_url
                    elif i == 1: store.office_image_2 = full_url
                    elif i == 2: store.office_image_3 = full_url
            store.save(update_fields=['office_image_1', 'office_image_2', 'office_image_3'])

        return store

class ProductMediaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductMedia
        fields = '__all__'

class ProfileSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    
    # 🔥 Hii inakubali Picha (File) kutoka Frontend!
    avatar_file = serializers.ImageField(write_only=True, required=False)

    class Meta:
        model = Profile
        fields = ['id', 'email', 'full_name', 'username', 'bio', 'role', 'is_otp_verified', 'user_id', 'avatar_url', 'avatar_file']
        
        read_only_fields = ['id', 'email', 'role', 'is_otp_verified', 'user_id', 'avatar_url']

    # 🔥 Hii method inachukua data, ikapokea picha inaipakia kwenye Supabase, kisha inahifadhi URL kwenye DB!
    def update(self, instance, validated_data):
        # Toa picha kutoka validated_data (kwa sababu si ya database moja kwa moja)
        avatar_file = validated_data.pop('avatar_file', None)
        
        # Sasisha maandishi
        instance.full_name = validated_data.get('full_name', instance.full_name)
        instance.username = validated_data.get('username', instance.username)
        instance.bio = validated_data.get('bio', instance.bio)
        
        # Kama kuna picha mpya, ipakie kwenye Supabase Storage
        if avatar_file:
            saved_path = upload_to_supabase(avatar_file, folder="profile_avatars")
            if saved_path:
                # Hifadhi URL kamili ya Supabase kwenye database
                instance.avatar_url = get_supabase_url(saved_path)
                print(f"✅ [Supabase] Profile avatar uploaded: {instance.avatar_url}")
            else:
                raise serializers.ValidationError({"avatar_file": "Imeshindikana kupakia picha. Tafadhali jaribu tena."})
        
        instance.save()
        return instance

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
    
    def create(self, validated_data):
        import traceback

        print("🎨 [DEBUG] Creating ProductVariation...")

        # 1. Toa picha kutoka validated_data
        color_image_file = validated_data.pop('color_image_file', None)
        
        # 2. Validation ya msingi (Ukubwa na Empty file)
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

        # 3. Unda variation (bila picha kwanza)
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

        # 4. Ikiwa picha ipo, ipakie Supabase Storage
        if color_image_file:
            print(f"  📸 [DEBUG] Uploading color_image for {variation.color_name} to Supabase...")
            
            # Tumia helper function yetu
            saved_path = upload_to_supabase(color_image_file, folder="product_variations")
            
            if saved_path:
                # 5. Hifadhi path (mfano: product_variations/uuid.jpg) kwenye database
                variation.color_image = saved_path
                variation.save(update_fields=['color_image'])
                
                print(f"  ✅ [DEBUG] Color Image uploaded and saved! Path: {saved_path}")
                print(f"  🔗 [DEBUG] Full Supabase URL: {get_supabase_url(saved_path)}")
            else:
                print(f"❌ [SUPABASE ERROR] Color Image upload failed for variation {variation.id}")
                # Hapa unaweza kuamua kurudisha error au kuendelea bila picha
                # raise serializers.ValidationError({"color_image_file": "Imeshindikana kupakia picha Supabase."})

        print("🏁 [DEBUG] ProductVariation creation finished.")
        return variation

 # ============================================================
 # 🔥 SERIALIZERS MPYA ZA ORDERS NA ORDER ITEMS
 # ============================================================

# api/serializers.py

class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    # 🔥 1. Customer info (kutoka FK)
    customer_name = serializers.SerializerMethodField()
    customer_email = serializers.SerializerMethodField()
    customer_phone = serializers.SerializerMethodField()
    
    # 🔥 2. Items za order
    items = OrderItemSerializer(source='items', many=True, read_only=True)
    
    # 🔥 3. Payment (latest payment for this order)
    payment = serializers.SerializerMethodField()
    
    # 🔥 4. Dispute (latest dispute)
    dispute = serializers.SerializerMethodField()
    
    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['customer']
    
    def get_customer_name(self, obj):
        """Pata jina la mteja kutoka Profile"""
        if obj.customer:
            return obj.customer.full_name or obj.customer.username or 'N/A'
        # Fallback: parse from customer_location
        if obj.customer_location:
            parts = obj.customer_location.split('|')
            if len(parts) > 0:
                return parts[0].strip()
        return 'N/A'
    
    def get_customer_email(self, obj):
        """Pata email ya mteja"""
        if obj.customer and obj.customer.user:
            return obj.customer.user.email or 'N/A'
        return 'N/A'
    
    def get_customer_phone(self, obj):
        """Pata simu - angalia Profile kwanza, kisha parse kutoka customer_location"""
        if obj.customer and obj.customer.phone:
            return obj.customer.phone
        
        # Fallback: parse kutoka customer_location
        # Format: "chacha magige | Gongo la mboto, House No. 56 | Simu: 0610768845"
        if obj.customer_location:
            parts = obj.customer_location.split('|')
            for part in parts:
                if 'Simu:' in part or 'Phone:' in part:
                    phone = part.replace('Simu:', '').replace('Phone:', '').strip()
                    return phone
        return 'N/A'
    
    def get_payment(self, obj):
        """Pata payment ya order hii (kama Payment model ipo)"""
        try:
            from api.models import Payment  # au jina la model yako
            payment = Payment.objects.filter(order_id=obj.id).first()
            if payment:
                return {
                    'id': str(payment.id),
                    'amount': str(payment.amount),
                    'status': payment.status,
                    'method': payment.method or obj.payment_method,
                    'transaction_id': getattr(payment, 'transaction_id', None),
                    'paid_at': payment.paid_at,
                }
        except Exception as e:
            pass
        
        # Fallback: tengeneza kutoka Order fields
        return {
            'method': obj.payment_method or 'N/A',
            'status': 'paid' if obj.status in ['received', 'approved', 'completed'] else 'pending',
            'amount': str(obj.grand_total),
        }
    
    def get_dispute(self, obj):
        """Pata dispute ya order hii"""
        try:
            from api.models import Dispute
            dispute = Dispute.objects.filter(order=obj).first()
            if dispute:
                return {
                    'id': str(dispute.id),
                    'reason': dispute.reason,
                    'status': dispute.status,
                    'description': dispute.description,
                    'created_at': dispute.created_at,
                }
        except Exception:
            pass
        return None


class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.SerializerMethodField()
    receiver_name = serializers.SerializerMethodField()
    sender_avatar = serializers.SerializerMethodField()
    receiver_avatar = serializers.SerializerMethodField()
    sender_id = serializers.UUIDField(read_only=True)
    receiver_id = serializers.UUIDField(read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'sender', 'receiver', 'sender_id', 'receiver_id', 
                 'content','image', 'created_at', 'is_read', 'sender_name', 'receiver_name', 'sender_avatar', 'receiver_avatar']

        read_only_fields = ['image']  

    def get_sender_name(self, obj):
        # 🔥 LAZIMA: Angalia kama kuna store kwanza!
        if obj.sender and hasattr(obj.sender, 'store'):
            return obj.sender.store.store_name  # Hii inarudisha Jina la Store!
        return obj.sender.full_name if obj.sender else None
    
    def get_receiver_name(self, obj):
        # 🔥 LAZIMA: Angalia kama kuna store kwanza!
        if obj.receiver and hasattr(obj.receiver, 'store'):
            return obj.receiver.store.store_name  # Hii inarudisha Jina la Store!
        return obj.receiver.full_name if obj.receiver else None

    def get_sender_avatar(self, obj):
        # 🔥 BADILISHA HAPA: Tumia get_supabase_url
        if obj.sender:
            if hasattr(obj.sender, 'store') and obj.sender.store:
                return get_supabase_url(obj.sender.store.store_logo)
            return get_supabase_url(obj.sender.avatar_url)
        return None

    def get_receiver_avatar(self, obj):
        # 🔥 BADILISHA HAPA: Tumia get_supabase_url
        if obj.receiver:
            if hasattr(obj.receiver, 'store') and obj.receiver.store:
                return get_supabase_url(obj.receiver.store.store_logo)
            return get_supabase_url(obj.receiver.avatar_url)
        return None