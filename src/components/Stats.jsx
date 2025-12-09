
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from '@/hooks/useInView';
import { Award, Users, Building2, Shield } from 'lucide-react';

const Stats = () => {
  const [ref, isInView] = useInView({ threshold: 0.3 });

  const stats = [
    { icon: Award, value: '20+', label: 'Años de Experiencia', color: 'from-blue-500 to-blue-700' },
    { icon: Building2, value: '500+', label: 'Clientes Satisfechos', color: 'from-green-500 to-green-700' },
    { icon: Users, value: '150+', label: 'Personal Capacitado', color: 'from-blue-600 to-green-600' },
    { icon: Shield, value: 'ISO 9001', label: 'Certificación', color: 'from-green-600 to-blue-600' },
  ];

  return (
    <section ref={ref} className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="text-center"
            >
              <div className="flex justify-center mb-4">
                <div className={`w-16 h-16 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg`}>
                  <stat.icon className="text-white" size={32} />
                </div>
              </div>
              <motion.h3
                initial={{ scale: 0.5 }}
                animate={isInView ? { scale: 1 } : {}}
                transition={{ delay: index * 0.1 + 0.3, type: 'spring' }}
                className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
              >
                {stat.value}
              </motion.h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
  