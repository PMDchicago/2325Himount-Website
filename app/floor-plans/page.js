import { getUnits } from '../../lib/content';
import PageHero from '../components/PageHero';
import UnitsGrid from '../components/UnitsGrid';

export const metadata = {
  title: 'Floor Plans | Himount Gardens',
  description: 'Studio, one-bedroom, and two-bedroom floor plans at Himount Gardens.'
};

export default function FloorPlansPage() {
  const units = getUnits();

  return (
    <main>
      <PageHero
        title="Floor Plans"
        subtitle="Explore current apartment types and pricing at Himount Gardens."
        ctaText="Schedule Tour"
        ctaHref="/contact"
      />

      <section className="container section">
        <UnitsGrid units={units} />
      </section>
    </main>
  );
}
