import { getPage } from '../../lib/content';
import PageHero from '../components/PageHero';
import MarkdownContent from '../components/MarkdownContent';

export const metadata = {
  title: 'Neighborhood | Himount Gardens',
  description: 'Neighborhood highlights near Himount Gardens in Milwaukee.'
};

export default function NeighborhoodPage() {
  const page = getPage('neighborhood');

  return (
    <main>
      <PageHero
        title={page.title || 'Neighborhood'}
        subtitle="Close to shopping, local services, and key commuter routes."
        ctaText="Contact Leasing"
        ctaHref="/contact"
      />

      <section className="container section">
        <MarkdownContent html={page.html} />
      </section>
    </main>
  );
}
