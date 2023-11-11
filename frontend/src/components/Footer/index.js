import React from 'react';
import './index.css';

export default function Footer() {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <p>&copy; 2023 SSAFY. All rights reserved.</p>
        <ul className="footer-links">
          <li>Terms of Service</li>
          <li>Privacy Policy</li>
          <li>Contact Us</li>
        </ul>
      </div>
    </footer>
  );
}
