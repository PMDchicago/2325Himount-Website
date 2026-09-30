import { getPage, getSiteConfig } from '../../lib/content';
import PageHero from '../components/PageHero';
import MarkdownContent from '../components/MarkdownContent';
import CtaBand from '../components/CtaBand';

export const metadata = {
  title: 'Amenities',
  description: 'Community amenities and features at HiMount Gardens.'
};

export default function AmenitiesPage() {
  const site = getSiteConfig();
  const page = getPage('amenities');

  return (
    <main>
      <PageHero
        title={page.title || 'Amenities'}
        subtitle="Community features designed for practical, comfortable living."
      />
      <section className="section">
        <div className="container" style={{ maxWidth: '780px' }}>
          <MarkdownContent html={page.html} />
        </div>
      </section>
      <CtaBand site={site} />
    </main>
  );
}
