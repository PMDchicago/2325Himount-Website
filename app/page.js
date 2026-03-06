import { getPage, getSiteConfig, getUnits } from '../lib/content';
import HomeHero from './components/HomeHero';
import StatsBar from './components/StatsBar';
import FeaturesList from './components/FeaturesList';
import UnitsGrid from './components/UnitsGrid';
import CtaBand from './components/CtaBand';
import MarkdownContent from './components/MarkdownContent';

export default function HomePage() {
  const site = getSiteConfig();
  const home = getPage('home');
  const units = getUnits();

  return (
    <main>
      <HomeHero site={site} heroImage={home.hero_image} />
      <StatsBar />

      <section className="section">
        <div className="container">
          <MarkdownContent html={home.html} />
        </div>
      </section>

      <FeaturesList />

      <section className="section units-section">
        <div className="container">
          <div className="text-center" style={{ marginBottom: '2.75rem' }}>
            <span className="eyebrow">Apartment Options</span>
            <h2 className="section-title">Floor Plan Snapshot</h2>
            <p className="section-subtitle">
              Studios starting at $860/mo. One- and two-bedroom options available. Contact us for current availability.
            </p>
          </div>
          <UnitsGrid units={units} />
        </div>
      </section>

      <CtaBand site={site} />
    </main>
  );
}
