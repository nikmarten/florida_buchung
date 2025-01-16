import nodemailer from 'nodemailer';

// Email-Transporter konfigurieren
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// HTML-Template für die Buchungsbestätigung
const createBookingConfirmationHTML = (booking) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  };

  // Extrahiere den Vornamen (nimm das erste Wort des Namens)
  const firstName = booking.customerName.split(' ')[0];

  const itemsList = booking.items.map(item => `
    <li>
      ${item.productId.name}<br>
      Zeitraum: ${formatDate(item.startDate)} - ${formatDate(item.endDate)}
    </li>
  `).join('');

  return `
    <h2>Vielen Dank für deine Buchung!</h2>
    <p>Hallo ${firstName},</p>
    <p>wir bestätigen dir hiermit deine Buchung mit folgenden Details:</p>
    
    <h3>Deine gebuchten Produkte:</h3>
    <ul>
      ${itemsList}
    </ul>

    ${booking.notes ? `<h3>Deine Notizen:</h3><p>${booking.notes}</p>` : ''}
    
    <p>Bei Fragen stehen wir dir gerne zur Verfügung!</p>
    
    <p>Viele Grüße<br>
    Dein Florida Technik Team</p>
  `;
};

// Funktion zum Senden der Buchungsbestätigung
const sendBookingConfirmation = async (booking) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: booking.customerEmail,
      subject: 'Deine Buchungsbestätigung - Florida Technik',
      html: createBookingConfirmationHTML(booking),
    });
    console.log('Buchungsbestätigung wurde gesendet an:', booking.customerEmail);
  } catch (error) {
    console.error('Fehler beim Senden der Buchungsbestätigung:', error);
    throw error;
  }
};

export { sendBookingConfirmation }; 