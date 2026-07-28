import nodemailer from 'nodemailer';

// Konfigurasi transporter untuk Nodemailer
// Untuk sementara, kita menggunakan konfigurasi SMTP default atau Ethereal (mock).
// Nantinya bisa diganti menggunakan layanan email asli (Gmail, SendGrid, dll) via .env
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.ethereal.email',
  port: parseInt(process.env.SMTP_PORT || '587'),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendMailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendMail = async (options: SendMailOptions) => {
  try {
    const info = await transporter.sendMail({
      from: `"KolaborAksi" <${process.env.SMTP_USER || 'noreply@kolaboraksi.id'}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(`Message sent: ${info.messageId}`);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't throw error in dev mode to prevent app crashing when SMTP is not configured
    if (process.env.NODE_ENV === 'production') {
      throw error;
    }
  }
};
