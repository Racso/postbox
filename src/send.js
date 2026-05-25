import nodemailer from 'nodemailer';

/**
 * Sends an email asynchronously via ImprovMX SMTP.
 * Fire-and-forget — caller does not await this.
 *
 * @param {object} opts
 * @param {string} opts.from         Display from (e.g. "Identity <login@id.rac.so>")
 * @param {string} opts.smtp_user    Bare email for SMTP auth (e.g. "login@id.rac.so")
 * @param {string} opts.smtp_password
 * @param {string|string[]} opts.to
 * @param {string|string[]|undefined} opts.cc
 * @param {string|string[]|undefined} opts.bcc
 * @param {string|undefined} opts.reply_to
 * @param {string} opts.subject
 * @param {string|undefined} opts.html
 * @param {string|undefined} opts.text
 */
export async function sendEmail(opts) {
  const { from, smtp_user, smtp_password, to, cc, bcc, reply_to, subject, html, text } = opts;

  const transporter = nodemailer.createTransport({
    host: 'smtp.improvmx.com',
    port: 587,
    secure: false, // STARTTLS
    auth: {
      user: smtp_user,
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
