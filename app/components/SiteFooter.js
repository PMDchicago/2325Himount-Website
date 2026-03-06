import Link from 'next/link';
import Image from 'next/image';
import { Phone, MapPin } from 'lucide-react';

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
          </div>

        </div>
      </div>

      {/* Equal Housing Opportunity — centered compliance strip */}
      {site.footer?.equal_housing !== false && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '1.25rem 1rem',
          borderTop: '1px solid rgba(255,255,255,0.08)',
        }}>
          <Image
            src="/images/equal-housing-opportunity.jpg"
            alt="Equal Housing Opportunity"
            width={48}
            height={48}
            style={{ filter: 'invert(1) brightness(0.7)', opacity: 0.75 }}
          />
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.08em', opacity: 0.55, textTransform: 'uppercase' }}>
            Equal Housing Opportunity
          </span>
        </div>
      )}

      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>© {year} {site.site_title}. All rights reserved.</span>
          <span>Prairie Management and Development, Inc. · Milwaukee, WI</span>
        </div>
      </div>
    </footer>
  );
}
