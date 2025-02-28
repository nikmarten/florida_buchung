import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const sendNewBookingNotification = async (booking) => {
  const itemsList = booking.items
    .map(item => `- ${item.product.name} (${item.quantity}x) vom ${new Date(item.startDate).toLocaleDateString('de-DE')} bis ${new Date(item.endDate).toLocaleDateString('de-DE')}`)
    .join('\n');

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.NOTIFICATION_EMAIL, // E-Mail-Adresse der Lagermitarbeiter
    subject: `Neue Buchung von ${booking.customerName}`,
    text: `
Neue Buchung eingegangen!

Kundendaten:
- Name: ${booking.customerName}
- E-Mail: ${booking.customerEmail}
- Telefon: ${booking.phone || 'Nicht angegeben'}

Gebuchte Artikel:
${itemsList}

${booking.notes ? `\nAnmerkungen:\n${booking.notes}` : ''}

Buchungsnummer: ${booking._id}
Status: ${booking.status}

Diese E-Mail wurde automatisch generiert.
    `.trim()
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Benachrichtigungs-E-Mail wurde gesendet');
  } catch (error) {
    console.error('Fehler beim Senden der E-Mail:', error);
  }
}; 