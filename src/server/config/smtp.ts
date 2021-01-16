import nodemailer from 'nodemailer';

export const DEFAULT_OPTIONS = {
  from: 'GradTrak <app@gradtrak.me>',
  replyTo: 'GradTrak <support@gradtrak.me>',
};

export const WELCOME_EMAIL = {
  subject: 'Welcome to GradTrak!',
  text: `Hi!

Thanks for registering with GradTrak! Feel free to email us at info@gradtrak.me if you have any questions. Welcome on board!

Best,

The GradTrak Team`,
};

let transporter;
if (process.env.SMTP_URL) {
  transporter = nodemailer.createTransport(process.env.SMTP_URL);
} else {
  transporter = nodemailer.createTransport({
    streamTransport: true,
  });
}

export async function sendMail(options: nodemailer.SendMailOptions): Promise<nodemailer.SentMessageInfo> {
  const info = await transporter.sendMail({ ...DEFAULT_OPTIONS, ...options });

  if (!process.env.SMTP_URL) {
    console.log('No SMTP_URL environment variable found for message delivery:');
    console.log(options);
  }

  return info;
}
