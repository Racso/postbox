import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { sendEmail } from './send.js';

const app = new Hono();

app.post('/send', async (c) => {
  let body;
  try {
    body = await c.req.json();
  } catch {
    return c.json({ error: 'Invalid JSON body' }, 400);
  }

  const { from, smtp_user, smtp_password, to, subject, html, text, cc, bcc, reply_to } = body;

  // Validate required fields
  if (!from) return c.json({ error: 'Missing required field: from' }, 400);
  if (!smtp_user) return c.json({ error: 'Missing required field: smtp_user' }, 400);
  if (!smtp_password) return c.json({ error: 'Missing required field: smtp_password' }, 400);
  if (!to) return c.json({ error: 'Missing required field: to' }, 400);
  if (!subject) return c.json({ error: 'Missing required field: subject' }, 400);
  if (!html && !text) return c.json({ error: 'At least one of html or text is required' }, 400);

  // Fire-and-forget — do not await
  sendEmail({ from, smtp_user, smtp_password, to, cc, bcc, reply_to, subject, html, text });

  return c.json({ queued: true }, 202);
});

const port = 3000;
console.log(`[postbox] starting on port ${port}`);

serve({ fetch: app.fetch, port });
