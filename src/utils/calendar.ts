import { DateItem } from '../types/date';

export function getGoogleCalendarUrl(dateItem: DateItem): string {
  const title = encodeURIComponent(dateItem.title);
  const details = encodeURIComponent(
    `Cita romántica de Sweet Date\nPresupuesto: S/ ${dateItem.budget}\n${dateItem.dressCode ? `Vestimenta: ${dateItem.dressCode}\n` : ''}${dateItem.notes ? `Notas: ${dateItem.notes}\n` : ''}`
  );
  const location = encodeURIComponent(dateItem.location || '');

  // Format date to YYYYMMDDTHHmmssZ
  let start = new Date(dateItem.dateTime);
  if (isNaN(start.getTime())) {
    start = new Date();
  }
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000); // 2 hours duration by default

  const formatGCal = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${formatGCal(start)}/${formatGCal(end)}`;
}

export function downloadIcsFile(dateItem: DateItem): void {
  const start = new Date(dateItem.dateTime);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const formatIcsDate = (d: Date) => d.toISOString().replace(/-|:|\.\d+/g, '');

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sweet Date//Citas Pareja//ES',
    'BEGIN:VEVENT',
    `UID:${dateItem.id}@sweetdate.app`,
    `DTSTAMP:${formatIcsDate(new Date())}`,
    `DTSTART:${formatIcsDate(start)}`,
    `DTEND:${formatIcsDate(end)}`,
    `SUMMARY:${dateItem.title}`,
    `DESCRIPTION:${(dateItem.notes || 'Cita planeada en Sweet Date').replace(/\n/g, '\\n')}`,
    `LOCATION:${dateItem.location || ''}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `SweetDate-${dateItem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
