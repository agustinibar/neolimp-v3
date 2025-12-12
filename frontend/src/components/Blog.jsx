import React from "react";
import { motion } from "framer-motion";
import { useInView } from "@/hooks/useInView";
import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom"; // ✅ este es el Link correcto


const Blog = () => {
  const [ref, isInView] = useInView({ threshold: 0.2 });

  const handleReadMoreToast = () => {
    toast({
      title: "🚧 Esta función aún no está implementada",
      description: "¡Pero no te preocupes! Puedes solicitarla en tu próximo mensaje 🚀",
    });
  };

  const articles = [
    {
      title: "Beneficios de Contratar Limpieza Profesional para tu Empresa",
      excerpt:
        "Descubre cómo un servicio profesional de limpieza puede mejorar la productividad y el ambiente laboral de tu empresa.",
      date: "15 Marzo 2024",
      image:
        "/fotos_nimp/TZ.png",
      category: "Empresas",
      to: "/blog01", // ✅ ruta existente
    },
    {
      title: "Limpieza Industrial en Campana: Protocolos y Mejores Prácticas",
      excerpt:
        "Conoce los estándares de limpieza industrial que garantizan seguridad y eficiencia en plantas de producción.",
      date: "10 Marzo 2024",
      image:
        "/fotos_nimp/industrias.jpg",
      category: "Industrial",
      to: "/blog02", // aún sin página
    },
    {
      title: "Cómo Mantener Sanatorios Seguros y Limpios: Guía Completa",
      excerpt:
        "Los protocolos sanitarios esenciales para mantener ambientes hospitalarios seguros y libres de contaminación.",
      date: "5 Marzo 2024",
      image:
        "/fotos_nimp/baños.jpg",
      category: "Salud",
      to: "/blog03", // aún sin página
    },
  ];

  return (
    <section id="blog" ref={ref} className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Blog y <span className="text-gradient">Recursos</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Consejos, guías y mejores prácticas en limpieza profesional
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {articles.map((article, index) => (
            <motion.article
              key={article.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group"
            >
              <div className="relative h-56 overflow-hidden">
                <img
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  src={article.image}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-gradient-to-r from-blue-800 to-green-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {article.category}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <Calendar size={16} className="mr-2" />
                  {article.date}
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h3>

                <p className="text-gray-600 mb-4 line-clamp-3">{article.excerpt}</p>

                {/* ✅ Opción A: Navega si hay ruta; si no, muestra toast */}
                {article.to ? (
                  <Button asChild className="inline-flex items-center gap-2">
                    <Link to={article.to}>
                      Leer más
                      <ArrowRight className="ml-1" size={18} />
                    </Link>
                  </Button>
                ) : (
                  <Button
                    onClick={handleReadMoreToast}
                    variant="outline"
                    className="inline-flex items-center gap-2"
                  >
                    Leer más
                    <ArrowRight className="ml-1" size={18} />
                  </Button>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Blog;
