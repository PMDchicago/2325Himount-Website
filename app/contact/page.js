import { getPage, getSiteConfig } from '../../lib/content';
import PageHero from '../components/PageHero';
import MarkdownContent from '../components/MarkdownContent';
import { Phone, MapPin } from 'lucide-react';
import ContactForm from '../components/ContactForm';

export const metadata = {
  title: 'Contact',
  description: 'Contact the Himount Gardens leasing office in Milwaukee, WI.'
};

export default function ContactPage() {
  const site = getSiteConfig();
  const page = getPage('contact');
  const addr = site.address || {};

  return (
    <main>
      <PageHero
        title={page.title || 'Contact Us'}
        subtitle="Questions about availability, tours, or leasing? Our team is here to help."
      />

      <section className="section">
        <div className="container two-col">

          {/* Left col: contact info + markdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="card">
              <h2 style={{ marginTop: 0, fontFamily: 'var(--font-serif)' }}>Leasing Office</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1rem' }}>
                <a
                  href={`tel:${site.phone_number?.replace(/[^0-9]/g, '')}`}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '0.6rem',
                    fontWeight: '700', fontSize: '1.2rem', color: 'var(--primary)'
                  }}
                >
                  <Phone size={18} strokeWidth={2.5} />
                  {site.phone_number}
                </a>
                <span style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem', color: 'var(--text)', fontSize: '0.95rem' }}>
                  <MapPin size={18} style={{ marginTop: '2px', flexShrink: 0, color: 'var(--primary)' }} strokeWidth={2} />
                  <span>{addr.street}<br />{addr.city}, {addr.state} {addr.zip}</span>
                </span>
              </div>
            </div>

            <div className="card">
              <MarkdownContent html={page.html} />
            </div>
          </div>

          {/* Right col: contact form */}
          <div className="card">
            <h2 style={{ marginTop: 0, fontFamily: 'var(--font-serif)' }}>Request Information</h2>
            <ContactForm />
          </div>

        </div>
      </section>
    </main>
  );
}
