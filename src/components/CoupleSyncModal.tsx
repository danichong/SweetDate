import React, { useState } from 'react';
import { Share2, Copy, Check, RefreshCw, Smartphone, QrCode, X, Cloud, Users, ShieldCheck } from 'lucide-react';
import { CoupleProfile, DateItem, TimeCapsule, DateChallenge } from '../types/date';
import { SleepingChicksLogo } from './SleepingChicksLogo';
import { triggerRomanticConfetti } from '../utils/confetti';

interface CoupleSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CoupleProfile;
  onSaveProfile: (profile: CoupleProfile) => void;
  dates: DateItem[];
  onSaveDates: (dates: DateItem[]) => void;
  capsules: TimeCapsule[];
  onSaveCapsules: (capsules: TimeCapsule[]) => void;
  challenges: DateChallenge[];
  onSaveChallenges: (challenges: DateChallenge[]) => void;
}

export const CoupleSyncModal: React.FC<CoupleSyncModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
  dates,
  onSaveDates,
  capsules,
  onSaveCapsules,
  challenges,
  onSaveChallenges,
}) => {
  const [copied, setCopied] = useState(false);
  const [partnerCodeInput, setPartnerCodeInput] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  // Generate code if none exists
  const currentCode = profile.pairCode || 'SD-' + Math.floor(1000 + Math.random() * 9000);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `¡Hola mi amor! 💕 Únete a nuestro Sweet Date con nuestro Código de Pareja: ${currentCode}\nEntra a la app para ver nuestras citas, recuerdos y planes juntos: ${window.location.origin}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // Push local data to cloud room
  const handlePushSync = async () => {
    setSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch(`/api/sync/${currentCode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          profile: { ...profile, pairCode: currentCode },
          dates,
          capsules,
          challenges,
        }),
      });
      const data = await res.json();
      if (data.success) {
        onSaveProfile({
          ...profile,
          pairCode: currentCode,
          lastSyncedAt: new Date().toISOString(),
        });
        setSyncStatus('¡Tus citas y recuerdos se subieron a la nube con éxito!');
        triggerRomanticConfetti();
      } else {
        setSyncStatus('Error al sincronizar con el servidor.');
      }
    } catch (err) {
      console.error(err);
      setSyncStatus('No se pudo conectar al servidor de sincronización.');
    } finally {
      setSyncing(false);
    }
  };

  // Pull data from partner's code
  const handlePullSync = async (codeToPull: string) => {
    const code = codeToPull.toUpperCase().trim();
    if (!code) return;

    setSyncing(true);
    setSyncStatus(null);
    try {
      const res = await fetch(`/api/sync/${code}`);
      const data = await res.json();
      if (data.success && data.data) {
        const cloudData = data.data;
        if (Array.isArray(cloudData.dates)) onSaveDates(cloudData.dates);
        if (Array.isArray(cloudData.capsules)) onSaveCapsules(cloudData.capsules);
        if (Array.isArray(cloudData.challenges)) onSaveChallenges(cloudData.challenges);
        if (cloudData.profile) {
          onSaveProfile({
            ...profile,
            ...cloudData.profile,
            pairCode: code,
            lastSyncedAt: new Date().toISOString(),
          });
        }
        setSyncStatus(`¡Sincronizado! Se cargaron ${cloudData.dates?.length || 0} citas de tu pareja.`);
        triggerRomanticConfetti();
      } else {
        setSyncStatus('No se encontró información para este código en la nube aún.');
      }
    } catch (err) {
      console.error(err);
      setSyncStatus('No se pudo descargar los datos de la pareja.');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-lg rounded-3xl bg-[#0b1326] border border-slate-700 shadow-2xl p-6 text-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-2xl bg-[#a2dbfc]/15 text-[#a2dbfc] border border-[#a2dbfc]/30">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-sans">
                Vincular Dispositivos en Pareja
              </h2>
              <SleepingChicksLogo className="w-6 h-5" />
            </div>
            <p className="text-xs text-slate-400">
              Sincroniza en tiempo real las citas entre los teléfonos de {profile.partner1} y {profile.partner2}.
            </p>
          </div>
        </div>

        {/* Your Pair Code Card */}
        <div className="p-5 rounded-2xl bg-[#080d1a] border border-slate-800 text-center mb-5">
          <span className="text-xs font-semibold text-slate-400 block mb-2">
            Tu Código Único de Pareja
          </span>

          <div className="inline-flex items-center justify-center gap-3 px-5 py-2.5 rounded-2xl bg-[#0e172e] border-2 border-[#a2dbfc]/40 mb-3 shadow-inner">
            <span className="text-2xl font-mono font-black text-[#a2dbfc] tracking-widest">
              {currentCode}
            </span>
            <button
              onClick={handleCopyCode}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="Copiar código"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed max-w-xs mx-auto mb-3">
            Pásale este código a tu pareja para que lo ingrese en su teléfono y ambos vean los mismos planes.
          </p>

          <div className="flex items-center justify-center gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/90 hover:bg-emerald-600 text-white font-bold text-xs shadow-sm cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Enviar por WhatsApp</span>
            </button>

            <button
              onClick={handlePushSync}
              disabled={syncing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#a2dbfc] text-[#061428] font-black text-xs hover:bg-[#8ecff9] cursor-pointer disabled:opacity-50"
            >
              <Cloud className="w-3.5 h-3.5" />
              <span>{syncing ? 'Subiendo...' : 'Subir a la nube'}</span>
            </button>
          </div>
        </div>

        {/* Enter Partner's Code */}
        <div className="p-4 rounded-2xl bg-[#0e172e] border border-slate-800 mb-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            ¿Tienes el código que te envió tu pareja?
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ej: SD-1234"
              value={partnerCodeInput}
              onChange={(e) => setPartnerCodeInput(e.target.value.toUpperCase())}
              className="flex-1 px-3 py-2 rounded-xl bg-[#080d1a] border border-slate-700 text-xs font-mono uppercase text-slate-200 focus:outline-hidden focus:border-[#a2dbfc]"
            />
            <button
              onClick={() => handlePullSync(partnerCodeInput)}
              disabled={syncing || !partnerCodeInput.trim()}
              className="px-4 py-2 rounded-xl bg-[#a2dbfc] text-[#061428] font-black text-xs hover:bg-[#8ecff9] disabled:opacity-50 cursor-pointer"
            >
              Vincular y Bajar
            </button>
          </div>
        </div>

        {/* Sync Status Banner */}
        {syncStatus && (
          <div className="mb-4 p-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-sky-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{syncStatus}</span>
          </div>
        )}

        {profile.lastSyncedAt && (
          <div className="text-center text-[10px] text-slate-500">
            Última sincronización: {new Date(profile.lastSyncedAt).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};
