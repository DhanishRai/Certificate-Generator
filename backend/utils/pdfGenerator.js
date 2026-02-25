const fs = require("fs");
const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");

function drawRibbonCorners(doc, pageWidth, pageHeight) {
  const blue = "#1f3b63";
  const yellow = "#e6b325";

  doc.save();
  doc.rect(0, 0, pageWidth, pageHeight).fill("#f5f5f5");
  doc.restore();

  // Top ribbons
  doc.save();
  doc
    .polygon([0, 0], [250, 0], [310, 36], [0, 36])
    .fill(yellow);
  doc
    .polygon([90, 0], [500, 0], [560, 36], [150, 36])
    .fill(blue);
  doc
    .polygon([520, 0], [595, 0], [595, 330], [535, 272], [595, 206], [595, 66])
    .fill(yellow);
  doc
    .polygon([470, 0], [560, 0], [595, 35], [595, 240], [470, 120])
    .fill(blue);
  doc.restore();

  // Bottom ribbons
  doc.save();
  doc
    .polygon([0, pageHeight], [220, pageHeight], [280, pageHeight - 36], [0, pageHeight - 36])
    .fill(blue);
  doc
    .polygon([0, pageHeight - 115], [70, pageHeight - 45], [130, pageHeight], [0, pageHeight])
    .fill(yellow);
  doc
    .polygon([300, pageHeight], [pageWidth, pageHeight], [pageWidth, pageHeight - 36], [360, pageHeight - 36])
    .fill(blue);
  doc
    .polygon([470, pageHeight], [pageWidth, pageHeight], [pageWidth, pageHeight - 80], [530, pageHeight - 36])
    .fill(yellow);
  doc.restore();
}

function drawDecorativeWaves(doc) {
  doc.save();
  doc.lineWidth(0.7).strokeOpacity(0.22).stroke("#9ca3af");
  for (let i = 0; i < 11; i += 1) {
    const shift = i * 6;
    doc
      .moveTo(0, 118 + shift)
      .bezierCurveTo(60, 96 + shift, 108, 150 + shift, 168, 126 + shift)
      .stroke();
  }

  for (let i = 0; i < 8; i += 1) {
    const shift = i * 6;
    doc
      .moveTo(555 + shift, 518)
      .bezierCurveTo(530 + shift, 566, 555 + shift, 618, 595 + shift, 670)
      .stroke();
  }
  doc.restore();
}

function drawMedal(doc, centerX, centerY) {
  doc.save();

  // Outer petals
  doc.fillColor("#e6b325");
  const petalCount = 18;
  for (let i = 0; i < petalCount; i += 1) {
    const angle = (Math.PI * 2 * i) / petalCount;
    const x = centerX + Math.cos(angle) * 47;
    const y = centerY + Math.sin(angle) * 47;
    doc.circle(x, y, 8).fill();
  }

  doc.circle(centerX, centerY, 44).fill("#f2cd44");
  doc.circle(centerX, centerY, 36).fill("#fff5cc");
  doc.circle(centerX, centerY, 30).fill("#f2cd44");

  // Medal ribbons
  doc
    .polygon(
      [centerX - 28, centerY + 34],
      [centerX - 7, centerY + 34],
      [centerX - 24, centerY + 112],
      [centerX - 42, centerY + 96]
    )
    .fill("#f2cd44");
  doc
    .polygon(
      [centerX + 7, centerY + 34],
      [centerX + 28, centerY + 34],
      [centerX + 42, centerY + 96],
      [centerX + 24, centerY + 112]
    )
    .fill("#e6b325");

  doc.restore();
}

function getTemplateConfig(pageWidth, pageHeight) {
  return {
    titleY: 145,
    subtitleY: 290,
    nameY: 350,
    dividerY: 435,
    detailsY: 456,
    qrX: pageWidth - 186,
    qrY: pageHeight - 192,
    qrLabelX: pageWidth - 190,
    certIdY: pageHeight - 80,
    medalY: 635,
  };
}

function drawCertificateText(doc, { certificateId, name, event, issueDate, qrImageBuffer, layout, pageWidth }) {
  const nameText = name.length > 24 ? 44 : 54;

  doc.font("Times-Bold").fontSize(58).fillColor("#0f172a").text("Certificate of Achievement", 0, layout.titleY, {
    width: pageWidth,
    align: "center",
  });
  doc
    .font("Helvetica-Bold")
    .fontSize(21)
    .fillColor("#111827")
    .text("This certificate is proudly awarded to", 0, layout.subtitleY, { width: pageWidth, align: "center" });
  doc
    .font("Times-BoldItalic")
    .fontSize(nameText)
    .fillColor("#111827")
    .text(name, 0, layout.nameY, { width: pageWidth, align: "center" });
  doc.moveTo(145, layout.dividerY).lineTo(pageWidth - 145, layout.dividerY).lineWidth(1.3).strokeColor("#111827").stroke();

  doc
    .font("Helvetica-Oblique")
    .fontSize(19)
    .fillColor("#1f2937")
    .text(
      `For outstanding participation in ${event} on ${new Date(issueDate).toLocaleDateString()}.`,
      78,
      layout.detailsY,
      { width: pageWidth - 156, align: "center" }
    );

  drawMedal(doc, pageWidth / 2, layout.medalY);

  // White padding improves scanner contrast on printed and digital copies.
  doc.save();
  doc.roundedRect(layout.qrX - 8, layout.qrY - 8, 118, 118, 10).fill("#ffffff");
  doc.restore();

  doc.image(qrImageBuffer, layout.qrX, layout.qrY, {
    fit: [102, 102],
    align: "center",
    valign: "center",
  });

  doc
    .font("Helvetica")
    .fontSize(9)
    .fillColor("#374151")
    .text("Scan to verify", layout.qrLabelX, layout.qrY + 106, { width: 118, align: "center" });

  doc
    .font("Helvetica")
    .fontSize(10)
    .fillColor("#4b5563")
    .text(`Certificate ID: ${certificateId}`, 50, layout.certIdY, { width: 320, align: "left" });
}

exports.generateCertificatePdf = async ({
  outputPath,
  certificateId,
  name,
  event,
  issueDate,
  verificationUrl,
  templateType = "classic",
}) => {
  const issueDateLabel = new Date(issueDate).toLocaleDateString();
  const qrPayload = [
    "Certificate Verification",
    `ID: ${certificateId}`,
    `Name: ${name}`,
    `Event: ${event}`,
    `Date: ${issueDateLabel}`,
    `Verify: ${verificationUrl}`,
  ].join("\n");

  const qrDataUrl = await QRCode.toDataURL(qrPayload, {
    width: 280,
    margin: 2,
    errorCorrectionLevel: "H",
    color: { dark: "#000000", light: "#FFFFFF" },
  });
  const qrImageBuffer = Buffer.from(qrDataUrl.split(",")[1], "base64");

  await new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    const stream = fs.createWriteStream(outputPath);
    const pageWidth = doc.page.width;
    const pageHeight = doc.page.height;
    const layout = getTemplateConfig(pageWidth, pageHeight);

    doc.pipe(stream);
    drawRibbonCorners(doc, pageWidth, pageHeight);
    drawDecorativeWaves(doc);

    drawCertificateText(doc, {
      certificateId,
      name,
      event,
      issueDate,
      qrImageBuffer,
      layout,
      pageWidth,
    });

    doc.end();
    stream.on("finish", resolve);
    stream.on("error", reject);
  });
};
