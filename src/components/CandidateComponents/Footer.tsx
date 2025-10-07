import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "../../Styles/global.css";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = "pk.eyJ1IjoiYW11bHlhMTUwNyIsImEiOiJjbWdmN2twMXEwNWVuMmtwdWpsZjB5aGJxIn0.K4yazlBEQKCXNyVyQDgrow";

const currentYear = new Date().getFullYear();

const Footer: React.FC = () => {
  const smallMapRef = useRef<HTMLDivElement | null>(null);
  const popupMapRef = useRef<HTMLDivElement | null>(null);
  const [showPopupMap, setShowPopupMap] = useState(false);

  const lat = 12.96722;
  const lng = 77.715968;

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: smallMapRef.current!,
      style: "mapbox://styles/mapbox/streets-v11",
      center: [lng, lat],
      zoom: 14,
      interactive: false,
    });
    new mapboxgl.Marker({ color: "red" }).setLngLat([lng, lat]).addTo(map);
    return () => map.remove();
  }, []);

  useEffect(() => {
    if (showPopupMap && popupMapRef.current) {
      const map = new mapboxgl.Map({
        container: popupMapRef.current!,
        style: "mapbox://styles/mapbox/streets-v11",
        center: [lng, lat],
        zoom: 15,
      });

      const marker = new mapboxgl.Marker({ color: "red" })
        .setLngLat([lng, lat])
        .addTo(map);

      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(
          `<div style="text-align:center;">
             <strong>Fidelity National Financial</strong><br/>
             <small>12.96722° N, 77.715968° E</small>
           </div>`
        )
        .setLngLat([lng, lat])
        .addTo(map);

      marker.getElement().addEventListener("click", () => {
        popup.isOpen() ? popup.remove() : popup.addTo(map);
      });

      return () => map.remove();
    }
  }, [showPopupMap]);

  return (
    <>
      <footer className="site-footer" style={{ padding: "40px 20px", backgroundColor: "#0a2341" }}>
        <div
          className="footer-main-content"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "40px",
            maxWidth: "1200px",
            margin: "0 auto",
            padding: "0 10px",
          }}
        >
          {/* Products & Services */}
          <div
            className="footer-section"
            style={{
              flex: "1 1 0",
              padding: "0 15px",
              color: "#FFFFFF",
              minWidth: "180px",
            }}
          >
            <strong style={{ fontSize: "1.1rem", marginBottom: "12px", display: "block" }}>
              Products & Services
            </strong>
            <div style={{ marginBottom: "8px" }}>
              <a href="#" className="footer-link">
                Title Insurance
              </a>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <a href="#" className="footer-link">
                Mortgage & Real Estate Services
              </a>
            </div>
            <div style={{ marginBottom: "8px" }}>
              <a href="#" className="footer-link">
                Real Estate Technology
              </a>
            </div>
            <div>
              <a href="#" className="footer-link">
                Annuities & Life Insurance
              </a>
            </div>
          </div>

          {/* Social */}
          <div
            className="footer-section"
            style={{
              flex: "1 1 0",
              padding: "0 15px",
              color: "#FFFFFF",
              minWidth: "180px",
            }}
          >
            {/* Social Media Icons */}
<div className="mb-3 d-flex gap-2">
  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-light fs-4">
    <i className="bi bi-facebook"></i>
  </a>
  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-light fs-4">
    <i className="bi bi-linkedin"></i>
  </a>
  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-light fs-4">
    <i className="bi bi-twitter"></i>
  </a>
  <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-light fs-4">
    <i className="bi bi-youtube"></i>
  </a>
</div>
            <strong style={{ fontSize: "1.1rem", marginBottom: "12px", display: "block" }}>
              Follow Us
            </strong>
            <div style={{ marginBottom: "16px" }}>
              <a href="#" className="footer-link">
                LinkedIn
              </a>{" "}
              |{" "}
              <a href="#" className="footer-link">
                Twitter
              </a>
            </div>
            <strong style={{ fontSize: "1.1rem", marginBottom: "12px", display: "block" }}>
              Quick Links
            </strong>
            <div>
              <a href="/about" className="footer-link">
                About Us
              </a>{" "}
              |{" "}
              <a href="/contact" className="footer-link">
                Contact
              </a>
            </div>
          </div>

          {/* Legal + Contact */}
          <div
            className="footer-section"
            style={{
              flex: "1 1 0",
              padding: "0 15px",
              color: "#FFFFFF",
              minWidth: "180px",
            }}
          >
            <strong style={{ fontSize: "1.1rem", marginBottom: "12px", display: "block" }}>
              Legal
            </strong>
            <div style={{ marginBottom: "16px" }}>
              <a href="/privacy" className="footer-link">
                Privacy Policy
              </a>{" "}
              |{" "}
              <a href="/terms" className="footer-link">
                Terms of Service
              </a>
            </div>
            <strong style={{ fontSize: "1.1rem", marginBottom: "12px", display: "block" }}>
              Contact
            </strong>
            <div>Email: info@fidelity.com</div>
            <div>Tel: +1-800-555-1234</div>
          </div>

          {/* Small Map */}
          <div
            className="footer-section"
            style={{
              flex: "0 0 140px",
              padding: "0 10px",
              color: "#FFFFFF",
              minWidth: "140px",
            }}
          >
            <strong style={{ fontSize: "1.1rem", marginBottom: "12px", display: "block" }}>
              Our Location
            </strong>
            <div
              ref={smallMapRef}
              onClick={() => setShowPopupMap(true)}
              style={{
                width: "130px",
                height: "130px",
                borderRadius: "10px",
                border: "2px solid #fff",
                overflow: "hidden",
                cursor: "pointer",
              }}
            />
          </div>
        </div>

        <div
          
          style={{
            marginTop: "40px",
            textAlign: "center",
            color: "#bbbbbb",
            fontSize: "0.9rem",
          }}
        >
          <span>&copy; {currentYear} Fidelity National Financial. All rights reserved.</span>
          </div>
        
      </footer>

      {/* Fullscreen Popup Map */}
      {showPopupMap && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            ref={popupMapRef}
            style={{
              width: "80%",
              height: "80%",
              borderRadius: "10px",
              overflow: "hidden",
              boxShadow: "0 0 15px rgba(255,255,255,0.5)",
            }}
          />
          <button
            onClick={() => setShowPopupMap(false)}
            style={{
              position: "absolute",
              top: "20px",
              right: "30px",
              fontSize: "24px",
              background: "transparent",
              border: "none",
              color: "#fff",
              cursor: "pointer",
            }}
          >
            ❌
          </button>
        </div>
      )}
    </>
  );
};

export default Footer; 