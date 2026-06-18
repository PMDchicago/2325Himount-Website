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
  const token = sanitize(body['cf-turnstile-response']);

  if (!name || !email) {
    return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
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
