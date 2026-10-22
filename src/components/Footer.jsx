// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaTiktok, FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation();

  return (
    <footer className="w-full bg-white dark:bg-black border-t border-gray-200 dark:border-gray-800 pt-16 pb-8 mt-12 text-black dark:text-white transition-colors duration-300">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* SECTION 1: LINKS GROUP */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          
          {/* Customer Care */}
          <div>
            <h3 className="text-base font-bold mb-5 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-[2px] after:bg-brand-orange">
              {t('customer_care')}
            </h3>
            <ul className="space-y-3">
              <li><Link to="/help-center" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('help_center')}</Link></li>
              <li><Link to="/how-to-buy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('how_to_buy')}</Link></li>
              <li><Link to="/refund-policy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('returns_refunds')}</Link></li>
              <li><Link to="/contact-us" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('contact_us')}</Link></li>
              <li><Link to="/dispute" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('file_dispute')}</Link></li>
            </ul>
          </div>

          {/* About Skyfall */}
          <div>
            <h3 className="text-base font-bold mb-5 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-[2px] after:bg-brand-orange">
              {t('about_skyfall')}
            </h3>
            <ul className="space-y-3">
              <li><Link to="/about-skyfall" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('what_is_skyfall')}</Link></li>
              <li><Link to="/how-it-works" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('how_to_start')}</Link></li>
              <li><Link to="/wholesale-benefits" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('wholesale_benefits')}</Link></li>
              <li><Link to="/blogs" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('business_articles')}</Link></li>
              <li><Link to="/tutorials" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('video_tutorials')}</Link></li>
            </ul>
          </div>

          {/* Business Services */}
          <div>
            <h3 className="text-base font-bold mb-5 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-[2px] after:bg-brand-orange">
              {t('business_services')}
            </h3>
            <ul className="space-y-3">
              <li><Link to="/payment-protection" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('payment_protection')}</Link></li>
              <li><Link to="/logistics" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('track_logistics')}</Link></li>
              <li><Link to="/quotes" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('invoice_requests')}</Link></li>
              <li><Link to="/verification" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('product_verification')}</Link></li>
              <li><Link to="/ad-request" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('skyfall_ads')}</Link></li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h3 className="text-base font-bold mb-5 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-[2px] after:bg-brand-orange">
              {t('legal_policies')}
            </h3>
            <ul className="space-y-3">
              <li><Link to="/privacy" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('privacy_policy')}</Link></li>
              <li><Link to="/terms" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('terms_conditions')}</Link></li>
              <li><Link to="/report-abuse" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('report_scam')}</Link></li>
            </ul>
          </div>
        </div>

        {/* Second Row - 4 columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          
          {/* Seller Info */}
          <div>
            <h3 className="text-base font-bold mb-5 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-[2px] after:bg-brand-orange">
              {t('sell_on_platform')}
            </h3>
            <ul className="space-y-3">
              <li><Link to="/seller-center" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('seller_center')}</Link></li>
              <li><Link to="/become-partner" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('become_partner')}</Link></li>
              <li><Link to="/warehouse" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('warehouse_services')}</Link></li>
              <li><Link to="/dashboard/login" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('login_to_sell')}</Link></li>
            </ul>
          </div>

          {/* Advertising */}
          <div>
            <h3 className="text-base font-bold mb-5 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-[2px] after:bg-brand-orange">
              {t('advertising')}
            </h3>
            <ul className="space-y-3">
              <li><Link to="/ad-request" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('ad_request')}</Link></li>
              <li><Link to="/my-ad-requests" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('my_ad_requests')}</Link></li>
              <li><Link to="/payments" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('ad_prices')}</Link></li>
              <li><Link to="/ads-guide" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('ad_guide')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-base font-bold mb-5 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-[2px] after:bg-brand-orange">
              {t('support')}
            </h3>
            <ul className="space-y-3">
              <li><a href="https://wa.me/255754394845" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('whatsapp_support')}</a></li>
              <li><Link to="/contact-us" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('email_us')}</Link></li>
              <li><Link to="/office-location" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('our_offices')}</Link></li>
              <li><Link to="/shipping-info" className="text-sm text-gray-600 dark:text-gray-400 hover:text-brand-orange transition-all duration-200 hover:translate-x-1 inline-block">{t('shipping_info')}</Link></li>
            </ul>
          </div>

          {/* Social & Payment */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-base font-bold mb-5 relative inline-block after:content-[''] after:absolute after:-bottom-2 after:left-0 after:w-10 after:h-[2px] after:bg-brand-orange">
              {t('follow_us')}
            </h3>
            <div className="flex gap-4 text-2xl mb-5">
  <a href="https://facebook.com/skyfall_tz" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-orange hover:-translate-y-1 transition-all"><FaFacebook /></a>
  <a href="https://instagram.com/skyfall_tz" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-orange hover:-translate-y-1 transition-all"><FaInstagram /></a>
  <a href="https://twitter.com/skyfall_tz" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-orange hover:-translate-y-1 transition-all"><FaTwitter /></a>
  <a href="https://tiktok.com/@skyfall_tz" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-orange hover:-translate-y-1 transition-all"><FaTiktok /></a>
  <a href="https://youtube.com/skyfall_tz" target="_blank" rel="noreferrer" className="text-gray-600 dark:text-gray-400 hover:text-brand-orange hover:-translate-y-1 transition-all"><FaYoutube /></a>
</div>
          </div>

        </div>

        <hr className="border-t border-gray-200 dark:border-gray-800 my-8" />

        {/* SECTION 2: BOTTOM FOOTER */}
        <div className="flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-400 gap-4">
          <p>{t('copyright')}</p>
          <div className="flex flex-wrap justify-center gap-6">
            <Link to="/terms" className="hover:text-brand-orange transition-colors">{t('terms')}</Link>
            <Link to="/privacy" className="hover:text-brand-orange transition-colors">{t('privacy')}</Link>
            <Link to="/help-center" className="hover:text-brand-orange transition-colors">{t('help')}</Link>
            <Link to="/contact-us" className="hover:text-brand-orange transition-colors">{t('contact')}</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}