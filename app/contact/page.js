import { getPage, getSiteConfig } from '../../lib/content';
import PageHero from '../components/PageHero';
import MarkdownContent from '../components/MarkdownContent';

export const metadata = {
  title: 'Contact | Himount Gardens',
  description: 'Contact the Himount Gardens leasing office.'
};

export default function ContactPage() {
  const site = getSiteConfig();
  const page = getPage('contact');

  return (
    <main>
      <PageHero
        title={page.title || 'Contact'}
        subtitle="Questions about availability, tours, or leasing? We are here to help."
        ctaText="Call Leasing"
        ctaHref={`tel:${site.phone_number?.replace(/[^0-9]/g, '')}`}
      />

      <section className="container section two-col">
        <article className="card">
          <MarkdownContent html={page.html} />
        </article>

        <article className="card">
          <h2>Request Information</h2>
          <form className="contact-form" name="contact" method="post">
            <label>
              Name
              <input type="text" name="name" required />
            </label>
            <label>
              Email
              <input type="email" name="email" required />
            </label>
            <label>
              Message
              <textarea name="message" rows="5" required />
            </label>
            <button type="submit">Send Request</button>
          </form>
        </article>
      </section>
    </main>
  );
}
