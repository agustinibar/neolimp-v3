'use client';

import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { MapPin, Phone, Mail, Clock, Instagram } from 'lucide-react';
import { db } from '@/firebase/config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const INSTAGRAM_USERNAME = 'neolimp_srl';

const INSTAGRAM_POSTS = [
  'https://www.instagram.com/p/DOEISH8jSWT/',
  'https://www.instagram.com/p/DJcM40auHL7/',
  'https://www.instagram.com/p/DGDlTzyOlJb/',
  'https://www.instagram.com/p/DKPcLVfOxf0/',
];

const toEmbedUrl = (url) => {
  try {
    const u = new URL(url);
    const parts = u.pathname.split('/').filter(Boolean);
    const pIndex = parts.indexOf('p');
    const code = pIndex >= 0 && parts[pIndex + 1] ? parts[pIndex + 1] : '';
    return code ? `https://www.instagram.com/p/${code}/embed` : url;
  } catch {
    return url;
  }
};

const Contact = () => {
  const inViewResult = useInView({ threshold: 0.2 }) || [];
  const ref = Array.isArray(inViewResult) ? inViewResult[0] : null;
  const isInView = Array.isArray(inViewResult) ? inViewResult[1] : false;

  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error'

  // 🔹 Ref al formulario para poder hacer reset sin depender del evento
  const formRef = useRef(null);

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Dirección',
      content: 'Lavalle 463, Campana, Buenos Aires, Argentina',
      color: 'from-blue-500 to-blue-700',
    },
    {
      icon: Phone,
      title: 'Teléfono',
      content: '+54 9 11 2465-0609',
      color: 'from-green-500 to-green-700',
    },
    {
      icon: Mail,
      title: 'Email',
      content: 'neolimpsrl@gmail.com',
      color: 'from-blue-600 to-green-600',
    },
    {
      icon: Clock,
      title: 'Horario',
      content: 'Lun - Vie: 8:00 - 18:00 | Sáb: 9:00 - 13:00',
      color: 'from-green-600 to-blue-600',
    },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setStatus(null);

    const formEl = formRef.current;
    const formData = new FormData(formEl || e.currentTarget);

    const payload = {
      nombre: formData.get('nombre'),
      empresa: formData.get('empresa'),
      email: formData.get('email'),
      telefono: formData.get('telefono'),
      servicio: formData.get('servicio'),
      mensaje: formData.get('mensaje'),
      origen: 'web-neolimp-contacto',
      createdAt: serverTimestamp(),
    };

    let success = false;

    try {
      const docRef = await addDoc(collection(db, 'contactMessages'), payload);
      console.log('Mensaje guardado OK con id:', docRef?.id);
      success = true;
    } catch (error) {
      console.error('Error guardando mensaje en Firebase:', error);
      success = false;
    } finally {
      setIsSending(false);

      if (success) {
        // Intentamos resetear el form, pero si falla no marcamos error
        if (formEl && typeof formEl.reset === 'function') {
          try {
            formEl.reset();
          } catch (err) {
            console.warn('No se pudo resetear el formulario:', err);
          }
        }
        setStatus('success');
      } else {
        setStatus('error');
      }
    }
  };

  return (
    <section
      id="contacto"
      ref={ref}
      className="py-20 bg-gradient-to-br from-blue-50 via-white to-green-50"
    >
      <div className="container mx-auto px-4">
        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
            <span className="bg-gradient-to-r from-blue-700 to-green-600 bg-clip-text text-transparent">
              Contactanos
            </span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Respondemos normalmente en menos de 24 horas hábiles.
          </p>
        </motion.div>

        {/* FORMULARIO ARRIBA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6 }}
          className="bg-white shadow-xl rounded-2xl p-10 mb-16 hover:shadow-2xl transition-all"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Solicitar presupuesto
          </h3>
          <p className="text-gray-600 mb-6">
            Completá tus datos y un asesor te contactará a la brevedad.
          </p>

          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="space-y-5 max-w-3xl mx-auto"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="nombre"
                  placeholder="Nombre y apellido"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                />
              </div>
              <div>
                <input
                  type="text"
                  name="empresa"
                  placeholder="Empresa"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 outline-none"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="telefono"
                  placeholder="Teléfono / WhatsApp"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <select
                name="servicio"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-blue-600 outline-none"
                defaultValue=""
              >
                <option value="" disabled>
                  Seleccioná el tipo de servicio
                </option>
                <option value="oficinas">Limpieza de oficinas</option>
                <option value="industrial">Limpieza industrial / plantas</option>
                <option value="consorcios">Consorcios y edificios</option>
                <option value="clubes">Clubes y espacios deportivos</option>
                <option value="municipios">Municipios / organismos públicos</option>
                <option value="otro">Otro</option>
              </select>
            </div>

            <div>
              <textarea
                name="mensaje"
                rows={4}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm focus:ring-2 focus:ring-green-600 outline-none resize-none"
                placeholder="Contanos tu necesidad (m², frecuencia, tipo de espacio, etc.)"
                required
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <button
                type="submit"
                disabled={isSending}
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gradient-to-r from-blue-800 to-green-500 text-white font-semibold shadow-md hover:shadow-lg hover:translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSending ? 'Enviando...' : 'Enviar consulta'}
              </button>

              {status === 'success' && (
                <p className="text-sm text-green-600">
                  ✅ ¡Mensaje enviado! Te contactaremos a la brevedad.
                </p>
              )}
              {status === 'error' && (
                <p className="text-sm text-red-600">
                  ❌ Ocurrió un error al enviar. Probá nuevamente en unos minutos.
                </p>
              )}
            </div>
          </form>
        </motion.div>

        {/* ABAJO: INFO + MAPA + INSTAGRAM */}
        <div className="grid lg:grid-cols-2 gap-10">
          {/* INFO + MAPA */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-3">
                Información de contacto
              </h3>
              <div className="grid grid-cols-1 gap-5">
                {contactInfo.map((info) => (
                  <div
                    key={info.title}
                    className="flex items-start space-x-4 bg-gray-50 p-4 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <div
                      className={`w-12 h-12 bg-gradient-to-br ${info.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                    >
                      <info.icon className="text-white" size={22} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{info.title}</h4>
                      <p className="text-gray-600 text-sm">{info.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="h-80 md:h-96">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-58.972243%2C-34.175203%2C-58.952243%2C-34.155203&layer=mapnik&marker=-34.1652026%2C-58.962243"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  loading="lazy"
                  title="Ubicación Neolimp SRL"
                ></iframe>
              </div>
              <div className="p-5 bg-gradient-to-r from-blue-800 to-green-500 text-white text-center font-semibold">
                📍 Lavalle 463, Campana, Buenos Aires, Argentina
              </div>
            </div>
          </div>

          {/* INSTAGRAM */}
          <div className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Instagram size={26} className="text-pink-500" />
                Seguinos en Instagram
              </h3>
              <a
                href={`https://www.instagram.com/${INSTAGRAM_USERNAME}/`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-blue-800 to-green-500 text-white font-semibold hover:opacity-90"
              >
                Ver perfil
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {INSTAGRAM_POSTS.map((url, i) => {
                const embed = toEmbedUrl(url);
                return (
                  <div
                    key={`${url}-${i}`}
                    className="rounded-xl overflow-hidden border bg-gray-50 hover:shadow-md transition-all relative"
                  >
                    <div className="pt-[100%] relative">
                      <iframe
                        src={embed}
                        className="absolute inset-0 w-full h-full"
                        loading="lazy"
                        allowTransparency
                        frameBorder={0}
                        scrolling="no"
                        title={`Instagram post ${i + 1}`}
                        referrerPolicy="strict-origin-when-cross-origin"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
