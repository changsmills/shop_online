import os
import django
import requests
import uuid
from supabase import create_client, Client

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'skyfall_backend.settings')
django.setup()

from products.models import ProductsEngine, ProductMedia, StoreEngine, Profile, Advertisement, Message, ProductVariation

# Supabase Client
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_KEY")
BUCKET_NAME = "media"
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

def upload_to_supabase_from_url(image_url, folder="migrated"):
    """Inapakua picha kutoka URL (Cloudinary) na kuipakia Supabase."""
    if not image_url or not str(image_url).startswith("http"):
        return None
    
    try:
        # Pakua picha kutoka Cloudinary
        response = requests.get(image_url, timeout=30)
        response.raise_for_status()
        
        # Tengeneza jina la faili
        file_extension = image_url.split('.')[-1].split('?')[0] if '.' in image_url else 'jpg'
        file_name = f"{folder}/{uuid.uuid4()}.{file_extension}"
        
        # Pakia Supabase
        supabase.storage.from_(BUCKET_NAME).upload(
            path=file_name,
            file=response.content,
            file_options={"content-type": response.headers.get('Content-Type', 'image/jpeg')}
        )
        print(f"✅ Imepakiwa: {file_name}")
        return file_name
    except Exception as e:
        print(f"❌ Imeshindikana {image_url}: {e}")
        return None

def migrate_field(model_class, field_name, folder, is_url_field=False):
    """Inahamisha picha za field fulani kutoka Cloudinary kwenda Supabase."""
    print(f"\n🔄 Inahamisha {model_class.__name__}.{field_name}...")
    
    # Pata vitu vyote ambavyo vina picha (vinavyoanza na http)
    items = model_class.objects.filter(**{f"{field_name}__startswith": "http"})
    
    count = 0
    for item in items:
        current_value = getattr(item, field_name)
        if current_value and str(current_value).startswith("http"):
            new_path = upload_to_supabase_from_url(current_value, folder=folder)
            if new_path:
                if is_url_field:
                    # Kama ni URLField, hifadhi URL kamili
                    new_value = supabase.storage.from_(BUCKET_NAME).get_public_url(new_path)
                else:
                    # Kama ni ImageField, hifadhi path tu
                    new_value = new_path
                
                setattr(item, field_name, new_value)
                item.save(update_fields=[field_name])
                count += 1
    
    print(f"✅ {count} picha za {model_class.__name__}.{field_name} zimehamishwa.")

if __name__ == "__main__":
    print("🚀 Kuanza kuhamisha picha kutoka Cloudinary kwenda Supabase...")
    
    # 1. Product Cover Images
    migrate_field(ProductsEngine, 'cover_image', folder='product_media')
    
    # 2. Product Media
    migrate_field(ProductMedia, 'media_url', folder='product_media', is_url_field=True)
    
    # 3. Store Images
    migrate_field(StoreEngine, 'store_logo', folder='store_logos')
    migrate_field(StoreEngine, 'store_banner', folder='store_banners')
    migrate_field(StoreEngine, 'tin_image', folder='tin_verification')
    migrate_field(StoreEngine, 'office_image_1', folder='store_offices', is_url_field=True)
    migrate_field(StoreEngine, 'office_image_2', folder='store_offices', is_url_field=True)
    migrate_field(StoreEngine, 'office_image_3', folder='store_offices', is_url_field=True)
    
    # 4. Profile Avatars
    migrate_field(Profile, 'avatar_url', folder='profile_avatars', is_url_field=True)
    
    # 5. Advertisements
    migrate_field(Advertisement, 'media_url', folder='advertisements', is_url_field=True)
    
    # 6. Messages
    migrate_field(Message, 'image', folder='chat_images', is_url_field=True)
    
    # 7. Product Variations
    migrate_field(ProductVariation, 'color_image', folder='product_variations')
    
    print("\n🎉 Uhamishaji umekamilika!")