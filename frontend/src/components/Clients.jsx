import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Star, Quote, X } from 'lucide-react';

// GALERÍA ACTUALIZADA según /public/fotos_nimp
const galleryImages = [
  { src: "/fotos_nimp/alturas1.jpg", title: "Trabajo en Alturas" },
  { src: "/fotos_nimp/baños.jpg", title: "Baños" },
  { src: "/fotos_nimp/camionetas.jpeg", title: "Camionetas Neolimp" },
  { src: "/fotos_nimp/cesped.jpg", title: "Mantenimiento de Césped" },
  { src: "/fotos_nimp/clinicas.jpg", title: "Clínicas" },
  { src: "/fotos_nimp/clubes.jpeg", title: "Clubes y Espacios Deportivos" },
  { src: "/fotos_nimp/empleados.jpeg", title: "Equipo Neolimp" },
  { src: "/fotos_nimp/empresa.jpeg", title: "Nuestra Empresa" },
  { src: "/fotos_nimp/escalinatas.jpg", title: "Escalinatas" },
  { src: "/fotos_nimp/hotel.jpg", title: "Hoteles" },
  { src: "/fotos_nimp/industrias.jpg", title: "Industrias" },
  { src: "/fotos_nimp/maquinaria.jpeg", title: "Maquinaria" },
  { src: "/fotos_nimp/partnerneolimp.jpeg", title: "Partners Neolimp" },
  { src: "/fotos_nimp/cines.png", title: "Cines" },
  { src: "/fotos_nimp/puerto.png", title: "Puertos" },
];



const Clients = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const [selected, setSelected] = useState(null);

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
            La satisfacción de nuestros clientes es nuestra mejor carta de presentación
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

        {/* Galería de resultados (AUTOMÁTICA DESDE /fotos_nimp) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="bg-gradient-to-r from-blue-800 to-green-500 rounded-2xl p-8 md:p-12 text-center text-white"
        >
          <h3 className="text-3xl font-bold mb-4">Galería de Resultados</h3>
          <p className="text-xl mb-8 opacity-90">Antes y después de nuestros servicios</p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {galleryImages.map((img, idx) => (
              <motion.button
                key={img.name + idx}
                onClick={() => setSelected(img)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden text-left"
              >
                <img
                  src={img.src}
                  alt={img.title}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
                <p className="p-4 font-semibold">{img.title}</p>
              </motion.button>
            ))}

            {/* Si no hay imágenes, muestra un placeholder */}
            {galleryImages.length === 0 && (
              <div className="col-span-full text-white/90">
                No se encontraron imágenes en <code>/fotos_nimp</code>.
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Modal / Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
          >
            <motion.div
              className="relative max-w-5xl w-full"
              initial={{ scale: 0.95, y: 10 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 10 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute -top-3 -right-3 bg-white text-gray-900 rounded-full p-2 shadow"
                onClick={() => setSelected(null)}
                aria-label="Cerrar"
              >
                <X size={20} />
              </button>
              <img
                src={selected.src}
                alt={selected.title}
                className="w-full max-h-[80vh] object-contain rounded-xl"
              />
              <div className="mt-3 text-center text-white">{selected.title}</div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Clients;
