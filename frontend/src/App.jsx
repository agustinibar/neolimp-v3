// src/App.jsx
import React from "react";
import { Helmet } from "react-helmet";
import { Routes, Route } from "react-router-dom";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import Services from "@/components/Services";
import About from "@/components/About";
import Clients from "@/components/Clients";
import Blog from "@/components/Blog";
import Jobs from "@/components/Jobs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Toaster } from "@/components/ui/toaster";

import BlogCaseStudy1 from "@/components/ui/BlogCaseStudy1";
import BlogCaseStudy2 from "./components/ui/BlogCaseStudy2";
import BlogCaseStudy3 from "./components/ui/BlogCaseStudy3";

// dejo la home como un subcomponente para que Routes quede prolijo
const HomePage = () => (
  <>
    <Helmet>
      <title>Neolimp Servicios - Limpieza Profesional en Campana, Buenos Aires</title>
      <meta
        name="description"
        content="Empresa de limpieza profesional con +20 años de experiencia en Campana, Buenos Aires. Servicios integrales para empresas, bancos, oficinas, sanatorios, industrias y clubes."
      />
    </Helmet>

    <div className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Stats />
      <Services />
      <About />
      <Clients />
      <Blog />
      {/* <Jobs />  si querés activarlo */}
      <Contact />
      <Footer />
      <WhatsAppButton />
      <Toaster />
    </div>
  </>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      {/* Blog #1 */}
      <Route path="/blog01" element={<BlogCaseStudy1 />} />
       {/* Blog #2 */}
      <Route path="/blog02" element={<BlogCaseStudy2 />} />
      {/* Blog #3 */}
      <Route path="/blog03" element={<BlogCaseStudy3 />} />
    </Routes>
  );
}
