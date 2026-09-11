const path = require("path");
const express = require("express");
const nodemailer = require("nodemailer");

const app = express();
const PORT = process.env.PORT || 4173;
const PUBLIC_DIR = path.join(__dirname, "public");

app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));
app.use(express.urlencoded({ extended: false, limit: "32kb" }));

app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-Frame-Options", "SAMEORIGIN");
  next();
});

app.get("/health", (_req, res) => {
  res.status(200).json({ ok: true });
});

const submissions = [];
const WINDOW_MS = 60 * 1000;
const MAX_PER_WINDOW = 5;

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function clean(value, max) {
  return String(value || "")
    .replace(/[\u0000-\u001F]+/g, " ")
    .trim()
    .slice(0, max);
}

async function sendMail({ name, email, phone, subject, message }) {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!user || !pass) return { sent: false, reason: "smtp-not-configured" };

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from: `"Sitio Johan López" <${user}>`,
    to: process.env.CONTACT_TO || "jltriada8@gmail.com",
    replyTo: email,
    subject: `Consulta web: ${subject}`,
    text: [
      `Nombre: ${name}`,
      `Correo: ${email}`,
      `Teléfono: ${phone || "No indicado"}`,
      `Asunto: ${subject}`,
      "",
      message,
    ].join("\n"),
  });

  return { sent: true };
}

app.post("/api/contact", async (req, res) => {
  const ip = req.ip || "unknown";
  const now = Date.now();
  submissions.push({ ip, now });
  while (submissions.length && now - submissions[0].now > WINDOW_MS) {
    submissions.shift();
  }
  if (submissions.filter((item) => item.ip === ip).length > MAX_PER_WINDOW) {
    return res.status(429).json({
      ok: false,
      error: "Hay demasiados envíos seguidos. Intenta de nuevo en un minuto o escríbeme por WhatsApp.",
    });
  }

  const name = clean(req.body.name, 80);
  const email = clean(req.body.email, 120);
  const phone = clean(req.body.phone, 30);
  const subject = clean(req.body.subject, 120);
  const message = clean(req.body.message, 2000);

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ ok: false, error: "Completa los campos obligatorios." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ ok: false, error: "El correo no parece válido." });
  }

  try {
    const result = await sendMail({ name, email, phone, subject, message });
    return res.json({
      ok: true,
      emailed: result.sent,
      message: result.sent
        ? "Mensaje enviado. Te responderé a la brevedad."
        : "Recibí tu mensaje. Si prefieres una respuesta inmediata, también puedes escribirme por WhatsApp.",
    });
  } catch (error) {
    console.error("Contact form error:", error.message);
    return res.status(500).json({
      ok: false,
      error: "No pude enviar el correo en este momento. Escríbeme por WhatsApp y te atiendo ahí.",
    });
  }
});

app.use(express.static(PUBLIC_DIR, { extensions: ["html"] }));

app.use((req, res) => {
  res.status(404).sendFile(path.join(PUBLIC_DIR, "404.html"));
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Johan López — sitio listo en http://localhost:${PORT}`);
});
