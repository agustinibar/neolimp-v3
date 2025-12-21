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
 * Firebase Admin (Firestore) - opcional
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

/* =========================
 * Helpers: normalización + validaciones
 * ========================= */
function normalize(s) {
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function isValidEmail(email) {
  const e = (email || "").trim();
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e);
}

function onlyDigitsLen(s) {
  const d = String(s || "").replace(/\D/g, "");
  return d.length;
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

function containsAny(text, list) {
  return list.some((k) => text.includes(k));
}

function countMatches(text, list) {
  let c = 0;
  for (const k of list) if (text.includes(k)) c++;
  return c;
}

function hasSuspiciousUrl(mensajeRaw) {
  const raw = (mensajeRaw || "").toString();
  const urlCount = (raw.match(/https?:\/\/|www\./gi) || []).length;
  const shortener = /(bit\.ly|t\.co|tinyurl\.com|cutt\.ly|rebrand\.ly)/i.test(raw);
  return urlCount >= 1 || shortener;
}

function looksLikeTemplateOrBot(m) {
  // mensajes demasiado genéricos o repetitivos (anti-bots básico)
  const t = normalize(m);
  if (t.length < 15) return true;
  if (/(hola{3,}|aaaa+|bbbb+|cccc+|test|asdf|qwer)/.test(t)) return true;
  return false;
}

/* =========================
 * Keywords / Reglas
 * ========================= */

// Intención comercial fuerte
const KW_INTENCION = [
  "presupuesto",
  "cotizacion",
  "cotización",
  "cotizar",
  "precio",
  "tarifa",
  "valor",
  "cuanto",
  "cuánto",
  "costo",
  "coste",
  "contratar",
  "contratacion",
  "contratación",
  "abono",
  "propuesta",
  "relevamiento",
  "visita",
  "plan",
  "factura",
  "m2",
  "m²",
  "metros",
  "frecuencia",
  "semanal",
  "mensual",
  "diaria",
  "limpieza",
  "oficina",
  "industrial",
  "planta",
  "consorcio",
  "edificio",
  "club",
  "municipio",
  "turno",
  "horario",
  "disponibilidad",
];

// Detalle operativo (lo que suele tener un lead real)
const KW_DETALLE = [
  "m2",
  "m²",
  "metros",
  "metro",
  "metros cuadrados",
  "frecuencia",
  "semanal",
  "mensual",
  "diaria",
  "oficina",
  "planta",
  "industrial",
  "consorcio",
  "edificio",
  "club",
  "municipio",
  "cantidad",
  "horario",
  "zona",
  "caba",
  "gba",
  "campana",
  "zarate",
  "zárate",
  "quilmes",
  "la plata",
  "san isidro",
  "tigre",
];

// Trabajo / RRHH (ampliado)
const KW_TRABAJO = [
  "busco trabajo",
  "buscar trabajo",
  "buscando trabajo",
  "busco empleo",
  "buscando empleo",
  "estoy buscando trabajo",
  "estoy buscando empleo",
  "quiero trabajar",
  "quisiera trabajar",
  "me gustaria trabajar",
  "me gustaría trabajar",
  "laburo",
  "empleo",
  "trabajo",
  "rrhh",
  "recursos humanos",
  "postular",
  "postulacion",
  "postulación",
  "postularme",
  "vacante",
  "vacantes",
  "cv",
  "curriculum",
  "currículum",
  "curriculum vitae",
  "currículum vitae",
  "hoja de vida",
  "resumen",
  "experiencia laboral",
  "referencias",
  "entrevista",
  "adjunto",
  "adjuntar",
  "adjunte",
  "adjunté",
  "enviar cv",
  "dejo mi cv",
  "te dejo mi cv",
  "les dejo mi cv",
  "dejar mi cv",
  "operario",
  "maestranza",
  "limpiador",
  "limpiadora",
  "personal de limpieza",
  "turnos rotativos",
  "disponibilidad horaria",
];

// Spam / promociones típicas (ampliado)
const KW_SPAM = [
  "seo",
  "posicionamiento",
  "marketing",
  "publicidad",
  "ads",
  "google ads",
  "meta ads",
  "facebook ads",
  "followers",
  "seguidores",
  "cript",
  "crypto",
  "bitcoin",
  "inversion",
  "inversión",
  "prestamo",
  "préstamo",
  "casino",
  "apuestas",
  "xxx",
  "viagra",
  "adult",
  "onlyfans",
  "telegram",
  "whatsapp marketing",
];

/**
 * Detector fuerte de intención laboral:
 * - Regex + keywords
 * - “Hard block”: si detecta trabajo => JAMÁS puede ser consulta_real
 */
function isJobIntent(mensajeNormalized, mensajeRaw) {
  const m = mensajeNormalized;
  const raw = (mensajeRaw || "").toString();

  const jobRegexes = [
    /\b(busco|buscando|buscar)\s+(trabajo|laburo|empleo)\b/,
    /\b(quiero|quisiera|me\s+gustaria|me\s+gustaría)\s+trabajar\b/,
    /\b(postul(ar|acion|ación)|postularme|vacante|rrhh|recursos\s+humanos)\b/,
    /\b(cv|curriculum|currículum|curriculum\s+vitae|currículum\s+vitae|hoja\s+de\s+vida)\b/,
    /\b(adjunt(o|ar|e|é)|enviar)\s+(cv|curriculum|currículum)\b/,
    /\b(experiencia\s+laboral|referencias|disponibilidad\s+horaria|turnos\s+rotativos)\b/,
  ];

  if (jobRegexes.some((r) => r.test(m))) return true;
  if (containsAny(m, KW_TRABAJO)) return true;

  // Si menciona CV + archivo/formatos o “pdf/doc” es casi seguro trabajo
  const mentionsFile = /\b(pdf|docx?|curriculum|currículum)\b/i.test(raw);
  if (/\b(cv)\b/.test(m) && mentionsFile) return true;

  return false;
}

/**
 * Score de “lead real” muy exigente.
 * Condición final: intención + detalle/servicio + score >= umbral,
 * Y NO tener ninguna señal de trabajo/spam.
 */
function classifyMessage(payload) {
  const nombre = normalize(payload.nombre);
  const empresa = normalize(payload.empresa);
  const email = (payload.email || "").trim();
  const telefono = (payload.telefono || "").trim();
  const servicio = normalize(payload.servicio);
  const mensajeRaw = (payload.mensaje || "").toString();
  const mensaje = normalize(mensajeRaw);

  const reasons = [];
  let score = 0;

  // Hard gates mínimos
  if (!isValidEmail(email)) return { status: "spam", score: -100, reasons: ["email_invalido"] };
  if (onlyDigitsLen(telefono) < 8) return { status: "spam", score: -90, reasons: ["telefono_invalido"] };
  if (mensaje.length < 20) return { status: "spam", score: -80, reasons: ["mensaje_muy_corto"] };
  if (hasTooMuchGibberish(mensaje)) return { status: "spam", score: -70, reasons: ["gibberish"] };

  // HARD BLOCK: trabajo
  if (isJobIntent(mensaje, mensajeRaw)) {
    return { status: "busca_trabajo", score: -100, reasons: ["job_intent"] };
  }

  // HARD BLOCK: spam (links + keywords)
  const spamHits = countMatches(mensaje, KW_SPAM);
  if (spamHits >= 2) return { status: "spam", score: -90, reasons: ["spam_keywords"] };

  const suspiciousUrl = hasSuspiciousUrl(mensajeRaw);
  if (suspiciousUrl && mensaje.length < 120) {
    return { status: "spam", score: -80, reasons: ["url_sospechosa"] };
  }

  // Bots / plantillas
  if (looksLikeTemplateOrBot(mensaje)) {
    // No lo marco como spam directo si no hay señal clara, pero lo freno
    return { status: "sospechoso", score: 0, reasons: ["parece_bot_template"] };
  }

  // Scoring estricto
  const intentHits = countMatches(mensaje, KW_INTENCION);
  const detailHits = countMatches(mensaje, KW_DETALLE);

  // Intención
  if (intentHits >= 3) score += 50;
  else if (intentHits === 2) score += 35;
  else if (intentHits === 1) score += 20;
  else reasons.push("sin_intencion_clara");

  // Detalle
  if (detailHits >= 3) score += 30;
  else if (detailHits === 2) score += 20;
  else if (detailHits === 1) score += 10;
  else reasons.push("sin_detalle_operativo");

  // servicio elegido suma, pero NO define solo
  if (servicio && servicio !== "otro") score += 10;
  else reasons.push("servicio_no_especifico");

  // nombre parece humano
  if (nombre.length >= 4 && !/(test|asdf|qwer|aaaa)/.test(nombre)) score += 5;
  else reasons.push("nombre_sospechoso");

  // empresa ayuda
  if (empresa && empresa.length >= 2) score += 5;

  // mensaje con contenido real
  if (mensaje.length >= 60) score += 10;
  if (mensaje.length >= 140) score += 5;

  // Penalizaciones por señales flojas (sin marcar spam)
  if (intentHits === 0) score -= 10;
  if (detailHits === 0) score -= 10;

  // Regla FINAL de “consulta_real” (más dura que antes):
  // Debe haber intención (>=1) Y (detalle>=1 O servicio específico) Y score >= 55
  const isConsultaReal =
    intentHits >= 1 &&
    (detailHits >= 1 || (servicio && servicio !== "otro")) &&
    score >= 55;

  if (isConsultaReal) return { status: "consulta_real", score, reasons };

  // si tuvo algo de intención pero no llega, lo dejamos sospechoso
  if (intentHits >= 1) return { status: "sospechoso", score, reasons };

  return { status: "spam", score: Math.min(score, 5), reasons: [...reasons, "sin_intencion"] };
}

/* =========================
 * Email con Resend (robusto + reenvío)
 * ========================= */
async function sendLeadEmail({ payload, docId }) {
  assertResend();

  const infoTo = process.env.INFO_TO || "info@neolimpservicios.com";
  const forwardTo = (process.env.FORWARD_TO || "").trim();
  const bcc = forwardTo ? [forwardTo] : undefined;

  const from = process.env.FROM_EMAIL; // recomendado: "Nombre <info@dominio>"
  const replyTo = process.env.REPLY_TO || payload.email;

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

  const { data, error } = await resend.emails.send({
    from,
    to: infoTo, // string (más simple para debug)
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

    if (!nombre || !email || !telefono || !mensaje) {
      return res.status(400).json({ ok: false, error: "Campos obligatorios faltantes" });
    }

    // Honeypot anti-bots -> SPAM directo
    if (website && String(website).trim().length > 0) {
      return res.status(200).json({ ok: true, status: "spam", discarded: true, skipped: true });
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

    const { status, score, reasons } = classifyMessage(payload);

    // Guardar SIEMPRE (recomendado) para auditar falsos positivos/negativos
    let docId = null;
    if (firestoreEnabled) {
      const ref = await admin.firestore().collection("contactMessages").add({
        ...payload,
        status,
        score,
        reasons,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
        notifiedAt: null,
        mailSent: false,
        mailId: null,
        mailError: null,
        discarded: status !== "consulta_real",
      });
      docId = ref.id;
    }

    // Si NO es consulta real: descartar y NO enviar
    if (status !== "consulta_real") {
      return res.status(200).json({ ok: true, status, score, reasons, docId, discarded: true });
    }

    // Envío por email (solo consulta_real)
    let mailSent = false;
    let mailId = null;

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

      return res.status(500).json({
        ok: false,
        error: "No se pudo enviar el email",
        mailError,
        status,
        score,
        reasons,
        docId,
      });
    }

    return res.status(200).json({
      ok: true,
      status,
      score,
      reasons,
      docId,
      mailSent,
      mailId,
      infoTo: process.env.INFO_TO || "info@neolimpservicios.com",
      forwardTo: (process.env.FORWARD_TO || "").trim() || null,
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

/* =========================
 * Test email
 * ========================= */
app.get("/email-test", async (_, res) => {
  try {
    const payload = {
      nombre: "Test Neolimp",
      empresa: "Test",
      email: "test@example.com",
      telefono: "1133334444",
      servicio: "oficinas",
      mensaje: "Quiero presupuesto para limpieza semanal de oficinas 300m2 en CABA. Necesito relevamiento. Gracias.",
      origen: "test",
    };

    const data = await sendLeadEmail({ payload, docId: "TEST" });
    return res.json({ ok: true, mailId: data.id });
  } catch (e) {
    console.error("❌ /email-test error:", e);
    return res.status(500).json({ ok: false, error: String(e?.message || e) });
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`🚀 Backend Neolimp escuchando en puerto ${port}`));
