import nodemailer from 'nodemailer';

// Prüfe, ob das E-Mail-System aktiviert ist
const isEmailSystemEnabled = process.env.ENABLE_EMAIL_SYSTEM === 'true';

// Email-Transporter konfigurieren (nur wenn E-Mail-System aktiviert ist)
const transporter = isEmailSystemEnabled ? nodemailer.createTransport({
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
  }
}) : null;

// Verifiziere die Transporter-Konfiguration beim Start
if (isEmailSystemEnabled && transporter) {
  transporter.verify(function(error, success) {
    if (error) {
      console.error('E-Mail-System nicht verfügbar:', error.message);
    } else {
      console.log('E-Mail-System bereit');
    }
  });
} else {
  console.log('E-Mail-System deaktiviert - E-Mails werden simuliert');
}

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
  if (!isEmailSystemEnabled) {
    console.log('Simuliere E-Mail-Versand für Buchung', booking._id);
    return;
  }

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
  } catch (error) {
    console.error('Fehler beim E-Mail-Versand:', error.message);
    throw error;
  }
};

export { sendBookingConfirmation }; 