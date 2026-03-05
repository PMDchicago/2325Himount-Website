import Link from 'next/link';
import { CheckCircle, Building2 } from 'lucide-react';

export default function UnitsGrid({ units = [], disclaimer }) {
  if (!units.length) {
    return <p className="muted">Unit information will be updated soon.</p>;
  }

  return (
    <div>
      {disclaimer && (
        <p className="muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          {disclaimer}
        </p>
      )}
      <div className="units-grid">
        {units.map((unit) => {
          const isAvailable = unit.availability === 'Available';
          return (
            <article key={unit.title} className="unit-card">
              {/* Placeholder image area */}
              <div className="unit-img-placeholder">
                <Building2 size={44} style={{ color: '#b8ac9e' }} strokeWidth={1.25} />
                <span className="unit-img-label">Photo Coming Soon</span>
              </div>

              <div className="unit-body">
                <div className="unit-header">
                  <h3 className="unit-title">{unit.title}</h3>
                  <span className={`availability-badge ${isAvailable ? 'badge-available' : 'badge-waitlist'}`}>
                    {unit.availability || 'Call for Info'}
                  </span>
                </div>

                <p className="unit-price">{unit.price_range}</p>
                <p className="unit-price-sub">per month · contact leasing for availability</p>

                {unit.sq_ft ? (
                  <p className="muted" style={{ fontSize: '0.83rem', marginBottom: '1rem' }}>
                    {unit.sq_ft} sq ft
                  </p>
                ) : null}

                {Array.isArray(unit.features) && unit.features.length > 0 && (
                  <ul className="unit-features">
                    {unit.features.map((f) => (
                      <li key={f}>
                        <CheckCircle size={15} style={{ color: 'var(--green)', flexShrink: 0 }} strokeWidth={2.5} />
                        {f}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="unit-footer">
                <Link href="/contact" className="btn-secondary">
                  Contact Leasing Office
                </Link>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
