require("dotenv").config();

const express = require("express");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const admin = require("firebase-admin");
const { Resend } = require("resend");

const app = express();

/* =========================
 * Middleware base
 * ========================= */
app.use(express.json({ limit: "200kb" }));

app.use(
  cors({
    origin: "*",
    methods: ["POST", "GET"],
  })
);

app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

/* =========================
 * Firebase Admin (Firestore)
 * ========================= */
let firestoreEnabled = false;

if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  console.warn("⚠️  FIREBASE_SERVICE_ACCOUNT_JSON no configurado. Firestore deshabilitado.");
} else {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);

    if (admin.apps.length === 0) {
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
      });
    }

    firestoreEnabled = true;
    console.log("✅ Firebase Admin inicializado →", serviceAccount.project_id);
  } catch (err) {
    console.error("❌ Error inicializando Firebase Admin:", err);
  }
}

/* =========================
 * Resend
 * ========================= */
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function assertResend() {
  if (!resend) throw new Error("RESEND_API_KEY no configurada");
  const from = process.env.FROM_EMAIL;
  if (!from) throw new Error("FROM_EMAIL no configurada");
}

async function sendLeadEmail({ payload, docId }) {
  assertResend();

  const infoTo = process.env.INFO_TO || "info@neolimpservicios.com";
  const forwardTo = (process.env.FORWARD_TO || "").trim();
  const bcc = forwardTo ? [forwardTo] : undefined;

  const from = process.env.FROM_EMAIL; // "Neolimp <info@...>"
  const replyTo = process.env.REPLY_TO || payload.email;

  const subject = `Nuevo contacto web – ${payload.servicio || "Sin servicio"}`;

  const text = `
Nuevo mensaje desde la web:

Nombre: ${payload.nombre}
Empresa: ${payload.empresa || "-"}
Email: ${payload.email}
Teléfono: ${payload.telefono}
Servicio: ${payload.servicio || "-"}
Origen: ${payload.origen}

Mensaje:
${payload.mensaje}

ID: ${docId || "-"}
Fecha: ${new Date().toLocaleString("es-AR")}
`.trim();

  const { data, error } = await resend.emails.send({
    from,
    to: infoTo,
    bcc,
    subject,
    text,
    replyTo,
  });

  if (error) throw new Error(`Resend error: ${error.message || JSON.stringify(error)}`);
  if (!data?.id) throw new Error(`Resend no devolvió id. Respuesta: ${JSON.stringify(data)}`);
  return data;
}

/* =========================
 * Endpoint principal
 * ========================= */
app.post("/contact", async (req, res) => {
  try {
    const { nombre, empresa, email, telefono, servicio, mensaje, origen, website } = req.body || {};

    // mínimos (solo para evitar basura vacía)
    if (!nombre || !email || !telefono || !mensaje) {
      return res.status(400).json({ ok: false, error: "Campos obligatorios faltantes" });
    }

    // Honeypot anti-bots (si viene completo => descartamos sin guardar ni enviar)
    if (website && String(website).trim().length > 0) {
      return res.status(200).json({ ok: true, skipped: true });
    }

    const payload = {
      nombre: String(nombre).trim(),
      empresa: String(empresa || "").trim(),
      email: String(email).trim(),
      telefono: String(telefono).trim(),
      servicio: String(servicio || "").trim(),
      mensaje: String(mensaje || "").trim(),
      origen: String(origen || "web-neolimp-contacto").trim(),
      createdAt: new Date().toISOString(),
    };

    let docId = null;

    if (firestoreEnabled) {
      const ref = await admin.firestore().collection("contactMessages").add({
        ...payload,
        status: null, // <-- status lo manejará el usuario desde el dashboard
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        notifiedAt: null,
        mailSent: false,
        mailId: null,
        mailError: null,
      });
      docId = ref.id;
    }

    // Enviar email (si Resend está configurado)
    let mailSent = false;
    let mailId = null;

    if (resend) {
      try {
        const data = await sendLeadEmail({ payload, docId });
        mailSent = true;
        mailId = data.id;

        if (firestoreEnabled && docId) {
          await admin.firestore().collection("contactMessages").doc(docId).update({
            notifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            mailSent: true,
            mailId,
            mailError: admin.firestore.FieldValue.delete(),
          });
        }
      } catch (mailErr) {
        const mailError = String(mailErr?.message || mailErr);
        console.error("❌ Error enviando email (Resend):", mailError);

        if (firestoreEnabled && docId) {
          await admin.firestore().collection("contactMessages").doc(docId).update({
            mailSent: false,
            mailId: null,
            mailError,
            emailFailedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }

        // devolvemos 200 pero informamos fallo de email (así el front no muestra error al usuario final)
        return res.status(200).json({ ok: true, docId, mailSent: false, mailError });
      }
    }

    return res.status(200).json({
      ok: true,
      docId,
      mailSent,
      mailId,
    });
  } catch (err) {
    console.error("❌ Error /contact:", err);
    return res.status(500).json({ ok: false, error: String(err?.message || err) });
  }
});

/* =========================
 * Healthcheck
 * ========================= */
app.get("/health", (_, res) => res.json({ ok: true }));

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`🚀 Backend Neolimp escuchando en puerto ${port}`));