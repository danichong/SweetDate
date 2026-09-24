import React, { useState } from 'react';
import { X, Heart, Settings, Download, Upload, RotateCcw, Check, Sparkles } from 'lucide-react';
import { CoupleProfile, DateItem } from '../types/date';

interface CoupleSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CoupleProfile;
  onSaveProfile: (profile: CoupleProfile) => void;
  dates: DateItem[];
  onImportData: (importedDates: DateItem[], importedProfile?: CoupleProfile) => void;
  onResetData: () => void;
}

export const CoupleSettingsModal: React.FC<CoupleSettingsModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  dates,
  onImportData,
  onResetData,
}) => {
  const [partner1, setPartner1] = useState(profile.partner1);
  const [partner2, setPartner2] = useState(profile.partner2);
  const [startDate, setStartDate] = useState(profile.startDate || '');
  const [currency, setCurrency] = useState(profile.currency || 'S/');
  const [customCurrency, setCustomCurrency] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const finalCurrency = currency === 'custom' ? (customCurrency.trim() || 'S/') : currency;
    onSaveProfile({
      partner1: partner1.trim() || 'Tú',
      partner2: partner2.trim() || 'Mi Amor',
      startDate: startDate || undefined,
      currency: finalCurrency,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  const exportBackup = () => {
    const data = {
      profile: {
        ...profile,
        currency: currency === 'custom' ? customCurrency : currency,
      },
      dates,
      exportDate: new Date().toISOString(),
      appName: 'sweet date',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sweet-date-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (parsed && Array.isArray(parsed.dates)) {
            onImportData(parsed.dates, parsed.profile);
            alert('¡Datos restaurados con éxito! 💕');
            onClose();
          } else if (Array.isArray(parsed)) {
            onImportData(parsed);
            alert('¡Citas importadas con éxito! 💕');
            onClose();
          } else {
            alert('El archivo no tiene el formato correcto.');
          }
        } catch {
          alert('Hubo un error al leer el archivo JSON.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#0d162d] rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a1122]/95 border-b border-[#a2dbfc]/20 text-white flex items-center justify-between shadow-md backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#a2dbfc]" />
            <h3 className="font-bold text-base text-white">Personalizar Sweet Date</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          
          {/* Couple Names */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Nuestros Nombres
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[11px] text-slate-400">Persona 1</span>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={partner1}
                  onChange={(e) => setPartner1(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#080e1c] border border-slate-700 rounded-xl focus:bg-[#0a1224] focus:ring-2 focus:ring-[#a2dbfc]/50 outline-none text-white placeholder-slate-500"
                />
              </div>
              <div>
                <span className="text-[11px] text-slate-400">Persona 2</span>
                <input
                  type="text"
                  placeholder="Nombre de tu pareja"
                  value={partner2}
                  onChange={(e) => setPartner2(e.target.value)}
                  className="w-full px-3 py-2 text-xs sm:text-sm bg-[#080e1c] border border-slate-700 rounded-xl focus:bg-[#0a1224] focus:ring-2 focus:ring-[#a2dbfc]/50 outline-none text-white placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          {/* Anniversary Date */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Fecha de Inicio / Aniversario
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-[#080e1c] border border-slate-700 rounded-xl focus:bg-[#0a1224] focus:ring-2 focus:ring-[#a2dbfc]/50 outline-none text-white [color-scheme:dark]"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Se mostrará un contador de días juntos en el encabezado.
            </p>
          </div>

          {/* Currency */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Moneda Predeterminada
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['S/', '$', '€'].map((sym) => (
                <button
                  key={sym}
                  type="button"
                  onClick={() => setCurrency(sym)}
                  className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                    currency === sym
                      ? 'bg-[#a2dbfc] text-[#061428] border-[#a2dbfc] shadow-sm shadow-[#a2dbfc]/15'
                      : 'bg-[#080e1c] text-slate-400 border-slate-800 hover:bg-[#a2dbfc]/10 hover:text-white'
                  }`}
                >
                  {sym} {sym === 'S/' ? '(Soles)' : sym === '$' ? '(Dólares)' : '(Euros)'}
                </button>
              ))}
            </div>
          </div>

          {/* Backup and restore */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <span className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Copia de Seguridad & Datos
            </span>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={exportBackup}
                className="p-2.5 bg-[#a2dbfc]/10 hover:bg-[#a2dbfc]/20 text-[#a2dbfc] rounded-xl text-xs font-semibold border border-[#a2dbfc]/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer backdrop-blur-xs"
              >
                <Download className="w-3.5 h-3.5 text-[#a2dbfc]" />
                <span>Exportar JSON</span>
              </button>

              <label className="p-2.5 bg-[#a2dbfc]/10 hover:bg-[#a2dbfc]/20 text-[#a2dbfc] rounded-xl text-xs font-semibold border border-[#a2dbfc]/30 flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-center backdrop-blur-xs">
                <Upload className="w-3.5 h-3.5 text-[#a2dbfc]" />
                <span>Restaurar JSON</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportFile}
                  className="hidden"
                />
              </label>
            </div>

            <button
              type="button"
              onClick={() => {
                if (confirm('¿Restablecer las citas a los ejemplos iniciales? Tus cambios actuales se reemplazarán.')) {
                  onResetData();
                  onClose();
                }
              }}
              className="w-full text-center text-xs text-rose-400 hover:text-rose-300 font-medium py-1.5 flex items-center justify-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Restablecer citas de ejemplo</span>
            </button>
          </div>

          {/* Save button with baby blue & transparencies */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-black text-[#061428] bg-[#a2dbfc]/90 hover:bg-[#a2dbfc] border border-[#a2dbfc]/60 rounded-xl backdrop-blur-xs shadow-md shadow-[#a2dbfc]/20 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-4 h-4 stroke-[3]" />
                  <span>¡Guardado!</span>
                </>
              ) : (
                <>
                  <Heart className="w-3.5 h-3.5 fill-[#061428] stroke-[#061428]" />
                  <span>Guardar Ajustes</span>
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
