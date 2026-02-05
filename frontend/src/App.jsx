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
// import Jobs from "@/components/Jobs";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { Toaster } from "@/components/ui/toaster";

import BlogCaseStudy1 from "@/components/ui/BlogCaseStudy1";
import BlogCaseStudy2 from "./components/ui/BlogCaseStudy2";
import BlogCaseStudy3 from "./components/ui/BlogCaseStudy3";
import CallButton from "./components/CallButton";

// ADMIN
import RequireAdmin from "./admin/RequireAdmin";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/AdminLogin"; // ✅ faltaba

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
      {/* <Jobs /> */}
      <Contact />
      <Footer />
      <CallButton />
      <WhatsAppButton />
      <Toaster />
    </div>
  </>
);

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />

      <Route path="/blog01" element={<BlogCaseStudy1 />} />
      <Route path="/blog02" element={<BlogCaseStudy2 />} />
      <Route path="/blog03" element={<BlogCaseStudy3 />} />

      {/* ✅ ADMIN LOGIN */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* ✅ ADMIN DASHBOARD PROTEGIDO */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <AdminDashboard />
          </RequireAdmin>
        }
      />

      {/* opcional: 404 */}
      <Route path="*" element={<div className="p-6">404</div>} />
    </Routes>
  );
}
