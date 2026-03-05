import Link from 'next/link';
import { Phone } from 'lucide-react';

export default function SiteHeader({ site }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand-link">
          <span className="brand-name">{site.site_title}</span>
          <span className="brand-sub">Milwaukee, WI</span>
        </Link>

        <nav className="main-nav" aria-label="Primary navigation">
          {(site.nav || []).map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={`tel:${site.phone_number?.replace(/[^0-9]/g, '')}`}
          className="header-phone"
        >
          <Phone size={15} strokeWidth={2.5} />
          {site.phone_number}
        </a>
      </div>
    </header>
  );
}
