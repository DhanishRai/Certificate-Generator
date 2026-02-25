const path = require("path");
const fs = require("fs");
const express = require("express");
const multer = require("multer");
const authMiddleware = require("../middleware/authMiddleware");
const {
  generateCertificates,
  getCertificates,
  verifyCertificate,
  sendCertificateEmail,
  deleteCertificate,
} = require("../controllers/certificateController");

const router = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
  dest: uploadDir,
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "text/csv" || file.originalname.toLowerCase().endsWith(".csv")) {
      cb(null, true);
    } else {
      cb(new Error("Only CSV files are allowed."));
    }
  },
});

router.post("/generate", authMiddleware, upload.single("file"), generateCertificates);
router.get("/", authMiddleware, getCertificates);
router.post("/send-email", authMiddleware, sendCertificateEmail);
router.delete("/:certificateId", authMiddleware, deleteCertificate);
router.get("/:certificateId", verifyCertificate);

module.exports = router;
