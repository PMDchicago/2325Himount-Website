import { getSiteConfig, getUnits } from '../lib/content';

export default function HomePage() {
  const site = getSiteConfig();
  const units = getUnits();
  return (
    <main>
      <h1>{site.site_title}</h1>
      <p className="muted">{site.address.street}, {site.address.city}, {site.address.state} {site.address.zip}</p>

      <div className="card">
        <h2>Leasing</h2>
        <p><strong>Phone:</strong> {site.phone_number}</p>
        <p><strong>Primary CTA:</strong> {site.marketing_knobs.hero_cta}</p>
      </div>

      <div className="card">
        <h2>Unit Types</h2>
        <ul>
          {units.map((u) => (
            <li key={u.title}><strong>{u.title}</strong> — {u.price_range} ({u.availability})</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
