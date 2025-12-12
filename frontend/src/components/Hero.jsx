import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, CheckCircle } from 'lucide-react';

const Hero = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section id="inicio" className="relative pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden">
      {/* Fondo decorativo: no debe capturar clics */}
      <div className="absolute inset-0 gradient-blue-green opacity-5 pointer-events-none -z-10"></div>

      {/* Elevar contenido por encima de cualquier overlay */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-block"
            >
              <span className="bg-gradient-to-r from-blue-800 to-green-500 text-white px-4 py-2 rounded-full text-sm font-semibold">
                +20 Años de Experiencia
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              Soluciones Profesionales de{' '}
              <span className="text-gradient">Limpieza Integral</span>
            </h1>

            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Más de 20 años de experiencia ofreciendo limpieza de calidad para empresas e instituciones en Buenos Aires
            </p>

            <div className="space-y-3">
              {['Certificación ISO 9001', 'Personal Capacitado', 'Equipamiento Profesional'].map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="flex items-center space-x-2"
                >
                  <CheckCircle className="text-green-500" size={20} />
                  <span className="text-gray-700">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 pt-4"
            >
              <Button
                onClick={() => scrollToSection('contacto')}
                size="lg"
                className="bg-gradient-to-r from-blue-800 to-green-500 hover:from-blue-900 hover:to-green-600 text-white text-lg px-8"
              >
                Solicitar Presupuesto
                <ArrowRight className="ml-2" size={20} />
              </Button>

              <Button
                onClick={() => scrollToSection('contacto')}
                size="lg"
                variant="outline"
                className="border-2 border-blue-800 text-blue-800 hover:bg-blue-50 text-lg px-8"
              >
                Contactarnos
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img
                alt="Equipo profesional de limpieza Neolimp trabajando en oficinas modernas"
                src="https://images.unsplash.com/photo-1492724219889-989d2306de19"
                className="object-cover w-full h-full"
              />
              {/* Overlay de la imagen: no bloquear clics */}
              <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-transparent pointer-events-none"></div>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, type: 'spring' }}
              className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-xl p-6 max-w-xs"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle className="text-white" size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">100% Satisfacción</p>
                  <p className="text-sm text-gray-600">Garantía de calidad</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
