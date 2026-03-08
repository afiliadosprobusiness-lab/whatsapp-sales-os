import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#040b16] px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(64, 226, 129, 0.25), transparent 38%), radial-gradient(circle at 80% 75%, rgba(19, 98, 206, 0.25), transparent 40%)",
        }}
      />
      <div className="relative z-10 w-full max-w-2xl rounded-2xl border border-emerald-400/20 bg-slate-950/70 p-8 text-center shadow-2xl shadow-emerald-900/30 backdrop-blur md:p-12">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-emerald-300/90">
          WhatsSalesRecovery
        </p>
        <h1 className="text-5xl font-bold leading-tight text-white md:text-6xl">Error 404</h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-slate-300 md:text-lg">
          La ruta <span className="font-semibold text-emerald-300">{location.pathname}</span> no existe o fue movida.
          Regresa al inicio y continua tu flujo de trabajo.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            to="/"
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 px-5 py-2.5 font-semibold text-slate-950 transition-colors hover:bg-emerald-400 sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Ir al inicio
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-slate-600 bg-slate-900 px-5 py-2.5 font-semibold text-slate-100 transition-colors hover:border-emerald-300/50 hover:text-emerald-200 sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
        </div>
      </div>
    </main>
  );
};

export default NotFound;

