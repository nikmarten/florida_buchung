import nodemailer from 'nodemailer';

// Detaillierte Umgebungsvariablen-Überprüfung
console.log('Umgebungsvariablen-Status:', {
  NODE_ENV: process.env.NODE_ENV,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,
  SMTP_SECURE: process.env.SMTP_SECURE,
  SMTP_USER: process.env.SMTP_USER,
  SMTP_FROM: process.env.SMTP_FROM,
  NOTIFICATION_EMAIL: process.env.NOTIFICATION_EMAIL
});

// SMTP-Konfiguration
const smtpConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
  debug: true
};

// Validiere die SMTP-Konfiguration
console.log('SMTP-Konfiguration (ohne Passwort):', {
  ...smtpConfig,
  auth: {
    ...smtpConfig.auth,
    pass: smtpConfig.auth.pass ? '[PASSWORT VORHANDEN]' : '[KEIN PASSWORT]'
  }
});

// Überprüfe, ob alle erforderlichen Werte vorhanden sind
const requiredFields = ['host', 'port', 'auth.user', 'auth.pass'];
const missingFields = requiredFields.filter(field => {
  const value = field.split('.').reduce((obj, key) => obj?.[key], smtpConfig);
  return !value;
});

if (missingFields.length > 0) {
  console.error('Fehlende SMTP-Konfigurationswerte:', missingFields);
  throw new Error('SMTP-Konfiguration unvollständig');
}

// Erstelle den Transporter mit expliziter Host-Konfiguration
const transporter = nodemailer.createTransport({
  host: 'smtp.office365.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  tls: {
    rejectUnauthorized: false,
    ciphers: 'SSLv3'
  },
  debug: true
});

// Test the connection
transporter.verify(function(error, success) {
  if (error) {
    console.error('SMTP-Verbindungsfehler:', error);
    console.error('Fehlerdetails:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack,
      config: {
        host: transporter.options.host,
        port: transporter.options.port,
        secure: transporter.options.secure
      }
    });
  } else {
    console.log('SMTP-Server ist bereit zum Senden von E-Mails');
  }
});

export const sendBookingConfirmation = async (booking) => {
  const itemsList = booking.items
    .map(item => `- ${item.product.name} (${item.quantity}x) vom ${new Date(item.startDate).toLocaleDateString('de-DE')} bis ${new Date(item.endDate).toLocaleDateString('de-DE')}`)
    .join('\n');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="background-color: #4a90e2; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Deine Buchung ist bestätigt! 🎉</h1>
      </div>
      
      <div style="padding: 30px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Deine Buchungsdetails</h2>
          <p style="margin: 10px 0;"><strong>Name:</strong> ${booking.customerName}</p>
          <p style="margin: 10px 0;"><strong>E-Mail:</strong> ${booking.customerEmail}</p>
          <p style="margin: 10px 0;"><strong>Telefon:</strong> ${booking.phone || 'Nicht angegeben'}</p>
          <p style="margin: 10px 0;"><strong>Buchungsnummer:</strong> ${booking._id}</p>
          <p style="margin: 10px 0;"><strong>Status:</strong> ${booking.status}</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Deine gebuchten Artikel</h2>
          <pre style="white-space: pre-wrap; margin: 0; font-family: Arial, sans-serif;">${itemsList}</pre>
        </div>

        ${booking.notes ? `
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Deine Anmerkungen</h2>
            <p style="white-space: pre-wrap; margin: 0;">${booking.notes}</p>
          </div>
        ` : ''}

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            Bei Fragen stehen wir dir gerne zur Verfügung!<br>
            <a href="mailto:kameratechnik@floridatv-entertainment.de" style="color: #4a90e2; text-decoration: none;">kameratechnik@floridatv-entertainment.de</a>
          </p>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: booking.customerEmail,
    subject: `Deine Buchung bei Florida Technik - ${booking._id}`,
    text: `
Deine Buchung ist bestätigt! 🎉

Deine Buchungsdetails:
- Name: ${booking.customerName}
- E-Mail: ${booking.customerEmail}
- Telefon: ${booking.phone || 'Nicht angegeben'}
- Buchungsnummer: ${booking._id}
- Status: ${booking.status}

Deine gebuchten Artikel:
${itemsList}

${booking.notes ? `\nDeine Anmerkungen:\n${booking.notes}` : ''}

Bei Fragen stehen wir dir gerne zur Verfügung!
kameratechnik@floridatv-entertainment.de
    `.trim(),
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Bestätigungs-E-Mail an Kunden wurde gesendet');
  } catch (error) {
    console.error('Fehler beim Senden der Bestätigungs-E-Mail:', error);
  }
};

export const sendNewBookingNotification = async (booking) => {
  const itemsList = booking.items
    .map(item => `- ${item.product.name} (${item.quantity}x) vom ${new Date(item.startDate).toLocaleDateString('de-DE')} bis ${new Date(item.endDate).toLocaleDateString('de-DE')}`)
    .join('\n');

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
      <div style="background-color: #4a90e2; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="margin: 0; font-size: 24px;">Neue Buchung eingegangen! 📬</h1>
      </div>
      
      <div style="padding: 30px;">
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Kundendaten</h2>
          <p style="margin: 10px 0;"><strong>Name:</strong> ${booking.customerName}</p>
          <p style="margin: 10px 0;"><strong>E-Mail:</strong> ${booking.customerEmail}</p>
          <p style="margin: 10px 0;"><strong>Telefon:</strong> ${booking.phone || 'Nicht angegeben'}</p>
        </div>

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h2 style="color: #2c3e50; margin-top: 0;">Gebuchte Artikel</h2>
          <pre style="white-space: pre-wrap; margin: 0; font-family: Arial, sans-serif;">${itemsList}</pre>
        </div>

        ${booking.notes ? `
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h2 style="color: #2c3e50; margin-top: 0;">Anmerkungen</h2>
            <p style="white-space: pre-wrap; margin: 0;">${booking.notes}</p>
          </div>
        ` : ''}

        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <p style="margin: 10px 0;"><strong>Buchungsnummer:</strong> ${booking._id}</p>
          <p style="margin: 10px 0;"><strong>Status:</strong> ${booking.status}</p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">
            Diese E-Mail wurde automatisch generiert.
          </p>
        </div>
      </div>
    </div>
  `;

  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: process.env.NOTIFICATION_EMAIL,
    subject: `Neue Buchung von ${booking.customerName}`,
    text: `
Neue Buchung eingegangen! 📬

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
    `.trim(),
    html: htmlContent
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Benachrichtigungs-E-Mail an Administratoren wurde gesendet');
  } catch (error) {
    console.error('Fehler beim Senden der Benachrichtigungs-E-Mail:', error);
  }
}; 