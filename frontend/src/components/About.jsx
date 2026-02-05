import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Target, Eye, Award, Users } from 'lucide-react';

const About = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 });
  const reduceMotion = useReducedMotion();

  const values = useMemo(() => ([
    { icon: Award, title: 'Calidad', description: 'Excelencia en cada servicio' },
    { icon: Users, title: 'Compromiso', description: 'Dedicación total con nuestros clientes' },
    { icon: Target, title: 'Profesionalismo', description: 'Personal altamente capacitado' },
    { icon: Eye, title: 'Seguridad', description: 'Protocolos certificados ISO 9001' },
  ]), []);

  const fadeLeft = reduceMotion
    ? {}
    : { initial: { opacity: 0, x: -30 }, animate: isInView ? { opacity: 1, x: 0 } : {}, transition: { duration: 0.6 } };

  const fadeRight = reduceMotion
    ? {}
    : { initial: { opacity: 0, x: 30 }, animate: isInView ? { opacity: 1, x: 0 } : {}, transition: { duration: 0.6, delay: 0.1 } };

  return (
    <section id="nosotros" ref={ref} className="py-20 bg-gradient-to-br from-blue-50 to-green-50">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Columna texto */}
          <motion.div {...fadeLeft}>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Sobre <span className="text-gradient">Neolimp Servicios</span>
            </h2>

            <div className="space-y-6 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                  <Target className="mr-2 text-blue-800" size={28} />
                  Nuestra Misión
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Brindar servicios de limpieza profesional de la más alta calidad, superando las expectativas de nuestros clientes
                  mediante personal capacitado, equipamiento de última generación y protocolos certificados.
                </p>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center">
                  <Eye className="mr-2 text-green-600" size={28} />
                  Nuestra Visión
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Ser la empresa líder en servicios de limpieza integral en la región, reconocida por nuestra excelencia, innovación
                  y compromiso con la satisfacción del cliente.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Certificaciones y Experiencia</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg flex items-center justify-center shrink-0">
                    <Award className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Certificación ISO 9001</p>
                    <p className="text-sm text-gray-600">Gestión de calidad certificada</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center shrink-0">
                    <Users className="text-white" size={24} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">+20 Años de Trayectoria</p>
                    <p className="text-sm text-gray-600">Experiencia comprobada en el sector</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Columna imagen + valores */}
          <motion.div {...fadeRight} className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              {/* RECOMENDACIÓN: usar imagen local .webp */}
              <img
                alt="Equipo de Neolimp Servicios"
                className="w-full h-72 sm:h-80 md:h-96 object-cover"
                src="/fotos_nimp/equipo.webp"
                loading="lazy"
                decoding="async"
                width="1200"
                height="800"
              />
            </div>

            {/* Responsive mejorado: 1 col en xs, 2 col desde sm */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: reduceMotion ? 0 : 0.15 + index * 0.06, duration: 0.35 }}
                  className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center mb-3">
                    <value.icon className="text-white" size={24} />
                  </div>
                  <h4 className="font-bold text-gray-900 mb-1">{value.title}</h4>
                  <p className="text-sm text-gray-600">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
