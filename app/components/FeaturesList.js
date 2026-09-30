import { Home, Users, MapPin, Wrench } from 'lucide-react';

const FEATURES = [
  {
    Icon: Home,
    title: 'Quality Apartments',
    desc: 'Studio, one-bedroom, and two-bedroom floor plans designed for practical everyday living.',
  },
  {
    Icon: Users,
    title: 'Professional Management',
    desc: 'On-site management team keeping the community well-maintained and responsive to residents.',
  },
  {
    Icon: MapPin,
    title: 'Prime West Side Location',
    desc: 'Located on N. 50th Street with convenient access to shopping, services, and transit.',
  },
  {
    Icon: Wrench,
    title: 'Responsive Maintenance',
    desc: 'Maintenance requests handled promptly so you can focus on what matters most.',
  },
];

export default function FeaturesList() {
  return (
    <section className="section features-section">
      <div className="container">
        <div className="text-center" style={{ marginBottom: '2.75rem' }}>
          <span className="eyebrow">Why HiMount Gardens</span>
          <h2 className="section-title">A Community Built for You</h2>
        </div>
        <div className="features-grid">
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} className="feature-item">
              <div className="feature-icon-wrap">
                <Icon size={28} style={{ color: 'var(--accent)' }} strokeWidth={1.75} />
              </div>
              <h3>{title}</h3>
              <p>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
