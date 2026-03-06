import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';

export default function HomeHero({ site, heroImage }) {
  return (
    <section
      className="home-hero"
      style={heroImage ? {
        backgroundImage: 'url(' + heroImage + ')',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        alignItems: 'flex-end',
        justifyContent: 'flex-start',
      } : undefined}
    >
      <div
        className="container hero-inner"
        style={heroImage ? {
          alignItems: 'flex-start',
          paddingBottom: '2.5rem',
          margin: '0',
          paddingLeft: '3rem',
          maxWidth: '100%',
        } : undefined}
      >
        <div style={heroImage ? {
          display: 'inline-block',
          background: 'rgba(247, 243, 236, 0.48)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          borderRadius: '14px',
          padding: '1.5rem 2rem',
          maxWidth: '480px',
        } : undefined}>
          <h1
            className="hero-title"
            style={heroImage ? { color: 'var(--primary)', marginBottom: '1.25rem' } : undefined}
          >
            Your Home in Milwaukee Awaits
          </h1>
          {!heroImage && (
            <p className="hero-subtitle">
              Comfortable studio, one-bedroom, and two-bedroom apartments at Himount Gardens —
              a well-managed community on Milwaukee&rsquo;s west side.
            </p>
          )}
          <div className="hero-ctas">
            <Link href="/contact" className="btn-primary">
              {site.marketing_knobs?.hero_cta || 'Check Availability'}
              <ArrowRight size={16} />
            </Link>
            <a
              href={"tel:" + (site.phone_number?.replace(/[^0-9]/g, '') || '')}
              className="btn-primary"
              style={heroImage ? {
                background: 'var(--primary)',
                color: '#fff',
                border: 'none',
              } : undefined}
            >
              <Phone size={15} />
              {site.phone_number}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
