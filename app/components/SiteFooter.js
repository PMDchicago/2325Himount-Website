import Link from 'next/link';
import { Phone, MapPin } from 'lucide-react';

function EqualHousingLogo({ size = 48 }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 120"
      width={size}
      height={size * 1.2}
      aria-label="Equal Housing Opportunity"
      role="img"
      style={{ display: 'block' }}
    >
      <polygon points="50,2 2,42 18,42 18,90 82,90 82,42 98,42" fill="none" stroke="currentColor" strokeWidth="4" />
      <rect x="30" y="52" width="40" height="4" fill="currentColor" />
      <rect x="30" y="62" width="40" height="4" fill="currentColor" />
      <text x="50" y="108" textAnchor="middle" fontSize="10" fontFamily="Arial, sans-serif" fontWeight="bold" fill="currentColor">
        EQUAL HOUSING
      </text>
      <text x="50" y="118" textAnchor="middle" fontSize="8" fontFamily="Arial, sans-serif" fill="currentColor">
        OPPORTUNITY
      </text>
    </svg>
  );
}

export default function SiteFooter({ site }) {
  const year = new Date().getFullYear();
  const addr = site.address || {};
  const addressLine = typeof addr === 'string'
    ? addr
    : `${addr.street}, ${addr.city}, ${addr.state} ${addr.zip}`;

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="container footer-grid">

          <div className="footer-section">
            <p className="footer-brand">{site.site_title}</p>
            <div className="footer-contact">
              <a href={`tel:${site.phone_number?.replace(/[^0-9]/g, '')}`}>
                <Phone size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                {site.phone_number}
              </a>
              <span>
                <MapPin size={14} style={{ flexShrink: 0, marginTop: '3px' }} />
                {addressLine}
              </span>
            </div>
          </div>

          <div className="footer-section">
            <h4>Navigate</h4>
            <nav className="footer-nav">
              {(site.nav || []).map((item) => (
                <Link key={item.href} href={item.href}>{item.label}</Link>
              ))}
            </nav>
          </div>

          <div className="footer-section">
            <h4>Legal</h4>
            <p className="footer-disclaimer">
              {site.footer?.disclaimer || 'Pricing and availability subject to change without notice.'}
            </p>
            {site.footer?.equal_housing !== false && (
              <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <EqualHousingLogo size={40} />
                <p className="footer-disclaimer" style={{ margin: 0 }}>
                  Equal Opportunity Housing Provider.
                </p>
              </div>
            )}
          </div>

        </div>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {year} {site.site_title}. All rights reserved.</span>
          <span>Professional Management · Milwaukee, WI</span>
        </div>
      </div>
    </footer>
  );
}
