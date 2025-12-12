
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Button } from '@/components/ui/button';
import { Building2, Factory, Heart, Home, ArrowRight } from 'lucide-react';

const Services = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  const scrollToContact = () => {
    const element = document.getElementById('contacto');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const services = [
    {
      icon: Building2,
      title: 'Limpieza de Oficinas y Bancos',
      description: 'Servicios especializados para espacios corporativos, garantizando ambientes profesionales y seguros.',
      image: 'https://serviciosgeneralesmaviclean.com/wp-content/uploads/2023/09/22.jpg.webp',
      color: 'from-blue-500 to-blue-700',
    },
    {
      icon: Factory,
      title: 'Limpieza Industrial',
      description: 'Soluciones integrales para plantas industriales con equipamiento especializado y protocolos de seguridad.',
      image: 'https://mavro-int.com/wp-content/uploads/2023/03/Industrial-cleaning.jpg',
      color: 'from-green-500 to-green-700',
    },
    {
      icon: Heart,
      title: 'Limpieza de Sanatorios y Hospitales',
      description: 'Protocolos sanitarios estrictos para garantizar ambientes seguros y libres de contaminación.',
      image: 'https://psqargentina.com/wp-content/uploads/limpieza-desinfeccion-hospitalaria.jpg',
      color: 'from-blue-600 to-green-600',
    },
    {
      icon: Home,
      title: 'Limpieza de Clubes y Barrios Privados',
      description: 'Mantenimiento integral de áreas comunes, instalaciones deportivas y espacios recreativos.',
      image: 'https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgWMhkMVOwpR_Caf-c9dwpdqwNPi0jTES2ue9b7TQxrEw0Q7ranCvB87ju1-b0KlDtJj27GTuCE8sYX3sXyPohyPVQe_uYejsSoxEwtVxxVeW6mmsAVGtYfR-GKEmkYDKokz-Waxhx526K-/s16000/limpieza.jpg',
      color: 'from-green-600 to-blue-600',
    },
  ];

  return (
    <section id="servicios" ref={ref} className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Nuestros <span className="text-gradient">Servicios</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Soluciones profesionales de limpieza adaptadas a las necesidades específicas de cada sector
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
            >
              <div className="relative h-64 overflow-hidden">
                <img alt={service.title} 
                  src={service.image} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className={`absolute top-4 left-4 w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center shadow-lg`}>
                  <service.icon className="text-white" size={28} />
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <Button
                  onClick={scrollToContact}
                  variant="outline"
                  className="w-full border-2 border-blue-800 text-blue-800 hover:bg-blue-800 hover:text-white group-hover:bg-blue-800 group-hover:text-white transition-all"
                >
                  Solicitar Presupuesto
                  <ArrowRight className="ml-2" size={18} />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
  