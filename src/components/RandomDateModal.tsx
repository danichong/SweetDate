import React, { useState, useEffect } from 'react';
import { X, Dice5, Sparkles, Heart, RefreshCw, ArrowRight, MapPin, Calendar, Wallet } from 'lucide-react';
import { DateItem } from '../types/date';
import { CATEGORIES } from '../utils/categories';
import { formatCurrency, formatDateLabel } from '../utils/formatters';
import { triggerRomanticConfetti } from '../utils/confetti';

interface RandomDateModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingDates: DateItem[];
  currency: string;
  onSelectDate: (item: DateItem) => void;
}

export const RandomDateModal: React.FC<RandomDateModalProps> = ({
  isOpen,
  onClose,
  pendingDates,
  currency,
  onSelectDate,
}) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DateItem | null>(null);
  const [displayIndex, setDisplayIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      if (pendingDates.length > 0) {
        startRoulette();
      } else {
        setSelectedItem(null);
      }
    }
  }, [isOpen]);

  const startRoulette = () => {
    if (pendingDates.length === 0) return;

    setIsSpinning(true);
    setSelectedItem(null);

    let speed = 80;
    let step = 0;
    const totalSteps = 24 + Math.floor(Math.random() * 8);

    const interval = setInterval(() => {
      step++;
      const nextIdx = Math.floor(Math.random() * pendingDates.length);
      setDisplayIndex(nextIdx);

      if (step >= totalSteps) {
        clearInterval(interval);
        setIsSpinning(false);
        const finalItem = pendingDates[nextIdx];
        setSelectedItem(finalItem);
        triggerRomanticConfetti();
      }
    }, speed);
  };

  if (!isOpen) return null;

  const currentDisplay = pendingDates[displayIndex];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in">
      <div className="relative w-full max-w-md bg-[#0d162d] rounded-3xl shadow-2xl border border-slate-700/80 overflow-hidden text-center text-slate-100">
        
        {/* Header */}
        <div className="px-6 py-4 bg-[#0a1122]/95 border-b border-[#a2dbfc]/20 text-white flex items-center justify-between shadow-md backdrop-blur-md">
          <div className="flex items-center gap-2">
            <Dice5 className="w-5 h-5 text-[#a2dbfc] animate-spin-slow" />
            <span className="font-bold text-base text-white">¿Qué Hacemos Hoy?</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {pendingDates.length === 0 ? (
            <div className="py-8 space-y-3">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#a2dbfc]/15 border border-[#a2dbfc]/30 flex items-center justify-center text-2xl">
                💌
              </div>
              <h3 className="text-lg font-bold text-white">
                ¡No hay citas pendientes en la lista!
              </h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Crea nuevas ideas de citas juntos para que la ruleta pueda elegir su próxima aventura.
              </p>
            </div>
          ) : (
            <div>
              {/* Status Header */}
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#a2dbfc]/15 border border-[#a2dbfc]/30 text-[#a2dbfc] text-xs font-semibold rounded-full backdrop-blur-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#a2dbfc]" />
                  {isSpinning ? 'Consultando a Cupido...' : '¡El destino ha hablado! 💕'}
                </span>
              </div>

              {/* Slot / Roulette Display Card */}
              <div
                className={`p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden backdrop-blur-xs ${
                  isSpinning
                    ? 'border-[#a2dbfc]/40 bg-[#080e1c] scale-95 blur-[0.3px]'
                    : 'border-[#a2dbfc]/70 bg-[#080e1c] shadow-lg shadow-[#a2dbfc]/10 scale-100'
                }`}
              >
                {currentDisplay && (
                  <div className="space-y-3 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#a2dbfc] flex items-center gap-1.5">
                        <span>{CATEGORIES[currentDisplay.category]?.icon}</span>
                        <span>{CATEGORIES[currentDisplay.category]?.name}</span>
                      </span>
                      <span className="text-xs font-black text-[#a2dbfc]">
                        {formatCurrency(currentDisplay.budget, currency)}
                      </span>
                    </div>

                    <h4 className="text-lg font-bold text-white leading-snug">
                      {currentDisplay.title}
                    </h4>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
                      {currentDisplay.location && (
                        <div className="flex items-center gap-1 text-slate-300">
                          <MapPin className="w-3.5 h-3.5 text-rose-400" />
                          <span className="truncate">{currentDisplay.location}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1 text-slate-300">
                        <Calendar className="w-3.5 h-3.5 text-[#a2dbfc]" />
                        <span>{formatDateLabel(currentDisplay.dateTime)}</span>
                      </div>
                    </div>

                    {currentDisplay.notes && (
                      <p className="text-xs text-slate-300 bg-[#0e172e] border border-slate-800 p-2.5 rounded-xl italic">
                        "{currentDisplay.notes}"
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons with baby blue */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-2 justify-center">
                <button
                  type="button"
                  disabled={isSpinning}
                  onClick={startRoulette}
                  className="w-full sm:w-auto px-4 py-2.5 text-xs font-bold text-[#a2dbfc] bg-[#a2dbfc]/15 hover:bg-[#a2dbfc]/25 border border-[#a2dbfc]/30 rounded-xl backdrop-blur-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-[#a2dbfc] ${isSpinning ? 'animate-spin' : ''}`} />
                  <span>Girar de nuevo</span>
                </button>

                {selectedItem && !isSpinning && (
                  <button
                    type="button"
                    onClick={() => {
                      onSelectDate(selectedItem);
                      onClose();
                    }}
                    className="w-full sm:w-auto px-5 py-2.5 text-xs font-black text-[#061428] bg-[#a2dbfc]/90 hover:bg-[#a2dbfc] border border-[#a2dbfc]/60 rounded-xl backdrop-blur-xs shadow-md shadow-[#a2dbfc]/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                  >
                    <span>¡Hagamos este plan!</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[3]" />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
