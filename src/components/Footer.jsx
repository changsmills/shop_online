import { Link } from "react-router-dom";
import "../Footer.css";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaCcVisa, FaCcMastercard, FaMobile } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        
        {/* SECTION 1: LINKS GROUP */}
        <div className="footer-links-grid">
          
          {/* Customer Care */}
          <div className="footer-column">
            <h3>Customer Care</h3>
            <ul>
              <li><Link to="/help-center">Help Center</Link></li>
              <li><Link to="/how-to-buy">How to Buy</Link></li>
              <li><Link to="/refund-policy">Returns & Refunds</Link></li>
              <li><Link to="/contact-us">Contact Us</Link></li>
              <li><Link to="/dispute">Fungua Shauri</Link></li>
            </ul>
          </div>

          {/* About Skyfall */}
          <div className="footer-column">
            <h3>About Skyfall</h3>
            <ul>
              <li><Link to="/about-skyfall">Skyfall ni nini?</Link></li>
              <li><Link to="/how-it-works">Jinsi ya kuanza kununua</Link></li>
              <li><Link to="/wholesale-benefits">Faida za wanachama</Link></li>
              <li><Link to="/blogs">Makala za Biashara</Link></li>
              <li><Link to="/tutorials">Video Tutorials</Link></li>
            </ul>
          </div>

          {/* Business Services */}
          <div className="footer-column">
            <h3>Business Services</h3>
            <ul>
              <li><Link to="/payment-protection">Ulinzi wa Malipo</Link></li>
              <li><Link to="/logistics">Fuatilia Stendi</Link></li>
              <li><Link to="/quotes">Maombi ya Invoice</Link></li>
              <li><Link to="/verification">Uhakiki wa Bidhaa</Link></li>
              <li><Link to="/ad-request">Skyfall Ads</Link></li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div className="footer-column">
            <h3>Legal & Policies</h3>
            <ul>
              <li><Link to="/privacy">Sera ya Faragha</Link></li>
              <li><Link to="/terms">Vigezo na Masharti</Link></li>
              <li><Link to="/report-abuse">Ripoti Utapeli</Link></li>
            </ul>
          </div>

        </div>

        {/* Second Row - 4 columns */}
        <div className="footer-links-grid second-row">
          
          {/* Seller Info */}
          <div className="footer-column">
            <h3>Sell on Platform</h3>
            <ul>
              <li><Link to="/seller-center">Seller Center</Link></li>
              <li><Link to="/become-partner">Become a Logistics Partner</Link></li>
              <li><Link to="/warehouse">Warehouse Services</Link></li>
              <li><Link to="/dashboard/login">Login to Sell</Link></li>
            </ul>
          </div>

          {/* Advertising */}
          <div className="footer-column">
            <h3>Advertising</h3>
            <ul>
              <li><Link to="/ad-request">Ombi la Tangazo</Link></li>
              <li><Link to="/my-ad-requests">Maombi Yangu</Link></li>
              <li><Link to="/payments">Bei za Matangazo</Link></li>
              <li><Link to="/ads-guide">Mwongozo wa Matangazo</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-column">
            <h3>Support</h3>
            <ul>
              <li><a href="https://wa.me/255700000000">WhatsApp Support</a></li>
              <li><Link to="/contact-us">Barua Pepe</Link></li>
              <li><Link to="/office-location">Ofisi zetu</Link></li>
              <li><Link to="/shipping-info">Maelezo ya Usafirishaji</Link></li>
            </ul>
          </div>

       {/* Social & Payment */}
<div className="footer-column">
  <h3>Follow Us</h3>
  <div className="social-icons">
    <a href="https://facebook.com" target="_blank" rel="noreferrer"><FaFacebook className="icon" /></a>
    <a href="https://instagram.com" target="_blank" rel="noreferrer"><FaInstagram className="icon" /></a>
    <a href="https://twitter.com" target="_blank" rel="noreferrer"><FaTwitter className="icon" /></a>
    <a href="https://youtube.com" target="_blank" rel="noreferrer"><FaYoutube className="icon" /></a>
  </div>
  
  <h3 className="mt-4" style={{ marginTop: '30px', fontSize: '18px', fontWeight: '700' }}>
    Njia za Malipo (Tanzania)
  </h3>
  
  <div className="payment-methods" style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap', marginTop: '10px' }}>
    {/* Huduma za Kimataifa */}
    <FaCcVisa size={35} title="Visa" />
    <FaCcMastercard size={35} title="Mastercard" />

    {/* Huduma za Nyumbani - Maneno tu */}
    <span style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}>M-Pesa</span>
    <span style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}>Airtel Money</span>
    <span style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}>Tigo Pesa</span>
    <span style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}>CRDB</span>
    <span style={{ padding: '4px 10px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px' }}>NMB</span>
  </div>
  
  <p style={{ fontSize: '11px', color: '#888', marginTop: '15px' }}>
    Malipo salama 100%
  </p>
</div>

        </div>

        <hr className="footer-divider" />

        {/* SECTION 2: BOTTOM FOOTER */}
        <div className="footer-bottom">
          <p>© 2026 Skyfall Virtual Store Platform. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
            <Link to="/help-center">Help</Link>
            <Link to="/contact-us">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}