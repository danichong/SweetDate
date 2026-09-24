export function formatCurrency(amount: number, currencySymbol: string = 'S/'): string {
  const formattedNumber = amount.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${currencySymbol} ${formattedNumber}`;
}

export function formatDateLabel(isoString?: string): string {
  if (!isoString) return 'Sin fecha programada';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    };
    return date.toLocaleDateString('es-ES', options);
  } catch {
    return isoString;
  }
}

export function getRelativeTimeTag(isoString?: string): { text: string; isPast: boolean; isToday: boolean } {
  if (!isoString) return { text: 'Por definir', isPast: false, isToday: false };
  try {
    const target = new Date(isoString);
    if (isNaN(target.getTime())) return { text: '', isPast: false, isToday: false };

    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfTarget = new Date(target.getFullYear(), target.getMonth(), target.getDate());

    const diffDays = Math.round((startOfTarget.getTime() - startOfToday.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return { text: '¡Hoy!', isPast: false, isToday: true };
    }
    if (diffDays === 1) {
      return { text: 'Mañana', isPast: false, isToday: false };
    }
    if (diffDays === -1) {
      return { text: 'Ayer', isPast: true, isToday: false };
    }
    if (diffDays > 1 && diffDays <= 7) {
      return { text: `En ${diffDays} días`, isPast: false, isToday: false };
    }
    if (diffDays > 7) {
      return { text: `En ${diffDays} días`, isPast: false, isToday: false };
    }
    return { text: `Hace ${Math.abs(diffDays)} días`, isPast: true, isToday: false };
  } catch {
    return { text: '', isPast: false, isToday: false };
  }
}

export function calculateDaysTogether(startDateStr?: string): number | null {
  if (!startDateStr) return null;
  try {
    const start = new Date(startDateStr);
    if (isNaN(start.getTime())) return null;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  } catch {
    return null;
  }
}
