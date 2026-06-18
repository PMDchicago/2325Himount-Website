"use client";

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '0x4AAAAAADBUUey-QiBd-uh9';

export default function ContactForm() {
  const formRef = useRef(null);
  const turnstileRef = useRef(null);
  const widgetIdRef = useRef(null);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState('');

  useEffect(() => {
    if (!scriptLoaded || !TURNSTILE_SITE_KEY || !turnstileRef.current || widgetIdRef.current !== null) return;
    if (typeof window === 'undefined' || !window.turnstile) return;

    widgetIdRef.current = window.turnstile.render(turnstileRef.current, {
      sitekey: TURNSTILE_SITE_KEY,
      theme: 'light',
      callback(token) {
        setTurnstileToken(token);
        setStatus((current) => current.type === 'pending-security' ? { type: '', message: '' } : current);
      },
      'expired-callback'() {
        setTurnstileToken('');
      },
      'error-callback'() {
        setTurnstileToken('');
        setStatus({ type: 'error', message: 'Security check could not load. Please refresh and try again.' });
      },
    });

    // Some Turnstile keys are configured as invisible/non-interactive. Execute once so
    // the hidden response token is available before a visitor submits the form.
    setTimeout(() => {
      if (window.turnstile && widgetIdRef.current !== null) {
        try { window.turnstile.execute(widgetIdRef.current); } catch {}
      }
    }, 250);
  }, [scriptLoaded]);

  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;

    if (!turnstileToken) {
      if (typeof window !== 'undefined' && window.turnstile && widgetIdRef.current !== null) {
        try { window.turnstile.execute(widgetIdRef.current); } catch {}
      }
      setStatus({ type: 'pending-security', message: 'Completing security check… please press Send Request again in a moment.' });
      return;
    }

    setIsSubmitting(true);
    setStatus({ type: 'pending', message: 'Sending your request…' });

    const formData = new FormData(form);
    formData.set('cf-turnstile-response', turnstileToken);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(result.error || 'Something went wrong. Please try again.');
      }

      setStatus({ type: 'success', message: 'Thanks — your request has been sent.' });
      form.reset();
      setTurnstileToken('');
      if (typeof window !== 'undefined' && window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.reset(widgetIdRef.current);
        try { window.turnstile.execute(widgetIdRef.current); } catch {}
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Failed to send your request.' });
      setTurnstileToken('');
      if (typeof window !== 'undefined' && window.turnstile && widgetIdRef.current !== null) {
        window.turnstile.reset(widgetIdRef.current);
        try { window.turnstile.execute(widgetIdRef.current); } catch {}
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <form ref={formRef} className="contact-form" name="contact" method="post" onSubmit={handleSubmit}>
        <label>
          Full Name
          <input type="text" name="name" required placeholder="Your full name" autoComplete="name" />
        </label>
        <label>
          Email Address
          <input type="email" name="email" required placeholder="your@email.com" autoComplete="email" />
        </label>
        <label>
          Phone (optional)
          <input type="tel" name="phone" placeholder="(555) 000-0000" autoComplete="tel" />
        </label>
        <label>
          I&apos;m interested in&hellip;
          <select name="interest">
            <option value="">— Select unit type —</option>
            <option value="studio">Studio ($860/mo)</option>
            <option value="1br">1 Bedroom ($1,000/mo)</option>
            <option value="2br">2 Bedroom ($1,150/mo)</option>
          </select>
        </label>
        <label>
          Message
          <textarea name="message" rows={5} placeholder="Any questions or comments…" />
        </label>
        <div className="turnstile-wrap">
          {TURNSTILE_SITE_KEY ? (
            <div ref={turnstileRef} />
          ) : (
            <p className="form-status error">Security check is temporarily unavailable.</p>
          )}
        </div>
        <button
          type="submit"
          className="btn-secondary"
          disabled={isSubmitting || !TURNSTILE_SITE_KEY}
          style={{
            display: 'inline-block',
            width: 'auto',
            padding: '0.8rem 1.75rem',
            border: 'none',
            cursor: isSubmitting ? 'wait' : 'pointer',
            fontSize: '1rem',
            opacity: isSubmitting ? 0.75 : 1,
          }}
        >
          {isSubmitting ? 'Sending…' : 'Send Request'}
        </button>
        {status.message ? (
          <p className={`form-status ${status.type}`} role="status" aria-live="polite">{status.message}</p>
        ) : null}
      </form>
    </>
  );
}
