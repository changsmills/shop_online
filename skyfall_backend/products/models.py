from django.db import models
from django.contrib.auth import get_user_model
import uuid

User = get_user_model()


# --- CATEGORY ---
class Category(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    icon_name = models.CharField(max_length=100)
    name = models.CharField(max_length=200)
    name_sw = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'categories'

    def __str__(self):
        return self.name


# --- SUB CATEGORY ---
class SubCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='subcategories')
    icon_name = models.CharField(max_length=100)
    name = models.CharField(max_length=200)
    name_sw = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'sub_categories'

    def __str__(self):
        return self.name


# --- PRODUCTS ENGINE ---
class ProductsEngine(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey('Profile', on_delete=models.SET_NULL, null=True, blank=True, related_name='products')
    store_id = models.UUIDField()
        # 🔥 1. Hii sasa inaenda kwenye SubCategory (category_id kwenye DB)
    sub_category = models.ForeignKey(
        SubCategory,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products_subcategory',
        db_column='category_id'  # 🔥 MUHIMU: Inahifadhi column ya DB kuwa 'category_id'
    )

    # 🔥 2. Hii inabaki kwenye Category (parent_category_id kwenye DB)
    parent_category = models.ForeignKey(
        Category,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='parent_products'
    )

    # 🔥 3. Hii inabaki kwenye LeafCategory (leaf_category_id kwenye DB)
    leaf_category = models.ForeignKey(
        'LeafCategory',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='products'
    )
    brand_id = models.UUIDField(null=True, blank=True)

    name = models.CharField(max_length=255)
    sku = models.CharField(max_length=100, blank=True, null=True)
    barcode = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(blank=True, null=True)

    cover_image = models.ImageField(upload_to='product_covers/', blank=True, null=True)

    price = models.DecimalField(max_digits=15, decimal_places=2)
    original_price = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    stock_quantity = models.IntegerField(default=0)
    compare_at_price = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    specifications = models.JSONField(default=dict, blank=True)
    price_tiers = models.JSONField(default=list, blank=True)
    colors = models.JSONField(default=list, blank=True)
    size_stock = models.JSONField(default=dict, blank=True)
    available_sizes = models.JSONField(default=list, blank=True)
    dimensions = models.JSONField(default=dict, blank=True)
    target_audience = models.JSONField(default=list, blank=True)

    is_wholesale = models.BooleanField(default=False)
    is_retail = models.BooleanField(default=True)
    is_approved = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)
    is_flash_sale = models.BooleanField(default=False)
    enable_sizes = models.BooleanField(default=True)
    has_colors = models.BooleanField(default=False)
    enable_pickup = models.BooleanField(default=False)

    shipping_method = models.CharField(max_length=50, default='fixed')
    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_rate_per_km = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_base_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_default_distance = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_dar_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_outside_dar_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    shipping_remote_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    total_stock_cost = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    expected_total_profit = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    maintenance_fee = models.DecimalField(max_digits=15, decimal_places=2, default=0)

    gender = models.CharField(max_length=50, blank=True, null=True)
    warranty_months = models.IntegerField(default=0)
    weight = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    weight_unit = models.CharField(max_length=10, blank=True, null=True)
    store_address = models.TextField(blank=True, null=True)
    material = models.CharField(max_length=255, blank=True, null=True)
    moq = models.IntegerField(default=1)
    views = models.IntegerField(default=0)
    order_count = models.IntegerField(default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    total_reviews = models.IntegerField(default=0)
    size_format = models.CharField(max_length=50, default='standard')
    condition = models.CharField(max_length=50, default='new')
    engine_index = models.IntegerField(default=0)
    price_per_meter = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    price_per_foot = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    sale_end_date = models.DateTimeField(null=True, blank=True)
    offer_started_at = models.DateTimeField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.UUIDField(null=True, blank=True)
    fee_due_date = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'products_engines'

    def __str__(self):
        return self.name


# --- LEAF CATEGORY ---
class LeafCategory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sub_category = models.ForeignKey(SubCategory, on_delete=models.CASCADE, related_name='leaf_categories')
    created_at = models.DateTimeField(auto_now_add=True)
    name = models.CharField(max_length=255)
    name_sw = models.CharField(max_length=255, blank=True, null=True)

    require_gender = models.BooleanField(default=False)
    require_size = models.BooleanField(default=False)
    color_required = models.BooleanField(default=False)
    warranty_required = models.BooleanField(default=False)
    weight_required = models.BooleanField(default=False)
    dimensions_required = models.BooleanField(default=False)
    bulk_pricing_tiers = models.BooleanField(default=False)

    min_stock_warning = models.IntegerField(default=5)

    measurement_unit = models.CharField(max_length=50, blank=True, null=True)
    size_format = models.CharField(max_length=50, blank=True, null=True)
    material_type = models.CharField(max_length=100, blank=True, null=True)
    icon_name = models.CharField(max_length=100, blank=True, null=True)
    color_hex = models.CharField(max_length=10, blank=True, null=True)
    meta_title = models.CharField(max_length=255, blank=True, null=True)
    meta_description = models.TextField(blank=True, null=True)

    condition_options = models.JSONField(default=list, blank=True, null=True)
    custom_fields = models.JSONField(default=dict, blank=True, null=True)
    specs = models.JSONField(default=list, blank=True, null=True)

    class Meta:
        db_table = 'leaf_categories'

    def __str__(self):
        return self.name


# --- PROFILE ---
class Profile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True, related_name='profile')
    full_name = models.CharField(max_length=255)
    avatar_url = models.URLField(max_length=500, blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    username = models.CharField(max_length=150, blank=True, null=True, unique=True)
    bio = models.TextField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    role = models.CharField(max_length=50, blank=True, null=True)

    class Meta:
        db_table = 'profiles'

    def __str__(self):
        return self.full_name or self.username or str(self.id)


# --- PRODUCT VARIATION ---
class ProductVariation(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(ProductsEngine, on_delete=models.CASCADE, related_name='variations')
    sku = models.CharField(max_length=100, blank=True, null=True)
    color_name = models.CharField(max_length=100, blank=True, null=True)
    color_image = models.URLField(max_length=500, blank=True, null=True)
    size_value = models.CharField(max_length=50, blank=True, null=True)
    price = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    stock_quantity = models.IntegerField(default=0)
    total_stock = models.IntegerField(default=0)
    marketplace_price = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    marketplace_stock = models.IntegerField(default=0)
    marketplace_image = models.URLField(max_length=500, blank=True, null=True)

    size_stock = models.JSONField(default=dict, blank=True)
    variant_specifications = models.JSONField(default=dict, blank=True)
    variant_images_array = models.JSONField(default=list, blank=True)
    attributes = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'product_variations'

    def __str__(self):
        return self.sku or f"Variation of {self.product.name}"

# --- PRODUCT MEDIA ---
class ProductMedia(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(ProductsEngine, on_delete=models.CASCADE, related_name='media')
    media_type = models.CharField(max_length=20)  # 'cover', 'gallery', 'video', 'color_image'
    
    # 🔥 MUHIMU: Tumia URLField kwa sababu Cloudinary inatengeneza URL!
    # media_file haihitajiki kwa sababu hatuhifadhi faili kwenye server ya Django.
    media_url = models.URLField(max_length=500, blank=True, null=True) 
    
    display_order = models.IntegerField(default=0)
    is_promo_video = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'product_media'

    def __str__(self):
        return f"{self.media_type} for {self.product.name}"

# --- ORDER ---
class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    customer = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True, blank=True, related_name='orders')
    store_id = models.UUIDField()
    status = models.CharField(max_length=50)
    order_number = models.CharField(max_length=50, unique=True)
    customer_location = models.TextField(blank=True, null=True)
    customer_feedback = models.TextField(blank=True, null=True)
    payment_method = models.CharField(max_length=50, blank=True, null=True)
    shipping_method = models.CharField(max_length=100, blank=True, null=True)
    shipping_fee = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    grand_total = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    total_items = models.IntegerField(default=0)
    customer_rating = models.DecimalField(max_digits=3, decimal_places=1, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, null=True, blank=True)
    updated_at = models.DateTimeField(null=True, blank=True)
    working_date = models.DateTimeField(null=True, blank=True)
    feedback_date = models.DateTimeField(null=True, blank=True)
    day_of_week = models.CharField(max_length=20, blank=True, null=True)
    fiscal_year = models.CharField(max_length=20, blank=True, null=True)
    month_year = models.CharField(max_length=20, blank=True, null=True)

    class Meta:
        db_table = 'orders'

    def __str__(self):
        return self.order_number or str(self.id)


# --- ORDER ITEM ---
class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    variant = models.ForeignKey(ProductVariation, on_delete=models.SET_NULL, null=True, blank=True, related_name='order_items')
    product = models.ForeignKey(ProductsEngine, on_delete=models.SET_NULL, null=True, blank=True, related_name='order_items')
    product_name = models.CharField(max_length=255, blank=True, null=True)
    sku = models.CharField(max_length=100, blank=True, null=True)
    category_name = models.CharField(max_length=255, blank=True, null=True)
    unit_price = models.DecimalField(max_digits=15, decimal_places=2)
    quantity = models.IntegerField(default=1)
    subtotal = models.DecimalField(max_digits=15, decimal_places=2)
    discount_amount = models.DecimalField(max_digits=15, decimal_places=2, default=0, blank=True, null=True)
    selected_color = models.CharField(max_length=100, blank=True, null=True)
    selected_size = models.CharField(max_length=50, blank=True, null=True)
    product_image = models.URLField(max_length=500, blank=True, null=True)

    class Meta:
        db_table = 'order_items'

    def __str__(self):
        return f"{self.quantity} x {self.product_name or 'Bidhaa'}"


# --- MESSAGE ---
class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='sent_messages')
    receiver = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='received_messages')
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True, related_name='messages')
    content = models.TextField()
    is_read = models.BooleanField(default=False, null=True, blank=True)
    created_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'messages'

    def __str__(self):
        return f"{self.sender} -> {self.receiver}: {self.content[:20]}"


# --- DISPUTE ---
class Dispute(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='disputes')
    customer = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='disputes')
    product = models.ForeignKey(ProductsEngine, on_delete=models.SET_NULL, null=True, blank=True, related_name='disputes')
    store_id = models.UUIDField()
    product_name = models.CharField(max_length=255)
    reason = models.CharField(max_length=255)
    description = models.TextField()
    status = models.CharField(max_length=50, default='open')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'disputes'

    def __str__(self):
        return f"Dispute for Order {self.order.order_number} - {self.status}"


# --- ADVERTISEMENT ---
class Advertisement(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='advertisements')
    store_id = models.UUIDField()
    business_name = models.CharField(max_length=255)
    ad_type = models.CharField(max_length=50)
    description = models.TextField(blank=True, null=True)
    media_url = models.URLField(max_length=500, null=True, blank=True)
    media_type = models.CharField(max_length=50)
    status = models.CharField(max_length=50, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    rejected_at = models.DateTimeField(null=True, blank=True)
    rejection_reason = models.TextField(blank=True, null=True)
    approved_by = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_ads')
    rejected_by = models.ForeignKey(Profile, on_delete=models.SET_NULL, null=True, blank=True, related_name='rejected_ads')

    class Meta:
        db_table = 'advertisements'

    def __str__(self):
        return f"{self.business_name} - {self.ad_type}"


# --- ADMIN ---
class Admin(models.Model):
    id = models.OneToOneField(Profile, on_delete=models.CASCADE, primary_key=True, related_name='admin_profile')
    created_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'admins'

    def __str__(self):
        return f"Admin: {self.id.full_name or self.id.username}"


# --- STORE ENGINE ---
class StoreEngine(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    owner = models.ForeignKey(Profile, on_delete=models.CASCADE, related_name='stores')

    is_verified = models.BooleanField(default=False)
    business_type = models.CharField(max_length=100, blank=True, null=True)
    tin_number = models.CharField(max_length=50, blank=True, null=True)
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    physical_address = models.TextField(blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    lead_time = models.CharField(max_length=100, blank=True, null=True)
    moq = models.CharField(max_length=100, blank=True, null=True)

    tin_image = models.ImageField(upload_to='tin_verification/', blank=True, null=True)

    google_maps_url = models.URLField(max_length=500, blank=True, null=True)
    packaging_type = models.CharField(max_length=100, blank=True, null=True)
    supply_capacity = models.CharField(max_length=100, blank=True, null=True)

    store_name = models.CharField(max_length=255)
    store_slug = models.CharField(max_length=255, blank=True, null=True)

    store_banner = models.ImageField(upload_to='store_banners/', blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    store_logo = models.ImageField(upload_to='store_logos/', blank=True, null=True)

    instagram_handle = models.CharField(max_length=100, blank=True, null=True)
    whatsapp_number = models.CharField(max_length=50, blank=True, null=True)
    specialist_tags = models.JSONField(default=list, blank=True)
    youtube_link = models.URLField(max_length=500, blank=True, null=True)
    status = models.CharField(max_length=50, default='active')
    twitter_handle = models.CharField(max_length=100, blank=True, null=True)
    tiktok_handle = models.CharField(max_length=100, blank=True, null=True)
    working_hours = models.CharField(max_length=255, blank=True, null=True)
    is_active = models.BooleanField(default=True)

    office_image_1 = models.CharField(max_length=500, blank=True, null=True) 
    office_image_2 = models.CharField(max_length=500, blank=True, null=True)
    office_image_3 = models.CharField(max_length=500, blank=True, null=True)

    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='stores')
    sub_category_ids = models.JSONField(default=list, blank=True)

    store_index = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    total_sales = models.DecimalField(max_digits=15, decimal_places=2, default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    verification_status = models.CharField(max_length=50, default='pending')

    class Meta:
        db_table = 'stores_engine'

    def __str__(self):
        return self.store_name


# ============================================================
# 🔥 MODELS ZILIZOKOSEA ZIMEONGEWA HAPA CHINI (AFTER StoreEngine)
# ============================================================

# --- SHIPPING METHOD ---
class ShippingMethod(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store = models.ForeignKey(StoreEngine, on_delete=models.CASCADE, related_name='shipping_methods')
    label = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    price_local = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    price_national = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'shipping_methods'

    def __str__(self):
        return self.label


# --- BRAND ---
class Brand(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    logo = models.ImageField(upload_to='brands/', blank=True, null=True)

    class Meta:
        db_table = 'brands'

    def __str__(self):
        return self.name


# --- LEAD ---
class Lead(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    store = models.ForeignKey(StoreEngine, on_delete=models.CASCADE, related_name='leads')
    customer_name = models.CharField(max_length=255)
    email = models.EmailField()
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'leads'

    def __str__(self):
        return f"{self.customer_name} - {self.store}"