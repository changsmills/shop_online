--
-- PostgreSQL database dump
--

\restrict 0Y85dglpBi1BlkV5OpO8GDjoT2uhHSamU1fb23GmRlJAACxkU0BpKn7b5p1ARJJ

-- Dumped from database version 18.6 (ac70818)
-- Dumped by pg_dump version 18.6

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP POLICY IF EXISTS "Allow public read sub_categories" ON "public"."sub_categories";
DROP POLICY IF EXISTS "Allow public read leaf_categories" ON "public"."leaf_categories";
DROP POLICY IF EXISTS "Allow public read categories" ON "public"."categories";
ALTER TABLE IF EXISTS ONLY "public"."users_user_user_permissions" DROP CONSTRAINT IF EXISTS "users_user_user_permissions_user_id_20aca447_fk_users_user_id";
ALTER TABLE IF EXISTS ONLY "public"."users_user_user_permissions" DROP CONSTRAINT IF EXISTS "users_user_user_perm_permission_id_0b93982e_fk_auth_perm";
ALTER TABLE IF EXISTS ONLY "public"."users_user_groups" DROP CONSTRAINT IF EXISTS "users_user_groups_user_id_5f6f5a90_fk_users_user_id";
ALTER TABLE IF EXISTS ONLY "public"."users_user_groups" DROP CONSTRAINT IF EXISTS "users_user_groups_group_id_9afc8d0e_fk_auth_group_id";
ALTER TABLE IF EXISTS ONLY "public"."sub_categories" DROP CONSTRAINT IF EXISTS "sub_categories_category_id_dc42080e_fk_categories_id";
ALTER TABLE IF EXISTS ONLY "public"."stores_engine" DROP CONSTRAINT IF EXISTS "stores_engine_owner_id_b3d12686_fk_profiles_id";
ALTER TABLE IF EXISTS ONLY "public"."stores_engine" DROP CONSTRAINT IF EXISTS "stores_engine_category_id_88a57e91_fk_categories_id";
ALTER TABLE IF EXISTS ONLY "public"."socialaccount_socialaccount" DROP CONSTRAINT IF EXISTS "socialaccount_socialaccount_user_id_8146e70c_fk_users_user_id";
ALTER TABLE IF EXISTS ONLY "public"."socialaccount_socialapp_sites" DROP CONSTRAINT IF EXISTS "socialaccount_social_socialapp_id_97fb6e7d_fk_socialacc";
ALTER TABLE IF EXISTS ONLY "public"."socialaccount_socialapp_sites" DROP CONSTRAINT IF EXISTS "socialaccount_social_site_id_2579dee5_fk_django_si";
ALTER TABLE IF EXISTS ONLY "public"."socialaccount_socialtoken" DROP CONSTRAINT IF EXISTS "socialaccount_social_app_id_636a42d7_fk_socialacc";
ALTER TABLE IF EXISTS ONLY "public"."socialaccount_socialtoken" DROP CONSTRAINT IF EXISTS "socialaccount_social_account_id_951f210e_fk_socialacc";
ALTER TABLE IF EXISTS ONLY "public"."shipping_methods" DROP CONSTRAINT IF EXISTS "shipping_methods_store_id_8b4db5b0_fk_stores_engine_id";
ALTER TABLE IF EXISTS ONLY "public"."profiles" DROP CONSTRAINT IF EXISTS "profiles_user_id_36580373_fk_users_user_id";
ALTER TABLE IF EXISTS ONLY "public"."products_engines" DROP CONSTRAINT IF EXISTS "products_engines_user_id_aabb0f05_fk_profiles_id";
ALTER TABLE IF EXISTS ONLY "public"."products_engines" DROP CONSTRAINT IF EXISTS "products_engines_store_id_365673de_fk_stores_engine_id";
ALTER TABLE IF EXISTS ONLY "public"."products_engines" DROP CONSTRAINT IF EXISTS "products_engines_parent_category_id_059d2d20_fk_categories_id";
ALTER TABLE IF EXISTS ONLY "public"."products_engines" DROP CONSTRAINT IF EXISTS "products_engines_leaf_category_id_6fee8335_fk_leaf_cate";
ALTER TABLE IF EXISTS ONLY "public"."products_engines" DROP CONSTRAINT IF EXISTS "products_engines_category_id_99280a05_fk_sub_categories_id";
ALTER TABLE IF EXISTS ONLY "public"."product_variations" DROP CONSTRAINT IF EXISTS "product_variations_product_id_54835ab7_fk_products_engines_id";
ALTER TABLE IF EXISTS ONLY "public"."product_media" DROP CONSTRAINT IF EXISTS "product_media_product_id_da264f78_fk_products_engines_id";
ALTER TABLE IF EXISTS ONLY "public"."orders" DROP CONSTRAINT IF EXISTS "orders_customer_id_b7016332_fk_profiles_id";
ALTER TABLE IF EXISTS ONLY "public"."order_items" DROP CONSTRAINT IF EXISTS "order_items_variant_id_c29d5590_fk_product_variations_id";
ALTER TABLE IF EXISTS ONLY "public"."order_items" DROP CONSTRAINT IF EXISTS "order_items_product_id_dd557d5a_fk_products_engines_id";
ALTER TABLE IF EXISTS ONLY "public"."order_items" DROP CONSTRAINT IF EXISTS "order_items_order_id_412ad78b_fk_orders_id";
ALTER TABLE IF EXISTS ONLY "public"."messages" DROP CONSTRAINT IF EXISTS "messages_sender_id_dc5a0bbd_fk_profiles_id";
ALTER TABLE IF EXISTS ONLY "public"."messages" DROP CONSTRAINT IF EXISTS "messages_receiver_id_874b4e0a_fk_profiles_id";
ALTER TABLE IF EXISTS ONLY "public"."messages" DROP CONSTRAINT IF EXISTS "messages_order_id_030a130e_fk_orders_id";
ALTER TABLE IF EXISTS ONLY "public"."leaf_categories" DROP CONSTRAINT IF EXISTS "leaf_categories_sub_category_id_331a4b78_fk_sub_categories_id";
ALTER TABLE IF EXISTS ONLY "public"."leads" DROP CONSTRAINT IF EXISTS "leads_store_id_af6cabaa_fk_stores_engine_id";
ALTER TABLE IF EXISTS ONLY "public"."django_admin_log" DROP CONSTRAINT IF EXISTS "django_admin_log_user_id_c564eba6_fk_users_user_id";
ALTER TABLE IF EXISTS ONLY "public"."django_admin_log" DROP CONSTRAINT IF EXISTS "django_admin_log_content_type_id_c4bce8eb_fk_django_co";
ALTER TABLE IF EXISTS ONLY "public"."disputes" DROP CONSTRAINT IF EXISTS "disputes_product_id_7de12695_fk_products_engines_id";
ALTER TABLE IF EXISTS ONLY "public"."disputes" DROP CONSTRAINT IF EXISTS "disputes_order_id_87d8b2a7_fk_orders_id";
ALTER TABLE IF EXISTS ONLY "public"."disputes" DROP CONSTRAINT IF EXISTS "disputes_customer_id_a3cfecca_fk_profiles_id";
ALTER TABLE IF EXISTS ONLY "public"."authtoken_token" DROP CONSTRAINT IF EXISTS "authtoken_token_user_id_35299eff_fk_users_user_id";
ALTER TABLE IF EXISTS ONLY "public"."auth_permission" DROP CONSTRAINT IF EXISTS "auth_permission_content_type_id_2f476e4b_fk_django_co";
ALTER TABLE IF EXISTS ONLY "public"."auth_group_permissions" DROP CONSTRAINT IF EXISTS "auth_group_permissions_group_id_b120cbf9_fk_auth_group_id";
ALTER TABLE IF EXISTS ONLY "public"."auth_group_permissions" DROP CONSTRAINT IF EXISTS "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm";
ALTER TABLE IF EXISTS ONLY "public"."advertisements" DROP CONSTRAINT IF EXISTS "advertisements_user_id_08bcd5e1_fk_profiles_id";
ALTER TABLE IF EXISTS ONLY "public"."advertisements" DROP CONSTRAINT IF EXISTS "advertisements_rejected_by_id_24e09c88_fk_profiles_id";
ALTER TABLE IF EXISTS ONLY "public"."advertisements" DROP CONSTRAINT IF EXISTS "advertisements_approved_by_id_17be2774_fk_profiles_id";
ALTER TABLE IF EXISTS ONLY "public"."admins" DROP CONSTRAINT IF EXISTS "admins_id_id_4a84f7ae_fk_profiles_id";
ALTER TABLE IF EXISTS ONLY "public"."account_emailconfirmation" DROP CONSTRAINT IF EXISTS "account_emailconfirm_email_address_id_5b7f8c58_fk_account_e";
ALTER TABLE IF EXISTS ONLY "public"."account_emailaddress" DROP CONSTRAINT IF EXISTS "account_emailaddress_user_id_2c513194_fk_users_user_id";
ALTER TABLE IF EXISTS ONLY "neon_auth"."session" DROP CONSTRAINT IF EXISTS "session_userId_fkey";
ALTER TABLE IF EXISTS ONLY "neon_auth"."member" DROP CONSTRAINT IF EXISTS "member_userId_fkey";
ALTER TABLE IF EXISTS ONLY "neon_auth"."member" DROP CONSTRAINT IF EXISTS "member_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY "neon_auth"."invitation" DROP CONSTRAINT IF EXISTS "invitation_organizationId_fkey";
ALTER TABLE IF EXISTS ONLY "neon_auth"."invitation" DROP CONSTRAINT IF EXISTS "invitation_inviterId_fkey";
ALTER TABLE IF EXISTS ONLY "neon_auth"."account" DROP CONSTRAINT IF EXISTS "account_userId_fkey";
DROP INDEX IF EXISTS "public"."users_user_username_06e46fe6_like";
DROP INDEX IF EXISTS "public"."users_user_user_permissions_user_id_20aca447";
DROP INDEX IF EXISTS "public"."users_user_user_permissions_permission_id_0b93982e";
DROP INDEX IF EXISTS "public"."users_user_groups_user_id_5f6f5a90";
DROP INDEX IF EXISTS "public"."users_user_groups_group_id_9afc8d0e";
DROP INDEX IF EXISTS "public"."users_user_email_243f6e77_like";
DROP INDEX IF EXISTS "public"."unique_verified_email";
DROP INDEX IF EXISTS "public"."unique_primary_email";
DROP INDEX IF EXISTS "public"."sub_categories_category_id_dc42080e";
DROP INDEX IF EXISTS "public"."sub_categor_name_sw_a9bbaf_idx";
DROP INDEX IF EXISTS "public"."sub_categor_name_deec2c_idx";
DROP INDEX IF EXISTS "public"."sub_categor_name_a8bf9b_idx";
DROP INDEX IF EXISTS "public"."sub_categor_created_6817c4_idx";
DROP INDEX IF EXISTS "public"."sub_categor_categor_e70bb6_idx";
DROP INDEX IF EXISTS "public"."sub_categor_categor_df4088_idx";
DROP INDEX IF EXISTS "public"."sub_categor_categor_0a2b8b_idx";
DROP INDEX IF EXISTS "public"."stores_engine_owner_id_b3d12686";
DROP INDEX IF EXISTS "public"."stores_engine_category_id_88a57e91";
DROP INDEX IF EXISTS "public"."stores_engi_whatsap_2a5c0b_idx";
DROP INDEX IF EXISTS "public"."stores_engi_verific_6fac7c_idx";
DROP INDEX IF EXISTS "public"."stores_engi_twitter_0908a3_idx";
DROP INDEX IF EXISTS "public"."stores_engi_total_s_b57586_idx";
DROP INDEX IF EXISTS "public"."stores_engi_tiktok__e6ba33_idx";
DROP INDEX IF EXISTS "public"."stores_engi_store_s_30e590_idx";
DROP INDEX IF EXISTS "public"."stores_engi_store_n_fb67df_idx";
DROP INDEX IF EXISTS "public"."stores_engi_store_n_3a2b45_idx";
DROP INDEX IF EXISTS "public"."stores_engi_store_i_4e92b3_idx";
DROP INDEX IF EXISTS "public"."stores_engi_status_551ac7_idx";
DROP INDEX IF EXISTS "public"."stores_engi_physica_562c8f_idx";
DROP INDEX IF EXISTS "public"."stores_engi_phone_n_9a9df6_idx";
DROP INDEX IF EXISTS "public"."stores_engi_owner_i_c6fa9c_idx";
DROP INDEX IF EXISTS "public"."stores_engi_is_veri_ce6fcc_idx";
DROP INDEX IF EXISTS "public"."stores_engi_is_veri_452fee_idx";
DROP INDEX IF EXISTS "public"."stores_engi_is_acti_d23033_idx";
DROP INDEX IF EXISTS "public"."stores_engi_is_acti_5c03a5_idx";
DROP INDEX IF EXISTS "public"."stores_engi_is_acti_46c0ff_idx";
DROP INDEX IF EXISTS "public"."stores_engi_instagr_48dde5_idx";
DROP INDEX IF EXISTS "public"."stores_engi_email_a468ed_idx";
DROP INDEX IF EXISTS "public"."stores_engi_created_4c8054_idx";
DROP INDEX IF EXISTS "public"."stores_engi_city_664daf_idx";
DROP INDEX IF EXISTS "public"."stores_engi_city_2cc504_idx";
DROP INDEX IF EXISTS "public"."stores_engi_categor_9c187e_idx";
DROP INDEX IF EXISTS "public"."stores_engi_categor_7daafa_idx";
DROP INDEX IF EXISTS "public"."stores_engi_categor_5df477_idx";
DROP INDEX IF EXISTS "public"."stores_engi_categor_446e6a_idx";
DROP INDEX IF EXISTS "public"."stores_engi_categor_19ad3c_idx";
DROP INDEX IF EXISTS "public"."stores_engi_busines_a120e2_idx";
DROP INDEX IF EXISTS "public"."stores_engi_average_73f17e_idx";
DROP INDEX IF EXISTS "public"."socialaccount_socialtoken_app_id_636a42d7";
DROP INDEX IF EXISTS "public"."socialaccount_socialtoken_account_id_951f210e";
DROP INDEX IF EXISTS "public"."socialaccount_socialapp_sites_socialapp_id_97fb6e7d";
DROP INDEX IF EXISTS "public"."socialaccount_socialapp_sites_site_id_2579dee5";
DROP INDEX IF EXISTS "public"."socialaccount_socialaccount_user_id_8146e70c";
DROP INDEX IF EXISTS "public"."shipping_methods_store_id_8b4db5b0";
DROP INDEX IF EXISTS "public"."profiles_username_b4c53dcb_like";
DROP INDEX IF EXISTS "public"."products_engines_user_id_aabb0f05";
DROP INDEX IF EXISTS "public"."products_engines_store_id_365673de";
DROP INDEX IF EXISTS "public"."products_engines_parent_category_id_059d2d20";
DROP INDEX IF EXISTS "public"."products_engines_leaf_category_id_6fee8335";
DROP INDEX IF EXISTS "public"."products_engines_category_id_99280a05";
DROP INDEX IF EXISTS "public"."products_en_views_9c6bc6_idx";
DROP INDEX IF EXISTS "public"."products_en_user_id_e0a5ac_idx";
DROP INDEX IF EXISTS "public"."products_en_sku_1dcf57_idx";
DROP INDEX IF EXISTS "public"."products_en_price_18314f_idx";
DROP INDEX IF EXISTS "public"."products_en_parent__7a6264_idx";
DROP INDEX IF EXISTS "public"."products_en_parent__2d47a0_idx";
DROP INDEX IF EXISTS "public"."products_en_order_c_97c40a_idx";
DROP INDEX IF EXISTS "public"."products_en_name_659c41_idx";
DROP INDEX IF EXISTS "public"."products_en_leaf_ca_ef036e_idx";
DROP INDEX IF EXISTS "public"."products_en_leaf_ca_cefc74_idx";
DROP INDEX IF EXISTS "public"."products_en_is_whol_d81a26_idx";
DROP INDEX IF EXISTS "public"."products_en_is_whol_750302_idx";
DROP INDEX IF EXISTS "public"."products_en_is_reta_c0619a_idx";
DROP INDEX IF EXISTS "public"."products_en_is_reta_bcc948_idx";
DROP INDEX IF EXISTS "public"."products_en_is_flas_ccb4a9_idx";
DROP INDEX IF EXISTS "public"."products_en_is_flas_a00639_idx";
DROP INDEX IF EXISTS "public"."products_en_is_feat_f803cb_idx";
DROP INDEX IF EXISTS "public"."products_en_is_feat_ec92f8_idx";
DROP INDEX IF EXISTS "public"."products_en_is_appr_f5d5f0_idx";
DROP INDEX IF EXISTS "public"."products_en_is_appr_ef79c4_idx";
DROP INDEX IF EXISTS "public"."products_en_is_appr_c7c141_idx";
DROP INDEX IF EXISTS "public"."products_en_is_appr_956017_idx";
DROP INDEX IF EXISTS "public"."products_en_is_appr_25a637_idx";
DROP INDEX IF EXISTS "public"."products_en_is_appr_0c4b85_idx";
DROP INDEX IF EXISTS "public"."products_en_has_col_4fc138_idx";
DROP INDEX IF EXISTS "public"."products_en_enable__abc761_idx";
DROP INDEX IF EXISTS "public"."products_en_enable__0cdc11_idx";
DROP INDEX IF EXISTS "public"."products_en_created_8c1b4b_idx";
DROP INDEX IF EXISTS "public"."products_en_cover_i_1749fd_idx";
DROP INDEX IF EXISTS "public"."products_en_categor_c60748_idx";
DROP INDEX IF EXISTS "public"."products_en_categor_268453_idx";
DROP INDEX IF EXISTS "public"."products_en_brand_i_2fbed3_idx";
DROP INDEX IF EXISTS "public"."products_en_barcode_7a602d_idx";
DROP INDEX IF EXISTS "public"."products_en_average_982e0b_idx";
DROP INDEX IF EXISTS "public"."product_variations_product_id_54835ab7";
DROP INDEX IF EXISTS "public"."product_media_product_id_da264f78";
DROP INDEX IF EXISTS "public"."otp_codes_otp_542e45_idx";
DROP INDEX IF EXISTS "public"."otp_codes_is_used_51d459_idx";
DROP INDEX IF EXISTS "public"."otp_codes_email_eece01_idx";
DROP INDEX IF EXISTS "public"."otp_codes_email_b20ef6_idx";
DROP INDEX IF EXISTS "public"."otp_codes_email_87b768_idx";
DROP INDEX IF EXISTS "public"."otp_codes_created_4cefc5_idx";
DROP INDEX IF EXISTS "public"."orders_order_number_fdca857f_like";
DROP INDEX IF EXISTS "public"."orders_customer_id_b7016332";
DROP INDEX IF EXISTS "public"."order_items_variant_id_c29d5590";
DROP INDEX IF EXISTS "public"."order_items_product_id_dd557d5a";
DROP INDEX IF EXISTS "public"."order_items_order_id_412ad78b";
DROP INDEX IF EXISTS "public"."messages_sender_id_dc5a0bbd";
DROP INDEX IF EXISTS "public"."messages_receiver_id_874b4e0a";
DROP INDEX IF EXISTS "public"."messages_order_id_030a130e";
DROP INDEX IF EXISTS "public"."leaf_categories_sub_category_id_331a4b78";
DROP INDEX IF EXISTS "public"."leaf_catego_weight__cc08a9_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_warrant_c60a31_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_sub_cat_c6674b_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_sub_cat_bf8ffd_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_sub_cat_b24b4d_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_sub_cat_438dd9_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_sub_cat_0c0707_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_sub_cat_03522c_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_size_fo_2a3974_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_require_e0d12a_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_require_5f0af9_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_name_sw_8aee8e_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_name_d22232_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_name_06c22b_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_min_sto_f0d43e_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_meta_ti_9781fe_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_meta_de_8fcd4d_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_measure_9804d9_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_materia_e0423f_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_icon_na_f760f6_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_dimensi_40e21f_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_created_d14f91_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_color_r_f033a6_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_color_h_94b0cd_idx";
DROP INDEX IF EXISTS "public"."leaf_catego_bulk_pr_6b2c5b_idx";
DROP INDEX IF EXISTS "public"."leads_store_id_af6cabaa";
DROP INDEX IF EXISTS "public"."django_site_domain_a2e37b91_like";
DROP INDEX IF EXISTS "public"."django_session_session_key_c0390e0f_like";
DROP INDEX IF EXISTS "public"."django_session_expire_date_a5c62663";
DROP INDEX IF EXISTS "public"."django_admin_log_user_id_c564eba6";
DROP INDEX IF EXISTS "public"."django_admin_log_content_type_id_c4bce8eb";
DROP INDEX IF EXISTS "public"."disputes_product_id_7de12695";
DROP INDEX IF EXISTS "public"."disputes_order_id_87d8b2a7";
DROP INDEX IF EXISTS "public"."disputes_customer_id_a3cfecca";
DROP INDEX IF EXISTS "public"."categories_name_sw_e3dc21_idx";
DROP INDEX IF EXISTS "public"."categories_name_98d7d5_idx";
DROP INDEX IF EXISTS "public"."categories_name_7a235e_idx";
DROP INDEX IF EXISTS "public"."categories_icon_na_7b574a_idx";
DROP INDEX IF EXISTS "public"."categories_icon_na_34e314_idx";
DROP INDEX IF EXISTS "public"."categories_created_9211a1_idx";
DROP INDEX IF EXISTS "public"."authtoken_token_key_10f0b77e_like";
DROP INDEX IF EXISTS "public"."auth_permission_content_type_id_2f476e4b";
DROP INDEX IF EXISTS "public"."auth_group_permissions_permission_id_84c5c92e";
DROP INDEX IF EXISTS "public"."auth_group_permissions_group_id_b120cbf9";
DROP INDEX IF EXISTS "public"."auth_group_name_a6ea08ec_like";
DROP INDEX IF EXISTS "public"."advertisements_user_id_08bcd5e1";
DROP INDEX IF EXISTS "public"."advertisements_rejected_by_id_24e09c88";
DROP INDEX IF EXISTS "public"."advertisements_approved_by_id_17be2774";
DROP INDEX IF EXISTS "public"."advertiseme_user_id_cf8b3d_idx";
DROP INDEX IF EXISTS "public"."advertiseme_user_id_38ee86_idx";
DROP INDEX IF EXISTS "public"."advertiseme_store_i_d705ab_idx";
DROP INDEX IF EXISTS "public"."advertiseme_store_i_a9e1be_idx";
DROP INDEX IF EXISTS "public"."advertiseme_store_i_3b5600_idx";
DROP INDEX IF EXISTS "public"."advertiseme_store_i_10c24f_idx";
DROP INDEX IF EXISTS "public"."advertiseme_status_efada0_idx";
DROP INDEX IF EXISTS "public"."advertiseme_status_581677_idx";
DROP INDEX IF EXISTS "public"."advertiseme_status_45d396_idx";
DROP INDEX IF EXISTS "public"."advertiseme_status_1b1a3d_idx";
DROP INDEX IF EXISTS "public"."advertiseme_rejecte_82e0e6_idx";
DROP INDEX IF EXISTS "public"."advertiseme_media_t_add222_idx";
DROP INDEX IF EXISTS "public"."advertiseme_created_4b312b_idx";
DROP INDEX IF EXISTS "public"."advertiseme_busines_68b5fd_idx";
DROP INDEX IF EXISTS "public"."advertiseme_approve_a190bc_idx";
DROP INDEX IF EXISTS "public"."advertiseme_approve_59add8_idx";
DROP INDEX IF EXISTS "public"."advertiseme_approve_001157_idx";
DROP INDEX IF EXISTS "public"."advertiseme_ad_type_a82d67_idx";
DROP INDEX IF EXISTS "public"."account_emailconfirmation_key_f43612bd_like";
DROP INDEX IF EXISTS "public"."account_emailconfirmation_email_address_id_5b7f8c58";
DROP INDEX IF EXISTS "public"."account_emailaddress_user_id_2c513194";
DROP INDEX IF EXISTS "public"."account_emailaddress_email_03be32b2_like";
DROP INDEX IF EXISTS "public"."account_emailaddress_email_03be32b2";
DROP INDEX IF EXISTS "neon_auth"."verification_identifier_idx";
DROP INDEX IF EXISTS "neon_auth"."session_userId_idx";
DROP INDEX IF EXISTS "neon_auth"."organization_slug_uidx";
DROP INDEX IF EXISTS "neon_auth"."member_userId_idx";
DROP INDEX IF EXISTS "neon_auth"."member_organizationId_idx";
DROP INDEX IF EXISTS "neon_auth"."invitation_organizationId_idx";
DROP INDEX IF EXISTS "neon_auth"."invitation_email_idx";
DROP INDEX IF EXISTS "neon_auth"."account_userId_idx";
ALTER TABLE IF EXISTS ONLY "public"."users_user" DROP CONSTRAINT IF EXISTS "users_user_username_key";
ALTER TABLE IF EXISTS ONLY "public"."users_user_user_permissions" DROP CONSTRAINT IF EXISTS "users_user_user_permissions_user_id_permission_id_43338c45_uniq";
ALTER TABLE IF EXISTS ONLY "public"."users_user_user_permissions" DROP CONSTRAINT IF EXISTS "users_user_user_permissions_pkey";
ALTER TABLE IF EXISTS ONLY "public"."users_user" DROP CONSTRAINT IF EXISTS "users_user_pkey";
ALTER TABLE IF EXISTS ONLY "public"."users_user_groups" DROP CONSTRAINT IF EXISTS "users_user_groups_user_id_group_id_b88eab82_uniq";
ALTER TABLE IF EXISTS ONLY "public"."users_user_groups" DROP CONSTRAINT IF EXISTS "users_user_groups_pkey";
ALTER TABLE IF EXISTS ONLY "public"."users_user" DROP CONSTRAINT IF EXISTS "users_user_email_key";
ALTER TABLE IF EXISTS ONLY "public"."sub_categories" DROP CONSTRAINT IF EXISTS "sub_categories_pkey";
ALTER TABLE IF EXISTS ONLY "public"."stores_engine" DROP CONSTRAINT IF EXISTS "stores_engine_pkey";
ALTER TABLE IF EXISTS ONLY "public"."socialaccount_socialtoken" DROP CONSTRAINT IF EXISTS "socialaccount_socialtoken_pkey";
ALTER TABLE IF EXISTS ONLY "public"."socialaccount_socialtoken" DROP CONSTRAINT IF EXISTS "socialaccount_socialtoken_app_id_account_id_fca4e0ac_uniq";
ALTER TABLE IF EXISTS ONLY "public"."socialaccount_socialapp_sites" DROP CONSTRAINT IF EXISTS "socialaccount_socialapp_sites_pkey";
ALTER TABLE IF EXISTS ONLY "public"."socialaccount_socialapp" DROP CONSTRAINT IF EXISTS "socialaccount_socialapp_pkey";
ALTER TABLE IF EXISTS ONLY "public"."socialaccount_socialapp_sites" DROP CONSTRAINT IF EXISTS "socialaccount_socialapp__socialapp_id_site_id_71a9a768_uniq";
ALTER TABLE IF EXISTS ONLY "public"."socialaccount_socialaccount" DROP CONSTRAINT IF EXISTS "socialaccount_socialaccount_provider_uid_fc810c6e_uniq";
ALTER TABLE IF EXISTS ONLY "public"."socialaccount_socialaccount" DROP CONSTRAINT IF EXISTS "socialaccount_socialaccount_pkey";
ALTER TABLE IF EXISTS ONLY "public"."shipping_methods" DROP CONSTRAINT IF EXISTS "shipping_methods_pkey";
ALTER TABLE IF EXISTS ONLY "public"."profiles" DROP CONSTRAINT IF EXISTS "profiles_username_key";
ALTER TABLE IF EXISTS ONLY "public"."profiles" DROP CONSTRAINT IF EXISTS "profiles_user_id_key";
ALTER TABLE IF EXISTS ONLY "public"."profiles" DROP CONSTRAINT IF EXISTS "profiles_pkey";
ALTER TABLE IF EXISTS ONLY "public"."products_engines" DROP CONSTRAINT IF EXISTS "products_engines_pkey";
ALTER TABLE IF EXISTS ONLY "public"."product_variations" DROP CONSTRAINT IF EXISTS "product_variations_pkey";
ALTER TABLE IF EXISTS ONLY "public"."product_media" DROP CONSTRAINT IF EXISTS "product_media_pkey";
ALTER TABLE IF EXISTS ONLY "public"."otp_codes" DROP CONSTRAINT IF EXISTS "otp_codes_pkey";
ALTER TABLE IF EXISTS ONLY "public"."orders" DROP CONSTRAINT IF EXISTS "orders_pkey";
ALTER TABLE IF EXISTS ONLY "public"."orders" DROP CONSTRAINT IF EXISTS "orders_order_number_key";
ALTER TABLE IF EXISTS ONLY "public"."order_items" DROP CONSTRAINT IF EXISTS "order_items_pkey";
ALTER TABLE IF EXISTS ONLY "public"."messages" DROP CONSTRAINT IF EXISTS "messages_pkey";
ALTER TABLE IF EXISTS ONLY "public"."leaf_categories" DROP CONSTRAINT IF EXISTS "leaf_categories_pkey";
ALTER TABLE IF EXISTS ONLY "public"."leads" DROP CONSTRAINT IF EXISTS "leads_pkey";
ALTER TABLE IF EXISTS ONLY "public"."django_site" DROP CONSTRAINT IF EXISTS "django_site_pkey";
ALTER TABLE IF EXISTS ONLY "public"."django_site" DROP CONSTRAINT IF EXISTS "django_site_domain_a2e37b91_uniq";
ALTER TABLE IF EXISTS ONLY "public"."django_session" DROP CONSTRAINT IF EXISTS "django_session_pkey";
ALTER TABLE IF EXISTS ONLY "public"."django_migrations" DROP CONSTRAINT IF EXISTS "django_migrations_pkey";
ALTER TABLE IF EXISTS ONLY "public"."django_content_type" DROP CONSTRAINT IF EXISTS "django_content_type_pkey";
ALTER TABLE IF EXISTS ONLY "public"."django_content_type" DROP CONSTRAINT IF EXISTS "django_content_type_app_label_model_76bd3d3b_uniq";
ALTER TABLE IF EXISTS ONLY "public"."django_admin_log" DROP CONSTRAINT IF EXISTS "django_admin_log_pkey";
ALTER TABLE IF EXISTS ONLY "public"."disputes" DROP CONSTRAINT IF EXISTS "disputes_pkey";
ALTER TABLE IF EXISTS ONLY "public"."categories" DROP CONSTRAINT IF EXISTS "categories_pkey";
ALTER TABLE IF EXISTS ONLY "public"."brands" DROP CONSTRAINT IF EXISTS "brands_pkey";
ALTER TABLE IF EXISTS ONLY "public"."authtoken_token" DROP CONSTRAINT IF EXISTS "authtoken_token_user_id_key";
ALTER TABLE IF EXISTS ONLY "public"."authtoken_token" DROP CONSTRAINT IF EXISTS "authtoken_token_pkey";
ALTER TABLE IF EXISTS ONLY "public"."auth_permission" DROP CONSTRAINT IF EXISTS "auth_permission_pkey";
ALTER TABLE IF EXISTS ONLY "public"."auth_permission" DROP CONSTRAINT IF EXISTS "auth_permission_content_type_id_codename_01ab375a_uniq";
ALTER TABLE IF EXISTS ONLY "public"."auth_group" DROP CONSTRAINT IF EXISTS "auth_group_pkey";
ALTER TABLE IF EXISTS ONLY "public"."auth_group_permissions" DROP CONSTRAINT IF EXISTS "auth_group_permissions_pkey";
ALTER TABLE IF EXISTS ONLY "public"."auth_group_permissions" DROP CONSTRAINT IF EXISTS "auth_group_permissions_group_id_permission_id_0cd325b0_uniq";
ALTER TABLE IF EXISTS ONLY "public"."auth_group" DROP CONSTRAINT IF EXISTS "auth_group_name_key";
ALTER TABLE IF EXISTS ONLY "public"."advertisements" DROP CONSTRAINT IF EXISTS "advertisements_pkey";
ALTER TABLE IF EXISTS ONLY "public"."admins" DROP CONSTRAINT IF EXISTS "admins_pkey";
ALTER TABLE IF EXISTS ONLY "public"."account_emailconfirmation" DROP CONSTRAINT IF EXISTS "account_emailconfirmation_pkey";
ALTER TABLE IF EXISTS ONLY "public"."account_emailconfirmation" DROP CONSTRAINT IF EXISTS "account_emailconfirmation_key_key";
ALTER TABLE IF EXISTS ONLY "public"."account_emailaddress" DROP CONSTRAINT IF EXISTS "account_emailaddress_user_id_email_987c8728_uniq";
ALTER TABLE IF EXISTS ONLY "public"."account_emailaddress" DROP CONSTRAINT IF EXISTS "account_emailaddress_pkey";
ALTER TABLE IF EXISTS ONLY "neon_auth"."verification" DROP CONSTRAINT IF EXISTS "verification_pkey";
ALTER TABLE IF EXISTS ONLY "neon_auth"."user" DROP CONSTRAINT IF EXISTS "user_pkey";
ALTER TABLE IF EXISTS ONLY "neon_auth"."user" DROP CONSTRAINT IF EXISTS "user_email_key";
ALTER TABLE IF EXISTS ONLY "neon_auth"."session" DROP CONSTRAINT IF EXISTS "session_token_key";
ALTER TABLE IF EXISTS ONLY "neon_auth"."session" DROP CONSTRAINT IF EXISTS "session_pkey";
ALTER TABLE IF EXISTS ONLY "neon_auth"."project_config" DROP CONSTRAINT IF EXISTS "project_config_pkey";
ALTER TABLE IF EXISTS ONLY "neon_auth"."project_config" DROP CONSTRAINT IF EXISTS "project_config_endpoint_id_key";
ALTER TABLE IF EXISTS ONLY "neon_auth"."organization" DROP CONSTRAINT IF EXISTS "organization_slug_key";
ALTER TABLE IF EXISTS ONLY "neon_auth"."organization" DROP CONSTRAINT IF EXISTS "organization_pkey";
ALTER TABLE IF EXISTS ONLY "neon_auth"."member" DROP CONSTRAINT IF EXISTS "member_pkey";
ALTER TABLE IF EXISTS ONLY "neon_auth"."jwks" DROP CONSTRAINT IF EXISTS "jwks_pkey";
ALTER TABLE IF EXISTS ONLY "neon_auth"."invitation" DROP CONSTRAINT IF EXISTS "invitation_pkey";
ALTER TABLE IF EXISTS ONLY "neon_auth"."account" DROP CONSTRAINT IF EXISTS "account_pkey";
DROP TABLE IF EXISTS "public"."users_user_user_permissions";
DROP TABLE IF EXISTS "public"."users_user_groups";
DROP TABLE IF EXISTS "public"."users_user";
DROP TABLE IF EXISTS "public"."sub_categories";
DROP TABLE IF EXISTS "public"."stores_engine";
DROP TABLE IF EXISTS "public"."socialaccount_socialtoken";
DROP TABLE IF EXISTS "public"."socialaccount_socialapp_sites";
DROP TABLE IF EXISTS "public"."socialaccount_socialapp";
DROP TABLE IF EXISTS "public"."socialaccount_socialaccount";
DROP TABLE IF EXISTS "public"."shipping_methods";
DROP TABLE IF EXISTS "public"."profiles";
DROP TABLE IF EXISTS "public"."products_engines";
DROP TABLE IF EXISTS "public"."product_variations";
DROP TABLE IF EXISTS "public"."product_media";
DROP TABLE IF EXISTS "public"."otp_codes";
DROP TABLE IF EXISTS "public"."orders";
DROP TABLE IF EXISTS "public"."order_items";
DROP TABLE IF EXISTS "public"."messages";
DROP TABLE IF EXISTS "public"."leaf_categories";
DROP TABLE IF EXISTS "public"."leads";
DROP TABLE IF EXISTS "public"."django_site";
DROP TABLE IF EXISTS "public"."django_session";
DROP TABLE IF EXISTS "public"."django_migrations";
DROP TABLE IF EXISTS "public"."django_content_type";
DROP TABLE IF EXISTS "public"."django_admin_log";
DROP TABLE IF EXISTS "public"."disputes";
DROP TABLE IF EXISTS "public"."categories";
DROP TABLE IF EXISTS "public"."brands";
DROP TABLE IF EXISTS "public"."authtoken_token";
DROP TABLE IF EXISTS "public"."auth_permission";
DROP TABLE IF EXISTS "public"."auth_group_permissions";
DROP TABLE IF EXISTS "public"."auth_group";
DROP TABLE IF EXISTS "public"."advertisements";
DROP TABLE IF EXISTS "public"."admins";
DROP TABLE IF EXISTS "public"."account_emailconfirmation";
DROP TABLE IF EXISTS "public"."account_emailaddress";
DROP TABLE IF EXISTS "neon_auth"."verification";
DROP TABLE IF EXISTS "neon_auth"."user";
DROP TABLE IF EXISTS "neon_auth"."session";
DROP TABLE IF EXISTS "neon_auth"."project_config";
DROP TABLE IF EXISTS "neon_auth"."organization";
DROP TABLE IF EXISTS "neon_auth"."member";
DROP TABLE IF EXISTS "neon_auth"."jwks";
DROP TABLE IF EXISTS "neon_auth"."invitation";
DROP TABLE IF EXISTS "neon_auth"."account";
DROP SCHEMA IF EXISTS "neon_auth";
--
-- Name: neon_auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA "neon_auth";


--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: account; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE "neon_auth"."account" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "accountId" "text" NOT NULL,
    "providerId" "text" NOT NULL,
    "userId" "uuid" NOT NULL,
    "accessToken" "text",
    "refreshToken" "text",
    "idToken" "text",
    "accessTokenExpiresAt" timestamp with time zone,
    "refreshTokenExpiresAt" timestamp with time zone,
    "scope" "text",
    "password" "text",
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


--
-- Name: invitation; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE "neon_auth"."invitation" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organizationId" "uuid" NOT NULL,
    "email" "text" NOT NULL,
    "role" "text",
    "status" "text" NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "inviterId" "uuid" NOT NULL
);


--
-- Name: jwks; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE "neon_auth"."jwks" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "publicKey" "text" NOT NULL,
    "privateKey" "text" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "expiresAt" timestamp with time zone,
    "alg" "text",
    "crv" "text"
);


--
-- Name: member; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE "neon_auth"."member" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "organizationId" "uuid" NOT NULL,
    "userId" "uuid" NOT NULL,
    "role" "text" NOT NULL,
    "createdAt" timestamp with time zone NOT NULL
);


--
-- Name: organization; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE "neon_auth"."organization" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "logo" "text",
    "createdAt" timestamp with time zone NOT NULL,
    "metadata" "text"
);


--
-- Name: project_config; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE "neon_auth"."project_config" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "endpoint_id" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updated_at" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "trusted_origins" "jsonb" NOT NULL,
    "social_providers" "jsonb" NOT NULL,
    "email_provider" "jsonb",
    "email_and_password" "jsonb",
    "allow_localhost" boolean NOT NULL,
    "plugin_configs" "jsonb",
    "webhook_config" "jsonb"
);


--
-- Name: session; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE "neon_auth"."session" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "token" "text" NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "ipAddress" "text",
    "userAgent" "text",
    "userId" "uuid" NOT NULL,
    "impersonatedBy" "text",
    "activeOrganizationId" "text"
);


--
-- Name: user; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE "neon_auth"."user" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "emailVerified" boolean NOT NULL,
    "image" "text",
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "role" "text",
    "banned" boolean,
    "banReason" "text",
    "banExpires" timestamp with time zone
);


--
-- Name: verification; Type: TABLE; Schema: neon_auth; Owner: -
--

CREATE TABLE "neon_auth"."verification" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "identifier" "text" NOT NULL,
    "value" "text" NOT NULL,
    "expiresAt" timestamp with time zone NOT NULL,
    "createdAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: account_emailaddress; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."account_emailaddress" (
    "id" integer NOT NULL,
    "email" character varying(254) NOT NULL,
    "verified" boolean NOT NULL,
    "primary" boolean NOT NULL,
    "user_id" bigint NOT NULL
);


--
-- Name: account_emailaddress_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."account_emailaddress" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."account_emailaddress_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: account_emailconfirmation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."account_emailconfirmation" (
    "id" integer NOT NULL,
    "created" timestamp with time zone NOT NULL,
    "sent" timestamp with time zone,
    "key" character varying(64) NOT NULL,
    "email_address_id" integer NOT NULL
);


--
-- Name: account_emailconfirmation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."account_emailconfirmation" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."account_emailconfirmation_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: admins; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."admins" (
    "id_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone
);


--
-- Name: advertisements; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."advertisements" (
    "id" "uuid" NOT NULL,
    "store_id" "uuid" NOT NULL,
    "business_name" character varying(255) NOT NULL,
    "ad_type" character varying(50) NOT NULL,
    "description" "text",
    "media_url" character varying(500),
    "media_type" character varying(50) NOT NULL,
    "status" character varying(50) NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "approved_at" timestamp with time zone,
    "rejected_at" timestamp with time zone,
    "rejection_reason" "text",
    "approved_by_id" "uuid",
    "rejected_by_id" "uuid",
    "user_id" "uuid" NOT NULL
);


--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."auth_group" (
    "id" integer NOT NULL,
    "name" character varying(150) NOT NULL
);


--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."auth_group" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."auth_group_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."auth_group_permissions" (
    "id" bigint NOT NULL,
    "group_id" integer NOT NULL,
    "permission_id" integer NOT NULL
);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."auth_group_permissions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."auth_group_permissions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."auth_permission" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "content_type_id" integer NOT NULL,
    "codename" character varying(100) NOT NULL
);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."auth_permission" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."auth_permission_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: authtoken_token; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."authtoken_token" (
    "key" character varying(40) NOT NULL,
    "created" timestamp with time zone NOT NULL,
    "user_id" bigint NOT NULL
);


--
-- Name: brands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."brands" (
    "id" "uuid" NOT NULL,
    "name" character varying(255) NOT NULL,
    "description" "text",
    "logo" character varying(100)
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."categories" (
    "id" "uuid" NOT NULL,
    "icon_name" character varying(100) NOT NULL,
    "name" character varying(200) NOT NULL,
    "name_sw" character varying(200),
    "description" "text",
    "created_at" timestamp with time zone NOT NULL
);


--
-- Name: disputes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."disputes" (
    "id" "uuid" NOT NULL,
    "store_id" "uuid" NOT NULL,
    "product_name" character varying(255) NOT NULL,
    "reason" character varying(255) NOT NULL,
    "description" "text" NOT NULL,
    "status" character varying(50) NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "customer_id" "uuid" NOT NULL,
    "order_id" "uuid" NOT NULL,
    "product_id" "uuid"
);


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."django_admin_log" (
    "id" integer NOT NULL,
    "action_time" timestamp with time zone NOT NULL,
    "object_id" "text",
    "object_repr" character varying(200) NOT NULL,
    "action_flag" smallint NOT NULL,
    "change_message" "text" NOT NULL,
    "content_type_id" integer,
    "user_id" bigint NOT NULL,
    CONSTRAINT "django_admin_log_action_flag_check" CHECK (("action_flag" >= 0))
);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."django_admin_log" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."django_admin_log_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."django_content_type" (
    "id" integer NOT NULL,
    "app_label" character varying(100) NOT NULL,
    "model" character varying(100) NOT NULL
);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."django_content_type" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."django_content_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."django_migrations" (
    "id" bigint NOT NULL,
    "app" character varying(255) NOT NULL,
    "name" character varying(255) NOT NULL,
    "applied" timestamp with time zone NOT NULL
);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."django_migrations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."django_migrations_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."django_session" (
    "session_key" character varying(40) NOT NULL,
    "session_data" "text" NOT NULL,
    "expire_date" timestamp with time zone NOT NULL
);


--
-- Name: django_site; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."django_site" (
    "id" integer NOT NULL,
    "domain" character varying(100) NOT NULL,
    "name" character varying(50) NOT NULL
);


--
-- Name: django_site_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."django_site" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."django_site_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."leads" (
    "id" "uuid" NOT NULL,
    "customer_name" character varying(255) NOT NULL,
    "email" character varying(254) NOT NULL,
    "message" "text" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "store_id" "uuid" NOT NULL
);


--
-- Name: leaf_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."leaf_categories" (
    "id" "uuid" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "name" character varying(255) NOT NULL,
    "name_sw" character varying(255),
    "require_gender" boolean NOT NULL,
    "require_size" boolean NOT NULL,
    "color_required" boolean NOT NULL,
    "warranty_required" boolean NOT NULL,
    "weight_required" boolean NOT NULL,
    "dimensions_required" boolean NOT NULL,
    "bulk_pricing_tiers" boolean NOT NULL,
    "min_stock_warning" integer NOT NULL,
    "measurement_unit" character varying(50),
    "size_format" character varying(50),
    "material_type" character varying(100),
    "icon_name" character varying(100),
    "color_hex" character varying(10),
    "meta_title" character varying(255),
    "meta_description" "text",
    "condition_options" "jsonb",
    "custom_fields" "jsonb",
    "specs" "jsonb",
    "sub_category_id" "uuid" NOT NULL
);


--
-- Name: messages; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."messages" (
    "id" "uuid" NOT NULL,
    "content" "text" NOT NULL,
    "is_read" boolean,
    "created_at" timestamp with time zone NOT NULL,
    "order_id" "uuid",
    "receiver_id" "uuid" NOT NULL,
    "sender_id" "uuid" NOT NULL,
    "image" character varying(500)
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."order_items" (
    "id" bigint NOT NULL,
    "product_name" character varying(255),
    "sku" character varying(100),
    "category_name" character varying(255),
    "unit_price" numeric(15,2) NOT NULL,
    "quantity" integer NOT NULL,
    "subtotal" numeric(15,2) NOT NULL,
    "discount_amount" numeric(15,2),
    "selected_color" character varying(100),
    "selected_size" character varying(50),
    "product_image" character varying(500),
    "order_id" "uuid" NOT NULL,
    "product_id" "uuid",
    "variant_id" "uuid"
);


--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."order_items" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."order_items_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."orders" (
    "id" "uuid" NOT NULL,
    "store_id" "uuid" NOT NULL,
    "status" character varying(50) NOT NULL,
    "order_number" character varying(50) NOT NULL,
    "customer_location" "text",
    "customer_feedback" "text",
    "payment_method" character varying(50),
    "shipping_method" character varying(100),
    "shipping_fee" numeric(10,2) NOT NULL,
    "grand_total" numeric(15,2) NOT NULL,
    "total_items" integer NOT NULL,
    "customer_rating" numeric(3,1),
    "created_at" timestamp with time zone,
    "updated_at" timestamp with time zone,
    "working_date" timestamp with time zone,
    "feedback_date" timestamp with time zone,
    "day_of_week" character varying(20),
    "fiscal_year" character varying(20),
    "month_year" character varying(20),
    "customer_id" "uuid"
);


--
-- Name: otp_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."otp_codes" (
    "id" "uuid" NOT NULL,
    "email" character varying(254) NOT NULL,
    "otp" character varying(6) NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "is_used" boolean NOT NULL
);


--
-- Name: product_media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."product_media" (
    "id" "uuid" NOT NULL,
    "media_type" character varying(20) NOT NULL,
    "media_url" character varying(500),
    "display_order" integer NOT NULL,
    "is_promo_video" boolean NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "product_id" "uuid" NOT NULL
);


--
-- Name: product_variations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."product_variations" (
    "id" "uuid" NOT NULL,
    "sku" character varying(100),
    "color_name" character varying(100),
    "color_image" character varying(500),
    "size_value" character varying(50),
    "price" numeric(15,2) NOT NULL,
    "stock_quantity" integer NOT NULL,
    "total_stock" integer NOT NULL,
    "marketplace_price" numeric(15,2) NOT NULL,
    "marketplace_stock" integer NOT NULL,
    "marketplace_image" character varying(500),
    "size_stock" "jsonb" NOT NULL,
    "variant_specifications" "jsonb" NOT NULL,
    "variant_images_array" "jsonb" NOT NULL,
    "attributes" "jsonb" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "product_id" "uuid" NOT NULL
);


--
-- Name: products_engines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."products_engines" (
    "id" "uuid" NOT NULL,
    "brand_id" "uuid",
    "name" character varying(255) NOT NULL,
    "sku" character varying(100),
    "barcode" character varying(100),
    "description" "text",
    "cover_image" character varying(100),
    "price" numeric(15,2) NOT NULL,
    "original_price" numeric(15,2) NOT NULL,
    "stock_quantity" integer NOT NULL,
    "compare_at_price" numeric(15,2) NOT NULL,
    "specifications" "jsonb" NOT NULL,
    "price_tiers" "jsonb" NOT NULL,
    "colors" "jsonb" NOT NULL,
    "size_stock" "jsonb" NOT NULL,
    "available_sizes" "jsonb" NOT NULL,
    "dimensions" "jsonb" NOT NULL,
    "target_audience" "jsonb" NOT NULL,
    "is_wholesale" boolean NOT NULL,
    "is_retail" boolean NOT NULL,
    "is_approved" boolean NOT NULL,
    "is_featured" boolean NOT NULL,
    "is_flash_sale" boolean NOT NULL,
    "enable_sizes" boolean NOT NULL,
    "has_colors" boolean NOT NULL,
    "enable_pickup" boolean NOT NULL,
    "shipping_method" character varying(50) NOT NULL,
    "shipping_cost" numeric(10,2) NOT NULL,
    "shipping_rate_per_km" numeric(10,2) NOT NULL,
    "shipping_base_fee" numeric(10,2) NOT NULL,
    "shipping_default_distance" numeric(10,2) NOT NULL,
    "shipping_dar_cost" numeric(10,2) NOT NULL,
    "shipping_outside_dar_cost" numeric(10,2) NOT NULL,
    "shipping_remote_cost" numeric(10,2) NOT NULL,
    "total_stock_cost" numeric(15,2) NOT NULL,
    "expected_total_profit" numeric(15,2) NOT NULL,
    "maintenance_fee" numeric(15,2) NOT NULL,
    "gender" character varying(50),
    "warranty_months" integer NOT NULL,
    "weight" numeric(10,2),
    "weight_unit" character varying(10),
    "store_address" "text",
    "material" character varying(255),
    "moq" integer NOT NULL,
    "views" integer NOT NULL,
    "order_count" integer NOT NULL,
    "average_rating" numeric(3,2) NOT NULL,
    "total_reviews" integer NOT NULL,
    "size_format" character varying(50) NOT NULL,
    "condition" character varying(50) NOT NULL,
    "engine_index" integer NOT NULL,
    "price_per_meter" numeric(10,2) NOT NULL,
    "price_per_foot" numeric(10,2) NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "sale_end_date" timestamp with time zone,
    "offer_started_at" timestamp with time zone,
    "approved_at" timestamp with time zone,
    "approved_by" "uuid",
    "fee_due_date" timestamp with time zone,
    "leaf_category_id" "uuid",
    "parent_category_id" "uuid",
    "user_id" "uuid",
    "category_id" "uuid",
    "discount" numeric(5,2) NOT NULL,
    "store_id" "uuid"
);


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."profiles" (
    "id" "uuid" NOT NULL,
    "full_name" character varying(255) NOT NULL,
    "avatar_url" character varying(500),
    "updated_at" timestamp with time zone NOT NULL,
    "username" character varying(150),
    "bio" "text",
    "email" character varying(254),
    "role" character varying(50),
    "user_id" bigint,
    "is_otp_verified" boolean NOT NULL,
    "latitude" numeric(9,6),
    "longitude" numeric(9,6)
);


--
-- Name: shipping_methods; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."shipping_methods" (
    "id" "uuid" NOT NULL,
    "label" character varying(255) NOT NULL,
    "description" "text",
    "price_local" numeric(10,2) NOT NULL,
    "price_national" numeric(10,2) NOT NULL,
    "is_active" boolean NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "store_id" "uuid" NOT NULL
);


--
-- Name: socialaccount_socialaccount; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."socialaccount_socialaccount" (
    "id" integer NOT NULL,
    "provider" character varying(200) NOT NULL,
    "uid" character varying(191) NOT NULL,
    "last_login" timestamp with time zone NOT NULL,
    "date_joined" timestamp with time zone NOT NULL,
    "extra_data" "jsonb" NOT NULL,
    "user_id" bigint NOT NULL
);


--
-- Name: socialaccount_socialaccount_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."socialaccount_socialaccount" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."socialaccount_socialaccount_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: socialaccount_socialapp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."socialaccount_socialapp" (
    "id" integer NOT NULL,
    "provider" character varying(30) NOT NULL,
    "name" character varying(40) NOT NULL,
    "client_id" character varying(191) NOT NULL,
    "secret" character varying(191) NOT NULL,
    "key" character varying(191) NOT NULL,
    "provider_id" character varying(200) NOT NULL,
    "settings" "jsonb" NOT NULL
);


--
-- Name: socialaccount_socialapp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."socialaccount_socialapp" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."socialaccount_socialapp_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: socialaccount_socialapp_sites; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."socialaccount_socialapp_sites" (
    "id" bigint NOT NULL,
    "socialapp_id" integer NOT NULL,
    "site_id" integer NOT NULL
);


--
-- Name: socialaccount_socialapp_sites_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."socialaccount_socialapp_sites" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."socialaccount_socialapp_sites_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: socialaccount_socialtoken; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."socialaccount_socialtoken" (
    "id" integer NOT NULL,
    "token" "text" NOT NULL,
    "token_secret" "text" NOT NULL,
    "expires_at" timestamp with time zone,
    "account_id" integer NOT NULL,
    "app_id" integer
);


--
-- Name: socialaccount_socialtoken_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."socialaccount_socialtoken" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."socialaccount_socialtoken_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: stores_engine; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."stores_engine" (
    "id" "uuid" NOT NULL,
    "is_verified" boolean NOT NULL,
    "business_type" character varying(100),
    "tin_number" character varying(50),
    "phone_number" character varying(50),
    "email" character varying(254),
    "physical_address" "text",
    "city" character varying(100),
    "lead_time" character varying(100),
    "moq" character varying(100),
    "tin_image" character varying(100),
    "google_maps_url" character varying(500),
    "packaging_type" character varying(100),
    "supply_capacity" character varying(100),
    "store_name" character varying(255) NOT NULL,
    "store_slug" character varying(255),
    "store_banner" character varying(100),
    "description" "text",
    "store_logo" character varying(100),
    "instagram_handle" character varying(100),
    "whatsapp_number" character varying(50),
    "specialist_tags" "jsonb" NOT NULL,
    "youtube_link" character varying(500),
    "status" character varying(50) NOT NULL,
    "twitter_handle" character varying(100),
    "tiktok_handle" character varying(100),
    "working_hours" character varying(255),
    "is_active" boolean NOT NULL,
    "office_image_1" character varying(500),
    "office_image_2" character varying(500),
    "office_image_3" character varying(500),
    "sub_category_ids" "jsonb" NOT NULL,
    "store_index" integer NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "total_sales" numeric(15,2) NOT NULL,
    "average_rating" numeric(3,2) NOT NULL,
    "verification_status" character varying(50) NOT NULL,
    "category_id" "uuid",
    "owner_id" "uuid" NOT NULL,
    "latitude" numeric(9,6),
    "longitude" numeric(9,6)
);


--
-- Name: sub_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."sub_categories" (
    "id" "uuid" NOT NULL,
    "icon_name" character varying(100) NOT NULL,
    "name" character varying(200) NOT NULL,
    "name_sw" character varying(200),
    "description" "text",
    "created_at" timestamp with time zone NOT NULL,
    "category_id" "uuid" NOT NULL
);


--
-- Name: users_user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users_user" (
    "id" bigint NOT NULL,
    "password" character varying(128) NOT NULL,
    "last_login" timestamp with time zone,
    "is_superuser" boolean NOT NULL,
    "username" character varying(150) NOT NULL,
    "first_name" character varying(150) NOT NULL,
    "last_name" character varying(150) NOT NULL,
    "is_staff" boolean NOT NULL,
    "is_active" boolean NOT NULL,
    "date_joined" timestamp with time zone NOT NULL,
    "phone" character varying(15) NOT NULL,
    "role" character varying(20) NOT NULL,
    "full_name" character varying(100) NOT NULL,
    "email" character varying(254) NOT NULL
);


--
-- Name: users_user_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users_user_groups" (
    "id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "group_id" integer NOT NULL
);


--
-- Name: users_user_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."users_user_groups" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_user_groups_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."users_user" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_user_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users_user_user_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users_user_user_permissions" (
    "id" bigint NOT NULL,
    "user_id" bigint NOT NULL,
    "permission_id" integer NOT NULL
);


--
-- Name: users_user_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."users_user_user_permissions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_user_user_permissions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: account; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY "neon_auth"."account" ("id", "accountId", "providerId", "userId", "accessToken", "refreshToken", "idToken", "accessTokenExpiresAt", "refreshTokenExpiresAt", "scope", "password", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: invitation; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY "neon_auth"."invitation" ("id", "organizationId", "email", "role", "status", "expiresAt", "createdAt", "inviterId") FROM stdin;
\.


--
-- Data for Name: jwks; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY "neon_auth"."jwks" ("id", "publicKey", "privateKey", "createdAt", "expiresAt", "alg", "crv") FROM stdin;
\.


--
-- Data for Name: member; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY "neon_auth"."member" ("id", "organizationId", "userId", "role", "createdAt") FROM stdin;
\.


--
-- Data for Name: organization; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY "neon_auth"."organization" ("id", "name", "slug", "logo", "createdAt", "metadata") FROM stdin;
\.


--
-- Data for Name: project_config; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY "neon_auth"."project_config" ("id", "name", "endpoint_id", "created_at", "updated_at", "trusted_origins", "social_providers", "email_provider", "email_and_password", "allow_localhost", "plugin_configs", "webhook_config") FROM stdin;
1e3fc993-b5f4-4522-973c-97c001effdad	eskyfall_db	ep-icy-resonance-az3k69it	2026-07-28 12:47:17.726+00	2026-07-28 12:47:17.726+00	[]	[{"id": "google", "isShared": true}]	{"type": "shared"}	{"enabled": true, "disableSignUp": false, "emailVerificationMethod": "otp", "requireEmailVerification": false, "autoSignInAfterVerification": true, "sendVerificationEmailOnSignIn": false, "sendVerificationEmailOnSignUp": false}	t	{"magicLink": {"config": {"expiresIn": 5, "disableSignUp": false}, "enabled": false}, "phoneNumber": {"config": {"otp_expires_in": 300}, "enabled": false}, "organization": {"config": {"creatorRole": "owner", "membershipLimit": 100, "organizationLimit": 10, "sendInvitationEmail": false}, "enabled": true}}	{"enabled": false, "enabledEvents": [], "timeoutSeconds": 5}
\.


--
-- Data for Name: session; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY "neon_auth"."session" ("id", "expiresAt", "token", "createdAt", "updatedAt", "ipAddress", "userAgent", "userId", "impersonatedBy", "activeOrganizationId") FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY "neon_auth"."user" ("id", "name", "email", "emailVerified", "image", "createdAt", "updatedAt", "role", "banned", "banReason", "banExpires") FROM stdin;
\.


--
-- Data for Name: verification; Type: TABLE DATA; Schema: neon_auth; Owner: -
--

COPY "neon_auth"."verification" ("id", "identifier", "value", "expiresAt", "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: account_emailaddress; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."account_emailaddress" ("id", "email", "verified", "primary", "user_id") FROM stdin;
1	skyfallcotz@gmail.com	f	t	18
\.


--
-- Data for Name: account_emailconfirmation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."account_emailconfirmation" ("id", "created", "sent", "key", "email_address_id") FROM stdin;
\.


--
-- Data for Name: admins; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."admins" ("id_id", "created_at") FROM stdin;
\.


--
-- Data for Name: advertisements; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."advertisements" ("id", "store_id", "business_name", "ad_type", "description", "media_url", "media_type", "status", "created_at", "approved_at", "rejected_at", "rejection_reason", "approved_by_id", "rejected_by_id", "user_id") FROM stdin;
4b90ba91-7128-41a0-b85d-7d7f971f7420	17f0f0cd-fa4e-4a24-86ce-3854232a4603	Target Mashuka Store	banner	Looking for Quality Bed Sheets? Pure Uganda Cotton.	https://res.cloudinary.com/rlgqgsnv/image/upload/v1790939133/advertisements/godwpim3qj2y9n2qcdnf.jpg	image	active	2026-10-02 11:05:32.980128+00	\N	\N	\N	\N	\N	26b49bcc-d4e7-4563-85c5-9272fc7b39fe
\.


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."auth_group" ("id", "name") FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."auth_group_permissions" ("id", "group_id", "permission_id") FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."auth_permission" ("id", "name", "content_type_id", "codename") FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add content type	4	add_contenttype
14	Can change content type	4	change_contenttype
15	Can delete content type	4	delete_contenttype
16	Can view content type	4	view_contenttype
17	Can add session	5	add_session
18	Can change session	5	change_session
19	Can delete session	5	delete_session
20	Can view session	5	view_session
21	Can add user	6	add_user
22	Can change user	6	change_user
23	Can delete user	6	delete_user
24	Can view user	6	view_user
25	Can add category	7	add_category
26	Can change category	7	change_category
27	Can delete category	7	delete_category
28	Can view category	7	view_category
29	Can add sub category	8	add_subcategory
30	Can change sub category	8	change_subcategory
31	Can delete sub category	8	delete_subcategory
32	Can view sub category	8	view_subcategory
33	Can add products engine	9	add_productsengine
34	Can change products engine	9	change_productsengine
35	Can delete products engine	9	delete_productsengine
36	Can view products engine	9	view_productsengine
37	Can add leaf category	10	add_leafcategory
38	Can change leaf category	10	change_leafcategory
39	Can delete leaf category	10	delete_leafcategory
40	Can view leaf category	10	view_leafcategory
41	Can add profile	11	add_profile
42	Can change profile	11	change_profile
43	Can delete profile	11	delete_profile
44	Can view profile	11	view_profile
45	Can add product variation	12	add_productvariation
46	Can change product variation	12	change_productvariation
47	Can delete product variation	12	delete_productvariation
48	Can view product variation	12	view_productvariation
49	Can add product media	13	add_productmedia
50	Can change product media	13	change_productmedia
51	Can delete product media	13	delete_productmedia
52	Can view product media	13	view_productmedia
53	Can add order	14	add_order
54	Can change order	14	change_order
55	Can delete order	14	delete_order
56	Can view order	14	view_order
57	Can add order item	15	add_orderitem
58	Can change order item	15	change_orderitem
59	Can delete order item	15	delete_orderitem
60	Can view order item	15	view_orderitem
61	Can add message	16	add_message
62	Can change message	16	change_message
63	Can delete message	16	delete_message
64	Can view message	16	view_message
65	Can add dispute	17	add_dispute
66	Can change dispute	17	change_dispute
67	Can delete dispute	17	delete_dispute
68	Can view dispute	17	view_dispute
69	Can add advertisement	18	add_advertisement
70	Can change advertisement	18	change_advertisement
71	Can delete advertisement	18	delete_advertisement
72	Can view advertisement	18	view_advertisement
73	Can add admin	19	add_admin
74	Can change admin	19	change_admin
75	Can delete admin	19	delete_admin
76	Can view admin	19	view_admin
77	Can add store engine	20	add_storeengine
78	Can change store engine	20	change_storeengine
79	Can delete store engine	20	delete_storeengine
80	Can view store engine	20	view_storeengine
81	Can add shipping method	21	add_shippingmethod
82	Can change shipping method	21	change_shippingmethod
83	Can delete shipping method	21	delete_shippingmethod
84	Can view shipping method	21	view_shippingmethod
85	Can add brand	22	add_brand
86	Can change brand	22	change_brand
87	Can delete brand	22	delete_brand
88	Can view brand	22	view_brand
89	Can add lead	23	add_lead
90	Can change lead	23	change_lead
91	Can delete lead	23	delete_lead
92	Can view lead	23	view_lead
93	Can add otp model	24	add_otpmodel
94	Can change otp model	24	change_otpmodel
95	Can delete otp model	24	delete_otpmodel
96	Can view otp model	24	view_otpmodel
97	Can add Token	25	add_token
98	Can change Token	25	change_token
99	Can delete Token	25	delete_token
100	Can view Token	25	view_token
101	Can add Token	26	add_tokenproxy
102	Can change Token	26	change_tokenproxy
103	Can delete Token	26	delete_tokenproxy
104	Can view Token	26	view_tokenproxy
105	Can add site	27	add_site
106	Can change site	27	change_site
107	Can delete site	27	delete_site
108	Can view site	27	view_site
109	Can add email address	28	add_emailaddress
110	Can change email address	28	change_emailaddress
111	Can delete email address	28	delete_emailaddress
112	Can view email address	28	view_emailaddress
113	Can add email confirmation	29	add_emailconfirmation
114	Can change email confirmation	29	change_emailconfirmation
115	Can delete email confirmation	29	delete_emailconfirmation
116	Can view email confirmation	29	view_emailconfirmation
117	Can add social account	30	add_socialaccount
118	Can change social account	30	change_socialaccount
119	Can delete social account	30	delete_socialaccount
120	Can view social account	30	view_socialaccount
121	Can add social application	31	add_socialapp
122	Can change social application	31	change_socialapp
123	Can delete social application	31	delete_socialapp
124	Can view social application	31	view_socialapp
125	Can add social application token	32	add_socialtoken
126	Can change social application token	32	change_socialtoken
127	Can delete social application token	32	delete_socialtoken
128	Can view social application token	32	view_socialtoken
\.


--
-- Data for Name: authtoken_token; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."authtoken_token" ("key", "created", "user_id") FROM stdin;
\.


--
-- Data for Name: brands; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."brands" ("id", "name", "description", "logo") FROM stdin;
\.


--
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."categories" ("id", "icon_name", "name", "name_sw", "description", "created_at") FROM stdin;
0f4d3d19-96ff-4199-8063-159cccb059c3	Sprout	Agriculture & Food	Kilimo na Chakula	Mbegu, mbolea na mazao ya chakula	2026-08-25 11:36:09.08235+00
283b7fa7-d6b8-4f63-ae68-58c96ac019f4	Gift	Gifts & Crafts	Zawadi na Sanaa	Zawadi, kadi na sanaa za mikono	2026-08-25 11:36:09.08235+00
2c95a09c-1a27-43e0-9532-614b78e3efa5	Layers	Packaging & Printing	Vifungashio na Uchapishaji	Mifuko, maboksi na huduma za uchapishaji	2026-08-25 11:36:09.08235+00
36421f19-a9ba-49cd-a96f-66f488edaf26	Truck	Vehicles & Transport	Magari na Usafirishaji	Magari, pikipiki na usafirishaji	2026-08-25 11:36:09.08235+00
3729d0df-15e4-4dda-ae0b-7e63dce7e82a	ShieldCheck	Safety & Security	Usalama na Ulinzi	Camera za ulinzi na vifaa vya usalama	2026-08-25 11:36:09.08235+00
625042b4-ae95-4c08-975f-f7c315e402e2	Car	Automotive Supplies	Vifaa vya Magari	Vifaa vya magari na vyombo vya usafiri	2026-08-25 11:36:09.08235+00
652744e2-b4b3-4b74-a1e5-6bc58be4db82	Wrench	Tools & Hardware	Zana na Vyuma	Zana za kazi, nyundo na bisibisi	2026-08-25 11:36:09.08235+00
6a721858-9f9b-43b6-8294-9d53cce813d0	Bike	Sportswear & Outdoor	Michezo na Nje	Nguo maalum za mazoezi na safari	2026-08-25 11:36:09.08235+00
6bebacc8-ef9d-4de5-bde6-0a2f29b04a8b	Battery	Electrical Equipment	Vifaa vya Umeme	Betri, nyaya na vifaa vya umeme	2026-08-25 11:36:09.08235+00
719109cc-bb4f-4f04-ae1e-11a803aed41a	Warehouse	Luggage, Bags & Cases	Mabegi na Pochi	Mabegi ya safari, pochi na pochi za laptop	2026-08-25 11:36:09.08235+00
826506aa-2d4b-41c8-afd3-4d85ada92d1b	HardHat	Construction & Building	Ujenzi na Nyenzo	Vifaa vya ujenzi, sementi na nondo	2026-08-25 11:36:09.08235+00
83a4e976-29e2-40ec-8ab9-68fa9a74ad2a	Headphones	Consumer Electronics	Vifaa vya Kielektroniki	Simu, laptop, redio na vifaa vya kielektroniki	2026-08-25 11:36:09.08235+00
8c9521d1-1646-4e3d-8c95-b8c5fa2425b6	Gem	Jewelry, Eyewear & Watches	Vito, Miwani na Saa	Saa, miwani ya jua na vito vya thamani	2026-08-25 11:36:09.08235+00
8d8308cd-9382-4f1b-8b18-83c638cc58b4	Factory	Industrial Machinery	Mashine za Viwandani	Mashine kubwa za viwandani na uzalishaji	2026-08-25 11:36:09.08235+00
8e790248-aa30-4e4d-a171-eac4fd496b7e	Dribbble	Sports & Entertainment	Michezo na Burudani	Vifaa vya michezo, kambi na burudani	2026-08-25 11:36:09.08235+00
925e698a-9035-4cd6-9e63-f3651267443c	Home	Home & Garden	Nyumba na Bustani	Vifaa vya ndani, mapambo na bustani	2026-08-25 11:36:09.08235+00
95b341ac-be9e-45fe-859e-99e18630a1cf	Sun	Renewable Energy	Nishati Mbadala	Solar, panel na nishati mbadala	2026-08-25 11:36:09.08235+00
983c70d5-7150-4135-8d09-fea3616fd73b	Settings	Fabrication Services	Huduma za Ufundi	Huduma za ufundi na utengenezaji wa vyuma	2026-08-25 11:36:09.08235+00
bd779c12-f4af-44ce-a7bf-6281021ae28b	Dog	Pet Supplies	Vifaa vya Wanyama	Chakula na vifaa vya wanyama wa kufugwa	2026-08-25 11:36:09.08235+00
bee4ac11-904f-48ec-a327-3e798bc6be67	Sparkles	Beauty	Urembo	Vipodozi, manukato na urembo wa ngozi	2026-08-25 11:36:09.08235+00
cbb84b4d-9899-4d5d-a7fb-8ae463889f21	PenTool	School & Office	Shule na Ofisi	Madaftari, kalamu na vifaa vya ofisini	2026-08-25 11:36:09.08235+00
cc51ca9e-5de5-4a7a-8ede-1d0d43005967	ShoppingBag	Shoes & Accessories	Viatu na Vifaa	Viatu vya kiofisi, michezo na raba	2026-08-25 11:36:09.08235+00
cd3f773b-7039-4c5f-a2f1-53302153f9b3	HeartPulse	Health & Medical	Afya na Tiba	Dawa, vifaa tiba na huduma za afya	2026-08-25 11:36:09.08235+00
d12924c8-8b7c-4008-a891-7c273c3627fe	Baby	Personal & Home Care	Usafi wa Binafsi na Nyumbani	Usafi wa mwili na sabuni za nyumbani	2026-08-25 11:36:09.08235+00
f01c52c5-3317-4c72-9f91-0738d9dd51d3	Shirt	Apparel & Accessories	Nguo na Vifaa vya Kuvaa	Nguo, kofia, mikanda na vifaa vya kuvaa	2026-08-25 11:36:09.08235+00
9ef74a44-bb94-43e9-96c8-ca7a4fee334d	Music	Audio & Music Equipment	Sauti na Vifaa vya Muziki	Spika, maikrofoni, amplifier, vifaa vya DJ na muziki	2026-10-14 16:27:49.762104+00
754eaf89-2ff3-43bb-b5aa-7afb7b0dd480	Home	Home & Kitchen	Nyumbani na Jikoni	Vyombo vya kupikia, mapambo ya nyumbani, na vifaa vya jikoni	2026-10-25 18:44:44.282559+00
b7a1f6c4-3e2d-41a5-8c76-5d9e2f1a0b3c	Lightbulb	Lighting & Lighting Accessories	Taa na Vifaa vya Taa	Taa za ndani, za nje, taa za LED na vifaa vyake	2026-10-26 07:39:00+00
\.


--
-- Data for Name: disputes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."disputes" ("id", "store_id", "product_name", "reason", "description", "status", "created_at", "updated_at", "customer_id", "order_id", "product_id") FROM stdin;
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."django_admin_log" ("id", "action_time", "object_id", "object_repr", "action_flag", "change_message", "content_type_id", "user_id") FROM stdin;
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."django_content_type" ("id", "app_label", "model") FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	contenttypes	contenttype
5	sessions	session
6	users	user
7	products	category
8	products	subcategory
9	products	productsengine
10	products	leafcategory
11	products	profile
12	products	productvariation
13	products	productmedia
14	products	order
15	products	orderitem
16	products	message
17	products	dispute
18	products	advertisement
19	products	admin
20	products	storeengine
21	products	shippingmethod
22	products	brand
23	products	lead
24	products	otpmodel
25	authtoken	token
26	authtoken	tokenproxy
27	sites	site
28	account	emailaddress
29	account	emailconfirmation
30	socialaccount	socialaccount
31	socialaccount	socialapp
32	socialaccount	socialtoken
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."django_migrations" ("id", "app", "name", "applied") FROM stdin;
1	contenttypes	0001_initial	2026-07-28 13:01:47.969773+00
2	contenttypes	0002_remove_content_type_name	2026-07-28 13:02:05.879631+00
3	auth	0001_initial	2026-07-28 13:02:20.806694+00
4	auth	0002_alter_permission_name_max_length	2026-07-28 13:02:22.456968+00
5	auth	0003_alter_user_email_max_length	2026-07-28 13:02:24.12087+00
6	auth	0004_alter_user_username_opts	2026-07-28 13:02:25.841883+00
7	auth	0005_alter_user_last_login_null	2026-07-28 13:02:27.494099+00
8	auth	0006_require_contenttypes_0002	2026-07-28 13:02:29.161802+00
9	auth	0007_alter_validators_add_error_messages	2026-07-28 13:02:30.938477+00
10	auth	0008_alter_user_username_max_length	2026-07-28 13:02:32.665796+00
11	auth	0009_alter_user_last_name_max_length	2026-07-28 13:02:34.588765+00
12	auth	0010_alter_group_name_max_length	2026-07-28 13:02:36.643994+00
13	auth	0011_update_proxy_permissions	2026-07-28 13:02:38.537421+00
14	auth	0012_alter_user_first_name_max_length	2026-07-28 13:02:40.225509+00
15	users	0001_initial	2026-07-28 13:02:48.720198+00
16	admin	0001_initial	2026-07-28 13:02:52.474554+00
17	admin	0002_logentry_remove_auto_add	2026-07-28 13:02:53.727866+00
18	admin	0003_logentry_add_action_flag_choices	2026-07-28 13:02:55.431311+00
20	products	0002_alter_category_table	2026-07-28 13:02:59.596756+00
21	products	0003_subcategory	2026-07-28 13:03:02.903271+00
22	products	0004_productsengine	2026-07-28 13:03:07.628724+00
23	products	0005_leafcategory	2026-07-28 13:03:10.560293+00
24	products	0006_order_profile_admin_productvariation_productmedia_and_more	2026-07-28 13:03:30.244041+00
25	products	0007_storeengine	2026-07-28 13:03:34.45155+00
26	products	0008_profile_user	2026-07-28 13:03:36.162922+00
27	products	0009_alter_profile_updated_at	2026-07-28 13:03:37.841643+00
28	products	0010_remove_storeengine_tin_image_url_and_more	2026-07-28 13:03:41.300913+00
29	products	0011_remove_storeengine_office_images_and_more	2026-07-28 13:03:44.725059+00
30	products	0012_alter_storeengine_store_slug	2026-07-28 13:03:48.122416+00
31	products	0013_alter_productsengine_cover_image_and_more	2026-07-28 13:03:50.265403+00
32	products	0014_remove_productsengine_user_id_productsengine_user_and_more	2026-07-28 13:03:56.182803+00
33	products	0015_brand_shippingmethod_lead	2026-07-28 13:04:01.332787+00
34	products	0016_alter_advertisement_media_url	2026-07-28 13:04:03.292855+00
35	sessions	0001_initial	2026-07-28 13:04:06.836134+00
36	products	0017_productmedia_media_file_alter_productmedia_media_url	2026-07-31 11:04:24.378218+00
44	account	0001_initial	2026-08-08 13:11:48.45032+00
45	account	0002_email_max_length	2026-08-08 13:11:50.492745+00
46	account	0003_alter_emailaddress_create_unique_verified_email	2026-08-08 13:11:55.328362+00
47	account	0004_alter_emailaddress_drop_unique_email	2026-08-08 13:11:59.63471+00
48	account	0005_emailaddress_idx_upper_email	2026-08-08 13:12:02.703891+00
49	account	0006_emailaddress_lower	2026-08-08 13:12:06.02249+00
50	account	0007_emailaddress_idx_email	2026-08-08 13:12:10.125464+00
51	account	0008_emailaddress_unique_primary_email_fixup	2026-08-08 13:12:13.50291+00
52	account	0009_emailaddress_unique_primary_email	2026-08-08 13:12:16.352688+00
53	authtoken	0001_initial	2026-08-08 13:12:20.704778+00
54	authtoken	0002_auto_20160226_1747	2026-08-08 13:12:22.519732+00
55	authtoken	0003_tokenproxy	2026-08-08 13:12:25.580109+00
56	authtoken	0004_alter_tokenproxy_options	2026-08-08 13:12:27.667994+00
57	sites	0001_initial	2026-08-08 13:12:30.717753+00
58	sites	0002_alter_domain_unique	2026-08-08 13:12:33.181224+00
59	socialaccount	0001_initial	2026-08-08 13:12:43.696952+00
60	socialaccount	0002_token_max_lengths	2026-08-08 13:12:46.677367+00
61	socialaccount	0003_extra_data_default_dict	2026-08-08 13:12:48.778122+00
62	socialaccount	0004_app_provider_id_settings	2026-08-08 13:12:53.98306+00
63	socialaccount	0005_socialtoken_nullable_app	2026-08-08 13:12:59.098144+00
64	socialaccount	0006_alter_socialaccount_extra_data	2026-08-08 13:13:01.413039+00
67	products	0001_initial	2026-08-22 17:03:58.832961+00
68	products	0002_alter_storeengine_office_image_1_and_more	2026-08-22 17:04:01.532654+00
69	products	0003_remove_productsengine_category_and_more	2026-08-22 17:04:06.519923+00
70	products	0004_productsengine_products_en_user_id_e0a5ac_idx_and_more	2026-08-22 17:04:28.089601+00
71	products	0005_category_categories_name_98d7d5_idx_and_more	2026-08-22 17:04:47.589754+00
72	products	0006_storeengine_stores_engi_owner_i_c6fa9c_idx_and_more	2026-08-22 17:05:04.082384+00
73	products	0007_advertisement_advertiseme_user_id_cf8b3d_idx_and_more	2026-08-22 17:05:14.361943+00
74	products	0008_otpmodel	2026-08-22 17:05:19.535632+00
75	products	0009_profile_is_otp_verified	2026-08-22 17:05:21.676701+00
76	products	0010_productsengine_discount	2026-08-22 17:05:24.198054+00
77	products	0011_alter_message_created_at	2026-08-22 17:05:27.991738+00
78	products	0012_message_image	2026-08-30 09:25:21.960599+00
79	products	0013_storeengine_latitude_storeengine_longitude	2026-09-03 09:13:33.807972+00
80	products	0014_profile_latitude_profile_longitude	2026-09-03 09:13:36.567143+00
81	products	0015_remove_productsengine_store_id_productsengine_store	2026-09-03 10:17:08.251072+00
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."django_session" ("session_key", "session_data", "expire_date") FROM stdin;
jcd42x2mc3ggblv1eoxmpxvvislwecz6	.eJxVjMEOgyAQRP9lz43Rggre2h8hy-4SSSkmFXpp-u_VxovHeTPzPoBES83FveUVQxR28sSYYMo1pQs4rGV2dZWXiwwTdAZO0CM9JO8NprTj5vA1_81Rr81tS5JLJCxxyffjdVLNuM6bZwy-07Y3wUgYvOqEWs2jleDR9qyu1rKwbdGaQMrTwGOvtLBHTYYNe_j-ANo7SVg:1xDP7E:YvjnpRpYaq_mNMZuu-y5YIv-ZQ_JVbucgMDNK7v8-1Q	2026-10-18 16:31:08.219476+00
vtat7qy5e5squysehbxe3k3d3x50epbq	.eJxVjDsOwjAQBe_iGln-xR9Kes5g7dprHEC2FCcV4u4QKQW0b2bei0XY1hq3QUucMzszyU6_G0J6UNtBvkO7dZ56W5cZ-a7wgw5-7Zmel8P9O6gw6rcWxaIUyheUZLIuJKUGh8Fb5ZRQtgAm46ZkTSA5AWjnsXgIhgoISsTeH-DFOFs:1xKslE:BkCHu6sRLhLfvXNC4t99dDfAdIgdiPYmJLVMyfd5--M	2026-11-08 07:35:20.424312+00
\.


--
-- Data for Name: django_site; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."django_site" ("id", "domain", "name") FROM stdin;
1	example.com	example.com
\.


--
-- Data for Name: leads; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."leads" ("id", "customer_name", "email", "message", "created_at", "store_id") FROM stdin;
\.


--
-- Data for Name: leaf_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."leaf_categories" ("id", "created_at", "name", "name_sw", "require_gender", "require_size", "color_required", "warranty_required", "weight_required", "dimensions_required", "bulk_pricing_tiers", "min_stock_warning", "measurement_unit", "size_format", "material_type", "icon_name", "color_hex", "meta_title", "meta_description", "condition_options", "custom_fields", "specs", "sub_category_id") FROM stdin;
76b8e88f-afeb-488a-a6c7-20c0d85f6891	2026-08-25 14:45:47.341108+00	Certified Loose Diamonds	Almasi Zilizothibitishwa Zilizolegea	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Gemstone Shape", "Certification Body"]	3514bda2-4236-4e49-ae36-ed1a2f1fbaae
ea4ae1c9-1a4a-4574-bfa4-4a4b7896ecd3	2026-08-25 14:45:47.341108+00	Tanzanite	Tanzanite	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Origin", "Investment Grade"]	3514bda2-4236-4e49-ae36-ed1a2f1fbaae
1d9c6145-89ac-43c2-b9bf-05cb3cfcc3ff	2026-08-25 14:45:47.341108+00	Gold Coins	Sarafu za Dhahabu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Serial Number", "Investment Grade"]	3514bda2-4236-4e49-ae36-ed1a2f1fbaae
331880e9-7d5b-40a2-a4c8-d68187b9464f	2026-08-25 14:45:47.341108+00	Universal Remotes	Remotes za Universal	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Remote Technology", "Compatibility"]	3c7c9c5f-b551-48f4-b4d2-c0510ead8094
95c63b11-7459-4b1b-a72b-33aaf01591d7	2026-08-25 14:45:47.341108+00	TV Wall Mounts	Vipachiki vya Ukutani vya TV	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Mount Type", "Max Weight"]	3c7c9c5f-b551-48f4-b4d2-c0510ead8094
a8707e0f-7f63-43ab-8384-b213f0482df2	2026-08-25 14:45:47.341108+00	Ceiling Brackets	Mabano ya Dari	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["VESA Standard", "Max Weight"]	3c7c9c5f-b551-48f4-b4d2-c0510ead8094
5b3c2e9f-a658-472a-a942-3c1ae3afc15d	2026-08-25 14:45:47.341108+00	Basketball Jerseys	Jezi za Mpira wa Kikapu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Weight", "Reversible Design"]	05483a18-d3d2-4e67-99ea-b4ab83413798
4845b542-88cc-452e-a50a-31bb40f3a5fc	2026-08-25 14:45:47.341108+00	Basketball Shorts	Kaptula za Mpira wa Kikapu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sleeve Style", "Fit Type"]	05483a18-d3d2-4e67-99ea-b4ab83413798
1fbe92d0-965f-4de2-bcfb-b52897915542	2026-08-25 14:45:47.341108+00	Tire Repair Kits	Kiti za Kukarabati Tairi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tire Plug Method", "Case/Storage"]	5c3f59e8-0b37-4856-a63e-91fe3a8ff147
9a295a20-75ba-49d6-9644-084c108b2aa4	2026-08-25 14:45:47.341108+00	Jump Starters	Vianzishaji vya Kurukaruka	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Peak Current", "Battery Capacity"]	5c3f59e8-0b37-4856-a63e-91fe3a8ff147
09a00809-2ce1-4c27-b801-b319cce402a0	2026-08-25 14:45:47.341108+00	Oil Drainers	Vimiminika Mafuta	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tank Capacity", "Material"]	5c3f59e8-0b37-4856-a63e-91fe3a8ff147
31d088c8-3e11-4ee0-8fa4-bd908f75abf0	2026-08-25 14:46:01.525618+00	CNC Press Brake Bending	Kunjiko la CNC la Kubonyeza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Maximum Bending Length", "Press Force"]	4a2fbcdb-1704-4d62-8bda-dea87354c397
72be8988-314b-4c29-96d1-b2ec9a8738ed	2026-08-25 14:46:01.525618+00	Tube Rolling	Kuviringisha Mirija	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tube Diameter Range", "Complexity Level"]	4a2fbcdb-1704-4d62-8bda-dea87354c397
994551c2-6f10-4b38-a24d-f9eb77164680	2026-08-25 14:46:01.525618+00	Webbing Slings	Kombeo za Kufuma	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Breaking Strength", "Material"]	4c24d053-6fdc-4c8d-af8a-b00705651bb5
d781ce61-6d03-4e3a-bf6b-3efb81dd9608	2026-08-25 14:46:01.525618+00	Cargo Straps	Mikanda ya Mizigo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Breaking Strength", "Length"]	4c24d053-6fdc-4c8d-af8a-b00705651bb5
76d14aa2-bee2-4538-83a3-d2a8b08d8e8c	2026-08-25 14:46:01.525618+00	Steel Wire Ropes	Kamba za Waya wa Chuma	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Safety Factor", "End Fitting Type"]	4c24d053-6fdc-4c8d-af8a-b00705651bb5
5fcef419-ecd0-4c2f-a720-72633ad6beff	2026-08-25 14:46:01.525618+00	Satin Bonnets	Bonnets za Satin	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Lining Material", "Size"]	30db2cee-1181-4018-98f7-3526fbeadd6a
7ee49a5a-e095-4290-99f1-932448ca9316	2026-08-25 14:46:01.525618+00	Shower Caps	Vifuniko vya Kuogelea	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Waterproof Level", "Size"]	30db2cee-1181-4018-98f7-3526fbeadd6a
ecbb9543-c2c3-4ac6-a9e5-308e5a36855c	2026-08-25 14:46:01.525618+00	Hair Rollers	Viringo vya Nywele	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Roller Type", "Size"]	30db2cee-1181-4018-98f7-3526fbeadd6a
33cf69d4-701e-46ca-86ce-ff1766173938	2026-08-25 14:46:01.525618+00	Diffusers	Vinyunyuzia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Adjustable Strap", "Waterproof"]	30db2cee-1181-4018-98f7-3526fbeadd6a
3cb85944-02e9-4d09-b1a2-3462b4419458	2026-08-25 14:46:01.525618+00	Oysters	Chaza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Variety", "Cleaned Status"]	14599e8d-2dfe-444d-97cd-3cb0058c469c
9189e54c-b6e2-4ad1-8dcd-75b4e1960965	2026-08-25 14:46:01.525618+00	Mussels	Kome	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Variety", "Quantity per Pack"]	14599e8d-2dfe-444d-97cd-3cb0058c469c
543e2fd8-ca77-4a91-a660-3a5f0028b2ca	2026-08-25 14:46:01.525618+00	Clams	Kunde	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Variety", "Live Status"]	14599e8d-2dfe-444d-97cd-3cb0058c469c
174cb713-89f8-404c-a332-320adb122431	2026-08-25 14:46:12.566974+00	Eye Creams	Krimu za Macho	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Formulation", "Packaging Type"]	44e22ab6-c361-449d-a346-836b2ebb391e
b7be9473-665f-4d7c-9973-f08b11c985eb	2026-08-25 14:46:12.566974+00	Lip Balms	Balms za Midomo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Flavor/Scent", "Organic"]	44e22ab6-c361-449d-a346-836b2ebb391e
d969b7a6-016d-4394-b2e8-5858bf41e523	2026-08-25 14:46:12.566974+00	Lip Scrubs	Msuguo wa Midomo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Flavor/Scent", "Sun Protection"]	44e22ab6-c361-449d-a346-836b2ebb391e
cde4ef6a-ccec-4d39-a328-7a8288e624cc	2026-08-25 14:46:12.566974+00	Heavy-duty Industrial Connectors	Viunganishi vya Viwandani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["IP Rating", "Current Rating"]	48daff56-14d6-4285-b003-de894dd6365d
8b8139a6-0b07-47ab-95df-2d607a3a70b5	2026-08-25 14:46:12.566974+00	Resistance Bands	Bendi za Upinzani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Resistance Level", "Material"]	2484cb17-be96-4b8d-aef6-e761a2870314
ab5b618e-183e-4ed2-98de-bf1c4c710dcc	2026-08-25 14:46:12.566974+00	Exercise Balls	Mipira ya Mazoezi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Diameter", "Anti-burst"]	2484cb17-be96-4b8d-aef6-e761a2870314
9bdec07e-b3b4-4df0-a2f6-1c425ff5397b	2026-08-25 14:46:12.566974+00	Pedal Exercisers	Vigeuza Kanyagio	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Digital Display", "Resistance"]	2484cb17-be96-4b8d-aef6-e761a2870314
c4c79c32-7197-40d2-87b0-881b067a2a0d	2026-08-25 14:46:12.566974+00	Monocrystalline Panels	Paneli za Monocrystalline	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Wattage", "Efficiency"]	039161f1-24ec-4640-821a-ef5d7a6ba454
cdf61367-1954-4d7e-a6e5-552fbb4d2c02	2026-08-25 14:46:12.566974+00	Polycrystalline Panels	Paneli za Polycrystalline	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Wattage", "Cell Type"]	039161f1-24ec-4640-821a-ef5d7a6ba454
61943d99-a8fc-4d65-b612-9c13e9af55a0	2026-08-25 14:46:12.566974+00	Flexible Panels	Paneli Zinazonyumbulika	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Wattage", "Frame Material"]	039161f1-24ec-4640-821a-ef5d7a6ba454
0a652b0b-ac80-4872-8d1b-f1e104bc3cf9	2026-08-25 14:46:12.566974+00	Teeth Whitening Strips	Vipande vya Kugeuza Meno	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Whitening Agent", "Duration"]	41195db4-dd21-4394-bb83-e3560085aea2
efe0ec63-decb-4bc6-a584-9e037be74f05	2026-08-25 14:46:12.566974+00	Water Flossers	Viosha Meno vya Maji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Pressure Settings", "Safety"]	41195db4-dd21-4394-bb83-e3560085aea2
9ad55ef1-f727-4d08-9d7e-87738e6eb18a	2026-08-25 14:46:12.566974+00	Tongue Scrapers	Vichomoa Ulimi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Safety"]	41195db4-dd21-4394-bb83-e3560085aea2
dbc2b5a7-6c02-43cb-a9fd-df01d26a067c	2026-08-25 14:46:21.327948+00	Serums	Seramu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Main Ingredient", "Size"]	44e22ab6-c361-449d-a346-836b2ebb391e
03c6e510-7a03-4b51-9879-b7773bd7ee06	2026-08-25 14:46:21.327948+00	Essence	Asili	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Main Ingredient", "Size"]	44e22ab6-c361-449d-a346-836b2ebb391e
0d3c400a-24e7-42a0-9f84-51f4d7c4afc4	2026-08-25 14:46:21.327948+00	Makeup Bags	Mifuko ya Vipodozi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	ecb7d34b-181c-4108-87c1-f802479cea0c
1c77f199-372f-4ba7-bdd5-1ceacf7445bd	2026-08-25 14:46:21.327948+00	Makeup Organizers	Vipangaji vya Vipodozi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Compartments", "Waterproof"]	ecb7d34b-181c-4108-87c1-f802479cea0c
2b28897a-2de6-4b5d-942c-0d8c7c0ad26a	2026-08-25 14:46:21.327948+00	T-Shirts	T-Shati	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Neck Style"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
a63bd594-3f6a-4e21-a379-826f7e4b6e33	2026-08-25 14:46:21.327948+00	Tennis Bracelets	Banglesi za Tenisi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bracelet Circumference", "Total Carat"]	3514bda2-4236-4e49-ae36-ed1a2f1fbaae
10da4038-1bd0-4fc9-9656-ba3a6d8db893	2026-08-25 14:46:21.327948+00	Cuff Bangles	Bangili za Kufunga	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Diamond Clarity", "Style"]	3514bda2-4236-4e49-ae36-ed1a2f1fbaae
0355f369-fc25-4538-9995-6c1de38b523e	2026-08-25 14:46:21.327948+00	Stud Earrings	Pete za Masikio	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Earring Backing", "Diamond Color"]	3514bda2-4236-4e49-ae36-ed1a2f1fbaae
9724e50f-8754-4f93-9c65-18b9b38335e0	2026-08-25 14:46:21.327948+00	Used Brand Name Sneakers	Sneakers za Chapa Zilizotumika	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Brand Authenticity", "Condition Grade"]	06f6e4e6-73dd-4780-83e3-5dc980c49e84
6ec2bda3-c01c-4b7c-af02-cabe876173af	2026-08-25 14:46:21.327948+00	Sports Shoes	Viatu vya Michezo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sole Wear", "Condition Grade"]	06f6e4e6-73dd-4780-83e3-5dc980c49e84
35b01bed-9aad-4036-b451-ddd8e874868f	2026-08-25 14:46:21.327948+00	Ceramic Pots	Vyungu vya Udongo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Diameter", "Drainage Hole"]	43b79475-733c-499d-a2dc-f06fa528d3ba
a1b0d138-c026-4e14-98ed-98b7ec2a24d7	2026-08-25 14:46:21.327948+00	Plastic Planters	Vipandia vya Plastiki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "UV Stabilized"]	43b79475-733c-499d-a2dc-f06fa528d3ba
f2a3b4c5-7777-4576-d7d2-777700000010	2026-10-08 16:30:52.133928+00	Rugged Laptops	Laptops za Uwanjani	f	f	t	t	t	f	f	5	metric	standard	reinforced	Shield	#065f46	Rugged Laptops - Durable	Laptops imara kwa mazingira magumu	["new", "refurbished"]	{}	["Processor", "RAM", "Storage", "Screen Size", "IP Rating", "Drop Resistance"]	b2c3d4e5-7777-4b3c-9d4e-777788889999
a3b4c5d6-7777-4677-e8e3-777700000011	2026-10-08 16:30:52.59022+00	Thin & Light Laptops	Laptops Nyepesi	f	f	t	t	t	f	f	5	metric	standard	aluminum	Zap	#0891b2	Thin & Light Laptops - Portable	Laptops nyepesi na nyembamba	["new"]	{}	["Processor", "RAM", "Storage", "Screen Size", "Weight", "Thickness", "Battery Life"]	b2c3d4e5-7777-4b3c-9d4e-777788889999
b4c5d6e7-7777-4778-f9f4-777700000012	2026-10-08 16:30:53.132209+00	Touchscreen Laptops	Laptops za Kugusa	f	f	t	t	t	f	f	5	metric	standard	glass	Hand	#7c3aed	Touchscreen Laptops - Interactive	Laptops zenye screen ya kugusa	["new", "refurbished"]	{}	["Processor", "RAM", "Storage", "Screen Size", "Touchscreen Type", "Battery Life"]	b2c3d4e5-7777-4b3c-9d4e-777788889999
64bf27a4-f11f-4df1-8605-57d73f6d4e38	2026-10-14 16:27:49.762104+00	Professional PA Subwoofer	Subwoofer ya Jukwaa	f	f	t	t	t	t	f	5	pc	18 inch	Wood			Professional PA Subwoofer - Heavy Bass	Subwoofer ya nguvu kwa matukio na DJ	["new", "used"]	{}	["Power Output", "Frequency Range", "Impedance", "Weight"]	71ad562a-d519-4034-85e2-fcb3a4bdf59f
4876207b-a1b4-4547-b109-f43d5808170d	2026-10-14 16:27:49.762104+00	Portable Bluetooth Speaker	Spika ya Bluetooth	f	f	t	t	t	t	f	5	pc	Medium	Plastic			Portable Bluetooth Speaker - Rechargeable	Spika ndogo ya kubeba na Bluetooth	["new", "used"]	{}	["Battery Life", "Bluetooth Version", "Power Output"]	71ad562a-d519-4034-85e2-fcb3a4bdf59f
8cd30101-f36f-4aa1-adfd-98fc47528c9a	2026-10-14 16:27:49.762104+00	Home Theater Speaker	Spika ya Nyumbani	f	f	t	t	t	t	f	5	set	5.1 Channel	Wood			Home Theater Speaker System	Mfumo wa spika za nyumbani	["new", "used"]	{}	["Channels", "Power Output", "Connectivity"]	71ad562a-d519-4034-85e2-fcb3a4bdf59f
a9a4ba73-34bc-482b-8193-4ad17a6ab757	2026-10-14 16:27:49.762104+00	Wireless Microphone	Maikrofoni isiyo na waya	f	f	t	t	t	t	f	5	pc	Standard	Metal			Wireless Microphone - Rechargeable	Maikrofoni isiyo na waya kwa matukio	["new", "used"]	{}	["Frequency Range", "Battery Life", "Range"]	2fc2dcda-074f-4cc2-b0ea-9d94e1d69462
3e19bb56-b1a3-459c-ab14-ad07befe1637	2026-10-14 16:27:49.762104+00	Studio Condenser Mic	Maikrofoni ya Studio	f	f	t	t	t	t	f	5	pc	Standard	Metal			Studio Condenser Microphone	Maikrofoni ya kurekodi sauti safi	["new", "used"]	{}	["Polar Pattern", "Frequency Response", "Sensitivity"]	2fc2dcda-074f-4cc2-b0ea-9d94e1d69462
8b2dfdfd-2a4e-4d69-a15f-b7c76473bc63	2026-08-25 14:40:43.415747+00	Outdoor Antennas	Antena za Nje	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Antenna Gain (dB)", "Reception Range (km)"]	3c7c9c5f-b551-48f4-b4d2-c0510ead8094
39d23e8b-3aaa-4245-8c9e-739e156be30e	2026-08-25 14:40:43.415747+00	Indoor Antennas	Antena za Ndani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Antenna Gain (dB)", "Reception Range (km)"]	3c7c9c5f-b551-48f4-b4d2-c0510ead8094
f30c2f46-8162-4dc6-974e-3798b3647550	2026-08-25 14:40:43.415747+00	LNBs	LNB	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["LNB Type (Single/Dual/Quattro)", "Frequency Band"]	3c7c9c5f-b551-48f4-b4d2-c0510ead8094
33679df2-df6b-45e1-b3f9-f4369a235dbb	2026-08-25 14:40:43.415747+00	Satellite Dishes	Vyombo vya Setelaiti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Dish Diameter (cm)", "Weatherproofing Material"]	3c7c9c5f-b551-48f4-b4d2-c0510ead8094
1997756f-6c8b-4e12-921f-008e59450ee1	2026-08-25 14:40:43.415747+00	DVB-T2 Receivers	Vipokezi vya DVB-T2	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Resolution Support", "Operating System"]	3c7c9c5f-b551-48f4-b4d2-c0510ead8094
e95ce4bd-da90-4ce4-8416-c07a16cc8579	2026-08-25 14:40:43.415747+00	DVB-S2 Receivers	Vipokezi vya DVB-S2	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Resolution Support", "Operating System"]	3c7c9c5f-b551-48f4-b4d2-c0510ead8094
de8302fb-e27c-4162-91f9-9538523c7bd6	2026-08-25 14:40:43.415747+00	Android TV Boxes	Sanduku za Android TV	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Resolution Support", "Operating System"]	3c7c9c5f-b551-48f4-b4d2-c0510ead8094
fae68cc8-2bb0-41c4-8541-03fbc923b7f9	2026-08-25 14:40:43.415747+00	Streaming Sticks	Fimbo za Kutiririsha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Resolution Support", "Operating System"]	3c7c9c5f-b551-48f4-b4d2-c0510ead8094
c3ff10b9-e413-4320-9a13-ae60d4652c3a	2026-08-25 14:40:43.415747+00	HDMI Cables	Kebo za HDMI	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cable Length (m)", "HDMI Version"]	3c7c9c5f-b551-48f4-b4d2-c0510ead8094
b9c55743-fc11-46b0-9a1c-6bd0c3f82233	2026-08-25 14:40:43.415747+00	Coaxial Cables	Kebo za Coaxial	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cable Length (m)", "Shielding Type"]	3c7c9c5f-b551-48f4-b4d2-c0510ead8094
7ee67a11-3f65-45a4-b605-1da15a3243fc	2026-08-25 14:40:43.415747+00	AV Adapters	Adapta za AV	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Connector Plating", "Signal Conversion"]	3c7c9c5f-b551-48f4-b4d2-c0510ead8094
3d12bf87-be6b-48dd-b844-afe498a3e36e	2026-10-14 16:27:49.762104+00	Dynamic Vocal Mic	Maikrofoni ya Sauti	f	f	t	t	t	t	f	5	pc	Standard	Metal			Dynamic Vocal Microphone	Maikrofoni ya kusimama jukwaani	["new", "used"]	{}	["Polar Pattern", "Impedance", "Connector Type"]	2fc2dcda-074f-4cc2-b0ea-9d94e1d69462
11a637a6-6c4f-4852-9bb3-949396271fa6	2026-10-14 16:27:49.762104+00	Audio Mixer Console	Mixer ya Sauti	f	f	t	t	t	t	f	5	pc	8 Channel	Metal			Professional Audio Mixer Console	Mixer ya kuchanganya sauti	["new", "used"]	{}	["Channels", "Inputs", "Outputs", "EQ"]	d443bdc7-c450-46a6-acf8-df9ae3a0bfd3
4be1a41d-50b1-4c3f-bae4-7809489f8b2a	2026-10-14 16:27:49.762104+00	Power Amplifier	Amplifier ya Nguvu	f	f	t	t	t	t	f	5	pc	Standard	Metal			Power Amplifier - High Output	Amplifier ya kuongeza sauti	["new", "used"]	{}	["Power Output", "Channels", "Impedance"]	d443bdc7-c450-46a6-acf8-df9ae3a0bfd3
8d6dce69-cbc9-45cb-bfab-c1b84a010f64	2026-10-14 16:27:49.762104+00	DJ Controller	Controller ya DJ	f	f	t	t	t	t	f	5	pc	Standard	Plastic			DJ Controller - USB	Controller ya DJ wa kisasa	["new", "used"]	{}	["Channels", "Compatibility", "Inputs"]	d443bdc7-c450-46a6-acf8-df9ae3a0bfd3
105440f3-7a30-4760-b1f1-a792c623204c	2026-10-14 16:27:49.762104+00	Turntable	Turntable	f	f	t	t	t	t	f	5	pc	Standard	Metal			Professional Turntable	Turntable ya DJ	["new", "used"]	{}	["Speed", "Drive Type", "Tonearm"]	49a0a9b2-a56f-4b23-a1fc-3a89e4eab3fa
733a6e20-d4f5-42f4-ae92-2a106e1468eb	2026-10-14 16:27:49.762104+00	DJ Headphones	Headphones za DJ	f	f	t	t	t	t	f	5	pc	Standard	Plastic			DJ Headphones - Noise Cancelling	Headphones za DJ	["new", "used"]	{}	["Frequency Response", "Impedance", "Cable Length"]	49a0a9b2-a56f-4b23-a1fc-3a89e4eab3fa
eecf78dd-77b5-4257-bd80-80686fb3de76	2026-10-14 16:27:49.762104+00	DJ Lighting System	Taa za DJ	f	f	t	t	t	t	f	5	set	Standard	Plastic			DJ Lighting System - LED	Taa za DJ na matukio	["new", "used"]	{}	["Light Type", "Modes", "Power"]	49a0a9b2-a56f-4b23-a1fc-3a89e4eab3fa
f23b57b1-d8a6-40c9-ade5-399c2e86b242	2026-10-14 16:27:49.762104+00	XLR Cable	Kebo ya XLR	f	f	t	t	t	t	f	5	pc	3m	Copper			XLR Cable - Professional	Kebo ya XLR kwa maikrofoni	["new", "used"]	{}	["Length", "Connector Type", "Shielding"]	c54aa523-71cd-4497-aa59-0680cb8a32e8
96cae9bc-e208-4e62-9e6f-b771794e6c20	2026-10-14 16:27:49.762104+00	Audio Jack Cable	Kebo ya Jack	f	f	t	t	t	t	f	5	pc	3m	Copper			Audio Jack Cable - 3.5mm	Kebo ya sauti ya Jack	["new", "used"]	{}	["Length", "Connector Type", "Compatibility"]	c54aa523-71cd-4497-aa59-0680cb8a32e8
3b09ccda-771d-4493-931e-5d93dfaee935	2026-10-14 16:27:49.762104+00	Speakon Cable	Kebo ya Speakon	f	f	t	t	t	t	f	5	pc	5m	Copper			Speakon Cable - Heavy Duty	Kebo ya spika za nguvu	["new", "used"]	{}	["Length", "Connector Type", "Gauge"]	c54aa523-71cd-4497-aa59-0680cb8a32e8
6d4bb89c-4852-4267-93a6-6c4318cb451e	2026-10-14 16:27:49.762104+00	Acoustic Guitar	Gita ya Akustiki	f	f	t	t	t	t	f	5	pc	Full Size	Wood			Acoustic Guitar - 6 String	Gita ya akustiki	["new", "used"]	{}	["Strings", "Body Material", "Size"]	45492267-52d3-445b-9831-28c3f178f56f
796367cc-feaf-4c20-9874-750b0cbbfb7c	2026-10-25 18:44:44.282559+00	Cooking Pots	Masufuria	f	f	t	f	t	t	f	5	Pieces	Medium	Aluminium	Pot	\N	\N	\N	["new", "used"]	{}	["Lid Included"]	445fe3b7-7acc-470c-a304-b5dd003b976e
4bbb5004-99ef-4d9e-873a-ac98b5932bc1	2026-08-25 14:40:48.472784+00	Brake Pads	Pedali za Breki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Placement"]	00597f28-08b3-46da-a858-347cb5def3ec
96d37fb8-a2b9-4151-8608-f1837180449c	2026-08-25 14:40:48.472784+00	Brake Discs	Diski za Breki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	00597f28-08b3-46da-a858-347cb5def3ec
73d20f31-6cab-46cb-a785-9c83634dc2d9	2026-08-25 14:40:48.472784+00	Brake Shoes	Viatu vya Breki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	00597f28-08b3-46da-a858-347cb5def3ec
51e8a2a1-3f74-4aba-9a53-570f112cbb2a	2026-08-25 14:40:48.472784+00	Wheel Bearings	Fani za Magurudumu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	00597f28-08b3-46da-a858-347cb5def3ec
a035a3a7-d59e-450f-95ec-0c0b406b034f	2026-08-25 14:40:48.472784+00	Headlights	Taa za Mbele	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bulb Type", "Wattage"]	00597f28-08b3-46da-a858-347cb5def3ec
7236fa89-849e-4aa5-967f-098ff2a7020a	2026-08-25 14:40:48.472784+00	Tires	Matairi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Type"]	554769e5-2049-4f32-b9b9-b212525a38d8
586e9f62-b95b-48b9-9945-0e72136a4f0b	2026-08-25 14:40:48.472784+00	Passenger Tires	Matairi ya Abiria	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Type"]	554769e5-2049-4f32-b9b9-b212525a38d8
b6bec6c6-11de-4e47-841a-b70c5d367675	2026-08-25 14:40:48.472784+00	SUV Tires	Matairi ya SUV	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Type"]	554769e5-2049-4f32-b9b9-b212525a38d8
aedc1236-71c7-452b-a9da-72c4fdf9b1ef	2026-08-25 14:40:48.472784+00	Truck Tires	Matairi ya Lori	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Type"]	554769e5-2049-4f32-b9b9-b212525a38d8
532da6fa-fd29-4ef8-9e5c-0f74f0254be1	2026-08-25 14:40:48.472784+00	Dash Cameras	Kamera za Dash	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Resolution", "Features"]	1bdeda97-c87a-4f8d-bd7e-b3c7c3b1ee8e
629c2f2b-758d-4fec-8ce4-f3b614405931	2026-08-25 14:40:48.472784+00	Reverse Cameras	Kamera za Nyuma	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Resolution", "Features"]	1bdeda97-c87a-4f8d-bd7e-b3c7c3b1ee8e
929eba30-ac6c-44b2-8f44-45f0380e8eab	2026-08-25 14:40:48.472784+00	Anti-theft Systems	Mifumo ya Kuzuia Wizi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Features"]	1bdeda97-c87a-4f8d-bd7e-b3c7c3b1ee8e
588c685d-5943-4e79-a5fd-752c275feded	2026-08-25 14:40:48.914614+00	Hand Tools	Zana za Mikono	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	1b416443-6659-4681-9fd6-d90fc3f0c7c2
fca5609e-cff2-433b-81f0-4cc96323b7b0	2026-08-25 14:40:48.914614+00	Power Tools	Zana za Umeme	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Power"]	be6ad370-2ded-4273-a738-0ee2045e7b2f
5f508eb2-e4fb-4791-a2ab-1e1c599b9aed	2026-08-25 14:40:48.914614+00	Tool Sets	Seti za Zana	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Pieces", "Material"]	41c0b35d-9d6e-4f66-b256-1ab4946f6784
d4dc347e-52fc-48ac-9f46-cb0c38909b55	2026-08-25 14:40:48.914614+00	Screws & Bolts	Screws na Boliti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Size"]	210aa68f-f93f-4411-a9f1-ed2bcbe5a743
ac5125d8-b445-41be-a0c3-73601d1f3c9f	2026-08-25 14:40:48.914614+00	Nails	Misumari	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Size"]	210aa68f-f93f-4411-a9f1-ed2bcbe5a743
1693a26b-f1f5-4e91-99bf-be9841bf5bf5	2026-08-25 14:40:49.327809+00	Switches	Swichi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Rating"]	90ae28d4-2b5e-4680-b1f2-32f68c2014dd
51c4485d-780c-4ef3-965e-18fd10964224	2026-08-25 14:40:49.327809+00	Plugs	Plagi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Rating"]	48daff56-14d6-4285-b003-de894dd6365d
2d80626e-f94c-469c-9868-bb1635f2b4b1	2026-08-25 14:40:49.327809+00	Sockets	Soketi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Rating"]	48daff56-14d6-4285-b003-de894dd6365d
5961f49f-ccf6-4fdd-bc0f-0b5222e93fec	2026-08-25 14:40:49.769298+00	Notebooks	Madaftari	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Pages"]	3646a747-08ad-44cd-847b-f42ddbd1c9cc
d51254b9-9dcc-46c4-8996-f291070712a0	2026-08-25 14:40:49.769298+00	Pens	Kalamu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Color"]	2a254b33-d89a-4d57-b00d-407b471313f4
703bcea8-ff75-4116-af9d-a16d6673e224	2026-08-25 14:40:49.769298+00	School Supplies	Vifaa vya Shule	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	79f2da2d-cc4f-46e7-96c4-d71536dc0813
9d9de445-c371-4633-898e-c3f68fedeeec	2026-08-25 14:40:50.360119+00	Windows	Madirisha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Size"]	0f756812-3bfe-42a7-9337-0e6826de39ae
78cec097-95ed-4a1c-a8c4-3e172a9c2a9e	2026-08-25 14:40:50.360119+00	Doors	Milango	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Size"]	0f756812-3bfe-42a7-9337-0e6826de39ae
9d9c3bf6-9e7e-4428-85e9-3be996af8900	2026-08-25 14:40:50.360119+00	Roofing Materials	Vifaa vya Paa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Size"]	223c9228-c75a-4833-b40d-99ce92c46725
4cfc1403-49c7-4ba0-a18d-e4878ee9187d	2026-08-25 14:40:50.360119+00	Building Glass	Vioo vya Ujenzi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Size"]	43b3749b-aa25-4702-8f23-1999e78dbc83
de1a28e0-de09-4fe8-8974-2fb3837394e3	2026-08-25 14:40:50.360119+00	Flooring	Sakafu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Size"]	8b4e1a54-f1ca-4d55-ba9b-7e3895808f1f
cc38f8a8-c507-4870-a1fe-21a9807a7bb9	2026-08-25 14:40:50.360119+00	Ladders	Ngazi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Height"]	560775e5-ad04-404d-9939-16f9a38ea423
bd207296-7bda-4092-bf40-addf14f90268	2026-08-25 14:40:50.984808+00	Packaging Boxes	Maboksi ya Kufungia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	2db83173-196c-46e9-9e2f-4f4f52bf7268
86ee24f8-cea4-4cfe-b5a1-bfbf186ad62d	2026-08-25 14:40:50.984808+00	Packaging Bags	Mifuko ya Kufungia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	e933cc2f-c3d0-45c7-9c8f-8eb3089c19e3
40369362-2a29-4ea4-bc17-427ed48dae3c	2026-08-25 14:40:50.984808+00	Labels	Lebulu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
f6079038-2123-476d-a718-ee004d812a7e	2026-08-25 14:40:50.984808+00	Printing Services	Huduma za Uchapishaji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Quantity"]	f584a8e5-91fb-4234-ac50-4fcc75022ec0
f33fd969-af3e-4b32-83d2-593dc16224e6	2026-08-25 14:40:51.408833+00	CCTV Cameras	Kamera za CCTV	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Resolution", "Night Vision"]	5d2ee588-12f9-4422-a79c-e8356e733c52
d7cbdbb9-04de-4be9-a508-1a46927bfdec	2026-08-25 14:40:51.408833+00	Alarm Systems	Mifumo ya Kengele	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Features"]	84a68cfd-41df-4603-bbd6-6ee667f74faf
4b3963dc-e74b-4786-939c-8dc5cf73c2e5	2026-08-25 14:40:51.408833+00	Smart Locks	Kufuli Mahiri	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Features"]	93f3dba8-84e5-4d01-87a6-381df50f17e4
6c2980e8-6da7-4c3d-ae37-0366318f7a6f	2026-08-25 14:40:51.408833+00	Access Control	Mifumo ya Kudhibiti Ufikiaji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Features"]	50e461cd-b484-42d0-8537-62e303f62be2
621d33b0-5c1b-4b7e-bd7b-81ee3c8c5412	2026-08-25 14:40:51.408833+00	Safety Supplies	Vifaa vya Usalama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	2d493f98-4474-487a-b09a-82d73b4497b7
76fc180e-acc1-4bd2-a0cf-675d607d7b5a	2026-08-25 14:40:51.843913+00	Pet Food	Chakula cha Wanyama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Weight"]	fc6afdc7-f3b1-470a-b31a-3a1f63bf3d96
e3b78ce6-d4a3-4f27-a1e4-dbb63f2b56c7	2026-08-25 14:40:51.843913+00	Pet Toys	Vifaa vya Kuchezea vya Wanyama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	545dcf35-6c68-450d-b809-b1e46e2383bb
c70622f9-da10-4566-8a72-978e38bba6c0	2026-08-25 14:40:51.843913+00	Pet Collars	Kola za Wanyama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	3dcc4947-370a-4d5c-b62c-5402ac79767a
ddc35c8f-8a32-4bc5-b6e1-e4fc77d9e3ab	2026-08-25 14:40:51.843913+00	Pet Beds	Vitanda vya Wanyama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
74ddd31e-3486-4909-8d78-7ec48e697f49	2026-08-25 14:40:51.843913+00	Pet Grooming	Utunzaji wa Wanyama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	a365983d-5667-422d-98bd-1a89bf3c3f2d
086508ad-4191-4cff-8a84-acc408603115	2026-08-25 14:40:52.331323+00	Solar Panels	Paneli za Jua	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Wattage", "Type"]	7df81129-3800-46c8-af5e-66591400ff33
771ad949-0d01-4093-bc64-4c8dd10ee263	2026-08-25 14:40:52.331323+00	Solar Inverters	Vigeuza Umeme vya Jua	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Power", "Type"]	ec7f22e0-f1c6-4a41-b53e-03a9ab0eeb88
67ff9e45-d1c5-4d67-8252-7aca861cb618	2026-08-25 14:40:52.331323+00	Solar Water Heaters	Hita za Maji za Jua	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Type"]	5726a248-ae89-4483-88dd-cb73a4a68ba2
292af572-4c79-48bf-94df-46606777970a	2026-08-25 14:40:52.331323+00	Wind Turbines	Turbini za Upepo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Power", "Type"]	1ed36f16-14a2-4807-9aac-1a07f16a5b40
5b40da99-305f-4722-b49e-eeee538fd930	2026-08-25 14:40:52.331323+00	Solar Controllers	Vidhibiti vya Jua	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Voltage"]	cc21b9e1-fa80-4d84-b8ac-106a93141982
1b69c26c-8578-42f4-b5eb-28c2017bdf24	2026-08-25 14:40:52.893791+00	Construction Machinery	Mashine za Ujenzi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Power"]	22f45154-af3e-490f-983f-73a2a71920f2
5822ba8e-fff0-4e3a-b870-1eb6a1ef23ad	2026-08-25 14:40:52.893791+00	Metal Fabrication	Utengenezaji wa Vyuma	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	4a2fbcdb-1704-4d62-8bda-dea87354c397
18bc3cdd-7773-42d9-8d41-2ca29c412ef1	2026-08-25 14:40:52.893791+00	Plastic Fabrication	Utengenezaji wa Plastiki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	563747dc-1890-4b53-b859-d34abf12ba33
3f0f19a1-a99c-42ce-a9d7-79a8de407052	2026-08-25 14:40:52.893791+00	Welding Services	Huduma za Uchomeleaji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	3e2e59be-9d53-4983-9141-5701b266f319
c1d85910-1160-49fa-bc4a-3defc54d1238	2026-08-25 14:40:52.893791+00	Machining Services	Huduma za Uchimbaji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	ff314233-1047-4fd7-9fbd-496a2b6242fa
247b4aa0-1c3c-4bcf-a318-474d43317e78	2026-08-25 14:40:53.329215+00	Fishing Gear	Vifaa vya Uvuvi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	66f1402f-7f1e-413d-b446-7c4c10c6e47a
073d4e7e-6fb6-4915-8cc8-8b5a69f17751	2026-08-25 14:40:53.329215+00	Camping Gear	Vifaa vya Kambi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	ecce5aa8-5df3-454d-ae60-cff444022af1
783d8152-9603-4b27-95cc-056607c9191e	2026-08-25 14:40:53.329215+00	Musical Instruments	Ala za Muziki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Brand"]	fa535e51-dad1-45c0-b9d8-6cae9baad8b2
81d6c594-b896-46cd-b554-d7402d652cf8	2026-08-25 14:40:53.329215+00	Team Sports	Michezo ya Timu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	d5f8ba14-e5d2-4906-a45e-fe66702666c6
39c33d10-58cb-49e4-a046-6a9a710b69fe	2026-08-25 14:40:53.329215+00	Fitness Equipment	Vifaa vya Mazoezi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	f67a6673-7780-4faf-bfe1-c464cfe2ab5e
fd9988db-41cd-4752-a7d2-0ef83f94e9d1	2026-08-25 14:40:53.749433+00	Baby Care	Utunzaji wa Mtoto	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	680e790f-a781-49a6-99fc-113a1c1b5a13
93280edb-11c6-4c6d-9c12-c84373633f11	2026-08-25 14:40:53.749433+00	Hair Care	Utunzaji wa Nywele	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Volume"]	30db2cee-1181-4018-98f7-3526fbeadd6a
ebf53970-74f9-4640-8a4a-13192d4e979c	2026-08-25 14:40:53.749433+00	Oral Hygiene	Usafi wa Mdomo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Flavor"]	41195db4-dd21-4394-bb83-e3560085aea2
9218a928-03da-4051-8722-e827056bb2d2	2026-08-25 14:40:53.749433+00	Sanitary Paper	Karatasi za Usafi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Quantity"]	aa4dff8b-2f19-49ed-b965-3fd5bee353ef
b5c6cbbf-fd0b-40e1-85c9-91bc43d9aa72	2026-08-25 14:40:54.168768+00	Stickers	Stika	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	01a355e3-cb69-4001-abfa-1b2e874aec30
90dd467b-4b1a-432e-974d-66b735448b99	2026-08-25 14:40:54.168768+00	Crafts	Sanaa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	31fa9ec4-6f5b-4977-9e96-88f8a4ff51d3
8dc9d9ad-8278-4303-baaf-037b0c4571c4	2026-08-25 14:40:54.168768+00	Gifts	Zawadi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	c160b571-9f06-4178-ac4e-b1f3140fcf63
a12826ce-3a7b-48fe-bc38-c92d9c4dff2b	2026-08-25 14:40:54.168768+00	Key Chains	Minyororo ya Funguo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Size"]	a7937845-328f-40f2-a489-6c33aba9e981
2f46418a-5fd5-4ca2-b3a6-db535bb682c3	2026-08-25 14:41:15.88569+00	Face Creams	Krimu za Uso	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Skin Type", "Volume (ml)"]	44e22ab6-c361-449d-a346-836b2ebb391e
4388f353-da73-462b-951d-e09a57fa54f2	2026-08-25 14:41:15.88569+00	Lotions	Losheni	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Skin Type", "Volume (ml)"]	44e22ab6-c361-449d-a346-836b2ebb391e
a176fb83-17ee-40a2-a5cf-5aba8a071a46	2026-08-25 14:41:15.88569+00	Face Serums	Seramu za Uso	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Active Concentration (%)", "Target Concern"]	44e22ab6-c361-449d-a346-836b2ebb391e
a01d9e2e-c7e7-4a76-9d68-658203485131	2026-08-25 14:41:15.88569+00	Acne Treatments	Matibabu ya Chunusi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Target Concern", "Texture"]	44e22ab6-c361-449d-a346-836b2ebb391e
634b151b-9e69-483c-add1-cbcde09d5e87	2026-08-25 14:41:15.88569+00	Sheet Masks	Masks za Karatasi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Target Concern", "Fragrance-free"]	44e22ab6-c361-449d-a346-836b2ebb391e
1b38b84f-37cc-4b65-a002-78d8ec9388b5	2026-08-25 14:41:15.88569+00	Facial Rollers	Rola za Uso	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Power Source"]	42b57ced-c1af-4ad9-8248-90044163d44f
bc7b41ef-d84b-4fd3-a9fc-95a82a570cf3	2026-08-25 14:41:15.88569+00	Cleansing Brushes	Bureta za Kusafisha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tool Type", "Waterproof"]	42b57ced-c1af-4ad9-8248-90044163d44f
78442cce-77dc-42cb-baa0-139e19966a3b	2026-08-25 14:41:15.88569+00	Blackhead Removers	Viondoa Vichweusi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tool Type", "Material"]	42b57ced-c1af-4ad9-8248-90044163d44f
91f17688-4717-473b-9fa6-638e1f4d3271	2026-08-25 14:41:15.88569+00	Makeup Brushes	Bureta za Vipodozi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Set Count", "Brush Type"]	42b57ced-c1af-4ad9-8248-90044163d44f
4fc70c2b-4598-4b65-b85e-b9a29eb92400	2026-08-25 14:41:15.88569+00	Eye Makeup	Vipodozi vya Macho	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Product Type", "Color"]	ecb7d34b-181c-4108-87c1-f802479cea0c
bf1120b2-8513-4bb8-b0af-9081cb2e2e03	2026-08-25 14:41:15.88569+00	Shampoos	Shampoo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hair Type", "Volume"]	447fca2b-0e85-4f7d-b9be-160868830f05
2bfa67ac-6c27-4c7b-80e9-ac36f06b5862	2026-08-25 14:41:15.88569+00	Deep Conditioners	Vinyororo vya Kina	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Key Ingredients", "Volume"]	447fca2b-0e85-4f7d-b9be-160868830f05
45309b00-ce9a-423b-acff-da9809678abc	2026-08-25 14:41:15.88569+00	Leave-ins	Bidhaa za Kuacha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hair Type", "Volume"]	447fca2b-0e85-4f7d-b9be-160868830f05
3d142805-f3a3-4677-954e-9dfc6617d940	2026-08-25 14:41:15.88569+00	Hair Growth Oils	Mafuta ya Kukuza Nywele	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Ingredients", "Texture"]	447fca2b-0e85-4f7d-b9be-160868830f05
8e902355-4cc0-4935-8dc4-24ea72d5ef84	2026-08-25 14:41:15.88569+00	Scalp Serums	Seramu za Ngozi ya Kichwa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Ingredients", "Target"]	447fca2b-0e85-4f7d-b9be-160868830f05
44711436-33ac-4ae7-8991-68601f24fa8c	2026-08-25 14:41:15.88569+00	Edge Control Gels	Jeli za Kudhibiti Kingo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hold Strength", "Finish"]	447fca2b-0e85-4f7d-b9be-160868830f05
3a52f609-928e-4458-86db-144674bc1dc2	2026-08-25 14:41:15.88569+00	Hair Dryers	Vikausha Nywele	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Wattage", "Heat Levels"]	447fca2b-0e85-4f7d-b9be-160868830f05
878e6b4f-10b0-4ffb-9084-2d45cd45198a	2026-08-25 14:41:15.88569+00	Flat Irons	Pasiani Bapa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Plate Material", "Max Temp"]	447fca2b-0e85-4f7d-b9be-160868830f05
365e9fab-5312-4391-9f8e-14c92276bb50	2026-08-25 14:41:15.88569+00	Curling Wands	Vijiti vya Kukunja Nywele	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Plate Material", "Max Temp"]	447fca2b-0e85-4f7d-b9be-160868830f05
7772b326-813b-432e-a7f1-0c1d375980ac	2026-08-25 14:41:15.88569+00	Human Hair Bundles	Vifurushi vya Nywele za Binadamu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hair Grade", "Length"]	27f26f61-d3a5-4b44-8885-fdab95aa5c2b
b6957b95-a556-4ec7-9f43-77f35b7f2352	2026-08-25 14:41:15.88569+00	Crochet Braids	Braidi za Kukrocheti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Color Code", "Length"]	27f26f61-d3a5-4b44-8885-fdab95aa5c2b
2af5ac9d-f795-40e8-a960-b2364393749b	2026-08-25 14:41:15.88569+00	Kanekalon	Kanekaloni	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Color Code", "Length"]	27f26f61-d3a5-4b44-8885-fdab95aa5c2b
372a59d6-7adf-41be-a836-e3c5ae30a11c	2026-08-25 14:41:15.88569+00	Whitening Toothpastes	Dawa za Meno za Kugeuza Rangi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fluoride Status", "Volume"]	41195db4-dd21-4394-bb83-e3560085aea2
5afb88a9-0abe-4662-8526-344ac5621785	2026-08-25 14:41:15.88569+00	Sensitive Toothpastes	Dawa za Meno za Ngozi Nyeti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fluoride Status", "Volume"]	41195db4-dd21-4394-bb83-e3560085aea2
81b39176-077c-4d90-8069-41e9a1ad28ab	2026-08-25 14:41:15.88569+00	Herbal Toothpastes	Dawa za Meno za Mitishamba	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fluoride Status", "Volume"]	41195db4-dd21-4394-bb83-e3560085aea2
df23dc6f-afc9-4fdd-9c07-168eb14c4893	2026-08-25 14:41:15.88569+00	Alcohol-free Mouthwash	Mdomo wa Kuanika usio na Pombe	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Alcohol Status", "Flavor"]	41195db4-dd21-4394-bb83-e3560085aea2
e6cce221-840e-4d17-a36c-aa1b39d63725	2026-08-25 14:41:15.88569+00	Dental Floss	Uzi wa Meno	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Floss Type", "Flavor"]	41195db4-dd21-4394-bb83-e3560085aea2
1be18c7d-5198-49fe-a5f5-546061c9181b	2026-08-25 14:41:15.88569+00	Dental Picks	Vichomoa Meno	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Pack Size"]	41195db4-dd21-4394-bb83-e3560085aea2
cd6b51e8-f5be-4b40-a55b-910eb01641d7	2026-08-25 14:41:15.88569+00	Tongue Scrapers	Vichomoa Ulimi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Primary Material", "Quantity"]	4ac100e3-3295-4afd-a608-ae3acb957bcb
841663dc-50c7-4f85-8657-1b241f59a173	2026-08-25 14:41:15.88569+00	Denture Adhesives	Viyonjo vya Bandia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Application Type", "Action Time"]	4ac100e3-3295-4afd-a608-ae3acb957bcb
9174e4ce-afa3-4d1e-83e4-9e9e39a8ad5a	2026-08-25 14:41:15.88569+00	Denture Cleansers	Visafishaji vya Bandia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Application Type", "Quantity"]	4ac100e3-3295-4afd-a608-ae3acb957bcb
bf66a1ca-c6cb-4e1b-a952-62a91e5e64a1	2026-08-25 14:41:15.88569+00	Interdental Brushes	Bureta za Kati ya Meno	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Brush Size (mm)", "Disposable"]	4ac100e3-3295-4afd-a608-ae3acb957bcb
25a80c27-07c8-4a9b-9616-fefccdeea863	2026-08-25 14:41:15.88569+00	Water Flossers	Viosha Meno vya Maji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Reservoir Capacity", "Pressure Settings"]	4ac100e3-3295-4afd-a608-ae3acb957bcb
883d4f21-b76e-4680-b55b-ad271fca672a	2026-08-25 14:41:16.352144+00	T-Shirts	T-Shati	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Collar Type", "Fabric Type"]	f8a70e64-b80e-4482-96a7-a11d116134bf
cf61ca45-e1f6-4055-b492-fa2faf634d44	2026-08-25 14:41:16.352144+00	Tops	Mavazi ya Juu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fit Type", "Sleeve Length"]	f8a70e64-b80e-4482-96a7-a11d116134bf
3589c02c-9d85-43af-a6c1-74439cb87115	2026-08-25 14:41:16.352144+00	Activewear Sets	Mavazi ya Mazoezi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Breathability", "Compression"]	f8a70e64-b80e-4482-96a7-a11d116134bf
86303ec1-a06e-43eb-a9e4-0748a018b848	2026-08-25 14:41:16.352144+00	Yoga Sets	Seti za Yoga	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Stretch Type", "Moisture Wicking"]	f8a70e64-b80e-4482-96a7-a11d116134bf
8489cd79-5b39-4f73-9b13-121182f4ad80	2026-08-25 14:41:16.352144+00	Formal Shirts	Mashati Rasmi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Collar Size", "Fit"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
b17b8805-bb01-44c1-af5e-bc8128d7c3f4	2026-08-25 14:41:16.352144+00	Cargo Pants	Suruali za Cargo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Waist Size", "Number of Pockets"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
f52e5e31-5eee-4648-8f34-cc68e5d0b91a	2026-08-25 14:41:16.352144+00	Tracksuits	Trakisuti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Closure Type"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
2ae8d2e4-87d6-4752-b18d-74efeb6e8614	2026-08-25 14:41:16.352144+00	Gym Wear	Mavazi ya Mazoezi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Performance Feature", "Waistband"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
97bdaa60-9759-4686-a157-8d406ecc83f3	2026-08-25 14:41:16.352144+00	Joggers	Jogga	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Weight", "Closure Type"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
eba65366-b2e1-4aec-afa8-5f359f2d1ed2	2026-08-25 14:41:16.352144+00	Casual Shorts	Kaptula za Kawaida	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Weight", "Closure Type"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
f74da2aa-7e5c-43fb-82f6-ff4891dbf7a6	2026-08-25 14:41:16.352144+00	Full Suits	Suti Kamili	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Suit Set", "Lining Material"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
48af511c-52a5-41c7-af58-a5a7ccf82b6a	2026-08-25 14:41:16.352144+00	Blazers	Blaza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Jacket Size", "Vent Style"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
f41101ca-a159-44e3-9636-6942d8181f4e	2026-08-25 14:41:16.352144+00	Jackets	Jaketi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Jacket Size", "Hood Feature"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
c143a72d-7684-4fc5-bf6a-aadfc7c932c4	2026-08-25 14:41:16.352144+00	Hoodies	Hoodi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hood Feature", "Material"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
92216480-3912-4cad-9b0d-e1e3b6b5820f	2026-08-25 14:41:16.352144+00	Boxers	Boxers	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	38d2ba26-0a87-4a79-8aa3-cbd17c4bf3a9
e84896f5-1251-40ca-93ec-fd110301db6e	2026-08-25 14:41:16.352144+00	Briefs	Briefs	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	38d2ba26-0a87-4a79-8aa3-cbd17c4bf3a9
909e3537-5150-4fee-a9e3-8d21264abb2a	2026-08-25 14:41:16.352144+00	Trunks	Trunks	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	38d2ba26-0a87-4a79-8aa3-cbd17c4bf3a9
e72468e6-4e84-421e-95a5-948c1ee75df5	2026-08-25 14:41:16.352144+00	Panties	Panties	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Style", "Size"]	38d2ba26-0a87-4a79-8aa3-cbd17c4bf3a9
2d1cb3d1-3dea-4cec-bc5b-0036e6ca9f25	2026-08-25 14:41:16.352144+00	Bras	Sidiria	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cup Size", "Support Type"]	38d2ba26-0a87-4a79-8aa3-cbd17c4bf3a9
30a2ecc4-2d0f-4fe7-a60f-80817b8df7ba	2026-08-25 14:41:16.352144+00	Corsets	Korseti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Style"]	38d2ba26-0a87-4a79-8aa3-cbd17c4bf3a9
917c786f-5d1d-453b-8829-edd67330d964	2026-08-25 14:41:16.352144+00	Shapewear	Nguo za Kuchonganisha Mwili	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Style"]	38d2ba26-0a87-4a79-8aa3-cbd17c4bf3a9
d9ef6874-3b65-4daf-8753-1f3b7c64b0d2	2026-08-25 14:41:16.352144+00	Gym Drawstring Bags	Mifuko ya Mazoezi ya Kufunga	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Design", "Closure"]	5b29eb6c-842d-4162-b546-3a189a3afd16
a5fd0c9c-fdff-4c01-baa1-74523ec72095	2026-08-25 14:41:16.352144+00	Kids Character Backpacks	Mikoba ya Watoto ya Wahusika	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Age Group", "Design"]	5b29eb6c-842d-4162-b546-3a189a3afd16
fccd9041-bd98-4448-9e78-60dea1038f46	2026-08-25 14:41:16.352144+00	Student School Bags	Mikoba ya Shule ya Wanafunzi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Volume", "Material"]	5b29eb6c-842d-4162-b546-3a189a3afd16
49f61835-f206-459a-87d7-db02983d7e46	2026-08-25 14:41:16.352144+00	Casual Daypacks	Mikoba ya Kawaida ya Kutwa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Volume", "Material"]	5b29eb6c-842d-4162-b546-3a189a3afd16
1b1a167c-af2b-423c-818f-92b1cf59daa7	2026-08-25 14:41:16.352144+00	Replacement Straps	Mikanda ya Kubadilishia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Length"]	0ffa648f-d279-441d-aca8-00771a729752
f9505043-da7c-4f49-85f3-27d2dd47f001	2026-08-25 14:41:16.352144+00	Metal Chains	Minyororo ya Chuma	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Length"]	0ffa648f-d279-441d-aca8-00771a729752
830e1fbd-75b8-4e2e-a5cc-242245efb631	2026-08-25 14:41:16.352144+00	Leather Handles	Vishikio vya Ngozi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Length"]	0ffa648f-d279-441d-aca8-00771a729752
ed13b58d-3ef4-437a-8307-466fe3a86f2d	2026-08-25 14:41:16.352144+00	Credit Card Cases	Vibebeo vya Kadi za Mkopo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Material"]	0b8082af-85dd-456e-bec1-a100c082d2e3
981702a5-70dd-4dec-a969-fdf904f1fcdc	2026-08-25 14:41:16.352144+00	ID Holders	Vibebeo vya Kitambulisho	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Attachment"]	0b8082af-85dd-456e-bec1-a100c082d2e3
1b0c232c-b791-48e2-bff3-85526c65c54a	2026-08-25 14:41:16.352144+00	Travel Organizers	Vipangaji vya Safari	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	0b8082af-85dd-456e-bec1-a100c082d2e3
df87ee00-1dd9-4e27-ad6c-b3b24664a7e3	2026-08-25 14:41:16.352144+00	Key Cases	Vibebeo vya Funguo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Number of Hooks", "Size"]	0b8082af-85dd-456e-bec1-a100c082d2e3
63a29ace-48c3-40eb-8ea3-7533fa307c1d	2026-08-25 14:41:16.352144+00	Small Coin Pouches	Vibebeo vidogo vya Sarafu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	0b8082af-85dd-456e-bec1-a100c082d2e3
65ea82ef-95fc-408d-b4b3-3983a7116e81	2026-08-25 14:41:16.352144+00	Pouches	Vibebeo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	0b8082af-85dd-456e-bec1-a100c082d2e3
b4138ba0-3030-409c-ac2c-792dc94118b7	2026-08-25 14:41:16.352144+00	Long Wallets	Pochi Ndefu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Style"]	0b8082af-85dd-456e-bec1-a100c082d2e3
dc2bd68e-28a8-477b-96d9-317a3a35c345	2026-08-25 14:41:16.352144+00	Wristlets	Pochi za Kifundo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Style", "Strap Type"]	0b8082af-85dd-456e-bec1-a100c082d2e3
eb988235-cb16-447b-992b-fb3bd4b0dfee	2026-08-25 14:41:16.352144+00	Accordion Fold Wallets	Pochi za Kukunja kwa Mikatizo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Style", "Compartments"]	0b8082af-85dd-456e-bec1-a100c082d2e3
214b2f97-262c-4213-bfbe-483219c73bd0	2026-08-25 14:41:16.352144+00	Clutch Bags	Mikoba ya Klishika	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Closure Type", "Detachable Chain"]	25719b69-d419-4920-a2d8-c1d458ba6dda
e58697c4-184c-46a6-9d28-982dd66dbb43	2026-08-25 14:41:16.352144+00	Wristlets (Bags)	Pochi za Kifundo (Mikoba)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Closure Type", "Detachable Chain"]	25719b69-d419-4920-a2d8-c1d458ba6dda
7e7a611d-ec1f-4f24-8cdf-d99a92ac8d22	2026-08-25 14:41:16.352144+00	Minaudi├¿res	Minaudi├¿res	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hard-shell", "Decorative Detail"]	25719b69-d419-4920-a2d8-c1d458ba6dda
90b4d412-b04b-4b73-8350-0efafa943ca5	2026-08-25 14:41:16.352144+00	Fashion Earrings	Petevi za Mitindo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Earring Type", "Back Finding"]	05d8790e-8857-4b20-803d-b45f350d5670
b5ca208c-dab1-4643-8ae1-0139701e32fc	2026-08-25 14:41:16.818842+00	Headlights	Taa za Mbele	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bulb Type", "Voltage"]	00597f28-08b3-46da-a858-347cb5def3ec
1fc0d62a-0803-47a4-8007-68de546e8e46	2026-08-25 14:41:16.818842+00	Taillights	Taa za Nyuma	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bulb Type", "Voltage"]	00597f28-08b3-46da-a858-347cb5def3ec
dc46ad8d-4f95-44cf-b355-54adef802262	2026-08-25 14:41:16.818842+00	Side Mirrors	Vioo vya Kando	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Mirror Functions", "Material"]	00597f28-08b3-46da-a858-347cb5def3ec
bfff90f4-696d-468a-90e6-e03804518576	2026-08-25 14:41:16.818842+00	Wiper Blades	Vilemba vya Vifuta	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Wiper Size (Inches)", "Material"]	00597f28-08b3-46da-a858-347cb5def3ec
de9e4f4b-d837-481d-9ab8-9568eb06f2b1	2026-08-25 14:41:16.818842+00	Tire Repair Kits	Kiti za Kukarabati Tairi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tire Plug Method", "Case/Storage"]	5c3f59e8-0b37-4856-a63e-91fe3a8ff147
8151fa80-7c12-434b-879f-24de28d83c8a	2026-08-25 14:41:16.818842+00	Jump Starters	Vianzishaji vya Kurukaruka	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Peak Current", "Battery Capacity"]	5c3f59e8-0b37-4856-a63e-91fe3a8ff147
4f69aaba-0a31-47e4-a39c-875f1fa33fb9	2026-08-25 14:41:16.818842+00	Oil Drainers	Vimiminika Mafuta	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tank Capacity", "Material"]	5c3f59e8-0b37-4856-a63e-91fe3a8ff147
34a174b5-b8ca-46ca-b94d-afb250bbceb1	2026-08-25 14:41:16.818842+00	Air Compressors	Kampresa za Hewa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Max Pressure", "Power Source"]	554769e5-2049-4f32-b9b9-b212525a38d8
6c932b1c-bef1-4090-86d3-f7a39a9c7f18	2026-08-25 14:41:16.818842+00	Pressure Gauges	Vipimo vya Shinikizo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Accuracy Class", "Material"]	554769e5-2049-4f32-b9b9-b212525a38d8
56b285ea-bab9-476e-baaa-c36e6013dd44	2026-08-25 14:41:16.818842+00	Puncture Kits	Kiti za Kutobolea	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Carry Case", "Number of Tools"]	554769e5-2049-4f32-b9b9-b212525a38d8
64a8ea31-a0f7-4002-9449-5aea32ef095c	2026-08-25 14:41:16.818842+00	Deep Cycle Gel Batteries	Betri za Jua za Deep Cycle Gel	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity (Ah)", "Voltage"]	168777bd-674d-4ba2-990c-52b3305ea344
e3941fc4-3cad-4451-8ca7-8f4832cac5db	2026-08-25 14:41:16.818842+00	AGM Solar Batteries	Betri za Jua za AGM	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity (Ah)", "Voltage"]	168777bd-674d-4ba2-990c-52b3305ea344
f715a976-e5fa-4ce9-81f6-0f03e63b6f47	2026-08-25 14:41:16.818842+00	Battery Equalizers	Vilinganisha Betri	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Compatible Voltage", "Current"]	168777bd-674d-4ba2-990c-52b3305ea344
e540b6dc-e0f5-4968-bb88-89a48121824f	2026-08-25 14:41:16.818842+00	Battery Cables	Kebo za Betri	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cable Gauge", "Length"]	168777bd-674d-4ba2-990c-52b3305ea344
13bbfcb2-39cd-49a3-a8e0-789f52202a1a	2026-08-25 14:41:16.818842+00	Hydrometers	Hidromita	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Material"]	168777bd-674d-4ba2-990c-52b3305ea344
3e6349ba-1905-4f75-b50d-7a1e608ae895	2026-08-25 14:41:16.818842+00	Battery Racks	Raki za Betri	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Load Capacity"]	168777bd-674d-4ba2-990c-52b3305ea344
daa81ef7-91bb-42a3-99e7-3274c6e1be7a	2026-08-25 14:41:16.818842+00	HVLP Spray Guns	Bunduki za Kunyunyizia HVLP	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Nozzle Size", "Cup Capacity"]	13ea3946-4159-40a9-83a4-bf51725d6478
4944ce3d-8dce-4e10-a3c0-173a9d619e97	2026-08-25 14:41:16.818842+00	Sandblasters	Vipuluzi vya Mchanga	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Nozzle Size", "Air Inlet"]	13ea3946-4159-40a9-83a4-bf51725d6478
05f7ad79-224a-4030-8300-0fd197aa7a83	2026-08-25 14:41:16.818842+00	Air Blow Guns	Bunduki za Hewa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Nozzle Size", "Air Inlet"]	13ea3946-4159-40a9-83a4-bf51725d6478
ebece654-003d-4545-a8e5-15f150833cf5	2026-08-25 14:41:16.818842+00	Pneumatic Die Grinders	Visugio vya Die vya Nyumatiki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Collet Size", "Vibration"]	13ea3946-4159-40a9-83a4-bf51725d6478
d421c61f-965c-402e-a9fe-60cf83a89c56	2026-08-25 14:41:16.818842+00	Orbital Sanders	Visugio vya Orbital	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Wheel Diameter", "Exhaust"]	13ea3946-4159-40a9-83a4-bf51725d6478
4a7fecc5-797c-4ae4-bfbc-52adbfb24b65	2026-08-25 14:41:16.818842+00	Pneumatic Hammers	Nyundo za Nyumatiki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Stroke Length", "Safety Lock"]	13ea3946-4159-40a9-83a4-bf51725d6478
e4c60bc2-9ddb-4c39-95ef-7b9bebcca63b	2026-08-25 14:41:16.818842+00	Step Ladders	Ngazi za Kukanyaga	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Maximum Height", "Load Capacity"]	560775e5-ad04-404d-9939-16f9a38ea423
5757be60-d033-42ff-b2db-dcfe9f606327	2026-08-25 14:41:16.818842+00	Extension Ladders	Ngazi za Kurefusha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Maximum Height", "Material"]	560775e5-ad04-404d-9939-16f9a38ea423
a4638904-446c-4c8d-abf9-3b132050eba1	2026-08-25 14:41:16.818842+00	Multi-purpose Ladders	Ngazi za Matumizi Mbalimbali	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Foldable", "Material"]	560775e5-ad04-404d-9939-16f9a38ea423
2c9a843a-574f-4bf1-a3a8-ed14533d84b0	2026-08-25 14:41:16.818842+00	Excavators	Wachimba	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Operating Weight", "Engine Power"]	22f45154-af3e-490f-983f-73a2a71920f2
4683d9df-9d9c-4a43-b275-308e3da98913	2026-08-25 14:41:16.818842+00	Wheel Loaders	Vipakiaji vya Magurudumu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Operating Weight", "Bucket Capacity"]	22f45154-af3e-490f-983f-73a2a71920f2
d98b1281-08c0-49bc-9842-72dfe62d6e27	2026-08-25 14:41:16.818842+00	Bulldozers	Tingatinga	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Operating Weight", "Engine Power"]	22f45154-af3e-490f-983f-73a2a71920f2
157f07ae-fd83-4f7e-8697-dbd1db2f82a6	2026-08-25 14:41:16.818842+00	Backhoes	Nyembe	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Max Digging Depth", "Track vs Wheel"]	22f45154-af3e-490f-983f-73a2a71920f2
9102861a-bc1c-4fad-9bf7-f1e0f8846f28	2026-08-25 14:41:16.818842+00	Tower Cranes	Koroboi za Mnara	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Max Lifting Capacity", "Max Reach"]	22f45154-af3e-490f-983f-73a2a71920f2
66e6ea9d-6d99-4bcf-9d4e-231a88478559	2026-08-25 14:41:16.818842+00	Forklifts	Forklifti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Max Lifting Capacity", "Turning Radius"]	22f45154-af3e-490f-983f-73a2a71920f2
71ffb4c3-54be-4701-9008-4460114095e3	2026-08-25 14:41:16.818842+00	Scissor Lifts	Vinuu vya Makaso	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Max Height", "Capacity"]	22f45154-af3e-490f-983f-73a2a71920f2
845f57e9-6fbe-4c3c-b99a-4b9681ab3518	2026-08-25 14:41:16.818842+00	Telehandlers	Telehandler	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Max Lifting Capacity", "Boom Type"]	22f45154-af3e-490f-983f-73a2a71920f2
9756cf55-c2ad-4582-8fe6-bf274003b3f6	2026-08-25 14:41:17.262266+00	Spice Racks	Raki za Viungo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Capacity"]	1d0b6b20-dc49-435b-8af6-9e8f3e64f1be
33a6c04b-c44a-4cf5-8aa5-4eda928071a6	2026-08-25 14:41:17.262266+00	Food Containers	Vyombo vya Chakula	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Airtight Seal"]	1d0b6b20-dc49-435b-8af6-9e8f3e64f1be
dea1730f-fcc9-4855-891a-5a9515f98186	2026-08-25 14:41:17.262266+00	Dish Racks	Raki za Sahani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Dishwasher Safe"]	1d0b6b20-dc49-435b-8af6-9e8f3e64f1be
b670e123-c4ef-4e14-8457-3d54daf4116a	2026-08-25 14:41:17.262266+00	Pantry Bins	Mapipa ya Chumbani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Stackable"]	1d0b6b20-dc49-435b-8af6-9e8f3e64f1be
7eae87c6-038b-446b-8acd-693e3feb9b3e	2026-08-25 14:41:17.262266+00	Laundry Hampers	Vikapu vya Kufulia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Mounting Type", "Material"]	1d0b6b20-dc49-435b-8af6-9e8f3e64f1be
8794bbb9-a71f-44ee-a65e-1d3c2b024311	2026-08-25 14:41:17.262266+00	Shower Caddies	Vituo vya Kuogelea	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Mounting Type", "Material"]	1d0b6b20-dc49-435b-8af6-9e8f3e64f1be
df0b9dd6-942d-479b-8b12-dc628b8578b0	2026-08-25 14:41:17.262266+00	Toilet Paper Holders	Vishikio vya Karatasi ya Choo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Compartment Count"]	1d0b6b20-dc49-435b-8af6-9e8f3e64f1be
aa0c6172-1d0f-4217-9717-cbe9e5ca4576	2026-08-25 14:41:17.262266+00	Sewing Kits	Kiti za Kushonea	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Quantity per Pack", "Primary Material"]	4d1e7aac-4c8a-40f0-a185-b2eab06cca0d
1a8ba618-0395-4f54-a466-2012da1b4d3d	2026-08-25 14:41:17.262266+00	Door Stoppers	Vizuwia Milango	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Primary Material", "Application"]	4d1e7aac-4c8a-40f0-a185-b2eab06cca0d
e2641828-cd1e-4b60-b346-2ac1c541c9a4	2026-08-25 14:41:17.262266+00	Clothes Pegs	Pin za Nguo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Quantity per Pack"]	4d1e7aac-4c8a-40f0-a185-b2eab06cca0d
9633cda7-f0f8-496b-9a5e-445a69ef87a2	2026-08-25 14:41:17.262266+00	Plastic Baskets	Vikapu vya Plastiki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Dimensions", "Load Capacity"]	4d1e7aac-4c8a-40f0-a185-b2eab06cca0d
aeadd0d9-f249-475c-a516-ca22be8c1748	2026-08-25 14:41:17.262266+00	Multi-purpose Hooks	Kulabu za Matumizi Mbalimbali	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Mounting Type", "Material"]	4d1e7aac-4c8a-40f0-a185-b2eab06cca0d
5f079013-2dc0-4c79-87ab-f5dc83a7ebcd	2026-08-25 14:41:17.262266+00	Multi-purpose Racks	Raki za Matumizi Mbalimbali	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Dimensions", "Load Capacity"]	4d1e7aac-4c8a-40f0-a185-b2eab06cca0d
728a1ace-0a4d-4572-9f17-9dabcf9fefba	2026-08-25 14:41:17.262266+00	Vases	Vyungu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Height"]	580d74b9-8d74-45a8-b1ad-ca369ba2e0c8
0a1a6a94-15a6-4ea0-be1d-9c88d3cb12c2	2026-08-25 14:41:17.262266+00	Sculptures	Sanamu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Color"]	580d74b9-8d74-45a8-b1ad-ca369ba2e0c8
644ad397-9ad7-4e33-b864-ea81264fbd63	2026-08-25 14:41:17.262266+00	Photo Frames	Fremu za Picha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Size"]	580d74b9-8d74-45a8-b1ad-ca369ba2e0c8
1e292526-ce33-49b7-93e3-63486f4d4a24	2026-08-25 14:41:17.262266+00	Figurines	Vinyago	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Height"]	580d74b9-8d74-45a8-b1ad-ca369ba2e0c8
8d5f50a4-9349-490e-9092-77b759ec5a63	2026-08-25 14:41:17.262266+00	Network Access Control Panels	Paneli za Kudhibiti Ufikiaji wa Mtandao	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Doors Supported", "Reader Support"]	50e461cd-b484-42d0-8537-62e303f62be2
fa40daeb-1bc5-44db-ad60-2ba8fc6f7702	2026-08-25 14:41:17.262266+00	Multi-door Controllers	Vidhibiti vya Milango Mingi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Doors Supported", "Backup Battery"]	50e461cd-b484-42d0-8537-62e303f62be2
48bfe0ed-1f53-4668-9a78-814c8a6dae6a	2026-08-25 14:41:17.262266+00	Electromagnetic Locks	Kufuli za Kielektroniki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Holding Force", "Voltage"]	50e461cd-b484-42d0-8537-62e303f62be2
e03ed61c-5041-4406-873f-b34a1895dcd8	2026-08-25 14:41:17.262266+00	Electric Strikes	Vipigo vya Umeme	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Holding Force", "Fail Safe"]	50e461cd-b484-42d0-8537-62e303f62be2
7d9b650f-9313-48cc-b94d-5b16eda81f1f	2026-08-25 14:41:17.262266+00	Drop Bolts	Boliti za Kushuka	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Holding Force", "Voltage"]	50e461cd-b484-42d0-8537-62e303f62be2
0d473d80-2154-4958-acf9-a46bbbd739c5	2026-08-25 14:41:17.734655+00	Football	Mpira wa Miguu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Ball Size", "Material"]	492c7799-7cc8-482d-888f-cc1c18295c7b
4d4a25e7-55b9-4bc1-803d-5a20e26be338	2026-08-25 14:41:17.734655+00	Basketball	Mpira wa Kikapu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Ball Size", "Material"]	492c7799-7cc8-482d-888f-cc1c18295c7b
092e68de-9bf8-46e0-b8b3-056614c077dd	2026-08-25 14:41:17.734655+00	Training Agility Kits	Kiti za Ustadi wa Mazoezi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Drills", "Material"]	492c7799-7cc8-482d-888f-cc1c18295c7b
ae256803-d6f8-4ffd-9964-ec2db0de5b6e	2026-08-25 14:41:17.734655+00	Ferris Wheels	Magurudumu ya Ferris	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Passenger Capacity", "Height"]	459db7a1-7be5-46d4-9c6d-6bbb3c7df31a
d2285d5c-69ad-4ff0-9106-e2edd55cee75	2026-08-25 14:41:17.734655+00	Carousel	Karuseli	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Passenger Capacity", "Power"]	459db7a1-7be5-46d4-9c6d-6bbb3c7df31a
db34ec37-b045-42ed-9cad-6ca14cb8cdc8	2026-08-25 14:41:17.734655+00	Roller Coasters	Rola za Mwendo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Height", "Safety Type"]	459db7a1-7be5-46d4-9c6d-6bbb3c7df31a
e52482a3-e4c9-4c09-be9a-3210e0f1e811	2026-08-25 14:41:17.734655+00	Dive Computers	Kompyuta za Kupiga Mbizi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Max Depth", "Display Type"]	34ef6d10-a432-49fa-9ec9-3b6fcbbb4ba5
4517e2c2-6b36-48ee-a84d-b923d9acb450	2026-08-25 14:41:17.734655+00	Regulators (Dive)	Vidhibiti (Mbizi)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tank Connection", "Gas Compatibility"]	34ef6d10-a432-49fa-9ec9-3b6fcbbb4ba5
17b2432b-7e7d-407b-9568-ec302480cb6f	2026-08-25 14:41:17.734655+00	BCDs	BCD	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Max Depth", "Buoyancy"]	34ef6d10-a432-49fa-9ec9-3b6fcbbb4ba5
414d1bea-818e-422f-85bd-894632df5ee1	2026-08-25 14:41:17.734655+00	Kayaks	Kayaks	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Weight Capacity"]	34ef6d10-a432-49fa-9ec9-3b6fcbbb4ba5
09ad6f04-4c7b-4097-a9e5-ae354990dbb2	2026-08-25 14:41:17.734655+00	Paddleboards	Mbao za Kukwea	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Dimensions"]	34ef6d10-a432-49fa-9ec9-3b6fcbbb4ba5
110a6d2e-b632-4846-9586-9eaa6b4d602e	2026-08-25 14:41:17.734655+00	Surfboards	Bodi za Kushika Mawimbi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Dimensions", "Accessories"]	34ef6d10-a432-49fa-9ec9-3b6fcbbb4ba5
7aa8c525-76ed-4cb8-a111-f76a691627a5	2026-08-25 14:41:17.734655+00	Aquatic Plants	Mimea ya Majini	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Net Weight"]	541ae2d7-0a65-42f6-b8c3-0ec251c3d3c6
79868a8f-b634-488a-962e-c2b5210c4345	2026-08-25 14:41:17.734655+00	Aquarium Gravel	Changarawe	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Substrate Material", "Net Weight"]	541ae2d7-0a65-42f6-b8c3-0ec251c3d3c6
669ddabe-0f0a-40b2-8f99-4d9a4e5ee0b7	2026-08-25 14:41:17.734655+00	Aquarium Rocks	Mawe	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Substrate Material", "Decor Theme"]	541ae2d7-0a65-42f6-b8c3-0ec251c3d3c6
f4d23abb-7aa7-4def-b4a9-8b4d561fbcdb	2026-08-25 14:41:17.734655+00	Fish Food	Chakula cha Samaki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Food Type", "Net Weight"]	541ae2d7-0a65-42f6-b8c3-0ec251c3d3c6
928f92ec-a372-4858-bae6-12e47f9bdc08	2026-08-25 14:41:17.734655+00	Glass Fish Tanks	Matangi ya Samaki ya Kioo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Volume", "Material"]	541ae2d7-0a65-42f6-b8c3-0ec251c3d3c6
64b9e789-6469-4a47-a37e-ecf2ec1005d6	2026-08-25 14:41:17.734655+00	Acrylic Fish Tanks	Matangi ya Samaki ya Akriliki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Volume", "Material"]	541ae2d7-0a65-42f6-b8c3-0ec251c3d3c6
ec0c6fbf-db72-4792-8245-67a27d4c5f67	2026-08-25 14:41:17.734655+00	Orthopedic Beds	Vitanda vya Mifupa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Fill Material"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
bccbc63a-9cdf-4744-bc55-12b51ef332de	2026-08-25 14:41:17.734655+00	Calming Mats	Mikeka ya Kutuliza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
cafa6236-fb69-4f23-a268-8c2fa74ea1f2	2026-08-25 14:41:17.734655+00	Pet Blankets	Mablanketi ya Wanyama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
28774549-1c83-432b-a596-0344378e709f	2026-08-25 14:41:17.734655+00	Standard Collars	Kola za Kawaida	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Neck Size", "Material"]	3dcc4947-370a-4d5c-b62c-5402ac79767a
19101228-ec3d-4a09-9f62-4637a34c55ca	2026-08-25 14:41:17.734655+00	LED Collars	Kola za LED	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Neck Size", "Battery"]	3dcc4947-370a-4d5c-b62c-5402ac79767a
d56cfa99-c186-46af-84c4-b12a26fa93d5	2026-08-25 14:41:17.734655+00	GPS Smart Collars	Kola Mahiri za GPS	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Neck Size", "Tracking"]	3dcc4947-370a-4d5c-b62c-5402ac79767a
19a48355-3cf3-43c0-b136-eae184ceec0d	2026-08-25 14:41:18.205126+00	Brown Packing Tapes	Tepu za Kufungia za Kahawia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Width", "Length"]	066471f5-d171-4c35-8e50-808447e36618
0f6df6e5-9686-4649-bf5c-8e9481e9da23	2026-08-25 14:41:18.205126+00	Clear Packing Tapes	Tepu za Kufungia za Kioo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Width", "Length"]	066471f5-d171-4c35-8e50-808447e36618
7febf1d5-01ce-4bf7-804b-b42fb978eac8	2026-08-25 14:41:18.205126+00	Masking Tapes	Tepu za Kuficha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Width", "Length"]	066471f5-d171-4c35-8e50-808447e36618
d932bfca-c43d-46bc-97e7-ad956e2f34ac	2026-08-25 14:41:18.205126+00	Scotch Tapes	Tepu za Skochi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Width", "Length"]	066471f5-d171-4c35-8e50-808447e36618
015fd89c-dd24-4d19-992f-578771369d32	2026-08-25 14:41:18.205126+00	PVC Electrical Insulation	Insulation ya PVC ya Umeme	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Voltage Rating", "Material"]	066471f5-d171-4c35-8e50-808447e36618
6d6e38f2-f85c-4803-b5b4-65c83d937642	2026-08-25 14:41:18.205126+00	Duct Tape	Tepu ya Mifereji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Width", "Material"]	066471f5-d171-4c35-8e50-808447e36618
2c525650-7aad-470e-bbc3-469d4a285583	2026-08-25 14:41:18.205126+00	Teflon Tapes	Tepu za Teflon	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Temperature Resistance", "Material"]	066471f5-d171-4c35-8e50-808447e36618
96338b2d-4fc8-45f5-8507-cd23179850bb	2026-08-25 14:41:18.205126+00	Price Gun Labels	Lebulu za Bunduki ya Bei	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Label Size", "Roll Quantity"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
f31aaea2-2d4b-4c9c-9527-6453fa5eb2ab	2026-08-25 14:41:18.205126+00	Jewelry Tags	Lebulu za Vito	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Label Size", "Easy-peel"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
218eefd3-db5d-42f5-9a8d-0ecb74b89769	2026-08-25 14:41:18.205126+00	Expiry Date Stickers	Vibandiko vya Tarehe ya Kuisha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Label Size", "Color"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
52748a42-eef3-4c48-a2ca-be06a746b882	2026-08-25 14:41:18.205126+00	Tamper-evident Seals	Mihuri ya Kujidhihirisha Kuguswa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Security Level", "Background Color"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
fe03c315-7ab7-4283-987b-1e5547f5a9da	2026-08-25 14:41:18.205126+00	Warranty Void Stickers	Vibandiko vya Kufuta Udhamini	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Security Level", "UV Resistance"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
1a7990a3-d0e8-429b-ad08-4eee37bf78b9	2026-08-25 14:41:18.205126+00	Hazard Stickers	Vibandiko vya Hatari	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Safety Standard", "Color"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
7c6fb273-45bf-4fa2-ae4a-9fcd90642387	2026-08-25 14:41:18.702168+00	Clay Tiles	Vigae vya Udongo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Weight per Tile"]	223c9228-c75a-4833-b40d-99ce92c46725
eb9bfd6f-63ea-4f61-b64f-34f8f060d628	2026-08-25 14:41:18.702168+00	Concrete Tiles	Vigae vya Zege	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Weight per Tile"]	223c9228-c75a-4833-b40d-99ce92c46725
430ffbd6-0806-4d02-a1e7-0b44e1eb1391	2026-08-25 14:41:18.702168+00	Stone-Coated Shingles	Vibati vya Kuezekea vyenye Mawe	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Pieces per Sqm"]	223c9228-c75a-4833-b40d-99ce92c46725
663e3506-b248-4e90-a885-baca7d579c42	2026-08-25 14:41:18.702168+00	Clear Float Glass	Kioo cha Clear Float	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Thickness", "Glass Type"]	43b3749b-aa25-4702-8f23-1999e78dbc83
65af7276-18da-41a3-a5ab-2d9095b71a06	2026-08-25 14:41:18.702168+00	Tempered Glass	Kioo cha Tempered	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Thickness", "Strength Rating"]	43b3749b-aa25-4702-8f23-1999e78dbc83
9efd1d6e-a19b-4830-a667-ebfb3e20bbd8	2026-08-25 14:41:18.702168+00	Frosted Glass	Kioo cha Frosted	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Thickness", "Glass Type"]	43b3749b-aa25-4702-8f23-1999e78dbc83
273fce78-4c18-488e-8ba8-e2e8e249cc34	2026-08-25 14:41:18.702168+00	Frameless Glass Doors	Milango ya Kioo Isiyo na Fremu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Glass Thickness", "Hardware Finish"]	0f756812-3bfe-42a7-9337-0e6826de39ae
ca728594-63be-4e17-8193-515e0cec0972	2026-08-25 14:41:18.702168+00	Shower Enclosures	Mafungo ya Kuogelea	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Glass Thickness", "Opening Mechanism"]	0f756812-3bfe-42a7-9337-0e6826de39ae
86451c9e-a428-4f6c-8bb4-d8448c00dd61	2026-08-25 14:41:18.702168+00	Cabinet Hinges	Viungio vya Kabati	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hinge Type", "Load Capacity"]	210aa68f-f93f-4411-a9f1-ed2bcbe5a743
4e339cf0-6e92-4251-a7fb-6af8498b1dae	2026-08-25 14:41:18.702168+00	Drawer Slides	Viteleza vya Droo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Slide Extension", "Load Capacity"]	210aa68f-f93f-4411-a9f1-ed2bcbe5a743
ca83fda4-93f6-46dd-a8c6-76dd3c794209	2026-08-25 14:41:18.702168+00	Knobs	Knops	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Finish", "Material"]	210aa68f-f93f-4411-a9f1-ed2bcbe5a743
f617fb0f-07a1-4b63-94f0-55d20b188bea	2026-08-25 14:41:18.702168+00	Pulls	Vikokota	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Finish", "Material"]	210aa68f-f93f-4411-a9f1-ed2bcbe5a743
68216bbb-e0de-40d5-90e7-04fd193e670f	2026-08-25 14:41:19.217904+00	Home Theater	Home Theater	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Channel Configuration", "Total RMS"]	05f2dcbc-2b6f-4691-909a-8910d70bb636
501a8586-135b-436a-a111-2be288463b63	2026-08-25 14:41:19.217904+00	Soundbars	Soundbar	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Channel Configuration", "Input Ports"]	05f2dcbc-2b6f-4691-909a-8910d70bb636
a527963a-0db1-499e-a52d-e4b507f59110	2026-08-25 14:41:19.217904+00	Passive PA Speakers	Spika za PA Passive	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Frequency Response", "Impedance"]	05f2dcbc-2b6f-4691-909a-8910d70bb636
47b2a7d3-33d6-4ef9-91b6-960995d68e63	2026-08-25 14:41:19.217904+00	Active PA Speakers	Spika za PA Active	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Frequency Response", "Impedance"]	05f2dcbc-2b6f-4691-909a-8910d70bb636
8aa63a65-d2d7-4bfd-ac85-d89ac86c9893	2026-08-25 14:41:19.217904+00	Ceiling Speakers	Spika za Dari	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Mounting Type", "Driver Material"]	05f2dcbc-2b6f-4691-909a-8910d70bb636
301661a8-4580-487d-bda8-c36e4b22e3f5	2026-08-25 14:41:19.217904+00	Tweeters	Tweeta	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Driver Material", "Impedance"]	05f2dcbc-2b6f-4691-909a-8910d70bb636
b3780bf6-2b9d-42fe-b581-f2aa61e38529	2026-08-25 14:41:19.217904+00	Portable Bluetooth Speakers	Spika za Bluetooth za Kubebeka	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Output Power", "Waterproof"]	05f2dcbc-2b6f-4691-909a-8910d70bb636
f6861f9a-41ef-49bf-b9a0-0747fb2d4b02	2026-08-25 14:41:19.217904+00	Smartphones	Simu Mahiri	f	f	t	f	f	f	f	10	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Storage", "RAM"]	c66c0920-3d2c-4ec7-ae34-44df3bff61ba
3175a656-5939-406d-a213-b2f0a11e3cb6	2026-08-25 14:41:19.217904+00	Tablets	Kompyuta za Mkononi	f	f	t	f	f	f	f	10	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Storage", "RAM"]	c66c0920-3d2c-4ec7-ae34-44df3bff61ba
a8ee2c7e-0a3e-4874-9c35-530bfe547d93	2026-08-25 14:41:19.217904+00	Smartwatches	Saa Mahiri	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Screen Type", "OS"]	592f7888-0fb6-4363-b407-cb4d32d8175e
c7efd523-5c51-423a-9961-f0e04c298635	2026-08-25 14:41:19.217904+00	Health Trackers	Vichunguzi vya Afya	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sensors", "Charging"]	592f7888-0fb6-4363-b407-cb4d32d8175e
7a9be59c-7c70-4c59-8b3b-7a1af1e05d1f	2026-08-25 14:41:19.217904+00	Activity Trackers	Vichunguzi vya Shughuli	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sensors", "GPS"]	592f7888-0fb6-4363-b407-cb4d32d8175e
2af49b9c-577a-453a-9ecd-7de8b871c8c0	2026-08-25 14:41:19.217904+00	Watch Display Boxes	Sanduku za Kuonyesha Saa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Slot Count", "Exterior Material"]	153e4c38-c8ef-4a94-bc8a-3d0142606c81
094a7c00-9ea3-4b66-b823-c0089b65ba56	2026-08-25 14:41:19.217904+00	Travel Rolls	Viringo vya Kusafiria	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Material"]	153e4c38-c8ef-4a94-bc8a-3d0142606c81
0b34865a-bf26-4a43-b1a4-98564dd3b443	2026-08-25 14:41:19.217904+00	Automatic Winders	Vinjari vya Kiotomatiki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Rotation Modes", "Power Source"]	153e4c38-c8ef-4a94-bc8a-3d0142606c81
56655924-2b08-4061-8b16-d1ff6f4c6cc4	2026-08-25 14:41:19.217904+00	Leather Straps	Mikanda ya Ngozi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Band Width"]	153e4c38-c8ef-4a94-bc8a-3d0142606c81
e3f6180e-d174-4cf6-8c18-eb5ba50f864b	2026-08-25 14:41:19.217904+00	Silicone Straps	Mikanda ya Silikoni	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Band Width"]	153e4c38-c8ef-4a94-bc8a-3d0142606c81
6b22f171-06a7-4c36-80e6-abe084a6cae6	2026-08-25 14:41:19.217904+00	Metal Straps	Mikanda ya Chuma	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Band Width"]	153e4c38-c8ef-4a94-bc8a-3d0142606c81
80023462-c200-4e90-ba49-f3c114b0a62f	2026-08-25 14:41:19.217904+00	NATO Straps	Mikanda ya NATO	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Band Width"]	153e4c38-c8ef-4a94-bc8a-3d0142606c81
04831624-881a-48f8-83fe-7b7456d14803	2026-08-25 14:41:19.217904+00	Wall Mounts	Vipachiki vya Ukutani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Mount Type", "Max Load"]	2c2f918e-823a-44d1-a481-671b807b46e4
cac52f40-02d2-4a30-82fb-d94b325995ae	2026-08-25 14:41:19.217904+00	HDMI Switches	Swichi za HDMI	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["HDMI Version", "Ports"]	2c2f918e-823a-44d1-a481-671b807b46e4
be293163-4da9-4ef8-9cc4-48724fadcec6	2026-08-25 14:41:19.217904+00	Remote Controls	Vitudhibiti vya Kijijia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Compatibility", "Wireless"]	2c2f918e-823a-44d1-a481-671b807b46e4
75b77a77-16df-4c54-80ca-d5e72f8dc0ce	2026-08-25 14:41:19.217904+00	Surge Protectors	Kinga za Mwimwi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Protection Rating", "Ports"]	2c2f918e-823a-44d1-a481-671b807b46e4
b3a089b4-a462-4d58-b668-19bdd3cc007a	2026-08-25 14:41:19.217904+00	Smart Glasses	Miwani Mahiri	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Display Technology", "Connectivity"]	01f747fc-e08b-403d-b9cd-58e4dc06ce4a
01ccd3af-7048-449b-92d0-b6934a0473cb	2026-08-25 14:41:19.217904+00	AR Visors	Visor za AR	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Display Technology", "Weight"]	01f747fc-e08b-403d-b9cd-58e4dc06ce4a
21ed3dc2-0ad9-4442-bd31-4e4f44b6aeaf	2026-08-25 14:41:19.217904+00	Mixed Reality Hardware	Vifaa vya Mixed Reality	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Display Technology", "Camera Resolution"]	01f747fc-e08b-403d-b9cd-58e4dc06ce4a
02fb676c-2b84-4b1e-97ec-a5532956aa28	2026-08-25 14:41:19.692842+00	Reflector Vests	Vesti za Kuakisi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Reflector Class", "Fabric"]	2d493f98-4474-487a-b09a-82d73b4497b7
1b36b66b-7a68-4a1c-98a6-4f4d7b6d9868	2026-08-25 14:41:19.692842+00	Overalls	Overall	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Material", "Closure"]	2d493f98-4474-487a-b09a-82d73b4497b7
9fe8d2dc-c394-4073-a71d-326970c431a8	2026-08-25 14:41:19.692842+00	Chemical Suits	Suti za Kemikali	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Material", "Protection Level"]	2d493f98-4474-487a-b09a-82d73b4497b7
c5ee5533-6ec7-4aea-961f-c13fe6e5ea85	2026-08-25 14:41:19.692842+00	Electrical Hazard Footwear	Viatu vya Hatari ya Umeme	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["EH Rating", "Sole Material"]	2de3c52b-926f-4540-abd0-5b1fe17dc927
2151724a-b69c-48d6-9714-87868725147a	2026-08-25 14:41:19.692842+00	Heat Resistant Footwear	Viatu vya Kustahimili Joto	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Heat Resistance", "Sole Material"]	2de3c52b-926f-4540-abd0-5b1fe17dc927
ba85d84a-ff30-482a-9239-a6361510ef99	2026-08-25 14:41:19.692842+00	Used Hiking Boots	Buti za Kupanda Milima Zilizotumika	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Waterproof", "Tread Depth"]	06f6e4e6-73dd-4780-83e3-5dc980c49e84
715de5c1-2386-418a-aa2b-2689acd63cbf	2026-08-25 14:41:19.692842+00	Combat Boots	Buti za Kivita	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Ankle Support", "Lining"]	06f6e4e6-73dd-4780-83e3-5dc980c49e84
b689f040-4530-4545-8c14-ccd0352c7860	2026-08-25 14:41:19.692842+00	Safety Shoes	Viatu vya Usalama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Safety Standard", "Material"]	06f6e4e6-73dd-4780-83e3-5dc980c49e84
d0884a1f-c68c-4083-8840-7e1ff0d67b9b	2026-08-25 14:41:19.692842+00	Used Leather Loafers	Viatu vya Ngozi Vilivyotumika	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Leather Suppleness", "Insole"]	06f6e4e6-73dd-4780-83e3-5dc980c49e84
5ad64f2b-faae-44e0-a98b-1ede6656168e	2026-08-25 14:41:19.692842+00	Oxfords	Viatu vya Oxford	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Heel Drag", "Crease"]	06f6e4e6-73dd-4780-83e3-5dc980c49e84
9e5ab082-2e29-475e-b6cd-8a0b7d88f96a	2026-08-25 14:41:19.692842+00	Formal Wear Shoes	Viatu vya Kawaida	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Style"]	06f6e4e6-73dd-4780-83e3-5dc980c49e84
fda977a3-f035-40e1-bb7f-a71706921f61	2026-08-25 14:41:19.692842+00	Rubber Flip-Flops	Makubadhi ya Mpira	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Strap Material", "Sole Thickness"]	23aaf8e1-54d5-48bc-8634-13b46c6242ee
44b96c3f-bbaa-4ee2-8d36-46c5176f7c87	2026-08-25 14:41:19.692842+00	Sports Slides	Viatu vya Riadha vya Kuteleza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Strap Material", "Arch Support"]	23aaf8e1-54d5-48bc-8634-13b46c6242ee
e37044d4-995e-4f64-8d22-f363f0cfc571	2026-08-25 14:41:19.692842+00	Leather Sandals	Viatu vya Ngozi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Water Resistance"]	23aaf8e1-54d5-48bc-8634-13b46c6242ee
b96c114b-eef8-46f8-b46c-afecc6fdb49a	2026-08-25 14:41:19.692842+00	Running Sneakers	Viatu vya Kukimbia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Upper Material", "Midsole"]	09e5cf4e-93af-436f-bde4-b158c8671e23
3d8b99c9-4bad-4fdc-aae1-a90dcda99700	2026-08-25 14:41:19.692842+00	Basketball Sneakers	Viatu vya Mpira wa Kikapu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Ankle Height", "Arch Support"]	09e5cf4e-93af-436f-bde4-b158c8671e23
bba04d3f-375c-4357-b962-670ea60920b2	2026-08-25 14:41:19.692842+00	Casual Sneakers	Sneakers za Kawaida	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Activity Type", "Upper"]	09e5cf4e-93af-436f-bde4-b158c8671e23
76691757-c051-4bd5-b9f9-6d01714a34fc	2026-08-25 14:41:19.692842+00	Trainers	Viatu vya Mazoezi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Activity Type", "Weight"]	09e5cf4e-93af-436f-bde4-b158c8671e23
dc66e9dc-b225-4a8c-a180-a6fd7433344b	2026-08-25 14:41:20.142923+00	Water Tanks	Matangi ya Maji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Pressure"]	36ed57fd-9eb9-4ac7-9eda-588a022ea52c
bc21d270-7fc2-424b-80cf-49593efb60ad	2026-08-25 14:41:20.142923+00	Fuel Tanks	Matangi ya Mafuta	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Pressure"]	36ed57fd-9eb9-4ac7-9eda-588a022ea52c
d2e43e21-6be2-49f8-9149-8eca2b12ae3a	2026-08-25 14:41:20.142923+00	Agricultural Machinery	Mashine za Kilimo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Automation"]	36ed57fd-9eb9-4ac7-9eda-588a022ea52c
af6bb93d-ab05-4e1a-bb8e-f3290a7009c1	2026-08-25 14:41:20.142923+00	Conveyors	Vipeperushi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Automation"]	36ed57fd-9eb9-4ac7-9eda-588a022ea52c
9e1e9956-a332-411a-bc6c-c3034b9b2711	2026-08-25 14:41:20.142923+00	Magnetic Contactors	Kontakta za Magnetic	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Coil Voltage", "Amperage"]	5dd993ec-78b8-49fd-b027-645fd552cccb
e479e9a2-9b81-4a88-9349-a613980f30db	2026-08-25 14:41:20.142923+00	Overload Relays	Rele za Kupakia Kupita Kiasi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Amperage", "Mounting"]	5dd993ec-78b8-49fd-b027-645fd552cccb
dc665c1c-ad94-4c44-9a19-e9d042d7465f	2026-08-25 14:41:20.142923+00	Motor Starters	Vianzishaji vya Motor	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Amperage", "Poles"]	5dd993ec-78b8-49fd-b027-645fd552cccb
04ca909b-2219-46cf-b5e9-17fdfcc168d4	2026-08-25 14:41:20.699894+00	Wrapping Tissue Paper	Karatasi za Kufungia Zawadi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sheet Size", "Acid-Free"]	00d809c1-f223-4520-99a0-b70d4993b438
60fee0e8-7b61-4274-a66c-524c5f04a8b9	2026-08-25 14:41:20.699894+00	Custom Poly Mailers	Vipeperushi maalum vya Poli	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Thickness", "Waterproof"]	00d809c1-f223-4520-99a0-b70d4993b438
08291f56-a4ad-4ec2-9c4e-bed2209f36b1	2026-08-25 14:41:20.699894+00	Luxury Apparel Boxes	Sanduku za Kifahari za Nguo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Paper Type", "Box Dimension"]	00d809c1-f223-4520-99a0-b70d4993b438
59a3f429-1d31-40bb-8164-21b58361e604	2026-08-25 14:41:20.699894+00	Compostable Mailers	Vipeperushi vya Kutengenezea	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Biodegradability", "Material"]	3e03e255-e6fa-4c3a-a9e8-0077f79d00bd
165a6696-fb52-426b-8e07-e0a63e65671e	2026-08-25 14:41:20.699894+00	Documents Enclosed Sleeves	Vifuniko vya Nyaraka	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Application", "Material"]	3e03e255-e6fa-4c3a-a9e8-0077f79d00bd
55e6745a-0bee-4c48-affa-1ae67af42a74	2026-08-25 14:41:20.699894+00	Solar Inverters	Vigeuza Umeme vya Jua	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Output Power", "Inverter Type"]	039161f1-24ec-4640-821a-ef5d7a6ba454
2f487156-62a5-42de-bff4-3b6385a2430c	2026-08-25 14:41:20.699894+00	Solar Converters	Vigeuzi vya Jua	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Output Power", "Input Voltage"]	039161f1-24ec-4640-821a-ef5d7a6ba454
93ef4cfe-e568-4ef4-b62a-c9fd747253e5	2026-08-25 14:41:20.699894+00	Roof Mounts	Vipachiki vya Paa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Mounting Surface", "Material"]	039161f1-24ec-4640-821a-ef5d7a6ba454
c1c6b35e-e9a1-42e6-a0bf-c43fa798eca0	2026-08-25 14:41:20.699894+00	Solar Cables	Kebo za Jua	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cable Size", "Material"]	039161f1-24ec-4640-821a-ef5d7a6ba454
e203d799-0ca7-4fca-a39f-98785361a495	2026-08-25 14:41:20.699894+00	MC4 Connectors	Viunganishi vya MC4	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Connector Type", "Material"]	039161f1-24ec-4640-821a-ef5d7a6ba454
17066d59-ee05-4981-aed1-1d09f312b0b6	2026-08-25 14:41:20.699894+00	Combiner Boxes	Sanduku za Kuchanganya	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Surge Protection", "Material"]	039161f1-24ec-4640-821a-ef5d7a6ba454
71a412fe-1d7a-4aa9-9b0c-dea397b7f216	2026-08-25 14:41:21.161232+00	Crimping Tools	Zana za Kukaba	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cable Types", "Connector Types"]	41c0b35d-9d6e-4f66-b256-1ab4946f6784
1c4c2a6d-9a2e-40f8-9c34-52f8b4be6834	2026-08-25 14:41:21.161232+00	Multimeters	Multimita	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Voltage Range", "Safety Cert"]	41c0b35d-9d6e-4f66-b256-1ab4946f6784
13387ec2-0b6d-4a97-8e7b-66cc265b7ce0	2026-08-25 14:41:21.161232+00	Wire Stripper Sets	Seti za Kuvua Waya	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cable Types", "Size"]	41c0b35d-9d6e-4f66-b256-1ab4946f6784
29e946c7-4649-4ceb-be28-2ab837ab169b	2026-08-25 14:41:21.161232+00	Socket Sets	Seti za Soketi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Pieces", "Drive Size"]	41c0b35d-9d6e-4f66-b256-1ab4946f6784
c086870e-8fa5-4e46-a09c-106d70e0c78b	2026-08-25 14:41:21.161232+00	Ratchets	Racheti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Drive Size", "Tooth Count"]	41c0b35d-9d6e-4f66-b256-1ab4946f6784
7f21e516-2776-45c9-878d-89b159f443e0	2026-08-25 14:41:21.161232+00	Wrench Kits	Kiti za Wrenji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Pieces", "Material"]	41c0b35d-9d6e-4f66-b256-1ab4946f6784
4b240d5a-df24-4bc5-a0e3-80816217e2f7	2026-08-25 14:41:21.161232+00	Phillips Screwdrivers	Bisibisi za Phillips	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tip Type", "Shaft Length"]	1b416443-6659-4681-9fd6-d90fc3f0c7c2
ad8fa979-39df-4887-ae52-695f31576cbc	2026-08-25 14:41:21.161232+00	Flathead Screwdrivers	Bisibisi za Kichwa Bapa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tip Type", "Shaft Length"]	1b416443-6659-4681-9fd6-d90fc3f0c7c2
ea10e81b-f23c-41f9-a6be-d698810f6b1b	2026-08-25 14:41:21.161232+00	Claw Hammers	Nyundo za Makucha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Head Weight", "Handle Type"]	1b416443-6659-4681-9fd6-d90fc3f0c7c2
6239c652-bb6f-4d12-9c86-a1ea2522f7f9	2026-08-25 14:41:21.161232+00	Mallets	Nyundo za Mbao	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Head Weight", "Handle Type"]	1b416443-6659-4681-9fd6-d90fc3f0c7c2
ef45e945-c493-4c63-a847-67cc4004c7fe	2026-08-25 14:41:21.161232+00	Tape Measures	Vipimo vya Utepe	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Measurement Range", "Blade Width"]	1b416443-6659-4681-9fd6-d90fc3f0c7c2
ce954d69-d84f-488b-8f55-c0cea15eb43c	2026-08-25 14:41:21.161232+00	Spirit Levels	Vipimo vya Maji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Vial Count", "Length"]	1b416443-6659-4681-9fd6-d90fc3f0c7c2
1fd984ab-0abc-420c-bd2d-7f7d97248b3f	2026-08-25 14:41:21.161232+00	Squares	Stima	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	1b416443-6659-4681-9fd6-d90fc3f0c7c2
2d68306b-42f8-4d46-8c8a-0a1ec7db7b1a	2026-08-25 14:41:21.161232+00	Calipers	Kabilia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Accuracy", "Digital Display"]	1b416443-6659-4681-9fd6-d90fc3f0c7c2
0bcaf394-edca-47ea-a27d-a6a564ddb9c5	2026-08-25 14:41:21.717218+00	Pizza Delivery Bags	Mifuko ya Kupeleka Pizza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Insulation", "Capacity"]	33379f57-891c-40d5-bf19-035182e9b5a0
c196d293-f0b4-4d78-94e6-8785b326b720	2026-08-25 14:41:21.717218+00	Thermal Lunch Boxes	Sanduku za Chakula za Mchana za Joto	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Insulation", "Capacity"]	33379f57-891c-40d5-bf19-035182e9b5a0
32ff639e-51fa-480f-999c-b35eb7410758	2026-08-25 14:41:21.717218+00	Cooler Bags	Mifuko ya Baridi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Insulation", "Capacity"]	33379f57-891c-40d5-bf19-035182e9b5a0
edc65db3-684f-4085-9fae-a2b47706c19b	2026-08-25 14:41:21.717218+00	Electrician Tool Belts	Mikanda ya Zana za Mafundi Umeme	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Pockets", "Max Load"]	33379f57-891c-40d5-bf19-035182e9b5a0
cb95177a-979a-4b68-8eaa-50eb5a06a81c	2026-08-25 14:41:21.717218+00	Heavy-duty Tool Bags	Mifuko ya Zana nzito	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Max Load"]	33379f57-891c-40d5-bf19-035182e9b5a0
f2790490-ca0a-46fc-a550-151b97007bb7	2026-08-25 14:41:21.717218+00	Roll-ups	Vizingo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Pockets"]	33379f57-891c-40d5-bf19-035182e9b5a0
2bc96238-5117-4a4f-980a-00c8b5338fcb	2026-08-25 14:41:21.717218+00	Tactical Backpacks	Mikoba ya Kivita	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["MOLLE System", "Volume"]	33379f57-891c-40d5-bf19-035182e9b5a0
b613a085-a4bd-4ffe-aac1-f6fdac26d2f0	2026-08-25 14:41:21.717218+00	First Aid Kits	Kiti za Huduma ya Kwanza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Items", "Case Type"]	33379f57-891c-40d5-bf19-035182e9b5a0
244a0582-7504-4707-8469-52bbfe1e3d65	2026-08-25 14:41:21.717218+00	Dry Bags	Mifuko Mivivu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Waterproof Rating", "Volume"]	33379f57-891c-40d5-bf19-035182e9b5a0
2dbaf6ba-ab4c-47d2-9839-5fde63ce3a7a	2026-08-25 14:41:21.717218+00	Retractable Badge Reels	Reeli za Beji Zinazojirudisha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cord Length", "Clip Type"]	5c5ced8a-8fc1-4130-abe3-bb9f0f89f25c
0d976d1e-f934-463e-b833-2989b2296011	2026-08-25 14:41:21.717218+00	Beaded Lanyards	Kamba za Shingo zenye Shanga	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cord Length", "Decorative"]	5c5ced8a-8fc1-4130-abe3-bb9f0f89f25c
c3a616dc-1a3e-4584-af5e-82661a86465d	2026-08-25 14:41:22.151883+00	Acrylic Paints	Rangi za Akriliki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Media Type", "Color"]	31fa9ec4-6f5b-4977-9e96-88f8a4ff51d3
61d95c10-e960-47c8-a92b-3e1ef4c7c4d5	2026-08-25 14:41:22.151883+00	Canvas	Turubai	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Canvas Size", "Material"]	31fa9ec4-6f5b-4977-9e96-88f8a4ff51d3
2d96b7bd-91ae-413d-962c-9199eda66d48	2026-08-25 14:41:22.151883+00	Scrapbooking	Vitabu vya Kuchapandika	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Paper GSM", "Acid-free"]	31fa9ec4-6f5b-4977-9e96-88f8a4ff51d3
95bfaab1-b139-4a48-ad79-a5d361205d31	2026-08-25 14:41:22.151883+00	Cardstock	Kadistoki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Paper GSM", "Color"]	31fa9ec4-6f5b-4977-9e96-88f8a4ff51d3
ba21d86e-3879-482d-9c41-236f21a8a982	2026-08-25 14:41:22.151883+00	Multi-Sport Team Wear	Mavazi ya Timu ya Michezo Mbalimbali	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Impact Resistance", "Collar Type"]	05483a18-d3d2-4e67-99ea-b4ab83413798
8d8c4721-72cb-44ed-a22e-b18e2c1bdd5c	2026-08-25 14:41:22.151883+00	Gates	Lango	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Project Type", "Design Style"]	3e2e59be-9d53-4983-9141-5701b266f319
380d753c-312c-438c-866b-b07b7d3b7028	2026-08-25 14:41:22.151883+00	Grills	Grili	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Project Type", "Surface Treatment"]	3e2e59be-9d53-4983-9141-5701b266f319
dfe1b57a-bc5e-4bdb-b1e9-63da982f61ec	2026-08-25 14:41:22.151883+00	Fencing Fabrication	Utengenezaji wa Uzio	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Project Type", "Lead Time"]	3e2e59be-9d53-4983-9141-5701b266f319
af313913-2330-4642-9447-971a07dddb29	2026-08-25 14:41:22.151883+00	Walkers	Vitembezi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Frame Material", "Weight Capacity"]	2484cb17-be96-4b8d-aef6-e761a2870314
57a676cc-e42f-4e9c-99e6-49bfd2015108	2026-08-25 14:41:22.151883+00	Rollators	Rollators	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Frame Material", "Height Adjustment"]	2484cb17-be96-4b8d-aef6-e761a2870314
43ccd5e8-079f-4b50-964a-5baf2887987c	2026-08-25 14:41:22.151883+00	Canes	Magongo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Weight Capacity"]	2484cb17-be96-4b8d-aef6-e761a2870314
5b26d370-3ee3-418f-8bfe-b972944c8aec	2026-08-25 14:41:22.151883+00	Crutches	Halmashauri	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Height Adjustment"]	2484cb17-be96-4b8d-aef6-e761a2870314
e2b06a0c-497e-4469-84ce-41fecd0b0b90	2026-08-25 14:41:22.151883+00	Uzi (Threads)	Uzi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Namba ya Uzi", "Material"]	98cf7553-2641-480d-bf34-c518fdb942fc
40d0ebf0-ef4f-4f93-9b42-33971e03f0c2	2026-08-25 14:41:46.980173+00	Chinos	Chinos	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Waist Size", "Fit"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
4104d757-90c6-4e9f-9f07-ec32a038a321	2026-08-25 14:41:46.980173+00	Prototyping	Uundaji Mfano	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Printing Technology", "Material"]	563747dc-1890-4b53-b859-d34abf12ba33
d242dfb7-bb14-46cb-9faa-eaf3ca53f365	2026-08-25 14:41:46.980173+00	Vacuum Forming	Uundaji wa Utupu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Printing Technology", "Material"]	563747dc-1890-4b53-b859-d34abf12ba33
3b9d2d40-ba3b-4161-94c0-5245447a8993	2026-08-25 14:41:46.980173+00	3D Printing	Uchapishaji 3D	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Layer Resolution", "Material"]	563747dc-1890-4b53-b859-d34abf12ba33
89c2eba1-6677-41af-8c8d-627b0d776eef	2026-08-25 14:41:46.980173+00	Acupressure Massage Slippers	Makapaa ya Acupressure	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Massage Point Type", "Material"]	23aaf8e1-54d5-48bc-8634-13b46c6242ee
e600188d-076f-488d-824d-4a78ef70e5eb	2026-08-25 14:41:46.980173+00	Orthopedic Slides	Viatu vya Kuteleza vya Mifupa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Condition Targeting", "Shock Absorption"]	23aaf8e1-54d5-48bc-8634-13b46c6242ee
6820b3d8-f2f5-4d0e-bd39-ba120b9e5516	2026-08-25 14:41:46.980173+00	Liquid Wallpaper	Ukuta wa Kioevu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Coverage Area", "Primary Component"]	44e0573e-55d4-4fac-ae80-5696c0a3ac0e
d464919d-2dec-4cb0-8967-588335c92d9f	2026-08-25 14:41:46.980173+00	Venetian Stucco	Stuko ya Venetian	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Application Tool", "Drying Time"]	44e0573e-55d4-4fac-ae80-5696c0a3ac0e
a6f21a6c-a711-4b36-8332-d63d6900a021	2026-08-25 14:41:46.980173+00	Texture Paints	Rangi za Umbo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Coverage Area", "Drying Time"]	44e0573e-55d4-4fac-ae80-5696c0a3ac0e
1e427469-a726-4ecf-b55e-425467dfa132	2026-08-25 14:41:46.980173+00	General Purpose Home Tool Kits	Seti za Zana za Nyumbani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Primary Tools", "Case Material"]	41c0b35d-9d6e-4f66-b256-1ab4946f6784
9f6d6926-474a-4a8a-ac82-996397a5f667	2026-08-25 14:41:46.980173+00	Precision Screwdriver Sets	Seti za Bisibisi za Usahihi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Insulation Rating", "Storage"]	41c0b35d-9d6e-4f66-b256-1ab4946f6784
f0e48043-6e3f-488d-8e65-673d3066ad44	2026-08-25 14:41:46.980173+00	Bridal Belts	Mikanda ya Harusi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Accessory Type", "Fabric"]	26a63525-d6e3-47d3-aa76-d2f653115921
a3693e4b-b93d-4ed2-86a2-23397a5933e6	2026-08-25 14:41:46.980173+00	Bridal Gloves	Glovu za Harusi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Glove Length", "Color"]	26a63525-d6e3-47d3-aa76-d2f653115921
f1a7f4a9-7a5c-4579-ae9e-37ca50e73cac	2026-08-25 14:41:46.980173+00	Bridal Garters	Gata za Harusi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Accessory Type", "Fabric"]	26a63525-d6e3-47d3-aa76-d2f653115921
b4853b9e-4873-49fb-b11d-bb553cc01292	2026-08-25 14:41:46.980173+00	Ring Pillows	Mito ya Pete	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Accessory Type", "Themed Style"]	26a63525-d6e3-47d3-aa76-d2f653115921
561878b3-a91d-4a9a-aace-faf9c717bfdb	2026-08-25 14:41:46.980173+00	Underwear	Chupi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Support Type", "Fabric"]	f8a70e64-b80e-4482-96a7-a11d116134bf
9062d277-03d4-4b63-8ec3-b51c81d259ba	2026-08-25 14:41:46.980173+00	Sleepwear	Nguo za Kulala	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Support Type", "Fabric"]	f8a70e64-b80e-4482-96a7-a11d116134bf
41658e90-02ec-4d30-ac88-0b3fba4d7504	2026-08-25 14:41:46.980173+00	Solar Panels	Paneli za Jua	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Max Power", "Cell Type"]	039161f1-24ec-4640-821a-ef5d7a6ba454
96080d50-836e-4e49-b68f-8a4e4dde5cf8	2026-08-25 14:41:46.980173+00	PV Modules	Moduli za PV	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Panel Efficiency", "Operating Voltage"]	039161f1-24ec-4640-821a-ef5d7a6ba454
9bac5257-cad7-4b9a-bec5-4d03f23db364	2026-08-25 14:41:46.980173+00	Repair Tool Kits	Kiti za Zana za Kutengeneza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tool Type", "Sizes"]	153e4c38-c8ef-4a94-bc8a-3d0142606c81
c539ed14-d7eb-4bbb-908f-b8baae81b753	2026-08-25 14:41:46.980173+00	Replacement Crystals	Fuwele za Kubadilishia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Size"]	153e4c38-c8ef-4a94-bc8a-3d0142606c81
b9ce8158-7724-4076-ae68-fe3d03771ce6	2026-08-25 14:41:46.980173+00	Batteries (Watch)	Betri (Saa)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Battery Code", "Type"]	153e4c38-c8ef-4a94-bc8a-3d0142606c81
f4be5f2c-c41f-4de9-b780-44c538ec6fd7	2026-08-25 14:41:46.980173+00	Massage Tables	Meza za Kugusa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Foldable", "Material"]	81de2f1d-6f89-4aff-99ba-e10849f40295
22145cf8-58c5-435d-9462-0c9479cac4db	2026-08-25 14:41:46.980173+00	Therapy Tables	Meza za Tiba	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Foldable", "Material"]	81de2f1d-6f89-4aff-99ba-e10849f40295
a7696d4b-4dec-405e-9fb9-f21e0f2455cb	2026-08-25 14:41:46.980173+00	Main Entrance Doors	Milango ya Kuingilia Kuu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Door Material", "Fire Rating"]	0f756812-3bfe-42a7-9337-0e6826de39ae
598a08b6-8462-4749-a220-d8497c6e5a24	2026-08-25 14:41:46.980173+00	Bedroom Doors	Milango ya Chumbani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Door Material", "Surface Finish"]	0f756812-3bfe-42a7-9337-0e6826de39ae
95dafd74-3934-44a0-9bd0-ce7c41584816	2026-08-25 14:41:46.980173+00	Office Doors	Milango ya Ofisini	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Door Material", "Surface Finish"]	0f756812-3bfe-42a7-9337-0e6826de39ae
1d63215d-0a36-4149-9dbd-026b7169d2ea	2026-08-25 14:41:46.980173+00	Magnetic Gift Boxes	Sanduku za Zawadi za Magnetic	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Finish", "Custom Branding"]	2db83173-196c-46e9-9e2f-4f4f52bf7268
924c3892-7d2b-4316-a4af-c91225e725ec	2026-08-25 14:41:46.980173+00	Jewelry Boxes	Sanduku za Vito	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Internal Padding", "Color"]	2db83173-196c-46e9-9e2f-4f4f52bf7268
b680f483-30f1-46f6-b9c6-8853c852d2ad	2026-08-25 14:41:46.980173+00	Rigid Luxury Boxes	Sanduku za Kifahari Ngumu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Box Type", "Finish"]	2db83173-196c-46e9-9e2f-4f4f52bf7268
6d7f221f-2776-435d-b60c-61da2ce63b83	2026-08-25 14:41:46.980173+00	Polyester Lanyards	Kamba za Shingo za Poliesta	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Width", "Printing Technique"]	5c5ced8a-8fc1-4130-abe3-bb9f0f89f25c
da87a305-11de-4a5a-b668-b106387773d9	2026-08-25 14:41:46.980173+00	Nylon Lanyards	Kamba za Shingo za Nailoni	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Width", "Printing Technique"]	5c5ced8a-8fc1-4130-abe3-bb9f0f89f25c
e11373c3-874e-4154-b11d-b284926d6e2f	2026-08-25 14:41:46.980173+00	Crossbody Bags	Mikoba ya Kuvukisha Mwili	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Strap Length", "Hardware Finish"]	25719b69-d419-4920-a2d8-c1d458ba6dda
e61da3c1-a627-46d6-b2a0-177b1c30c934	2026-08-25 14:41:46.980173+00	Hobo Bags	Mikoba ya Hobo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bag Shape", "Weight"]	25719b69-d419-4920-a2d8-c1d458ba6dda
4ed19229-4df4-468e-802c-86ceea91227a	2026-08-25 14:41:46.980173+00	Belt Bags	Mikoba ya Mkanda	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bag Shape", "Front Pocket"]	25719b69-d419-4920-a2d8-c1d458ba6dda
9524a889-b808-4a03-aa38-21014408de8d	2026-08-25 14:41:46.980173+00	Emergency Stops	Vituo vya Dharura	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Actuator Type", "Cut-out Diameter"]	5dd993ec-78b8-49fd-b027-645fd552cccb
931ebbfa-32ee-429c-83b0-a6f842e37bb8	2026-08-25 14:41:46.980173+00	Push Buttons	Vitufe vya Kukandamiza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Actuator Type", "Illumination"]	5dd993ec-78b8-49fd-b027-645fd552cccb
49872f9d-ac61-43ee-9b3a-9017b13600dc	2026-08-25 14:41:46.980173+00	Selector Switches	Swichi za Kuchagua	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Actuator Type", "Housing Material"]	5dd993ec-78b8-49fd-b027-645fd552cccb
61fe5f5c-1a6b-4835-b51f-75ce5664ba96	2026-08-25 14:42:09.212986+00	Cucumbers	Matango	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Ripeness Level", "Unit of Sale"]	63af60ac-b592-4d49-acea-4b75a0ae4908
038583ba-3d8e-4f63-bd69-4c337f3c8658	2026-08-25 14:41:46.980173+00	Printed Tissue Paper	Karatasi za Tishu zilizochapishwa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Paper Weight", "Pattern"]	00d809c1-f223-4520-99a0-b70d4993b438
1f9c18f9-f2d6-443e-aa46-2e2fc277616e	2026-08-25 14:41:46.980173+00	Garment Bags	Mifuko ya Nguo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Zipper Durability"]	00d809c1-f223-4520-99a0-b70d4993b438
36908fe3-f5c9-41c5-844f-62cd5afb666e	2026-08-25 14:41:46.980173+00	Silica Gel	Jeli ya Silika	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Moisture Absorption", "Package"]	00d809c1-f223-4520-99a0-b70d4993b438
8a807af3-95a6-4d2f-bcca-07b495ec773a	2026-08-25 14:41:46.980173+00	Rice Husks	Makapi ya Mchele	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Crop Source", "Moisture"]	606bec46-0f6d-4ed2-aeab-85caaa85a430
04f571d8-1b85-42a3-b54c-f6efc49e901c	2026-08-25 14:41:46.980173+00	Maize Cobs	Mahindi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Crop Source", "Form"]	606bec46-0f6d-4ed2-aeab-85caaa85a430
7d50022a-a793-4aaf-ad3a-3cdf4b4be066	2026-08-25 14:41:46.980173+00	Straw	Majani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Crop Source", "Bulk Density"]	606bec46-0f6d-4ed2-aeab-85caaa85a430
3535d3ce-0c92-4af8-93fb-bac339221e27	2026-08-25 14:41:46.980173+00	Knee Braces	Breti za Goti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Support Level", "Closure Type"]	2484cb17-be96-4b8d-aef6-e761a2870314
5cc99d5d-b91a-4582-a9d0-bc7c256d6d85	2026-08-25 14:41:46.980173+00	Back Supports	Vitegemeo vya Mgongo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Support Level", "Size"]	2484cb17-be96-4b8d-aef6-e761a2870314
2b9a991c-10cc-4463-b469-4620bf199105	2026-08-25 14:41:46.980173+00	Wrist Splints	Vipasuo vya Kifundo cha Mkono	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Support Level", "Closure Type"]	2484cb17-be96-4b8d-aef6-e761a2870314
b3eace16-aac1-427e-90b5-479660f5f0c3	2026-08-25 14:41:46.980173+00	Fire Extinguishers	Vizima Moto	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Extinguisher Type", "Size"]	2d493f98-4474-487a-b09a-82d73b4497b7
898c8a01-4165-4198-9c3b-847b248a26a2	2026-08-25 14:41:46.980173+00	First Aid Kits	Kiti za Huduma ya Kwanza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Contents"]	2d493f98-4474-487a-b09a-82d73b4497b7
e934ec2e-d258-4468-ac20-c4feec714102	2026-08-25 14:41:46.980173+00	Safety Cones	Koni za Usalama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Height", "Reflective"]	2d493f98-4474-487a-b09a-82d73b4497b7
20f98ed8-5029-4578-b25c-182d3aeb4e19	2026-08-25 14:41:46.980173+00	Batteries (Motorcycle)	Betri (Pikipiki)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Voltage", "Amperage"]	24790a5e-c1e6-4194-af24-c40951782cf9
5df680bc-249f-471b-b71a-82d979d99a17	2026-08-25 14:41:46.980173+00	LED Headlights (Motorcycle)	Taa za Mbele za LED (Pikipiki)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bulb Type", "Waterproof"]	24790a5e-c1e6-4194-af24-c40951782cf9
ab2abd2a-05a6-4340-984c-e5201cd8bb87	2026-08-25 14:41:46.980173+00	Indicators (Motorcycle)	Viashiria (Pikipiki)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bulb Type", "Connector"]	24790a5e-c1e6-4194-af24-c40951782cf9
01ff0a9f-8d27-4bd0-ad7b-d396a09031bd	2026-08-25 14:41:46.980173+00	CDI Units	Vizio vya CDI	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Connector"]	24790a5e-c1e6-4194-af24-c40951782cf9
d8dd1588-d94e-44b9-ac39-755b5f3e5d83	2026-08-25 14:41:46.980173+00	Electric Chain Hoists	Viwindo vya Umeme	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Lifting Speed"]	4c24d053-6fdc-4c8d-af8a-b00705651bb5
bab7d392-9c69-4768-b7d4-7f6d65711736	2026-08-25 14:41:46.980173+00	Manual Chain Hoists	Viwindo vya Mikono	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Lifting Height"]	4c24d053-6fdc-4c8d-af8a-b00705651bb5
de21c8e8-0e28-44a5-956a-28685c0a3ce0	2026-08-25 14:41:46.980173+00	Lever Blocks	Vitalu vya Lever	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Lifting Height"]	4c24d053-6fdc-4c8d-af8a-b00705651bb5
306daed4-cf90-4b5f-a75b-222eaaca337a	2026-08-25 14:41:46.980173+00	Winches	Winchi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Power Source"]	4c24d053-6fdc-4c8d-af8a-b00705651bb5
20b76620-214b-4933-9ae6-e1359ff73161	2026-08-25 14:41:46.980173+00	Chassis Repair	Urekebishaji wa Chasi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Service Area", "Machine Type"]	3e2e59be-9d53-4983-9141-5701b266f319
b03148be-000a-43ca-a2df-fbd4ed7aada3	2026-08-25 14:41:46.980173+00	Exhaust Welding	Uchomeleaji wa Exhaust	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Service Area", "Technique"]	3e2e59be-9d53-4983-9141-5701b266f319
4c96f966-867a-4524-ae6f-5dbeecd5e0fb	2026-08-25 14:41:46.980173+00	Industrial Repairs	Urekebishaji wa Viwandani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Service Area", "Warranty"]	3e2e59be-9d53-4983-9141-5701b266f319
020a8896-ac5c-42f1-b8cb-edf98066b718	2026-08-25 14:41:46.980173+00	Broccoli	Brokoli	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Seasonality", "Weight"]	63af60ac-b592-4d49-acea-4b75a0ae4908
aae7e168-e3f0-4480-866a-44fe018c6574	2026-08-25 14:41:46.980173+00	Cauliflower	Koliflawa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Seasonality", "Weight"]	63af60ac-b592-4d49-acea-4b75a0ae4908
8d0360b7-7ece-49f8-95ae-eb56ddda4c68	2026-08-25 14:41:46.980173+00	Garlic Bulbs	Balbu za Kitunguu Saumu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Seasonality", "Weight"]	63af60ac-b592-4d49-acea-4b75a0ae4908
52f09dd4-11d7-4f51-991c-1a3f06fa1fb2	2026-08-25 14:41:46.980173+00	Internal Filters	Vichujio vya Ndani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Flow Rate", "Power"]	541ae2d7-0a65-42f6-b8c3-0ec251c3d3c6
3e941e62-558e-435d-abe0-dba0b5460627	2026-08-25 14:41:46.980173+00	External Filters	Vichujio vya Nje	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Flow Rate", "Filter Type"]	541ae2d7-0a65-42f6-b8c3-0ec251c3d3c6
251cc100-de39-47ed-8501-17d16c1a34b4	2026-08-25 14:41:46.980173+00	Air Pumps	Pampu za Hewa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Power", "Quiet Operation"]	541ae2d7-0a65-42f6-b8c3-0ec251c3d3c6
ad196848-cb57-44fe-aa59-ab582d3b60a0	2026-08-25 14:41:46.980173+00	Wavemakers	Watengeneza Mawimbi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Flow Rate", "Power"]	541ae2d7-0a65-42f6-b8c3-0ec251c3d3c6
589af864-8b86-46c4-bddd-2c91f1030b3b	2026-08-25 14:41:46.980173+00	Evacuated Tube High-Pressure Systems	Mifumo ya Tube ya Shinikizo la Juu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tank Capacity", "Max Pressure"]	5726a248-ae89-4483-88dd-cb73a4a68ba2
19751042-af43-427a-806c-5431cd791f4e	2026-08-25 14:41:46.980173+00	Evacuated Tube Low-Pressure Systems	Mifumo ya Tube ya Shinikizo la Chini	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tank Capacity", "Max Pressure"]	5726a248-ae89-4483-88dd-cb73a4a68ba2
d9492116-1018-47a3-bf14-8a39c0410ee5	2026-08-25 14:41:46.980173+00	Fully Synthetic Engine Oils	Mafuta ya Injini ya Synthetiki Kamili	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Viscosity Grade", "API Service"]	41450749-58b2-4ff0-89fb-a64098200b58
82a9af06-a6d9-495b-a923-d58149dbc9d3	2026-08-25 14:41:46.980173+00	Semi-Synthetic Engine Oils	Mafuta ya Injini ya Nusu Synthetiki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Viscosity Grade", "Volume"]	41450749-58b2-4ff0-89fb-a64098200b58
33cf4417-3b92-4af4-ac1c-1e01df21398b	2026-08-25 14:41:46.980173+00	Mineral Engine Oils	Mafuta ya Injini ya Madini	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Viscosity Grade", "Volume"]	41450749-58b2-4ff0-89fb-a64098200b58
d1406c1b-7b1b-4c44-8d09-b0a2714a09cb	2026-08-25 14:41:46.980173+00	Alloy Rims	Magurudumu ya Aloi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Rim Diameter", "Bolt Pattern"]	554769e5-2049-4f32-b9b9-b212525a38d8
ed7dd8de-5bc8-4e0f-b2a3-f9cd861171a5	2026-08-25 14:41:46.980173+00	Steel Wheels	Magurudumu ya Chuma	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Rim Diameter", "Material"]	554769e5-2049-4f32-b9b9-b212525a38d8
c3479063-af7b-44ea-b106-c04e41b31673	2026-08-25 14:41:46.980173+00	Decorative Hubcaps	Vifuniko vya Mapambo vya Gurudumu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Rim Diameter", "Finish"]	554769e5-2049-4f32-b9b9-b212525a38d8
00702912-26b3-4ac2-ba46-9d6b4707ccef	2026-08-25 14:41:46.980173+00	Vinyl Wallpapers	Ukuta wa Vinyl	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Roll Dimensions", "Adhesive"]	44e0573e-55d4-4fac-ae80-5696c0a3ac0e
bccff475-968d-4024-8515-1e5c9069fc67	2026-08-25 14:41:46.980173+00	Non-woven Wallpapers	Ukuta Wasio na Kufuma	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Roll Dimensions", "Washability"]	44e0573e-55d4-4fac-ae80-5696c0a3ac0e
4cae3bb5-8fdf-4ad5-bf8c-7b351fc11661	2026-08-25 14:41:46.980173+00	3D Textured Wallpapers	Ukuta wa Maandishi ya 3D	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Roll Dimensions", "Material"]	44e0573e-55d4-4fac-ae80-5696c0a3ac0e
93c0c1ff-4b7e-4dfe-98b6-46bd349ec9ce	2026-08-25 14:41:46.980173+00	Mountain Bikes	Baiskeli za Mlimani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Frame Size", "Suspension"]	492c7799-7cc8-482d-888f-cc1c18295c7b
9e5151d0-cffc-431a-a8a5-e2bdb610f9a0	2026-08-25 14:41:46.980173+00	Road Bikes	Baiskeli za Barabarani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Frame Size", "Brake Type"]	492c7799-7cc8-482d-888f-cc1c18295c7b
069e6af1-2c57-418a-aac2-6e928268c349	2026-08-25 14:41:46.980173+00	Cycling Helmets	Kozi za Baiskeli	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	492c7799-7cc8-482d-888f-cc1c18295c7b
b2d11c3b-57a6-4dda-b525-e124f3647757	2026-08-25 14:41:46.980173+00	Bifold Wallets	Pochi za Kukunjwa mara mbili	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "RFID Blocking"]	0b8082af-85dd-456e-bec1-a100c082d2e3
c30b0f7e-b577-43c6-b7f6-18f629518cdc	2026-08-25 14:41:46.980173+00	Trifold Wallets	Pochi za Kukunjwa mara tatu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Card Slots"]	0b8082af-85dd-456e-bec1-a100c082d2e3
b5ef6ddd-28ed-4d82-afef-48119e6b7a91	2026-08-25 14:41:46.980173+00	Money Clip Wallets	Klipu za Pesa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Closure Type"]	0b8082af-85dd-456e-bec1-a100c082d2e3
fe9fcae2-850b-46b2-8191-1eb9cd789631	2026-08-25 14:41:46.980173+00	DSLR Camera Bags	Mifuko ya Kamera ya DSLR	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Padding Thickness", "Laptop Compartment"]	33379f57-891c-40d5-bf19-035182e9b5a0
49b7713f-0bc8-4e99-951a-8aeb5781d1bd	2026-08-25 14:41:46.980173+00	Drone Cases	Vipochi vya Drone	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Padding Thickness", "Shockproof"]	33379f57-891c-40d5-bf19-035182e9b5a0
28642003-38e4-49c5-b858-dec61737a0cd	2026-08-25 14:41:46.980173+00	Lens Pouches	Vibebeo vya Lenzi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Padding Thickness", "Waterproof"]	33379f57-891c-40d5-bf19-035182e9b5a0
3c44f18d-1e4a-42e3-927a-f573b1734c38	2026-08-25 14:41:46.980173+00	Necklaces	Mikufu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Chain Type", "Plating"]	05d8790e-8857-4b20-803d-b45f350d5670
e59ad993-2c8c-407d-bc9c-d755271348f2	2026-08-25 14:41:46.980173+00	Pendants	Pendants	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Main Stone", "Chain Length"]	05d8790e-8857-4b20-803d-b45f350d5670
f6140ed9-f617-416f-ac90-19505f9e19e1	2026-08-25 14:41:46.980173+00	Tablecloths	Vitambaa vya Meza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Shape"]	0aa08fd5-ae57-48b0-9e18-2beba7749cbb
e9c9f244-ea66-4919-bd60-966f1968a556	2026-08-25 14:41:46.980173+00	Napkins	Napkin	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Shape"]	0aa08fd5-ae57-48b0-9e18-2beba7749cbb
54068bd4-cadf-46a4-868b-d4814ea6ef19	2026-08-25 14:41:46.980173+00	Chair Covers	Vifuniko vya Viti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Edge Finish"]	0aa08fd5-ae57-48b0-9e18-2beba7749cbb
4782a5b5-caa7-41ca-b613-c834fa29d94a	2026-08-25 14:41:46.980173+00	Decorative Cushions	Mito ya Mapambo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fill Material", "Shape"]	0aa08fd5-ae57-48b0-9e18-2beba7749cbb
b123bbb7-00d0-4457-b763-60cb01d2d78d	2026-08-25 14:41:46.980173+00	Face Masks	Masks za Uso	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Type", "Target Concern"]	44e22ab6-c361-449d-a346-836b2ebb391e
58f424f6-5ec1-4fd9-b473-09469ded1fe5	2026-08-25 14:41:46.980173+00	Spark Plugs (Auto)	Spaki Plagi (Gari)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Electrode Material", "Thread Size"]	00597f28-08b3-46da-a858-347cb5def3ec
6285d382-8946-4a20-969e-6f85698bad0e	2026-08-25 14:41:46.980173+00	Fuel Filters	Vichujio vya Mafuta	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Filter Micron", "Compatibility"]	00597f28-08b3-46da-a858-347cb5def3ec
df1d7757-2d40-449f-a37a-e23b804ee222	2026-08-25 14:41:46.980173+00	Oil Pumps	Pampu za Mafuta	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Operating Pressure", "Material"]	00597f28-08b3-46da-a858-347cb5def3ec
26e4fea9-d8a4-40c3-9163-4ee90deb7d85	2026-08-25 14:41:46.980173+00	Gaskets	Gasketi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Gasket Material", "Size"]	00597f28-08b3-46da-a858-347cb5def3ec
a091b684-ee18-41b6-8f7f-3d2e797aa01b	2026-08-25 14:41:46.980173+00	Sterile Needles	Sindano za Sterile	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sterilization Method", "Gauge"]	524de8b8-8d9c-4e52-804b-8284927b4556
3b745a12-75e7-4b14-8ed2-3a907bc3b1d7	2026-08-25 14:41:46.980173+00	Piercing Kits	Kiti za Kutoboa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Contents", "Safety Certification"]	524de8b8-8d9c-4e52-804b-8284927b4556
2ae4a745-8590-44a1-bae4-efb3faddcf62	2026-08-25 14:41:46.980173+00	Aftercare Sprays	Dawa za Kunyunyizia za Baadae	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Solution Ingredients", "Volume"]	524de8b8-8d9c-4e52-804b-8284927b4556
4c040c79-483a-48cb-9d59-89a38092d9e7	2026-08-25 14:41:46.980173+00	TPMS Sensors	Vihisi vya TPMS	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sensor Type", "Display"]	554769e5-2049-4f32-b9b9-b212525a38d8
c5ce5158-067c-4fc4-afb8-33064cc13766	2026-08-25 14:41:46.980173+00	Tire Covers	Vifuniko vya Tairi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cover Size", "Material"]	554769e5-2049-4f32-b9b9-b212525a38d8
aa4bb055-b7be-4ac2-be74-c3a7f5902cd9	2026-08-25 14:41:46.980173+00	Valve Caps	Vifuniko vya Valvu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Anti-theft"]	554769e5-2049-4f32-b9b9-b212525a38d8
e3f0fa49-871e-443a-8812-4d3a42ec47f5	2026-08-25 14:41:46.980173+00	Brake Pads (Auto)	Pedali za Breki (Gari)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Vehicle Model", "Material"]	00597f28-08b3-46da-a858-347cb5def3ec
0e524a76-31d8-49d3-b40a-6d640da6ff74	2026-08-25 14:41:46.980173+00	Brake Shoes	Viatu vya Breki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Vehicle Model", "Heat Resistance"]	00597f28-08b3-46da-a858-347cb5def3ec
ef925a27-1b54-4793-8ae8-433210df6b49	2026-08-25 14:41:46.980173+00	Basketball Jerseys	Jesi za Mpira wa Kikapu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Jersey Style", "Reversible"]	05483a18-d3d2-4e67-99ea-b4ab83413798
1a93c40b-6265-491c-86fe-424a5457e868	2026-08-25 14:41:46.980173+00	Basketball Shorts	Kaptula za Mpira wa Kikapu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Shorts Length", "Fit Type"]	05483a18-d3d2-4e67-99ea-b4ab83413798
3ca9f2e8-cd6d-468f-9a02-1b2523d197d3	2026-08-25 14:41:46.980173+00	Netball Dresses	Mavazi ya Netiboli	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Jersey Style", "Numbering"]	05483a18-d3d2-4e67-99ea-b4ab83413798
57ec0381-ede0-48c7-a0ba-df22ac1ab40f	2026-08-25 14:41:46.980173+00	Netball Bibs	Bibu za Netiboli	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Jersey Style", "Numbering"]	05483a18-d3d2-4e67-99ea-b4ab83413798
136101a6-4e4c-458a-9f07-691a725f22db	2026-08-25 14:41:46.980173+00	Whitening Toothpastes	Dawa za Meno za Kugeuza Rangi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fluoride Content", "Volume"]	4ac100e3-3295-4afd-a608-ae3acb957bcb
85379050-031f-4776-a2bb-ca26c7f1dd7a	2026-08-25 14:41:46.980173+00	Sensitive Toothpastes	Dawa za Meno za Ngozi Nyeti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fluoride Content", "Special Benefit"]	4ac100e3-3295-4afd-a608-ae3acb957bcb
312fdc10-ac37-42a9-a69d-d7bb3a17d0dc	2026-08-25 14:41:46.980173+00	Herbal Toothpastes	Dawa za Meno za Mitishamba	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Flavor", "Volume"]	4ac100e3-3295-4afd-a608-ae3acb957bcb
a156cbd7-9c33-4716-8b6d-6ccf0f8ccbd2	2026-08-25 14:41:46.980173+00	Mouthwashes	Mdomo Kuanika	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Alcohol-free", "Flavor"]	4ac100e3-3295-4afd-a608-ae3acb957bcb
707f8589-b15a-4e29-9d26-4f333a50700f	2026-08-25 14:41:46.980173+00	Heavy-duty Shipping Boxes	Sanduku za Usafirishaji za Kazi Nzito	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Dimensions", "Wall Type"]	2db83173-196c-46e9-9e2f-4f4f52bf7268
1d7e7c08-3abe-42f2-80f3-98617f477c3d	2026-08-25 14:41:46.980173+00	Moving Boxes	Sanduku za Kuhamia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Dimensions", "Max Load"]	2db83173-196c-46e9-9e2f-4f4f52bf7268
761f404c-76e8-44e0-87ee-14b93898d0d2	2026-08-25 14:41:46.980173+00	Conditioners	Vinyororo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Hair Type"]	447fca2b-0e85-4f7d-b9be-160868830f05
c80b9d8b-c55a-4d9d-bdcf-9e316b471e94	2026-08-25 14:41:46.980173+00	Custom Logo Labels	Lebulu za Nembo Maalum	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Printing"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
f2a6c692-6faa-4376-882a-b6d6ca60784f	2026-08-25 14:41:46.980173+00	Food Stickers	Vibandiko vya Chakula	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Adhesive"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
35d2763b-5e10-47be-b8db-eae26d70f89f	2026-08-25 14:41:46.980173+00	Beverage Stickers	Vibandiko vya Vinywaji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Adhesive"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
2aab8136-e771-4eb3-b63c-56c639c331da	2026-08-25 14:41:46.980173+00	Drawstring Pouches	Vibebeo vya Kufunga Kamba	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Pouch Material", "Closure"]	25995318-792a-4dd8-ae68-4961a50ae6c3
28def9f6-70f2-4042-9d7c-39c8cc5e2976	2026-08-25 14:41:46.980173+00	Travel Organizers	Vipangaji vya Safari	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Compartments", "Closure"]	25995318-792a-4dd8-ae68-4961a50ae6c3
deabc310-954d-49dd-bb08-ada0bb2e8e92	2026-08-25 14:41:46.980173+00	Polishing Cloths	Vitambaa vya Kung'arisha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cleaning Cloth Type", "Size"]	25995318-792a-4dd8-ae68-4961a50ae6c3
cddc44d9-6989-4658-9d83-141843d42188	2026-08-25 14:41:46.980173+00	Fingerprint Readers	Visoma Alama za Vidole	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Authentication Method", "User Capacity"]	50e461cd-b484-42d0-8537-62e303f62be2
2a6a5624-dd06-451b-8bac-d8c4d098116d	2026-08-25 14:41:46.980173+00	Face Recognition Readers	Visoma Kutambua Uso	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Authentication Method", "User Capacity"]	50e461cd-b484-42d0-8537-62e303f62be2
ef1a201a-9aa3-4963-ac91-c42c40beeba5	2026-08-25 14:41:46.980173+00	RFID Card Readers	Visoma Kadi za RFID	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Authentication Method", "Communication"]	50e461cd-b484-42d0-8537-62e303f62be2
e077bb4e-9e78-427b-97c8-da93585d99c7	2026-08-25 14:41:46.980173+00	Elevated Bowls	Bakuli zilizoinuliwa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Material"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
388603b1-425e-4480-903a-5293f614df1d	2026-08-25 14:41:46.980173+00	Automatic Feeders	Vishikio vya Kiotomatiki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Material"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
af79362f-ddf5-4aaa-a5dd-11c864282fa4	2026-08-25 14:41:46.980173+00	Water Fountains	Chemchem za Maji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Material"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
7df78759-68de-4e26-b73a-2ceeb9082659	2026-08-25 14:41:46.980173+00	Pizza Boxes	Sanduku za Pizza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Food Grade", "Ventilation"]	2db83173-196c-46e9-9e2f-4f4f52bf7268
b04026a4-271d-4e0c-abb6-42a1e34541ec	2026-08-25 14:41:46.980173+00	Cake Boxes	Sanduku za Keki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Food Grade", "Window"]	2db83173-196c-46e9-9e2f-4f4f52bf7268
55e2aff3-f8be-414f-a3e4-20e9af2dad55	2026-08-25 14:41:46.980173+00	Pastry Containers	Vyombo vya Keki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Food Grade", "Grease Resistance"]	2db83173-196c-46e9-9e2f-4f4f52bf7268
e632e133-fa1b-4e80-9d74-7c1b885b857d	2026-08-25 14:41:46.980173+00	Medical Scrubs	Nguo za Matibabu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Weight", "Stain Resistance"]	203c11c6-642c-493a-9e0d-46472261fb4e
a96a0ba5-875d-4342-b62f-e1f4649f1b70	2026-08-25 14:41:46.980173+00	Chef Coats	Kanzu za Wapishi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Weight", "Pockets"]	203c11c6-642c-493a-9e0d-46472261fb4e
541cda73-bd5b-49da-bc99-c1932e3def47	2026-08-25 14:41:46.980173+00	Security Wear	Nguo za Usalama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Weight", "Pockets"]	203c11c6-642c-493a-9e0d-46472261fb4e
9ce0cad6-78ad-4ebe-a2c3-cf08bcbf86be	2026-08-25 14:41:46.980173+00	Hospitality Wear	Nguo za Ukarimu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Weight", "Pockets"]	203c11c6-642c-493a-9e0d-46472261fb4e
33ff1261-3ce7-47bd-bf6b-a58e6f1fc868	2026-08-25 14:41:46.980173+00	Torque Wrenches	Wrenji za Torque	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Drive Size", "Max Torque"]	5c3f59e8-0b37-4856-a63e-91fe3a8ff147
1eaa92b3-a54d-40ff-8fd6-6ca2515b5621	2026-08-25 14:41:46.980173+00	Socket Sets (Auto)	Seti za Soketi (Gari)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Socket Pieces", "Material"]	5c3f59e8-0b37-4856-a63e-91fe3a8ff147
81af94ec-3f4b-4685-8e8c-55f997aa30ad	2026-08-25 14:41:46.980173+00	Impact Drivers	Vielekezi vya Athari	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Max Torque", "Power Source"]	5c3f59e8-0b37-4856-a63e-91fe3a8ff147
54b0c81b-06ee-4b03-b3ce-7108a32039d0	2026-08-25 14:41:46.980173+00	No-pull Harnesses	Harusi zisizovuta	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Chest Size", "Attachment"]	3dcc4947-370a-4d5c-b62c-5402ac79767a
e3e974ea-deb9-4a35-8bec-e3a193db3b8a	2026-08-25 14:41:46.980173+00	Tactical Harnesses	Harusi za Kivita	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Chest Size", "Attachment"]	3dcc4947-370a-4d5c-b62c-5402ac79767a
65bf0f95-22e5-406d-a08d-4313be4f3a50	2026-08-25 14:41:46.980173+00	Step-in Harnesses	Harusi za Kuingiza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Chest Size", "Padding"]	3dcc4947-370a-4d5c-b62c-5402ac79767a
e607f0a7-035b-41bc-8ec6-cffaf85e4f6e	2026-08-25 14:41:46.980173+00	Combination Wrenches	Wrenji za Mchanganyiko	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Measurement System", "Pieces"]	1b416443-6659-4681-9fd6-d90fc3f0c7c2
17d32d73-37c8-4cb6-84b1-284c829f7728	2026-08-25 14:41:46.980173+00	Ratchets (Tools)	Racheti (Zana)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tooth Count", "Drive Size"]	1b416443-6659-4681-9fd6-d90fc3f0c7c2
f8651e97-6fbc-423b-9eef-14854a7c7d60	2026-08-25 14:41:46.980173+00	Socket Kits	Kiti za Soketi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Number of Pieces", "Material"]	1b416443-6659-4681-9fd6-d90fc3f0c7c2
48dba89b-958e-4217-979c-9281d2fd1d61	2026-08-25 14:41:46.980173+00	Seat Gap Fillers	Vijazia Pengo la Kiti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Mounting Method", "Material"]	16ff2200-3f62-42d2-919f-bc5b9efcaaf6
f1074798-2aac-4cbe-b8a3-0aea3cc9c2f2	2026-08-25 14:41:46.980173+00	Trunk Organizers	Vipangaji vya Shina	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Material"]	16ff2200-3f62-42d2-919f-bc5b9efcaaf6
d9829a0c-40c8-4a57-9464-9f1d6f8bdbc0	2026-08-25 14:41:46.980173+00	Ambient LED Kits	Kiti za LED za Mazingira	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Lighting Type", "Control Method"]	16ff2200-3f62-42d2-919f-bc5b9efcaaf6
d4070b3a-9a19-44c4-8418-064ef7083f93	2026-08-25 14:41:46.980173+00	Single Wall Sockets	Soketi za Ukuta za Single	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Amperage", "Socket Type"]	48daff56-14d6-4285-b003-de894dd6365d
7226d1f2-6974-4d48-bf92-2850358b46ab	2026-08-25 14:41:46.980173+00	Double Wall Sockets	Soketi za Ukuta za Double	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Amperage", "Number of Gangs"]	48daff56-14d6-4285-b003-de894dd6365d
cffe432e-a812-484a-b18e-600708e9d325	2026-08-25 14:41:46.980173+00	USB Integrated Outlets	Plagi zilizounganishwa za USB	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["USB Output", "Material"]	48daff56-14d6-4285-b003-de894dd6365d
a3368867-051a-4056-ae12-cf005c11d26f	2026-08-25 14:41:46.980173+00	Laminated Safety Glass	Kioo cha Usalama cha Laminated	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Interlayer Material", "Total Thickness"]	43b3749b-aa25-4702-8f23-1999e78dbc83
508b18f4-097d-4638-aa80-1e10e8cecf30	2026-08-25 14:41:46.980173+00	Bullet-Resistant Glass	Kioo Kishika Risasi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Security Rating", "Thickness"]	43b3749b-aa25-4702-8f23-1999e78dbc83
6e617f63-cd4e-4661-82c9-7d1bb5dcc37f	2026-08-25 14:41:46.980173+00	Poultry Litter	Matandiko ya Kuku	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Livestock Type", "NPK Ratio"]	606bec46-0f6d-4ed2-aeab-85caaa85a430
d9d19ca6-4214-4d7d-8fa1-9ae8eb9d4157	2026-08-25 14:41:46.980173+00	Cow Dung	Mbolea ya Ng'ombe	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Decomposition Level", "Organic Matter"]	606bec46-0f6d-4ed2-aeab-85caaa85a430
da6f481e-4dd8-4ad3-8778-cb3430541fcb	2026-08-25 14:41:46.980173+00	Goat Manure	Mbolea ya Mbuzi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Decomposition Level", "Organic Matter"]	606bec46-0f6d-4ed2-aeab-85caaa85a430
c1557908-53c9-45fa-890c-5485106ab03e	2026-08-25 14:41:46.980173+00	Barbed Wire	Waya wa Miiba	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Wire Gauge", "Roll Length"]	210aa68f-f93f-4411-a9f1-ed2bcbe5a743
3d399e68-0907-4189-8364-42209f78b098	2026-08-25 14:41:46.980173+00	Chicken Wire	Waya wa Kuku	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Mesh Size", "Roll Length"]	210aa68f-f93f-4411-a9f1-ed2bcbe5a743
68912caf-c977-4faa-9496-59055a7a6576	2026-08-25 14:41:46.980173+00	Chain-link Wire	Waya wa Mnyororo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Wire Gauge", "Height"]	210aa68f-f93f-4411-a9f1-ed2bcbe5a743
0b96e710-07f8-4494-87d5-df34cf0d76a6	2026-08-25 14:41:46.980173+00	Binding Wire	Waya wa Kufungia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Wire Gauge", "Material"]	210aa68f-f93f-4411-a9f1-ed2bcbe5a743
8596b3bf-7d68-43c9-92b7-11662895275d	2026-08-25 14:41:46.980173+00	Powder Coating	Mipako ya Poda	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Coating Type", "Color Options"]	4a2fbcdb-1704-4d62-8bda-dea87354c397
c8060cf4-2e70-4ea7-a534-9f777c16d1b7	2026-08-25 14:41:46.980173+00	Galvanizing	Ugandishaji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Coating Type", "Corrosion Rating"]	4a2fbcdb-1704-4d62-8bda-dea87354c397
266b4a35-6026-4386-9086-f0e81c5d451b	2026-08-25 14:41:46.980173+00	Sandblasting	Uchomaji Mchanga	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Surface Preparation", "Dimensions"]	4a2fbcdb-1704-4d62-8bda-dea87354c397
82cd9f6d-a670-467f-b1cc-fd15da1c96bd	2026-08-25 14:41:46.980173+00	Shoelaces	Kamba za Viatu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Lace Type", "Length"]	2732192c-9b99-43b3-a731-d8dea5caf86a
a96e3246-1550-4161-a7ef-a68eea3d0187	2026-08-25 14:41:46.980173+00	Charms	Hirizi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Color"]	2732192c-9b99-43b3-a731-d8dea5caf86a
17663243-95af-4714-942a-c4fc337711e6	2026-08-25 14:41:46.980173+00	Buckles	Bekli	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Color"]	2732192c-9b99-43b3-a731-d8dea5caf86a
2cab8343-2074-49a3-8ec7-bee39b00aae2	2026-08-25 14:41:46.980173+00	Kayaks	Kayaks	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Max Weight", "Material"]	492c7799-7cc8-482d-888f-cc1c18295c7b
e00f51f9-86f1-45cd-abef-b50b7f09822e	2026-08-25 14:41:46.980173+00	Life Jackets	Jaketi za Uokoaji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Buoyancy Rating", "Size"]	492c7799-7cc8-482d-888f-cc1c18295c7b
d35621b0-b57b-4797-b9b0-53c709f5a3e8	2026-08-25 14:41:46.980173+00	Fishing Rods	Vijiti vya Uvuvi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Rod Length", "Action"]	492c7799-7cc8-482d-888f-cc1c18295c7b
fcd87ac0-824e-4327-8fe4-b409f6ba0987	2026-08-25 14:41:46.980173+00	Fishing Reels	Reeli za Uvuvi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Rod Length", "Action"]	492c7799-7cc8-482d-888f-cc1c18295c7b
67506148-82f6-46a0-8df6-f8f0f18d4e54	2026-08-25 14:41:46.980173+00	Safety Goggles	Miwani ya Usalama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Impact Standard", "Anti-fog"]	1bfee79b-5b4d-4f55-b3c1-74160c87e10d
c9404e0e-6e1d-4048-a407-8d3ce7672cd3	2026-08-25 14:41:46.980173+00	Tactical Glasses	Miwani ya Kivita	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Impact Standard", "Ventilation"]	1bfee79b-5b4d-4f55-b3c1-74160c87e10d
feca3870-de1a-4e06-bfe6-7e14095006ec	2026-08-25 14:41:46.980173+00	Swimming Goggles	Miwani ya Kuogelea	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Anti-fog", "Adjustable Strap"]	1bfee79b-5b4d-4f55-b3c1-74160c87e10d
9b3ad72c-4ab1-4e40-8898-fdb7ce31a050	2026-08-25 14:41:46.980173+00	Kids Character Costumes	Mavazi ya Wahusika wa Watoto	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Theme", "Material Safety"]	203c11c6-642c-493a-9e0d-46472261fb4e
d982f5e1-7fd6-4a63-ba05-724893a619a2	2026-08-25 14:41:46.980173+00	Seasonal Outfits	Mavazi ya Msimu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Theme", "Fastening Type"]	203c11c6-642c-493a-9e0d-46472261fb4e
99c62257-fefb-4318-92cc-a9417ddb7b30	2026-08-25 14:41:46.980173+00	Cosplay Gear	Vifaa vya Cosplay	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Theme", "Character"]	203c11c6-642c-493a-9e0d-46472261fb4e
aa92c4e9-dd82-4b79-bc45-af6c2a8b20cd	2026-08-25 14:41:46.980173+00	VR/AR Accessories	Vifaa vya VR/AR	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Connectivity", "Battery"]	01f747fc-e08b-403d-b9cd-58e4dc06ce4a
4f8bb42b-2e57-4e93-8892-0458a255de1b	2026-08-25 14:41:46.980173+00	Haptics	Haptiki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Haptic Levels", "Sensor Precision"]	01f747fc-e08b-403d-b9cd-58e4dc06ce4a
7f018b78-26e7-4a88-9f11-a31c7ba5803c	2026-08-25 14:41:46.980173+00	Soccer Kits	Seti za Soka	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Type", "Customization"]	05483a18-d3d2-4e67-99ea-b4ab83413798
4152ae31-ab51-462f-96b4-1890dce02b78	2026-08-25 14:41:46.980173+00	Football Kits	Seti za Mpira wa Miguu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Type", "Customization"]	05483a18-d3d2-4e67-99ea-b4ab83413798
2b42975d-5f3b-40b0-aa70-8df7d2976448	2026-08-25 14:41:46.980173+00	Air Hoses	Mifereji ya Hewa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hose Material", "Length"]	13ea3946-4159-40a9-83a4-bf51725d6478
96e8a941-ba46-42fb-9d66-1e98eab66fde	2026-08-25 14:41:46.980173+00	Quick Couplers	Viunganishi vya Haraka	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Coupler Type", "Material"]	13ea3946-4159-40a9-83a4-bf51725d6478
6b5866b9-6873-46bd-adc0-667ce45bf3b4	2026-08-25 14:41:46.980173+00	Filters (Pneumatic)	Vichujio (Hewa)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Filtration Grade", "Size"]	13ea3946-4159-40a9-83a4-bf51725d6478
aad51e43-7f32-4a01-b251-f213914a1a43	2026-08-25 14:41:46.980173+00	Lubricators (Pneumatic)	Vilainishi (Hewa)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Auto-drain"]	13ea3946-4159-40a9-83a4-bf51725d6478
0d127b2d-8d21-4a9d-a501-589a237070dd	2026-08-25 14:41:46.980173+00	DVR Recording Units	Vitengo vya Kurekodi vya DVR	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Channel Count", "Storage"]	5d2ee588-12f9-4422-a79c-e8356e733c52
b7d709c8-f31a-404f-81e0-681d622b3e20	2026-08-25 14:41:46.980173+00	NVR Recording Units	Vitengo vya Kurekodi vya NVR	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Channel Count", "Storage"]	5d2ee588-12f9-4422-a79c-e8356e733c52
dc334fd6-2599-420e-9c5c-ab23cf300dbc	2026-08-25 14:41:46.980173+00	XVR Recording Units	Vitengo vya Kurekodi vya XVR	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Channel Count", "Storage"]	5d2ee588-12f9-4422-a79c-e8356e733c52
6fcbd4f6-982a-4db4-bb2b-d13b6ed80a7d	2026-08-25 14:41:46.980173+00	Engagement Rings	Pete za Uchumba	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Ring Size", "Main Stone"]	05d8790e-8857-4b20-803d-b45f350d5670
ca5148e6-c8cc-421d-a6c3-25a10ba23a5f	2026-08-25 14:41:46.980173+00	Wedding Bands	Pete za Harusi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Ring Size", "Band Width"]	05d8790e-8857-4b20-803d-b45f350d5670
8d8e1d2c-deb2-4a8e-b9b2-a7a63204dbfd	2026-08-25 14:41:46.980173+00	Statement Rings	Pete za Kuelezea	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Ring Size", "Plating"]	05d8790e-8857-4b20-803d-b45f350d5670
65d5b3e7-dda6-42e0-9dc7-ec4751f04d52	2026-08-25 14:41:46.980173+00	Jewelry Armoires	Makabati ya Vito	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Storage Capacity", "Lock Type"]	25995318-792a-4dd8-ae68-4961a50ae6c3
deb0e055-9561-4d56-8635-8a807f083112	2026-08-25 14:41:46.980173+00	Stackable Trays	Treya za Kukunjamana	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Stackable", "Material"]	25995318-792a-4dd8-ae68-4961a50ae6c3
053db845-cf5f-4a49-b069-71906cf2ee0a	2026-08-25 14:41:46.980173+00	Jewelry Safe Boxes	Sanduku za Salama za Vito	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Lock Type", "Capacity"]	25995318-792a-4dd8-ae68-4961a50ae6c3
74b244bb-c2d1-440b-9c43-42dc9a3615ab	2026-08-25 14:41:46.980173+00	Speaker Stands	Vimeo vya Spika	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Max Load", "Height Adjustable"]	05f2dcbc-2b6f-4691-909a-8910d70bb636
83b66477-3ce2-4037-92a5-f1bb14140ba9	2026-08-25 14:41:46.980173+00	Wall Mounts (Speakers)	Vipachiki vya Ukutani (Spika)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Max Load", "Material"]	05f2dcbc-2b6f-4691-909a-8910d70bb636
78277688-79bb-4f14-b7a7-0baf4a21f7b8	2026-08-25 14:41:46.980173+00	Hoodies	Hoodi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Thickness", "Hooded"]	f8a70e64-b80e-4482-96a7-a11d116134bf
76452ec3-7ec4-45bb-9e64-32a5b5627d18	2026-08-25 14:41:46.980173+00	Sweaters	Sweta	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Collar"]	f8a70e64-b80e-4482-96a7-a11d116134bf
3e2cd855-6d6f-46dc-a670-ce16c23088dd	2026-08-25 14:41:46.980173+00	Used Smart TVs	Televisheni Mahiri Zilizotumika	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Screen Burn", "Accessories"]	48d8c013-5cea-4d9a-a377-4b0100dde339
d9da9b4d-2f98-4cac-8dbd-e1e4d1491c7c	2026-08-25 14:41:46.980173+00	PlayStations	PlayStations	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Accessories", "Software"]	48d8c013-5cea-4d9a-a377-4b0100dde339
fbedffae-9cd8-43ba-92a7-76570be207cb	2026-08-25 14:41:46.980173+00	Xbox	Xbox	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Accessories", "Software"]	48d8c013-5cea-4d9a-a377-4b0100dde339
9b169f2e-bf9e-4c1b-ab46-bc51439bf8c4	2026-08-25 14:41:46.980173+00	Home Theaters (Used)	Home Theaters (Zilizotumika)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Accessories", "Original Box"]	48d8c013-5cea-4d9a-a377-4b0100dde339
89b62278-27d2-4ea6-9c0f-cb948224675d	2026-08-25 14:41:46.980173+00	Skin Care Machines	Mashine za Kutunza Ngozi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Power", "Technology"]	81de2f1d-6f89-4aff-99ba-e10849f40295
45361940-f758-4d33-a551-82710a9b74fd	2026-08-25 14:41:46.980173+00	Facial Machines	Mashine za Uso	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Function", "Voltage"]	81de2f1d-6f89-4aff-99ba-e10849f40295
0d43a6a4-57b6-4008-83d1-80f3e53373ca	2026-08-25 14:41:46.980173+00	Hair Styling Tools	Zana za Kutengeneza Nywele	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Power", "Max Temp"]	42b57ced-c1af-4ad9-8248-90044163d44f
b493ba7f-f13f-428a-a0d3-78adb085c0f1	2026-08-25 14:41:46.980173+00	Frame Scaffolding	Kiunzi cha Fremu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Working Height", "Platform"]	560775e5-ad04-404d-9939-16f9a38ea423
5788d2e8-b40c-4c5e-92ef-e628535ca492	2026-08-25 14:41:46.980173+00	Ringlock	Ringlock	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Working Height", "Safety"]	560775e5-ad04-404d-9939-16f9a38ea423
b5d0e4ae-867a-4b93-9945-876e8f827fe5	2026-08-25 14:41:46.980173+00	Mobile Towers	Minara ya Rununu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Mobility", "Safety Railing"]	560775e5-ad04-404d-9939-16f9a38ea423
69cdaa3a-1ce7-40d2-8f48-3dd34c066b63	2026-08-25 14:41:46.980173+00	Disposable Plates	Sahani za Kutupilia Mbali	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Pack Size"]	152c4f80-76ce-43b9-b588-69f6994cdd6c
4e23f376-fbff-4379-95c4-32309fb9b233	2026-08-25 14:41:46.980173+00	Disposable Cups	Vikombe vya Kutupilia Mbali	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Pack Size"]	152c4f80-76ce-43b9-b588-69f6994cdd6c
13d5a991-aa5a-4c27-9220-7d8ad7e80711	2026-08-25 14:41:46.980173+00	Disposable Napkins	Napkin za Kutupilia Mbali	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Color"]	152c4f80-76ce-43b9-b588-69f6994cdd6c
0918fb6c-8f35-457b-9c0d-196e636e2651	2026-08-25 14:41:46.980173+00	Disposable Tablecloths	Vitambaa vya Meza vya Kutupilia Mbali	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Dimensions"]	152c4f80-76ce-43b9-b588-69f6994cdd6c
703330c5-2538-465b-880c-f591d2e81a91	2026-08-25 14:41:46.980173+00	Charm Bracelets	Banglesi za Charm	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bracelet Type", "Closure"]	05d8790e-8857-4b20-803d-b45f350d5670
0a8d1427-b34f-4921-87a3-f79bfa5719e4	2026-08-25 14:41:46.980173+00	Cuffs	Vikufu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bracelet Type", "Finish"]	05d8790e-8857-4b20-803d-b45f350d5670
ad8bd859-8fa8-4bd7-8919-6bd5d6018810	2026-08-25 14:41:46.980173+00	Tennis Bracelets	Banglesi za Tenisi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bracelet Type", "Ornamental"]	05d8790e-8857-4b20-803d-b45f350d5670
6a696642-49e9-40a7-b765-6eeb97a65bb8	2026-08-25 14:41:46.980173+00	Bangles	Bangili	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bracelet Type", "Ornamental"]	05d8790e-8857-4b20-803d-b45f350d5670
822c8ab6-4c0c-494d-be70-8ebcf4cde59b	2026-08-25 14:41:46.980173+00	Pet Carriers	Vibebeo vya Wanyama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Carrier Type", "Max Weight"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
f70c9fc4-4445-4644-8c2b-60603cfab81c	2026-08-25 14:41:46.980173+00	Pet Travel Bags	Mifuko ya Kusafiria ya Wanyama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Carrier Type", "Ventilation"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
c0f23d4a-47d6-467c-9480-32207d46ed96	2026-08-25 14:41:46.980173+00	De-shedding Brushes	Bureta za Kumwaga Nywele	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Brush Bristle Type", "Size"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
dd46565d-56d4-4d65-be4e-8516b97b533f	2026-08-25 14:41:46.980173+00	Bag Feet	Nyayo za Mfuko	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Foot Style", "Material"]	0ffa648f-d279-441d-aca8-00771a729752
4b9f3a9a-1d21-4a38-9269-1892e6f7b752	2026-08-25 14:41:46.980173+00	Twist Locks	Kufuli za Kugeuza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Lock Mechanism", "Material"]	0ffa648f-d279-441d-aca8-00771a729752
6c6444d6-24fd-484a-85d1-cd033cb3f11b	2026-08-25 14:41:46.980173+00	Magnetic Snaps	Vifungo vya Magnetic	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Lock Mechanism", "Material"]	0ffa648f-d279-441d-aca8-00771a729752
172b0f03-64e2-4d68-806d-4e44cca79600	2026-08-25 14:41:46.980173+00	Bag Linings	Vifuniko vya Ndani vya Mfuko	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Type", "Material"]	0ffa648f-d279-441d-aca8-00771a729752
e13f9691-3143-45ab-9be1-16aef6eda085	2026-08-25 14:41:46.980173+00	Ex-UK Laptops	Laptops za Ex-UK	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Processor", "Storage"]	48d8c013-5cea-4d9a-a377-4b0100dde339
ca6599f8-547f-4d35-ac04-8d021c6259f2	2026-08-25 14:41:46.980173+00	Ex-US Laptops	Laptops za Ex-US	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Processor", "Storage"]	48d8c013-5cea-4d9a-a377-4b0100dde339
0ef2c399-acfe-4608-b194-b4f6c2bc81fe	2026-08-25 14:41:46.980173+00	MacBooks	MacBooks	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Processor", "Storage"]	48d8c013-5cea-4d9a-a377-4b0100dde339
cf55b5a8-bc19-4184-81d0-903e247e35f9	2026-08-25 14:41:46.980173+00	PC Towers	Minara ya PC	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Processor", "RAM"]	48d8c013-5cea-4d9a-a377-4b0100dde339
d19eb7b2-7fce-48be-b0c5-44aa8f4df312	2026-08-25 14:41:46.980173+00	Hologram Stickers	Vibandiko vya Hologramu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Security Features", "Effect"]	01a355e3-cb69-4001-abfa-1b2e874aec30
3a32a707-c21d-4eba-8b37-9e84c059bf85	2026-08-25 14:41:46.980173+00	Security Stickers	Vibandiko vya Usalama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Security Features", "Tamper"]	01a355e3-cb69-4001-abfa-1b2e874aec30
3ff809a2-9778-40f6-9960-feb0f58ea1cd	2026-08-25 14:41:46.980173+00	Zipu (Zippers - Women)	Zipu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Urefu", "Material"]	f8a70e64-b80e-4482-96a7-a11d116134bf
2f8af637-ba49-4d55-a63c-f53966ca11d7	2026-08-25 14:41:46.980173+00	Formal Trousers	Suruali Rasmi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Waist Size", "Fabric"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
8c69d142-2657-41b8-8370-a2cefb66a26d	2026-08-25 14:41:46.980173+00	Retractable Leashes	Kamba za Kujirudisha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Length", "Grip Type"]	3dcc4947-370a-4d5c-b62c-5402ac79767a
23fc9e18-a52c-4932-8775-3ee07d1297d3	2026-08-25 14:41:46.980173+00	Training Leashes	Kamba za Mazoezi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Length", "Handle"]	3dcc4947-370a-4d5c-b62c-5402ac79767a
7a3600d5-a1e0-4a14-bd2c-ae1db9855fa3	2026-08-25 14:41:46.980173+00	Double-handle Leashes	Kamba za Kipini-mbili	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Length", "Handle"]	3dcc4947-370a-4d5c-b62c-5402ac79767a
ffcda25b-8c19-4a44-a436-bbc1d1640a0d	2026-08-25 14:41:46.980173+00	Permanent Markers	Alama za Kukaa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tip Style", "Ink Type"]	2a254b33-d89a-4d57-b00d-407b471313f4
5da1255a-8f1e-4255-b6eb-e04ea0e5a96d	2026-08-25 14:41:46.980173+00	Whiteboard Markers	Alama za Ubao Mweupe	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tip Style", "Surface"]	2a254b33-d89a-4d57-b00d-407b471313f4
16d646cc-d0e2-4ab4-80f0-0ab24d257c9e	2026-08-25 14:41:46.980173+00	Highlighters	Vivutia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tip Style", "Color"]	2a254b33-d89a-4d57-b00d-407b471313f4
954ee943-be59-4533-8720-ac6a711ef1f1	2026-08-25 14:41:46.980173+00	Webbing Slings	Kombeo za Kufuma	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Breaking Strength", "Material"]	4c24d053-6fdc-4c8d-af8a-b00705651bb5
fd1817b5-a3c3-43b9-b064-c2c9f2ccb19b	2026-08-25 14:41:46.980173+00	Cargo Straps	Mikanda ya Mizigo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Breaking Strength", "Material"]	4c24d053-6fdc-4c8d-af8a-b00705651bb5
e1f57f62-1960-4880-a4c6-4668f3e6c5ec	2026-08-25 14:41:46.980173+00	Steel Wire Ropes	Kamba za Waya wa Chuma	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Breaking Strength", "Length"]	4c24d053-6fdc-4c8d-af8a-b00705651bb5
389df155-efb0-42f3-81c9-c7b9bc3c45ca	2026-08-25 14:41:46.980173+00	Chain Sprays	Dawa za Mnyororo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Application", "Flash Point"]	41450749-58b2-4ff0-89fb-a64098200b58
07ad9283-6501-4370-8220-fa59dbd857d8	2026-08-25 14:41:46.980173+00	Penetrating Oils (WD-40)	Mafuta ya Kukenya (WD-40)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Application", "Rust Protection"]	41450749-58b2-4ff0-89fb-a64098200b58
9692fc58-9700-49fb-9507-304e25ea5d18	2026-08-25 14:41:46.980173+00	Fuel Additives	Viongeza Mafuta	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Application", "Dielectric Strength"]	41450749-58b2-4ff0-89fb-a64098200b58
a72aa6b6-ad18-44bd-855b-ddc1953d9e2d	2026-08-25 14:41:46.980173+00	Bouncy Castles	Ngome za Kurukaruka	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Blower Power"]	459db7a1-7be5-46d4-9c6d-6bbb3c7df31a
c613984f-e6bf-491f-b37d-0d78167af60d	2026-08-25 14:41:46.980173+00	Water Slides	Slide za Maji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Setup Time"]	459db7a1-7be5-46d4-9c6d-6bbb3c7df31a
3304c3a1-9010-4e36-8367-cfba79f80665	2026-08-25 14:41:46.980173+00	Inflatable Obstacles	Vikwazo vya Kuvimba	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Setup Time"]	459db7a1-7be5-46d4-9c6d-6bbb3c7df31a
4f695828-e4c7-4234-87ba-42c0e8d4535e	2026-08-25 14:41:46.980173+00	Custom Acrylic Boxes	Sanduku za Akriliki Maalum	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material Thickness", "Cutting Method"]	563747dc-1890-4b53-b859-d34abf12ba33
8194182e-cfa4-4fa2-99d7-97b8b8e431b6	2026-08-25 14:41:46.980173+00	Trophies	Nyara	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Cutting Method"]	563747dc-1890-4b53-b859-d34abf12ba33
6e688646-c0a8-4c95-92a3-cce2c09529f0	2026-08-25 14:41:46.980173+00	Signage	Alama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Cutting Method"]	563747dc-1890-4b53-b859-d34abf12ba33
6bff7c3f-de52-4dd2-b27b-b0586a312a1b	2026-08-25 14:41:46.980173+00	Mens Belts	Mikanda ya Wanaume	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Buckle Type"]	5ea5bdcb-3784-4225-86b7-04cd42e1cd5c
fcba3727-0898-4dda-a21f-0ff781bdab79	2026-08-25 14:41:46.980173+00	Womens Belts	Mikanda ya Wanawake	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Buckle Type"]	5ea5bdcb-3784-4225-86b7-04cd42e1cd5c
24cd1a6f-e6af-43f6-8898-4c46ac4db096	2026-08-25 14:41:46.980173+00	Mens Wallets	Pochi za Wanaume	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Wallet Style", "RFID"]	5ea5bdcb-3784-4225-86b7-04cd42e1cd5c
a8889ebe-2a75-43a9-b71e-072bff6d2da9	2026-08-25 14:41:46.980173+00	Womens Wallets	Pochi za Wanawake	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Wallet Style", "RFID"]	5ea5bdcb-3784-4225-86b7-04cd42e1cd5c
b9831159-f569-42c7-a56c-6ac0d78aab0f	2026-08-25 14:41:46.980173+00	Packaging Labels	Lebulu za Ufungaji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sticker Shape", "Printing"]	01a355e3-cb69-4001-abfa-1b2e874aec30
998a1439-5601-4f8f-a19c-d864693acb83	2026-08-25 14:41:46.980173+00	Barcode Stickers	Vibandiko vya Barcode	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sticker Shape", "Base Material"]	01a355e3-cb69-4001-abfa-1b2e874aec30
2fc3f1f4-8392-4672-ae54-abe0a1b1ba1b	2026-08-25 14:41:46.980173+00	Name Tags	Tagio za Majina	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sticker Shape", "Writable"]	01a355e3-cb69-4001-abfa-1b2e874aec30
33ab1b93-9c91-42c1-98b1-6b82d309ff8d	2026-08-25 14:41:46.980173+00	Contact Lenses	Lenzi za Kusaidiana	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Lens Duration", "Lens Type"]	1bfee79b-5b4d-4f55-b3c1-74160c87e10d
1c369446-604b-4f54-b6c6-413f54287978	2026-08-25 14:41:46.980173+00	Solution Kits	Kiti za Mmumunyo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Solution Volume", "Type"]	1bfee79b-5b4d-4f55-b3c1-74160c87e10d
3a6a02b8-4fe3-4031-a3c5-52c0c837a200	2026-08-25 14:41:46.980173+00	Fingerprint Readers (Security)	Visoma Alama za Vidole (Usalama)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Authentication", "Capacity"]	50e461cd-b484-42d0-8537-62e303f62be2
26721423-a18e-4281-a8ab-2f40881fb67a	2026-08-25 14:41:46.980173+00	Face Recognition Readers (Security)	Visoma Kutambua Uso (Usalama)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Authentication", "Capacity"]	50e461cd-b484-42d0-8537-62e303f62be2
ef30cfca-e4ed-4b80-a491-9f77c9efd3f7	2026-08-25 14:41:46.980173+00	RFID Card Readers (Security)	Visoma Kadi za RFID (Usalama)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Authentication", "Interface"]	50e461cd-b484-42d0-8537-62e303f62be2
efa756d6-5f2d-43b6-94b0-d97effa01254	2026-08-25 14:41:46.980173+00	Plate Compactors	Vikamua Bati	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Impact Force", "Mobility"]	22f45154-af3e-490f-983f-73a2a71920f2
5969b283-85c7-42d2-9a6e-7847f5b32900	2026-08-25 14:41:46.980173+00	Jackhammers	Nyundo za Jack	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Blows per Minute", "Noise"]	22f45154-af3e-490f-983f-73a2a71920f2
935085b4-3266-49b8-a291-7206fc92a833	2026-08-25 14:41:46.980173+00	Generators	Jenereta	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Output", "Mobility"]	22f45154-af3e-490f-983f-73a2a71920f2
26d6d06a-a1bb-4a26-9cb4-b528505cf0aa	2026-08-25 14:41:46.980173+00	Air Compressors (Industrial)	Kampressa za Hewa (Viwandani)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tank Capacity", "Mobility"]	22f45154-af3e-490f-983f-73a2a71920f2
a3d97bc9-4565-4f06-ba5d-c7f4ba416b08	2026-08-25 14:41:46.980173+00	Zipu (Zippers - Garment)	Zipu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Urefu", "Material"]	98cf7553-2641-480d-bf34-c518fdb942fc
8d830c5c-a957-41b6-9a30-3e879c7ba935	2026-08-25 14:41:46.980173+00	TIG Welding	Uchomeleaji wa TIG	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Welding Type", "Metal Grades"]	4a2fbcdb-1704-4d62-8bda-dea87354c397
2adfa008-f830-4fcd-a71b-9c593d81e8f8	2026-08-25 14:41:46.980173+00	MIG Welding	Uchomeleaji wa MIG	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Welding Type", "Metal Grades"]	4a2fbcdb-1704-4d62-8bda-dea87354c397
0233b581-7853-4177-912e-03f14cba86e3	2026-08-25 14:41:46.980173+00	Arc Welding	Uchomeleaji wa Tao	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Welding Type", "Metal Grades"]	4a2fbcdb-1704-4d62-8bda-dea87354c397
7101b98e-2d24-459a-8172-e6fd568531fd	2026-08-25 14:41:46.980173+00	Laser Welding	Uchomeleaji wa Laser	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Welding Type", "Metal Grades"]	4a2fbcdb-1704-4d62-8bda-dea87354c397
1c38f649-e470-47ea-9c87-64039594ab24	2026-08-25 14:42:09.212986+00	Rugby Shirts	Mashati ya Raga	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Reinforced Stitching", "Stretch Level"]	05483a18-d3d2-4e67-99ea-b4ab83413798
7466bb77-ae49-43cb-a18e-49881f5def8e	2026-08-25 14:42:09.212986+00	Volleyball Sets	Seti za Voliboli	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Stretch Level", "Material"]	05483a18-d3d2-4e67-99ea-b4ab83413798
aa963cee-c00a-4518-ad6c-a0edff04aff8	2026-08-25 14:42:09.212986+00	Tracksuits (Sports)	Tracksuiti (Michezo)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Jacket Closure"]	05483a18-d3d2-4e67-99ea-b4ab83413798
76c0f294-dbb7-4523-8278-2a9280990c6b	2026-08-25 14:42:09.212986+00	Reflective Lanyards	Kamba za Kuakisi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Special Feature", "Wrist vs Neck"]	5c5ced8a-8fc1-4130-abe3-bb9f0f89f25c
e7a28907-1b42-441a-8891-778999e03337	2026-08-25 14:42:09.212986+00	Eco-friendly Lanyards	Kamba Rafiki wa Mazingira	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Special Feature", "Material"]	5c5ced8a-8fc1-4130-abe3-bb9f0f89f25c
6d809961-7833-4ef4-8147-b3d3f7bf527a	2026-08-25 14:42:09.212986+00	Wrist Lanyards	Kamba za Kifundo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Special Feature", "Wrist vs Neck"]	5c5ced8a-8fc1-4130-abe3-bb9f0f89f25c
f8e8f113-7042-4369-8612-9b9de6b38ae6	2026-08-25 14:42:09.212986+00	Custom Die-Cut Stickers	Vibandiko Maalum vya Kukata Kwa Umbo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cutting Accuracy", "Lamination"]	01a355e3-cb69-4001-abfa-1b2e874aec30
61e71e1a-656d-4860-8534-913e7a32e88d	2026-08-25 14:42:09.212986+00	Jackets	Jaketi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Outerwear Type", "Filling Material"]	f8a70e64-b80e-4482-96a7-a11d116134bf
d303bc92-9a9a-4fcc-b393-0dcb95c0acbf	2026-08-25 14:42:09.212986+00	Coats	Koti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Outerwear Type", "Closure Type"]	f8a70e64-b80e-4482-96a7-a11d116134bf
5b859f42-6436-405b-aa9c-de37bf4825f4	2026-08-25 14:42:09.212986+00	Alloy Rims	Magurudumu ya Aloi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Rim Diameter", "Bolt Pattern"]	554769e5-2049-4f32-b9b9-b212525a38d8
76cce731-2e3e-4573-aa74-59986d2415fb	2026-08-25 14:42:09.212986+00	Steel Wheels	Magurudumu ya Chuma	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Rim Diameter", "Material"]	554769e5-2049-4f32-b9b9-b212525a38d8
d8611527-219b-4f77-8e70-b7035c443f6b	2026-08-25 14:42:09.212986+00	Decorative Hubcaps	Vifuniko vya Mapambo vya Gurudumu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Rim Diameter", "Finish"]	554769e5-2049-4f32-b9b9-b212525a38d8
4b9f5bf5-fdbe-4b53-bb27-569172f780df	2026-08-25 14:42:09.212986+00	Manual Toothbrushes	Mswaki wa Kawaida	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bristle Softness", "Material"]	41195db4-dd21-4394-bb83-e3560085aea2
a5b373c6-5072-459d-befc-cf11b4015691	2026-08-25 14:42:09.212986+00	Electric Toothbrushes	Mswaki wa Umeme	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Power Source", "Timer Function"]	41195db4-dd21-4394-bb83-e3560085aea2
85f68a35-d666-4a12-afc6-d113eecdf128	2026-08-25 14:42:09.212986+00	Android Head Units	Vichwa vya Android	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Screen Size", "OS"]	1bdeda97-c87a-4f8d-bd7e-b3c7c3b1ee8e
7a4c4a0e-1eff-4c81-b9a1-ce8d399d6c23	2026-08-25 14:42:09.212986+00	Car Stereos	Stereo za Gari	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Output Power", "Bluetooth"]	1bdeda97-c87a-4f8d-bd7e-b3c7c3b1ee8e
aabf7186-8904-487f-b59b-7336e2bcb6ea	2026-08-25 14:42:09.212986+00	Car Speakers	Spika za Gari	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Output Power", "Size"]	1bdeda97-c87a-4f8d-bd7e-b3c7c3b1ee8e
17c38776-6715-4df0-bb3e-78c001d2a297	2026-08-25 14:42:09.212986+00	Subwoofers	Subwoofa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Output Power", "Size"]	1bdeda97-c87a-4f8d-bd7e-b3c7c3b1ee8e
4809a6b0-6391-4a04-837e-2c71528e9c31	2026-08-25 14:42:09.212986+00	Wedding Gowns	Mavazi ya Harusi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Silhouette", "Neckline"]	26a63525-d6e3-47d3-aa76-d2f653115921
122fe381-4f12-4b98-866d-9e7ee827b7fc	2026-08-25 14:42:09.212986+00	Send-off Dresses	Mavazi ya Kuaga	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Silhouette", "Train Length"]	26a63525-d6e3-47d3-aa76-d2f653115921
04655278-1af4-4f37-bfcf-c18fa5f90ad9	2026-08-25 14:42:09.212986+00	Kitchen Party Dresses	Mavazi ya Karamu ya Jikoni	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Silhouette", "Embellishments"]	26a63525-d6e3-47d3-aa76-d2f653115921
3a1f5d0a-9b5b-4877-b200-38fc3264b4b5	2026-08-25 14:42:09.212986+00	OBD2 Scanners	Skena za OBD2	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Protocol Compatibility", "Connectivity"]	5c3f59e8-0b37-4856-a63e-91fe3a8ff147
2e29abf2-8cae-416c-9601-e4b95b2a9a68	2026-08-25 14:42:09.212986+00	Multimeters (Auto)	Multimita (Gari)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Screen Type", "Vehicle System Coverage"]	5c3f59e8-0b37-4856-a63e-91fe3a8ff147
8777e43a-2858-4377-b4d3-66b9cb44df92	2026-08-25 14:42:09.212986+00	Battery Testers	Vipimaji Betri	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Screen Type", "Vehicle System Coverage"]	5c3f59e8-0b37-4856-a63e-91fe3a8ff147
443bad5e-117e-4f8a-822e-6a49f92f10f5	2026-08-25 14:42:09.212986+00	Orthopedic Beds	Vitanda vya Mifupa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Fill Material"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
d505ae82-e811-4670-83be-fc6c4b7e4585	2026-08-25 14:42:09.212986+00	Calming Mats	Mikeka ya Kutuliza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Cover Material"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
d004150e-c314-4835-bb4e-3936a354c997	2026-08-25 14:42:09.212986+00	Pet Blankets	Mablanketi ya Wanyama	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Cover Material"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
44011b18-93ef-4431-b1d4-41f9d9128a26	2026-08-25 14:42:09.212986+00	Team Training Tracksuits	Tracksuit za Mazoezi ya Timu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Closure Type"]	05483a18-d3d2-4e67-99ea-b4ab83413798
8896b747-6607-4131-8c31-6f203513672b	2026-08-25 14:42:09.212986+00	Hoodies (Men)	Hoodi (Wanaume)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
f763e41c-c74a-4959-be8b-da7814f8d8d9	2026-08-25 14:42:09.212986+00	Sweatshirts	Sweshati	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Hood Type"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
8fdcfbc7-d75b-4136-9db5-549cb2ab33ca	2026-08-25 14:42:09.212986+00	Thermal Transfer Labels	Lebulu za Uhamisho wa Joto	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Label Format", "Compatibility"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
fec0eeb7-9cff-4e1b-a91c-c3796270c112	2026-08-25 14:42:09.212986+00	Barcode Stickers (Thermal)	Vibandiko vya Barcode (Joto)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Label Format", "Weather Resistance"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
863047c6-9d72-4c9b-81f7-4eef7e23ccaa	2026-08-25 14:42:09.212986+00	Fragile Stickers	Vibandiko vya Kukatika	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Label Format", "Weather Resistance"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
3c46b21f-c8ef-44ae-b17b-e774ea27f860	2026-08-25 14:42:09.212986+00	Oxford Shoes	Viatu vya Oxford	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Closure Type"]	09e5cf4e-93af-436f-bde4-b158c8671e23
3c419697-891e-4f1e-8ab2-a8a23b6c6b1f	2026-08-25 14:42:09.212986+00	Derby Shoes	Viatu vya Derby	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Toe Shape"]	09e5cf4e-93af-436f-bde4-b158c8671e23
dcfd685e-ce72-4e64-83da-f0c39ae651b0	2026-08-25 14:42:09.212986+00	Loafers	Viatu vya Loafa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Closure Type"]	09e5cf4e-93af-436f-bde4-b158c8671e23
dc6d9551-0883-430b-bc58-ec907a3a5ba0	2026-08-25 14:42:09.212986+00	Monk Straps	Mikanda ya Monaki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Closure Type"]	09e5cf4e-93af-436f-bde4-b158c8671e23
2a127f2d-efd3-4293-aaea-ab0186fb4d24	2026-08-25 14:42:09.212986+00	Garden Hoses	Mifereji ya Bustani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hose Length", "Pressure Rating"]	43b79475-733c-499d-a2dc-f06fa528d3ba
210ff89f-0963-47d5-bcf9-a582120ed0e2	2026-08-25 14:42:09.212986+00	Sprinklers	Vinyunyizio	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Spray Patterns", "Material"]	43b79475-733c-499d-a2dc-f06fa528d3ba
2f61cece-4c83-48cb-b1c4-a99c714ca0e0	2026-08-25 14:42:09.212986+00	Watering Cans	Makanza ya Kumwagilia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Connector"]	43b79475-733c-499d-a2dc-f06fa528d3ba
b6c44e9d-df6d-4135-a438-f5085a322711	2026-08-25 14:42:09.212986+00	Tomatoes	Nyanya	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Ripeness Level", "Unit of Sale"]	63af60ac-b592-4d49-acea-4b75a0ae4908
c9620bbc-c428-4c30-a62d-9c7286e36a3f	2026-08-25 14:42:09.212986+00	Peppers	Pilipili	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Ripeness Level", "Color Variety"]	63af60ac-b592-4d49-acea-4b75a0ae4908
7056242c-8de0-4f3e-9929-dab116f7dbc7	2026-08-25 14:42:09.212986+00	Eggplants	Biringani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Ripeness Level", "Unit of Sale"]	63af60ac-b592-4d49-acea-4b75a0ae4908
049f2ec6-51f4-4133-8f27-9ee99e0e021e	2026-08-25 14:42:09.212986+00	Chain Kits	Seti za Mnyororo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Compatibility", "Length"]	24790a5e-c1e6-4194-af24-c40951782cf9
95577384-4bee-44c4-9877-d0eed54f9e50	2026-08-25 14:42:09.212986+00	Spark Plugs (Bike)	Plagi za Mwale (Pikipiki)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Compatibility", "Engine Displacement"]	24790a5e-c1e6-4194-af24-c40951782cf9
8f7f8f78-e674-416b-81f9-a4e3107fbef9	2026-08-25 14:42:09.212986+00	Piston Sets	Seti za Pistoni	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Engine Displacement", "Material"]	24790a5e-c1e6-4194-af24-c40951782cf9
f62b6047-a58e-447a-9ae3-3f52571ad51e	2026-08-25 14:42:09.212986+00	Carburetors	Kabureta	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Compatibility", "Engine Displacement"]	24790a5e-c1e6-4194-af24-c40951782cf9
7c615821-27da-42c4-acde-7ed59a5d47e8	2026-08-25 14:42:09.212986+00	Confidential Security Envelopes	Bahasha za Usalama za Siri	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tamper-evident", "Serial Number"]	3e03e255-e6fa-4c3a-a9e8-0077f79d00bd
f3ad0faf-da5e-4fe3-988b-8665b0438535	2026-08-25 14:42:09.212986+00	Evidence Bags	Mifuko ya Ushahidi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tamper-evident", "Tear-resistant"]	3e03e255-e6fa-4c3a-a9e8-0077f79d00bd
aa6a12cf-8c87-491f-847a-261cc274b6bd	2026-08-25 14:42:09.212986+00	Outdoor Slides	Materemko ya Nje	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Age Group", "Frame Material"]	459db7a1-7be5-46d4-9c6d-6bbb3c7df31a
922366b5-3df2-4fb9-9789-28c12b6b0299	2026-08-25 14:42:09.212986+00	Swings	Swings	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Age Group", "Installation"]	459db7a1-7be5-46d4-9c6d-6bbb3c7df31a
05eb94b3-9f31-4ada-aa3e-76e983be3b95	2026-08-25 14:42:09.212986+00	Trampolines	Trampolini	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Age Group", "Frame Material"]	459db7a1-7be5-46d4-9c6d-6bbb3c7df31a
316e65cf-489f-457c-a6c7-a59928b4b0c0	2026-08-25 14:42:09.212986+00	Concrete Mixers	Vichanganya Zege	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Drum Capacity", "Power Source"]	22f45154-af3e-490f-983f-73a2a71920f2
7cfff7ec-f809-45b5-9693-05cca3f77114	2026-08-25 14:42:09.212986+00	Pavers	Vichimba	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Compaction Width", "Power Source"]	22f45154-af3e-490f-983f-73a2a71920f2
1857dfac-f9c2-4beb-a6bc-7e10260b7117	2026-08-25 14:42:09.212986+00	Road Rollers	Viringata Barabara	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Compaction Width", "Vibration Frequency"]	22f45154-af3e-490f-983f-73a2a71920f2
195d65b5-e1b8-4001-8663-ce8c73979cee	2026-08-25 14:42:09.212986+00	Concrete Pumps	Pampu za Zege	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Pumping Height", "Power Source"]	22f45154-af3e-490f-983f-73a2a71920f2
2afd082c-afae-47f0-a35b-bf677a2518ca	2026-08-25 14:42:09.212986+00	Leather Journals	Majeda ya Ngozi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cover Material", "Closure Style"]	3646a747-08ad-44cd-847b-f42ddbd1c9cc
5967bd21-2ed7-47b6-bc58-20997685dcae	2026-08-25 14:42:09.212986+00	Hardcover Diaries	Dairi za Kifungo ngumu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cover Material", "Paper Color"]	3646a747-08ad-44cd-847b-f42ddbd1c9cc
538534bd-57d2-4eaf-a613-f63e22798ed8	2026-08-25 14:42:09.212986+00	Bullet Journals	Majeda ya Rungu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Closure Style", "Special Features"]	3646a747-08ad-44cd-847b-f42ddbd1c9cc
fa630c53-d3d4-423e-9843-b639ea4522fc	2026-08-25 14:42:09.212986+00	Vifungo (Buttons - 2)	Vifungo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Aina"]	98cf7553-2641-480d-bf34-c518fdb942fc
0a8c0936-472e-4f77-83ce-7da476b9d08b	2026-08-25 14:42:09.212986+00	Oxy-Acetylene Torch Kits	Seti za Mwenge wa Oksiasetilini	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hose Length", "Nozzle Sizes"]	41c0b35d-9d6e-4f66-b256-1ab4946f6784
f35be529-71cb-4d3e-a333-80386710c4fe	2026-08-25 14:42:09.212986+00	Gas Welding Sets	Seti za Uchomeleaji kwa Gesi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Gas Compatibility", "Regulator"]	41c0b35d-9d6e-4f66-b256-1ab4946f6784
da7ab1f8-c989-438a-aabb-103c6ad0bb55	2026-08-25 14:42:09.212986+00	Basketball Jerseys (Team)	Jezi za Mpira wa Kikapu (Timu)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Weight", "Reversible"]	05483a18-d3d2-4e67-99ea-b4ab83413798
a79f1d6c-a40f-44b6-b2dc-315d3706eed4	2026-08-25 14:42:09.212986+00	Basketball Shorts (Team)	Kaptula za Mpira wa Kikapu (Timu)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Weight", "Sleeve Style"]	05483a18-d3d2-4e67-99ea-b4ab83413798
ccce9adf-b868-4318-b831-6ed4c9c5974f	2026-08-25 14:42:09.212986+00	Surveillance Hard Drives	Hifadhi Ngumu za Ufuatiliaji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Drive Type"]	5d2ee588-12f9-4422-a79c-e8356e733c52
9324f4b4-38ab-4e23-8068-15394550c021	2026-08-25 14:42:09.212986+00	Surveillance SD Cards	Kadi za SD za Ufuatiliaji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Read/Write Speed"]	5d2ee588-12f9-4422-a79c-e8356e733c52
cbbd6379-edca-401c-b532-f8a5a7cc3165	2026-08-25 14:42:09.212986+00	Waterproof Work Boots	Buti za Kazi za Kuzuia Maji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Boot Height", "Waterproofing"]	2de3c52b-926f-4540-abd0-5b1fe17dc927
e869dbdf-a15c-4cb1-8843-2c86dfc877d6	2026-08-25 14:42:09.212986+00	Chemical Resistant Gumboots	Buti za Kukinga Kemikali	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Boot Height", "Chemical Resistance"]	2de3c52b-926f-4540-abd0-5b1fe17dc927
fece7658-6a71-4949-8809-34bbe4713228	2026-08-25 14:42:09.212986+00	Solar Charge Controllers	Vidhibiti vya Chaji vya Jua	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Technology", "Max Charging Current"]	039161f1-24ec-4640-821a-ef5d7a6ba454
975215c3-5f97-498d-a521-daf9bb11f564	2026-08-25 14:42:09.212986+00	Arc Welding Services	Huduma za Uchomeleaji kwa Tao	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Welding Type", "Material Compatibility"]	3e2e59be-9d53-4983-9141-5701b266f319
6fe17b19-b7d5-480a-869a-e24089d99309	2026-08-25 14:42:09.212986+00	MIG Welding Services	Huduma za Uchomeleaji wa MIG	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Welding Type", "Material Compatibility"]	3e2e59be-9d53-4983-9141-5701b266f319
418e962a-30ee-4c0f-a6be-8d8dd565f766	2026-08-25 14:42:09.212986+00	TIG Welding Services	Huduma za Uchomeleaji wa TIG	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Welding Type", "Thickness Capacity"]	3e2e59be-9d53-4983-9141-5701b266f319
251bbcbb-006a-4aac-86a9-0c131c968ea5	2026-08-25 14:42:09.212986+00	Gas Welding Services	Huduma za Uchomeleaji kwa Gesi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Welding Type", "Mobile Service"]	3e2e59be-9d53-4983-9141-5701b266f319
488bdb11-c7e5-4d77-b7fd-09d24cc7f68b	2026-08-25 14:42:09.212986+00	Adjustable Work Platforms	Majukwaa ya Kazi Yanayoweza Kudhibitiwa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Surface Area", "Adjustable Height"]	560775e5-ad04-404d-9939-16f9a38ea423
698231dd-b5b3-475c-a6f2-5cbfa9a2afc6	2026-08-25 14:42:09.212986+00	Painter Trestles	Vitega vya Wakoroma	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Surface Area", "Non-slip"]	560775e5-ad04-404d-9939-16f9a38ea423
7bdef5bc-b53b-458a-91ca-01c1f15eb398	2026-08-25 14:42:09.212986+00	Stud Earrings	Vibano	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Earring Type", "Backing Type"]	05d8790e-8857-4b20-803d-b45f350d5670
cc2a9a8f-868f-4aab-830b-1deab6a6ff7f	2026-08-25 14:42:09.212986+00	Hoop Earrings	Pete za Kukunjamana	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Earring Type", "Style"]	05d8790e-8857-4b20-803d-b45f350d5670
400638c1-94da-4caa-bb17-8c22537a6971	2026-08-25 14:42:09.212986+00	Dangle Earrings	Pete za Kundelea	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Earring Type", "Gemstone Color"]	05d8790e-8857-4b20-803d-b45f350d5670
3513578c-4834-4592-b937-3b8555e18228	2026-08-25 14:42:09.212986+00	Drop Earrings	Pete za Kushuka	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Earring Type", "Style"]	05d8790e-8857-4b20-803d-b45f350d5670
03dbfd28-29ca-4b89-9c3e-a12c44a54930	2026-08-25 14:42:09.212986+00	3-Pin Plugs	Plagi za Pini 3	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Plug Type", "Fuse Rating"]	48daff56-14d6-4285-b003-de894dd6365d
b09ed14a-9461-4206-8365-b9048f6ab170	2026-08-25 14:42:09.212986+00	Travel Adapters	Adapta za Kusafiria	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Plug Type", "Voltage Rating"]	48daff56-14d6-4285-b003-de894dd6365d
bcf66a0e-a001-47b6-905b-435145b69522	2026-08-25 14:42:09.212986+00	Multi-plug Converters	Vigeuzi vya Plagi Nyingi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Plug Type", "Fuse Rating"]	48daff56-14d6-4285-b003-de894dd6365d
d030a973-e11c-4562-b606-5c5ce453d492	2026-08-25 14:42:09.212986+00	Artificial Christmas Trees	Miti Bandia ya Krismasi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tree Height", "Branch Tip Count"]	40b115bd-00c9-47e6-890e-89c215cb5b84
81e55cb8-55c1-45f8-b03d-046ee62f57f1	2026-08-25 14:42:09.212986+00	Baubles	Mapambo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Ornaments Included"]	40b115bd-00c9-47e6-890e-89c215cb5b84
d2c38c70-2ea6-4507-b73e-fe52a344f291	2026-08-25 14:42:09.212986+00	Tinsel	Tinsel	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Fire Retardant"]	40b115bd-00c9-47e6-890e-89c215cb5b84
6129a9c7-b9da-4502-8ec6-1728a04ce4a2	2026-08-25 14:42:09.212986+00	Correction Tape	Tepu ya Marekebisho	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Correction Type", "Refillable"]	2a254b33-d89a-4d57-b00d-407b471313f4
5767ebd7-2684-401d-b32f-8376b7a3caa8	2026-08-25 14:42:09.212986+00	Erasers	Raba	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Eraser Material", "Dust-free"]	2a254b33-d89a-4d57-b00d-407b471313f4
151f8231-44b8-4d36-b544-d6266f62d76c	2026-08-25 14:42:09.212986+00	Pencil Sharpeners	Vinoza Penseli	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sharpener Type", "Dust-free"]	2a254b33-d89a-4d57-b00d-407b471313f4
b62b5e5f-1c75-48ad-bc16-b22f5870ea87	2026-08-25 14:42:09.212986+00	Roll Labels	Lebulu za Roli	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Format", "Finish"]	01a355e3-cb69-4001-abfa-1b2e874aec30
fdea9bc9-8a35-4a73-af96-c67b02081ebf	2026-08-25 14:42:09.212986+00	Packaging Stickers	Vibandiko vya Ufungaji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Format", "Waterproof Level"]	01a355e3-cb69-4001-abfa-1b2e874aec30
34fffb2e-d064-46ee-90fd-71970aad14b2	2026-08-25 14:42:09.212986+00	Car Decals	Vibandiko vya Gari	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Adhesive Strength"]	01a355e3-cb69-4001-abfa-1b2e874aec30
cc1cc0b5-b981-4853-af0e-59e4e55b24a5	2026-08-25 14:42:09.212986+00	Motorcycle Graphics	Michoro ya Pikipiki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "UV Resistance"]	01a355e3-cb69-4001-abfa-1b2e874aec30
d9b587b3-44e9-46c3-b4c0-74ebfe85591c	2026-08-25 14:42:09.212986+00	Reflective Strips	Vipande vya Kuakisi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Weatherproof"]	01a355e3-cb69-4001-abfa-1b2e874aec30
401d4f49-30d7-4a0c-9e73-b3f5b229ab28	2026-08-25 14:42:09.212986+00	Organic Fertilizers	Mboji hai	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["NPK Ratio", "Application Form"]	43b79475-733c-499d-a2dc-f06fa528d3ba
e798c3cd-bca7-41a8-87c7-80cf7dfc5b89	2026-08-25 14:42:09.212986+00	Insecticides	Dawa za Wadudu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Application Form", "Target Pests"]	43b79475-733c-499d-a2dc-f06fa528d3ba
6461991a-b140-4cd7-92aa-dbed4e00b5eb	2026-08-25 14:42:09.212986+00	Weed Killers	Dawa za Magugu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Application Form", "Coverage Area"]	43b79475-733c-499d-a2dc-f06fa528d3ba
bc70893f-b73b-4748-931e-9622ca06b47a	2026-08-25 14:42:09.212986+00	Aluzinc Sheets	Mabati ya Aluzinki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Gauge", "Coating Type"]	223c9228-c75a-4833-b40d-99ce92c46725
a6e774c3-dbde-4919-ac5d-ee1154ec98d1	2026-08-25 14:42:09.212986+00	IT5 Sheets	Mabati ya IT5	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Gauge", "Profile Type"]	223c9228-c75a-4833-b40d-99ce92c46725
0c47382c-3d8a-4d9c-b06b-b15969296312	2026-08-25 14:42:09.212986+00	Versatile Sheets	Mabati ya Versatile	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Gauge", "Profile Type"]	223c9228-c75a-4833-b40d-99ce92c46725
1eb8430c-ff55-4211-aa7e-b2a3da5ac6e0	2026-08-25 14:42:09.212986+00	Corrugated Iron Sheets	Mabati ya Bati	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Gauge", "Coating Type"]	223c9228-c75a-4833-b40d-99ce92c46725
3bbe13f0-d23a-4c9b-ab55-9203ac7d4082	2026-08-25 14:42:09.212986+00	Passenger Tires	Matairi ya Abiria	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tire Size", "Season Type"]	554769e5-2049-4f32-b9b9-b212525a38d8
7120a188-9874-4334-bdeb-cfa66f100a5b	2026-08-25 14:42:09.212986+00	SUV Tires	Matairi ya SUV	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tire Size", "Season Type"]	554769e5-2049-4f32-b9b9-b212525a38d8
ebd1aa5a-b02e-46b0-b573-333574fae97e	2026-08-25 14:42:09.212986+00	Light Truck Tires	Matairi ya Lori Ndogo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tire Size", "Load Index"]	554769e5-2049-4f32-b9b9-b212525a38d8
a46e60e7-7c55-42df-aa5f-10b9c11cde57	2026-08-25 14:42:09.212986+00	Dog Leashes	Kamba za Mbwa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Leash Length", "Material"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
5d2ef58d-4840-4388-aa53-a61007340558	2026-08-25 14:42:09.212986+00	LED Collars (Pet)	Kola za LED (Wanyama)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Adjustable Circumference", "Closure Type"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
7124989e-bcb9-4b39-8027-2f54f8306d18	2026-08-25 14:42:09.212986+00	No-pull Harnesses (Pet)	Harusi zisizovuta (Wanyama)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Adjustable Circumference", "Closure Type"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
da52ba04-54b4-4257-a29f-9b159d2db093	2026-08-25 14:42:09.212986+00	Pruning Shears	Mikasi ya Kupogolea	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Blade Material", "Cutting Capacity"]	43b79475-733c-499d-a2dc-f06fa528d3ba
fb674c08-73f5-4b94-987f-f0436a97bc3d	2026-08-25 14:42:09.212986+00	Hedge Trimmers	Vinyoza Ua	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Blade Material", "Cutting Capacity"]	43b79475-733c-499d-a2dc-f06fa528d3ba
adcef5bf-d73b-49d2-9c9b-34b90c7eccf5	2026-08-25 14:42:09.212986+00	Garden Saws	Msumeno wa Bustani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Blade Material", "Telescopic"]	43b79475-733c-499d-a2dc-f06fa528d3ba
029b2357-c087-4ecb-8dea-c706a71f5349	2026-08-25 14:42:09.212986+00	Prescription-Ready Frames	Fremu za Maagizo ya Matibabu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Frame Type", "Hinge Type"]	1bfee79b-5b4d-4f55-b3c1-74160c87e10d
a3970ce8-b704-4a33-b137-be65bd5b954d	2026-08-25 14:42:09.212986+00	Reading Glasses	Miwani ya Kusoma	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Magnification Strength", "Blue Light Filter"]	1bfee79b-5b4d-4f55-b3c1-74160c87e10d
e28929bd-a1ba-44da-8888-0fd66c6967cc	2026-08-25 14:42:09.212986+00	Gold Chains	Minyororo ya Dhahabu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Chain Length", "Chain Style"]	3514bda2-4236-4e49-ae36-ed1a2f1fbaae
1d902629-f5c4-4be9-88f4-4ecf10c7436d	2026-08-25 14:42:09.212986+00	Pearl Necklaces	Mikufu ya Lulu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Pearl Grade", "Clasp Type"]	3514bda2-4236-4e49-ae36-ed1a2f1fbaae
fc4e2bca-d1fa-4283-a162-9ca9cdc8995a	2026-08-25 14:42:09.212986+00	Gemstone Pendants	Pendants za Vito	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Total Metal Weight", "Clasp Type"]	3514bda2-4236-4e49-ae36-ed1a2f1fbaae
0755034e-7d67-43d1-a48b-9678b9acc8ce	2026-08-25 14:42:09.212986+00	Power Strips	Vipandisha Umeme	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cable Length", "Number of Outlets"]	48daff56-14d6-4285-b003-de894dd6365d
522fbd86-b58d-45ed-936d-69d3ef837355	2026-08-25 14:42:09.212986+00	Surge Protectors	Vichungi vya Mwimwi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Surge Protection Rating", "Cable Length"]	48daff56-14d6-4285-b003-de894dd6365d
c565c7e9-8bf8-489c-8443-466f88693630	2026-08-25 14:42:09.212986+00	Cable Reels	Viringo vya Kebo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cable Length", "Number of Outlets"]	48daff56-14d6-4285-b003-de894dd6365d
3759d1da-951f-4e99-b8fc-a9aa3cbab2f3	2026-08-25 14:42:09.212986+00	Exit Push Buttons	Vitufe vya Kutokea	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Button Type", "Mounting Type"]	50e461cd-b484-42d0-8537-62e303f62be2
d9fc6764-d713-461f-9b9f-56b2a7520a4f	2026-08-25 14:42:09.212986+00	Emergency Breaks	Vivunjaji vya Dharura	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Button Type", "Indicator LED"]	50e461cd-b484-42d0-8537-62e303f62be2
426b927f-afa0-4897-a589-e5706c02ff98	2026-08-25 14:42:09.212986+00	RFID Cards	Kadi za RFID	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Card Frequency", "Indicator LED"]	50e461cd-b484-42d0-8537-62e303f62be2
762a9536-c5c7-4298-bed1-533a2a80411b	2026-08-25 14:42:09.212986+00	RFID Fobs	Fobi za RFID	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Card Frequency", "Indicator LED"]	50e461cd-b484-42d0-8537-62e303f62be2
464d4556-0148-4c99-9327-cc6bff13e0fc	2026-08-25 14:42:09.212986+00	Smart TVs	Televisheni Mahiri	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Screen Size", "Display Technology"]	2c2f918e-823a-44d1-a481-671b807b46e4
f395c026-f2cf-4a3c-bf5b-789a51a2fad9	2026-08-25 14:42:09.212986+00	OLED TVs	Televisheni za OLED	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Display Technology", "Resolution"]	2c2f918e-823a-44d1-a481-671b807b46e4
ea3e5675-6aca-4a93-a63e-853d5c57b229	2026-08-25 14:42:09.212986+00	QLED TVs	Televisheni za QLED	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Display Technology", "Resolution"]	2c2f918e-823a-44d1-a481-671b807b46e4
868aa31a-52b0-45f2-86b9-dd02a55d77c9	2026-08-25 14:42:09.212986+00	4K UHD Televisions	Televisheni za UHD 4K	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Resolution", "Smart OS"]	2c2f918e-823a-44d1-a481-671b807b46e4
fd9d6776-29cc-4c6e-a59a-a85ddfad9f27	2026-08-25 14:42:09.212986+00	Roof Insulation Foils	Vyombo vya Kuhami Paa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Insulation Material", "R-Value"]	223c9228-c75a-4833-b40d-99ce92c46725
36bda957-2f63-4a85-aef6-fdb7a67e6bb1	2026-08-25 14:42:09.212986+00	Polycarbonate Skylights	Taa za Paa za Polycarbonate	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Light Transmission", "UV Protection"]	223c9228-c75a-4833-b40d-99ce92c46725
a2bd571d-748b-4e7e-bc47-077067717e2a	2026-08-25 14:42:09.212986+00	Dust Masks	Masks za Vumbi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Filter Class", "Size"]	2d493f98-4474-487a-b09a-82d73b4497b7
53838eb4-cf08-43ee-89fc-9e9fc99d0af9	2026-08-25 14:42:09.212986+00	Respirators	Vipumulio	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Filter Class", "Size"]	2d493f98-4474-487a-b09a-82d73b4497b7
7b3fccd9-e1e5-4551-9107-7ca4448305bb	2026-08-25 14:42:09.212986+00	Work Gloves	Glovu za Kazi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Glove Material", "Cut Resistance"]	2d493f98-4474-487a-b09a-82d73b4497b7
2b081d2f-34cc-4974-9b07-c0fc4be96712	2026-08-25 14:42:09.212986+00	Boxers	Boxers	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	38d2ba26-0a87-4a79-8aa3-cbd17c4bf3a9
265d32c6-ab5d-4cc3-af5b-c0b9d1b39bc2	2026-08-25 14:42:09.212986+00	Briefs	Briefs	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Material"]	38d2ba26-0a87-4a79-8aa3-cbd17c4bf3a9
36c0eb55-95b3-4e66-b495-652d46aa9a92	2026-08-25 14:42:09.212986+00	Trunks	Trunks	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Waistband Type"]	38d2ba26-0a87-4a79-8aa3-cbd17c4bf3a9
4f24bfd1-4c66-4bb6-bbc6-48d755e99fba	2026-08-25 14:42:09.212986+00	Portable Bluetooth Speakers	Spika za Bluetooth za Kubebeka	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Battery Capacity", "Playtime"]	05f2dcbc-2b6f-4691-909a-8910d70bb636
c3f959d7-0654-4086-a002-04203c9aa222	2026-08-25 14:42:09.212986+00	Party Speakers	Spika za Sherehe	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Battery Capacity", "Water Resistance"]	05f2dcbc-2b6f-4691-909a-8910d70bb636
f753ac4d-de05-4e54-bb42-f3704907676c	2026-08-25 14:42:09.212986+00	Trolley Speakers	Spika za Troli	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Battery Capacity", "TWS Support"]	05f2dcbc-2b6f-4691-909a-8910d70bb636
10242c7b-77a4-4484-a465-a497c8d369ed	2026-08-25 14:42:09.212986+00	Shock Absorbers	Vifaa vya Kushokeya	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Shock Type", "Length"]	00597f28-08b3-46da-a858-347cb5def3ec
973ddab7-bbda-4e2f-80e1-39ff1d0da1b7	2026-08-25 14:42:09.212986+00	Ball Joints	Viungo vya Mpira	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bushing Material", "Mounting Style"]	00597f28-08b3-46da-a858-347cb5def3ec
3ed954a8-1206-4fa5-943f-22032f0b43c1	2026-08-25 14:42:09.212986+00	Tie Rod Ends	Ncha za Vijiti vya Kufunga	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Shaft Diameter", "Damping Adjustment"]	00597f28-08b3-46da-a858-347cb5def3ec
e919f632-2cbf-4fc5-8568-b16f3f509949	2026-08-25 14:42:09.212986+00	Bushings	Bushings	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bushing Material", "Mounting Style"]	00597f28-08b3-46da-a858-347cb5def3ec
99545747-3aac-4333-b487-9a164ec71728	2026-08-25 14:42:09.212986+00	Peels	Maganda	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sugar Content", "Acidity Level"]	606bec46-0f6d-4ed2-aeab-85caaa85a430
6edfe719-0e68-47ac-8790-2eb43169a4a2	2026-08-25 14:42:09.212986+00	Pulp	Mbolea	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sugar Content", "Water Content"]	606bec46-0f6d-4ed2-aeab-85caaa85a430
61d342a5-b936-49d5-91f3-a705554419ab	2026-08-25 14:42:09.212986+00	Discarded Produce	Mazao ya Kutupwa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Water Content", "Contamination-Free"]	606bec46-0f6d-4ed2-aeab-85caaa85a430
5b0321b9-bcf8-457d-9c84-314fa66031e9	2026-08-25 14:42:09.212986+00	Wedding Suits	Suti za Harusi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Suit Style", "Lapel Type"]	26a63525-d6e3-47d3-aa76-d2f653115921
2113ef5d-c2bd-4559-84a3-b5fe02f78efd	2026-08-25 14:42:09.212986+00	Tuxedos	Tuksido	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Suit Style", "Material"]	26a63525-d6e3-47d3-aa76-d2f653115921
6c101b0a-f03a-444c-bde0-2fc300927e75	2026-08-25 14:42:09.212986+00	Waistcoats	Waistkot	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Suit Style", "Vent Style"]	26a63525-d6e3-47d3-aa76-d2f653115921
99b1e6fb-43e1-4b1f-abf8-339d642b5406	2026-08-25 14:42:09.212986+00	Casual Shirts	Mashati ya Kawaida	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Fabric"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
b4be1118-0b62-4383-bffe-6d4e8dc3046b	2026-08-25 14:42:09.212986+00	Polo Shirts	Mashati ya Polo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Size", "Collar Type"]	369a884c-4fc2-417a-ba4d-dc2629c6d22b
f5051486-6ade-48fc-89eb-32ac9bcbdef2	2026-08-25 14:42:09.212986+00	VR Headsets	Vifaa vya Kichwa vya VR	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Display Resolution", "Refresh Rate"]	01f747fc-e08b-403d-b9cd-58e4dc06ce4a
0ed6736f-a924-473e-bf99-fde810d808bb	2026-08-25 14:42:09.212986+00	VR Goggles	Miwani ya VR	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Field of View", "Tracking Type"]	01f747fc-e08b-403d-b9cd-58e4dc06ce4a
eeb0ad4f-5781-4156-98a4-0334f9a58602	2026-08-25 14:42:09.212986+00	Mixed Shoe Bales	Bali za Viatu Mchanganyiko	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bale Weight", "Target Gender"]	06f6e4e6-73dd-4780-83e3-5dc980c49e84
a24dc62d-4060-4eab-bac2-a0f90fc90285	2026-08-25 14:42:09.212986+00	Wholesale Bundles (Shoes)	Vifurushi vya Jumla (Viatu)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Bale Weight", "Origin Country"]	06f6e4e6-73dd-4780-83e3-5dc980c49e84
a95dc675-8250-4b48-a0af-ab13b4483318	2026-08-25 14:42:09.212986+00	Chokers	Chokazi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Necklace Length"]	05d8790e-8857-4b20-803d-b45f350d5670
f65863d2-ce90-4156-b6b0-1ab89992c7da	2026-08-25 14:42:09.212986+00	Chains	Minyororo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Chain Style"]	05d8790e-8857-4b20-803d-b45f350d5670
373c3467-ce00-4fc0-bee1-6179e45ef914	2026-08-25 14:42:09.212986+00	Pendants	Pendants	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Pendant Theme", "Clasp Type"]	05d8790e-8857-4b20-803d-b45f350d5670
4652b4df-b941-49fe-aa9e-5e659307b53f	2026-08-25 14:42:09.212986+00	Lockets	Loketi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Pendant Theme", "Weight"]	05d8790e-8857-4b20-803d-b45f350d5670
ddc82bee-2215-4f38-b3ae-ff155841a304	2026-08-25 14:42:09.212986+00	Shirt Boxes	Sanduku za Shati	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Box Structure", "Closure Type"]	00d809c1-f223-4520-99a0-b70d4993b438
bc39e291-a40d-4fcd-bbf7-12aaf271bb06	2026-08-25 14:42:09.212986+00	Shoe Boxes	Sanduku za Viatu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Box Structure", "Cardboard Thickness"]	00d809c1-f223-4520-99a0-b70d4993b438
fbc0d6a2-7761-4432-bddd-60ebaa4e73c7	2026-08-25 14:42:09.212986+00	Magnetic Gift Boxes (Apparel)	Sanduku za Zawadi za Sumaku (Nguo)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Closure Type", "Inner Lining"]	00d809c1-f223-4520-99a0-b70d4993b438
ade2fa39-d2cf-436f-b021-3018dfe40d65	2026-08-25 14:42:09.212986+00	Replacement Blades (Wind)	Vilemba vya Kubadilishia (Upepo)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Part Type", "Material Durability"]	1ed36f16-14a2-4807-9aac-1a07f16a5b40
7bae7893-f6bd-4a90-be4c-1a028759b3c6	2026-08-25 14:42:09.212986+00	Tail Fins	Fini za Mkia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Part Type", "Compatibility"]	1ed36f16-14a2-4807-9aac-1a07f16a5b40
e4db8ca4-20e3-44df-a378-ef6fc1224f63	2026-08-25 14:42:09.212986+00	Hubs	Haba	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Part Type", "Material Durability"]	1ed36f16-14a2-4807-9aac-1a07f16a5b40
12910df7-e10d-40cc-9c4d-97d998709cee	2026-08-25 14:42:09.212986+00	Slip Rings	Pete za Kuteleza	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Part Type", "Operating Temp"]	1ed36f16-14a2-4807-9aac-1a07f16a5b40
c939c152-112d-44d7-962e-51dc3382f08c	2026-08-25 14:42:09.212986+00	Pants	Suruali	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Waist Type", "Closure Type"]	f8a70e64-b80e-4482-96a7-a11d116134bf
7d7ec5dd-208c-40a1-8101-f6e467b3d54a	2026-08-25 14:42:09.212986+00	Jumpsuits	Jumpsuiti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Waist Type", "Fabric Content"]	f8a70e64-b80e-4482-96a7-a11d116134bf
dcac8cfb-683f-4a81-9313-e9434e0e769a	2026-08-25 14:42:09.212986+00	Power Supply Units	Vitengo vya Ugavi wa Umeme	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["PSU Wattage", "Efficiency Rating"]	0bbcee3e-07bd-4241-b945-33cbedd7ee95
69fb9714-1abb-4ae9-a3fe-3cba93c1c526	2026-08-25 14:42:09.212986+00	Computer Cases	Vipochi vya Kompyuta	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Case Form Factor", "Side Panel"]	0bbcee3e-07bd-4241-b945-33cbedd7ee95
98008b0b-3b8a-4493-a86e-f2e89328e300	2026-08-25 14:42:09.212986+00	CPU Coolers	Vipozi vya CPU	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cooling Type", "Fan Size"]	0bbcee3e-07bd-4241-b945-33cbedd7ee95
43944acd-6513-4613-aedf-cc142d9bb112	2026-08-25 14:42:09.212986+00	Thermal Long Johns	Long John za Majira	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Thermal Insulation", "Fit Type"]	38d2ba26-0a87-4a79-8aa3-cbd17c4bf3a9
cf44e27e-0abe-4540-b6aa-f65302b241c5	2026-08-25 14:42:09.212986+00	Sports Bras	Bra za Riadha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Impact Level", "Moisture-Wicking"]	38d2ba26-0a87-4a79-8aa3-cbd17c4bf3a9
315c4973-f82b-4741-a50c-897a56e45de2	2026-08-25 14:42:09.212986+00	AR Smart Glasses	Miwani Mahiri ya AR	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Optical Engine Type", "Brightness"]	01f747fc-e08b-403d-b9cd-58e4dc06ce4a
2cb79af6-88d6-43b1-8904-0ef905c0d77e	2026-08-25 14:42:09.212986+00	Soccer Kits	Seti za Soka	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Type", "Customization"]	05483a18-d3d2-4e67-99ea-b4ab83413798
cc20a5f8-2cba-4adf-a0b0-fee2a8fcb702	2026-08-25 14:42:09.212986+00	Football Kits	Seti za Mpira wa Miguu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Type", "Customization"]	05483a18-d3d2-4e67-99ea-b4ab83413798
ac4800bd-e258-4001-8d5e-a2cf6ee5137e	2026-08-25 14:42:09.212986+00	Wall Mounts	Vipachiki vya Ukutani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Mount Type", "Max Load Weight"]	2c2f918e-823a-44d1-a481-671b807b46e4
992db3a4-7e26-477c-be6c-9146bd3662ab	2026-08-25 14:42:09.212986+00	HDMI Switches	Swichi za HDMI	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["HDMI Version", "Max Load"]	2c2f918e-823a-44d1-a481-671b807b46e4
ad4bb345-889e-48a7-8911-127ca0d9d848	2026-08-25 14:42:09.212986+00	Remote Controls	Vitudhibiti vya Kijijia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Mount Type", "HDMI Version"]	2c2f918e-823a-44d1-a481-671b807b46e4
e3d3ac3e-ce7d-4314-8e77-59a3cfe4e7ac	2026-08-25 14:42:09.212986+00	Surge Protectors (TV)	Kinga za Mwimwi (TV)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Protection Rating", "Max Load"]	2c2f918e-823a-44d1-a481-671b807b46e4
614153d2-5c7a-4aec-84dc-d2e6795204a4	2026-08-25 14:42:09.212986+00	Outdoor Hiking Rucksacks	Mikoba ya Kupanda Milima	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Frame Type"]	5b29eb6c-842d-4162-b546-3a189a3afd16
d1c526ad-4dfb-49a6-95a9-8198f8868d4a	2026-08-25 14:42:09.212986+00	Large Travel Rucksacks	Mikoba Mikubwa ya Kusafiria	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Capacity", "Rain Cover"]	5b29eb6c-842d-4162-b546-3a189a3afd16
34674b1e-c916-4b60-8a8a-34a161f7a9a1	2026-08-25 14:42:09.212986+00	Replacement Straps (Watch)	Mikanda ya Kubadilishia (Saa)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Strap Width", "Clasp Type"]	592f7888-0fb6-4363-b407-cb4d32d8175e
dd320247-1a11-4ae9-aa49-0970ac7396b3	2026-08-25 14:42:09.212986+00	Watch Boxes	Sanduku za Saa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Box Material", "Tool Set"]	592f7888-0fb6-4363-b407-cb4d32d8175e
391f6208-9f0c-403e-b227-b735f8ccd546	2026-08-25 14:42:09.212986+00	Watch Tool Kits	Kiti za Zana za Saa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Tool Set Inclusion", "Watch Winder"]	592f7888-0fb6-4363-b407-cb4d32d8175e
d6fe538f-db2b-4245-b11e-4dae0d1aa256	2026-08-25 14:42:09.212986+00	Cables (CCTV)	Kebo (CCTV)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Cable Type", "Transmission Distance"]	5d2ee588-12f9-4422-a79c-e8356e733c52
63d9f60c-b7c8-41d2-8fac-61dc4d7d58e3	2026-08-25 14:42:09.212986+00	Power Supplies (CCTV)	Vifaa vya Umeme (CCTV)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Power Output", "Surge Protection"]	5d2ee588-12f9-4422-a79c-e8356e733c52
2367069e-0fe9-4820-9643-3d84b743ec1f	2026-08-25 14:42:09.212986+00	BNC Connectors	Viunganishi vya BNC	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Connector Type", "Transmission Distance"]	5d2ee588-12f9-4422-a79c-e8356e733c52
f2b2bbe6-b81b-4407-bddb-4fb3d993ed98	2026-08-25 14:42:09.212986+00	Baluns	Balun	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Connector Type", "Surge Protection"]	5d2ee588-12f9-4422-a79c-e8356e733c52
18a1eb9d-ea3d-4f84-aa95-33f63f9fc590	2026-08-25 14:42:09.212986+00	Hydraulic Floor Jacks	Jakata za Sakafu za Hydraulic	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Lifting Capacity", "Jack Type"]	5c3f59e8-0b37-4856-a63e-91fe3a8ff147
f717d2ea-646e-4990-90a6-c78d5fd98efd	2026-08-25 14:42:09.212986+00	Bottle Jacks	Jakata za Chupa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Jack Type", "Material"]	5c3f59e8-0b37-4856-a63e-91fe3a8ff147
ca99053d-0133-4eb1-832c-643b7ca92eb2	2026-08-25 14:42:09.212986+00	Jack Stands	Visimamio vya Jakata	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Lifting Capacity", "Safety Valve"]	5c3f59e8-0b37-4856-a63e-91fe3a8ff147
8eeddb76-776c-4c74-835b-b68eff57d85b	2026-08-25 14:42:09.212986+00	Thermal Transfer Labels (Final)	Lebulu za Uhamisho wa Joto (Mwisho)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Label Format", "Weather Resistance"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
ead7b2b0-12cf-45b9-b7f6-2e629117012c	2026-08-25 14:42:09.212986+00	Barcode Stickers (Final)	Vibandiko vya Barcode (Mwisho)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Label Format", "Weather Resistance"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
66546b6c-9cbd-4243-9c5c-71d389497dcd	2026-08-25 14:42:09.212986+00	Fragile Stickers (Final)	Vibandiko vya Kukatika (Mwisho)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Label Format", "Weather Resistance"]	3f2a35d8-f020-4053-8e1d-73ba06ede787
17eed11d-9d02-4285-9d73-540d0b2eee5d	2026-08-25 14:42:09.212986+00	Lace Front Wigs	Wigi za Mbele ya Lace	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hair Type", "Lace Type"]	27f26f61-d3a5-4b44-8885-fdab95aa5c2b
08d9789b-ee88-4a4d-b5fc-a429ab096f61	2026-08-25 14:42:09.212986+00	Full Lace Wigs	Wigi za Lace Nzima	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hair Type", "Wig Density"]	27f26f61-d3a5-4b44-8885-fdab95aa5c2b
49646794-9d6a-407a-b675-5f006880687b	2026-08-25 14:42:09.212986+00	Headband Wigs	Wigi za Kichwa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hair Type", "Cap Size"]	27f26f61-d3a5-4b44-8885-fdab95aa5c2b
704e9074-d4a9-40d3-bec7-cf1049fcf3dd	2026-08-25 14:42:09.212986+00	Fairy Lights	Taa za Kichimbunga	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Light Type", "Power Source"]	152c4f80-76ce-43b9-b588-69f6994cdd6c
d8a83f55-2048-4783-bf2f-12ec08d15434	2026-08-25 14:42:09.212986+00	Disco Balls	Mipira ya Disko	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Effect Type", "Power Source"]	152c4f80-76ce-43b9-b588-69f6994cdd6c
41029f41-66be-4fc3-977e-5e9225516967	2026-08-25 14:42:09.212986+00	Party Poppers	Vipuluzi vya Sherehe	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Effect Type", "Popper Content"]	152c4f80-76ce-43b9-b588-69f6994cdd6c
481c9122-2c25-4304-92f4-97bf948c6127	2026-08-25 14:42:09.212986+00	Smoke Machines	Mashine za Moshi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Effect Type", "Waterproof"]	152c4f80-76ce-43b9-b588-69f6994cdd6c
8e2fea1d-6d13-47d1-981e-518294930b57	2026-08-25 14:42:09.212986+00	Gift Boxes	Sanduku za Zawadi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Box Dimensions", "Finishing"]	40b115bd-00c9-47e6-890e-89c215cb5b84
bd2e4d17-698a-4a55-a1a3-79ea155c3d13	2026-08-25 14:42:09.212986+00	Wrapping Paper	Karatasi za Kufungia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Paper GSM", "Theme"]	40b115bd-00c9-47e6-890e-89c215cb5b84
413adf6f-04e7-4958-8729-1380844a36cb	2026-08-25 14:42:09.212986+00	Greeting Cards	Kadi za Salamu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Theme", "Quantity"]	40b115bd-00c9-47e6-890e-89c215cb5b84
a3c450e3-f696-4781-a41f-5ddc030c17a6	2026-08-25 14:42:09.212986+00	Operating Systems	Mifumo ya Uendeshaji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Software Type", "License Type"]	0bbcee3e-07bd-4241-b945-33cbedd7ee95
eed334c4-e307-45b1-b064-580ee9a95384	2026-08-25 14:42:09.212986+00	Office Suites	Seti za Ofisi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Software Type", "Number of Devices"]	0bbcee3e-07bd-4241-b945-33cbedd7ee95
6466ef4e-1af2-4e92-9396-1e1a67854c32	2026-08-25 14:42:09.212986+00	Antivirus	Antivirus	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Software Type", "Subscription Duration"]	0bbcee3e-07bd-4241-b945-33cbedd7ee95
34622332-0a78-44a7-973e-0e7833719c25	2026-08-25 14:42:09.212986+00	Manual Pallet Jacks	Jakata za Pini za Mikono	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Load Capacity", "Fork Length"]	4c24d053-6fdc-4c8d-af8a-b00705651bb5
9fe582fd-2b62-43a4-bf65-35e6bf68d127	2026-08-25 14:42:09.212986+00	Electric Pallet Jacks	Jakata za Pini za Umeme	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Load Capacity", "Fork Length"]	4c24d053-6fdc-4c8d-af8a-b00705651bb5
bc6a9c26-16ed-471b-aca9-1eea5b9feee8	2026-08-25 14:42:09.212986+00	Platform Trolleys	Toroli za Jukwaa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Load Capacity", "Wheel Material"]	4c24d053-6fdc-4c8d-af8a-b00705651bb5
3388b6b1-c650-4c28-921d-faae76822a4c	2026-08-25 14:42:09.212986+00	LED Lighting (Aquarium)	Taa za LED (Aquarium)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Light Spectrum", "Waterproof"]	541ae2d7-0a65-42f6-b8c3-0ec251c3d3c6
5ebf15f8-5c38-4acf-a543-5ad3afc474cb	2026-08-25 14:42:09.212986+00	Submersible Heaters	Hita za Chini ya Maji	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Heater Wattage", "Adjustable Temp"]	541ae2d7-0a65-42f6-b8c3-0ec251c3d3c6
0e4ac67f-1179-46ad-a446-f0553be48745	2026-08-25 14:42:09.212986+00	Aquarium Thermometers	Vipimajoto vya Aquarium	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Adjustable Temp", "Waterproof"]	541ae2d7-0a65-42f6-b8c3-0ec251c3d3c6
2cf95e2e-1d9c-4015-913b-0b034ce791fa	2026-08-25 14:42:09.212986+00	Full Soccer Kits	Seti Kamili za Soka	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Set Includes"]	05483a18-d3d2-4e67-99ea-b4ab83413798
3e9257c7-020d-45a8-8973-888aaef32752	2026-08-25 14:42:09.212986+00	Goalkeeper Jerseys	Jezi za Kipa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Sleeve Length"]	05483a18-d3d2-4e67-99ea-b4ab83413798
95cab024-7400-4a79-b9df-50b283e4c771	2026-08-25 14:42:09.212986+00	Training Bibs	Bibu za Mazoezi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Fabric Weight"]	05483a18-d3d2-4e67-99ea-b4ab83413798
9e0aac5f-8cf3-46e7-b6f6-6b5ca25e90c8	2026-08-25 14:42:09.212986+00	HDPE Tank Fabrication	Utengenezaji wa Matangi ya HDPE	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Plastic Grade", "Welding Technique"]	563747dc-1890-4b53-b859-d34abf12ba33
6d4ad29f-e195-4353-8cb9-2f1e62c58be1	2026-08-25 14:42:09.212986+00	Polypropylene Tank Fabrication	Utengenezaji wa Matangi ya Polypropeni	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Plastic Grade", "Chemical Resistance"]	563747dc-1890-4b53-b859-d34abf12ba33
3dabe518-95c9-4583-a2f9-8f3604e46504	2026-08-25 14:42:09.212986+00	Used DSLR Cameras	Kamera za DSLR Zilizotumika	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Shutter Count", "Lens Condition"]	48d8c013-5cea-4d9a-a377-4b0100dde339
12719faa-a19c-49fc-bd3c-7d21049ae480	2026-08-25 14:42:09.212986+00	Laser Printers	Printa za Laser	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Page Count", "Toner Condition"]	48d8c013-5cea-4d9a-a377-4b0100dde339
1636b30a-1cba-499f-8706-38d5376d2c41	2026-08-25 14:42:09.212986+00	Office Equipment (Used)	Vifaa vya Ofisi (Zilizotumika)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Power Cable", "Condition"]	48d8c013-5cea-4d9a-a377-4b0100dde339
a9297c49-c384-4763-8fee-fe994882b534	2026-08-25 14:42:09.212986+00	Dresses	Magowns	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Dress Length"]	f8a70e64-b80e-4482-96a7-a11d116134bf
a7d75677-4516-4917-b9d3-ce3d7f98c451	2026-08-25 14:42:09.212986+00	Shoe Trees	Miti ya Viatu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Product Type", "Material"]	2732192c-9b99-43b3-a731-d8dea5caf86a
ab6a6ae8-5299-4dd3-b5bc-bbc19bda3948	2026-08-25 14:42:09.212986+00	Shoe Polish	Mafuta ya Kuing'arisha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Product Type", "Applicable Material"]	2732192c-9b99-43b3-a731-d8dea5caf86a
4cb37510-9afa-4025-97b0-ac746b5a215e	2026-08-25 14:42:09.212986+00	Shoe Brushes	Bureta za Viatu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Product Type", "Material"]	2732192c-9b99-43b3-a731-d8dea5caf86a
543bac43-4608-4ea6-90de-f236a8ade1b4	2026-08-25 14:42:09.212986+00	Shoe Horns	Pembe za Viatu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Shoe Horn Length", "Kit Contents"]	2732192c-9b99-43b3-a731-d8dea5caf86a
53749da8-c844-438c-9f7f-c44c514565b8	2026-08-25 14:42:09.212986+00	Decorative Cushions	Mito ya Mapambo	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Type", "Dimensions"]	580d74b9-8d74-45a8-b1ad-ca369ba2e0c8
544515b3-512e-4f63-8505-77a1f4bbf066	2026-08-25 14:42:09.212986+00	Throws	Mito ya Kutupilia	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Type", "Pattern"]	580d74b9-8d74-45a8-b1ad-ca369ba2e0c8
6c35f394-e30b-4fbc-8e1f-2a1f466a19b1	2026-08-25 14:42:09.212986+00	Indoor Rugs	Zulia za Ndani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Fabric Type", "Non-slip"]	580d74b9-8d74-45a8-b1ad-ca369ba2e0c8
5a650041-d6af-433e-b080-65956ef0c76d	2026-08-25 14:42:09.212986+00	Car Seatbelt Tethers	Kamba za Kiti za Usalama za Gari	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Compatibility", "Clip Material"]	3dcc4947-370a-4d5c-b62c-5402ac79767a
9aa0384a-fa54-4305-bcdd-8fc546b1e099	2026-08-25 14:42:09.212986+00	Long Training Leads	Viongozi Mirefu wa Mazoezi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Training Distance", "Tensile Strength"]	3dcc4947-370a-4d5c-b62c-5402ac79767a
9daa1b80-fa5e-4337-86e1-e2c0bbbea04a	2026-08-25 14:42:09.212986+00	Bullet Cameras	Kamera za Risasi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Resolution", "Camera Type"]	5d2ee588-12f9-4422-a79c-e8356e733c52
3ad41313-12c9-421b-87ba-ab9a5526d051	2026-08-25 14:42:09.212986+00	Dome Cameras	Kamera za Kuba	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Resolution", "Night Vision"]	5d2ee588-12f9-4422-a79c-e8356e733c52
171e91a6-7375-446f-a7bf-a1f8f0d5ba78	2026-08-25 14:42:09.212986+00	PTZ Security Cameras	Kamera za PTZ	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Resolution", "Lens Size"]	5d2ee588-12f9-4422-a79c-e8356e733c52
0d816adf-6393-4957-9546-8ee8ff233ee2	2026-08-25 14:42:09.212986+00	Double-Sided Foam Tape	Povu ya Upande-mbili	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Backing Material", "Holding Power"]	066471f5-d171-4c35-8e50-808447e36618
fe63ccbf-5f3f-47a8-b966-eb2600953360	2026-08-25 14:42:09.212986+00	Mounting Tape	Tepu ya Kupachika	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Backing Material", "Removability"]	066471f5-d171-4c35-8e50-808447e36618
8966c514-d1a8-4066-a1de-32ae3f383409	2026-08-25 14:42:09.212986+00	Reflective Tapes	Tepu za Kuakisi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Reflective Visibility", "UV Resistance"]	066471f5-d171-4c35-8e50-808447e36618
9d9107ad-8e24-4546-a1ac-584d03c9f09b	2026-08-25 14:42:09.212986+00	Tote Bags	Mikoba ya Tote	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Internal Compartments"]	25719b69-d419-4920-a2d8-c1d458ba6dda
6dbd4931-0cb4-48ae-a8d5-9ce40a3ae009	2026-08-25 14:42:09.212986+00	Satchels	Mikoba ya Satchel	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Laptop Sleeve"]	25719b69-d419-4920-a2d8-c1d458ba6dda
34d810ce-28b3-45e5-b445-8c6b11e17d4d	2026-08-25 14:42:09.212986+00	Shoulder Bags	Mikoba ya Bega	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Strap Type"]	25719b69-d419-4920-a2d8-c1d458ba6dda
67d332a6-c6af-41e0-94eb-8590482fec31	2026-08-25 14:42:09.212986+00	Rubber Feet	Nyayo za Mpira	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Accessory Type", "Material"]	560775e5-ad04-404d-9939-16f9a38ea423
0f73f476-5cbc-46eb-8ed1-bcf4c769eb79	2026-08-25 14:42:09.212986+00	Stabilizer Bars	Vibao vya Kukabilisha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Accessory Type", "Compatibility"]	560775e5-ad04-404d-9939-16f9a38ea423
c92e7932-446a-4cf0-acda-3c83494f1e04	2026-08-25 14:42:09.212986+00	Scaffold Planks	Mbao za Kiunzi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Accessory Type", "Installation Method"]	560775e5-ad04-404d-9939-16f9a38ea423
a4c362c6-3e7a-4f4f-ac42-890b3874c899	2026-08-25 14:42:09.212986+00	Buckles (Bag)	Bekli	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hardware Type", "Internal Width"]	0ffa648f-d279-441d-aca8-00771a729752
e38796d4-9313-4865-9105-18c2c539eeaf	2026-08-25 14:42:09.212986+00	D-Rings	Pete za D	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hardware Type", "Internal Width"]	0ffa648f-d279-441d-aca8-00771a729752
5bde64e7-16af-4e50-b254-2dd865779fc6	2026-08-25 14:42:09.212986+00	Swivel Snap Hooks	Kulabu za Kizunguko	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hardware Type", "Weight Capacity"]	0ffa648f-d279-441d-aca8-00771a729752
deded3ea-dd6d-4870-95d9-52242a8ba263	2026-08-25 14:42:09.212986+00	Rivets	Riveti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hardware Type", "Material"]	0ffa648f-d279-441d-aca8-00771a729752
2751eb77-ab61-4676-9ebd-122510b12158	2026-08-25 14:42:09.212986+00	Mosquito Nets	Vyandarua vya Mbu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Coverage Area", "Net Mesh Density"]	4d1e7aac-4c8a-40f0-a185-b2eab06cca0d
0f469b8f-19a6-44e6-a121-b63fe027cfab	2026-08-25 14:42:09.212986+00	Mosquito Traps	Mitego ya Mbu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Power Source", "Trap Type"]	4d1e7aac-4c8a-40f0-a185-b2eab06cca0d
b866501a-c7e8-4604-aae7-13560fc79dfa	2026-08-25 14:42:09.212986+00	Electric Swatters	Vipuli vya Umeme	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Power Source", "Chemical-free"]	4d1e7aac-4c8a-40f0-a185-b2eab06cca0d
9a24c1bc-7cb2-4581-b2c8-6a7e9a7c26d3	2026-08-25 14:42:09.212986+00	Busts	Busti	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Display Type", "Surface Material"]	25995318-792a-4dd8-ae68-4961a50ae6c3
ce95a013-7351-4125-baaa-40f142966d33	2026-08-25 14:42:09.212986+00	T-Bars	Baa za T	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Display Type", "Base Stability"]	25995318-792a-4dd8-ae68-4961a50ae6c3
626ca096-1dbc-4c3e-be76-2fc15d1b0b05	2026-08-25 14:42:09.212986+00	Tray Inserts	Vichomekaji vya Treya	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Display Type", "Color"]	25995318-792a-4dd8-ae68-4961a50ae6c3
5a7053fa-d12a-4c6c-9f1e-38c9d72fc2db	2026-08-25 14:42:09.212986+00	Rotating Displays	Maonyesho yanayozunguka	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Display Type", "Adjustable Height"]	25995318-792a-4dd8-ae68-4961a50ae6c3
be3865d7-ecc4-4061-8803-802fc11b8058	2026-08-25 14:42:09.212986+00	Combination Pliers	Koleo za Mchanganyiko	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Jaw Type", "Insulation Rating"]	1b416443-6659-4681-9fd6-d90fc3f0c7c2
13bc91d2-b907-4525-955d-cb1e729a43f8	2026-08-25 14:42:09.212986+00	Nose Pliers	Koleo za Pua	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Jaw Type", "Cutting Capacity"]	1b416443-6659-4681-9fd6-d90fc3f0c7c2
a3bd1dcc-310a-4eea-8845-9f5bca7df63e	2026-08-25 14:42:09.212986+00	Wire Strippers	Ving'oea Waya	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Jaw Type", "Handle Material"]	1b416443-6659-4681-9fd6-d90fc3f0c7c2
664b4a51-d168-4dec-8a6e-345ba02e9489	2026-08-25 14:42:09.212986+00	Home Theater Systems	Mifumo ya Home Theater	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sound Output", "Channel Configuration"]	2c2f918e-823a-44d1-a481-671b807b46e4
b352898c-458c-4081-9f1d-96427b4e6cd4	2026-08-25 14:42:09.212986+00	Soundbars	Soundbar	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sound Output", "Connectivity"]	2c2f918e-823a-44d1-a481-671b807b46e4
2699effd-ad01-4a77-a957-fc1b6886cdc1	2026-08-25 14:42:09.212986+00	Hi-Fi Speakers	Spika za Hi-Fi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Sound Output", "Subwoofer Type"]	2c2f918e-823a-44d1-a481-671b807b46e4
ff478f46-90c2-450c-a50c-4c75d3ba8943	2026-08-25 14:42:09.212986+00	Home Projectors	Projekta za Nyumbani	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Brightness", "Projection Size"]	2c2f918e-823a-44d1-a481-671b807b46e4
96e2880a-c67d-41a8-aafa-6b1554ff7bf1	2026-08-25 14:42:09.212986+00	DVD Players (Home)	Vicheza DVD (Nyumbani)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Brightness", "Input Ports"]	2c2f918e-823a-44d1-a481-671b807b46e4
48fa0070-94dc-44ad-8db7-a89717152982	2026-08-25 14:42:09.212986+00	Blu-ray Players (Home)	Vicheza Blu-ray (Nyumbani)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Brightness", "Input Ports"]	2c2f918e-823a-44d1-a481-671b807b46e4
aaed1ec1-14a4-4aab-b800-0ecab3d14079	2026-08-25 14:42:09.212986+00	Streaming Devices (Home)	Vifaa vya Kutiririsha (Nyumbani)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Brightness", "Input Ports"]	2c2f918e-823a-44d1-a481-671b807b46e4
74df01d9-c993-4320-8173-960dee2df235	2026-08-25 14:42:09.212986+00	Roof Ridges	Kingo za Paa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Product Type", "Material"]	223c9228-c75a-4833-b40d-99ce92c46725
675227bf-5a5f-4a24-aad8-596f79d20560	2026-08-25 14:42:09.212986+00	PVC Gutters	Mabirika ya PVC	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Product Type", "Length"]	223c9228-c75a-4833-b40d-99ce92c46725
1598ebcb-d6a0-4cc3-bb38-d03f23861667	2026-08-25 14:42:09.212986+00	Valley Flashings	Mipindo ya Bonde	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Product Type", "Color Matching"]	223c9228-c75a-4833-b40d-99ce92c46725
cbbec79b-1737-4a89-a746-226a55c684a2	2026-08-25 14:42:09.212986+00	Human Hair Wigs	Wigi za Nywele za Binadamu	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hair Material", "Wig Type"]	447fca2b-0e85-4f7d-b9be-160868830f05
4dc2121e-97f0-40d3-8b95-ddf84fc4f0af	2026-08-25 14:42:09.212986+00	Synthetic Weaves	Vifumio vya Synthetiki	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hair Material", "Length"]	447fca2b-0e85-4f7d-b9be-160868830f05
934b5dcf-ba38-4591-ac07-ae1bbf5caba3	2026-08-25 14:42:09.212986+00	Braiding Extensions	Viongezi vya Kusuka	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Hair Material", "Texture"]	447fca2b-0e85-4f7d-b9be-160868830f05
970c4a61-939c-4c93-a6c0-2513b20a9658	2026-08-25 14:42:09.212986+00	Replacement Batteries (Tools)	Betri za Kubadilishia (Zana)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Battery Voltage", "Capacity"]	0b14aa60-4c1b-4480-ac08-bcecb181b345
6ea1da36-0e69-480d-b3d1-f7f1c2c04573	2026-08-25 14:42:09.212986+00	Fast Chargers	Chaja za Haraka	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Battery Chemistry", "Charging Time"]	0b14aa60-4c1b-4480-ac08-bcecb181b345
0fccc8be-0bd3-4e5a-b44a-749f41fff481	2026-08-25 14:42:09.212986+00	Chucks (Tools)	Vikolea	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Chuck Capacity", "Compatibility"]	0b14aa60-4c1b-4480-ac08-bcecb181b345
114e21a9-9c34-4bbf-b0c7-e24a044d7cae	2026-08-25 14:42:09.212986+00	Leather Seat Covers	Vifuniko vya Viti vya Ngozi	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Compatibility"]	16ff2200-3f62-42d2-919f-bc5b9efcaaf6
6327836f-9c5f-4e3b-9803-3704631cd7ce	2026-08-25 14:42:09.212986+00	Fabric Seat Covers	Vifuniko vya Viti vya Kitambaa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Set Piece Count"]	16ff2200-3f62-42d2-919f-bc5b9efcaaf6
01f53466-f1fa-433b-8fb9-193b7c3f6f70	2026-08-25 14:42:09.212986+00	Lumbar Supports	Vitegemeo vya Kiuno	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Foam Thickness"]	16ff2200-3f62-42d2-919f-bc5b9efcaaf6
8a21841c-6363-40b6-ba6c-5425b823165b	2026-08-25 14:42:09.212986+00	Standard Poly Mailers	Vipeperushi vya Kawaida vya Poli	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Dimensions", "Material Thickness"]	3e03e255-e6fa-4c3a-a9e8-0077f79d00bd
097bb1fd-91ff-476c-9160-e027ded55580	2026-08-25 14:42:09.212986+00	Courier Bags	Mifuko ya Courier	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Dimensions", "Closure Type"]	3e03e255-e6fa-4c3a-a9e8-0077f79d00bd
087f49ff-372f-4c5b-8934-507f4fe744f2	2026-08-25 14:42:09.212986+00	Scrunchies	Scrunchies	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Elasticity"]	30db2cee-1181-4018-98f7-3526fbeadd6a
fdac165e-b043-4c7e-bde6-db8935448a33	2026-08-25 14:42:09.212986+00	Claw Clips	Klipu za Kucha	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Clip Size"]	30db2cee-1181-4018-98f7-3526fbeadd6a
1bb4329d-8e90-49e2-b091-df697caeac8e	2026-08-25 14:42:09.212986+00	Bobby Pins	Pini za Bobby	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "No-damage"]	30db2cee-1181-4018-98f7-3526fbeadd6a
15ca1dcf-4dc3-4896-ac7e-4b49aa5e8528	2026-08-25 14:42:09.212986+00	Headbands	Vikumbatio vya Kichwa	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "Decorative Elements"]	30db2cee-1181-4018-98f7-3526fbeadd6a
5bd351d6-fd19-4cfb-b5ea-90eedf01288c	2026-08-25 14:42:09.212986+00	Pet Carriers (Final)	Vibebeo vya Wanyama (Mwisho)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Carrier Type", "Max Weight"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
4ebbdc5b-5e98-4f03-bcf5-b209d6409e40	2026-08-25 14:42:09.212986+00	Pet Travel Bags (Final)	Mifuko ya Kusafiria ya Wanyama (Mwisho)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Carrier Type", "Ventilation"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
4340771f-9b3b-41fd-842b-77901fb70b6f	2026-08-25 14:42:09.212986+00	De-shedding Brushes (Final)	Bureta za Kumwaga Nywele (Mwisho)	f	f	t	f	f	f	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Brush Bristle Type", "Airline Approved"]	40ad44f3-4972-43ec-8cb6-e32947d6c972
c8fd8194-aec7-4391-9594-cde9b612fa85	2026-10-02 09:25:46.101054+00	Bed Sheets	Shuka za Kitanda	f	t	t	f	f	f	f	5	cm	6x6, 8x8	Cotton		#FFFFFF	Bed Sheets - Shuka za Kitanda	High quality cotton bed sheets	["new"]	{}	["Size", "Material", "Color"]	6cff2a9a-d920-44c8-9949-c8c61a0c1f0c
19addb52-5b56-4fae-b76e-0aa51dc891ca	2026-10-02 09:25:46.101054+00	Duvet Covers	Vifuniko vya Duvet	f	t	t	f	f	f	f	5	cm	6x6, 8x8	Cotton		#FFFFFF	Duvet Covers - Vifuniko vya Duvet	Soft duvet covers for all seasons	["new"]	{}	["Size", "Material", "Color"]	6cff2a9a-d920-44c8-9949-c8c61a0c1f0c
841e9065-9adc-4ba9-80b1-d9caef8fcc79	2026-10-02 09:25:46.101054+00	Pillowcases	Foronya	f	t	t	f	f	f	f	5	cm	Standard	Cotton		#FFFFFF	Pillowcases - Foronya	Comfortable pillowcases	["new"]	{}	["Size", "Material", "Color"]	6cff2a9a-d920-44c8-9949-c8c61a0c1f0c
cb98ed18-7b45-4759-a2b7-31b33cda0d29	2026-10-02 09:25:46.101054+00	Bed Skirts	Skati za Kitanda	f	t	t	f	f	f	f	5	cm	6x6, 8x8	Cotton		#FFFFFF	Bed Skirts - Skati za Kitanda	Elegant bed skirts	["new"]	{}	["Size", "Material", "Color"]	6cff2a9a-d920-44c8-9949-c8c61a0c1f0c
27a9d687-37d7-4a9c-9c99-c34a376c3d03	2026-10-02 09:25:48.945224+00	Bed Sheets	Shuka za Kitanda	f	t	t	f	f	f	f	5	cm	6x6, 8x8	Cotton		#FFFFFF	Bed Sheets - Shuka za Kitanda	High quality cotton bed sheets	["new"]	{}	["Size", "Material", "Color"]	6cff2a9a-d920-44c8-9949-c8c61a0c1f0c
a7638d29-c33a-408a-b0f8-6d44127cb28c	2026-10-02 09:25:48.945224+00	Duvet Covers	Vifuniko vya Duvet	f	t	t	f	f	f	f	5	cm	6x6, 8x8	Cotton		#FFFFFF	Duvet Covers - Vifuniko vya Duvet	Soft duvet covers for all seasons	["new"]	{}	["Size", "Material", "Color"]	6cff2a9a-d920-44c8-9949-c8c61a0c1f0c
d74d8ebf-7e55-40cd-b80b-ddda47dc71a6	2026-10-02 09:25:48.945224+00	Pillowcases	Foronya	f	t	t	f	f	f	f	5	cm	Standard	Cotton		#FFFFFF	Pillowcases - Foronya	Comfortable pillowcases	["new"]	{}	["Size", "Material", "Color"]	6cff2a9a-d920-44c8-9949-c8c61a0c1f0c
22400d96-f81b-4219-bce5-371fe013dbe3	2026-10-02 09:25:48.945224+00	Bed Skirts	Skati za Kitanda	f	t	t	f	f	f	f	5	cm	6x6, 8x8	Cotton		#FFFFFF	Bed Skirts - Skati za Kitanda	Elegant bed skirts	["new"]	{}	["Size", "Material", "Color"]	6cff2a9a-d920-44c8-9949-c8c61a0c1f0c
c3d4e5f6-7777-4c4d-ae5f-777700000001	2026-10-08 16:30:46.1885+00	Gaming Laptops	Laptops za Michezo	f	f	t	t	t	f	f	5	metric	standard	plastic/metal	Gamepad2	#ff6a00	Gaming Laptops - High Performance	Laptops za michezo zenye GPU kali	["new", "refurbished"]	{}	["Processor", "RAM", "Storage", "GPU", "Screen Size", "Refresh Rate", "Battery"]	b2c3d4e5-7777-4b3c-9d4e-777788889999
d4e5f6a7-7777-4d5e-bf6a-777700000002	2026-10-08 16:30:47.369963+00	Business Laptops	Laptops za Biashara	f	f	t	t	t	f	f	5	metric	standard	metal	Briefcase	#2563eb	Business Laptops - Professional	Laptops za kazi na biashara	["new", "refurbished"]	{}	["Processor", "RAM", "Storage", "Screen Size", "Battery Life", "Weight"]	b2c3d4e5-7777-4b3c-9d4e-777788889999
e5f6a7b8-7777-4e6f-c07b-777700000003	2026-10-08 16:30:47.974007+00	Ultrabooks	Ultrabooks	f	f	t	t	t	f	f	5	metric	standard	aluminum	Feather	#10b981	Ultrabooks - Lightweight	Laptops nyepesi na zenye nguvu	["new"]	{}	["Processor", "RAM", "Storage", "Screen Size", "Weight", "Battery Life"]	b2c3d4e5-7777-4b3c-9d4e-777788889999
f6a7b8c9-7777-4f70-d18c-777700000004	2026-10-08 16:30:48.517903+00	Student Laptops	Laptops za Wanafunzi	f	f	t	t	t	f	f	5	metric	standard	plastic	GraduationCap	#8b5cf6	Student Laptops - Budget Friendly	Laptops kwa wanafunzi - bei nafuu	["new", "used", "refurbished"]	{}	["Processor", "RAM", "Storage", "Screen Size", "Battery Life"]	b2c3d4e5-7777-4b3c-9d4e-777788889999
a7b8c9d0-7777-4071-e28d-777700000005	2026-10-08 16:30:49.078031+00	Programming Laptops	Laptops za Programu	f	f	t	t	t	f	f	5	metric	standard	aluminum	Code	#0ea5e9	Programming Laptops - For Developers	Laptops za programming na coding	["new", "refurbished"]	{}	["Processor", "RAM", "Storage", "Screen Size", "Keyboard", "Battery Life", "OS Support"]	b2c3d4e5-7777-4b3c-9d4e-777788889999
b8c9d0e1-7777-4172-f39e-777700000006	2026-10-08 16:30:49.611894+00	MacBooks	MacBooks	f	f	t	t	t	f	f	5	metric	standard	aluminum	Apple	#1f2937	MacBooks - Apple	MacBooks za Apple - MacBook Air na Pro	["new", "refurbished"]	{}	["Chip", "RAM", "Storage", "Screen Size", "Battery Life", "Weight"]	b2c3d4e5-7777-4b3c-9d4e-777788889999
c9d0e1f2-7777-4273-a4af-777700000007	2026-10-08 16:30:50.266127+00	Chromebooks	Chromebooks	f	f	t	t	t	f	f	5	metric	standard	plastic	Chrome	#f59e0b	Chromebooks - Google	Chromebooks za Google Chrome OS	["new", "used", "refurbished"]	{}	["Processor", "RAM", "Storage", "Screen Size", "Battery Life", "Chrome OS Version"]	b2c3d4e5-7777-4b3c-9d4e-777788889999
d0e1f2a3-7777-4374-b5b0-777700000008	2026-10-08 16:30:50.837848+00	2-in-1 Convertibles	Laptops za Kubadilika	f	f	t	t	t	f	f	5	metric	standard	aluminum	Tablet2	#ec4899	2-in-1 Convertible Laptops - Touchscreen	Laptops zinazobadilika kuwa tablet	["new", "refurbished"]	{}	["Processor", "RAM", "Storage", "Screen Size", "Touchscreen", "Battery Life", "Pen Support"]	b2c3d4e5-7777-4b3c-9d4e-777788889999
e1f2a3b4-7777-4475-c6c1-777700000009	2026-10-08 16:30:51.565828+00	Workstation Laptops	Laptops za Kazi Nzito	f	f	t	t	t	f	f	5	metric	standard	metal	Cpu	#dc2626	Workstation Laptops - Professional Grade	Laptops za kazi nzito za kitaalamu	["new", "refurbished"]	{}	["Processor", "RAM", "Storage", "GPU", "Screen Size", "Color Accuracy", "ISV Certification"]	b2c3d4e5-7777-4b3c-9d4e-777788889999
b1ae69d9-385d-48df-b763-bab7c5b27e06	2026-10-14 16:27:49.762104+00	Digital Piano	Piano ya Kidijitali	f	f	t	t	t	t	f	5	pc	88 Keys	Plastic			Digital Piano - 88 Keys	Piano ya kidijitali	["new", "used"]	{}	["Keys", "Voices", "Connectivity"]	45492267-52d3-445b-9831-28c3f178f56f
63307aa4-d619-4661-a770-b6e37bdba7e8	2026-10-14 16:27:49.762104+00	Drum Set	Seti ya Ngoma	f	f	t	t	t	t	f	5	set	Standard	Wood			Drum Set - Complete	Seti kamili ya ngoma	["new", "used"]	{}	["Pieces", "Material", "Cymbals"]	45492267-52d3-445b-9831-28c3f178f56f
5ef9a2e9-3c5c-41c1-b351-4f22cd3e789b	2026-10-25 18:44:44.282559+00	Frying Pans	Vikaangio	f	f	t	f	t	t	f	5	Pieces	Medium	Non-Stick	Pan	\N	\N	\N	["new"]	{}	["Non-Stick"]	445fe3b7-7acc-470c-a304-b5dd003b976e
aae1200c-d2e3-4aa4-afda-a778e08144ba	2026-10-25 18:44:44.282559+00	Cooking Spoons	Vijiko vya Kupakulia	f	f	t	f	f	f	f	10	Pieces	Standard	Wood/Plastic	Spoon	\N	\N	\N	["new"]	{}	["Material", "Heat Resistant"]	d2a29dc9-a387-4225-9ad1-2151d1313cdd
0fad6984-6fe1-4fbc-8b8d-a4d5849b5a6f	2026-10-25 18:44:44.282559+00	Knives & Chopping	Visu na Vitekeo	f	f	f	f	f	t	f	10	Pieces	Standard	Stainless Steel	Knife	\N	\N	\N	["new"]	{}	["Blade Material"]	d2a29dc9-a387-4225-9ad1-2151d1313cdd
74cbf801-4160-4565-b371-b3ef23c30446	2026-10-25 18:44:44.282559+00	Plates & Bowls	Sahani na Bakuli	f	f	t	f	t	t	f	10	Sets	Standard	Ceramic/Glass	Plate	\N	\N	\N	["new"]	{}	["Set Size", "Microwave Safe"]	3eab6ed9-46f3-4fce-8c62-810723e2c3fc
b6a936de-6762-4c01-bd3d-faf876cbe98e	2026-10-25 18:44:44.282559+00	Cups & Mugs	Vikombe na Makopo	f	f	t	f	f	f	f	10	Pieces	Standard	Ceramic	Cup	\N	\N	\N	["new"]	{}	["Capacity"]	3eab6ed9-46f3-4fce-8c62-810723e2c3fc
a6a0576f-5931-4597-8c85-60215e77518a	2026-10-25 18:44:44.282559+00	Food Containers	Vyombo vya Chakula	f	t	t	f	f	t	f	10	Pieces	Standard	Plastic/Glass	Container	\N	\N	\N	["new"]	{}	["Airtight", "BPA Free"]	c74154ea-a09f-46db-85b5-937a457cf2f7
c548e6b3-ab79-480b-811a-42bc259c16cc	2026-10-25 18:44:44.282559+00	Blenders & Mixers	Blenda na Vichanganyaji	f	f	t	t	t	t	f	2	Pieces	Standard	Plastic/Glass	Blender	\N	\N	\N	["new"]	{}	["Power (Watts)", "Warranty"]	0136503c-4a38-4fd6-b180-1ea7a0348911
36028f32-fe09-4740-b668-360f884a5abf	2026-10-25 18:44:44.282559+00	Electric Cookers	Jiko la Umeme	f	f	t	t	t	t	f	2	Pieces	Standard	Metal/Glass	Zap	\N	\N	\N	["new"]	{}	["Voltage", "Warranty"]	0136503c-4a38-4fd6-b180-1ea7a0348911
6b7c8d9e-0f1a-2b3c-4d5e-6f7a8b9c0d1e	2026-10-26 07:39:00+00	Chandeliers	Taa Kubwa za Mapambo (Chandeliers)	f	f	t	t	f	t	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Number of Bulbs", "Diameter", "Voltage"]	1c2b3a4f-5e6d-7c8b-9a0f-1e2d3c4b5a6f
7c8d9e0f-1a2b-3c4d-5e6f-7a8b9c0d1e2f	2026-10-26 07:39:00+00	LED Strip Lights	Taa za Mkanda za LED	f	f	t	f	f	f	f	10	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Length", "Color Options", "Voltage"]	2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a
8d9e0f1a-2b3c-4d5e-6f7a-8b9c0d1e2f3a	2026-10-26 07:39:00+00	Bedside Lamps	Taa za Mezani (Bedside Lamps)	f	f	t	f	f	t	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Height", "Wattage", "PowerSource"]	3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b
9e0f1a2b-3c4d-5e6f-7a8b-9c0d1e2f3a4b	2026-10-26 07:39:00+00	Garden Lights	Taa za Bustani	f	f	t	t	f	t	f	5	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["WaterproofRating", "PowerSource", "Material"]	4f5a6b7c-8d9e-0f1a-2b3c-4d5e6f7a8b9c
0f1a2b3c-4d5e-6f7a-8b9c-0d1e2f3a4b5c	2026-10-26 07:39:00+00	Bulb Holders	Vifungashio vya Taa (Holders)	f	f	f	f	f	f	f	15	\N	\N	\N	\N	\N	\N	\N	["new"]	{}	["Material", "BaseType", "Voltage"]	5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."messages" ("id", "content", "is_read", "created_at", "order_id", "receiver_id", "sender_id", "image") FROM stdin;
d1e80b2e-0ea0-4364-bc5a-e74c641f70a5	veep apoo	\N	2026-10-21 20:58:07.066463+00	\N	26b49bcc-d4e7-4563-85c5-9272fc7b39fe	0c823540-3a96-4bb8-af08-46857ff028ca	\N
f1e35988-ce5a-45db-b9ca-27ca28913138	Kama kawaida karibu kiongozi	\N	2026-10-24 18:47:37.979523+00	\N	0c823540-3a96-4bb8-af08-46857ff028ca	26b49bcc-d4e7-4563-85c5-9272fc7b39fe	\N
6bc09805-09c1-4893-8479-79b2ca5550e7	Image	\N	2026-10-24 18:48:04.970143+00	\N	0c823540-3a96-4bb8-af08-46857ff028ca	26b49bcc-d4e7-4563-85c5-9272fc7b39fe	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792867684/chat_images/wmvdul4ljebi3lqv7fne.jpg
1e8fa9eb-013f-4a80-b7f1-49eac0be8888	Nambie	\N	2026-11-01 20:58:39.114517+00	\N	0c823540-3a96-4bb8-af08-46857ff028ca	26b49bcc-d4e7-4563-85c5-9272fc7b39fe	\N
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."order_items" ("id", "product_name", "sku", "category_name", "unit_price", "quantity", "subtotal", "discount_amount", "selected_color", "selected_size", "product_image", "order_id", "product_id", "variant_id") FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."orders" ("id", "store_id", "status", "order_number", "customer_location", "customer_feedback", "payment_method", "shipping_method", "shipping_fee", "grand_total", "total_items", "customer_rating", "created_at", "updated_at", "working_date", "feedback_date", "day_of_week", "fiscal_year", "month_year", "customer_id") FROM stdin;
c3de59a1-ebce-478c-96ca-5864dbd1289f	b7797462-1b47-4934-8aa8-c9693974c648	received	ORD-4THVEIABN	chacha magige | Gongo la mboto, House No. 56 | Simu: 0610768845	\N	mobile_money	\N	0.00	45990.00	1	\N	2026-09-01 08:34:06.754592+00	\N	\N	\N	\N	\N	\N	6eaa2955-be45-4cdf-b38a-2fd8f4daf89f
\.


--
-- Data for Name: otp_codes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."otp_codes" ("id", "email", "otp", "created_at", "is_used") FROM stdin;
76438312-9663-46ef-a2d4-d50ad085604d	joshuajulius241@gmail.com	790910	2026-08-25 14:53:23.127557+00	f
79004986-4dac-4dcf-aae6-759061659430	joshuajulius241@gmail.com	873124	2026-08-25 14:53:23.126695+00	t
5fd6a572-d190-4df8-b032-3ee1f4b4dc3c	joshuajulius241@gmail.com	246431	2026-08-29 17:49:52.599868+00	f
8cc06f01-4394-44b3-91d6-adf244956d66	joshuajulius241@gmail.com	586681	2026-08-29 17:49:52.678252+00	t
3406af6f-dc58-43c6-934d-b4b161f4b10d	joshuajulius241@gmail.com	039279	2026-08-30 10:23:46.355461+00	f
edd4c5f4-1893-4eab-adf9-f2b593eb8e8d	joshuajulius241@gmail.com	448171	2026-08-30 10:23:46.27638+00	t
a6239c78-3990-44ae-9626-0e0118510f9b	joshuajulius241@gmail.com	617277	2026-08-30 14:41:41.142608+00	f
ce3f8f4e-b1ab-48fb-b952-93d8ab5c3144	joshuajulius241@gmail.com	193037	2026-08-31 08:21:37.286745+00	f
67937f7d-460b-4e82-9b7c-7863fd9e90d7	joshuajulius241@gmail.com	242938	2026-08-31 08:22:10.591702+00	f
d1adb2bc-223e-4915-8f66-3161c28b28a8	joshuajulius241@gmail.com	482450	2026-08-31 12:09:51.242953+00	f
59faa956-2bec-45b2-8d85-a766b63633f6	joshuajulius241@gmail.com	382096	2026-08-31 12:09:51.247886+00	f
3cb583db-0665-4ec1-b592-737cf85f5e31	joshuajulius241@gmail.com	516434	2026-08-31 12:10:45.478306+00	f
cf74896a-b60a-4312-b1ce-b0bd49afadc1	joshuajulius241@gmail.com	496494	2026-08-31 12:10:45.710489+00	f
373d643f-20cc-4a4b-93b8-ad11850d565c	joshuajulius241@gmail.com	768794	2026-08-31 12:14:24.348775+00	f
bd790469-b2b4-4729-afee-04f9aa08a097	joshuajulius241@gmail.com	409114	2026-08-31 12:14:25.26436+00	f
692c0e1e-8c8c-487b-8618-10d02d1ffd84	joshuajulius241@gmail.com	066401	2026-08-31 12:24:46.990492+00	f
36ab20e4-e525-4bd2-9a14-2ccef82bc14c	joshuajulius241@gmail.com	613246	2026-08-31 12:24:47.911965+00	t
b8161a55-c536-418f-a704-2cc83c262340	mwita241@gmail.com	229093	2026-09-01 11:06:20.11683+00	f
84d84994-3801-4d7d-831e-6c45e5d4cd87	mwita241@gmail.com	259478	2026-09-01 11:06:20.216929+00	f
175d4ec1-c030-4746-b476-04917973fc99	mwita241@gmail.com	265042	2026-09-01 11:09:02.744752+00	f
a0b2090e-dadb-4572-8c53-3643af759f99	mwita241@gmail.com	310149	2026-09-01 11:13:26.658889+00	f
9f98f060-41fc-434d-bee8-b30d54341d52	mwita241@gmail.com	923420	2026-09-01 11:13:26.699249+00	f
23bbf11b-7d3c-41de-ab20-d6443dde5904	joshuajulius241@gmail.com	843450	2026-09-01 11:28:44.148714+00	f
e45efca3-0a4e-4132-82d8-5cd20b42a65a	joshuajulius241@gmail.com	528197	2026-09-01 11:28:43.106761+00	t
a393faa1-e7b8-44ba-a531-0b56b263c944	joshuajulius241@gmail.com	929705	2026-09-01 13:10:26.212272+00	f
5f957599-40e6-4110-8726-b35f1826ce44	joshuajulius241@gmail.com	468768	2026-09-01 13:10:28.012518+00	t
3fbbc19f-c54a-4803-bdc5-6fccb9b5218a	changsmills@gmail.com	395985	2026-10-04 11:19:45.181805+00	f
72b5a2ff-b159-4c89-a0d3-3f2a42abe398	changsmills@gmail.com	555007	2026-10-04 11:22:58.954471+00	f
f7a4b0e0-90a6-4521-9a71-e6f4d5a2a05f	changsmills@gmail.com	769966	2026-10-04 11:24:18.302665+00	t
8b62d9ea-469f-4ad6-8ad4-7f96b9c9d3b6	changsmills@gmail.com	827619	2026-10-04 11:28:55.529343+00	f
50d7ac57-8795-4334-b5e4-a13812fb4496	changsmills@gmail.com	262574	2026-10-04 11:29:58.547326+00	f
628f20e4-8943-4e97-9bbd-396f987ae8e8	changsmills@gmail.com	209178	2026-10-04 11:30:33.252335+00	f
176bb516-9e64-4a33-8c4c-37ef6dd4a21d	changsmills@gmail.com	639107	2026-10-04 11:31:09.015632+00	f
5f166176-a530-478a-9f7f-94dc174b65e8	changsmills@gmail.com	187958	2026-10-04 11:32:35.506251+00	f
d3fad5f8-230c-4b57-b526-21fef2aee1d3	changsmills@gmail.com	114217	2026-10-04 11:35:56.345536+00	f
19795a7c-2157-4065-9edd-4425bc6f5ace	changsmills@gmail.com	551765	2026-10-04 11:59:33.068938+00	f
c1043447-6c24-476c-a390-12c4ba17f108	changsmills@gmail.com	464648	2026-10-04 12:00:12.218931+00	f
317c36eb-ea14-447d-bdbb-e005454c3b30	changsmills@gmail.com	930494	2026-10-04 12:01:06.796204+00	f
6a3f09e7-1028-45f0-8946-61dbd17a0421	changsmills@gmail.com	981700	2026-10-04 12:01:48.329952+00	f
33aad26c-7e2a-44a0-a96c-ada28b19f960	changsmills@gmail.com	666867	2026-10-04 12:08:38.062132+00	f
4d598321-0f7b-4357-b144-b8232df30349	changsmills@gmail.com	357921	2026-10-04 16:43:53.126102+00	f
086e28ef-cad6-4fc9-91d3-2003a33ca93f	changsmills@gmail.com	327702	2026-10-04 16:44:31.165151+00	f
f6de5ac0-e87a-460a-a43c-da6692292fa3	changsmills@gmail.com	877975	2026-10-04 16:47:18.134651+00	f
86f71075-4a9b-481e-8a48-236b82724cc3	changsmills@gmail.com	181073	2026-10-04 16:47:54.105917+00	f
111d3495-47bf-4ec8-851b-a555f55166a6	changsmills@gmail.com	102678	2026-10-04 16:48:38.486663+00	f
7b8e75fa-390a-4739-86df-7bc684deeed6	changsmills@gmail.com	623926	2026-10-04 16:49:16.005103+00	f
8eaef7f5-f7c0-40b2-90df-f7ac7c2c450b	changsmills@gmail.com	690537	2026-10-04 16:49:48.547419+00	f
adcce9e8-ab27-466c-81f2-31344b59e8e1	changsmills@gmail.com	494175	2026-10-04 16:50:22.178234+00	f
9f7e8f96-5288-4f80-b6d9-a67a46364eec	changsmills@gmail.com	738113	2026-10-04 16:51:39.091198+00	f
505b6b35-45f8-4a4c-bc8b-7887a829c5ad	changsmills@gmail.com	196697	2026-10-04 16:52:52.729748+00	f
c5b5185f-1ff7-4d90-85d2-453e99fbdb64	changsmills@gmail.com	100496	2026-10-04 16:54:51.509937+00	f
146c754f-b530-4104-880e-8e59fc052ad7	changsmills@gmail.com	516791	2026-10-04 16:56:27.133354+00	f
61fe41e3-f93b-45ad-b99d-47c4faa2048a	changsmills@gmail.com	435205	2026-10-04 16:58:05.796033+00	f
e6283a97-8e33-41d8-8b86-e9a36c354097	changsmills@gmail.com	938261	2026-10-04 16:58:41.480982+00	f
66c67efb-9bc9-4549-b0cb-72e2b2f476bb	changsmills@gmail.com	014077	2026-10-04 16:59:15.80083+00	f
304582b3-26ee-4bc3-a15f-edb2edb444df	changsmills@gmail.com	191533	2026-10-04 16:59:57.093001+00	f
0ca67adf-4d6e-41ad-9b35-c98f039a674b	changsmills@gmail.com	492628	2026-10-04 17:00:29.553727+00	f
0276d51d-1312-46a8-b34c-f7d57b44505b	changsmills@gmail.com	765518	2026-10-04 11:28:19.777833+00	t
b3219e2a-9dd6-4ff8-b660-c52b72435024	changsmills@gmail.com	366392	2026-10-04 17:01:14.116766+00	f
46bec1db-31e6-40e9-9b62-5a8799a77e11	changsmills@gmail.com	174412	2026-10-04 17:01:52.283549+00	f
6e56830a-9d42-4330-bd9c-6bbe4bd30118	changsmills@gmail.com	655990	2026-10-04 17:02:25.143009+00	f
faf439e5-8028-4343-90f6-736069f96db0	changsmills@gmail.com	196658	2026-10-04 17:03:04.502026+00	f
b297cea6-473a-43bb-bb04-d874633e1ce3	changsmills@gmail.com	824946	2026-10-04 17:03:40.989648+00	f
3d8614a0-9318-4904-a8c8-7763e434a4e2	changsmills@gmail.com	360512	2026-10-04 17:04:15.097364+00	f
a98fc4b9-c644-4e6b-a706-be71f3c63104	changsmills@gmail.com	791312	2026-10-04 17:04:47.740484+00	f
f0674930-b31d-47e5-b1b2-25b60f8648f2	changsmills@gmail.com	005345	2026-10-04 17:06:23.262495+00	f
9b8f56bd-d949-41ff-9b7e-bad82d8188c8	changsmills@gmail.com	639655	2026-10-04 17:07:45.644547+00	f
1049166f-4a73-4ed0-890b-3b0d4e7d0990	changsmills@gmail.com	517251	2026-10-04 17:09:31.796947+00	f
3b2f0133-c95d-4e08-b67f-ee8ecdae6a6d	changsmills@gmail.com	612383	2026-10-04 17:10:20.777247+00	f
ac52b424-8fdd-4953-8022-c3117622ac29	changsmills@gmail.com	677720	2026-10-04 17:11:25.873305+00	f
da004f7c-b1ea-4dfc-9479-a6eb7a0b9ad3	changsmills@gmail.com	318379	2026-10-08 08:49:26.426937+00	t
1cf72a7e-e995-4bd7-8d90-20f3f47d6187	joshuajulius241@gmail.com	892555	2026-10-11 04:37:56.55008+00	f
fc01b2d6-6573-4cd0-9eb4-607edf32b2df	joshuajulius241@gmail.com	158719	2026-10-11 04:38:31.663777+00	f
e7aea8a1-bd58-431d-b84d-0ca86eb79c6c	joshuajulius241@gmail.com	927665	2026-10-11 04:39:11.762361+00	f
f053ef5a-7aca-4b02-853d-c77bc58b5981	joshuajulius241@gmail.com	002362	2026-10-11 04:39:58.07319+00	f
ac2406b3-d00d-426b-9a75-9b94b4c561ec	joshuajulius241@gmail.com	937549	2026-10-11 12:15:05.547432+00	f
0a277429-b50a-4a91-a1bf-4f83da0d6330	joshuajulius241@gmail.com	526403	2026-10-11 12:15:50.727744+00	f
2bf97d65-164d-42c7-b916-90d7591062f1	joshuajulius241@gmail.com	298568	2026-10-11 12:16:25.538704+00	f
abc18700-d2be-4737-ade1-e2944180ce21	joshuajulius241@gmail.com	500288	2026-10-11 12:16:59.131187+00	f
49ce3323-938a-4492-bf06-58111950522a	joshuajulius241@gmail.com	788632	2026-10-11 12:17:33.422592+00	f
f9a923a7-6422-4ea4-9611-743ade329b87	joshuajulius241@gmail.com	063206	2026-10-11 12:18:07.711427+00	f
2c10c9fd-533d-4df1-a5ae-e0dbb0f4719c	joshuajulius241@gmail.com	036039	2026-10-11 12:18:40.234925+00	f
035322d6-56e9-4ca1-85a1-f2a55353a90f	joshuajulius241@gmail.com	572779	2026-10-11 12:23:07.823553+00	f
835ec7e1-bd34-4cf1-ba8f-ca21a36c6be1	joshuajulius241@gmail.com	570051	2026-10-11 12:23:43.744565+00	t
dac0daac-de41-4285-bcf7-0c32988f2f5f	joshuajulius241@gmail.com	123460	2026-10-11 12:24:46.124244+00	f
8384f82b-4429-498e-b177-db7dbd76fabf	changsmills@gmail.com	575899	2026-10-13 11:10:23.783442+00	f
808d851c-a422-4b7c-90f5-1206684de639	changsmills@gmail.com	734274	2026-10-13 11:11:04.604402+00	f
14e39144-1c39-4470-b467-44b699bac7b6	changsmills@gmail.com	230611	2026-10-13 11:11:37.398069+00	f
30c6e2ae-246b-4730-b0f1-ad90f3a8d609	changsmills@gmail.com	403951	2026-10-13 11:13:16.375999+00	f
a1840eaa-0dfd-4d7b-a8a6-7f8d586a1369	changsmills@gmail.com	109302	2026-10-13 11:13:52.800689+00	f
b64b85e3-5271-4d89-8b7b-74fe427e4e3d	changsmills@gmail.com	566577	2026-10-13 11:14:30.477485+00	f
51cb6167-6f4b-49e8-94e3-2b2f045fad3c	changsmills@gmail.com	853099	2026-10-13 11:15:06.013853+00	f
f25fdcec-391f-4cc6-bb7c-1296b9763263	changsmills@gmail.com	335615	2026-10-13 11:16:14.089568+00	f
91f137a0-fa41-4501-9a20-e84de3c9df57	changsmills@gmail.com	880112	2026-10-13 11:16:37.103259+00	f
507eac4a-7d84-403c-942d-2562fef5d318	changsmills@gmail.com	500172	2026-10-13 11:17:28.991146+00	f
6042f90b-e72a-4fa9-9c5b-78eb86eb0c45	changsmills@gmail.com	644631	2026-10-14 13:20:30.34361+00	f
251c4dfc-2e15-4054-9bc2-ef7256fe4268	changsmills@gmail.com	272309	2026-10-14 13:21:57.111974+00	f
9c435f7f-5444-4697-8c4c-b883146b45fb	changsmills@gmail.com	710952	2026-10-14 13:35:20.326571+00	f
b0a4521c-d2ba-43bd-83d6-fa3550424875	changsmills@gmail.com	921533	2026-10-14 13:35:19.571949+00	t
48180a8b-ea00-40cd-af47-0a343579fde9	jezitzcotz@gmail.com	690960	2026-10-14 14:06:06.910028+00	f
283f004b-c0f9-4666-9a2a-53a276c03864	jezitzcotz@gmail.com	743312	2026-10-14 14:06:06.944399+00	t
5fca1c54-60c0-425b-8e90-3c00c2b2bfd2	joshuajulius241@gmail.com	176405	2026-10-18 20:29:45.051853+00	f
1e6571a5-d19f-4ecf-b161-978005222c00	changsmills@gmail.com	258955	2026-10-18 20:30:29.065364+00	f
f1f003ea-e8d5-4f03-a1d8-13504696c4b0	changsmills@gmail.com	034893	2026-10-18 20:31:02.201914+00	f
9ddb8aee-09ab-45eb-b3ac-e6f7f9738c4e	changsmills@gmail.com	984436	2026-10-18 20:32:16.426686+00	f
ef1878a3-fa57-4b53-be93-2c13db38fa2c	changsmills@gmail.com	205975	2026-10-18 20:32:49.590176+00	f
dd94f67c-1a72-4a6e-90aa-114a6d586351	changsmills@gmail.com	470940	2026-10-18 20:33:32.570457+00	f
7d86efae-388c-4e8a-ab65-985d51130283	changsmills@gmail.com	496939	2026-10-18 20:34:07.567444+00	f
4d6149b4-0517-4910-8742-04a4fcec0162	changsmills@gmail.com	760906	2026-10-18 20:35:02.16018+00	f
c4b1a74b-4fd6-4527-b389-0825626bb7d6	changsmills@gmail.com	435697	2026-10-18 20:35:35.480777+00	f
af76da7b-512c-44e4-8948-8ffbf11dafef	changsmills@gmail.com	164135	2026-10-21 08:25:28.572578+00	f
0c2932d9-6106-442a-a0b9-418efcfed58e	changsmills@gmail.com	858402	2026-10-21 08:26:01.323906+00	f
86d7c5ae-0df0-46f7-8253-5678133d3c6f	changsmills@gmail.com	484655	2026-10-21 08:26:34.031629+00	t
\.


--
-- Data for Name: product_media; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."product_media" ("id", "media_type", "media_url", "display_order", "is_promo_video", "created_at", "product_id") FROM stdin;
bef2aa79-b372-489f-937e-ad22c409be43	cover	https://res.cloudinary.com/rlgqgsnv/image/upload/v1790937695/product_media/mdkvdiad91gejh1q2shf.webp	0	f	2026-10-02 10:41:36.444888+00	38779153-ec84-41fd-9594-34e6493c82df
7cd57c3d-ef27-48dc-8f01-1da08c6d79b3	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1790937698/product_media/hl84jzeoonmz2hb9n7st.webp	1	f	2026-10-02 10:41:38.762083+00	38779153-ec84-41fd-9594-34e6493c82df
aebdc17a-1a15-47a8-904b-cb3d6bff680a	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1790937700/product_media/lxhwyalwdzwxtkrq0etd.webp	2	f	2026-10-02 10:41:40.777785+00	38779153-ec84-41fd-9594-34e6493c82df
f4778ff9-ed64-44bd-90b4-8684b009c0d8	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1790937702/product_media/av67cuj0unilg9wybveb.webp	3	f	2026-10-02 10:41:42.613067+00	38779153-ec84-41fd-9594-34e6493c82df
a3ee9a8a-1c00-4d01-8f40-d58920313e11	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1790937704/product_media/fa9lkxqls5iwh493wrdh.webp	4	f	2026-10-02 10:41:44.694158+00	38779153-ec84-41fd-9594-34e6493c82df
bb151fbb-80b8-46cf-b138-2529be2820bd	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1790937706/product_media/fjngtxv1ouzy7pcdr5ut.webp	5	f	2026-10-02 10:41:46.858113+00	38779153-ec84-41fd-9594-34e6493c82df
3c400c38-cb2e-48f5-9202-955df573a0d4	cover	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791478108/product_media/awjuznxdrwzmzav7q3xr.webp	0	f	2026-10-08 16:48:29.470967+00	00e8052c-0b66-4f68-9cab-0b3200334f7d
8078008e-1af4-4886-8719-163206715d15	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791478110/product_media/xd5uu6tmvshur9zbbulk.webp	1	f	2026-10-08 16:48:31.576751+00	00e8052c-0b66-4f68-9cab-0b3200334f7d
21354235-183a-4523-a5db-f7a59b33408e	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791478113/product_media/f98och4pn56yuhyiy8c0.webp	2	f	2026-10-08 16:48:34.145775+00	00e8052c-0b66-4f68-9cab-0b3200334f7d
429869a3-9a84-482b-9a7f-a7bf6e57be37	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791478115/product_media/btbdppqkahnalecwwgbb.webp	3	f	2026-10-08 16:48:35.388671+00	00e8052c-0b66-4f68-9cab-0b3200334f7d
978f3ec7-9b4e-461d-95d3-b83f5468ccb9	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791478117/product_media/ucwadipywfptcpnloprq.webp	4	f	2026-10-08 16:48:37.434877+00	00e8052c-0b66-4f68-9cab-0b3200334f7d
d08bb8ee-d5b9-479a-b497-5e702b6a621b	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791478119/product_media/gvqewvalt9easnsg327z.webp	5	f	2026-10-08 16:48:39.659914+00	00e8052c-0b66-4f68-9cab-0b3200334f7d
a24f713a-a4f9-4bc5-b83b-e00f998456cb	cover	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791577061/product_media/l8xzfclzutxvrsqjosbo.webp	0	f	2026-10-09 20:17:42.332761+00	5d2c6fe5-23ac-4e44-95b6-3c57759c81d9
b4cfc5a6-a9c8-4914-8c78-2823be5d906d	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791577064/product_media/tsvqsetydnzs821nosoz.webp	1	f	2026-10-09 20:17:44.632022+00	5d2c6fe5-23ac-4e44-95b6-3c57759c81d9
81567a35-a2b8-452c-92c8-94c940678c52	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791577066/product_media/m9qpc7bp1i2nka0pyci1.webp	2	f	2026-10-09 20:17:47.629272+00	5d2c6fe5-23ac-4e44-95b6-3c57759c81d9
085bc19f-08be-4490-957c-a244423f2d08	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791577069/product_media/mqnd9v4cxvsdi2tyvgyz.webp	3	f	2026-10-09 20:17:50.29433+00	5d2c6fe5-23ac-4e44-95b6-3c57759c81d9
4cf01eb0-d18c-46d6-a03c-ddeacd748b72	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791577071/product_media/kczx86vhhsivdaqloggn.webp	4	f	2026-10-09 20:17:51.785726+00	5d2c6fe5-23ac-4e44-95b6-3c57759c81d9
4ee931cc-8577-4e91-92a6-ace277728fc1	cover	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791577929/product_media/j5dhiygiqot0jnk1wek0.webp	0	f	2026-10-09 20:32:10.563674+00	43b93ade-1f8f-4dac-a9c1-95c66ae5af77
311da846-557f-4ffa-8237-8310b5f8a7c7	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791577934/product_media/osq4584pm4f9zo4hlral.webp	1	f	2026-10-09 20:32:14.832777+00	43b93ade-1f8f-4dac-a9c1-95c66ae5af77
c35e3e47-be27-4fe6-a72e-28de1efa4c8d	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791577938/product_media/yvyrsjnea9ej1hbqql5m.webp	2	f	2026-10-09 20:32:18.957908+00	43b93ade-1f8f-4dac-a9c1-95c66ae5af77
1cfff076-26b7-40e4-94fb-b307aff03a67	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791577943/product_media/axqtonkc5xiy0k27q68r.webp	3	f	2026-10-09 20:32:23.565511+00	43b93ade-1f8f-4dac-a9c1-95c66ae5af77
0beb6f7b-c7aa-4695-a31a-d946e766f6a3	cover	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791578490/product_media/ioh7czmeyscqaa38fxrp.webp	0	f	2026-10-09 20:41:31.746807+00	ee14f0b5-9daa-41f5-b5a0-4d5377ef19dc
f9db9343-0cc4-4554-a9bb-b5ea9f954b7e	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791578496/product_media/t9fyc1lrco2vyhjqacoo.webp	1	f	2026-10-09 20:41:36.708322+00	ee14f0b5-9daa-41f5-b5a0-4d5377ef19dc
53f88bb1-9816-4904-a89c-c7b8eeee667e	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791578500/product_media/bx8y1d7ahlrjdp2vbpnc.webp	2	f	2026-10-09 20:41:41.440816+00	ee14f0b5-9daa-41f5-b5a0-4d5377ef19dc
d56b9485-5a36-4ad7-8f72-ee21172277d4	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791578505/product_media/kspqu6jqxzpf1aycbxqi.webp	3	f	2026-10-09 20:41:46.145926+00	ee14f0b5-9daa-41f5-b5a0-4d5377ef19dc
e85628b7-dc1a-4427-81ca-091e17449294	cover	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792697193/product_media/ltxvhi6j9nqyvi4vvaxo.webp	0	f	2026-10-22 19:26:34.504583+00	27f5ba83-ef19-4be3-bc23-81dc059a0bb5
95951553-fce6-4334-b7fe-835cdf17ccbd	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792697196/product_media/o4crtenb5qyuryxaxzry.webp	1	f	2026-10-22 19:26:36.531891+00	27f5ba83-ef19-4be3-bc23-81dc059a0bb5
2e6b6eed-8e32-4489-bb2f-38c66012e02d	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792697200/product_media/p1npf4oqfm1i8hphbg8n.webp	2	f	2026-10-22 19:26:40.813775+00	27f5ba83-ef19-4be3-bc23-81dc059a0bb5
4cf1bf1e-a98b-4465-ac1a-9ad70a99f545	cover	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792872019/product_media/cyln3u5whzsmbquhnm20.webp	0	f	2026-10-24 20:00:19.748254+00	01d366ad-3be2-4215-ae05-def2d75126bd
6187fb1e-7b2f-4946-ac16-c242f90e0639	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792872022/product_media/cik49kqs2ezjai4fk506.webp	1	f	2026-10-24 20:00:22.389061+00	01d366ad-3be2-4215-ae05-def2d75126bd
9164343e-27e5-48bb-935a-f02190042fbe	cover	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792872578/product_media/zlsvbhslhr2bakdqzcn1.webp	0	f	2026-10-24 20:09:38.761463+00	a26aeb9c-7809-4f31-a150-37be764dbd01
f426420f-f9cc-4f22-b2fa-516425e34711	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792872581/product_media/uckrs2qgnc5lllnn9vsn.webp	1	f	2026-10-24 20:09:41.663853+00	a26aeb9c-7809-4f31-a150-37be764dbd01
6ae6ca5c-bb5b-4e85-92fc-efadb213e659	cover	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792873412/product_media/uhwdmzcqyrxojnkipvfx.webp	0	f	2026-10-24 20:23:33.84903+00	aaefecdd-0928-4073-9003-79aca2346d56
66dcd8f6-f1c8-4311-b085-5c96efaf82fa	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792873419/product_media/qtlmndr0tazh38nrrltj.webp	1	f	2026-10-24 20:23:39.968162+00	aaefecdd-0928-4073-9003-79aca2346d56
05b78800-e1f3-4d9c-98f1-b744e8b757ed	cover	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792960125/product_media/mgpslocogogipqibwpqz.webp	0	f	2026-10-25 20:28:45.87703+00	493e468e-e7ab-45e8-8729-f51fd6234ade
0be74a36-b6ea-414c-974a-d99c551a8246	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792960126/product_media/zwgfk4utawdspfvikbq3.webp	1	f	2026-10-25 20:28:47.187208+00	493e468e-e7ab-45e8-8729-f51fd6234ade
3f83c388-8e66-47ba-ac0e-c451e37a8580	cover	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792960828/product_media/cu4fjjs6vw9ipozfg3al.webp	0	f	2026-10-25 20:40:29.249709+00	96f22ead-3c27-4394-a777-ec751d87d613
04c11e5c-ca67-4150-baec-711ed009c03f	gallery	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792960831/product_media/kxdzrgi5dhwzlbllxavb.webp	1	f	2026-10-25 20:40:32.30896+00	96f22ead-3c27-4394-a777-ec751d87d613
\.


--
-- Data for Name: product_variations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."product_variations" ("id", "sku", "color_name", "color_image", "size_value", "price", "stock_quantity", "total_stock", "marketplace_price", "marketplace_stock", "marketplace_image", "size_stock", "variant_specifications", "variant_images_array", "attributes", "created_at", "product_id") FROM stdin;
57156203-f726-42ca-ba0f-a0754bd61eb8	\N	White	product_variations/znen3rly36zhhclfqcqp	N/A	85000.00	2000	0	0.00	0	\N	{"8*8 F": 2000}	{"Color": "all colors", "color": "White", "Material": "Pure cotton"}	[]	{"Color": "all colors", "color": "White", "Material": "Pure cotton"}	2026-10-02 10:42:35.630277+00	38779153-ec84-41fd-9594-34e6493c82df
3a101ef9-6d05-478f-be89-24d447a42ac4	\N	Purple	product_variations/dgclij8xziidqjw7jjvb	N/A	85000.00	2000	0	0.00	0	\N	{"8*8 F": 2000}	{"Color": "all colors", "color": "Purple", "Material": "Pure cotton"}	[]	{"Color": "all colors", "color": "Purple", "Material": "Pure cotton"}	2026-10-02 10:42:58.950363+00	38779153-ec84-41fd-9594-34e6493c82df
c5e25811-66aa-42c1-ac63-4c52a743da7f	\N	Pink	product_variations/dlut6zs39vwfhwm12g18	N/A	85000.00	2000	0	0.00	0	\N	{"8*8 F": 2000}	{"Color": "all colors", "color": "Pink", "Material": "Pure cotton"}	[]	{"Color": "all colors", "color": "Pink", "Material": "Pure cotton"}	2026-10-02 10:43:30.459156+00	38779153-ec84-41fd-9594-34e6493c82df
a5d3a500-29ca-443c-9f52-1791f0542b7b	\N	Black	product_variations/g8mtaqr0xvjmdpmwif6k	4GB DDR4,192GB SSD,INTEL CORE I5 (7TH GEN)	450000.00	500	0	0.00	0	\N	{"4GB DDR4,192GB SSD,INTEL CORE I5 (7TH GEN)": 500}	{"RAM": "4GB DDR4", "size": "4GB DDR4,192GB SSD,INTEL CORE I5 (7TH GEN)", "color": "Black", "Weight": "Less weight", "Storage": "192GB SSD (Fast & Reliable)", "Processor": "Intel Core i5", "Battery Life": "4-6 hours"}	[]	{"RAM": "4GB DDR4", "size": "4GB DDR4,192GB SSD,INTEL CORE I5 (7TH GEN)", "color": "Black", "Weight": "Less weight", "Storage": "192GB SSD (Fast & Reliable)", "Processor": "Intel Core i5", "Battery Life": "4-6 hours"}	2026-10-08 16:48:43.981296+00	00e8052c-0b66-4f68-9cab-0b3200334f7d
eb593a12-b036-4b1d-b75c-e8efd5210a27	\N	Black	product_variations/sxyhxzzhwmfrxpnzereb	DELL LATITUDE 3180 - 4GB RAM / 128GB SSD	350000.00	2000	0	0.00	0	\N	{"DELL LATITUDE 3180 - 4GB RAM / 128GB SSD": 2000}	{"RAM": "4GB", "size": "DELL LATITUDE 3180 - 4GB RAM / 128GB SSD", "color": "Black", "Storage": "28GB SSD", "Processor": "Intel Celeron", "Battery Life": "Up to 8 Hours"}	[]	{"RAM": "4GB", "size": "DELL LATITUDE 3180 - 4GB RAM / 128GB SSD", "color": "Black", "Storage": "28GB SSD", "Processor": "Intel Celeron", "Battery Life": "Up to 8 Hours"}	2026-10-09 20:17:57.235562+00	5d2c6fe5-23ac-4e44-95b6-3c57759c81d9
f71235a8-bc68-4e5f-b07b-70e12acfeaee	\N	White	product_variations/fnamqovfhdsuusn1xchn	HP PROBOOK - CORE I3 / 4GB RAM / 128GB SSD	550000.00	1000	0	0.00	0	\N	{"HP PROBOOK - CORE I3 / 4GB RAM / 128GB SSD": 1000}	{"RAM": "4GB", "size": "HP PROBOOK - CORE I3 / 4GB RAM / 128GB SSD", "color": "White", "Weight": "less weight", "Storage": "128GB SSD", "Processor": "Intel Core i3", "Battery Life": "4 - 6 Hours"}	[]	{"RAM": "4GB", "size": "HP PROBOOK - CORE I3 / 4GB RAM / 128GB SSD", "color": "White", "Weight": "less weight", "Storage": "128GB SSD", "Processor": "Intel Core i3", "Battery Life": "4 - 6 Hours"}	2026-10-09 20:32:29.840902+00	43b93ade-1f8f-4dac-a9c1-95c66ae5af77
64ff2ece-5859-4f0e-9d49-365d53d1d96b	\N	White	product_variations/hdjhi63khordgssds9di	HP ELITEBOOK FOLIO - CORE M5 / 8GB RAM / 256GB SSD	750000.00	2000	0	0.00	0	\N	{"HP ELITEBOOK FOLIO - CORE M5 / 8GB RAM / 256GB SSD": 2000}	{"RAM": "8GB", "size": "HP ELITEBOOK FOLIO - CORE M5 / 8GB RAM / 256GB SSD", "color": "White", "Storage": "256GB SSD", "Processor": "Intel Core m5", "Battery Life": "Life: 4 - 8 Hours"}	[]	{"RAM": "8GB", "size": "HP ELITEBOOK FOLIO - CORE M5 / 8GB RAM / 256GB SSD", "color": "White", "Storage": "256GB SSD", "Processor": "Intel Core m5", "Battery Life": "Life: 4 - 8 Hours"}	2026-10-09 20:41:49.749633+00	ee14f0b5-9daa-41f5-b5a0-4d5377ef19dc
b0fcdaf8-162a-4fed-b82d-c2cd946b1f58	\N	Black	product_variations/wnmklzooy85dwizogubm	XS	25000.00	50060	0	0.00	0	\N	{"M": 25000, "S": 25000, "XS": 60}	{"size": "XS", "Color": "all", "color": "Black", "Material": "cotton"}	[]	{"size": "XS", "Color": "all", "color": "Black", "Material": "cotton"}	2026-10-22 19:26:47.051534+00	27f5ba83-ef19-4be3-bc23-81dc059a0bb5
21448103-a6bd-4cf4-a7ec-9cbd75aa00ad	\N	Black	product_variations/rdoklbkdnkskxk1zhmho	S	0.00	50060	0	0.00	0	\N	{"M": 25000, "S": 25000, "XS": 60}	{"size": "S", "Color": "all", "color": "Black", "Material": "cotton"}	[]	{"size": "S", "Color": "all", "color": "Black", "Material": "cotton"}	2026-10-22 19:26:54.661948+00	27f5ba83-ef19-4be3-bc23-81dc059a0bb5
31945d26-8d45-4431-93d6-d9f17226e605	\N	Black	product_variations/pxb7yhyi6wxvvcynfhp0	M	0.00	50060	0	0.00	0	\N	{"M": 25000, "S": 25000, "XS": 60}	{"size": "M", "Color": "all", "color": "Black", "Material": "cotton"}	[]	{"size": "M", "Color": "all", "color": "Black", "Material": "cotton"}	2026-10-22 19:26:58.377812+00	27f5ba83-ef19-4be3-bc23-81dc059a0bb5
ffe0c95a-20d3-4cdd-b8af-3b7be9e773c5	\N	Gray	product_variations/zo1ppchnkfowzkiudb2b	1000W	1600000.00	0	0	0.00	0	\N	{"1000W": 0}	{"size": "1000W", "color": "Gray", "Weight": "35 kg", "Impedance": "8 Ohms", "Power Output": "1000W", "Frequency Range": "35Hz - 250Hz"}	[]	{"size": "1000W", "color": "Gray", "Weight": "35 kg", "Impedance": "8 Ohms", "Power Output": "1000W", "Frequency Range": "35Hz - 250Hz"}	2026-10-24 20:00:31.630791+00	01d366ad-3be2-4215-ae05-def2d75126bd
3a40534b-b9c2-462d-88f0-a669c9e42242	\N	Gray	product_variations/qiwkp8ot7it4dm86hyqz	1000W - 1500W	1400000.00	5000	0	0.00	0	\N	{"1000W - 1500W": 5000}	{"size": "1000W - 1500W", "color": "Gray", "Channels": "1000W", "Connectivity": "8 Ohms", "Power Output": "50Hz - 20kHz"}	[]	{"size": "1000W - 1500W", "color": "Gray", "Channels": "1000W", "Connectivity": "8 Ohms", "Power Output": "50Hz - 20kHz"}	2026-10-24 20:09:46.500758+00	a26aeb9c-7809-4f31-a150-37be764dbd01
f85ce898-2437-417a-8404-de8390cb6616	\N	Gray	product_variations/neyiw0j9fstehhgwp26i	1 SET	370000.00	600	0	0.00	0	\N	{"1 SET": 600}	{"size": "1 SET", "Range": "50-100 Meters", "color": "Gray", "Battery Life": "6-8 Hours", "Frequency Range": "UHF (470-960MHz)"}	[]	{"size": "1 SET", "Range": "50-100 Meters", "color": "Gray", "Battery Life": "6-8 Hours", "Frequency Range": "UHF (470-960MHz)"}	2026-10-24 20:23:45.600286+00	aaefecdd-0928-4073-9003-79aca2346d56
efca5107-4ac1-4969-835b-a40033e878d5	\N	Black	product_variations/x2apgfkdocyzdgn2nx04	1 FULL SET	154992.00	200	0	0.00	0	\N	{"1 FULL SET": 200}	{"size": "1 FULL SET", "Power": "Watts", "color": "Black", "Warranty": "6 Month"}	[]	{"size": "1 FULL SET", "Power": "Watts", "color": "Black", "Warranty": "6 Month"}	2026-10-25 20:28:52.037259+00	493e468e-e7ab-45e8-8729-f51fd6234ade
cc55bb6e-4639-4f63-961c-d454a491a225	\N	Silver	product_variations/fpykxe7p09jturqjfglm	1 SET	80000.00	0	0	0.00	0	\N	{"1 SET": 0}	{"size": "1 SET", "Power": "Watts", "color": "Silver", "Warranty": "6 Month"}	[]	{"size": "1 SET", "Power": "Watts", "color": "Silver", "Warranty": "6 Month"}	2026-10-25 20:40:39.338963+00	96f22ead-3c27-4394-a777-ec751d87d613
\.


--
-- Data for Name: products_engines; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."products_engines" ("id", "brand_id", "name", "sku", "barcode", "description", "cover_image", "price", "original_price", "stock_quantity", "compare_at_price", "specifications", "price_tiers", "colors", "size_stock", "available_sizes", "dimensions", "target_audience", "is_wholesale", "is_retail", "is_approved", "is_featured", "is_flash_sale", "enable_sizes", "has_colors", "enable_pickup", "shipping_method", "shipping_cost", "shipping_rate_per_km", "shipping_base_fee", "shipping_default_distance", "shipping_dar_cost", "shipping_outside_dar_cost", "shipping_remote_cost", "total_stock_cost", "expected_total_profit", "maintenance_fee", "gender", "warranty_months", "weight", "weight_unit", "store_address", "material", "moq", "views", "order_count", "average_rating", "total_reviews", "size_format", "condition", "engine_index", "price_per_meter", "price_per_foot", "created_at", "sale_end_date", "offer_started_at", "approved_at", "approved_by", "fee_due_date", "leaf_category_id", "parent_category_id", "user_id", "category_id", "discount", "store_id") FROM stdin;
00e8052c-0b66-4f68-9cab-0b3200334f7d	\N	nec versapro 2-in-1	SKU-1791478095839-f6pp1e	\N	NEC VersaPro 2-in-1 Laptop featuring 4GB RAM and a high-speed 192GB SSD, equipped with a 360┬░ foldable touchscreen that converts seamlessly between laptop and tablet mode for your everyday tasks	product_media/awjuznxdrwzmzav7q3xr	450000.00	0.00	0	0.00	{"RAM": "4GB DDR4", "Weight": "Less weight", "Storage": "192GB SSD (Fast & Reliable)", "Processor": "Intel Core i5", "Battery Life": "4-6 hours"}	[]	["Black"]	{"Black": {"4GB DDR4,192GB SSD,INTEL CORE I5 (7TH GEN)": 500}}	[]	{"width": "", "height": "", "length": ""}	[]	f	t	f	f	f	f	t	f	fixed	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	[]	0	0.00	\N	\N	\N	1	0	0	0.00	0	free	new	0	0.00	0.00	2026-10-08 16:48:27.969062+00	\N	\N	\N	\N	\N	d4e5f6a7-7777-4d5e-bf6a-777700000002	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a	63dc44f8-5c3a-41b4-affd-ff41395beaea	b2c3d4e5-7777-4b3c-9d4e-777788889999	0.00	b6bcb321-4f0b-4146-9332-82254e694e08
5d2c6fe5-23ac-4e44-95b6-3c57759c81d9	\N	dell latitude 3180	SKU-1791577002446-at3nc7	\N	A durable Dell Latitude 3180 laptop in great condition featuring 4GB RAM, a 128GB SSD, and Windows 10 OS, coming complete with its original charger	product_media/l8xzfclzutxvrsqjosbo	350000.00	0.00	0	0.00	{"RAM": "4GB", "Storage": "28GB SSD", "Processor": "Intel Celeron", "Battery Life": "Up to 8 Hours"}	[]	["Black"]	{"Black": {"DELL LATITUDE 3180 - 4GB RAM / 128GB SSD": 2000}}	[]	{"width": "", "height": "", "length": ""}	[]	f	t	f	f	f	f	t	f	fixed	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	[]	0	0.00	\N	\N	\N	1	0	0	0.00	0	free	new	0	0.00	0.00	2026-10-09 20:17:40.93293+00	\N	\N	\N	\N	\N	f6a7b8c9-7777-4f70-d18c-777700000004	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a	63dc44f8-5c3a-41b4-affd-ff41395beaea	b2c3d4e5-7777-4b3c-9d4e-777788889999	0.00	b6bcb321-4f0b-4146-9332-82254e694e08
43b93ade-1f8f-4dac-a9c1-95c66ae5af77	\N	hp probook	SKU-1791577909623-qcdnri	\N	A clean HP ProBook laptop featuring an Intel Core i3 processor, 4GB RAM, 128GB SSD storage, and a 14-inch display, equipped with all essential ports	product_media/j5dhiygiqot0jnk1wek0	550000.00	0.00	0	0.00	{"RAM": "4GB", "Weight": "less weight", "Storage": "128GB SSD", "Processor": "Intel Core i3", "Battery Life": "4 - 6 Hours"}	[]	["White"]	{"White": {"HP PROBOOK - CORE I3 / 4GB RAM / 128GB SSD": 1000}}	[]	{"width": "", "height": "", "length": ""}	[]	f	t	f	f	f	f	t	f	fixed	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	[]	0	0.00	\N	\N	\N	1	1	0	0.00	0	free	new	0	0.00	0.00	2026-10-09 20:32:08.562254+00	\N	\N	\N	\N	\N	d4e5f6a7-7777-4d5e-bf6a-777700000002	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a	63dc44f8-5c3a-41b4-affd-ff41395beaea	b2c3d4e5-7777-4b3c-9d4e-777788889999	0.00	b6bcb321-4f0b-4146-9332-82254e694e08
ee14f0b5-9daa-41f5-b5a0-4d5377ef19dc	\N	hp elitebook folio touch screen	SKU-1791578485417-7r36rg	\N	A sleek HP EliteBook Folio featuring a Touch Screen display, Intel Core m5 processor, 8GB RAM, and 256GB SSD storage, in a very slim and portable design	product_media/ioh7czmeyscqaa38fxrp	750000.00	0.00	0	0.00	{"RAM": "8GB", "Storage": "256GB SSD", "Processor": "Intel Core m5", "Battery Life": "Life: 4 - 8 Hours"}	[]	["White"]	{"White": {"HP ELITEBOOK FOLIO - CORE M5 / 8GB RAM / 256GB SSD": 2000}}	[]	{"width": "", "height": "", "length": ""}	[]	f	t	f	f	f	f	t	f	fixed	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	[]	0	0.00	\N	\N	\N	1	2	0	0.00	0	free	new	0	0.00	0.00	2026-10-09 20:41:29.815397+00	\N	\N	\N	\N	\N	b4c5d6e7-7777-4778-f9f4-777700000012	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a	63dc44f8-5c3a-41b4-affd-ff41395beaea	b2c3d4e5-7777-4b3c-9d4e-777788889999	0.00	b6bcb321-4f0b-4146-9332-82254e694e08
27f5ba83-ef19-4be3-bc23-81dc059a0bb5	\N	knit sweater	SKU-1792697179706-agxpn7	\N	Men's Clothing au Women's Clothing (Kwa kuwa ni Oversized, mara nyingi huwa ni Unisex).	product_media/ltxvhi6j9nqyvi4vvaxo	25000.00	0.00	0	0.00	{"Color": "all", "Material": "cotton"}	[]	["Black"]	{"Black": {"M": 25000, "S": 25000, "XS": 60}}	[]	{"width": "", "height": "", "length": ""}	[]	f	t	f	f	f	f	t	f	fixed	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	[]	0	0.00	\N	\N	\N	1	0	0	0.00	0	Standard	new	0	0.00	0.00	2026-10-22 19:26:33.004127+00	\N	\N	\N	\N	\N	841e9065-9adc-4ba9-80b1-d9caef8fcc79	925e698a-9035-4cd6-9e63-f3651267443c	26b49bcc-d4e7-4563-85c5-9272fc7b39fe	6cff2a9a-d920-44c8-9949-c8c61a0c1f0c	0.00	17f0f0cd-fa4e-4a24-86ce-3854232a4603
38779153-ec84-41fd-9594-34e6493c82df	\N	cotton bed sheets	SKU-1790937683518-dhqxzt	\N	100% Pure Cotton ΓÇô Soft, durable & breathable, Complete Set ΓÇô 2 Bed Sheets + 4 Pillowcases, High Quality ΓÇô Fade-resistant & long-lasting, Perfect for: Home, Hotels & Gifts	product_media/mdkvdiad91gejh1q2shf	85000.00	0.00	0	0.00	{"Color": "all colors", "Material": "Pure cotton"}	[{"to_qty": "5", "from_qty": "2", "unit_price": "80000"}, {"to_qty": "2000", "from_qty": "6", "unit_price": "75000"}]	["White", "Purple", "Pink"]	{"Pink": {"8*8 F": 2000}, "White": {"8*8 F": 2000}, "Purple": {"8*8 F": 2000}}	[]	{"width": "", "height": "", "length": ""}	[]	t	t	f	f	f	f	t	f	fixed	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	[]	0	0.00	\N	\N	\N	1	3	0	5.00	1	length	new	0	0.00	0.00	2026-10-02 10:41:34.988272+00	\N	\N	\N	\N	\N	c8fd8194-aec7-4391-9594-cde9b612fa85	925e698a-9035-4cd6-9e63-f3651267443c	26b49bcc-d4e7-4563-85c5-9272fc7b39fe	6cff2a9a-d920-44c8-9949-c8c61a0c1f0c	0.00	17f0f0cd-fa4e-4a24-86ce-3854232a4603
01d366ad-3be2-4215-ae05-def2d75126bd	\N	subwoofer speaker	SKU-1792872011216-xv05rw	\N	Spika hii ni Subwoofer ya kiwango cha juu (Professional PA Speaker). Imeundwa kwa teknolojia ya 'Light Weight Heavy Duty' ΓÇö ni nyepesi kubebeka lakini inatoa sauti nzito na safi ya Bass inayofaa matukio, DJ, na kumbi za muziki. Ina vishikio (handles) kwa urahisi wa kusafirisha. Ubora wa hali ya juu!	product_media/cyln3u5whzsmbquhnm20	1600000.00	0.00	0	0.00	{"Weight": "35 kg", "Impedance": "8 Ohms", "Power Output": "1000W", "Frequency Range": "35Hz - 250Hz"}	[]	["Gray"]	{"Gray": {"1000W": 0}}	[]	{"width": "", "height": "", "length": ""}	[]	f	t	f	f	f	f	t	f	fixed	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	[]	0	0.00	\N	\N	\N	1	0	0	0.00	0	dimensions	new	0	0.00	0.00	2026-10-24 20:00:18.228117+00	\N	\N	\N	\N	\N	64bf27a4-f11f-4df1-8605-57d73f6d4e38	9ef74a44-bb94-43e9-96c8-ca7a4fee334d	7f5d2d65-51c5-421d-8853-85f6eced05eb	71ad562a-d519-4034-85e2-fcb3a4bdf59f	0.00	fb7e27b4-9a2f-469d-a6f7-8defffe3fded
a26aeb9c-7809-4f31-a150-37be764dbd01	\N	double mid speaker	SKU-1792872573391-by8vp2	\N	Spika hii ni aina ya BV 215 (Double Mid Speaker) inayotumika kwa ajili ya kusambaza sauti safi ya wazi (vocals) na muziki. Ina vipaza sauti viwili vikubwa vya inchi 15 ndani yake. Inafaa sana kuunganishwa na Subwoofer kwa ajili ya matukio makubwa, makanisa, na kumbi za muziki. Inakuja na gridi imara ya chuma na vishikio vya pembeni kwa urahisi wa kubebwa.	product_media/zlsvbhslhr2bakdqzcn1	1400000.00	0.00	0	0.00	{"Channels": "1000W", "Connectivity": "8 Ohms", "Power Output": "50Hz - 20kHz"}	[]	["Gray"]	{"Gray": {"1000W - 1500W": 5000}}	[]	{"width": "", "height": "", "length": ""}	[]	f	t	f	f	f	f	t	f	fixed	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	[]	0	0.00	\N	\N	\N	1	1	0	0.00	0	dimensions	new	0	0.00	0.00	2026-10-24 20:09:37.695268+00	\N	\N	\N	\N	\N	8cd30101-f36f-4aa1-adfd-98fc47528c9a	9ef74a44-bb94-43e9-96c8-ca7a4fee334d	7f5d2d65-51c5-421d-8853-85f6eced05eb	71ad562a-d519-4034-85e2-fcb3a4bdf59f	0.00	fb7e27b4-9a2f-469d-a6f7-8defffe3fded
aaefecdd-0928-4073-9003-79aca2346d56	\N	jbl wireless microphone set	SKU-1792873403212-ictlf6	\N	Seti kamili ya maikrofoni mbili (2) zisizo na waya (Wireless) kutoka JBL. Inakuja na kifaa cha kupokea sauti (Receiver) chenye kioo (LCD Display), antenna mbili za nguvu, betri za kutoshea kwenye maikrofoni, chaja, na kebo ya sauti. Ni bora kwa ajili ya matukio, sherehe, makanisa, na mikutano. Sauti ni safi na haina usumbufu wa waya.	product_media/uhwdmzcqyrxojnkipvfx	370000.00	0.00	0	0.00	{"Range": "50-100 Meters", "Battery Life": "6-8 Hours", "Frequency Range": "UHF (470-960MHz)"}	[]	["Gray"]	{"Gray": {"1 SET": 600}}	[]	{"width": "", "height": "", "length": ""}	[]	f	t	f	f	f	f	t	f	fixed	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	[]	0	0.00	\N	\N	\N	1	1	0	0.00	0	dimensions	new	0	0.00	0.00	2026-10-24 20:23:31.85477+00	\N	\N	\N	\N	\N	a9a4ba73-34bc-482b-8193-4ad17a6ab757	9ef74a44-bb94-43e9-96c8-ca7a4fee334d	7f5d2d65-51c5-421d-8853-85f6eced05eb	2fc2dcda-074f-4cc2-b0ea-9d94e1d69462	0.00	fb7e27b4-9a2f-469d-a6f7-8defffe3fded
96f22ead-3c27-4394-a777-ec751d87d613	\N	blender silver crest	SKU-1792960821355-k1e89d	\N	Blender ya kisasa kutoka Silver Crest (German Technology). Inakuja na vyombo viwili (Blender jar kubwa na Extra Mill Jar ndogo ya kusagia viungo, kahawa au karanga). Ina nguvu ya 5500W, ina visu vya chuma cha pua (stainless steel) na ina kasi mbalimbali za kuchanganya. Inafaa kwa kusaga matunda, kusaga barafu, na kupikia. Ubora wa hali ya juu.	product_media/cu4fjjs6vw9ipozfg3al	80000.00	0.00	0	0.00	{"Power": "Watts", "Warranty": "6 Month"}	[]	["Silver"]	{"Silver": {"1 SET": 0}}	[]	{"width": "", "height": "", "length": ""}	[]	f	t	f	f	f	f	t	f	fixed	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	[]	0	0.00	\N	\N	\N	1	0	0	0.00	0	length	new	0	0.00	0.00	2026-10-25 20:40:27.040056+00	\N	\N	\N	\N	\N	c548e6b3-ab79-480b-811a-42bc259c16cc	754eaf89-2ff3-43bb-b5aa-7afb7b0dd480	7ad572fb-2ecb-4ddf-86db-72680bfd8774	0136503c-4a38-4fd6-b180-1ea7a0348911	0.00	e0b27156-613e-4b03-8f55-aba6c0005950
493e468e-e7ab-45e8-8729-f51fd6234ade	\N	blender kenwood 8-in-1 multi-purpose	SKU-1792960121546-qgpkvh	\N	Pata Blender bora ya Kenwood ya aina yake! Hii ni Kenwood 8-in-1 Multi-Purpose, inayokuja na vyombo mbalimbali vya kukusaidia jikoni, Seti hii inajumuisha Blender Jug, Meat Grinder, Citrus Juicer, Grinder Mill, Slicing & Shredding blades	product_media/mgpslocogogipqibwpqz	155000.00	0.00	0	0.00	{"Power": "Watts", "Warranty": "6 Month"}	[]	["Black"]	{"Black": {"1 FULL SET": 200}}	[]	{"width": "", "height": "", "length": ""}	[]	f	t	f	f	f	f	t	f	fixed	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	0.00	[]	0	0.00	\N	\N	\N	1	0	0	0.00	0	Standard	new	0	0.00	0.00	2026-10-25 20:28:44.702399+00	\N	\N	\N	\N	\N	c548e6b3-ab79-480b-811a-42bc259c16cc	754eaf89-2ff3-43bb-b5aa-7afb7b0dd480	7ad572fb-2ecb-4ddf-86db-72680bfd8774	0136503c-4a38-4fd6-b180-1ea7a0348911	0.00	e0b27156-613e-4b03-8f55-aba6c0005950
\.


--
-- Data for Name: profiles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."profiles" ("id", "full_name", "avatar_url", "updated_at", "username", "bio", "email", "role", "user_id", "is_otp_verified", "latitude", "longitude") FROM stdin;
e5b889f1-86e6-4f9c-a096-62c496aab1ea	Zawad Gordon	\N	2026-09-04 20:39:30.129592+00	\N	\N	\N	buyer	11	f	\N	\N
0c823540-3a96-4bb8-af08-46857ff028ca	skyfallcotz	\N	2026-10-04 16:31:42.149164+00	\N	\N	\N	super_admin	18	f	\N	\N
262d7ba0-8540-4de3-ad6f-67e4b286b6d5	Paul Magige	\N	2026-10-07 01:37:12.855158+00	\N	\N	\N	buyer	19	f	\N	\N
26b49bcc-d4e7-4563-85c5-9272fc7b39fe	Changsmill_storetz	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791722444/profile_avatars/mws1kkt8q5emaob9val3.png	2026-10-11 12:40:44.709759+00	Changsmill_storetz	bora na imara sana	\N	supplier	1	t	\N	\N
6eaa2955-be45-4cdf-b38a-2fd8f4daf89f	mwita	https://res.cloudinary.com/rlgqgsnv/image/upload/v1788163587/profile_avatars/q3olv8csptb46dsqvyba.jpg	2026-09-03 10:46:23.767003+00	Mwita		\N	supplier	9	f	\N	\N
f335b90f-a698-45d5-930d-ec55b69d3c9a	Karim Penuel	\N	2026-09-04 21:23:16.362527+00	\N	\N	\N	buyer	12	f	\N	\N
94e54ed1-afbd-416d-854c-cbbb285a6460	Jezitz Cotz	\N	2026-10-14 14:06:58.351668+00	Jezitz Cotz	\N	jezitzcotz@gmail.com	supplier	20	t	\N	\N
3fc9f9a1-18f8-4904-b260-379d119f6071	bates deft	\N	2026-09-20 17:14:18.860848+00	\N	\N	\N	buyer	13	f	\N	\N
316e799d-e7e1-4e8a-89f5-3f69b4c8d8a1	mimi hapa	\N	2026-09-29 20:28:01.791145+00	\N	\N	\N	buyer	14	f	\N	\N
c5ce1829-bad9-4490-a5a7-ef69065ba834	Emmanuel	\N	2026-10-01 17:41:43.868381+00	\N	\N	\N	buyer	15	f	\N	\N
7f5d2d65-51c5-421d-8853-85f6eced05eb	Bing song center	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792058574/profile_avatars/saztti97duitocplegbd.jpg	2026-10-15 10:04:10.990644+00	Bing song center	Wauzaji wa vifaa vyote vya muziki nchini Tanzania karibu sana	\N	supplier	21	t	\N	\N
14930a85-3c77-452b-9dee-6bafcf6a0b2e	Vyombotz Cotz	\N	2026-10-16 04:45:28.703653+00	\N	\N	\N	buyer	22	f	\N	\N
63dc44f8-5c3a-41b4-affd-ff41395beaea	Changs Mills	\N	2026-10-21 08:27:07.706958+00	\N	\N	\N	supplier	16	t	\N	\N
7ad572fb-2ecb-4ddf-86db-72680bfd8774	Vyombo Cotz	\N	2026-10-25 19:44:46.216143+00	\N	\N	\N	supplier	29	t	\N	\N
816a3a5f-281a-49a9-b2c0-f0480a7e42a5	Vifaavyaumemetz Cotz	\N	2026-10-26 06:57:46.2336+00	\N	\N	\N	supplier	24	t	\N	\N
4f8af147-4abc-4cfe-ae97-f8ba7d8dd60a	Nishatimbadalatz Cotz	\N	2026-10-26 10:04:31.867554+00	\N	\N	\N	supplier	25	t	\N	\N
d043924d-d9b0-46f1-9b27-dbf0673d7e22	Urembotz Cotz	\N	2026-10-26 10:43:57.376192+00	\N	\N	\N	supplier	26	t	\N	\N
a878940d-8532-4fa0-9487-928c4f4e1997	Vitotz Cotz	\N	2026-10-26 11:21:46.408591+00	\N	\N	\N	supplier	27	t	\N	\N
ed20d736-dfd4-4f0e-80fe-18987a7a78f3	Nguovifaatz Cotz	\N	2026-10-26 11:42:36.677162+00	\N	\N	\N	supplier	28	t	\N	\N
98639d14-03b9-4027-8a99-55b0f3966931	Mwangatz Cotz	\N	2026-10-26 14:56:26.725442+00	\N	\N	\N	supplier	30	t	\N	\N
8fa5cf7e-11ef-4611-956f-eef32ae25cf5	Mazoezitz Cotz	\N	2026-10-26 15:18:06.303071+00	\N	\N	\N	supplier	31	t	\N	\N
72fef55d-6a28-45a5-be94-1be31907408d	Begipochitz Cotz	\N	2026-10-26 15:42:10.480192+00	\N	\N	\N	supplier	32	t	\N	\N
cdb9d770-df08-411b-bc1a-f9b76c3b36ca	Phonetz Cotz	\N	2026-10-26 17:57:10.832947+00	\N	\N	\N	supplier	23	t	\N	\N
\.


--
-- Data for Name: shipping_methods; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."shipping_methods" ("id", "label", "description", "price_local", "price_national", "is_active", "created_at", "store_id") FROM stdin;
\.


--
-- Data for Name: socialaccount_socialaccount; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."socialaccount_socialaccount" ("id", "provider", "uid", "last_login", "date_joined", "extra_data", "user_id") FROM stdin;
\.


--
-- Data for Name: socialaccount_socialapp; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."socialaccount_socialapp" ("id", "provider", "name", "client_id", "secret", "key", "provider_id", "settings") FROM stdin;
\.


--
-- Data for Name: socialaccount_socialapp_sites; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."socialaccount_socialapp_sites" ("id", "socialapp_id", "site_id") FROM stdin;
\.


--
-- Data for Name: socialaccount_socialtoken; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."socialaccount_socialtoken" ("id", "token", "token_secret", "expires_at", "account_id", "app_id") FROM stdin;
\.


--
-- Data for Name: stores_engine; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."stores_engine" ("id", "is_verified", "business_type", "tin_number", "phone_number", "email", "physical_address", "city", "lead_time", "moq", "tin_image", "google_maps_url", "packaging_type", "supply_capacity", "store_name", "store_slug", "store_banner", "description", "store_logo", "instagram_handle", "whatsapp_number", "specialist_tags", "youtube_link", "status", "twitter_handle", "tiktok_handle", "working_hours", "is_active", "office_image_1", "office_image_2", "office_image_3", "sub_category_ids", "store_index", "created_at", "total_sales", "average_rating", "verification_status", "category_id", "owner_id", "latitude", "longitude") FROM stdin;
a61c2cc3-b205-4235-b743-7b860a3a9b35	t	Wholesale & Retail	003-003-003	0754394845	jezitzcotz@gmail.com	Msimbazi,Kariakoo	Dar es Salaam	Saa 24	1 PC	tin_verification/eemphhk7l5dpqkq8u1im	https://maps.app.goo.gl/9Njm7z27eGssUZHy6	Boxes	5,000 pcs	Jezi Store tz	jezi-store-tz	store_banners/denmark1.webp	We deal in high-quality sports jerseys, football kits, and athletic wear for various teams and clubs at both wholesale and retail prices.		@skyfall_tz	0754394845	["Football Jersey Specialist", "Sports Kits Supplier", "Jezi Expert"]	https://youtube.com/@joshuajulius-bi4lq?si=jSvn2tLTZ48R87sf	active	@skyfall_tz	@skyfall_tz	\N	f	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791584573/store_offices/pbydcd6aei3jrkdffdbx.webp	\N	\N	["05483a18-d3d2-4e67-99ea-b4ab83413798"]	0	2026-10-09 22:22:36.709388+00	0.00	0.00	approved	6a721858-9f9b-43b6-8294-9d53cce813d0	94e54ed1-afbd-416d-854c-cbbb285a6460	\N	\N
17f0f0cd-fa4e-4a24-86ce-3854232a4603	t	Wholesale & Retail	001-001-001	0610768845	joshuajulius241@gmail.com	Kariakoo	Dar es Salaam	Saa 24	1 PC	tin_verification/fokwqeaji91boynuyw0g	https://maps.app.goo.gl/ufuTnt62pKR1TUGx7	Boxes	5,000PC	Target Mashuka Store	target-mashuka-store	store_banners/Gemini_Generated_Image_ykbk5vykbk5vykbk.webp	Supplier of Premium Pure Cotton Bedding from Uganda. We offer high-quality bed sheets and pillowcases (Shuka 2 & Foronya 4) in various sizes and colors. Wholesale and Retail available. Quality guaranteed!		@skyfall_tz	0610768845	[]	https://youtube.com/@joshuajulius-bi4lq?si=jSvn2tLTZ48R87sf	active	@skyfall_tz	@skyfall_tz	\N	f	https://res.cloudinary.com/rlgqgsnv/image/upload/v1790934883/store_offices/fgtpvvn4tsaykrvnew2p.webp	\N	\N	["6cff2a9a-d920-44c8-9949-c8c61a0c1f0c"]	0	2026-10-02 09:54:41.335126+00	0.00	0.00	approved	925e698a-9035-4cd6-9e63-f3651267443c	26b49bcc-d4e7-4563-85c5-9272fc7b39fe	\N	\N
b6bcb321-4f0b-4146-9332-82254e694e08	t	Wholesale & Retail	002-002-002	0610768845	changsmills@gmail.com	Kariakoo, Agrey	Dar es Salaam	Saa 24	1 PC	tin_verification/iogtnc37eqadfnwc2eql	https://maps.app.goo.gl/MYT6CnxhNZ2dWNNGA	Boxes	5000PC	Smart Products tz	smart-products-tz	store_banners/Gemini_Generated_Image_ufs6c7ufs6c7ufs6.webp	Computer Hardware & Software Experts. Laptops, Desktops, Repairs & Accessories. Best Prices		@skyfall_tz	0610768845	["Computer Hardware Expert", "Computer Accessories Supplier", "Software Specialist"]	https://youtube.com/@joshuajulius-bi4lq?si=jSvn2tLTZ48R87sf	active	@skyfall_tz	@skyfall_tz	\N	f	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791112571/store_offices/flmu9qt95ysi7blcaskw.webp	\N	\N	["b2c3d4e5-7777-4b3c-9d4e-777788889999"]	0	2026-10-04 11:16:09.739684+00	0.00	0.00	approved	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a	63dc44f8-5c3a-41b4-affd-ff41395beaea	\N	\N
e0b27156-613e-4b03-8f55-aba6c0005950	t	Wholesale & Retail	005-005-005	0754394845	joshuajulius241@gmail.com	Agrey, Kariakoo	Dar es Salaam	Saa 24	1 PC	tin_verification/wqe2u2oaaqqxcsjbb3ep	https://maps.app.goo.gl/dBh5vA55QhrJ2nJi7	Boxes	50 Dozen	Home & Kitchen Collection	home-kitchen-collection		Karibu kwenye duka letu la Home & Kitchen! Sisi ni wataalamu wa kukuletea kila kitu unachohitaji jikoni mwako. Kutoka kwa masufuria ya kisasa, vikaangio visivyoshika, hadi vifaa vya umeme kama blenda na majiko. Tunauza bidhaa zilizothibitishwa na zenye dhamana (warranty) ili kukurahisishia maisha ya kila siku. Pata bidhaa bora kwa bei mkononi!		@skyfall_tz	0754394845	["Quality Kitchenware", "Home & Kitchen"]	https://youtube.com/@joshuajulius-bi4lq?si=jSvn2tLTZ48R87sf	active	@skyfall_tz	@skyfall_tz	\N	t	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792956824/store_offices/slotpaf7djpudciojj6s.webp	\N	\N	["445fe3b7-7acc-470c-a304-b5dd003b976e", "0136503c-4a38-4fd6-b180-1ea7a0348911", "d2a29dc9-a387-4225-9ad1-2151d1313cdd"]	0	2026-10-25 19:33:42.42046+00	0.00	0.00	approved	754eaf89-2ff3-43bb-b5aa-7afb7b0dd480	7ad572fb-2ecb-4ddf-86db-72680bfd8774	\N	\N
fb7e27b4-9a2f-469d-a6f7-8defffe3fded	t	Wholesale & Retail	004-004-004	0610768845	musictzcotz@gmail.com	Kariakoo	Dar es Salaam	Saa 24	1 PC	tin_verification/atutepmh2qnkpjvlvner	https://maps.app.goo.gl/6k27PC71QR4qtTor7	Boxes	5000 PC	Bing Song Center	bing-song-center	store_banners/IMG-20261012-WA0008.webp	Welcome to Bing Song Center! We sell high-quality music and sound equipment ΓÇö speakers, subwoofers, microphones, amplifiers, mixers, and DJ gear. All our products are top quality and affordably priced. We serve events, music venues, studios, and homes. Let's grow your music together!		@skyfall_tz	0754394845	["Bass Speaker", "Audio Equipment"]	https://youtube.com/@joshuajulius-bi4lq?si=jSvn2tLTZ48R87sf	active	@skyfall_tz	@skyfall_tz	\N	f	https://res.cloudinary.com/rlgqgsnv/image/upload/v1791996050/store_offices/bcjewdspqai7hxjufxuc.webp	\N	\N	["71ad562a-d519-4034-85e2-fcb3a4bdf59f", "2fc2dcda-074f-4cc2-b0ea-9d94e1d69462"]	0	2026-10-14 16:40:48.343848+00	0.00	0.00	approved	9ef74a44-bb94-43e9-96c8-ca7a4fee334d	7f5d2d65-51c5-421d-8853-85f6eced05eb	\N	\N
ea120c59-bd62-4c53-9b30-b21c919bfb55	t	Wholesale & Retail	006-006-006	0754394845	joshuajulius241@gmail.com	Aggey, Kariakoo	Dar es Salaam	Saa 24	1 PC	tin_verification/chpeyccp9udwclgsojiy	https://maps.app.goo.gl/bovy4QkxzpDxyJkg6	Boxes	500Pcs	Home & Industrial Electricals Collection	home-industrial-electricals-collection		Sisi ni wataalamu wa kuuza vifaa bora vya umeme, zikiwemo nyaya za viwandani, vikatiza mzunguko (circuit breakers), switchi, na vifaa vya usambazaji wa umeme kwa matumizi ya nyumbani na viwandani.		@skyfall_tz	0754394845	["Electrical Specialist", "Wiring & Cables Expert", "Home & Industrial Electricals"]	https://youtube.com/@joshuajulius-bi4lq?si=jSvn2tLTZ48R87sf	active	@skyfall_tz	@skyfall_tz	\N	f	https://res.cloudinary.com/rlgqgsnv/image/upload/v1792997548/store_offices/j6ghamdfzavpisb2bctz.webp	\N	\N	["90ae28d4-2b5e-4680-b1f2-32f68c2014dd", "e269cb8c-5a0d-4447-ab96-4e6eec25d278", "48daff56-14d6-4285-b003-de894dd6365d", "c92b4fde-25e1-49c6-845e-fc2c3f8f889a", "e4aeda02-5889-4c39-80a3-23b075ca3e6f"]	0	2026-10-26 06:52:26.182995+00	0.00	0.00	approved	6bebacc8-ef9d-4de5-bde6-0a2f29b04a8b	816a3a5f-281a-49a9-b2c0-f0480a7e42a5	\N	\N
e68a463f-6315-4c6f-b170-e05ef6e86237	t	Wholesale & Retail	008-008-008	0610768845	joshuajulius241@gmail.com	Msimbazi, Kariakoo	Dar es Salaam	Saa 24	1 PC	tin_verification/cua7gz0nbxu7qzmyhcqg	https://maps.app.goo.gl/46AV8U7gS6zkfXZq7	Boxes	100	MT Power Tanzania Ltd	mt-power-tanzania-ltd		Sisi ni watoa huduma wanaoaminika wa paneli za sola zenye ufanisi mkubwa, suluhu za nishati mbadala, na vifaa kamili vya umeme. Tunajihusisha na uuzaji wa paneli za sola za kudumu, inverter, na mifumo ya nishati inayokidhi mahitaji ya majumbani, biashara, na viwandani.		@skyfall_tz	0754394845	["Solar Panels", "Solar Lights & Lamps"]	https://youtube.com/@joshuajulius-bi4lq?si=jSvn2tLTZ48R87sf	active	@skyfall_tz	@skyfall_tz	\N	f	https://res.cloudinary.com/rlgqgsnv/image/upload/v1793009031/store_offices/zef0pthhhwmwkpvybbxu.webp	\N	\N	["7df81129-3800-46c8-af5e-66591400ff33", "b772e432-ebee-4801-980e-de413a941796", "ec7f22e0-f1c6-4a41-b53e-03a9ab0eeb88", "168777bd-674d-4ba2-990c-52b3305ea344", "cc21b9e1-fa80-4d84-b8ac-106a93141982"]	0	2026-10-26 10:03:48.932608+00	0.00	0.00	approved	95b341ac-be9e-45fe-859e-99e18630a1cf	4f8af147-4abc-4cfe-ae97-f8ba7d8dd60a	\N	\N
a8acf1dd-0e6e-4d2b-ba83-133f6467b0d8	t	Wholesale & Retail	0004-004--005	0610768845	joshuajulius241@gmail.com	Kariakoo, Msimbazi	Dar es Salaam	Saa 24	1 PC	tin_verification/goqfjpfw4agqpendr7d3	https://maps.app.goo.gl/46AV8U7gS6zkfXZq7	Boxes	500PC	Changs Beuty Collection	changs-beuty-collection		Sisi ni wataalamu wa kutoa vipodozi bora, manukato ya kisasa, na bidhaa za matunzo ya ngozi na nywele. Tunajihusisha na uuzaji wa jumla na reja reja wa bidhaa halisi (original) za urembo, mafuta ya ngozi, vifaa vya kucha, na vipodozi mbalimbali vinavyokidhi mahitaji ya kila mteja.		@skyfall_tz	0754394845	["Beuty Tools", "Skin Care"]	https://youtube.com/@joshuajulius-bi4lq?si=jSvn2tLTZ48R87sf	active	@skyfall_tz	@skyfall_tz	\N	f	https://res.cloudinary.com/rlgqgsnv/image/upload/v1793011401/store_offices/qs7mktibqin0zjrgwker.webp	\N	\N	["7b1bb7f8-709d-4138-9230-fe0055a03187", "44e22ab6-c361-449d-a346-836b2ebb391e", "ecb7d34b-181c-4108-87c1-f802479cea0c", "42b57ced-c1af-4ad9-8248-90044163d44f", "d8bdb138-c960-4a4f-9bfa-508b6ca75050", "81de2f1d-6f89-4aff-99ba-e10849f40295", "df24e788-3b10-4ea2-b8cc-0b5ccffa5b01"]	0	2026-10-26 10:43:19.095507+00	0.00	0.00	approved	bee4ac11-904f-48ec-a327-3e798bc6be67	d043924d-d9b0-46f1-9b27-dbf0673d7e22	\N	\N
63036643-826a-4c3b-942a-5862ae2557ea	t	Wholesale & Retail	001-002-003	0610768845	joshuajulius241@gmail.com	LivingStone, Kariakoo	Dar es Salaam	Saa 24	1 PC	tin_verification/b9bcxypkj0h5edwvjy4e	https://maps.app.goo.gl/QUrx8awLLRoH1fkK7	Boxes	5000PC	The Lumina Decor Lighting & Decor	the-lumina-decor-lighting-decor		Sisi ni wataalamu wa mifumo ya taa za ndani na nje, taa za kisasa za LED, taa za mezani (lamps), na vifaa vyote vya mapambo ya mwanga. Tunajihusisha na huduma za jumla na reja reja za bidhaa zenye ubora wa hali ya juu zinazobadilisha muonekano wa nyumba na ofisi yako kuwa wa kisasa na wa kuvutia.		@skyfall_tz	0754394845	[]	https://youtube.com/@joshuajulius-bi4lq?si=jSvn2tLTZ48R87sf	active	@skyfall_tz	@skyfall_tz	\N	f	https://res.cloudinary.com/rlgqgsnv/image/upload/v1793026316/store_offices/u0diofjh5cv6mngg2rkr.webp	\N	\N	["1c2b3a4f-5e6d-7c8b-9a0f-1e2d3c4b5a6f", "4f5a6b7c-8d9e-0f1a-2b3c-4d5e6f7a8b9c", "5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d", "3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b"]	0	2026-10-26 14:51:54.590431+00	0.00	0.00	approved	b7a1f6c4-3e2d-41a5-8c76-5d9e2f1a0b3c	98639d14-03b9-4027-8a99-55b0f3966931	\N	\N
0ee1b2e8-82c3-4052-922a-db3b861f8b24	t	Wholesale & Retail	012-012-002	0610768845	joshuajulius241@gmail.com	Kariako,mtaa wa kongo	Dar es Salaam	Saa 24	1 PC	tin_verification/tk0sa2pydse3mceaxwsa	https://maps.app.goo.gl/46AV8U7gS6zkfXZq7	Boxes	5,000 PC	Prestige Jewel & Optic	prestige-jewel-optic		Sisi ni wataalamu bingwa wa uuzaji wa vito vya thamani, miwani ya jua ya kisasa, na saa za mikononi za kifahari. Tunajihusisha na huduma za jumla na reja reja za bidhaa halisi na zenye ubora wa hali ya juu zinazokidhi mtindo wako wa maisha na hafla zote maalum.		@changsmills	0754394845	["Watch Accessory", "Fashion Jewelry"]	https://youtube.com/@joshuajulius-bi4lq?si=a8wNM3WSZpoFcZqz	active	@Kelvin_store	@Changsmills	\N	f	https://res.cloudinary.com/rlgqgsnv/image/upload/v1793013008/store_offices/ek5q03re4cpntxouswx9.webp	\N	\N	["153e4c38-c8ef-4a94-bc8a-3d0142606c81", "1bfee79b-5b4d-4f55-b3c1-74160c87e10d", "05d8790e-8857-4b20-803d-b45f350d5670", "524de8b8-8d9c-4e52-804b-8284927b4556"]	0	2026-10-26 11:10:06.752526+00	0.00	0.00	approved	8c9521d1-1646-4e3d-8c95-b8c5fa2425b6	a878940d-8532-4fa0-9487-928c4f4e1997	\N	\N
e602b75a-de19-45c8-86c5-c72fbc2ca08c	t	Wholesale & Retail	0001-003-072	0754394845	joshuajulius241@gmail.com	Kariako,mtaa wa kongo	Dar es Salaam	Saa 24	1 PC	tin_verification/ozlzb8jxaclsvx0fpkhf	https://maps.app.goo.gl/46AV8U7gS6zkfXZq7	Boxes	5,000PC	The Elite Apparel &Accessory	the-elite-apparel-accessory		Sisi ni wataalamu wa mitindo na uuzaji wa nguo bora, kofia, mikanda, na vifaa mbalimbali vya kisasa vya kuvaa. Tunajihusisha na huduma za jumla na reja reja za bidhaa za kiwango cha juu zinazokidhi mahitaji ya mtindo wa maisha kwa kila mteja.		@changsmills	0754394845	["Men's Clothing", "Women's Clothing"]	https://youtube.com/@joshuajulius-bi4lq?si=a8wNM3WSZpoFcZqz	active	@Kelvin_store	@Changsmills	\N	f	https://res.cloudinary.com/rlgqgsnv/image/upload/v1793014432/store_offices/g5trazvmsqxjaicjgbhv.webp	\N	\N	["f8a70e64-b80e-4482-96a7-a11d116134bf", "369a884c-4fc2-417a-ba4d-dc2629c6d22b", "38d2ba26-0a87-4a79-8aa3-cbd17c4bf3a9", "501f7203-1a4e-48c5-b841-106e675eb719"]	0	2026-10-26 11:33:49.879869+00	0.00	0.00	approved	f01c52c5-3317-4c72-9f91-0738d9dd51d3	ed20d736-dfd4-4f0e-80fe-18987a7a78f3	\N	\N
3bfae103-a9af-40a0-a75f-56f41c3a19c7	t	Wholesaler	004-005-006	0610768845	joshuajulius241@gmail.com	Kariakoo	Dar es Salaam	Saa 24	1 PC	tin_verification/sulcwtnbs8xumri7qvaz	https://maps.app.goo.gl/QUrx8awLLRoH1fkK7	Boxes	500 PCs	The Apex Sports & Intertainment	the-apex-sports-intertainment	store_banners/cyx7mp4b1v5icscdvmqo	Sisi ni wataalamu wa vifaa vya michezo, vifaa vya mazoezi ya mwili (fitness), vifaa vya kambi na matembezi ya nje (camping & hiking), pamoja na bidhaa za burudani. Tunajihusisha na huduma za jumla na reja reja za bidhaa bora zinazokidhi mahitaji ya wachezaji, wapenda mazoezi, na familia zinazotafuta burudani na starehe.		@skyfall_tz	0754394845	["Fitness & Body Building", "Outdoor Sports"]	https://youtube.com/@joshuajulius-bi4lq?si=jSvn2tLTZ48R87sf	active	@skyfall_tz	@skyfall_tz	\N	f	https://res.cloudinary.com/rlgqgsnv/image/upload/v1793027820/store_offices/efgwmsjdradkpucjpqyf.webp	\N	\N	["f67a6673-7780-4faf-bfe1-c464cfe2ab5e", "ecce5aa8-5df3-454d-ae60-cff444022af1", "459db7a1-7be5-46d4-9c6d-6bbb3c7df31a", "492c7799-7cc8-482d-888f-cc1c18295c7b"]	0	2026-10-26 15:16:57.653477+00	0.00	0.00	approved	8e790248-aa30-4e4d-a171-eac4fd496b7e	8fa5cf7e-11ef-4611-956f-eef32ae25cf5	\N	\N
61adcef2-6f1b-4ec1-9d27-d6cd8b512b7e	t	Wholesale & Retail	008-007-006	0610768845	joshuajulius241@gmail.com	Msimbazi Kariakoo	Dar es Salaam	Saa 24	1 PC	tin_verification/d8w6ylmsxxxtlijdml4o	https://maps.app.goo.gl/QUrx8awLLRoH1fkK7	Boxes	500Pcs	The Voyage & Bags Collection	the-voyage-bags-collection		Sisi ni wataalamu wa uuzaji wa mabegi ya safari, pochi za mikononi, pochi za fedha na kadi (wallets), vifaa na vipuri vya mabegi, pamoja na mabegi maalum. Tunajihusisha na huduma za jumla na reja reja za bidhaa bora za kudumu zinazokidhi mahitaji ya safari na mtindo wa maisha wa kila siku.		@skyfall_tz	0754394845	["Bag Parts & Accessories", "Briefcases"]	https://youtube.com/@joshuajulius-bi4lq?si=jSvn2tLTZ48R87sf	active		@skyfall_tz	\N	f	https://res.cloudinary.com/rlgqgsnv/image/upload/v1793029278/store_offices/e7jmkl7tmjxoa6kysoqa.webp	\N	\N	["25719b69-d419-4920-a2d8-c1d458ba6dda", "0b8082af-85dd-456e-bec1-a100c082d2e3", "33379f57-891c-40d5-bf19-035182e9b5a0", "0ffa648f-d279-441d-aca8-00771a729752", "f0190bb4-7035-4241-b8a6-6fa298ead211"]	0	2026-10-26 15:41:15.72192+00	0.00	0.00	approved	719109cc-bb4f-4f04-ae1e-11a803aed41a	72fef55d-6a28-45a5-be94-1be31907408d	\N	\N
8f030c14-cc33-4daa-ac59-834e54a03024	t	Wholesale & Retail	005-007-004	0610768845	joshuajulius241@gmail.com	Kariakoo	Dar es Salaam	Saa 24	1 PC	tin_verification/wjoczybyhupmgbmyyrds	https://maps.app.goo.gl/kaXKHrsFaquoWHnL8	Boxes	5,000Pc	The Mobile & Gadgets Hub	the-mobile-gadgets-hub		Sisi ni wataalamu wa simu za mkononi, kompyuta kibao (tablets), chaja, betri, vifaa vya kusikilizia sauti, vifuniko vya simu (covers), na vifaa vyote vya kielektroniki vya kisasa. Tunajihusisha na huduma za jumla na reja reja za bidhaa halisi na zenye ubora wa juu zinazokidhi mahitaji yako ya mawasiliano na teknolojia.		@skyfall_tz	0754394845	["Mobile Phone and Accessory", "Used Electronics"]	https://youtube.com/@joshuajulius-bi4lq?si=jSvn2tLTZ48R87sf	active	@skyfall_tz	@skyfall_tz	\N	f	https://res.cloudinary.com/rlgqgsnv/image/upload/v1793037323/store_offices/d4ptbycdmkt5qsxembid.webp	\N	\N	["c66c0920-3d2c-4ec7-ae34-44df3bff61ba", "9d398341-566c-4495-9383-05e9a22e208b", "48d8c013-5cea-4d9a-a377-4b0100dde339"]	0	2026-10-26 17:55:21.033847+00	0.00	0.00	approved	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a	cdb9d770-df08-411b-bc1a-f9b76c3b36ca	\N	\N
\.


--
-- Data for Name: sub_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."sub_categories" ("id", "icon_name", "name", "name_sw", "description", "created_at", "category_id") FROM stdin;
641a7524-f2f3-4376-91ab-2e47af2ae7ef	camera	Camera, Photo & Accessories	Kamera, Picha na Vifaa	\N	2026-08-25 14:32:10.069118+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
652d4db5-1161-40b0-8b52-403ce534d6fe	headphones	Earphone & Headphone & Accessories	Earphone, Headphone na Vifaa	\N	2026-08-25 14:32:10.069118+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
66b7cde4-9649-48b7-9363-eac70ff38a73	sports	Sport Accessories	Vifaa vya Michezo	\N	2026-08-25 14:32:10.069118+00	6a721858-9f9b-43b6-8294-9d53cce813d0
66f1402f-7f1e-413d-b446-7c4c10c6e47a	fishing	Fishing Gear	Vifaa vya Uvuvi	\N	2026-08-25 14:32:10.069118+00	8e790248-aa30-4e4d-a171-eac4fd496b7e
66fd35e9-db20-4c74-9e7f-c8cceacc9c1c	battery	Batteries	Betri	\N	2026-08-25 14:32:10.069118+00	6bebacc8-ef9d-4de5-bde6-0a2f29b04a8b
680e790f-a781-49a6-99fc-113a1c1b5a13	baby	Baby Care	Utunzaji wa Mtoto	\N	2026-08-25 14:32:10.069118+00	d12924c8-8b7c-4008-a891-7c273c3627fe
68be8fc4-ed17-4af8-aaf9-7240d5c7e044	baby-supplies	Baby Supplies	Vifaa vya Mtoto	\N	2026-08-25 14:32:10.069118+00	925e698a-9035-4cd6-9e63-f3651267443c
697c3443-611f-49cc-937b-5079842f5f3f	pet-cage	Pet Cages & Carriers	Mabandiko na Vibebeo vya Wanyama	\N	2026-08-25 14:32:10.069118+00	bd779c12-f4af-44ce-a7bf-6281021ae28b
6a377fe6-05d4-4152-97cc-37e5f52070b0	wedding	Wedding Gifts & Decorations	Zawadi na Mapambo ya Harusi	\N	2026-08-25 14:32:10.069118+00	283b7fa7-d6b8-4f63-ae68-58c96ac019f4
6ac1f2ec-0335-41b1-a4b5-a2fe010148d9	shoes	Children's Shoes	Viatu vya Watoto	\N	2026-08-25 14:32:10.069118+00	cc51ca9e-5de5-4a7a-8ede-1d0d43005967
6bd4327c-81fc-4faf-856b-11e0bdbf389d	fire	Firefighting Supplies	Vifaa vya Kuzima Moto	\N	2026-08-25 14:32:10.069118+00	3729d0df-15e4-4dda-ae0b-7e63dce7e82a
6c0f99bf-e96c-4b96-a81a-305dfc2a58e2	medical	Medical Consumables	Vifaa vya Matibabu Vinavyotumika	\N	2026-08-25 14:32:10.069118+00	cd3f773b-7039-4c5f-a2f1-53302153f9b3
6d265f00-7580-4e99-94b2-8ed55605c575	electronics	Smart Electronics	Elektroniki Mahiri	\N	2026-08-25 14:32:10.069118+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
6e248680-e7d0-4c67-8ac8-fddfd2144654	paper	Paper Products	Bidhaa za Karatasi	\N	2026-08-25 14:32:10.069118+00	cbb84b4d-9899-4d5d-a7fb-8ae463889f21
6f38d14a-da16-448c-8c9f-70b4fada61e2	grain	Grain	Nafaka	\N	2026-08-25 14:32:10.069118+00	0f4d3d19-96ff-4199-8063-159cccb059c3
6fbddd00-4fe7-45f8-ba0f-249c7f78e242	clothing	Ethnic Clothing & Accessories	Nguo za Kikabila na Vifaa	\N	2026-08-25 14:32:10.069118+00	f01c52c5-3317-4c72-9f91-0738d9dd51d3
70d338e2-3461-4943-a6be-c0ce8c297619	car-exterior	Exterior Accessories	Vifaa vya Nje ya Gari	\N	2026-08-25 14:32:10.069118+00	36421f19-a9ba-49cd-a96f-66f488edaf26
70e10559-2cc4-43bd-80f1-a9637af00c83	machinery	Plastic & Rubber Machinery	Mashine za Plastiki na Mpira	\N	2026-08-25 14:32:10.069118+00	8d8308cd-9382-4f1b-8b18-83c638cc58b4
71a8930d-8cee-42b1-888b-9ee0b764d84e	electrical	Distribution Boards	Mbao za Usambazaji Umeme	\N	2026-08-25 14:32:10.069118+00	6bebacc8-ef9d-4de5-bde6-0a2f29b04a8b
72fdcba0-2ea4-4a6d-9a12-169cb479263f	garden	Garden Tools	Zana za Bustani	\N	2026-08-25 14:32:10.069118+00	652744e2-b4b3-4b74-a1e5-6bc58be4db82
7303e593-97f4-4933-8f3f-29533c1a35bc	laundry	Laundry Products	Bidhaa za Kufulia	\N	2026-08-25 14:32:10.069118+00	925e698a-9035-4cd6-9e63-f3651267443c
773405a9-e7f8-4466-9c9e-f4acbcc61f4f	stamp	Stamps & Accessories	Stempu na Vifaa	\N	2026-08-25 14:32:10.069118+00	cbb84b4d-9899-4d5d-a7fb-8ae463889f21
792bf765-1751-44c3-822b-51b27dc7b71b	nuts	Nuts & Kernels	Kokwa na Mbegu	\N	2026-08-25 14:32:10.069118+00	0f4d3d19-96ff-4199-8063-159cccb059c3
793c7d2c-93f4-4319-bc3b-9a274b4a838e	art	Sculptures	Sanamu	\N	2026-08-25 14:32:10.069118+00	283b7fa7-d6b8-4f63-ae68-58c96ac019f4
79f2da2d-cc4f-46e7-96c4-d71536dc0813	school	School Supplies	Vifaa vya Shule	\N	2026-08-25 14:32:10.069118+00	cbb84b4d-9899-4d5d-a7fb-8ae463889f21
7a667f32-8f40-47b6-80f8-e051ed3cfab9	bus	Bus Accessories	Vifaa vya Mabasi	\N	2026-08-25 14:32:10.069118+00	36421f19-a9ba-49cd-a96f-66f488edaf26
7b1bb7f8-709d-4138-9230-fe0055a03187	mens-care	Men's Care	Utunzaji wa Wanaume	\N	2026-08-25 14:32:10.069118+00	bee4ac11-904f-48ec-a327-3e798bc6be67
7df81129-3800-46c8-af5e-66591400ff33	solar	Solar Panels	Paneli za Jua	\N	2026-08-25 14:32:10.069118+00	95b341ac-be9e-45fe-859e-99e18630a1cf
7e9a3959-eb53-4435-b9d7-f5df68451dfa	filing	Filing & Organization	Uwekaji Kumbukumbu na Upangaji	\N	2026-08-25 14:32:10.069118+00	cbb84b4d-9899-4d5d-a7fb-8ae463889f21
81de2f1d-6f89-4aff-99ba-e10849f40295	beauty	Beauty Equipment	Vifaa vya Urembo	\N	2026-08-25 14:32:10.069118+00	bee4ac11-904f-48ec-a327-3e798bc6be67
837f6528-a331-4967-a807-61bc255cccbe	boots	Boots	Buti	\N	2026-08-25 14:32:10.069118+00	cc51ca9e-5de5-4a7a-8ede-1d0d43005967
841c2bbc-6ee0-4005-82de-24ce878a32cd	pet	Pet Supplies	Vifaa vya Wanyama	\N	2026-08-25 14:32:10.069118+00	925e698a-9035-4cd6-9e63-f3651267443c
84a68cfd-41df-4603-bbd6-6ee667f74faf	alarm	Alarm Systems	Mifumo ya Kengele	\N	2026-08-25 14:32:10.069118+00	3729d0df-15e4-4dda-ae0b-7e63dce7e82a
88e0b930-9e5f-4fc8-b0ee-4ff2c4cc4628	tools	Machine Tools	Zana za Mashine	\N	2026-08-25 14:32:10.069118+00	8d8308cd-9382-4f1b-8b18-83c638cc58b4
8b4e1a54-f1ca-4d55-ba9b-7e3895808f1f	flooring	Flooring & Accessories	Sakafu na Vifaa	\N	2026-08-25 14:32:10.069118+00	826506aa-2d4b-41c8-afd3-4d85ada92d1b
90ae28d4-2b5e-4680-b1f2-32f68c2014dd	switch	Switches	Swichi	\N	2026-08-25 14:32:10.069118+00	6bebacc8-ef9d-4de5-bde6-0a2f29b04a8b
91094fdd-bf07-4ab0-a0d9-4694393fd2f5	health	Health Care Products	Bidhaa za Utunzaji wa Afya	\N	2026-08-25 14:32:10.069118+00	cd3f773b-7039-4c5f-a2f1-53302153f9b3
9225e2cd-b7a9-4708-be31-cbd40e5b2838	kitchen	Kitchen & Tabletop	Jikoni na Meza	\N	2026-08-25 14:32:10.069118+00	925e698a-9035-4cd6-9e63-f3651267443c
933fc665-fb0a-485b-a126-542323a989c0	tools	Tools & Equipment	Zana na Vifaa	\N	2026-08-25 14:32:10.069118+00	625042b4-ae95-4c08-975f-f7c315e402e2
9355c4d2-b3f8-4823-a7f2-701a939242d2	fruit	Fresh Fruit	Matunda Safi	\N	2026-08-25 14:32:10.069118+00	0f4d3d19-96ff-4199-8063-159cccb059c3
93f3dba8-84e5-4d01-87a6-381df50f17e4	lock	Smart Locks	Kufuli Mahiri	\N	2026-08-25 14:32:10.069118+00	3729d0df-15e4-4dda-ae0b-7e63dce7e82a
95f8a209-eaf2-42eb-855b-26df9f522e47	medicine	Aesthetic Medicine	Dawa za Urembo	\N	2026-08-25 14:32:10.069118+00	bee4ac11-904f-48ec-a327-3e798bc6be67
96b43abe-0d34-4ded-a401-4fac54ec69ef	nail	Nail Supplies	Vifaa vya Kucha	\N	2026-08-25 14:32:10.069118+00	bee4ac11-904f-48ec-a327-3e798bc6be67
98cf7553-2641-480d-bf34-c518fdb942fc	garment	Garment & Processing Accessories	Vifaa vya Nguo na Uchakataji	\N	2026-08-25 14:32:10.069118+00	f01c52c5-3317-4c72-9f91-0738d9dd51d3
9a2cc7e5-5d94-48d9-8703-708e20751fbf	briefcase	Briefcases	Mikoba ya Mikono	\N	2026-08-25 14:32:10.069118+00	719109cc-bb4f-4f04-ae1e-11a803aed41a
9d398341-566c-4495-9383-05e9a22e208b	charger	Chargers, Batteries & Power Supplies	Chaja, Betri na Vifaa vya Umeme	\N	2026-08-25 14:32:10.069118+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
9dade7f0-d0c8-4d7a-8c77-f06ba402541f	gift	Mini Size & Gift Sets	Seti Ndogo na Zawadi	\N	2026-08-25 14:32:10.069118+00	bee4ac11-904f-48ec-a327-3e798bc6be67
9ed9b5b9-b713-4bcf-9f08-9ad738b222ba	leisure	Leisurewear	Nguo za Burudani	\N	2026-08-25 14:32:10.069118+00	f01c52c5-3317-4c72-9f91-0738d9dd51d3
9f7776d4-a1b8-46ab-aa34-88b4c6550ea0	train	Railway Accessories	Vifaa vya Reli	\N	2026-08-25 14:32:10.069118+00	36421f19-a9ba-49cd-a96f-66f488edaf26
a365983d-5667-422d-98bd-1a89bf3c3f2d	grooming	Pet Grooming & Cleaning	Utunzaji na Usafi wa Wanyama	\N	2026-08-25 14:32:10.069118+00	bd779c12-f4af-44ce-a7bf-6281021ae28b
a3d350bd-9157-4abd-9b69-9b6e2dc5073a	airplane	Aviation Accessories	Vifaa vya Usafiri wa Anga	\N	2026-08-25 14:32:10.069118+00	36421f19-a9ba-49cd-a96f-66f488edaf26
a6091c8a-b4e9-4e48-adae-27aeab6e7dcb	package	Food Packaging	Vifungashio vya Chakula	\N	2026-08-25 14:32:10.069118+00	2c95a09c-1a27-43e0-9532-614b78e3efa5
a7937845-328f-40f2-a489-6c33aba9e981	key	Key Chains	Minyororo ya Funguo	\N	2026-08-25 14:32:10.069118+00	283b7fa7-d6b8-4f63-ae68-58c96ac019f4
a7db92e5-0c93-4335-b8d9-2279f729579d	diamond	Loose Gemstones & Diamonds	Vito na Almasi	\N	2026-08-25 14:32:10.069118+00	8c9521d1-1646-4e3d-8c95-b8c5fa2425b6
a7ef920b-3b41-4522-8b31-b7d6ec7061e3	bathroom	Bathroom Products	Bidhaa za Bafu	\N	2026-08-25 14:32:10.069118+00	925e698a-9035-4cd6-9e63-f3651267443c
a90ff455-ad03-4083-9318-70432aec882b	car-electronics	Car Electronics	Elektroniki za Gari	\N	2026-08-25 14:32:10.069118+00	625042b4-ae95-4c08-975f-f7c315e402e2
a9e87911-732d-4b66-a304-9067c60de228	relay	Relays	Rele	\N	2026-08-25 14:32:10.069118+00	6bebacc8-ef9d-4de5-bde6-0a2f29b04a8b
aa3e923f-7f61-4645-8ae0-915fd8471718	boat	Marine Accessories	Vifaa vya Baharini	\N	2026-08-25 14:32:10.069118+00	36421f19-a9ba-49cd-a96f-66f488edaf26
aa4dff8b-2f19-49ed-b965-3fd5bee353ef	paper	Sanitary Paper	Karatasi za Usafi	\N	2026-08-25 14:32:10.069118+00	d12924c8-8b7c-4008-a891-7c273c3627fe
af28ad9c-90fc-4f24-998a-1ed6a4447986	projector	Projectors & Presentation Equipments	Projekta na Vifaa vya Mawasilisho	\N	2026-08-25 14:32:10.069118+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
afcc0d6e-77a3-43d4-bdc0-15b05dd28e53	ski	Ski & Snowboard Wear	Nguo za Mchezo wa Theluji	\N	2026-08-25 14:32:10.069118+00	6a721858-9f9b-43b6-8294-9d53cce813d0
b07b8e57-7f6f-4d5e-945e-88f5578d741b	car-parts	Automotive Replacement Parts	Vipuri vya Magari	\N	2026-08-25 14:32:10.069118+00	36421f19-a9ba-49cd-a96f-66f488edaf26
b223002e-c1e8-4a7b-8086-29d473b36b37	truck	Truck Accessories	Vifaa vya Malori	\N	2026-08-25 14:32:10.069118+00	36421f19-a9ba-49cd-a96f-66f488edaf26
b24b8cfb-b4b3-4873-b930-7a43a121a638	oil	Plant & Animal Oil	Mafuta ya Mimea na Wanyama	\N	2026-08-25 14:32:10.069118+00	0f4d3d19-96ff-4199-8063-159cccb059c3
b37963f1-a267-45c8-a972-224b5d4e8001	training	Pet Training Products	Vifaa vya Kufundisha Wanyama	\N	2026-08-25 14:32:10.069118+00	bd779c12-f4af-44ce-a7bf-6281021ae28b
b4f65ca5-1e4e-4887-b9f5-cce8d71e0068	wood	Woodworking Machinery	Mashine za Mbao	\N	2026-08-25 14:32:10.069118+00	8d8308cd-9382-4f1b-8b18-83c638cc58b4
b772e432-ebee-4801-980e-de413a941796	light	Solar Lights & Lamps	Taa za Jua	\N	2026-08-25 14:32:10.069118+00	95b341ac-be9e-45fe-859e-99e18630a1cf
b7b27339-e455-4d53-9bc8-76c15dd6b092	power	Power Supplies	Vifaa vya Umeme	\N	2026-08-25 14:32:10.069118+00	6bebacc8-ef9d-4de5-bde6-0a2f29b04a8b
b7c153c9-dac0-4654-a8aa-6af9e4bdb295	traffic	Road Safety & Traffic Products	Bidhaa za Usalama Barabarani	\N	2026-08-25 14:32:10.069118+00	3729d0df-15e4-4dda-ae0b-7e63dce7e82a
b98b8f34-18b1-4260-bea0-95f8dac15416	car-interior	Interior Accessories	Vifaa vya Ndani ya Gari	\N	2026-08-25 14:32:10.069118+00	36421f19-a9ba-49cd-a96f-66f488edaf26
bb5bd74c-dc90-4e62-a77a-11fcafb6dfa5	shield	Self Defense Supplies	Vifaa vya Kujilinda	\N	2026-08-25 14:32:10.069118+00	3729d0df-15e4-4dda-ae0b-7e63dce7e82a
be6ad370-2ded-4273-a738-0ee2045e7b2f	power-tools	Power Tools	Zana za Umeme	\N	2026-08-25 14:32:10.069118+00	652744e2-b4b3-4b74-a1e5-6bc58be4db82
bec0c9ef-d74e-41ac-98cf-77e43b0f38e8	stairs	Stairs & Stair Parts	Ngazi na Sehemu za Ngazi	\N	2026-08-25 14:32:10.069118+00	826506aa-2d4b-41c8-afd3-4d85ada92d1b
bef79da3-023c-4e9f-85ab-8e9d942d988a	electronics	Other Consumer Electronics	Elektroniki Nyingine za Watumiaji	\N	2026-08-25 14:32:10.069118+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
c13a6b7f-b888-4aac-8c7e-e742b5790f35	agriculture	Agricultural Growing Media	Vifaa vya Ukuzaji Kilimo	\N	2026-08-25 14:32:10.069118+00	0f4d3d19-96ff-4199-8063-159cccb059c3
c160b571-9f06-4178-ac4e-b1f3140fcf63	gift	Gifts	Zawadi	\N	2026-08-25 14:32:10.069118+00	283b7fa7-d6b8-4f63-ae68-58c96ac019f4
c1d8a043-5787-4fcb-929d-e66e21c94587	car	Other Vehicle Accessories	Vifaa vingine vya Magari	\N	2026-08-25 14:32:10.069118+00	36421f19-a9ba-49cd-a96f-66f488edaf26
c4172bf3-6ca8-462d-ac96-785b2bb1ca13	abrasive	Abrasives	Vifaa vya Kusugua	\N	2026-08-25 14:32:10.069118+00	652744e2-b4b3-4b74-a1e5-6bc58be4db82
c66c0920-3d2c-4ec7-ae34-44df3bff61ba	phone	Mobile Phone & Accessories	Simu za Mkononi na Vifaa	\N	2026-08-25 14:32:10.069118+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
c68285eb-aa4e-49e5-af9b-3253a61126f8	packaging	Packaging Machinery	Mashine za Kufungashia	\N	2026-08-25 14:32:10.069118+00	8d8308cd-9382-4f1b-8b18-83c638cc58b4
c8b0213e-cec3-4ed4-9317-a129c5fa14fd	medical-device	Medical Devices	Vifaa vya Matibabu	\N	2026-08-25 14:32:10.069118+00	cd3f773b-7039-4c5f-a2f1-53302153f9b3
c92b4fde-25e1-49c6-845e-fc2c3f8f889a	circuit	Circuit Breakers	Vikatizaji Mzunguko	\N	2026-08-25 14:32:10.069118+00	6bebacc8-ef9d-4de5-bde6-0a2f29b04a8b
ca9da0c1-cce7-4dcd-bac5-02cace50d969	textile	Textile Machinery & Parts	Mashine za Nguo na Sehemu	\N	2026-08-25 14:32:10.069118+00	8d8308cd-9382-4f1b-8b18-83c638cc58b4
cbb93f55-e523-4df1-bb1e-9b5ece2dd0ee	fixtures	Bathroom & Kitchen Fixtures	Vifaa vya Bafu na Jikoni	\N	2026-08-25 14:32:10.069118+00	826506aa-2d4b-41c8-afd3-4d85ada92d1b
cc21b9e1-fa80-4d84-b8ac-106a93141982	controller	Solar Controllers	Vidhibiti vya Jua	\N	2026-08-25 14:32:10.069118+00	95b341ac-be9e-45fe-859e-99e18630a1cf
cd1dda02-91c8-4026-9918-53cd388e7e9c	cosmetic	Cosmetic Packaging	Vifungashio vya Vipodozi	\N	2026-08-25 14:32:10.069118+00	2c95a09c-1a27-43e0-9532-614b78e3efa5
cd7709dd-1d3d-4316-8ea5-d27193f58427	rain	Rain Gear	Vifaa vya Mvua	\N	2026-08-25 14:32:10.069118+00	925e698a-9035-4cd6-9e63-f3651267443c
cdfce342-2975-4e11-9bc3-45ecbb34f321	art	Art & Collectibles	Sanaa na Makusanyo	\N	2026-08-25 14:32:10.069118+00	283b7fa7-d6b8-4f63-ae68-58c96ac019f4
ceb121ed-0b93-463e-aa5c-38e8968f68ff	pet-clothes	Pet Apparel & Accessories	Nguo na Vifaa vya Wanyama	\N	2026-08-25 14:32:10.069118+00	bd779c12-f4af-44ce-a7bf-6281021ae28b
d0f159d4-81f3-4cdd-a991-742cc8c103be	water-sports	Water Sports Clothing	Nguo za Michezo ya Majini	\N	2026-08-25 14:32:10.069118+00	6a721858-9f9b-43b6-8294-9d53cce813d0
d1ad6477-b43e-4e98-816d-b8805390b786	food-machine	Food & Beverage Machinery	Mashine za Chakula na Vinywaji	\N	2026-08-25 14:32:10.069118+00	8d8308cd-9382-4f1b-8b18-83c638cc58b4
d5e3a082-288b-4dd7-bd8c-9c82c7adba53	car-light	Car Light Accessories	Vifaa vya Taa za Gari	\N	2026-08-25 14:32:10.069118+00	36421f19-a9ba-49cd-a96f-66f488edaf26
d5f8ba14-e5d2-4906-a45e-fe66702666c6	team-sports	Team Sports	Michezo ya Timu	\N	2026-08-25 14:32:10.069118+00	8e790248-aa30-4e4d-a171-eac4fd496b7e
d7ba80d4-68ef-407d-9341-aa7a69dc762a	cycling	Cycling Apparel	Nguo za Baiskeli	\N	2026-08-25 14:32:10.069118+00	6a721858-9f9b-43b6-8294-9d53cce813d0
d7d411a4-b555-4198-8ec2-1f7249295ed4	dental	Dental Supplies	Vifaa vya Meno	\N	2026-08-25 14:32:10.069118+00	cd3f773b-7039-4c5f-a2f1-53302153f9b3
d8bdb138-c960-4a4f-9bfa-508b6ca75050	perfume	Perfume & Fragrance	Manukato	\N	2026-08-25 14:32:10.069118+00	bee4ac11-904f-48ec-a327-3e798bc6be67
dd9b505e-27ff-4e87-aa1e-5d24de930773	skincare	Skin Care Accessories	Vifaa vya Utunzaji wa Ngozi	\N	2026-08-25 14:32:10.069118+00	d12924c8-8b7c-4008-a891-7c273c3627fe
dec86837-839b-438e-8a0d-c2f38591acfc	binding	Office Binding Supplies	Vifaa vya Kufunga Ofisini	\N	2026-08-25 14:32:10.069118+00	cbb84b4d-9899-4d5d-a7fb-8ae463889f21
df24e788-3b10-4ea2-b8cc-0b5ccffa5b01	beauty-care	Other Beauty & Personal Care Products	Bidhaa Nyingine za Urembo na Utunzaji Binafsi	\N	2026-08-25 14:32:10.069118+00	bee4ac11-904f-48ec-a327-3e798bc6be67
e023a2fa-4e1a-4f1d-8778-1116c8dfef32	lock-key	Locks & Keys	Kufuli na Funguo	\N	2026-08-25 14:32:10.069118+00	3729d0df-15e4-4dda-ae0b-7e63dce7e82a
e02f488d-5a02-40aa-9811-24edae0d8ed4	fitness	Gym & Fitness Wear	Nguo za Mazoezi na Sihati	\N	2026-08-25 14:34:04.739301+00	6a721858-9f9b-43b6-8294-9d53cce813d0
e269cb8c-5a0d-4447-ab96-4e6eec25d278	connector	Connectors & Terminals	Viunganishi na Vituo	\N	2026-08-25 14:34:04.739301+00	6bebacc8-ef9d-4de5-bde6-0a2f29b04a8b
e345e660-3e43-4fb5-ae48-d886152bdfc8	art	Body Art	Sanaa ya Mwilini	\N	2026-08-25 14:34:04.739301+00	bee4ac11-904f-48ec-a327-3e798bc6be67
e36f947d-5024-4690-9558-9d26c28064ab	cleaning	Household Cleaning Tools & Accessories	Zana za Kusafisha Nyumbani na Vifaa	\N	2026-08-25 14:34:04.739301+00	925e698a-9035-4cd6-9e63-f3651267443c
e4aeda02-5889-4c39-80a3-23b075ca3e6f	cable	Wires, Cables & Cable Assemblies	Waya, Kebo na Mikusanyiko ya Kebo	\N	2026-08-25 14:34:04.739301+00	6bebacc8-ef9d-4de5-bde6-0a2f29b04a8b
e63cc4fa-e691-4381-9e62-dec068aefb35	animal	Animal Products	Bidhaa za Wanyama	\N	2026-08-25 14:34:04.739301+00	0f4d3d19-96ff-4199-8063-159cccb059c3
e66b9b80-9964-4044-9bcf-5ae571db2d97	gamepad	Video Games & Accessories	Michezo ya Video na Vifaa	\N	2026-08-25 14:34:04.739301+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
e684e06d-b388-4f87-89fa-1214cd245497	coffee	Coffee Beans	Kahawa	\N	2026-08-25 14:34:04.739301+00	0f4d3d19-96ff-4199-8063-159cccb059c3
e80ecb76-124b-4704-838d-9795619973d0	shoe	Women's Shoes	Viatu vya Wanawake	\N	2026-08-25 14:34:04.739301+00	cc51ca9e-5de5-4a7a-8ede-1d0d43005967
e813824a-c59e-402f-a47b-08bc1fad1a9b	headphones	Portable Audio, Video & Accessories	Sauti na Video zinazobebeka na Vifaa	\N	2026-08-25 14:34:04.739301+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
e89b3fdd-38f5-4e9c-a146-d568a2782c9e	sandal	Sandals	Viatu vya Raba	\N	2026-08-25 14:34:04.739301+00	cc51ca9e-5de5-4a7a-8ede-1d0d43005967
e933cc2f-c3d0-45c7-9c8f-8eb3089c19e3	bag	Packaging Bags	Mifuko ya Kufungia	\N	2026-08-25 14:34:04.739301+00	2c95a09c-1a27-43e0-9532-614b78e3efa5
ec1c3265-63b2-44e6-a76c-b4e9ed5ba544	outdoor	Outdoor Recreation Wear	Nguo za Burudani za Nje	\N	2026-08-25 14:34:04.739301+00	6a721858-9f9b-43b6-8294-9d53cce813d0
ec7f22e0-f1c6-4a41-b53e-03a9ab0eeb88	solar	Solar Inverters	Vigeuza Umeme vya Jua	\N	2026-08-25 14:34:04.739301+00	95b341ac-be9e-45fe-859e-99e18630a1cf
ecb7d34b-181c-4108-87c1-f802479cea0c	makeup	Makeup & Tools	Vipodozi na Vifaa	\N	2026-08-25 14:34:04.739301+00	bee4ac11-904f-48ec-a327-3e798bc6be67
ecce5aa8-5df3-454d-ae60-cff444022af1	camping	Camping & Hiking	Kambi na Kupanda Milima	\N	2026-08-25 14:34:04.739301+00	8e790248-aa30-4e4d-a171-eac4fd496b7e
f0190bb4-7035-4241-b8a6-6fa298ead211	luggage	Luggage & Travel Bags	Mikoba ya Safari	\N	2026-08-25 14:34:04.739301+00	719109cc-bb4f-4f04-ae1e-11a803aed41a
f158250d-57ac-462f-9815-164b21a5e2e2	calculator	Calculators & Electronic Organizers	Kikokotoo na Vipangaji vya Kielektroniki	\N	2026-08-25 14:34:04.739301+00	cbb84b4d-9899-4d5d-a7fb-8ae463889f21
f20724fe-539d-43c9-b229-c5d314e520a0	safe	Safes & Vaults	Sanduku za Kifalme na Salama	\N	2026-08-25 14:34:04.739301+00	3729d0df-15e4-4dda-ae0b-7e63dce7e82a
f2a606d2-81bf-426c-b124-973675d706c4	cable	Cables & Commonly Used Accessories	Kebo na Vifaa vya Kawaida	\N	2026-08-25 14:34:04.739301+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
f584a8e5-91fb-4234-ac50-4fcc75022ec0	printer	Printing Services	Huduma za Uchapishaji	\N	2026-08-25 14:34:04.739301+00	2c95a09c-1a27-43e0-9532-614b78e3efa5
f67a6673-7780-4faf-bfe1-c464cfe2ab5e	fitness	Fitness & Body Building	Sihati na Kujenga Mwili	\N	2026-08-25 14:34:04.739301+00	8e790248-aa30-4e4d-a171-eac4fd496b7e
f749f739-85ec-488d-a558-24cb211eed28	safety	Safety & Emergency Supplies	Vifaa vya Usalama na Dharura	\N	2026-08-25 14:34:04.739301+00	625042b4-ae95-4c08-975f-f7c315e402e2
f75a0d49-f80f-462e-a9cc-d5b39bc4b2db	board	Boards & Presentation Supplies	Mbao na Vifaa vya Mawasilisho	\N	2026-08-25 14:34:04.739301+00	cbb84b4d-9899-4d5d-a7fb-8ae463889f21
f8a70e64-b80e-4482-96a7-a11d116134bf	clothing	Women's Clothing	Nguo za Wanawake	\N	2026-08-25 14:34:04.739301+00	f01c52c5-3317-4c72-9f91-0738d9dd51d3
f957ce78-9d84-4b63-995c-f8e20ca0e344	seed	Plant Seeds & Bulbs	Mbegu na Balbu za Mimea	\N	2026-08-25 14:34:04.739301+00	0f4d3d19-96ff-4199-8063-159cccb059c3
fa535e51-dad1-45c0-b9d8-6cae9baad8b2	music	Musical Instruments	Ala za Muziki	\N	2026-08-25 14:34:04.739301+00	8e790248-aa30-4e4d-a171-eac4fd496b7e
fb4182e7-6d13-47fa-b2a3-34c5f22a959e	car	Exterior Accessories	Vifaa vya Nje ya Gari	\N	2026-08-25 14:34:04.739301+00	625042b4-ae95-4c08-975f-f7c315e402e2
fc6afdc7-f3b1-470a-b31a-3a1f63bf3d96	pet	Pet Food	Chakula cha Wanyama	\N	2026-08-25 14:34:04.739301+00	bd779c12-f4af-44ce-a7bf-6281021ae28b
fc9637d3-ef15-41c5-9e31-32408c8f7ec2	machinery	Metal Casting Machinery	Mashine za Kutupia Vyuma	\N	2026-08-25 14:34:04.739301+00	8d8308cd-9382-4f1b-8b18-83c638cc58b4
fdb684eb-2451-4f5a-b018-113d065b485c	shoe	Sports Shoes	Viatu vya Michezo	\N	2026-08-25 14:34:04.739301+00	cc51ca9e-5de5-4a7a-8ede-1d0d43005967
fdfcb279-6fc5-4012-98e2-acbff6475bfb	solar	Solar Mounting Systems	Mifumo ya Kuweka Paneli za Jua	\N	2026-08-25 14:34:04.739301+00	95b341ac-be9e-45fe-859e-99e18630a1cf
ff314233-1047-4fd7-9fbd-496a2b6242fa	tool	Machining Services	Huduma za Uchimbaji na Ugeuzaji	\N	2026-08-25 14:34:04.739301+00	983c70d5-7150-4135-8d09-fea3616fd73b
ff3b6963-812c-437d-a898-cbf970196362	sport	Racket Sports Apparel	Nguo za Michezo ya Rakeni	\N	2026-08-25 14:34:04.739301+00	6a721858-9f9b-43b6-8294-9d53cce813d0
00597f28-08b3-46da-a858-347cb5def3ec		Auto Replacement Parts	Vipuri vya Magari	\N	2026-08-25 14:38:43.738037+00	625042b4-ae95-4c08-975f-f7c315e402e2
00d809c1-f223-4520-99a0-b70d4993b438		Apparel Packaging	Vifungashio vya Nguo	\N	2026-08-25 14:38:43.738037+00	2c95a09c-1a27-43e0-9532-614b78e3efa5
01a355e3-cb69-4001-abfa-1b2e874aec30		Stickers	Stika	\N	2026-08-25 14:38:43.738037+00	283b7fa7-d6b8-4f63-ae68-58c96ac019f4
01f747fc-e08b-403d-b9cd-58e4dc06ce4a		VR, AR, MR Hardware & Software	Vifaa vya Uhalisia Pepe	\N	2026-08-25 14:38:43.738037+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
039161f1-24ec-4640-821a-ef5d7a6ba454		Solar Energy Systems	Mifumo ya Nishati ya Jua	\N	2026-08-25 14:38:43.738037+00	95b341ac-be9e-45fe-859e-99e18630a1cf
05483a18-d3d2-4e67-99ea-b4ab83413798		Team Sports Uniforms	Sare za Michezo ya Timu	\N	2026-08-25 14:38:43.738037+00	6a721858-9f9b-43b6-8294-9d53cce813d0
05d8790e-8857-4b20-803d-b45f350d5670		Fashion Jewelry	Vito vya Mitindo	\N	2026-08-25 14:38:43.738037+00	8c9521d1-1646-4e3d-8c95-b8c5fa2425b6
05f2dcbc-2b6f-4691-909a-8910d70bb636		Speakers & Accessories	Spika na Vifaa	\N	2026-08-25 14:38:43.738037+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
066471f5-d171-4c35-8e50-808447e36618		Adhesive Tape	Tepu ya Kunata	\N	2026-08-25 14:38:43.738037+00	2c95a09c-1a27-43e0-9532-614b78e3efa5
06f6e4e6-73dd-4780-83e3-5dc980c49e84		Used Shoes	Viatu Vilivyotumika	\N	2026-08-25 14:38:43.738037+00	cc51ca9e-5de5-4a7a-8ede-1d0d43005967
09e5cf4e-93af-436f-bde4-b158c8671e23		Men's Shoes	Viatu vya Wanaume	\N	2026-08-25 14:38:43.738037+00	cc51ca9e-5de5-4a7a-8ede-1d0d43005967
0aa08fd5-ae57-48b0-9e18-2beba7749cbb		Home Textiles	Vitambaa vya Nyumbani	\N	2026-08-25 14:38:43.738037+00	925e698a-9035-4cd6-9e63-f3651267443c
0b14aa60-4c1b-4480-ac08-bcecb181b345		Power Tool Accessories	Vifaa vya Zana za Umeme	\N	2026-08-25 14:38:43.738037+00	652744e2-b4b3-4b74-a1e5-6bc58be4db82
0b8082af-85dd-456e-bec1-a100c082d2e3		Wallets & Holders	Pochi na Vishikio	\N	2026-08-25 14:38:43.738037+00	719109cc-bb4f-4f04-ae1e-11a803aed41a
0bbcee3e-07bd-4241-b945-33cbedd7ee95		Computer Hardware & Software	Vifaa na Programu za Kompyuta	\N	2026-08-25 14:38:43.738037+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
0f756812-3bfe-42a7-9337-0e6826de39ae		Windows & Doors	Madirisha na Milango	\N	2026-08-25 14:38:43.738037+00	826506aa-2d4b-41c8-afd3-4d85ada92d1b
0ffa648f-d279-441d-aca8-00771a729752		Bag Parts & Accessories	Sehemu na Vifaa vya Mifuko	\N	2026-08-25 14:38:43.738037+00	719109cc-bb4f-4f04-ae1e-11a803aed41a
13ea3946-4159-40a9-83a4-bf51725d6478		Pneumatic Tools	Zana za Hewa	\N	2026-08-25 14:38:43.738037+00	652744e2-b4b3-4b74-a1e5-6bc58be4db82
14599e8d-2dfe-444d-97cd-3cb0058c469c		Fresh Seafood	Dagaa Safi	\N	2026-08-25 14:38:43.738037+00	0f4d3d19-96ff-4199-8063-159cccb059c3
152c4f80-76ce-43b9-b588-69f6994cdd6c		Festive & Party Supplies	Vifaa vya Sherehe na Karamu	\N	2026-08-25 14:38:43.738037+00	925e698a-9035-4cd6-9e63-f3651267443c
153e4c38-c8ef-4a94-bc8a-3d0142606c81		Watch Accessories	Vifaa vya Saa za Mikono	\N	2026-08-25 14:38:43.738037+00	8c9521d1-1646-4e3d-8c95-b8c5fa2425b6
168777bd-674d-4ba2-990c-52b3305ea344		Solar Batteries	Betri za Jua	\N	2026-08-25 14:38:43.738037+00	95b341ac-be9e-45fe-859e-99e18630a1cf
16ff2200-3f62-42d2-919f-bc5b9efcaaf6		Interior Accessories	Vifaa vya Ndani ya Gari	\N	2026-08-25 14:38:43.738037+00	625042b4-ae95-4c08-975f-f7c315e402e2
1b416443-6659-4681-9fd6-d90fc3f0c7c2		Hand Tools	Zana za Mikono	\N	2026-08-25 14:38:43.738037+00	652744e2-b4b3-4b74-a1e5-6bc58be4db82
1bdeda97-c87a-4f8d-bd7e-b3c7c3b1ee8e		Auto Electronics	Elektroniki za Magari	\N	2026-08-25 14:38:43.738037+00	36421f19-a9ba-49cd-a96f-66f488edaf26
1bfee79b-5b4d-4f55-b3c1-74160c87e10d		Eyewear	Miwani	\N	2026-08-25 14:38:43.738037+00	8c9521d1-1646-4e3d-8c95-b8c5fa2425b6
1d0b6b20-dc49-435b-8af6-9e8f3e64f1be		Home Storage & Organization	Uhifadhi na Upangaji wa Nyumbani	\N	2026-08-25 14:38:43.738037+00	925e698a-9035-4cd6-9e63-f3651267443c
1ed36f16-14a2-4807-9aac-1a07f16a5b40		Wind Turbines & Generators	Mitambo ya Upepo na Jenereta	\N	2026-08-25 14:38:43.738037+00	95b341ac-be9e-45fe-859e-99e18630a1cf
203c11c6-642c-493a-9e0d-46472261fb4e		Uniforms & Costumes	Sare na Mavazi	\N	2026-08-25 14:38:43.738037+00	f01c52c5-3317-4c72-9f91-0738d9dd51d3
210aa68f-f93f-4411-a9f1-ed2bcbe5a743		Hardware	Vifaa vya Ufundi	\N	2026-08-25 14:38:43.738037+00	652744e2-b4b3-4b74-a1e5-6bc58be4db82
223c9228-c75a-4833-b40d-99ce92c46725		Roofing Materials	Vifaa vya Paa	\N	2026-08-25 14:38:43.738037+00	826506aa-2d4b-41c8-afd3-4d85ada92d1b
22f45154-af3e-490f-983f-73a2a71920f2		Construction Machinery	Mashine za Ujenzi	\N	2026-08-25 14:38:43.738037+00	8d8308cd-9382-4f1b-8b18-83c638cc58b4
23aaf8e1-54d5-48bc-8634-13b46c6242ee		Slippers	Makapaa	\N	2026-08-25 14:38:43.738037+00	cc51ca9e-5de5-4a7a-8ede-1d0d43005967
24790a5e-c1e6-4194-af24-c40951782cf9		Motorcycle Accessories & Parts	Vifaa na Vipuri vya Pikipiki	\N	2026-08-25 14:38:43.738037+00	36421f19-a9ba-49cd-a96f-66f488edaf26
2484cb17-be96-4b8d-aef6-e761a2870314		Rehabilitation Supplies	Vifaa vya Urekebishaji	\N	2026-08-25 14:38:43.738037+00	cd3f773b-7039-4c5f-a2f1-53302153f9b3
25719b69-d419-4920-a2d8-c1d458ba6dda		Handbags	Mikoba	\N	2026-08-25 14:38:43.738037+00	719109cc-bb4f-4f04-ae1e-11a803aed41a
25995318-792a-4dd8-ae68-4961a50ae6c3		Jewelry Packaging & Display	Vifungashio na Maonyesho ya Vito	\N	2026-08-25 14:38:43.738037+00	8c9521d1-1646-4e3d-8c95-b8c5fa2425b6
26a63525-d6e3-47d3-aa76-d2f653115921		Wedding Apparel & Accessories	Nguo za Harusi na Vifaa	\N	2026-08-25 14:38:43.738037+00	f01c52c5-3317-4c72-9f91-0738d9dd51d3
2732192c-9b99-43b3-a731-d8dea5caf86a		Shoe Parts & Accessories	Sehemu na Vifaa vya Viatu	\N	2026-08-25 14:38:43.738037+00	cc51ca9e-5de5-4a7a-8ede-1d0d43005967
27f26f61-d3a5-4b44-8885-fdab95aa5c2b		Hair Extensions & Wigs	Nyongeza za Nywele na Wigi	\N	2026-08-25 14:38:43.738037+00	bee4ac11-904f-48ec-a327-3e798bc6be67
2a254b33-d89a-4d57-b00d-407b471313f4		Pens, Pencils & Writing Supplies	Kalamu na Vifaa vya Uandishi	\N	2026-08-25 14:38:43.738037+00	cbb84b4d-9899-4d5d-a7fb-8ae463889f21
2c0b2263-252a-42ea-bf66-3cc702d2543f		Desk Accessories & Organizers	Vifaa na Vipangaji vya Dawati	\N	2026-08-25 14:38:43.738037+00	cbb84b4d-9899-4d5d-a7fb-8ae463889f21
2c2f918e-823a-44d1-a481-671b807b46e4		Television, Home Audio, Video & Accessories	Televisheni, Audio, Video na Vifaa	\N	2026-08-25 14:38:43.738037+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
2d493f98-4474-487a-b09a-82d73b4497b7		Work Safety Supplies	Vifaa vya Usalama Kazini	\N	2026-08-25 14:38:43.738037+00	3729d0df-15e4-4dda-ae0b-7e63dce7e82a
2db83173-196c-46e9-9e2f-4f4f52bf7268		Packaging Boxes	Maboksi ya Kufungia	\N	2026-08-25 14:38:43.738037+00	2c95a09c-1a27-43e0-9532-614b78e3efa5
2de3c52b-926f-4540-abd0-5b1fe17dc927		Safety Shoes	Viatu vya Usalama	\N	2026-08-25 14:38:43.738037+00	cc51ca9e-5de5-4a7a-8ede-1d0d43005967
30db2cee-1181-4018-98f7-3526fbeadd6a		Hair Care Accessories	Vifaa vya Kutunza Nywele	\N	2026-08-25 14:38:43.738037+00	d12924c8-8b7c-4008-a891-7c273c3627fe
31fa9ec4-6f5b-4977-9e96-88f8a4ff51d3		Crafts	Sanaa	\N	2026-08-25 14:38:43.738037+00	283b7fa7-d6b8-4f63-ae68-58c96ac019f4
33379f57-891c-40d5-bf19-035182e9b5a0		Special Purpose Bags	Mifuko Maalum	\N	2026-08-25 14:38:43.738037+00	719109cc-bb4f-4f04-ae1e-11a803aed41a
34ef6d10-a432-49fa-9ec9-3b6fcbbb4ba5		Water Sports	Michezo ya Majini	\N	2026-08-25 14:38:43.738037+00	8e790248-aa30-4e4d-a171-eac4fd496b7e
3514bda2-4236-4e49-ae36-ed1a2f1fbaae		Fine Jewelry	Vito Bora	\N	2026-08-25 14:38:43.738037+00	8c9521d1-1646-4e3d-8c95-b8c5fa2425b6
3646a747-08ad-44cd-847b-f42ddbd1c9cc		Notebooks & Writing Pads	Madaftari na Mabatano ya Kuandikia	\N	2026-08-25 14:38:43.738037+00	cbb84b4d-9899-4d5d-a7fb-8ae463889f21
369a884c-4fc2-417a-ba4d-dc2629c6d22b		Men's Clothing	Nguo za Wanaume	\N	2026-08-25 14:38:43.738037+00	f01c52c5-3317-4c72-9f91-0738d9dd51d3
36ed57fd-9eb9-4ac7-9eda-588a022ea52c		Custom Fabrication Services	Huduma Maalum za Utengenezaji	\N	2026-08-25 14:38:43.738037+00	983c70d5-7150-4135-8d09-fea3616fd73b
38d2ba26-0a87-4a79-8aa3-cbd17c4bf3a9		Underwear & Sleepwear	Chupi na Nguo za Kulala	\N	2026-08-25 14:38:43.738037+00	f01c52c5-3317-4c72-9f91-0738d9dd51d3
3c7c9c5f-b551-48f4-b4d2-c0510ead8094		TV Receivers & Accessories	Vipokezi vya TV na Vifaa	\N	2026-08-25 14:38:43.738037+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
3dcc4947-370a-4d5c-b62c-5402ac79767a		Pet Collars, Leashes & Harnesses	Kola, Kamba na Vifunga vya Wanyama	\N	2026-08-25 14:38:43.738037+00	bd779c12-f4af-44ce-a7bf-6281021ae28b
3e03e255-e6fa-4c3a-a9e8-0077f79d00bd		Mailing Bags	Mifuko ya Kutumia Barua	\N	2026-08-25 14:38:43.738037+00	2c95a09c-1a27-43e0-9532-614b78e3efa5
3e2e59be-9d53-4983-9141-5701b266f319		Welding Services	Huduma za Uchomeleaji	\N	2026-08-25 14:38:43.738037+00	983c70d5-7150-4135-8d09-fea3616fd73b
3f2a35d8-f020-4053-8e1d-73ba06ede787		Packaging Labels	Lebulu za Kufungia	\N	2026-08-25 14:38:43.738037+00	2c95a09c-1a27-43e0-9532-614b78e3efa5
40ad44f3-4972-43ec-8cb6-e32947d6c972		Pet Beds & Accessories	Vitanda na Vifaa vya Wanyama	\N	2026-08-25 14:38:43.738037+00	bd779c12-f4af-44ce-a7bf-6281021ae28b
40b115bd-00c9-47e6-890e-89c215cb5b84		Holiday Gifts & Decorations	Zawadi na Mapambo ya Sherehe	\N	2026-08-25 14:38:43.738037+00	283b7fa7-d6b8-4f63-ae68-58c96ac019f4
41195db4-dd21-4394-bb83-e3560085aea2		Oral Care	Utunzaji wa Mdomo	\N	2026-08-25 14:38:43.738037+00	d12924c8-8b7c-4008-a891-7c273c3627fe
41450749-58b2-4ff0-89fb-a64098200b58		Oils & Lubricants	Mafuta na Vilainishi	\N	2026-08-25 14:38:43.738037+00	625042b4-ae95-4c08-975f-f7c315e402e2
41c0b35d-9d6e-4f66-b256-1ab4946f6784		Tool Sets	Seti za Zana	\N	2026-08-25 14:38:43.738037+00	652744e2-b4b3-4b74-a1e5-6bc58be4db82
42b57ced-c1af-4ad9-8248-90044163d44f		Beauty Tools	Vifaa vya Urembo	\N	2026-08-25 14:38:43.738037+00	bee4ac11-904f-48ec-a327-3e798bc6be67
43b3749b-aa25-4702-8f23-1999e78dbc83		Building Glass	Vioo vya Ujenzi	\N	2026-08-25 14:38:43.738037+00	826506aa-2d4b-41c8-afd3-4d85ada92d1b
43b79475-733c-499d-a2dc-f06fa528d3ba		Garden Supplies	Vifaa vya Bustani	\N	2026-08-25 14:38:43.738037+00	925e698a-9035-4cd6-9e63-f3651267443c
447fca2b-0e85-4f7d-b9be-160868830f05		Hair Care & Styling	Utunzaji na Kutengeneza Nywele	\N	2026-08-25 14:38:43.738037+00	bee4ac11-904f-48ec-a327-3e798bc6be67
44e0573e-55d4-4fac-ae80-5696c0a3ac0e		Wallpapers & Wall Coatings	Ukuta na Rangi za Kuta	\N	2026-08-25 14:38:43.738037+00	826506aa-2d4b-41c8-afd3-4d85ada92d1b
44e22ab6-c361-449d-a346-836b2ebb391e		Skin Care	Utunzaji wa Ngozi	\N	2026-08-25 14:38:43.738037+00	bee4ac11-904f-48ec-a327-3e798bc6be67
459db7a1-7be5-46d4-9c6d-6bbb3c7df31a		Amusement Park Products	Bidhaa za Hifadhi za Burudani	\N	2026-08-25 14:38:43.738037+00	8e790248-aa30-4e4d-a171-eac4fd496b7e
48d8c013-5cea-4d9a-a377-4b0100dde339		Used Electronics	Vifaa vya Kielektroniki Vilivyotumika	\N	2026-08-25 14:38:43.738037+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
48daff56-14d6-4285-b003-de894dd6365d		Plugs & Sockets	Plagi na Soketi	\N	2026-08-25 14:38:43.738037+00	6bebacc8-ef9d-4de5-bde6-0a2f29b04a8b
492c7799-7cc8-482d-888f-cc1c18295c7b		Outdoor Sports	Michezo ya Nje	\N	2026-08-25 14:38:43.738037+00	8e790248-aa30-4e4d-a171-eac4fd496b7e
4a2fbcdb-1704-4d62-8bda-dea87354c397		Metal Fabrication Services	Huduma za Utengenezaji wa Vyuma	\N	2026-08-25 14:38:43.738037+00	983c70d5-7150-4135-8d09-fea3616fd73b
4ac100e3-3295-4afd-a608-ae3acb957bcb		Oral Hygiene	Usafi wa Mdomo	\N	2026-08-25 14:38:43.738037+00	bee4ac11-904f-48ec-a327-3e798bc6be67
4b022e1d-cf58-4984-b8f5-8a232085d69f		Beans	Maharage	\N	2026-08-25 14:38:43.738037+00	0f4d3d19-96ff-4199-8063-159cccb059c3
4c24d053-6fdc-4c8d-af8a-b00705651bb5		Lifting Tools	Zana za Kuinua	\N	2026-08-25 14:38:43.738037+00	652744e2-b4b3-4b74-a1e5-6bc58be4db82
4d1e7aac-4c8a-40f0-a185-b2eab06cca0d		Household Sundries	Vifaa vya Nyumbani	\N	2026-08-25 14:38:43.738037+00	925e698a-9035-4cd6-9e63-f3651267443c
501f7203-1a4e-48c5-b841-106e675eb719		Socks & Hosiery	Soksi na Siteti	\N	2026-08-25 14:38:43.738037+00	f01c52c5-3317-4c72-9f91-0738d9dd51d3
50e461cd-b484-42d0-8537-62e303f62be2		Access Control Systems	Mifumo ya Kudhibiti Ufikiaji	\N	2026-08-25 14:38:43.738037+00	3729d0df-15e4-4dda-ae0b-7e63dce7e82a
5165db6d-d626-4fc3-84f1-a4c29cacfd8d		Car Care & Cleaning	Utunzaji na Usafi wa Gari	\N	2026-08-25 14:38:43.738037+00	625042b4-ae95-4c08-975f-f7c315e402e2
524de8b8-8d9c-4e52-804b-8284927b4556		Body Jewelry	Vito vya Mwili	\N	2026-08-25 14:38:43.738037+00	8c9521d1-1646-4e3d-8c95-b8c5fa2425b6
541ae2d7-0a65-42f6-b8c3-0ec251c3d3c6		Aquariums & Accessories	Aquariums na Vifaa	\N	2026-08-25 14:38:43.738037+00	bd779c12-f4af-44ce-a7bf-6281021ae28b
545dcf35-6c68-450d-b809-b1e46e2383bb		Pet Toys	Vifaa vya Kuchezea vya Wanyama	\N	2026-08-25 14:38:43.738037+00	bd779c12-f4af-44ce-a7bf-6281021ae28b
554769e5-2049-4f32-b9b9-b212525a38d8		Tires & Accessories	Matairi na Vifaa	\N	2026-08-25 14:38:43.738037+00	625042b4-ae95-4c08-975f-f7c315e402e2
560775e5-ad04-404d-9939-16f9a38ea423		Ladders & Scaffolding	Ngazi na Kiunzi	\N	2026-08-25 14:38:43.738037+00	826506aa-2d4b-41c8-afd3-4d85ada92d1b
563747dc-1890-4b53-b859-d34abf12ba33		Plastic Fabrication Services	Huduma za Utengenezaji wa Plastiki	\N	2026-08-25 14:38:43.738037+00	983c70d5-7150-4135-8d09-fea3616fd73b
5726a248-ae89-4483-88dd-cb73a4a68ba2		Solar Water Heaters	Hita za Maji za Jua	\N	2026-08-25 14:38:43.738037+00	95b341ac-be9e-45fe-859e-99e18630a1cf
580d74b9-8d74-45a8-b1ad-ca369ba2e0c8		Home Decor	Mapambo ya Nyumbani	\N	2026-08-25 14:38:43.738037+00	925e698a-9035-4cd6-9e63-f3651267443c
592f7888-0fb6-4363-b407-cb4d32d8175e		Watches	Saa za Mikono	\N	2026-08-25 14:38:43.738037+00	8c9521d1-1646-4e3d-8c95-b8c5fa2425b6
5b29eb6c-842d-4162-b546-3a189a3afd16		Backpacks	Mikoba ya Mgongo	\N	2026-08-25 14:38:43.738037+00	719109cc-bb4f-4f04-ae1e-11a803aed41a
5c3f59e8-0b37-4856-a63e-91fe3a8ff147		Vehicle Tools	Zana za Magari	\N	2026-08-25 14:38:43.738037+00	36421f19-a9ba-49cd-a96f-66f488edaf26
5c5ced8a-8fc1-4130-abe3-bb9f0f89f25c		Lanyards	Kamba za Shingo	\N	2026-08-25 14:38:43.738037+00	283b7fa7-d6b8-4f63-ae68-58c96ac019f4
5d2ee588-12f9-4422-a79c-e8356e733c52		CCTV Products	Bidhaa za CCTV	\N	2026-08-25 14:38:43.738037+00	3729d0df-15e4-4dda-ae0b-7e63dce7e82a
5dd993ec-78b8-49fd-b027-645fd552cccb		Industrial Controls	Vidhibiti vya Viwandani	\N	2026-08-25 14:38:43.738037+00	6bebacc8-ef9d-4de5-bde6-0a2f29b04a8b
5ea5bdcb-3784-4225-86b7-04cd42e1cd5c		Accessories	Vifaa vya Kuvaa	\N	2026-08-25 14:38:43.738037+00	f01c52c5-3317-4c72-9f91-0738d9dd51d3
606bec46-0f6d-4ed2-aeab-85caaa85a430		Agricultural Waste	Taka za Kilimo	\N	2026-08-25 14:38:43.738037+00	0f4d3d19-96ff-4199-8063-159cccb059c3
63af60ac-b592-4d49-acea-4b75a0ae4908		Fresh Vegetables	Mboga Safi	\N	2026-08-25 14:38:43.738037+00	0f4d3d19-96ff-4199-8063-159cccb059c3
6cff2a9a-d920-44c8-9949-c8c61a0c1f0c		Bedding	Matandiko	Shuka, foronya, na vifaa vya kitanda	2026-10-02 09:24:24.701241+00	925e698a-9035-4cd6-9e63-f3651267443c
b2c3d4e5-7777-4b3c-9d4e-777788889999	Laptop	Laptops	Laptops	Kompyuta za mkononi (laptops) za aina zote	2026-10-08 16:30:45.531967+00	83a4e976-29e2-40ec-8ab9-68fa9a74ad2a
71ad562a-d519-4034-85e2-fcb3a4bdf59f	Speaker	Speakers & Subwoofers	Spika na Subwoofer	Spika kubwa, ndogo na subwoofer za bass	2026-10-14 16:27:49.762104+00	9ef74a44-bb94-43e9-96c8-ca7a4fee334d
2fc2dcda-074f-4cc2-b0ea-9d94e1d69462	Mic	Microphones	Maikrofoni	Maikrofoni za studio, jukwaa na matukio	2026-10-14 16:27:49.762104+00	9ef74a44-bb94-43e9-96c8-ca7a4fee334d
d443bdc7-c450-46a6-acf8-df9ae3a0bfd3	Tune	Amplifiers & Mixers	Amplifier na Mixer	Vifaa vya kuongeza sauti na kuchanganya	2026-10-14 16:27:49.762104+00	9ef74a44-bb94-43e9-96c8-ca7a4fee334d
49a0a9b2-a56f-4b23-a1fc-3a89e4eab3fa	Disc	DJ Equipment	Vifaa vya DJ	Vifaa vya DJ, controller na turntables	2026-10-14 16:27:49.762104+00	9ef74a44-bb94-43e9-96c8-ca7a4fee334d
c54aa523-71cd-4497-aa59-0680cb8a32e8	Cable	Cables & Connectors	Kebo na Viunganishi	Kebo za sauti, XLR, Jack na viunganishi	2026-10-14 16:27:49.762104+00	9ef74a44-bb94-43e9-96c8-ca7a4fee334d
45492267-52d3-445b-9831-28c3f178f56f	Piano	Musical Instruments	Vifaa vya Muziki	Gita, piano, ngoma na ala nyingine za muziki	2026-10-14 16:27:49.762104+00	9ef74a44-bb94-43e9-96c8-ca7a4fee334d
445fe3b7-7acc-470c-a304-b5dd003b976e	CookingPot	Cookware	Vyombo vya Kupikia	\N	2026-10-25 18:44:44.282559+00	754eaf89-2ff3-43bb-b5aa-7afb7b0dd480
d2a29dc9-a387-4225-9ad1-2151d1313cdd	Utensils	Kitchen Utensils	Vifaa vya Jikoni	\N	2026-10-25 18:44:44.282559+00	754eaf89-2ff3-43bb-b5aa-7afb7b0dd480
3eab6ed9-46f3-4fce-8c62-810723e2c3fc	UtensilsCrossed	Tableware & Dining	Sahani na Mlo	\N	2026-10-25 18:44:44.282559+00	754eaf89-2ff3-43bb-b5aa-7afb7b0dd480
c74154ea-a09f-46db-85b5-937a457cf2f7	Box	Home Storage	Vyombo vya Kuhifadhia	\N	2026-10-25 18:44:44.282559+00	754eaf89-2ff3-43bb-b5aa-7afb7b0dd480
0136503c-4a38-4fd6-b180-1ea7a0348911	Zap	Home Appliances	Vifaa vya Umeme vya Nyumbani	\N	2026-10-25 18:44:44.282559+00	754eaf89-2ff3-43bb-b5aa-7afb7b0dd480
1c2b3a4f-5e6d-7c8b-9a0f-1e2d3c4b5a6f	Lightbulb	Indoor Lighting	Taa za Ndani	Taa za mapambo na za kawaida za ndani ya nyumba	2026-10-26 07:39:00+00	b7a1f6c4-3e2d-41a5-8c76-5d9e2f1a0b3c
2d3e4f5a-6b7c-8d9e-0f1a-2b3c4d5e6f7a	Zap	LED & Strip Lights	Taa za LED na Mikanda	Taa za LED, strip lights na taa za mapambo ya pembeni	2026-10-26 07:39:00+00	b7a1f6c4-3e2d-41a5-8c76-5d9e2f1a0b3c
3e4f5a6b-7c8d-9e0f-1a2b-3c4d5e6f7a8b	Sun	Lamps & Decorative Lighting	Taa za Mezani na Mapambo	Taa za kusomea, taa za pembeni ya kitanda na za ukutani	2026-10-26 07:39:00+00	b7a1f6c4-3e2d-41a5-8c76-5d9e2f1a0b3c
4f5a6b7c-8d9e-0f1a-2b3c-4d5e6f7a8b9c	Shield	Outdoor Lighting	Taa za Nje	Taa za bustani, getini na za sola za nje	2026-10-26 07:39:00+00	b7a1f6c4-3e2d-41a5-8c76-5d9e2f1a0b3c
5a6b7c8d-9e0f-1a2b-3c4d-5e6f7a8b9c0d	Tool	Lighting Accessories	Vifaa vya Taa	Holders, bulb adaptors na mifumo ya kuunganishia taa	2026-10-26 07:39:00+00	b7a1f6c4-3e2d-41a5-8c76-5d9e2f1a0b3c
\.


--
-- Data for Name: users_user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users_user" ("id", "password", "last_login", "is_superuser", "username", "first_name", "last_name", "is_staff", "is_active", "date_joined", "phone", "role", "full_name", "email") FROM stdin;
2	pbkdf2_sha256$600000$fKOewKSdvfzFpgVoGQHBaj$3F7FlJLD2oHstUUIfYBC6LoBjxKLVt93fLIjtjpkyX4=	\N	f	kelvinsambulu@gmail.com			f	t	2026-07-17 14:24:39.15+00		buyer		kelvinsambulu@gmail.com
3	pbkdf2_sha256$600000$EaJOrnYBSXUmAPxj0PY7Hb$3JjXCeT+LXKT8NqT/zBcM0iH6M83JfofWG/6Itgajc0=	\N	f	hawaamidu241@gmail.com			f	t	2026-07-17 14:25:26.135+00		buyer		hawaamidu241@gmail.com
5	pbkdf2_sha256$600000$P0CPGHC7OGcMX2ijh1hCDT$VUENtmnLKm/PQ9TKpWzRAP/R6sLqjE1qboy2BStaNDA=	\N	f	joshua241@gmail.com			f	t	2026-07-17 14:32:16.604+00		buyer		joshua241@gmail.com
6	pbkdf2_sha256$600000$lvfCF3ZeYeNmBgM78fGE8q$Nc9D44+zzPy01QVr9BN3zO881ih72qd8v4DlSv2Ld70=	\N	f	kelvinsambulu241@gmail.com			f	t	2026-07-17 14:46:06.915+00		buyer		kelvinsambulu241@gmail.com
7	pbkdf2_sha256$600000$i40TXP0RT2MuwolqTMaxUF$tCqeQHTE+AjHISTNq7hQZu5cZtkfk4wtkc1wyoZDW1E=	\N	f	joshuajulius@gmail.com			f	t	2026-07-21 11:16:03.332+00		buyer		joshuajulius@gmail.com
8	pbkdf2_sha256$600000$pNjz9Hsegaax8HPgTzWkBu$eGuT2uOEphmrpvKco35glXs5KtuTqZFOw7Odlse2y8k=	\N	f	mariam@gmail.com			f	t	2026-07-22 09:30:02.979+00		buyer		mariam@gmail.com
4	pbkdf2_sha256$600000$zQFm59DPauiY8I0eVwMSD1$1S8plQWuTf2VQnUD8YNvh4pGfi9QpW0Htv/PsPB7Z9Q=	\N	f	mariam241@gmail.com			f	t	2026-08-03 12:28:29.641834+00		buyer		mariam241@gmail.com
9	pbkdf2_sha256$600000$r594OBsFyW9u3geVNJzqmK$I0jreURAJaPgl2j5bUf1Oza3+N1SqddY8A1cdhvjgO0=	\N	f	mwita241@gmail.com			f	t	2026-08-04 12:50:48.673643+00		buyer		mwita241@gmail.com
11		\N	f	zawadgordon@gmail.com			f	t	2026-09-04 20:39:29.480897+00		buyer		zawadgordon@gmail.com
12		\N	f	karimpenuel17@gmail.com			f	t	2026-09-04 21:23:15.710628+00		buyer		karimpenuel17@gmail.com
13		\N	f	deftbates8@gmail.com			f	t	2026-09-20 17:14:18.20073+00		buyer		deftbates8@gmail.com
14		\N	f	hapam0121@gmail.com			f	t	2026-09-29 20:28:01.143131+00		buyer		hapam0121@gmail.com
15		\N	f	emmanuelghambi433@gmail.com			f	t	2026-10-01 17:41:43.180274+00		buyer		emmanuelghambi433@gmail.com
16		\N	f	changsmills@gmail.com			f	t	2026-10-04 09:41:33.497052+00		buyer		changsmills@gmail.com
19		\N	f	magigepaul054@gmail.com			f	t	2026-10-07 01:37:12.195918+00		buyer		magigepaul054@gmail.com
20		\N	f	jezitzcotz@gmail.com			f	t	2026-10-09 21:19:20.57176+00		buyer		jezitzcotz@gmail.com
21		\N	f	musictzcotz@gmail.com			f	t	2026-10-14 15:53:28.107517+00		buyer		musictzcotz@gmail.com
22		\N	f	cotzvyombotz@gmail.com			f	t	2026-10-16 04:45:28.047799+00		buyer		cotzvyombotz@gmail.com
23		\N	f	phonetzcotz@gmail.com			f	t	2026-10-16 04:47:53.932905+00		buyer		phonetzcotz@gmail.com
18	pbkdf2_sha256$600000$kXQPw6U54ZDA2y42Zs20WS$WAmuR5r++xcgPaihDuUrk0iosKBPgqohYqSPzMiXHwI=	2026-10-04 16:31:07.198251+00	t	skyfallcotz@gmail.com			t	t	2026-10-04 16:30:31.637479+00		buyer		skyfallcotz@gmail.com
1	pbkdf2_sha256$600000$WxOJvD9isqlRhvPdoLUqVE$fDEBn6gDkCPv0g6LpEGKhihMFtpFxT0nqNqmI6AG7Lk=	2026-10-25 07:35:19.863502+00	t	joshuajulius241@gmail.com			t	t	2026-07-17 14:12:16.369+00		buyer		joshuajulius241@gmail.com
24		\N	f	vifaavyaumemetzcotz@gmail.com			f	t	2026-10-25 11:47:59.187321+00		buyer		vifaavyaumemetzcotz@gmail.com
25		\N	f	nishatimbadalatzcotz@gmail.com			f	t	2026-10-25 11:52:43.428901+00		buyer		nishatimbadalatzcotz@gmail.com
26		\N	f	urembotzcotz@gmail.com			f	t	2026-10-25 11:55:37.201218+00		buyer		urembotzcotz@gmail.com
27		\N	f	vitotzcotz@gmail.com			f	t	2026-10-25 11:59:03.134171+00		buyer		vitotzcotz@gmail.com
28		\N	f	nguovifaatzcotz@gmail.com			f	t	2026-10-25 12:04:54.402599+00		buyer		nguovifaatzcotz@gmail.com
29		\N	f	vyombocotz@gmail.com			f	t	2026-10-25 18:17:45.017241+00		buyer		vyombocotz@gmail.com
30		\N	f	mwangatzcotz@gmail.com			f	t	2026-10-26 14:43:34.47753+00		buyer		mwangatzcotz@gmail.com
31		\N	f	mazoezitzcotz@gmail.com			f	t	2026-10-26 15:04:58.4027+00		buyer		mazoezitzcotz@gmail.com
32		\N	f	begipochitzcotz@gmail.com			f	t	2026-10-26 15:31:40.828394+00		buyer		begipochitzcotz@gmail.com
\.


--
-- Data for Name: users_user_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users_user_groups" ("id", "user_id", "group_id") FROM stdin;
\.


--
-- Data for Name: users_user_user_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users_user_user_permissions" ("id", "user_id", "permission_id") FROM stdin;
\.


--
-- Name: account_emailaddress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."account_emailaddress_id_seq"', 1, true);


--
-- Name: account_emailconfirmation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."account_emailconfirmation_id_seq"', 1, false);


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."auth_group_id_seq"', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."auth_group_permissions_id_seq"', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."auth_permission_id_seq"', 128, true);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."django_admin_log_id_seq"', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."django_content_type_id_seq"', 32, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."django_migrations_id_seq"', 81, true);


--
-- Name: django_site_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."django_site_id_seq"', 1, true);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."order_items_id_seq"', 1, true);


--
-- Name: socialaccount_socialaccount_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."socialaccount_socialaccount_id_seq"', 1, false);


--
-- Name: socialaccount_socialapp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."socialaccount_socialapp_id_seq"', 1, false);


--
-- Name: socialaccount_socialapp_sites_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."socialaccount_socialapp_sites_id_seq"', 1, false);


--
-- Name: socialaccount_socialtoken_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."socialaccount_socialtoken_id_seq"', 1, false);


--
-- Name: users_user_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_user_groups_id_seq"', 1, false);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_user_id_seq"', 32, true);


--
-- Name: users_user_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_user_user_permissions_id_seq"', 1, false);


--
-- Name: account account_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."account"
    ADD CONSTRAINT "account_pkey" PRIMARY KEY ("id");


--
-- Name: invitation invitation_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."invitation"
    ADD CONSTRAINT "invitation_pkey" PRIMARY KEY ("id");


--
-- Name: jwks jwks_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."jwks"
    ADD CONSTRAINT "jwks_pkey" PRIMARY KEY ("id");


--
-- Name: member member_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."member"
    ADD CONSTRAINT "member_pkey" PRIMARY KEY ("id");


--
-- Name: organization organization_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."organization"
    ADD CONSTRAINT "organization_pkey" PRIMARY KEY ("id");


--
-- Name: organization organization_slug_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."organization"
    ADD CONSTRAINT "organization_slug_key" UNIQUE ("slug");


--
-- Name: project_config project_config_endpoint_id_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."project_config"
    ADD CONSTRAINT "project_config_endpoint_id_key" UNIQUE ("endpoint_id");


--
-- Name: project_config project_config_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."project_config"
    ADD CONSTRAINT "project_config_pkey" PRIMARY KEY ("id");


--
-- Name: session session_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."session"
    ADD CONSTRAINT "session_pkey" PRIMARY KEY ("id");


--
-- Name: session session_token_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."session"
    ADD CONSTRAINT "session_token_key" UNIQUE ("token");


--
-- Name: user user_email_key; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."user"
    ADD CONSTRAINT "user_email_key" UNIQUE ("email");


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."user"
    ADD CONSTRAINT "user_pkey" PRIMARY KEY ("id");


--
-- Name: verification verification_pkey; Type: CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."verification"
    ADD CONSTRAINT "verification_pkey" PRIMARY KEY ("id");


--
-- Name: account_emailaddress account_emailaddress_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."account_emailaddress"
    ADD CONSTRAINT "account_emailaddress_pkey" PRIMARY KEY ("id");


--
-- Name: account_emailaddress account_emailaddress_user_id_email_987c8728_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."account_emailaddress"
    ADD CONSTRAINT "account_emailaddress_user_id_email_987c8728_uniq" UNIQUE ("user_id", "email");


--
-- Name: account_emailconfirmation account_emailconfirmation_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."account_emailconfirmation"
    ADD CONSTRAINT "account_emailconfirmation_key_key" UNIQUE ("key");


--
-- Name: account_emailconfirmation account_emailconfirmation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."account_emailconfirmation"
    ADD CONSTRAINT "account_emailconfirmation_pkey" PRIMARY KEY ("id");


--
-- Name: admins admins_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."admins"
    ADD CONSTRAINT "admins_pkey" PRIMARY KEY ("id_id");


--
-- Name: advertisements advertisements_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."advertisements"
    ADD CONSTRAINT "advertisements_pkey" PRIMARY KEY ("id");


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_group"
    ADD CONSTRAINT "auth_group_name_key" UNIQUE ("name");


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_group_permissions"
    ADD CONSTRAINT "auth_group_permissions_group_id_permission_id_0cd325b0_uniq" UNIQUE ("group_id", "permission_id");


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_group_permissions"
    ADD CONSTRAINT "auth_group_permissions_pkey" PRIMARY KEY ("id");


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_group"
    ADD CONSTRAINT "auth_group_pkey" PRIMARY KEY ("id");


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_permission"
    ADD CONSTRAINT "auth_permission_content_type_id_codename_01ab375a_uniq" UNIQUE ("content_type_id", "codename");


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_permission"
    ADD CONSTRAINT "auth_permission_pkey" PRIMARY KEY ("id");


--
-- Name: authtoken_token authtoken_token_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."authtoken_token"
    ADD CONSTRAINT "authtoken_token_pkey" PRIMARY KEY ("key");


--
-- Name: authtoken_token authtoken_token_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."authtoken_token"
    ADD CONSTRAINT "authtoken_token_user_id_key" UNIQUE ("user_id");


--
-- Name: brands brands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."brands"
    ADD CONSTRAINT "brands_pkey" PRIMARY KEY ("id");


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."categories"
    ADD CONSTRAINT "categories_pkey" PRIMARY KEY ("id");


--
-- Name: disputes disputes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."disputes"
    ADD CONSTRAINT "disputes_pkey" PRIMARY KEY ("id");


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_admin_log"
    ADD CONSTRAINT "django_admin_log_pkey" PRIMARY KEY ("id");


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_content_type"
    ADD CONSTRAINT "django_content_type_app_label_model_76bd3d3b_uniq" UNIQUE ("app_label", "model");


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_content_type"
    ADD CONSTRAINT "django_content_type_pkey" PRIMARY KEY ("id");


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_migrations"
    ADD CONSTRAINT "django_migrations_pkey" PRIMARY KEY ("id");


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_session"
    ADD CONSTRAINT "django_session_pkey" PRIMARY KEY ("session_key");


--
-- Name: django_site django_site_domain_a2e37b91_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_site"
    ADD CONSTRAINT "django_site_domain_a2e37b91_uniq" UNIQUE ("domain");


--
-- Name: django_site django_site_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_site"
    ADD CONSTRAINT "django_site_pkey" PRIMARY KEY ("id");


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_pkey" PRIMARY KEY ("id");


--
-- Name: leaf_categories leaf_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."leaf_categories"
    ADD CONSTRAINT "leaf_categories_pkey" PRIMARY KEY ("id");


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_pkey" PRIMARY KEY ("id");


--
-- Name: orders orders_order_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_order_number_key" UNIQUE ("order_number");


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_pkey" PRIMARY KEY ("id");


--
-- Name: otp_codes otp_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."otp_codes"
    ADD CONSTRAINT "otp_codes_pkey" PRIMARY KEY ("id");


--
-- Name: product_media product_media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."product_media"
    ADD CONSTRAINT "product_media_pkey" PRIMARY KEY ("id");


--
-- Name: product_variations product_variations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."product_variations"
    ADD CONSTRAINT "product_variations_pkey" PRIMARY KEY ("id");


--
-- Name: products_engines products_engines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."products_engines"
    ADD CONSTRAINT "products_engines_pkey" PRIMARY KEY ("id");


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");


--
-- Name: profiles profiles_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_key" UNIQUE ("user_id");


--
-- Name: profiles profiles_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_username_key" UNIQUE ("username");


--
-- Name: shipping_methods shipping_methods_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."shipping_methods"
    ADD CONSTRAINT "shipping_methods_pkey" PRIMARY KEY ("id");


--
-- Name: socialaccount_socialaccount socialaccount_socialaccount_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."socialaccount_socialaccount"
    ADD CONSTRAINT "socialaccount_socialaccount_pkey" PRIMARY KEY ("id");


--
-- Name: socialaccount_socialaccount socialaccount_socialaccount_provider_uid_fc810c6e_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."socialaccount_socialaccount"
    ADD CONSTRAINT "socialaccount_socialaccount_provider_uid_fc810c6e_uniq" UNIQUE ("provider", "uid");


--
-- Name: socialaccount_socialapp_sites socialaccount_socialapp__socialapp_id_site_id_71a9a768_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."socialaccount_socialapp_sites"
    ADD CONSTRAINT "socialaccount_socialapp__socialapp_id_site_id_71a9a768_uniq" UNIQUE ("socialapp_id", "site_id");


--
-- Name: socialaccount_socialapp socialaccount_socialapp_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."socialaccount_socialapp"
    ADD CONSTRAINT "socialaccount_socialapp_pkey" PRIMARY KEY ("id");


--
-- Name: socialaccount_socialapp_sites socialaccount_socialapp_sites_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."socialaccount_socialapp_sites"
    ADD CONSTRAINT "socialaccount_socialapp_sites_pkey" PRIMARY KEY ("id");


--
-- Name: socialaccount_socialtoken socialaccount_socialtoken_app_id_account_id_fca4e0ac_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."socialaccount_socialtoken"
    ADD CONSTRAINT "socialaccount_socialtoken_app_id_account_id_fca4e0ac_uniq" UNIQUE ("app_id", "account_id");


--
-- Name: socialaccount_socialtoken socialaccount_socialtoken_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."socialaccount_socialtoken"
    ADD CONSTRAINT "socialaccount_socialtoken_pkey" PRIMARY KEY ("id");


--
-- Name: stores_engine stores_engine_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."stores_engine"
    ADD CONSTRAINT "stores_engine_pkey" PRIMARY KEY ("id");


--
-- Name: sub_categories sub_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."sub_categories"
    ADD CONSTRAINT "sub_categories_pkey" PRIMARY KEY ("id");


--
-- Name: users_user users_user_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_user"
    ADD CONSTRAINT "users_user_email_key" UNIQUE ("email");


--
-- Name: users_user_groups users_user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_user_groups"
    ADD CONSTRAINT "users_user_groups_pkey" PRIMARY KEY ("id");


--
-- Name: users_user_groups users_user_groups_user_id_group_id_b88eab82_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_user_groups"
    ADD CONSTRAINT "users_user_groups_user_id_group_id_b88eab82_uniq" UNIQUE ("user_id", "group_id");


--
-- Name: users_user users_user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_user"
    ADD CONSTRAINT "users_user_pkey" PRIMARY KEY ("id");


--
-- Name: users_user_user_permissions users_user_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_user_user_permissions"
    ADD CONSTRAINT "users_user_user_permissions_pkey" PRIMARY KEY ("id");


--
-- Name: users_user_user_permissions users_user_user_permissions_user_id_permission_id_43338c45_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_user_user_permissions"
    ADD CONSTRAINT "users_user_user_permissions_user_id_permission_id_43338c45_uniq" UNIQUE ("user_id", "permission_id");


--
-- Name: users_user users_user_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_user"
    ADD CONSTRAINT "users_user_username_key" UNIQUE ("username");


--
-- Name: account_userId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "account_userId_idx" ON "neon_auth"."account" USING "btree" ("userId");


--
-- Name: invitation_email_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "invitation_email_idx" ON "neon_auth"."invitation" USING "btree" ("email");


--
-- Name: invitation_organizationId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "invitation_organizationId_idx" ON "neon_auth"."invitation" USING "btree" ("organizationId");


--
-- Name: member_organizationId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "member_organizationId_idx" ON "neon_auth"."member" USING "btree" ("organizationId");


--
-- Name: member_userId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "member_userId_idx" ON "neon_auth"."member" USING "btree" ("userId");


--
-- Name: organization_slug_uidx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE UNIQUE INDEX "organization_slug_uidx" ON "neon_auth"."organization" USING "btree" ("slug");


--
-- Name: session_userId_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "session_userId_idx" ON "neon_auth"."session" USING "btree" ("userId");


--
-- Name: verification_identifier_idx; Type: INDEX; Schema: neon_auth; Owner: -
--

CREATE INDEX "verification_identifier_idx" ON "neon_auth"."verification" USING "btree" ("identifier");


--
-- Name: account_emailaddress_email_03be32b2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "account_emailaddress_email_03be32b2" ON "public"."account_emailaddress" USING "btree" ("email");


--
-- Name: account_emailaddress_email_03be32b2_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "account_emailaddress_email_03be32b2_like" ON "public"."account_emailaddress" USING "btree" ("email" "varchar_pattern_ops");


--
-- Name: account_emailaddress_user_id_2c513194; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "account_emailaddress_user_id_2c513194" ON "public"."account_emailaddress" USING "btree" ("user_id");


--
-- Name: account_emailconfirmation_email_address_id_5b7f8c58; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "account_emailconfirmation_email_address_id_5b7f8c58" ON "public"."account_emailconfirmation" USING "btree" ("email_address_id");


--
-- Name: account_emailconfirmation_key_f43612bd_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "account_emailconfirmation_key_f43612bd_like" ON "public"."account_emailconfirmation" USING "btree" ("key" "varchar_pattern_ops");


--
-- Name: advertiseme_ad_type_a82d67_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_ad_type_a82d67_idx" ON "public"."advertisements" USING "btree" ("ad_type");


--
-- Name: advertiseme_approve_001157_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_approve_001157_idx" ON "public"."advertisements" USING "btree" ("approved_at" DESC);


--
-- Name: advertiseme_approve_59add8_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_approve_59add8_idx" ON "public"."advertisements" USING "btree" ("approved_by_id");


--
-- Name: advertiseme_approve_a190bc_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_approve_a190bc_idx" ON "public"."advertisements" USING "btree" ("approved_by_id", "status");


--
-- Name: advertiseme_busines_68b5fd_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_busines_68b5fd_idx" ON "public"."advertisements" USING "btree" ("business_name");


--
-- Name: advertiseme_created_4b312b_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_created_4b312b_idx" ON "public"."advertisements" USING "btree" ("created_at" DESC);


--
-- Name: advertiseme_media_t_add222_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_media_t_add222_idx" ON "public"."advertisements" USING "btree" ("media_type");


--
-- Name: advertiseme_rejecte_82e0e6_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_rejecte_82e0e6_idx" ON "public"."advertisements" USING "btree" ("rejected_by_id");


--
-- Name: advertiseme_status_1b1a3d_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_status_1b1a3d_idx" ON "public"."advertisements" USING "btree" ("status");


--
-- Name: advertiseme_status_45d396_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_status_45d396_idx" ON "public"."advertisements" USING "btree" ("status", "media_type");


--
-- Name: advertiseme_status_581677_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_status_581677_idx" ON "public"."advertisements" USING "btree" ("status", "created_at" DESC);


--
-- Name: advertiseme_status_efada0_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_status_efada0_idx" ON "public"."advertisements" USING "btree" ("status", "ad_type");


--
-- Name: advertiseme_store_i_10c24f_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_store_i_10c24f_idx" ON "public"."advertisements" USING "btree" ("store_id", "status");


--
-- Name: advertiseme_store_i_3b5600_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_store_i_3b5600_idx" ON "public"."advertisements" USING "btree" ("store_id", "ad_type");


--
-- Name: advertiseme_store_i_a9e1be_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_store_i_a9e1be_idx" ON "public"."advertisements" USING "btree" ("store_id");


--
-- Name: advertiseme_store_i_d705ab_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_store_i_d705ab_idx" ON "public"."advertisements" USING "btree" ("store_id", "status", "created_at" DESC);


--
-- Name: advertiseme_user_id_38ee86_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_user_id_38ee86_idx" ON "public"."advertisements" USING "btree" ("user_id", "status");


--
-- Name: advertiseme_user_id_cf8b3d_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertiseme_user_id_cf8b3d_idx" ON "public"."advertisements" USING "btree" ("user_id");


--
-- Name: advertisements_approved_by_id_17be2774; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertisements_approved_by_id_17be2774" ON "public"."advertisements" USING "btree" ("approved_by_id");


--
-- Name: advertisements_rejected_by_id_24e09c88; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertisements_rejected_by_id_24e09c88" ON "public"."advertisements" USING "btree" ("rejected_by_id");


--
-- Name: advertisements_user_id_08bcd5e1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "advertisements_user_id_08bcd5e1" ON "public"."advertisements" USING "btree" ("user_id");


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "auth_group_name_a6ea08ec_like" ON "public"."auth_group" USING "btree" ("name" "varchar_pattern_ops");


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "auth_group_permissions_group_id_b120cbf9" ON "public"."auth_group_permissions" USING "btree" ("group_id");


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "auth_group_permissions_permission_id_84c5c92e" ON "public"."auth_group_permissions" USING "btree" ("permission_id");


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "auth_permission_content_type_id_2f476e4b" ON "public"."auth_permission" USING "btree" ("content_type_id");


--
-- Name: authtoken_token_key_10f0b77e_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "authtoken_token_key_10f0b77e_like" ON "public"."authtoken_token" USING "btree" ("key" "varchar_pattern_ops");


--
-- Name: categories_created_9211a1_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "categories_created_9211a1_idx" ON "public"."categories" USING "btree" ("created_at" DESC);


--
-- Name: categories_icon_na_34e314_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "categories_icon_na_34e314_idx" ON "public"."categories" USING "btree" ("icon_name");


--
-- Name: categories_icon_na_7b574a_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "categories_icon_na_7b574a_idx" ON "public"."categories" USING "btree" ("icon_name", "name");


--
-- Name: categories_name_7a235e_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "categories_name_7a235e_idx" ON "public"."categories" USING "btree" ("name", "name_sw");


--
-- Name: categories_name_98d7d5_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "categories_name_98d7d5_idx" ON "public"."categories" USING "btree" ("name");


--
-- Name: categories_name_sw_e3dc21_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "categories_name_sw_e3dc21_idx" ON "public"."categories" USING "btree" ("name_sw");


--
-- Name: disputes_customer_id_a3cfecca; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "disputes_customer_id_a3cfecca" ON "public"."disputes" USING "btree" ("customer_id");


--
-- Name: disputes_order_id_87d8b2a7; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "disputes_order_id_87d8b2a7" ON "public"."disputes" USING "btree" ("order_id");


--
-- Name: disputes_product_id_7de12695; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "disputes_product_id_7de12695" ON "public"."disputes" USING "btree" ("product_id");


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "django_admin_log_content_type_id_c4bce8eb" ON "public"."django_admin_log" USING "btree" ("content_type_id");


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "django_admin_log_user_id_c564eba6" ON "public"."django_admin_log" USING "btree" ("user_id");


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "django_session_expire_date_a5c62663" ON "public"."django_session" USING "btree" ("expire_date");


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "django_session_session_key_c0390e0f_like" ON "public"."django_session" USING "btree" ("session_key" "varchar_pattern_ops");


--
-- Name: django_site_domain_a2e37b91_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "django_site_domain_a2e37b91_like" ON "public"."django_site" USING "btree" ("domain" "varchar_pattern_ops");


--
-- Name: leads_store_id_af6cabaa; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leads_store_id_af6cabaa" ON "public"."leads" USING "btree" ("store_id");


--
-- Name: leaf_catego_bulk_pr_6b2c5b_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_bulk_pr_6b2c5b_idx" ON "public"."leaf_categories" USING "btree" ("bulk_pricing_tiers");


--
-- Name: leaf_catego_color_h_94b0cd_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_color_h_94b0cd_idx" ON "public"."leaf_categories" USING "btree" ("color_hex");


--
-- Name: leaf_catego_color_r_f033a6_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_color_r_f033a6_idx" ON "public"."leaf_categories" USING "btree" ("color_required");


--
-- Name: leaf_catego_created_d14f91_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_created_d14f91_idx" ON "public"."leaf_categories" USING "btree" ("created_at" DESC);


--
-- Name: leaf_catego_dimensi_40e21f_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_dimensi_40e21f_idx" ON "public"."leaf_categories" USING "btree" ("dimensions_required");


--
-- Name: leaf_catego_icon_na_f760f6_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_icon_na_f760f6_idx" ON "public"."leaf_categories" USING "btree" ("icon_name");


--
-- Name: leaf_catego_materia_e0423f_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_materia_e0423f_idx" ON "public"."leaf_categories" USING "btree" ("material_type");


--
-- Name: leaf_catego_measure_9804d9_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_measure_9804d9_idx" ON "public"."leaf_categories" USING "btree" ("measurement_unit");


--
-- Name: leaf_catego_meta_de_8fcd4d_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_meta_de_8fcd4d_idx" ON "public"."leaf_categories" USING "btree" ("meta_description");


--
-- Name: leaf_catego_meta_ti_9781fe_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_meta_ti_9781fe_idx" ON "public"."leaf_categories" USING "btree" ("meta_title");


--
-- Name: leaf_catego_min_sto_f0d43e_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_min_sto_f0d43e_idx" ON "public"."leaf_categories" USING "btree" ("min_stock_warning");


--
-- Name: leaf_catego_name_06c22b_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_name_06c22b_idx" ON "public"."leaf_categories" USING "btree" ("name");


--
-- Name: leaf_catego_name_d22232_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_name_d22232_idx" ON "public"."leaf_categories" USING "btree" ("name", "name_sw");


--
-- Name: leaf_catego_name_sw_8aee8e_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_name_sw_8aee8e_idx" ON "public"."leaf_categories" USING "btree" ("name_sw");


--
-- Name: leaf_catego_require_5f0af9_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_require_5f0af9_idx" ON "public"."leaf_categories" USING "btree" ("require_gender");


--
-- Name: leaf_catego_require_e0d12a_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_require_e0d12a_idx" ON "public"."leaf_categories" USING "btree" ("require_size");


--
-- Name: leaf_catego_size_fo_2a3974_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_size_fo_2a3974_idx" ON "public"."leaf_categories" USING "btree" ("size_format");


--
-- Name: leaf_catego_sub_cat_03522c_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_sub_cat_03522c_idx" ON "public"."leaf_categories" USING "btree" ("sub_category_id", "require_size");


--
-- Name: leaf_catego_sub_cat_0c0707_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_sub_cat_0c0707_idx" ON "public"."leaf_categories" USING "btree" ("sub_category_id", "name");


--
-- Name: leaf_catego_sub_cat_438dd9_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_sub_cat_438dd9_idx" ON "public"."leaf_categories" USING "btree" ("sub_category_id", "color_required");


--
-- Name: leaf_catego_sub_cat_b24b4d_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_sub_cat_b24b4d_idx" ON "public"."leaf_categories" USING "btree" ("sub_category_id", "name_sw");


--
-- Name: leaf_catego_sub_cat_bf8ffd_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_sub_cat_bf8ffd_idx" ON "public"."leaf_categories" USING "btree" ("sub_category_id", "require_gender");


--
-- Name: leaf_catego_sub_cat_c6674b_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_sub_cat_c6674b_idx" ON "public"."leaf_categories" USING "btree" ("sub_category_id");


--
-- Name: leaf_catego_warrant_c60a31_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_warrant_c60a31_idx" ON "public"."leaf_categories" USING "btree" ("warranty_required");


--
-- Name: leaf_catego_weight__cc08a9_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_catego_weight__cc08a9_idx" ON "public"."leaf_categories" USING "btree" ("weight_required");


--
-- Name: leaf_categories_sub_category_id_331a4b78; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "leaf_categories_sub_category_id_331a4b78" ON "public"."leaf_categories" USING "btree" ("sub_category_id");


--
-- Name: messages_order_id_030a130e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "messages_order_id_030a130e" ON "public"."messages" USING "btree" ("order_id");


--
-- Name: messages_receiver_id_874b4e0a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "messages_receiver_id_874b4e0a" ON "public"."messages" USING "btree" ("receiver_id");


--
-- Name: messages_sender_id_dc5a0bbd; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "messages_sender_id_dc5a0bbd" ON "public"."messages" USING "btree" ("sender_id");


--
-- Name: order_items_order_id_412ad78b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "order_items_order_id_412ad78b" ON "public"."order_items" USING "btree" ("order_id");


--
-- Name: order_items_product_id_dd557d5a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "order_items_product_id_dd557d5a" ON "public"."order_items" USING "btree" ("product_id");


--
-- Name: order_items_variant_id_c29d5590; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "order_items_variant_id_c29d5590" ON "public"."order_items" USING "btree" ("variant_id");


--
-- Name: orders_customer_id_b7016332; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "orders_customer_id_b7016332" ON "public"."orders" USING "btree" ("customer_id");


--
-- Name: orders_order_number_fdca857f_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "orders_order_number_fdca857f_like" ON "public"."orders" USING "btree" ("order_number" "varchar_pattern_ops");


--
-- Name: otp_codes_created_4cefc5_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "otp_codes_created_4cefc5_idx" ON "public"."otp_codes" USING "btree" ("created_at");


--
-- Name: otp_codes_email_87b768_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "otp_codes_email_87b768_idx" ON "public"."otp_codes" USING "btree" ("email", "is_used");


--
-- Name: otp_codes_email_b20ef6_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "otp_codes_email_b20ef6_idx" ON "public"."otp_codes" USING "btree" ("email");


--
-- Name: otp_codes_email_eece01_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "otp_codes_email_eece01_idx" ON "public"."otp_codes" USING "btree" ("email", "otp");


--
-- Name: otp_codes_is_used_51d459_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "otp_codes_is_used_51d459_idx" ON "public"."otp_codes" USING "btree" ("is_used");


--
-- Name: otp_codes_otp_542e45_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "otp_codes_otp_542e45_idx" ON "public"."otp_codes" USING "btree" ("otp");


--
-- Name: product_media_product_id_da264f78; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "product_media_product_id_da264f78" ON "public"."product_media" USING "btree" ("product_id");


--
-- Name: product_variations_product_id_54835ab7; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "product_variations_product_id_54835ab7" ON "public"."product_variations" USING "btree" ("product_id");


--
-- Name: products_en_average_982e0b_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_average_982e0b_idx" ON "public"."products_engines" USING "btree" ("average_rating");


--
-- Name: products_en_barcode_7a602d_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_barcode_7a602d_idx" ON "public"."products_engines" USING "btree" ("barcode");


--
-- Name: products_en_brand_i_2fbed3_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_brand_i_2fbed3_idx" ON "public"."products_engines" USING "btree" ("brand_id");


--
-- Name: products_en_categor_268453_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_categor_268453_idx" ON "public"."products_engines" USING "btree" ("category_id");


--
-- Name: products_en_categor_c60748_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_categor_c60748_idx" ON "public"."products_engines" USING "btree" ("category_id", "is_approved");


--
-- Name: products_en_cover_i_1749fd_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_cover_i_1749fd_idx" ON "public"."products_engines" USING "btree" ("cover_image");


--
-- Name: products_en_created_8c1b4b_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_created_8c1b4b_idx" ON "public"."products_engines" USING "btree" ("created_at" DESC);


--
-- Name: products_en_enable__0cdc11_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_enable__0cdc11_idx" ON "public"."products_engines" USING "btree" ("enable_pickup");


--
-- Name: products_en_enable__abc761_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_enable__abc761_idx" ON "public"."products_engines" USING "btree" ("enable_sizes");


--
-- Name: products_en_has_col_4fc138_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_has_col_4fc138_idx" ON "public"."products_engines" USING "btree" ("has_colors");


--
-- Name: products_en_is_appr_0c4b85_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_is_appr_0c4b85_idx" ON "public"."products_engines" USING "btree" ("is_approved", "price");


--
-- Name: products_en_is_appr_25a637_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_is_appr_25a637_idx" ON "public"."products_engines" USING "btree" ("is_approved", "created_at" DESC);


--
-- Name: products_en_is_appr_956017_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_is_appr_956017_idx" ON "public"."products_engines" USING "btree" ("is_approved", "average_rating" DESC);


--
-- Name: products_en_is_appr_c7c141_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_is_appr_c7c141_idx" ON "public"."products_engines" USING "btree" ("is_approved", "views" DESC);


--
-- Name: products_en_is_appr_ef79c4_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_is_appr_ef79c4_idx" ON "public"."products_engines" USING "btree" ("is_approved");


--
-- Name: products_en_is_appr_f5d5f0_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_is_appr_f5d5f0_idx" ON "public"."products_engines" USING "btree" ("is_approved", "order_count" DESC);


--
-- Name: products_en_is_feat_ec92f8_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_is_feat_ec92f8_idx" ON "public"."products_engines" USING "btree" ("is_featured");


--
-- Name: products_en_is_feat_f803cb_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_is_feat_f803cb_idx" ON "public"."products_engines" USING "btree" ("is_featured", "is_approved");


--
-- Name: products_en_is_flas_a00639_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_is_flas_a00639_idx" ON "public"."products_engines" USING "btree" ("is_flash_sale");


--
-- Name: products_en_is_flas_ccb4a9_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_is_flas_ccb4a9_idx" ON "public"."products_engines" USING "btree" ("is_flash_sale", "is_approved");


--
-- Name: products_en_is_reta_bcc948_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_is_reta_bcc948_idx" ON "public"."products_engines" USING "btree" ("is_retail");


--
-- Name: products_en_is_reta_c0619a_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_is_reta_c0619a_idx" ON "public"."products_engines" USING "btree" ("is_retail", "is_approved");


--
-- Name: products_en_is_whol_750302_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_is_whol_750302_idx" ON "public"."products_engines" USING "btree" ("is_wholesale", "is_approved");


--
-- Name: products_en_is_whol_d81a26_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_is_whol_d81a26_idx" ON "public"."products_engines" USING "btree" ("is_wholesale");


--
-- Name: products_en_leaf_ca_cefc74_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_leaf_ca_cefc74_idx" ON "public"."products_engines" USING "btree" ("leaf_category_id", "is_approved");


--
-- Name: products_en_leaf_ca_ef036e_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_leaf_ca_ef036e_idx" ON "public"."products_engines" USING "btree" ("leaf_category_id");


--
-- Name: products_en_name_659c41_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_name_659c41_idx" ON "public"."products_engines" USING "btree" ("name");


--
-- Name: products_en_order_c_97c40a_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_order_c_97c40a_idx" ON "public"."products_engines" USING "btree" ("order_count");


--
-- Name: products_en_parent__2d47a0_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_parent__2d47a0_idx" ON "public"."products_engines" USING "btree" ("parent_category_id", "is_approved");


--
-- Name: products_en_parent__7a6264_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_parent__7a6264_idx" ON "public"."products_engines" USING "btree" ("parent_category_id");


--
-- Name: products_en_price_18314f_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_price_18314f_idx" ON "public"."products_engines" USING "btree" ("price");


--
-- Name: products_en_sku_1dcf57_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_sku_1dcf57_idx" ON "public"."products_engines" USING "btree" ("sku");


--
-- Name: products_en_user_id_e0a5ac_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_user_id_e0a5ac_idx" ON "public"."products_engines" USING "btree" ("user_id");


--
-- Name: products_en_views_9c6bc6_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_en_views_9c6bc6_idx" ON "public"."products_engines" USING "btree" ("views" DESC);


--
-- Name: products_engines_category_id_99280a05; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_engines_category_id_99280a05" ON "public"."products_engines" USING "btree" ("category_id");


--
-- Name: products_engines_leaf_category_id_6fee8335; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_engines_leaf_category_id_6fee8335" ON "public"."products_engines" USING "btree" ("leaf_category_id");


--
-- Name: products_engines_parent_category_id_059d2d20; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_engines_parent_category_id_059d2d20" ON "public"."products_engines" USING "btree" ("parent_category_id");


--
-- Name: products_engines_store_id_365673de; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_engines_store_id_365673de" ON "public"."products_engines" USING "btree" ("store_id");


--
-- Name: products_engines_user_id_aabb0f05; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "products_engines_user_id_aabb0f05" ON "public"."products_engines" USING "btree" ("user_id");


--
-- Name: profiles_username_b4c53dcb_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "profiles_username_b4c53dcb_like" ON "public"."profiles" USING "btree" ("username" "varchar_pattern_ops");


--
-- Name: shipping_methods_store_id_8b4db5b0; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "shipping_methods_store_id_8b4db5b0" ON "public"."shipping_methods" USING "btree" ("store_id");


--
-- Name: socialaccount_socialaccount_user_id_8146e70c; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "socialaccount_socialaccount_user_id_8146e70c" ON "public"."socialaccount_socialaccount" USING "btree" ("user_id");


--
-- Name: socialaccount_socialapp_sites_site_id_2579dee5; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "socialaccount_socialapp_sites_site_id_2579dee5" ON "public"."socialaccount_socialapp_sites" USING "btree" ("site_id");


--
-- Name: socialaccount_socialapp_sites_socialapp_id_97fb6e7d; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "socialaccount_socialapp_sites_socialapp_id_97fb6e7d" ON "public"."socialaccount_socialapp_sites" USING "btree" ("socialapp_id");


--
-- Name: socialaccount_socialtoken_account_id_951f210e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "socialaccount_socialtoken_account_id_951f210e" ON "public"."socialaccount_socialtoken" USING "btree" ("account_id");


--
-- Name: socialaccount_socialtoken_app_id_636a42d7; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "socialaccount_socialtoken_app_id_636a42d7" ON "public"."socialaccount_socialtoken" USING "btree" ("app_id");


--
-- Name: stores_engi_average_73f17e_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_average_73f17e_idx" ON "public"."stores_engine" USING "btree" ("average_rating" DESC);


--
-- Name: stores_engi_busines_a120e2_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_busines_a120e2_idx" ON "public"."stores_engine" USING "btree" ("business_type");


--
-- Name: stores_engi_categor_19ad3c_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_categor_19ad3c_idx" ON "public"."stores_engine" USING "btree" ("category_id", "status");


--
-- Name: stores_engi_categor_446e6a_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_categor_446e6a_idx" ON "public"."stores_engine" USING "btree" ("category_id", "average_rating" DESC);


--
-- Name: stores_engi_categor_5df477_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_categor_5df477_idx" ON "public"."stores_engine" USING "btree" ("category_id", "is_active");


--
-- Name: stores_engi_categor_7daafa_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_categor_7daafa_idx" ON "public"."stores_engine" USING "btree" ("category_id");


--
-- Name: stores_engi_categor_9c187e_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_categor_9c187e_idx" ON "public"."stores_engine" USING "btree" ("category_id", "is_verified");


--
-- Name: stores_engi_city_2cc504_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_city_2cc504_idx" ON "public"."stores_engine" USING "btree" ("city");


--
-- Name: stores_engi_city_664daf_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_city_664daf_idx" ON "public"."stores_engine" USING "btree" ("city", "is_active");


--
-- Name: stores_engi_created_4c8054_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_created_4c8054_idx" ON "public"."stores_engine" USING "btree" ("created_at" DESC);


--
-- Name: stores_engi_email_a468ed_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_email_a468ed_idx" ON "public"."stores_engine" USING "btree" ("email");


--
-- Name: stores_engi_instagr_48dde5_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_instagr_48dde5_idx" ON "public"."stores_engine" USING "btree" ("instagram_handle");


--
-- Name: stores_engi_is_acti_46c0ff_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_is_acti_46c0ff_idx" ON "public"."stores_engine" USING "btree" ("is_active", "is_verified");


--
-- Name: stores_engi_is_acti_5c03a5_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_is_acti_5c03a5_idx" ON "public"."stores_engine" USING "btree" ("is_active");


--
-- Name: stores_engi_is_acti_d23033_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_is_acti_d23033_idx" ON "public"."stores_engine" USING "btree" ("is_active", "verification_status");


--
-- Name: stores_engi_is_veri_452fee_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_is_veri_452fee_idx" ON "public"."stores_engine" USING "btree" ("is_verified", "average_rating" DESC);


--
-- Name: stores_engi_is_veri_ce6fcc_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_is_veri_ce6fcc_idx" ON "public"."stores_engine" USING "btree" ("is_verified");


--
-- Name: stores_engi_owner_i_c6fa9c_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_owner_i_c6fa9c_idx" ON "public"."stores_engine" USING "btree" ("owner_id");


--
-- Name: stores_engi_phone_n_9a9df6_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_phone_n_9a9df6_idx" ON "public"."stores_engine" USING "btree" ("phone_number");


--
-- Name: stores_engi_physica_562c8f_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_physica_562c8f_idx" ON "public"."stores_engine" USING "btree" ("physical_address");


--
-- Name: stores_engi_status_551ac7_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_status_551ac7_idx" ON "public"."stores_engine" USING "btree" ("status");


--
-- Name: stores_engi_store_i_4e92b3_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_store_i_4e92b3_idx" ON "public"."stores_engine" USING "btree" ("store_index");


--
-- Name: stores_engi_store_n_3a2b45_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_store_n_3a2b45_idx" ON "public"."stores_engine" USING "btree" ("store_name");


--
-- Name: stores_engi_store_n_fb67df_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_store_n_fb67df_idx" ON "public"."stores_engine" USING "btree" ("store_name", "city");


--
-- Name: stores_engi_store_s_30e590_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_store_s_30e590_idx" ON "public"."stores_engine" USING "btree" ("store_slug");


--
-- Name: stores_engi_tiktok__e6ba33_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_tiktok__e6ba33_idx" ON "public"."stores_engine" USING "btree" ("tiktok_handle");


--
-- Name: stores_engi_total_s_b57586_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_total_s_b57586_idx" ON "public"."stores_engine" USING "btree" ("total_sales" DESC);


--
-- Name: stores_engi_twitter_0908a3_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_twitter_0908a3_idx" ON "public"."stores_engine" USING "btree" ("twitter_handle");


--
-- Name: stores_engi_verific_6fac7c_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_verific_6fac7c_idx" ON "public"."stores_engine" USING "btree" ("verification_status");


--
-- Name: stores_engi_whatsap_2a5c0b_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engi_whatsap_2a5c0b_idx" ON "public"."stores_engine" USING "btree" ("whatsapp_number");


--
-- Name: stores_engine_category_id_88a57e91; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engine_category_id_88a57e91" ON "public"."stores_engine" USING "btree" ("category_id");


--
-- Name: stores_engine_owner_id_b3d12686; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "stores_engine_owner_id_b3d12686" ON "public"."stores_engine" USING "btree" ("owner_id");


--
-- Name: sub_categor_categor_0a2b8b_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "sub_categor_categor_0a2b8b_idx" ON "public"."sub_categories" USING "btree" ("category_id", "name");


--
-- Name: sub_categor_categor_df4088_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "sub_categor_categor_df4088_idx" ON "public"."sub_categories" USING "btree" ("category_id", "name_sw");


--
-- Name: sub_categor_categor_e70bb6_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "sub_categor_categor_e70bb6_idx" ON "public"."sub_categories" USING "btree" ("category_id");


--
-- Name: sub_categor_created_6817c4_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "sub_categor_created_6817c4_idx" ON "public"."sub_categories" USING "btree" ("created_at" DESC);


--
-- Name: sub_categor_name_a8bf9b_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "sub_categor_name_a8bf9b_idx" ON "public"."sub_categories" USING "btree" ("name");


--
-- Name: sub_categor_name_deec2c_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "sub_categor_name_deec2c_idx" ON "public"."sub_categories" USING "btree" ("name", "name_sw");


--
-- Name: sub_categor_name_sw_a9bbaf_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "sub_categor_name_sw_a9bbaf_idx" ON "public"."sub_categories" USING "btree" ("name_sw");


--
-- Name: sub_categories_category_id_dc42080e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "sub_categories_category_id_dc42080e" ON "public"."sub_categories" USING "btree" ("category_id");


--
-- Name: unique_primary_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "unique_primary_email" ON "public"."account_emailaddress" USING "btree" ("user_id", "primary") WHERE "primary";


--
-- Name: unique_verified_email; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX "unique_verified_email" ON "public"."account_emailaddress" USING "btree" ("email") WHERE "verified";


--
-- Name: users_user_email_243f6e77_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_user_email_243f6e77_like" ON "public"."users_user" USING "btree" ("email" "varchar_pattern_ops");


--
-- Name: users_user_groups_group_id_9afc8d0e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_user_groups_group_id_9afc8d0e" ON "public"."users_user_groups" USING "btree" ("group_id");


--
-- Name: users_user_groups_user_id_5f6f5a90; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_user_groups_user_id_5f6f5a90" ON "public"."users_user_groups" USING "btree" ("user_id");


--
-- Name: users_user_user_permissions_permission_id_0b93982e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_user_user_permissions_permission_id_0b93982e" ON "public"."users_user_user_permissions" USING "btree" ("permission_id");


--
-- Name: users_user_user_permissions_user_id_20aca447; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_user_user_permissions_user_id_20aca447" ON "public"."users_user_user_permissions" USING "btree" ("user_id");


--
-- Name: users_user_username_06e46fe6_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_user_username_06e46fe6_like" ON "public"."users_user" USING "btree" ("username" "varchar_pattern_ops");


--
-- Name: account account_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."account"
    ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "neon_auth"."user"("id") ON DELETE CASCADE;


--
-- Name: invitation invitation_inviterId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."invitation"
    ADD CONSTRAINT "invitation_inviterId_fkey" FOREIGN KEY ("inviterId") REFERENCES "neon_auth"."user"("id") ON DELETE CASCADE;


--
-- Name: invitation invitation_organizationId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."invitation"
    ADD CONSTRAINT "invitation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "neon_auth"."organization"("id") ON DELETE CASCADE;


--
-- Name: member member_organizationId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."member"
    ADD CONSTRAINT "member_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "neon_auth"."organization"("id") ON DELETE CASCADE;


--
-- Name: member member_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."member"
    ADD CONSTRAINT "member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "neon_auth"."user"("id") ON DELETE CASCADE;


--
-- Name: session session_userId_fkey; Type: FK CONSTRAINT; Schema: neon_auth; Owner: -
--

ALTER TABLE ONLY "neon_auth"."session"
    ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "neon_auth"."user"("id") ON DELETE CASCADE;


--
-- Name: account_emailaddress account_emailaddress_user_id_2c513194_fk_users_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."account_emailaddress"
    ADD CONSTRAINT "account_emailaddress_user_id_2c513194_fk_users_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users_user"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: account_emailconfirmation account_emailconfirm_email_address_id_5b7f8c58_fk_account_e; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."account_emailconfirmation"
    ADD CONSTRAINT "account_emailconfirm_email_address_id_5b7f8c58_fk_account_e" FOREIGN KEY ("email_address_id") REFERENCES "public"."account_emailaddress"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: admins admins_id_id_4a84f7ae_fk_profiles_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."admins"
    ADD CONSTRAINT "admins_id_id_4a84f7ae_fk_profiles_id" FOREIGN KEY ("id_id") REFERENCES "public"."profiles"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: advertisements advertisements_approved_by_id_17be2774_fk_profiles_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."advertisements"
    ADD CONSTRAINT "advertisements_approved_by_id_17be2774_fk_profiles_id" FOREIGN KEY ("approved_by_id") REFERENCES "public"."profiles"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: advertisements advertisements_rejected_by_id_24e09c88_fk_profiles_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."advertisements"
    ADD CONSTRAINT "advertisements_rejected_by_id_24e09c88_fk_profiles_id" FOREIGN KEY ("rejected_by_id") REFERENCES "public"."profiles"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: advertisements advertisements_user_id_08bcd5e1_fk_profiles_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."advertisements"
    ADD CONSTRAINT "advertisements_user_id_08bcd5e1_fk_profiles_id" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_group_permissions"
    ADD CONSTRAINT "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm" FOREIGN KEY ("permission_id") REFERENCES "public"."auth_permission"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_group_permissions"
    ADD CONSTRAINT "auth_group_permissions_group_id_b120cbf9_fk_auth_group_id" FOREIGN KEY ("group_id") REFERENCES "public"."auth_group"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_permission"
    ADD CONSTRAINT "auth_permission_content_type_id_2f476e4b_fk_django_co" FOREIGN KEY ("content_type_id") REFERENCES "public"."django_content_type"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: authtoken_token authtoken_token_user_id_35299eff_fk_users_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."authtoken_token"
    ADD CONSTRAINT "authtoken_token_user_id_35299eff_fk_users_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users_user"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: disputes disputes_customer_id_a3cfecca_fk_profiles_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."disputes"
    ADD CONSTRAINT "disputes_customer_id_a3cfecca_fk_profiles_id" FOREIGN KEY ("customer_id") REFERENCES "public"."profiles"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: disputes disputes_order_id_87d8b2a7_fk_orders_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."disputes"
    ADD CONSTRAINT "disputes_order_id_87d8b2a7_fk_orders_id" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: disputes disputes_product_id_7de12695_fk_products_engines_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."disputes"
    ADD CONSTRAINT "disputes_product_id_7de12695_fk_products_engines_id" FOREIGN KEY ("product_id") REFERENCES "public"."products_engines"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_admin_log"
    ADD CONSTRAINT "django_admin_log_content_type_id_c4bce8eb_fk_django_co" FOREIGN KEY ("content_type_id") REFERENCES "public"."django_content_type"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_users_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_admin_log"
    ADD CONSTRAINT "django_admin_log_user_id_c564eba6_fk_users_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users_user"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: leads leads_store_id_af6cabaa_fk_stores_engine_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."leads"
    ADD CONSTRAINT "leads_store_id_af6cabaa_fk_stores_engine_id" FOREIGN KEY ("store_id") REFERENCES "public"."stores_engine"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: leaf_categories leaf_categories_sub_category_id_331a4b78_fk_sub_categories_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."leaf_categories"
    ADD CONSTRAINT "leaf_categories_sub_category_id_331a4b78_fk_sub_categories_id" FOREIGN KEY ("sub_category_id") REFERENCES "public"."sub_categories"("id") ON DELETE CASCADE;


--
-- Name: messages messages_order_id_030a130e_fk_orders_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_order_id_030a130e_fk_orders_id" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: messages messages_receiver_id_874b4e0a_fk_profiles_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_receiver_id_874b4e0a_fk_profiles_id" FOREIGN KEY ("receiver_id") REFERENCES "public"."profiles"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: messages messages_sender_id_dc5a0bbd_fk_profiles_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_sender_id_dc5a0bbd_fk_profiles_id" FOREIGN KEY ("sender_id") REFERENCES "public"."profiles"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: order_items order_items_order_id_412ad78b_fk_orders_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_order_id_412ad78b_fk_orders_id" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: order_items order_items_product_id_dd557d5a_fk_products_engines_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_product_id_dd557d5a_fk_products_engines_id" FOREIGN KEY ("product_id") REFERENCES "public"."products_engines"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: order_items order_items_variant_id_c29d5590_fk_product_variations_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."order_items"
    ADD CONSTRAINT "order_items_variant_id_c29d5590_fk_product_variations_id" FOREIGN KEY ("variant_id") REFERENCES "public"."product_variations"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: orders orders_customer_id_b7016332_fk_profiles_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."orders"
    ADD CONSTRAINT "orders_customer_id_b7016332_fk_profiles_id" FOREIGN KEY ("customer_id") REFERENCES "public"."profiles"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: product_media product_media_product_id_da264f78_fk_products_engines_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."product_media"
    ADD CONSTRAINT "product_media_product_id_da264f78_fk_products_engines_id" FOREIGN KEY ("product_id") REFERENCES "public"."products_engines"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: product_variations product_variations_product_id_54835ab7_fk_products_engines_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."product_variations"
    ADD CONSTRAINT "product_variations_product_id_54835ab7_fk_products_engines_id" FOREIGN KEY ("product_id") REFERENCES "public"."products_engines"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: products_engines products_engines_category_id_99280a05_fk_sub_categories_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."products_engines"
    ADD CONSTRAINT "products_engines_category_id_99280a05_fk_sub_categories_id" FOREIGN KEY ("category_id") REFERENCES "public"."sub_categories"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: products_engines products_engines_leaf_category_id_6fee8335_fk_leaf_cate; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."products_engines"
    ADD CONSTRAINT "products_engines_leaf_category_id_6fee8335_fk_leaf_cate" FOREIGN KEY ("leaf_category_id") REFERENCES "public"."leaf_categories"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: products_engines products_engines_parent_category_id_059d2d20_fk_categories_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."products_engines"
    ADD CONSTRAINT "products_engines_parent_category_id_059d2d20_fk_categories_id" FOREIGN KEY ("parent_category_id") REFERENCES "public"."categories"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: products_engines products_engines_store_id_365673de_fk_stores_engine_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."products_engines"
    ADD CONSTRAINT "products_engines_store_id_365673de_fk_stores_engine_id" FOREIGN KEY ("store_id") REFERENCES "public"."stores_engine"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: products_engines products_engines_user_id_aabb0f05_fk_profiles_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."products_engines"
    ADD CONSTRAINT "products_engines_user_id_aabb0f05_fk_profiles_id" FOREIGN KEY ("user_id") REFERENCES "public"."profiles"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: profiles profiles_user_id_36580373_fk_users_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_user_id_36580373_fk_users_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users_user"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: shipping_methods shipping_methods_store_id_8b4db5b0_fk_stores_engine_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."shipping_methods"
    ADD CONSTRAINT "shipping_methods_store_id_8b4db5b0_fk_stores_engine_id" FOREIGN KEY ("store_id") REFERENCES "public"."stores_engine"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: socialaccount_socialtoken socialaccount_social_account_id_951f210e_fk_socialacc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."socialaccount_socialtoken"
    ADD CONSTRAINT "socialaccount_social_account_id_951f210e_fk_socialacc" FOREIGN KEY ("account_id") REFERENCES "public"."socialaccount_socialaccount"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: socialaccount_socialtoken socialaccount_social_app_id_636a42d7_fk_socialacc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."socialaccount_socialtoken"
    ADD CONSTRAINT "socialaccount_social_app_id_636a42d7_fk_socialacc" FOREIGN KEY ("app_id") REFERENCES "public"."socialaccount_socialapp"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: socialaccount_socialapp_sites socialaccount_social_site_id_2579dee5_fk_django_si; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."socialaccount_socialapp_sites"
    ADD CONSTRAINT "socialaccount_social_site_id_2579dee5_fk_django_si" FOREIGN KEY ("site_id") REFERENCES "public"."django_site"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: socialaccount_socialapp_sites socialaccount_social_socialapp_id_97fb6e7d_fk_socialacc; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."socialaccount_socialapp_sites"
    ADD CONSTRAINT "socialaccount_social_socialapp_id_97fb6e7d_fk_socialacc" FOREIGN KEY ("socialapp_id") REFERENCES "public"."socialaccount_socialapp"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: socialaccount_socialaccount socialaccount_socialaccount_user_id_8146e70c_fk_users_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."socialaccount_socialaccount"
    ADD CONSTRAINT "socialaccount_socialaccount_user_id_8146e70c_fk_users_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users_user"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: stores_engine stores_engine_category_id_88a57e91_fk_categories_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."stores_engine"
    ADD CONSTRAINT "stores_engine_category_id_88a57e91_fk_categories_id" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: stores_engine stores_engine_owner_id_b3d12686_fk_profiles_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."stores_engine"
    ADD CONSTRAINT "stores_engine_owner_id_b3d12686_fk_profiles_id" FOREIGN KEY ("owner_id") REFERENCES "public"."profiles"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: sub_categories sub_categories_category_id_dc42080e_fk_categories_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."sub_categories"
    ADD CONSTRAINT "sub_categories_category_id_dc42080e_fk_categories_id" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_user_groups users_user_groups_group_id_9afc8d0e_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_user_groups"
    ADD CONSTRAINT "users_user_groups_group_id_9afc8d0e_fk_auth_group_id" FOREIGN KEY ("group_id") REFERENCES "public"."auth_group"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_user_groups users_user_groups_user_id_5f6f5a90_fk_users_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_user_groups"
    ADD CONSTRAINT "users_user_groups_user_id_5f6f5a90_fk_users_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users_user"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_user_user_permissions users_user_user_perm_permission_id_0b93982e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_user_user_permissions"
    ADD CONSTRAINT "users_user_user_perm_permission_id_0b93982e_fk_auth_perm" FOREIGN KEY ("permission_id") REFERENCES "public"."auth_permission"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_user_user_permissions users_user_user_permissions_user_id_20aca447_fk_users_user_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_user_user_permissions"
    ADD CONSTRAINT "users_user_user_permissions_user_id_20aca447_fk_users_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."users_user"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: categories Allow public read categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read categories" ON "public"."categories" FOR SELECT USING (true);


--
-- Name: leaf_categories Allow public read leaf_categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read leaf_categories" ON "public"."leaf_categories" FOR SELECT USING (true);


--
-- Name: sub_categories Allow public read sub_categories; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read sub_categories" ON "public"."sub_categories" FOR SELECT USING (true);


--
-- PostgreSQL database dump complete
--

\unrestrict 0Y85dglpBi1BlkV5OpO8GDjoT2uhHSamU1fb23GmRlJAACxkU0BpKn7b5p1ARJJ

