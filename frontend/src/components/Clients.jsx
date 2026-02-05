import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Star, Quote, HelpCircle, ChevronDown } from 'lucide-react';

const Clients = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const [openIndex, setOpenIndex] = useState(0);

  const testimonials = useMemo(() => ([
    {
      name: 'María González',
      position: 'Gerente de Operaciones',
      company: 'Banco Provincia',
      text: 'Neolimp ha transformado completamente la limpieza de nuestras sucursales. Su profesionalismo y atención al detalle son excepcionales.',
      rating: 5,
    },
    {
      name: 'Carlos Rodríguez',
      position: 'Director de Facilities',
      company: 'Toyota Boshoku',
      text: 'Trabajamos con Neolimp desde hace 5 años. Su equipo es confiable, eficiente y siempre cumple con los más altos estándares de calidad.',
      rating: 5,
    },
    {
      name: 'Ana Martínez',
      position: 'Administradora',
      company: 'Clínica Delta',
      text: 'La limpieza hospitalaria requiere protocolos muy estrictos. Neolimp cumple y supera todas nuestras expectativas en seguridad e higiene.',
      rating: 5,
    },
  ]), []);

  // FAQ: limpieza industrial / facilities (10)
  const faqs = useMemo(() => ([
    {
      q: '¿Qué tipo de limpieza industrial realiza Neolimp?',
      a: 'Realizamos limpieza integral para plantas industriales, depósitos, centros logísticos, oficinas corporativas, clínicas, clubes e instituciones. Incluye limpieza de áreas productivas, sanitización, desinfección, mantenimiento de superficies, vidrios, espacios comunes y servicios específicos según actividad.',
    },
    {
      q: '¿Trabajan con contratos mensuales o servicios puntuales?',
      a: 'Ambas modalidades. Podemos operar con contratos fijos (mantenimiento mensual con frecuencia definida) o intervenciones puntuales (post-obra, refuerzo por auditorías, eventos, aperturas, siniestros o limpiezas profundas programadas).',
    },
    {
      q: '¿Cómo aseguran la calidad del servicio?',
      a: 'Aplicamos checklist por área, supervisión periódica, reposición planificada de insumos (si corresponde) y seguimiento con responsables de sitio. Además, registramos incidencias y acciones correctivas para mantener un estándar estable y medible.',
    },
    {
      q: '¿Qué protocolos de seguridad e higiene implementan?',
      a: 'Trabajamos con procedimientos operativos por tarea (uso de EPP, señalización, segregación de residuos, manejo de químicos y seguridad en altura cuando aplica). El personal se capacita y se asigna según riesgos y requisitos de cada cliente.',
    },
    {
      q: '¿Utilizan productos y maquinaria profesional?',
      a: 'Sí. Usamos productos aptos para uso industrial y equipos según necesidad: hidrolavadoras, aspiradoras industriales, lustradoras, equipos de desinfección y herramientas especializadas para superficies delicadas o alto tránsito.',
    },
    {
      q: '¿Pueden operar fuera de horario o en turnos nocturnos?',
      a: 'Sí. Nos adaptamos a la operación del cliente para no interrumpir la producción o la atención al público. Coordinamos cronogramas por turnos (diurno/nocturno) y días específicos, incluyendo fines de semana si es necesario.',
    },
    {
      q: '¿Cubren urgencias o limpiezas por contingencia?',
      a: 'Sí. Ante derrames, refuerzos por inspecciones, picos de operación o eventos, coordinamos una respuesta prioritaria según disponibilidad y tipo de servicio. Para clientes con contrato, se define un esquema de atención preferencial.',
    },
    {
      q: '¿Qué zonas cubren y cómo coordinan el inicio?',
      a: 'Operamos en CABA y AMBA, y coordinamos cobertura extendida según proyecto. El inicio se organiza con un relevamiento del sitio (presencial o remoto), definición de alcance, frecuencia, dotación y puesta en marcha con supervisión.',
    },
    {
      q: '¿Cómo cotizan el servicio?',
      a: 'La cotización se basa en metros/áreas, tipo de actividad, nivel de exigencia sanitaria, frecuencia, horarios, dotación, maquinaria requerida e insumos. En 24–72 hs hábiles, entregamos una propuesta con alcance claro y condiciones.',
    },
    {
      q: '¿Qué documentación pueden presentar para empresas?',
      a: 'Podemos presentar documentación operativa y administrativa típica para contratación (datos de empresa, nómina asignada, seguros/ART si corresponde, y requisitos específicos del cliente). Si tu compañía tiene un checklist de ingreso, lo alineamos desde el inicio.',
    },
  ]), []);

  const toggleFAQ = (idx) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="clientes" ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Lo Que Dicen Nuestros <span className="text-gradient">Clientes</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experiencia real en limpieza industrial y mantenimiento para empresas e instituciones.
          </p>
        </motion.div>

        {/* Testimonials */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow relative"
            >
              <div className="absolute top-6 right-6 text-blue-200">
                <Quote size={48} />
              </div>

              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="text-yellow-400 fill-yellow-400" size={20} />
                ))}
              </div>

              <p className="text-gray-700 mb-6 leading-relaxed italic">"{testimonial.text}"</p>

              <div className="border-t border-gray-200 pt-4">
                <p className="font-bold text-gray-900">{testimonial.name}</p>
                <p className="text-sm text-gray-600">{testimonial.position}</p>
                <p className="text-sm font-semibold text-blue-800">{testimonial.company}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* FAQ Section (reemplaza la galería) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-gradient-to-r from-blue-800 to-green-500 rounded-2xl p-8 md:p-12 text-white"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <HelpCircle size={28} className="text-white/90" />
            <h3 className="text-3xl font-bold">Preguntas Frecuentes</h3>
          </div>

          <p className="text-xl mb-8 opacity-90 text-center max-w-3xl mx-auto">
            Respuestas claras sobre cómo trabajamos en limpieza industrial, protocolos y contratación.
          </p>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((item, idx) => {
              const isOpen = openIndex === idx;
              const contentId = `faq-content-${idx}`;
              const buttonId = `faq-button-${idx}`;

              return (
                <div key={item.q} className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden">
                  <button
                    id={buttonId}
                    aria-controls={contentId}
                    aria-expanded={isOpen}
                    onClick={() => toggleFAQ(idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left"
                  >
                    <span className="font-semibold text-lg leading-snug">{item.q}</span>
                    <motion.span
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0"
                    >
                      <ChevronDown size={22} className="text-white/90" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={contentId}
                        role="region"
                        aria-labelledby={buttonId}
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="px-5 md:px-6 pb-5 md:pb-6"
                      >
                        <div className="border-t border-white/20 pt-4 text-white/90 leading-relaxed">
                          {item.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <div className="mt-10 text-center">
            <p className="text-white/90">
              ¿Necesitás una propuesta para tu planta, depósito u oficina?
            </p>
            <p className="text-white font-semibold">
              Contactanos y coordinamos un relevamiento.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Clients;
