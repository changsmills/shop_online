// src/components/Footer.jsx
import { Link } from "react-router-dom";
import "../Footer.css";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaCcVisa, FaCcMastercard } from "react-icons/fa";
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t, i18n } = useTranslation();

  return (
    <footer className="main-footer">
      <div className="footer-container">
        
        {/* SECTION 1: LINKS GROUP */}
        <div className="footer-links-grid">
          
          {/* Customer Care */}
          <div className="footer-column">
            <h3>{t('customer_care')}</h3>
            <ul>
              <li><Link to="/help-center">{t('help_center')}</Link></li>
              <li><Link to="/how-to-buy">{t('how_to_buy')}</Link></li>
              <li><Link to="/refund-policy">{t('returns_refunds')}</Link></li>
              <li><Link to="/contact-us">{t('contact_us')}</Link></li>
              <li><Link to="/dispute">{t('file_dispute')}</Link></li>
            </ul>
          </div>

          {/* About Skyfall */}
          <div className="footer-column">
            <h3>{t('about_skyfall')}</h3>
            <ul>
              <li><Link to="/about-skyfall">{t('what_is_skyfall')}</Link></li>
              <li><Link to="/how-it-works">{t('how_to_start')}</Link></li>
              <li><Link to="/wholesale-benefits">{t('wholesale_benefits')}</Link></li>
              <li><Link to="/blogs">{t('business_articles')}</Link></li>
              <li><Link to="/tutorials">{t('video_tutorials')}</Link></li>
            </ul>
          </div>

          {/* Business Services */}
          <div className="footer-column">
            <h3>{t('business_services')}</h3>
            <ul>
              <li><Link to="/payment-protection">{t('payment_protection')}</Link></li>
              <li><Link to="/logistics">{t('track_logistics')}</Link></li>
              <li><Link to="/quotes">{t('invoice_requests')}</Link></li>
              <li><Link to="/verification">{t('product_verification')}</Link></li>
              <li><Link to="/ad-request">{t('skyfall_ads')}</Link></li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="footer-column">
            <h3>{t('legal_policies')}</h3>
            <ul>
              <li><Link to="/privacy">{t('privacy_policy')}</Link></li>
              <li><Link to="/terms">{t('terms_conditions')}</Link></li>
              <li><Link to="/report-abuse">{t('report_scam')}</Link></li>
            </ul>
          </div>

        </div>

        {/* Second Row - 4 columns */}
        <div className="footer-links-grid second-row">
          
          {/* Seller Info */}
          <div className="footer-column">
            <h3>{t('sell_on_platform')}</h3>
            <ul>
              <li><Link to="/seller-center">{t('seller_center')}</Link></li>
              <li><Link to="/become-partner">{t('become_partner')}</Link></li>
              <li><Link to="/warehouse">{t('warehouse_services')}</Link></li>
              <li><Link to="/dashboard/login">{t('login_to_sell')}</Link></li>
            </ul>
          </div>

          {/* Advertising */}
          <div className="footer-column">
            <h3>{t('advertising')}</h3>
            <ul>
              <li><Link to="/ad-request">{t('ad_request')}</Link></li>
              <li><Link to="/my-ad-requests">{t('my_ad_requests')}</Link></li>
              <li><Link to="/payments">{t('ad_prices')}</Link></li>
              <li><Link to="/ads-guide">{t('ad_guide')}</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h3>{t('support')}</h3>
            <ul>
              <li><a href="https://wa.me/255700000000">{t('whatsapp_support')}</a></li>
              <li><Link to="/contact-us">{t('email_us')}</Link></li>
              <li><Link to="/office-location">{t('our_offices')}</Link></li>
              <li><Link to="/shipping-info">{t('shipping_info')}</Link></li>
            </ul>
          </div>

          {/* Social & Payment */}
          <div className="footer-column">
            <h3>{t('follow_us')}</h3>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook className="icon" /></a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram className="icon" /></a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter className="icon" /></a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube className="icon" /></a>
            </div>
            
            <h3 className="mt-4">{t('payment_methods')}</h3>
            
            <div className="payment-methods">
              <FaCcVisa size={35} title="Visa" />
              <FaCcMastercard size={35} title="Mastercard" />

              {/* Huduma za Nyumbani - Maneno tu */}
              <span className="payment-tag">M-Pesa</span>
              <span className="payment-tag">Airtel Money</span>
              <span className="payment-tag">Tigo Pesa</span>
              <span className="payment-tag">CRDB</span>
              <span className="payment-tag">NMB</span>
            </div>
            
            <p className="secure-text">{t('secure_payment')}</p>
          </div>

        </div>

        <hr className="footer-divider" />

        {/* SECTION 2: BOTTOM FOOTER */}
        <div className="footer-bottom">
          <p>{t('copyright')}</p>
          <div className="footer-bottom-links">
            <Link to="/terms">{t('terms')}</Link>
            <Link to="/privacy">{t('privacy')}</Link>
            <Link to="/help-center">{t('help')}</Link>
            <Link to="/contact-us">{t('contact')}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}