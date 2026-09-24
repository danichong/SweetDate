import React, { useState } from 'react';
import { Download, Smartphone, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#a2dbfc]/15 hover:bg-[#a2dbfc]/25 text-[#a2dbfc] border border-[#a2dbfc]/30 text-xs font-bold transition-all shadow-xs cursor-pointer"
        title="Instalar Sweet Date como app en tu teléfono o PC"
      >
        <Download className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Instalar App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#a2dbfc]/15 hover:bg-[#a2dbfc]/25 text-[#a2dbfc] border border-[#a2dbfc]/30 text-xs font-bold transition-all shadow-xs cursor-pointer"
          title="Instalar en iPhone"
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Instalar App</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 animate-in fade-in">
            <div className="relative w-full max-w-sm rounded-3xl bg-[#0d162d] border border-slate-700 p-6 shadow-2xl text-slate-100">
              <button
                onClick={() => setShowIOSGuide(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2 mb-3">
                <div className="p-2 rounded-xl bg-[#a2dbfc]/15 text-[#a2dbfc]">
                  <Smartphone className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-white">Instalar en iPhone / iPad</h3>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed space-y-2">
                1. Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha hacia arriba) en Safari.<br />
                2. Desliza hacia abajo y selecciona <strong>"Agregar a la pantalla de inicio"</strong> (Add to Home Screen).<br />
                3. ¡Listo! Sweet Date se abrirá en pantalla completa como una app nativa con tus pollitos favoritos.
              </p>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full py-2.5 rounded-xl bg-[#a2dbfc] text-[#061428] font-bold text-xs hover:bg-[#8ecff9] transition-colors"
              >
                Entendido
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
