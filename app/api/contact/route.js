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

function looksLikeGibberish(value = '') {
  const trimmed = String(value).trim();
  if (trimmed.length < 10 || /\s/.test(trimmed) || !/^[A-Za-z0-9]+$/.test(trimmed)) {
    return false;
  }

  let caseTransitions = 0;
  let uppercaseCount = 0;
  let lowercaseCount = 0;
  for (const character of trimmed) {
    if (/[A-Z]/.test(character)) uppercaseCount++;
    if (/[a-z]/.test(character)) lowercaseCount++;
  }
  for (let i = 1; i < trimmed.length; i++) {
    const previous = trimmed[i - 1];
    const current = trimmed[i];
    if (!/[A-Za-z]/.test(previous) || !/[A-Za-z]/.test(current)) continue;
    if ((previous === previous.toUpperCase()) !== (current === current.toUpperCase())) {
      caseTransitions++;
    }
  }

  const caseRatio = Math.min(uppercaseCount, lowercaseCount) / Math.max(uppercaseCount, lowercaseCount);
  return uppercaseCount >= 4 && lowercaseCount >= 4 && caseTransitions >= 6 && caseRatio >= 0.3;
}

function fakeSuccess(reason) {
  console.warn('Contact form soft-rejected:', reason);
  return NextResponse.json({ ok: true });
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
    return fakeSuccess('honeypot filled');
  }

  // Timestamp — reject bot auto-submits (< 1.5s) and stale/replay (> 30min)
  if (!Number.isFinite(ts)) {
    return fakeSuccess('missing or invalid timestamp');
  }
  const age = Date.now() - ts;
  if (age < 1500 || age > 1_800_000) {
    return fakeSuccess(`invalid submission age (${age}ms)`);
  }

  if (!token) {
    return NextResponse.json({ error: 'Please complete the security check.' }, { status: 400 });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY || process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY;
  const resendApiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'manager@himountgardens.com';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || 'HiMount Gardens <no-reply@pmdchicago.com>';

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
    return fakeSuccess('gibberish message');
  }

  const html = `
    <h2>New HiMount Gardens inquiry</h2>
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
      subject: `HiMount Gardens inquiry from ${name}`,
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
