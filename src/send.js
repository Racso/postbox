import nodemailer from 'nodemailer';

/**
 * Sends an email asynchronously via ImprovMX SMTP.
 * Fire-and-forget — caller does not await this.
 *
 * @param {object} opts
 * @param {string} opts.from
 * @param {string|string[]} opts.to
 * @param {string|string[]|undefined} opts.cc
 * @param {string|string[]|undefined} opts.bcc
 * @param {string|undefined} opts.reply_to
 * @param {string} opts.subject
 * @param {string|undefined} opts.html
 * @param {string|undefined} opts.text
 * @param {string} opts.smtp_password
 */
export async function sendEmail(opts) {
  const { from, to, cc, bcc, reply_to, subject, html, text, smtp_password } = opts;

  const transporter = nodemailer.createTransport({
    host: 'smtp.improvmx.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: from,
      pass: smtp_password,
    },
  });

  const message = {
    from,
    to,
    subject,
    ...(cc && { cc }),
    ...(bcc && { bcc }),
    ...(reply_to && { replyTo: reply_to }),
    ...(html && { html }),
    ...(text && { text }),
  };

  try {
    await transporter.sendMail(message);
    const toAddr = Array.isArray(to) ? to.join(', ') : to;
    console.log(`[postbox] sent to=${toAddr} from=${from}`);
  } catch (err) {
    const toAddr = Array.isArray(to) ? to.join(', ') : to;
    console.error(`[postbox] ERROR to=${toAddr}: ${err.message}`);
  }
}
