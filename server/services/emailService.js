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
  tls: {
    ciphers: 'SSLv3',
    rejectUnauthorized: false
  },
  debug: true // Aktiviere Debug-Logging
});

// Verifiziere die Transporter-Konfiguration beim Start
transporter.verify(function(error, success) {
  if (error) {
    console.error('Fehler bei der SMTP-Konfiguration:', error);
  } else {
    console.log('SMTP-Server ist bereit für den E-Mail-Versand');
  }
});

// HTML-Template für die Admin-Benachrichtigung
const createAdminNotificationHTML = (booking) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  };

  const itemsList = booking.items.map(item => `
    <li>
      ${item.productId.name}
      <br>
      Zeitraum: ${formatDate(item.startDate)} - ${formatDate(item.endDate)}
    </li>
  `).join('');

  return `
    <h2>Neue Buchung eingegangen</h2>
    
    <h3>Kundendaten:</h3>
    <p>
      <strong>Name:</strong> ${booking.customerName}<br>
      <strong>E-Mail:</strong> ${booking.customerEmail}
    </p>
    
    <h3>Gebuchte Produkte:</h3>
    <ul>
      ${itemsList}
    </ul>

    ${booking.notes ? `<h3>Kundennotizen:</h3><p>${booking.notes}</p>` : ''}
    
    <p>Buchung erstellt am: ${new Date(booking.createdAt).toLocaleString('de-DE')}</p>
  `;
};

// HTML-Template für die Buchungsbestätigung
const createBookingConfirmationHTML = (booking) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE');
  };

  const firstName = booking.customerName.split(' ')[0];

  const itemsList = booking.items.map(item => `
    <li>
      ${item.productId.name}<br>
      Zeitraum: ${formatDate(item.startDate)} - ${formatDate(item.endDate)}
    </li>
  `).join('');

  return `
    <h2>🎉 Deine Buchungsbestätigung</h2>
    <p>Hi ${firstName},</p>
    <p>hier sind die Details zu deiner Buchung:</p>
    
    <h3>🎯 Deine gebuchten Produkte:</h3>
    <ul>
      ${itemsList}
    </ul>

    ${booking.notes ? `<h3>📝 Deine Notizen:</h3><p>${booking.notes}</p>` : ''}
    
    <p>Bei Fragen sind wir für dich da! 😊</p>
    
    <p>Beste Grüße<br>
    Dein Florida Technik Team 🚀</p>
  `;
};

// Funktion zum Senden der Buchungsbestätigung
const sendBookingConfirmation = async (booking) => {
  try {
    // E-Mail an den Kunden
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: booking.customerEmail,
      subject: '🎉 Deine Buchungsbestätigung - Florida Technik',
      html: createBookingConfirmationHTML(booking),
    });

    // E-Mail an den Administrator
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: 'Neue Buchung eingegangen - Florida Technik',
      html: createAdminNotificationHTML(booking),
    });

    console.log('Buchungsbestätigung wurde gesendet an:', booking.customerEmail);
    console.log('Admin-Benachrichtigung wurde gesendet an:', process.env.ADMIN_EMAIL);
  } catch (error) {
    console.error('Fehler beim Senden der E-Mails:', error);
    throw error;
  }
};

export { sendBookingConfirmation }; 