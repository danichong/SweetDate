import React from 'react';
import { Sparkles, Calendar, Wallet, CheckCircle2, HeartHandshake } from 'lucide-react';
import { DateItem } from '../types/date';
import { formatCurrency } from '../utils/formatters';

interface MetricsBarProps {
  dates: DateItem[];
  currency: string;
}

export const MetricsBar: React.FC<MetricsBarProps> = ({ dates, currency }) => {
  const stats = React.useMemo(() => {
    const total = dates.length;
    const completed = dates.filter((d) => d.status === 'completed');
    const pending = dates.filter((d) => d.status === 'pending');

    const completedCount = completed.length;
    const pendingCount = pending.length;

    const pendingBudget = pending.reduce((sum, item) => sum + (Number(item.budget) || 0), 0);
    const investedBudget = completed.reduce((sum, item) => sum + (Number(item.budget) || 0), 0);

    const completionRate = total > 0 ? Math.round((completedCount / total) * 100) : 0;

    return {
      total,
      completedCount,
      pendingCount,
      pendingBudget,
      investedBudget,
      completionRate,
    };
  }, [dates]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
      
      {/* 1. Planes y Progreso */}
      <div className="bg-[#0e172e] rounded-2xl p-4 border border-slate-800/90 shadow-md shadow-black/20 hover:border-[#a2dbfc]/40 transition-all relative overflow-hidden">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Citas Planeadas</span>
          <div className="p-2 rounded-xl bg-[#a2dbfc]/15 text-[#a2dbfc] border border-[#a2dbfc]/30">
            <Calendar className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-white tracking-tight">{stats.total}</span>
          <span className="text-xs text-[#a2dbfc] font-semibold">
            {stats.completedCount} completadas
          </span>
        </div>
        {/* Progress bar */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>{stats.completionRate}% de planes vividos</span>
          </div>
          <div className="w-full h-2 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
            <div
              className="h-full bg-[#a2dbfc] rounded-full transition-all duration-500 shadow-xs shadow-[#a2dbfc]/30"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Citas Pendientes */}
      <div className="bg-[#0e172e] rounded-2xl p-4 border border-slate-800/90 shadow-md shadow-black/20 hover:border-[#a2dbfc]/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Por Disfrutar</span>
          <div className="p-2 rounded-xl bg-[#a2dbfc]/15 text-[#a2dbfc] border border-[#a2dbfc]/30">
            <Sparkles className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-black text-[#a2dbfc] tracking-tight">{stats.pendingCount}</span>
          <span className="text-xs text-[#a2dbfc]/80 font-semibold">aventuras en lista</span>
        </div>
        <p className="mt-3 text-[11px] text-slate-400 truncate">
          {stats.pendingCount > 0
            ? '¡Elige una y sorprendan su rutina!'
            : '¡Todo completado! Añade nuevos planes.'}
        </p>
      </div>

      {/* 3. Presupuesto Pendiente */}
      <div className="bg-[#0e172e] rounded-2xl p-4 border border-slate-800/90 shadow-md shadow-black/20 hover:border-[#a2dbfc]/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Presupuesto Pendiente</span>
          <div className="p-2 rounded-xl bg-[#a2dbfc]/15 text-[#a2dbfc] border border-[#a2dbfc]/30">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {formatCurrency(stats.pendingBudget, currency)}
          </span>
        </div>
        <p className="mt-3 text-[11px] text-slate-400">
          Estimado para {stats.pendingCount} planes
        </p>
      </div>

      {/* 4. Dinero Invertido en Recuerdos */}
      <div className="bg-[#0e172e] rounded-2xl p-4 border border-slate-800/90 shadow-md shadow-black/20 hover:border-emerald-500/40 transition-all">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-400">Inversión en Amor</span>
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2">
          <span className="text-xl sm:text-2xl font-black text-emerald-300 tracking-tight">
            {formatCurrency(stats.investedBudget, currency)}
          </span>
        </div>
        <p className="mt-3 text-[11px] text-emerald-300/80 font-semibold flex items-center gap-1">
          <HeartHandshake className="w-3.5 h-3.5 inline" />
          Invertido en {stats.completedCount} memorias inolvidables
        </p>
      </div>

    </div>
  );
};
