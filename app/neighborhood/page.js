import { getSiteConfig } from '../../lib/content';
import PageHero from '../components/PageHero';
import CtaBand from '../components/CtaBand';
import { MapPin, Bus, ShoppingCart, Coffee } from 'lucide-react';

export const metadata = {
  title: 'Neighborhood',
  description: 'Neighborhood highlights near Himount Gardens in Milwaukee, WI.'
};

const HIGHLIGHTS = [
  {
    Icon: ShoppingCart,
    iconBg: '#edf7f1',
    iconColor: '#4a7c59',
    title: 'Shopping & Essentials',
    desc: 'Grocery stores, pharmacies, and everyday essentials within easy reach on Milwaukee\'s west side.',
  },
  {
    Icon: Bus,
    iconBg: '#e0eeff',
    iconColor: '#2563eb',
    title: 'Transit Access',
    desc: 'Milwaukee County Transit System bus routes nearby — making commuting across the city convenient.',
  },
  {
    Icon: MapPin,
    iconBg: '#fff0f0',
    iconColor: '#dc2626',
    title: 'Community Resources',
    desc: 'Close to community centers, neighborhood parks, libraries, and local services.',
  },
  {
    Icon: Coffee,
    iconBg: '#fffbeb',
    iconColor: '#d97706',
    title: 'Local Dining',
    desc: 'A variety of local restaurants and neighborhood businesses to enjoy close to home.',
  },
];

export default function NeighborhoodPage() {
  const site = getSiteConfig();

  return (
    <main>
      <PageHero
        title="The Neighborhood"
        subtitle="2325 N. 50th Street — located on Milwaukee's west side with access to daily essentials, transit, and community resources."
      />

      <section className="section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.75rem' }}>
            <span className="eyebrow">Location Highlights</span>
            <h2 className="section-title">Everything Within Reach</h2>
          </div>
          <div className="features-grid">
            {HIGHLIGHTS.map(({ Icon, iconBg, iconColor, title, desc }) => (
              <div key={title} className="feature-item">
                <div className="feature-icon-wrap" style={{ background: iconBg }}>
                  <Icon size={28} style={{ color: iconColor }} strokeWidth={1.75} />
                </div>
                <h3>{title}</h3>
                <p>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <div className="card" style={{ maxWidth: '680px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', marginBottom: '1rem' }}>
              <MapPin size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              <strong>2325 N. 50th Street, Milwaukee, WI 53210</strong>
            </div>
            <div style={{
              width: '100%',
              aspectRatio: '16/9',
              borderRadius: '10px',
              overflow: 'hidden',
              border: '1px solid var(--border)',
            }}>
              <iframe
                src="https://maps.google.com/maps?q=2325+N+50th+Street+Milwaukee+WI+53210&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Himount Gardens Location"
              />
            </div>
          </div>
        </div>
      </section>

      <CtaBand site={site} />
    </main>
  );
}
