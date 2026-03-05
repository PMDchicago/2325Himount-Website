import Link from 'next/link';

export default function SiteHeader({ site }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <div className="brand-wrap">
          <Link href="/" className="brand-name">{site.site_title}</Link>
          <span className="brand-sub">Milwaukee, WI</span>
        </div>

        <nav className="main-nav" aria-label="Primary navigation">
          {(site.nav || []).map((item) => (
            <Link key={item.href} href={item.href} className="nav-link">
              {item.label}
            </Link>
          ))}
        </nav>

        <a href={`tel:${site.phone_number?.replace(/[^0-9]/g, '')}`} className="call-cta">
          {site.phone_number}
        </a>
      </div>
    </header>
  );
}
