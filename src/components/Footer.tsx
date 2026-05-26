import Link from "next/link";
import { MowloLogo } from "./MowloLogo";

export function Footer() {
  return (
    <div className="footer-wrap">
      <footer>
        <div className="footer-grid">
          <div>
            <div className="fb-name">
              <MowloLogo size={22} />
              Mowlo
            </div>
            <div className="fb-tag">
              Your print on demand partner for small businesses in Nigeria and
              Ghana.
            </div>
          </div>
          <div>
            <div className="fc-title">Products</div>
            <ul className="fc-links">
              <li>
                <a href="#products">Stickers</a>
              </li>
              <li>
                <a href="#products">Business Cards</a>
              </li>
              <li>
                <a href="#products">Flyers</a>
              </li>
              <li>
                <a href="#packs">Brand Packs</a>
              </li>
              <li>
                <a href="#popup">Pop-up Kit</a>
              </li>

              <li>
                <Link href="/partners">Print Your Own Files</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="fc-title">Coming soon</div>
            <ul className="fc-links">
              <li>
                <Link href="/partners">Brand Studio</Link>
              </li>
              <li>
                <Link href="/partners">Ecommerce Store</Link>
              </li>
              <li>
                <Link href="/partners">Event Invites</Link>
              </li>
              <li>
                <Link href="/partners">AI Brand Advice</Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="fc-title">Company</div>
            <ul className="fc-links">
              <li>
                <a href="#">About</a>
              </li>
              <li>
                <a href="#">Contact</a>
              </li>
              <li>
                <a href="#">WhatsApp Us</a>
              </li>
              <li>
                <a href="#">Instagram</a>
              </li>
              <li>
                <Link href="/partners">Print Partners</Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="fc">© 2026 Mowlo. All rights reserved.</div>
          <div className="fc">
            Made with <span style={{ color: "#E8527A" }}>♥</span> for small
            businesses in Nigeria and Ghana
          </div>
        </div>
      </footer>
    </div>
  );
}
