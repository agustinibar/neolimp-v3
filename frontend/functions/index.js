const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

/** =========================
 * Helpers de normalización
 * ========================= */
function normalize(s) {
  return (s || "")
    .toString()
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, ""); // saca acentos
}

function hasTooMuchGibberish(text) {
  const t = normalize(text);
  if (t.length < 8) return true;

  const noSpaces = t.replace(/\s+/g, "");
  const spaceRatio = t.length ? (t.length - noSpaces.length) / t.length : 0;

  const longNoVowels = /[bcdfghjklmnpqrstvwxyz]{7,}/i.test(t);
  const repeatedChars = /(.)\1{5,}/.test(t);

  if (spaceRatio < 0.03 && (longNoVowels || repeatedChars)) return true;

  const vowels = (t.match(/[aeiou]/g) || []).length;
  if (t.length >= 12 && vowels === 0) return true;

  return false;
}

/** =========================
 * Scoring / Clasificación
 * ========================= */
function scoreLead(data) {
  const nombre = normalize(data.nombre);
  const empresa = normalize(data.empresa);
  const email = normalize(data.email);
  const telefono = normalize(data.telefono);
  const servicio = normalize(data.servicio);
  const mensaje = normalize(data.mensaje);

  let score = 0;
  const reasons = [];

  // Señales positivas
  if (email.includes("@")) score += 2;
  if (telefono.replace(/\D/g, "").length >= 8) score += 2;
  if (servicio && servicio !== "otro") score += 2;
  if (mensaje.length >= 40) score += 2;

  const keywordsPresupuesto = [
    "presupuesto",
    "cotizacion",
    "cotización",
    "precio",
    "valores",
    "cuanto sale",
    "m2",
    "metros",
    "frecuencia",
    "semanal",
    "mensual",
    "diaria",
    "visita",
    "relevamiento",
    "abono",
    "limpieza",
    "oficina",
    "planta",
    "industrial",
    "consorcio",
    "edificio",
    "club",
    "municipio",
  ];

  if (keywordsPresupuesto.some((k) => mensaje.includes(normalize(k)))) {
    score += 3;
  } else {
    reasons.push("sin_keywords_presupuesto");
  }

  // Señales negativas: trabajo
  const keywordsTrabajo = [
    "busco trabajo",
    "buscando trabajo",
    "quiero trabajar",
    "cv",
    "curriculum",
    "currículum",
    "empleo",
    "rrhh",
  ];

  if (keywordsTrabajo.some((k) => mensaje.includes(normalize(k)))) {
    score -= 10;
    reasons.push("keyword_trabajo");
  }

  // Señales negativas: no calificado / pedidos personales
  const keywordsNoCalificado = [
    "dale de comer a mis hijos",
    "donacion",
    "donación",
    "regalame",
    "regálame",
    "necesito plata",
    "urgente ayuda",
  ];

  if (keywordsNoCalificado.some((k) => mensaje.includes(normalize(k)))) {
    score -= 6;
    reasons.push("no_calificado");
  }

  // Señales negativas: texto basura
  if (hasTooMuchGibberish(mensaje)) {
    score -= 5;
    reasons.push("gibberish");
  }

  // Datos raros
  if (nombre && nombre.length < 4) {
    score -= 1;
    reasons.push("nombre_muy_corto");
  }
  if (empresa && empresa.length > 0 && empresa.length < 3) {
    score -= 1;
    reasons.push("empresa_muy_corta");
  }

  // Resultado final
  let status = "lead_valido";
  if (score <= -3) status = "spam_o_trabajo";
  else if (score < 3) status = "sospechoso";
  else status = "lead_valido";

  return { status, score, reasons };
}

/** =========================
 * Email transporter (Gmail)
 * Lee credenciales desde:
 * firebase functions:config:set gmail.user="..." gmail.pass="..."
 * ========================= */
function getTransporter() {
  const user = functions.config().gmail?.user;
  const pass = functions.config().gmail?.pass;

  if (!user || !pass) {
    throw new Error("Faltan credenciales: gmail.user / gmail.pass (functions config).");
  }

  return nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });
}

/** =========================
 * 1) Trigger principal: clasifica al crear
 * ========================= */
exports.clasificarContactMessage = functions.firestore
  .document("contactMessages/{docId}")
  .onCreate(async (snap, context) => {
    const data = snap.data() || {};
    const { status, score, reasons } = scoreLead(data);

    await snap.ref.update({
      status,
      score,
      reasons,
      processedAt: admin.firestore.FieldValue.serverTimestamp(),
      notifiedAt: null, // clave para que la 2da function controle duplicados
    });

    console.log("Clasificado:", context.params.docId, { status, score, reasons });
    return null;
  });

/** =========================
 * 2) Trigger: cuando cambia a lead_valido => manda email
 * ========================= */
exports.notificarLeadValidoPorEmail = functions.firestore
  .document("contactMessages/{docId}")
  .onUpdate(async (change, context) => {
    const before = change.before.data() || {};
    const after = change.after.data() || {};

    // Solo si cambió status
    if (before.status === after.status) return null;

    // Solo si ahora es lead válido
    if (after.status !== "lead_valido") return null;

    // Evitar duplicados
    if (after.notifiedAt) return null;

    const transporter = getTransporter();

    const to = "agustinibarperrotta@gmail.com"; //cambiar luego de pruebas
    const fromUser = functions.config().gmail.user; // serviciosneolimp@gmail.com

    const subject = `Nuevo pedido de presupuesto – ${after.servicio || "Sin servicio"}`;

    const text = `
Nuevo lead válido desde la web de Neolimp:

Nombre: ${after.nombre || "-"}
Empresa: ${after.empresa || "-"}
Email: ${after.email || "-"}
Teléfono: ${after.telefono || "-"}
Servicio: ${after.servicio || "-"}
Origen: ${after.origen || "-"}

Mensaje:
${after.mensaje || ""}

ID: ${context.params.docId}
Fecha: ${new Date().toLocaleString("es-AR")}
`.trim();

    await transporter.sendMail({
      from: `"Web Neolimp" <${fromUser}>`,
      to,
      subject,
      text,
    });

    await change.after.ref.update({
      notifiedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log("Email enviado OK:", context.params.docId);
    return null;
  });
