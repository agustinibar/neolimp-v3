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
 * Resend (Email por HTTP API)
 * ========================= */
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

function assertResend() {
  if (!resend) throw new Error("RESEND_API_KEY no configurada");
  const from = process.env.FROM_EMAIL;
  if (!from) throw new Error("FROM_EMAIL no configurada (remitente requerido por Resend)");
}

/* =========================
 * Helpers de clasificación
 * ========================= */
function normalize(s) {
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasTooMuchGibberish(text) {
  const t = normalize(text);
  if (t.length < 8) return true;

  const noSpaces = t.replace(/\s+/g, "");
  const spaceRatio = t.length ? (t.length - noSpaces.length) / t.length : 0;
  const longNoVowels = /[bcdfghjklmnpqrstvwxyz]{7,}/i.test(t);
  const repeatedChars = /(.)\1{5,}/.test(t);
  const vowels = (t.match(/[aeiou]/g) || []).length;

  if (spaceRatio < 0.03 && (longNoVowels || repeatedChars)) return true;
  if (t.length >= 12 && vowels === 0) return true;
  return false;
}

function scoreLead(payload) {
  const nombre = normalize(payload.nombre);
  const empresa = normalize(payload.empresa);
  const email = normalize(payload.email);
  const telefono = normalize(payload.telefono);
  const servicio = normalize(payload.servicio);
  const mensaje = normalize(payload.mensaje);

  let score = 0;
  const reasons = [];

  if (email.includes("@")) score += 2;
  if (telefono.replace(/\D/g, "").length >= 8) score += 2;
  if (servicio && servicio !== "otro") score += 2;
  if (mensaje.length >= 40) score += 2;

  const keywordsPresupuesto = [
    "presupuesto", "cotizacion", "precio", "cuanto", "m2", "metros", "frecuencia",
    "semanal", "mensual", "diaria", "visita", "relevamiento", "abono",
    "limpieza", "oficina", "industrial", "planta", "consorcio", "edificio", "club", "municipio",
  ];

  if (keywordsPresupuesto.some((k) => mensaje.includes(k))) score += 3;
  else reasons.push("sin_keywords_presupuesto");

  const keywordsTrabajo = ["busco trabajo", "quiero trabajar", "cv", "curriculum", "empleo", "rrhh", "postular"];
  if (keywordsTrabajo.some((k) => mensaje.includes(k))) {
    score -= 10;
    reasons.push("keyword_trabajo");
  }

  if (hasTooMuchGibberish(mensaje)) {
    score -= 5;
    reasons.push("gibberish");
  }

  let status = "lead_valido";
  if (score <= -3) status = "spam_o_trabajo";
  else if (score < 3) status = "sospechoso";

  // Opcional: si querés ver por qué quedó válido, podés guardar reasons vacíos.
  return { status, score, reasons };
}

/* =========================
 * Email con Resend
 * ========================= */
async function sendLeadEmail({ payload, docId }) {
  assertResend();

  const to = process.env.EMAIL_TO || "agustinibarperrotta@gmail.com";
  const from = process.env.FROM_EMAIL; // EJ: "Web Neolimp <contacto@tu-dominio.com>"
  const replyTo = process.env.REPLY_TO || payload.email; // si no seteás REPLY_TO, responde al email del lead

  const subject = `Nuevo pedido de presupuesto – ${payload.servicio || "Sin servicio"}`;

  const text = `
Nuevo lead válido desde la web:

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

  // Resend permite "reply_to" en headers
  return resend.emails.send({
    from,
    to,
    subject,
    text,
    reply_to: replyTo,
  });
}

/* =========================
 * Endpoint principal
 * ========================= */
app.post("/contact", async (req, res) => {
  try {
    const {
      nombre,
      empresa,
      email,
      telefono,
      servicio,
      mensaje,
      origen,
      website, // honeypot
    } = req.body || {};

    if (!nombre || !email || !telefono || !mensaje) {
      return res.status(400).json({ ok: false, error: "Campos obligatorios faltantes" });
    }

    if (website && String(website).trim().length > 0) {
      return res.status(200).json({ ok: true, status: "spam_o_trabajo", skipped: true });
    }

    const payload = {
      nombre,
      empresa: empresa || "",
      email,
      telefono,
      servicio: servicio || "",
      mensaje,
      origen: origen || "web-neolimp-contacto",
      createdAt: new Date().toISOString(),
    };

    const { status, score, reasons } = scoreLead(payload);

    let docId = null;

    if (firestoreEnabled) {
      const ref = await admin.firestore().collection("contactMessages").add({
        ...payload,
        status,
        score,
        reasons,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        notifiedAt: null,
      });
      docId = ref.id;
    }

    if (status === "lead_valido") {
      try {
        await sendLeadEmail({ payload, docId });

        if (firestoreEnabled && docId) {
          await admin.firestore().collection("contactMessages").doc(docId).update({
            notifiedAt: admin.firestore.FieldValue.serverTimestamp(),
            // limpiar errores anteriores si existían
            emailError: admin.firestore.FieldValue.delete(),
            emailFailedAt: admin.firestore.FieldValue.delete(),
          });
        }
      } catch (mailErr) {
        console.error("❌ Error enviando email (Resend):", mailErr);

        if (firestoreEnabled && docId) {
          await admin.firestore().collection("contactMessages").doc(docId).update({
            emailError: String(mailErr?.message || mailErr),
            emailFailedAt: admin.firestore.FieldValue.serverTimestamp(),
          });
        }
      }
    }

    return res.status(200).json({
      ok: true,
      status,
      score,
      reasons,
      docId,
    });
  } catch (err) {
    console.error("❌ Error /contact:", err);
    return res.status(500).json({ ok: false, error: "Error interno" });
  }
});

/* =========================
 * Healthcheck
 * ========================= */
app.get("/health", (_, res) => res.json({ ok: true }));

/* =========================
 * Test email (opcional)
 * =========================
 * Útil para validar Resend en Render:
 * GET /email-test
 */
app.get("/email-test", async (req, res) => {
  try {
    await sendLeadEmail({
      payload: {
        nombre: "Test",
        empresa: "Test",
        email: "test@example.com",
        telefono: "000",
        servicio: "oficinas",
        mensaje: "Test email desde Render",
        origen: "test",
      },
      docId: "TEST",
    });
    return res.json({ ok: true });
  } catch (e) {
    console.error("❌ /email-test error:", e);
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`🚀 Backend Neolimp escuchando en puerto ${port}`));
