import Link from 'next/link';
import { Phone, ArrowRight } from 'lucide-react';

export default function HomeHero({ site }) {
  return (
    <section className="home-hero">
      <div className="container hero-inner">
        <p className="hero-eyebrow">Milwaukee, Wisconsin · Est. 1925</p>
        <h1 className="hero-title">Your Home in Milwaukee Awaits</h1>
        <p className="hero-subtitle">
          Comfortable studio, one-bedroom, and two-bedroom apartments at Himount Gardens —
          a well-managed community on Milwaukee&rsquo;s west side.
        </p>
        <div className="hero-ctas">
          <Link href="/contact" className="btn-primary">
            {site.marketing_knobs?.hero_cta || 'Check Availability'}
            <ArrowRight size={16} />
          </Link>
          <a
            href={`tel:${site.phone_number?.replace(/[^0-9]/g, '')}`}
            className="btn-outline"
          >
            <Phone size={15} />
            {site.phone_number}
          </a>
        </div>
      </div>
    </section>
  );
}
