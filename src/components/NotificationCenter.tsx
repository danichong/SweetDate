import React, { useState } from 'react';
import { Bell, Calendar, Sparkles, Heart, Check, X } from 'lucide-react';
import { DateItem, CoupleProfile } from '../types/date';
import { getRelativeTimeTag } from '../utils/formatters';

interface NotificationCenterProps {
  dates: DateItem[];
  profile: CoupleProfile;
}

interface NotificationItem {
  id: string;
  type: 'today' | 'upcoming' | 'memory' | 'anniversary';
  title: string;
  message: string;
  time: string;
  dateItem?: DateItem;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({ dates, profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  // Generate real notifications based on active dates
  const notifications: NotificationItem[] = [];

  dates.forEach((d) => {
    if (d.status === 'pending') {
      const rel = getRelativeTimeTag(d.dateTime);
      if (rel.isToday) {
        notifications.push({
          id: `today-${d.id}`,
          type: 'today',
          title: '¡Hoy es el día de su cita! 🎉',
          message: `${d.title}${d.location ? ` en ${d.location}` : ''}. ¡A disfrutar juntos!`,
          time: 'Hoy',
          dateItem: d,
        });
      } else if (!rel.isPast && rel.text.includes('días')) {
        notifications.push({
          id: `upcoming-${d.id}`,
          type: 'upcoming',
          title: 'Próxima cita planeada',
          message: `${d.title} (${rel.text})`,
          time: rel.text,
          dateItem: d,
        });
      }
    }
  });

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  const handleMarkAllRead = () => {
    setReadIds(new Set(notifications.map((n) => n.id)));
  };

  const handleRequestPush = async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        new Notification('Sweet Date 💕', {
          body: `¡Notificaciones activadas para ${profile.partner1} & ${profile.partner2}!`,
          icon: '/pwa-192x192.png',
        });
      }
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-xl text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 transition-colors cursor-pointer border border-slate-700/80"
        title="Centro de notificaciones de citas"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-black text-[9px] flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-11 z-50 w-80 sm:w-96 rounded-2xl bg-[#0b1326] border border-slate-700 shadow-2xl p-4 text-slate-100 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-1.5 font-bold text-xs text-white">
                <Bell className="w-3.5 h-3.5 text-[#a2dbfc]" />
                <span>Avisos de Citas</span>
                {unreadCount > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#a2dbfc]/20 text-[#a2dbfc] text-[10px]">
                    {unreadCount} nuevos
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-slate-400 hover:text-slate-200 cursor-pointer"
                  >
                    Marcar leídos
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="py-2 space-y-2 max-h-72 overflow-y-auto pr-1">
              {notifications.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  No hay avisos pendientes por ahora. ¡Todo al día! ✨
                </div>
              ) : (
                notifications.map((item) => (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-xl border text-xs transition-colors ${
                      item.type === 'today'
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                        : 'bg-[#0e172e] border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-bold flex items-center gap-1 text-white">
                        {item.type === 'today' ? '🌟' : '📅'} {item.title}
                      </span>
                      <span className="text-[10px] text-slate-400">{item.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-snug">
                      {item.message}
                    </p>
                  </div>
                ))
              )}
            </div>

            <div className="pt-2.5 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Notificaciones de escritorio:</span>
              <button
                onClick={handleRequestPush}
                className="text-[#a2dbfc] hover:underline font-bold cursor-pointer"
              >
                Activar Push
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
