import React, { useState } from 'react';
import { Sparkles, X, Gift, Check, Plus, Trophy, Lock, Eye } from 'lucide-react';
import { DateChallenge, DateItem } from '../types/date';
import { CATEGORIES } from '../utils/categories';
import { triggerRomanticConfetti } from '../utils/confetti';
import { SleepingChicksLogo } from './SleepingChicksLogo';

interface ChallengesModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenges: DateChallenge[];
  onUpdateChallenges: (updated: DateChallenge[]) => void;
  currency: string;
  onAddDate: (newDate: Omit<DateItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const ChallengesModal: React.FC<ChallengesModalProps> = ({
  isOpen,
  onClose,
  challenges,
  onUpdateChallenges,
  currency,
  onAddDate,
}) => {
  const [filter, setFilter] = useState<'all' | 'revealed' | 'hidden'>('all');

  if (!isOpen) return null;

  const revealedCount = challenges.filter((c) => c.isRevealed).length;
  const progressPercent = Math.round((revealedCount / challenges.length) * 100);

  const handleReveal = (id: string) => {
    triggerRomanticConfetti();
    const updated = challenges.map((c) => (c.id === id ? { ...c, isRevealed: true } : c));
    onUpdateChallenges(updated);
  };

  const handleConvert = (challenge: DateChallenge) => {
    const nextWeekend = new Date();
    nextWeekend.setDate(nextWeekend.getDate() + (6 - nextWeekend.getDay() + 7) % 7 || 7);
    nextWeekend.setHours(19, 0, 0, 0);

    onAddDate({
      title: challenge.title,
      category: challenge.category,
      dateTime: nextWeekend.toISOString().slice(0, 16),
      budget: challenge.budgetEstimated,
      notes: `⭐ Reto #${challenge.number}: ${challenge.description}`,
      status: 'pending',
    });

    const updated = challenges.map((c) => (c.id === challenge.id ? { ...c, isAddedToDates: true } : c));
    onUpdateChallenges(updated);
  };

  const filteredChallenges = challenges.filter((c) => {
    if (filter === 'revealed') return c.isRevealed;
    if (filter === 'hidden') return !c.isRevealed;
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#0b1326] border border-slate-700 shadow-2xl p-6 text-slate-100 my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pr-8">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-[#a2dbfc]/15 text-[#a2dbfc] border border-[#a2dbfc]/30">
              <Gift className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>Retos de Pareja: Raspa y Gana</span>
                <SleepingChicksLogo className="w-6 h-5" />
              </h2>
              <p className="text-xs text-slate-400">
                30 citas secretas para desbloquear juntos y salir de la rutina.
              </p>
            </div>
          </div>

          {/* Progress Pill */}
          <div className="flex items-center gap-3 bg-[#080d1a] px-4 py-2 rounded-2xl border border-slate-800">
            <Trophy className="w-5 h-5 text-amber-400" />
            <div>
              <div className="flex items-center justify-between gap-4 text-xs font-bold text-slate-200">
                <span>{revealedCount} de {challenges.length} descubiertos</span>
                <span className="text-[#a2dbfc]">{progressPercent}%</span>
              </div>
              <div className="w-32 h-1.5 bg-slate-800 rounded-full mt-1 overflow-hidden">
                <div
                  className="h-full bg-[#a2dbfc] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-3">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filter === 'all'
                ? 'bg-[#a2dbfc] text-[#061428]'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            Todos ({challenges.length})
          </button>
          <button
            onClick={() => setFilter('hidden')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filter === 'hidden'
                ? 'bg-[#a2dbfc] text-[#061428]'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            Por Descubrir ({challenges.length - revealedCount})
          </button>
          <button
            onClick={() => setFilter('revealed')}
            className={`px-3 py-1 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
              filter === 'revealed'
                ? 'bg-[#a2dbfc] text-[#061428]'
                : 'text-slate-400 hover:text-white bg-slate-900/60'
            }`}
          >
            Descubiertos ({revealedCount})
          </button>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto pr-1">
          {filteredChallenges.map((item) => {
            const catInfo = CATEGORIES[item.category] || CATEGORIES.comida;

            if (!item.isRevealed) {
              // Scratch/Scratchable card
              return (
                <div
                  key={item.id}
                  onClick={() => handleReveal(item.id)}
                  className="group relative rounded-2xl border border-slate-800 bg-[#0e172e] p-5 flex flex-col justify-between items-center text-center cursor-pointer hover:border-[#a2dbfc]/60 transition-all hover:scale-[1.02] shadow-md"
                >
                  <div className="w-10 h-10 rounded-full bg-slate-800 text-[#a2dbfc] font-bold text-sm flex items-center justify-center mb-3">
                    #{item.number}
                  </div>

                  {/* Shimmering cover */}
                  <div className="w-full py-6 rounded-xl bg-slate-900/80 border border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 group-hover:border-[#a2dbfc]/60 transition-colors">
                    <Sparkles className="w-6 h-6 text-[#a2dbfc] animate-bounce" />
                    <span className="text-xs font-black text-slate-200 uppercase tracking-wider">
                      Toca para Raspar
                    </span>
                    <span className="text-[10px] text-slate-400 italic">
                      "{item.hint}"
                    </span>
                  </div>

                  <div className="mt-3 text-[11px] text-[#a2dbfc] font-semibold flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" />
                    <span>¡Descubran el secreto!</span>
                  </div>
                </div>
              );
            }

            // Revealed Card
            return (
              <div
                key={item.id}
                className="rounded-2xl border border-[#b892ff]/40 bg-[#0e172e] p-5 flex flex-col justify-between shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold text-[#a2dbfc] bg-[#080d1a] px-2 py-0.5 rounded-md border border-slate-800">
                      Reto #{item.number}
                    </span>
                    <span className="text-xs text-[#b892ff] font-semibold flex items-center gap-1">
                      <span>{catInfo.icon}</span>
                      <span>{catInfo.name}</span>
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-xs font-semibold text-sky-300">
                    Aprox. {currency} {item.budgetEstimated}
                  </span>

                  <button
                    onClick={() => handleConvert(item)}
                    disabled={item.isAddedToDates}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      item.isAddedToDates
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-[#a2dbfc] text-[#061428] hover:bg-[#8ecff9] shadow-sm'
                    }`}
                  >
                    {item.isAddedToDates ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Agendado</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-3.5 h-3.5" />
                        <span>Hacer Cita</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
