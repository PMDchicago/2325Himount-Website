import { Inter, Playfair_Display } from 'next/font/google';
import Script from 'next/script';
import './globals.css';
import { getSiteConfig } from '../lib/content';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair', display: 'swap' });

export const metadata = {
  title: { default: 'Himount Gardens', template: '%s | Himount Gardens' },
  description: 'Comfortable apartment living in Milwaukee, WI. Studio, 1BR, and 2BR apartments at Himount Gardens.'
};

export default function RootLayout({ children }) {
  const site = getSiteConfig();
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body style={{
        '--primary':      (site.colors && site.colors.primary)   || '#1f3a5f',
        '--primary-dark': (site.colors && site.colors.primary)   || '#152840',
        '--accent':       (site.colors && site.colors.secondary) || '#c5a065',
      }}>
        <SiteHeader site={site} />
        {children}
        <SiteFooter site={site} />
        {/* Netlify Identity widget — handles recovery/confirmation tokens at site root */}
        <Script src="https://identity.netlify.com/v1/netlify-identity-widget.js" strategy="afterInteractive" />
        <Script id="netlify-identity-redirect" strategy="afterInteractive">{`
          if (window.netlifyIdentity) {
            window.netlifyIdentity.on("init", function(user) {
              if (!user) {
                window.netlifyIdentity.on("login", function() {
                  document.location.href = "/admin/";
                });
              }
            });
          }
        `}</Script>
      </body>
    </html>
  );
}
