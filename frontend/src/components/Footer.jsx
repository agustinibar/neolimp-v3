
import React from 'react';
import { Facebook, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 to-blue-900 text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">N</span>
              </div>
              <span className="text-xl font-bold">Neolimp Servicios</span>
            </div>
            <p className="text-gray-300 mb-4">
              Más de 20 años brindando servicios profesionales de limpieza integral en Buenos Aires.
            </p>
            <div className="flex space-x-3">
              <a href="https://web.facebook.com/profile.php?id=61573107779744" 
              className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.instagram.com/neolimp_srl/?igsh=MTd3b2FvaGlidW05bA%3D%3D#" 
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://www.linkedin.com/in/joaqu%C3%ADn-larricart-254b3a348/" 
                className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <span className="text-lg font-bold mb-4 block">Servicios</span>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('servicios')} className="text-gray-300 hover:text-white transition-colors">
                  Limpieza de Oficinas
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('servicios')} className="text-gray-300 hover:text-white transition-colors">
                  Limpieza Industrial
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('servicios')} className="text-gray-300 hover:text-white transition-colors">
                  Limpieza de Sanatorios
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('servicios')} className="text-gray-300 hover:text-white transition-colors">
                  Limpieza de Clubes
                </button>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-lg font-bold mb-4 block">Empresa</span>
            <ul className="space-y-2">
              <li>
                <button onClick={() => scrollToSection('nosotros')} className="text-gray-300 hover:text-white transition-colors">
                  Sobre Nosotros
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('clientes')} className="text-gray-300 hover:text-white transition-colors">
                  Casos de Éxito
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('blog')} className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection('trabajos')} className="text-gray-300 hover:text-white transition-colors">
                  Trabaja con Nosotros
                </button>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-lg font-bold mb-4 block">Contacto</span>
            <ul className="space-y-3">
              <li className="flex items-start space-x-2">
                <MapPin size={18} className="mt-1 flex-shrink-0" />
                <span className="text-gray-300">Lavalle 463, Campana, Buenos Aires</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone size={18} className="flex-shrink-0" />
                <span className="text-gray-300">+54 9 11 2465-0609</span>
              </li>
              <li className="flex items-center space-x-2">
                <Mail size={18} className="flex-shrink-0" />
                <span className="text-gray-300">neolimpsrl@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-300 text-center md:text-left">
              © {currentYear} Neolimp Servicios. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6">
              <button className="text-gray-300 hover:text-white transition-colors">
                Política de Privacidad
              </button>
              <button className="text-gray-300 hover:text-white transition-colors">
                Términos y Condiciones
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
  