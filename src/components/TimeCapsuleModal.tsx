import React, { useState } from 'react';
import { Hourglass, Lock, Unlock, Plus, X, Calendar, Heart, Sparkles, Send } from 'lucide-react';
import { TimeCapsule, CoupleProfile } from '../types/date';
import { triggerRomanticConfetti } from '../utils/confetti';
import { SleepingChicksLogo } from './SleepingChicksLogo';

interface TimeCapsuleModalProps {
  isOpen: boolean;
  onClose: () => void;
  capsules: TimeCapsule[];
  onSaveCapsules: (updated: TimeCapsule[]) => void;
  profile: CoupleProfile;
}

export const TimeCapsuleModal: React.FC<TimeCapsuleModalProps> = ({
  isOpen,
  onClose,
  capsules,
  onSaveCapsules,
  profile,
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [openedCapsuleId, setOpenedCapsuleId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [unlockDate, setUnlockDate] = useState('');
  const [author, setAuthor] = useState(profile.partner1 || 'Amor 1');

  if (!isOpen) return null;

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim() || !unlockDate) return;

    const newCapsule: TimeCapsule = {
      id: 'tc-' + Date.now(),
      title: title.trim(),
      message: message.trim(),
      unlockDate,
      author,
      createdAt: new Date().toISOString(),
    };

    onSaveCapsules([newCapsule, ...capsules]);
    setTitle('');
    setMessage('');
    setUnlockDate('');
    setIsCreating(false);
    triggerRomanticConfetti();
  };

  const now = new Date();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-2xl rounded-3xl bg-[#0b1326] border border-slate-700 shadow-2xl p-6 text-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-6 pr-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#a2dbfc]/15 text-[#a2dbfc] border border-[#a2dbfc]/30">
              <Hourglass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  Cápsulas del Tiempo
                </h2>
                <SleepingChicksLogo className="w-6 h-5" />
              </div>
              <p className="text-xs text-slate-400">
                Cartas y mensajes secretos de amor sellados hasta una fecha especial o aniversario.
              </p>
            </div>
          </div>

          {!isCreating && (
            <button
              onClick={() => setIsCreating(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#a2dbfc] text-[#061428] text-xs font-black hover:bg-[#8ecff9] transition-all cursor-pointer shadow-md shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Sellar Carta</span>
            </button>
          )}
        </div>

        {/* Create Form */}
        {isCreating && (
          <form onSubmit={handleCreate} className="mb-6 p-4 rounded-2xl bg-[#080d1a] border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-[#a2dbfc] flex items-center gap-1.5">
              <Lock className="w-4 h-4" />
              <span>Sellar un Mensaje para el Futuro</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Título del secreto o motivo
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Para nuestro próximo aniversario, Para cuando estemos tristes..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0e172e] border border-slate-700 text-xs text-slate-200 focus:outline-hidden focus:border-[#a2dbfc]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fecha de Desbloqueo
                </label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={unlockDate}
                  onChange={(e) => setUnlockDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e172e] border border-slate-700 text-xs text-slate-200 focus:outline-hidden focus:border-[#a2dbfc]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Escrito por
                </label>
                <select
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#0e172e] border border-slate-700 text-xs text-slate-200 focus:outline-hidden focus:border-[#a2dbfc]"
                >
                  <option value={profile.partner1}>{profile.partner1}</option>
                  <option value={profile.partner2}>{profile.partner2}</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mensaje de Amor (Permanecerá oculto e inaccesible hasta ese día)
              </label>
              <textarea
                required
                rows={4}
                placeholder="Escribe lo que sientes hoy por esa persona especial, una promesa o un recuerdo que te emociona..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#0e172e] border border-slate-700 text-xs text-slate-200 focus:outline-hidden focus:border-[#a2dbfc] resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#a2dbfc] text-[#061428] text-xs font-black hover:bg-[#8ecff9]"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Sellar en la Cápsula</span>
              </button>
            </div>
          </form>
        )}

        {/* Capsules List */}
        <div className="space-y-3.5 max-h-[420px] overflow-y-auto pr-1">
          {capsules.length === 0 && !isCreating && (
            <div className="text-center py-10 text-slate-400 text-xs">
              <Hourglass className="w-10 h-10 mx-auto text-slate-600 mb-2" />
              Aún no han sellado cápsulas del tiempo. ¡Sorprende a tu pareja escribiendo una carta para el futuro!
            </div>
          )}

          {capsules.map((capsule) => {
            const targetDate = new Date(capsule.unlockDate + 'T23:59:59');
            const isUnlocked = now >= targetDate;
            const diffDays = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            const isReadModalOpen = openedCapsuleId === capsule.id;

            return (
              <div
                key={capsule.id}
                className="p-4 rounded-2xl bg-[#0e172e] border border-slate-800 hover:border-slate-700 transition-all shadow-sm"
              >
                <div className="flex items-center justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`p-1.5 rounded-xl border ${
                        isUnlocked
                          ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/40'
                          : 'bg-amber-950/70 text-amber-300 border-amber-500/40'
                      }`}
                    >
                      {isUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                    </span>
                    <div>
                      <h4 className="text-sm font-bold text-white">
                        {capsule.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        De: <strong className="text-slate-200">{capsule.author}</strong> · Sellada el {new Date(capsule.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold border ${
                        isUnlocked
                          ? 'text-emerald-300 bg-emerald-950/70 border-emerald-500/40'
                          : 'text-amber-300 bg-amber-950/70 border-amber-500/40'
                      }`}
                    >
                      {isUnlocked ? '¡Lista para abrir!' : `Faltan ${diffDays} días`}
                    </span>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Apertura: {new Date(capsule.unlockDate + 'T00:00:00').toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Content View */}
                {isUnlocked ? (
                  <div className="mt-3 pt-3 border-t border-slate-800">
                    <button
                      onClick={() => setOpenedCapsuleId(isReadModalOpen ? null : capsule.id)}
                      className="text-xs font-bold text-[#a2dbfc] hover:underline cursor-pointer flex items-center gap-1"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isReadModalOpen ? 'Ocultar mensaje' : 'Leer mensaje secreto'}</span>
                    </button>

                    {isReadModalOpen && (
                      <div className="mt-2.5 p-3.5 rounded-xl bg-[#120f26] border border-purple-800/60 text-purple-100 text-xs leading-relaxed italic font-script text-base">
                        "{capsule.message}"
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-2 text-[11px] text-slate-500 italic flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>Contenido protegido con sello hermético hasta la fecha programada.</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
