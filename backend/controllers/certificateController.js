const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const { v4: uuidv4 } = require("uuid");
const mongoose = require("mongoose");
const Certificate = require("../models/Certificate");
const { generateCertificatePdf } = require("../utils/pdfGenerator");
const { getTransporter, buildCertificateEmailHtml } = require("../utils/mailer");

const certificatesDir = path.join(__dirname, "..", "certificates");
if (!fs.existsSync(certificatesDir)) {
  fs.mkdirSync(certificatesDir, { recursive: true });
}

function parseCsvFile(filePath) {
  return new Promise((resolve, reject) => {
    const rows = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => rows.push(row))
      .on("end", () => resolve(rows))
      .on("error", reject);
  });
}

exports.generateCertificates = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "CSV file is required." });
  }

  try {
    const rows = await parseCsvFile(req.file.path);
    if (!rows.length) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: "CSV file is empty." });
    }

    const createdCertificates = [];

    for (const row of rows) {
      const name = (row.name || row.Name || "").trim();
      const event = (row.event || row.Event || "").trim();
      const dateRaw = (row.date || row.Date || "").trim();

      if (!name || !event) continue;

      const issueDate = dateRaw ? new Date(dateRaw) : new Date();
      const safeIssueDate = Number.isNaN(issueDate.getTime()) ? new Date() : issueDate;
      const certificateId = uuidv4();

      const verifyBaseUrl = process.env.VERIFY_BASE_URL || "https://yourdomain.com";
      const verificationUrl = `${verifyBaseUrl.replace(/\/$/, "")}/verify/${certificateId}`;

      const fileName = `${certificateId}.pdf`;
      const outputPath = path.join(certificatesDir, fileName);

      await generateCertificatePdf({
        outputPath,
        certificateId,
        name,
        event,
        issueDate: safeIssueDate,
        verificationUrl,
      });

      const pdfUrl = `${(process.env.BACKEND_URL || "http://localhost:5000").replace(/\/$/, "")}/certificates/${fileName}`;

      const certificate = await Certificate.create({
        certificateId,
        name,
        event,
        issueDate: safeIssueDate,
        pdfUrl,
      });

      createdCertificates.push(certificate);
    }

    fs.unlinkSync(req.file.path);

    return res.status(201).json({
      message: `Generated ${createdCertificates.length} certificate(s).`,
      certificates: createdCertificates,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    return res.status(500).json({ message: "Certificate generation failed.", error: error.message });
  }
};

exports.getCertificates = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { certificateId: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const certificates = await Certificate.find(query).sort({ createdAt: -1 });
    return res.json(certificates);
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch certificates.", error: error.message });
  }
};

exports.verifyCertificate = async (req, res) => {
  try {
    const { certificateId } = req.params;
    const certificate = await Certificate.findOne({ certificateId });

    if (!certificate) {
      return res.status(404).json({ status: "INVALID", message: "Certificate not found." });
    }

    return res.json({ status: "VALID", certificate });
  } catch (error) {
    return res.status(500).json({ message: "Verification failed.", error: error.message });
  }
};

exports.sendCertificateEmail = async (req, res) => {
  try {
    const { certificateId, recipientEmail } = req.body;

    if (!certificateId || !recipientEmail) {
      return res.status(400).json({ message: "certificateId and recipientEmail are required." });
    }

    const query = [{ certificateId }];
    if (mongoose.Types.ObjectId.isValid(certificateId)) {
      query.push({ _id: certificateId });
    }
    const certificate = await Certificate.findOne({ $or: query });

    if (!certificate) {
      return res.status(404).json({ message: "Certificate not found." });
    }

    const normalizedRecipient = recipientEmail.toLowerCase().trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    if (!emailRegex.test(normalizedRecipient)) {
      return res.status(400).json({ message: "Please enter a valid Gmail address." });
    }

    const pdfFileName = path.basename(certificate.pdfUrl);
    const pdfPath = path.join(certificatesDir, pdfFileName);
    if (!fs.existsSync(pdfPath)) {
      return res.status(404).json({ message: "Certificate PDF file not found." });
    }

    const verifyBaseUrl = process.env.VERIFY_BASE_URL || "http://localhost:5173";
    const verifyUrl = `${verifyBaseUrl.replace(/\/$/, "")}/verify/${certificate.certificateId}`;

    const transporter = getTransporter();
    const fromEmail = process.env.EMAIL_USER;

    await transporter.sendMail({
      from: `"Certificate System" <${fromEmail}>`,
      to: normalizedRecipient,
      subject: "Your Certificate",
      html: buildCertificateEmailHtml({
        recipientEmail: normalizedRecipient,
        name: certificate.name,
        event: certificate.event,
        issueDate: certificate.issueDate,
        certificateId: certificate.certificateId,
        verifyUrl,
      }),
      attachments: [
        {
          filename: `${certificate.certificateId}.pdf`,
          path: pdfPath,
          contentType: "application/pdf",
        },
      ],
    });

    return res.json({ message: `Certificate sent successfully to ${normalizedRecipient}.` });
  } catch (error) {
    return res.status(500).json({ message: "Failed to send certificate email.", error: error.message });
  }
};
