import React from 'react';
import {
  Sparkles,
  Plus,
  Dice5,
  Settings2,
  Image as ImageIcon,
  CalendarDays,
  Wand2,
  Gift,
  Award,
  Hourglass,
  Users,
  Film,
} from 'lucide-react';
import { CoupleProfile, DateItem } from '../types/date';
import { SleepingChicksLogo } from './SleepingChicksLogo';
import { NotificationCenter } from './NotificationCenter';

interface HeaderProps {
  profile: CoupleProfile;
  activeTab: 'dates' | 'memories';
  setActiveTab: (tab: 'dates' | 'memories') => void;
  onOpenNewDate: () => void;
  onOpenRandomizer: () => void;
  onOpenSettings: () => void;
  onOpenAIInspire: () => void;
  onOpenChallenges: () => void;
  onOpenBadges: () => void;
  onOpenCapsules: () => void;
  onOpenSync: () => void;
  onOpenWrapped: () => void;
  pendingCount: number;
  completedCount: number;
  dates: DateItem[];
}

export const Header: React.FC<HeaderProps> = ({
  profile,
  activeTab,
  setActiveTab,
  onOpenNewDate,
  onOpenRandomizer,
  onOpenSettings,
  onOpenAIInspire,
  onOpenChallenges,
  onOpenBadges,
  onOpenCapsules,
  onOpenSync,
  onOpenWrapped,
  pendingCount,
  completedCount,
  dates,
}) => {
  // Calculate days together if startDate is present
  const daysTogether = React.useMemo(() => {
    if (!profile.startDate) return null;
    try {
      const start = new Date(profile.startDate);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    } catch {
      return null;
    }
  }, [profile.startDate]);

  return (
    <header className="sticky top-0 z-30 bg-[#0c1527]/95 backdrop-blur-md border-b border-slate-800/80 shadow-md shadow-black/20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-3 pb-2.5">
        {/* Main Header Row */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo and Couple Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative flex items-center justify-center px-2 py-1.5 rounded-2xl bg-[#080e1c] border border-slate-700/80 shadow-md shadow-black/30 hover:border-[#b892ff]/50 transition-colors">
                <SleepingChicksLogo className="w-11 h-8 sm:w-12 sm:h-9" />
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <h1 className="font-lettering text-3xl sm:text-4xl font-bold text-[#a2dbfc] leading-none drop-shadow-sm tracking-wide">
                    Sweet Date
                  </h1>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                  <span className="font-semibold text-slate-200">
                    {profile.partner1} & {profile.partner2}
                  </span>
                  {daysTogether !== null && (
                    <>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="text-[#a2dbfc] font-medium">
                        {daysTogether} días juntos 💕
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile Actions: Notifications & Settings */}
            <div className="flex items-center gap-1.5 md:hidden">
              <NotificationCenter dates={dates} profile={profile} />
              <button
                onClick={onOpenSettings}
                aria-label="Configuración de pareja"
                className="p-2 text-[#a2dbfc]/80 hover:text-[#a2dbfc] bg-[#a2dbfc]/10 hover:bg-[#a2dbfc]/20 border border-[#a2dbfc]/20 rounded-xl backdrop-blur-xs transition-colors cursor-pointer"
                title="Configuración"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Tabs: Citas vs Recuerdos */}
          <div className="flex items-center justify-between sm:justify-center gap-2">
            <div className="flex items-center p-1 bg-[#080e1c]/80 rounded-xl border border-slate-800 backdrop-blur-xs">
              <button
                type="button"
                onClick={() => setActiveTab('dates')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'dates'
                    ? 'bg-[#a2dbfc]/20 text-[#a2dbfc] border border-[#a2dbfc]/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <CalendarDays className="w-4 h-4 text-[#a2dbfc]" />
                <span>Nuestros Planes</span>
                <span className="text-[11px] px-1.5 py-0.2 bg-[#a2dbfc]/20 text-[#a2dbfc] border border-[#a2dbfc]/40 rounded-full font-bold ml-1">
                  {pendingCount}
                </span>
              </button>
              
              <button
                type="button"
                onClick={() => setActiveTab('memories')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-lg transition-all cursor-pointer ${
                  activeTab === 'memories'
                    ? 'bg-[#a2dbfc]/20 text-[#a2dbfc] border border-[#a2dbfc]/40 shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-[#a2dbfc]" />
                <span>Recuerdos</span>
                <span className="text-[11px] px-1.5 py-0.2 bg-[#a2dbfc]/20 text-[#a2dbfc] border border-[#a2dbfc]/40 rounded-full font-bold ml-1">
                  {completedCount}
                </span>
              </button>
            </div>
          </div>

          {/* Desktop Right Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenRandomizer}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#a2dbfc] bg-[#a2dbfc]/15 hover:bg-[#a2dbfc]/25 border border-[#a2dbfc]/30 rounded-xl backdrop-blur-xs transition-all active:scale-95 cursor-pointer shadow-sm shadow-[#a2dbfc]/5"
              title="¿Qué hacemos hoy? Elegir un plan al azar"
            >
              <Dice5 className="w-3.5 h-3.5 text-[#a2dbfc]" />
              <span>Ruleta</span>
            </button>

            <button
              onClick={onOpenAIInspire}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-bold text-[#b892ff] bg-[#b892ff]/15 hover:bg-[#b892ff]/25 border border-[#b892ff]/40 rounded-xl backdrop-blur-xs transition-all active:scale-95 cursor-pointer shadow-sm"
              title="Generador inteligente de citas con IA"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#b892ff]" />
              <span>Inspírenme ✨</span>
            </button>

            <button
              onClick={onOpenNewDate}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-black text-[#061428] bg-[#a2dbfc]/90 hover:bg-[#a2dbfc] border border-[#a2dbfc]/50 rounded-xl backdrop-blur-xs shadow-md shadow-[#a2dbfc]/20 transition-all active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Nueva Cita</span>
            </button>

            <div className="hidden md:flex items-center gap-1.5">
              <NotificationCenter dates={dates} profile={profile} />

              <button
                onClick={onOpenSettings}
                aria-label="Configuración de pareja y moneda"
                className="p-2 text-[#a2dbfc]/80 hover:text-[#a2dbfc] bg-[#a2dbfc]/10 hover:bg-[#a2dbfc]/20 border border-[#a2dbfc]/20 rounded-xl backdrop-blur-xs transition-colors cursor-pointer"
                title="Configuración de pareja y moneda"
              >
                <Settings2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Sub-Bar (Gamification, Sync, Challenges, Capsules & Wrapped) */}
        <div className="mt-2.5 pt-2 border-t border-slate-800/70 flex items-center justify-start sm:justify-between gap-1.5 overflow-x-auto no-scrollbar text-xs">
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onOpenChallenges}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 font-semibold cursor-pointer text-[11px]"
            >
              <Gift className="w-3.5 h-3.5 text-amber-400" />
              <span>30 Retos (Raspa)</span>
            </button>

            <button
              onClick={onOpenBadges}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 font-semibold cursor-pointer text-[11px]"
            >
              <Award className="w-3.5 h-3.5 text-rose-400" />
              <span>Insignias</span>
            </button>

            <button
              onClick={onOpenCapsules}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 font-semibold cursor-pointer text-[11px]"
            >
              <Hourglass className="w-3.5 h-3.5 text-[#b892ff]" />
              <span>Cápsula del Tiempo</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onOpenSync}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[#a2dbfc] bg-[#a2dbfc]/10 hover:bg-[#a2dbfc]/20 border border-[#a2dbfc]/30 font-bold cursor-pointer text-[11px]"
              title="Vincular con el teléfono de tu pareja por código"
            >
              <Users className="w-3.5 h-3.5" />
              <span>Vincular Pareja</span>
              {profile.pairCode && (
                <span className="text-[10px] font-mono text-[#a2dbfc] font-bold">({profile.pairCode})</span>
              )}
            </button>

            <button
              onClick={onOpenWrapped}
              className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-[#b892ff] bg-[#b892ff]/10 hover:bg-[#b892ff]/20 border border-[#b892ff]/30 font-bold cursor-pointer text-[11px]"
              title="Resumen anual de nuestra historia de amor"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Wrapped 💕</span>
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
