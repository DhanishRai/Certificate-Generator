# Online Certificate Generation and Verification System (MERN)

## Tech Stack
- Frontend: React + Vite + Tailwind CSS
- Backend: Node.js + Express.js
- Database: MongoDB + Mongoose
- Auth: JWT (Admin login)
- PDF: pdfkit
- QR Code: qrcode

## Project Structure

```text
backend/
  server.js
  models/
  routes/
  controllers/
  middleware/
  utils/
  certificates/
frontend/
  src/
    pages/
    components/
    services/
sample-participants.csv
```

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

## Default Admin
Configured from `backend/.env`:

- `ADMIN_EMAIL=admin@example.com`
- `ADMIN_PASSWORD=admin123`

Default admin is auto-created on server startup if it doesn't exist.

## API Endpoints

### Auth
- `POST /api/auth/login`

### Certificates
- `POST /api/certificates/generate` (Admin token required)
  - form-data key: `file` (CSV)
- `GET /api/certificates` (Admin token required)
- `GET /api/certificates/:certificateId` (Public verification)

## CSV Format
Use `sample-participants.csv` as reference:

```csv
name,event,date
John Doe,AI Conference 2026,2026-02-20
```

## Verification Flow
- PDF includes QR code with URL format:
  - `VERIFY_BASE_URL/verify/{certificateId}`
- Scanning QR opens public verification page and shows:
  - Name, Event, Date, Status (`VALID` or `INVALID`)

## Notes
- Certificate PDFs are saved under `backend/certificates`.
- `pdfUrl` is persisted in MongoDB.
- Set production origins using `CLIENT_URL` in backend `.env` (comma-separated).
