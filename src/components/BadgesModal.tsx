import React from 'react';
import { Award, X, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { DateItem, CoupleProfile, DateChallenge } from '../types/date';
import { calculateDaysTogether } from '../utils/formatters';
import { SleepingChicksLogo } from './SleepingChicksLogo';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  dates: DateItem[];
  profile: CoupleProfile;
  challenges: DateChallenge[];
}

interface BadgeDef {
  id: string;
  title: string;
  icon: string;
  description: string;
  isUnlocked: boolean;
  currentValue: number;
  targetValue: number;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  dates,
  profile,
  challenges,
}) => {
  if (!isOpen) return null;

  const completedDates = dates.filter((d) => d.status === 'completed');
  const foodDates = completedDates.filter((d) => d.category === 'comida').length;
  const travelDates = completedDates.filter((d) => d.category === 'viajes').length;
  const outdoorDates = completedDates.filter((d) => d.category === 'aire_libre').length;
  const homeDates = completedDates.filter((d) => d.category === 'casa').length;
  const memoriesCount = dates.filter((d) => d.memory?.photoUrl || (d.memory?.photoUrls && d.memory.photoUrls.length > 0)).length;
  const revealedChallenges = challenges.filter((c) => c.isRevealed).length;
  const daysTogether = calculateDaysTogether(profile.startDate) || 0;

  const badges: BadgeDef[] = [
    {
      id: 'gourmet',
      title: 'Gourmets del Amor',
      icon: '🍽️',
      description: 'Completar 3 citas gastronómicas o cenas juntos.',
      isUnlocked: foodDates >= 3,
      currentValue: foodDates,
      targetValue: 3,
    },
    {
      id: 'globetrotters',
      title: 'Trotamundos',
      icon: '✈️',
      description: 'Realizar 2 escapadas o viajes románticos.',
      isUnlocked: travelDates >= 2,
      currentValue: travelDates,
      targetValue: 2,
    },
    {
      id: 'nature',
      title: 'Amantes del Aire Libre',
      icon: '🌿',
      description: 'Disfrutar 3 citas en parques, picnics o naturaleza.',
      isUnlocked: outdoorDates >= 3,
      currentValue: outdoorDates,
      targetValue: 3,
    },
    {
      id: 'homebirds',
      title: 'Nidito de Amor',
      icon: '🏠',
      description: 'Completar 3 citas acogedoras en casa.',
      isUnlocked: homeDates >= 3,
      currentValue: homeDates,
      targetValue: 3,
    },
    {
      id: 'inseparable',
      title: 'Inseparables',
      icon: '💖',
      description: 'Llegar a 10 citas completadas en total.',
      isUnlocked: completedDates.length >= 10,
      currentValue: completedDates.length,
      targetValue: 10,
    },
    {
      id: 'photogenic',
      title: 'Álbum Enamorado',
      icon: '📸',
      description: 'Guardar 5 recuerdos con foto en el Muro.',
      isUnlocked: memoriesCount >= 5,
      currentValue: memoriesCount,
      targetValue: 5,
    },
    {
      id: 'adventurers',
      title: 'Retadores Intrépidos',
      icon: '🎯',
      description: 'Raspar y revelar 5 retos del 30 Dates Challenge.',
      isUnlocked: revealedChallenges >= 5,
      currentValue: revealedChallenges,
      targetValue: 5,
    },
    {
      id: 'centenary',
      title: '100 Días de Magia',
      icon: '⏳',
      description: 'Cumplir más de 100 días compartiendo sus vidas.',
      isUnlocked: daysTogether >= 100,
      currentValue: daysTogether,
      targetValue: 100,
    },
  ];

  const unlockedCount = badges.filter((b) => b.isUnlocked).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs overflow-y-auto animate-in fade-in">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#0b1326] border border-slate-700 shadow-2xl p-6 text-slate-100 my-8">
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
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">
                Insignias y Logros de Pareja
              </h2>
              <SleepingChicksLogo className="w-6 h-5" />
            </div>
            <p className="text-xs text-slate-400">
              {unlockedCount} de {badges.length} insignias desbloqueadas por {profile.partner1} & {profile.partner2}.
            </p>
          </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
          {badges.map((badge) => {
            const pct = Math.min(100, Math.round((badge.currentValue / badge.targetValue) * 100));

            return (
              <div
                key={badge.id}
                className={`rounded-2xl p-4 border transition-all flex items-start gap-3.5 ${
                  badge.isUnlocked
                    ? 'bg-[#0e172e] border-[#a2dbfc]/40 shadow-sm'
                    : 'bg-[#080d1a] border-slate-800/80 opacity-65'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 border ${
                    badge.isUnlocked
                      ? 'bg-[#a2dbfc]/20 border-[#a2dbfc]/40 text-[#a2dbfc]'
                      : 'bg-slate-800/70 border-slate-700 text-slate-500'
                  }`}
                >
                  {badge.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="text-sm font-bold text-white truncate">
                      {badge.title}
                    </h3>
                    {badge.isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 bg-emerald-950/70 border border-emerald-500/30 px-2 py-0.5 rounded-full shrink-0">
                        <CheckCircle2 className="w-3 h-3" />
                        Logrado
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-500 bg-slate-800 px-2 py-0.5 rounded-full shrink-0">
                        <Lock className="w-3 h-3" />
                        {badge.currentValue}/{badge.targetValue}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-2.5">
                    {badge.description}
                  </p>

                  {/* Progress Bar */}
                  {!badge.isUnlocked && (
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#a2dbfc] rounded-full transition-all duration-300"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
