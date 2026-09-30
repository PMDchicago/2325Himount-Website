import { getUnits, getSiteConfig } from '../../lib/content';
import PageHero from '../components/PageHero';
import UnitsGrid from '../components/UnitsGrid';
import CtaBand from '../components/CtaBand';

export const metadata = {
  title: 'Floor Plans',
  description: 'Studio, one-bedroom, and two-bedroom floor plans at HiMount Gardens in Milwaukee.'
};

export default function FloorPlansPage() {
  const site = getSiteConfig();
  const units = getUnits();

  return (
    <main>
      <PageHero
        title="Floor Plans & Pricing"
        subtitle="Explore current apartment types and pricing. Contact us to confirm availability."
      />
      <section className="section">
        <div className="container">
          <UnitsGrid units={units} />
        </div>
      </section>
      <CtaBand site={site} />
    </main>
  );
}
