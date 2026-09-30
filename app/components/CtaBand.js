import { Phone } from 'lucide-react';

export default function CtaBand({ site }) {
  return (
    <section className="cta-band">
      <div className="container">
        <h2>Ready to Make HiMount Gardens Home?</h2>
        <p>
          Join the waitlist or schedule a tour. Our leasing team is here to answer your questions.
        </p>
        <a
          href={`tel:${site.phone_number?.replace(/[^0-9]/g, '')}`}
          className="cta-phone"
        >
          <Phone size={20} strokeWidth={2.5} />
          {site.phone_number}
        </a>
      </div>
    </section>
  );
}
