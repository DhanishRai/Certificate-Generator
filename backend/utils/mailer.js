const nodemailer = require("nodemailer");

let transporterInstance;

function getTransporter() {
  if (transporterInstance) return transporterInstance;

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    throw new Error("Email credentials are not configured. Set EMAIL_USER and EMAIL_PASS.");
  }

  transporterInstance = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });

  return transporterInstance;
}

function buildCertificateEmailHtml({ recipientEmail, name, event, issueDate, certificateId, verifyUrl }) {
  return `
    <div style="font-family:Arial,sans-serif;background:#f8fafc;padding:24px;">
      <div style="max-width:620px;margin:0 auto;background:white;border:1px solid #e2e8f0;border-radius:14px;padding:24px;">
        <h2 style="margin:0 0 12px;color:#0f172a;">Your Certificate is Ready</h2>
        <p style="margin:0 0 16px;color:#334155;">
          Hello,
        </p>
        <p style="margin:0 0 16px;color:#334155;">
          Please find your certificate attached as a PDF. Below are the details:
        </p>
        <ul style="margin:0 0 16px;padding-left:18px;color:#334155;">
          <li><strong>Recipient:</strong> ${name}</li>
          <li><strong>Event:</strong> ${event}</li>
          <li><strong>Issue Date:</strong> ${new Date(issueDate).toLocaleDateString()}</li>
          <li><strong>Certificate ID:</strong> ${certificateId}</li>
        </ul>
        <p style="margin:0 0 16px;color:#334155;">
          Verify this certificate at:
          <a href="${verifyUrl}" style="color:#2563eb;text-decoration:none;"> ${verifyUrl}</a>
        </p>
        <p style="margin:0;color:#64748b;font-size:13px;">
          This email was sent to ${recipientEmail}.
        </p>
      </div>
    </div>
  `;
}

module.exports = {
  getTransporter,
  buildCertificateEmailHtml,
};
