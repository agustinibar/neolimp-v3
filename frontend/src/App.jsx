import React, { lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet';
import { Route, Routes } from 'react-router-dom';

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Clients from '@/components/Clients';
import Process from '@/components/Process';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import CallButton from '@/components/CallButton';
import WhatsAppButton from '@/components/WhatsAppButton';
import MobileContactBar from '@/components/MobileContactBar';
import { Toaster } from '@/components/ui/toaster';

const BlogCaseStudy1 = lazy(() => import('@/components/ui/BlogCaseStudy1'));
const BlogCaseStudy2 = lazy(() => import('@/components/ui/BlogCaseStudy2'));
const BlogCaseStudy3 = lazy(() => import('@/components/ui/BlogCaseStudy3'));
const AdminLogin = lazy(() => import('@/admin/AdminLogin'));
const RequireAdmin = lazy(() => import('@/admin/RequireAdmin'));
const AdminDashboard = lazy(() => import('@/admin/AdminDashboard'));

function PageLoader() {
  return <div className="grid min-h-screen place-items-center text-sm text-slate-600">Cargando…</div>;
}

function PublicPageMeta({ title, description, children }) {
  return <><Helmet><title>{title}</title><meta name="description" content={description} /></Helmet>{children}</>;
}

function HomePage() {
  return (
    <>
      <Helmet>
        <title>Empresa de limpieza industrial y corporativa | Neolimp</title>
        <meta name="description" content="Limpieza industrial y corporativa para plantas, depósitos, centros logísticos, oficinas e instituciones. Coordiná un relevamiento y solicitá presupuesto." />
      </Helmet>
      <div className="min-h-screen bg-white">
        <Header />
        <main>
          <Hero />
          <Services />
          <Clients />
          <Process />
          <Contact />
        </main>
        <Footer />
        <CallButton />
        <WhatsAppButton />
        <MobileContactBar />
        <Toaster />
      </div>
    </>
  );
}

export default function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/blog01" element={<PublicPageMeta title="Caso Terminal Zárate | Limpieza industrial | Neolimp" description="Caso presentado por Neolimp sobre el abordaje de una operación industrial en Terminal Zárate."><BlogCaseStudy1 /></PublicPageMeta>} />
        <Route path="/blog02" element={<PublicPageMeta title="Limpieza industrial en Campana: protocolos | Neolimp" description="Protocolos y prácticas para planificar servicios profesionales de limpieza en plantas industriales."><BlogCaseStudy2 /></PublicPageMeta>} />
        <Route path="/blog03" element={<PublicPageMeta title="Limpieza profesional para sanatorios | Neolimp" description="Aspectos clave de limpieza y desinfección para instituciones de salud y espacios asistenciales."><BlogCaseStudy3 /></PublicPageMeta>} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<RequireAdmin><AdminDashboard /></RequireAdmin>} />
        <Route path="*" element={<div className="grid min-h-screen place-items-center p-6"><div><h1 className="text-3xl font-bold">Página no encontrada</h1><a className="mt-4 inline-block text-blue-800 underline" href="/">Volver al inicio</a></div></div>} />
      </Routes>
    </Suspense>
  );
}
