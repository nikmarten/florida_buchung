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
    <h2>🎉 Super, deine Buchung ist bestätigt!</h2>
    <p>Hey ${firstName},</p>
    <p>toll, dass du dich für Florida Technik entschieden hast! Hier sind alle Details zu deiner Buchung:</p>
    
    <h3>🎯 Deine gebuchten Produkte:</h3>
    <ul>
      ${itemsList}
    </ul>

    ${booking.notes ? `<h3>📝 Deine Notizen:</h3><p>${booking.notes}</p>` : ''}
    
    <p>Falls du noch Fragen hast, melde dich einfach - wir sind für dich da! 😊</p>
    
    <p>Beste Grüße<br>
    Dein Florida Technik Team 🚀</p>
  `;
};

// Funktion zum Senden der Buchungsbestätigung
const sendBookingConfirmation = async (booking) => {
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: booking.customerEmail,
      subject: '🎉 Deine Buchung bei Florida Technik ist bestätigt!',
      html: createBookingConfirmationHTML(booking),
    });
    console.log('Buchungsbestätigung wurde gesendet an:', booking.customerEmail);
  } catch (error) {
    console.error('Fehler beim Senden der Buchungsbestätigung:', error);
    throw error;
  }
};

export { sendBookingConfirmation }; 