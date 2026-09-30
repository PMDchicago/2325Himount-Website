import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
const RESEND_EMAIL_URL = 'https://api.resend.com/emails';

function sanitize(value = '') {
  return String(value).trim().slice(0, 2000);
}

function escapeHtml(value = '') {
  return sanitize(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function looksLikeGibberish(str) {
  if (!str || str.length < 30) return false;
  // No whitespace at all in a long string → suspicious
  if (!/\s/.test(str.trim())) return true;
  // Mixed-case high-letter-density string with no structure
  const alpha = str.replace(/[^a-zA-Z]/g, '');
  if (alpha.length > 40) {
    const upper = alpha.replace(/[^A-Z]/g, '').length;
    const lower = alpha.replace(/[^a-z]/g, '').length;
    if (upper > 0 && lower > 0) {
      const ratio = Math.min(upper, lower) / Math.max(upper, lower);
      if (ratio > 0.3 && alpha.length / str.length > 0.7) return true;
    }
  }
  return false;
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  const name = sanitize(body.name);
  const email = sanitize(body.email);
  const phone = sanitize(body.phone);
  const interest = sanitize(body.interest);
  const message = sanitize(body.message);
  const company = sanitize(body.company);
  const ts = Number(body.ts);
  const token = sanitize(body['cf-turnstile-response']);

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
  }

  // Header-injection / newline guard
  const textFields = [name, email, phone, interest];
  if (textFields.some(f => /[\r\n]/.test(f))) {
    return NextResponse.json({ error: 'Invalid input detected.' }, { status: 400 });
  }

  // Stricter server-side email format validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email format.' }, { status: 400 });
  }

  // Honeypot — silently succeed if a bot filled the hidden company field
  if (company) {
    return NextResponse.json({ ok: true });
  }

  // Timestamp — reject bot auto-submits (< 1.5s) and stale/replay (> 30min)
  if (ts && !isNaN(ts)) {
    const age = Date.now() - ts;
    if (age < 1500 || age > 1_800_000) {
      return NextResponse.json({ error: 'Form submission rejected.' }, { status: 400 });
    }
  }

  if (!token) {
    return NextResponse.json({ error: 'Please complete the security check.' }, { status: 400 });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'manager@himountgardens.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'Himount Gardens <no-reply@pmdchicago.com>';

  if (!turnstileSecret || !resendApiKey || !toEmail) {
    return NextResponse.json({ error: 'Contact form is not fully configured yet.' }, { status: 500 });
  }

  const verifyPayload = new URLSearchParams();
  verifyPayload.set('secret', turnstileSecret);
  verifyPayload.set('response', token);
  const ip = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim();
  if (ip) verifyPayload.set('remoteip', ip);

  const verifyResponse = await fetch(TURNSTILE_VERIFY_URL, {
    method: 'POST',
    body: verifyPayload,
  });
  const verifyResult = await verifyResponse.json().catch(() => ({}));

  if (!verifyResult.success) {
    return NextResponse.json({ error: 'Security check failed. Please try again.' }, { status: 400 });
  }

  // Gibberish heuristic — silently drop bot-generated spam messages
  if (looksLikeGibberish(message)) {
    return NextResponse.json({ ok: true });
  }

  const html = `
    <h2>New Himount Gardens inquiry</h2>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(phone || 'Not provided')}</p>
    <p><strong>Interest:</strong> ${escapeHtml(interest || 'Not specified')}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message || 'No message provided.').replace(/\r?\n/g, '<br>')}</p>
  `;

  const emailResponse = await fetch(RESEND_EMAIL_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [toEmail],
      reply_to: email,
      subject: `Himount Gardens inquiry from ${name}`,
      html,
    }),
  });

  if (!emailResponse.ok) {
    const errorText = await emailResponse.text().catch(() => '');
    console.error('Resend contact email failed', emailResponse.status, errorText.slice(0, 500));
    return NextResponse.json({ error: 'Message could not be sent right now. Please call the leasing office.' }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
