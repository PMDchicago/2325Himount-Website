import { getPage, getSiteConfig, getUnits } from '../lib/content';
import PageHero from './components/PageHero';
import MarkdownContent from './components/MarkdownContent';
import UnitsGrid from './components/UnitsGrid';

export default function HomePage() {
  const site = getSiteConfig();
  const home = getPage('home');
  const units = getUnits();

  return (
    <main>
      <PageHero
        title={home.title || site.site_title}
        subtitle="Comfortable apartment living in Milwaukee with practical amenities and responsive management."
        ctaText={site.marketing_knobs?.hero_cta || 'Check Availability'}
        ctaHref="/contact"
      />

      <section className="container section">
        <MarkdownContent html={home.html} />
      </section>

      <section className="container section">
        <h2>Floor Plan Snapshot</h2>
        <UnitsGrid units={units} />
      </section>
    </main>
  );
}
