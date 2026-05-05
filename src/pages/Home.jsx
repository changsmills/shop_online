import { Link } from "react-router-dom";
import "../Home.css";

export default function Home() {
  return (
    <div className="home-page">

      {/* HERO SLIDER */}
      <div className="hero-section">
        <div className="hero-slider">

          <div className="hero-slide">
            <img src="/images/business.jfif" alt="Business Dashboard" />
            <div className="hero-text">
              <h2>Business Dashboard</h2>
            </div>
          </div>

          <div className="hero-slide">
            <img src="/images/store_room.jfif" alt="Modern Store" />
            <div className="hero-text">
              <h2>Modern Online Store</h2>
            </div>
          </div>

        </div>
      </div>

      {/* INTRO SECTION */}
      <div className="home-content">
        <h1>Welcome to Virtual Store Platform</h1>
        <p>
          Create your online store and start earning revenue without owning physical inventory.
        </p>
      </div>

      {/* ACTION CARDS SECTION */}
      <div className="action-section">

        <div className="action-card">
          <img src="/images/business.jfif" alt="Dashboard" />
          <Link to="/dashboard">
            <button className="action-btn green">
              Go to Dashboard
            </button>
          </Link>
        </div>

        <div className="action-card">
          <img src="/images/store_room.jfif" alt="Create Store" />
          <Link to="/create-store">
            <button className="action-btn blue">
              Create Your Store
            </button>
          </Link>
        </div>

      </div>

    </div>
  );
}
