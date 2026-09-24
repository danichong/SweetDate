import React, { useState } from 'react';
import { Sparkles, X, Wand2, Plus, Check, Compass, DollarSign, Heart, MapPin, Shirt } from 'lucide-react';
import { DateCategory, DateItem } from '../types/date';
import { CATEGORIES } from '../utils/categories';
import { SleepingChicksLogo } from './SleepingChicksLogo';

interface AIInspireModalProps {
  isOpen: boolean;
  onClose: () => void;
  currency: string;
  partner1: string;
  partner2: string;
  onAddDate: (newDate: Omit<DateItem, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

interface IdeaItem {
  title: string;
  description: string;
  category: DateCategory;
  estimatedBudget: number;
  dressCode?: string;
  location?: string;
  romanticTip?: string;
}

export const AIInspireModal: React.FC<AIInspireModalProps> = ({
  isOpen,
  onClose,
  currency,
  partner1,
  partner2,
  onAddDate,
}) => {
  const [category, setCategory] = useState<string>('todas');
  const [budget, setBudget] = useState<number>(40);
  const [vibe, setVibe] = useState<string>('romántico e íntimo');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [ideas, setIdeas] = useState<IdeaItem[]>([]);
  const [addedIndexes, setAddedIndexes] = useState<Set<number>>(new Set());

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setLoading(true);
    setAddedIndexes(new Set());
    try {
      const res = await fetch('/api/ai/inspire-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: category === 'todas' ? undefined : category,
          budget,
          currency,
          partner1,
          partner2,
          occasion: vibe,
          notes: customNotes,
        }),
      });
      const data = await res.json();
      if (data.ideas && Array.isArray(data.ideas)) {
        setIdeas(data.ideas);
      }
    } catch (err) {
      console.error('Error generating AI ideas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddIdea = (idea: IdeaItem, index: number) => {
    // Tomorrow at 19:00 by default
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(19, 0, 0, 0);

    onAddDate({
      title: idea.title,
      category: (idea.category as DateCategory) || 'comida',
      dateTime: tomorrow.toISOString().slice(0, 16),
      budget: Number(idea.estimatedBudget) || budget,
      location: idea.location || '',
      dressCode: idea.dressCode || '',
      notes: `${idea.description}${idea.romanticTip ? `\n💡 Tip romántico: ${idea.romanticTip}` : ''}`,
      status: 'pending',
    });

    setAddedIndexes((prev) => new Set(prev).add(index));
  };

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
        <div className="flex items-center gap-3 mb-5">
          <div className="p-2.5 rounded-2xl bg-[#a2dbfc]/15 text-[#a2dbfc] border border-[#a2dbfc]/30">
            <Wand2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white font-sans">
                Inspírenme con IA
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-[#b892ff]/20 text-[#b892ff] text-[10px] font-bold border border-[#b892ff]/40">
                Gemini AI
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Ideas mágicas y personalizadas para que {partner1} y {partner2} nunca se queden sin planes.
            </p>
          </div>
        </div>

        {/* Control Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 p-4 rounded-2xl bg-[#080d1a] border border-slate-800/80">
          {/* Category */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Tipo de plan
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0e172e] border border-slate-700 text-xs text-slate-200 focus:outline-hidden focus:border-[#a2dbfc]"
            >
              <option value="todas">✨ Sorpréndannos con cualquier categoría</option>
              {Object.values(CATEGORIES).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Budget */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex justify-between">
              <span>Presupuesto aprox.</span>
              <span className="text-[#a2dbfc] font-bold">{currency} {budget}</span>
            </label>
            <input
              type="range"
              min="0"
              max="200"
              step="5"
              value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="w-full accent-[#a2dbfc] cursor-pointer"
            />
          </div>

          {/* Vibe */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Vibra o estilo
            </label>
            <select
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0e172e] border border-slate-700 text-xs text-slate-200 focus:outline-hidden focus:border-[#a2dbfc]"
            >
              <option value="romántico e íntimo">🕯️ Romántico e Íntimo</option>
              <option value="divertido y juegos">🎲 Divertido, Risas y Juegos</option>
              <option value="relajado en casa">🛋️ Cómodo y Acogedor en Casa</option>
              <option value="aventurero y aire libre">🌿 Aventura y Exploración</option>
              <option value="económico pero memorable">💡 Económico pero muy Tierno</option>
            </select>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Detalle opcional (ej. nos gusta el sushi, picnic...)
            </label>
            <input
              type="text"
              placeholder="Ej: algo dulce al atardecer..."
              value={customNotes}
              onChange={(e) => setCustomNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#0e172e] border border-slate-700 text-xs text-slate-200 focus:outline-hidden focus:border-[#a2dbfc]"
            />
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center mb-6">
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#a2dbfc] text-[#061428] text-xs font-black hover:bg-[#8ecff9] transition-all shadow-md shadow-[#a2dbfc]/20 active:scale-95 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-[#061428] border-t-transparent rounded-full animate-spin" />
                <span>Creando planes con amor...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-[#061428]" />
                <span>Generar 3 Ideas Únicas</span>
              </>
            )}
          </button>
        </div>

        {/* Results */}
        {loading && (
          <div className="py-12 text-center flex flex-col items-center justify-center">
            <SleepingChicksLogo className="w-16 h-12 mb-3 animate-pulse" />
            <p className="text-xs text-[#a2dbfc] font-semibold">
              Los pollitos están soñando su próxima cita perfecta...
            </p>
          </div>
        )}

        {!loading && ideas.length > 0 && (
          <div className="space-y-3.5 max-h-[380px] overflow-y-auto pr-1">
            {ideas.map((idea, index) => {
              const isAdded = addedIndexes.has(index);
              const catInfo = CATEGORIES[idea.category] || CATEGORIES.comida;

              return (
                <div
                  key={index}
                  className="p-4 rounded-2xl bg-[#0e172e] border border-slate-800 hover:border-[#b892ff]/50 transition-all flex flex-col justify-between gap-3 shadow-sm"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs font-bold text-[#b892ff] flex items-center gap-1">
                        <span>{catInfo.icon}</span>
                        <span>{catInfo.name}</span>
                        <span className="text-slate-600">·</span>
                        <span className="text-sky-300">{currency} {idea.estimatedBudget}</span>
                      </span>

                      <button
                        onClick={() => handleAddIdea(idea, index)}
                        disabled={isAdded}
                        className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40 cursor-default'
                            : 'bg-[#a2dbfc]/20 text-[#a2dbfc] hover:bg-[#a2dbfc] hover:text-[#061428] border border-[#a2dbfc]/40'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>¡Agregada!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Añadir a citas</span>
                          </>
                        )}
                      </button>
                    </div>

                    <h4 className="text-sm font-bold text-white mb-1">
                      {idea.title}
                    </h4>

                    <p className="text-xs text-slate-300 leading-relaxed mb-2">
                      {idea.description}
                    </p>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
                      {idea.location && (
                        <span className="flex items-center gap-1 text-slate-300 bg-[#080d1a] px-2 py-0.5 rounded-md border border-slate-800">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          <span>{idea.location}</span>
                        </span>
                      )}
                      {idea.dressCode && (
                        <span className="flex items-center gap-1 text-slate-300 bg-[#080d1a] px-2 py-0.5 rounded-md border border-slate-800">
                          <Shirt className="w-3 h-3 text-indigo-400" />
                          <span>{idea.dressCode}</span>
                        </span>
                      )}
                    </div>

                    {idea.romanticTip && (
                      <div className="mt-2 text-xs text-purple-300 italic bg-purple-950/40 border border-purple-900/50 p-2 rounded-xl flex items-start gap-1.5">
                        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 shrink-0 mt-0.5" />
                        <span>{idea.romanticTip}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {!loading && ideas.length === 0 && (
          <div className="text-center py-6 text-slate-400 text-xs">
            Selecciona sus preferencias y presiona "Generar 3 Ideas Únicas" para inspirarse.
          </div>
        )}
      </div>
    </div>
  );
};
