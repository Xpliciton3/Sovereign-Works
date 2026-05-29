/** Parse "8:00 AM", "12:30 PM", or "05:30" (24h) to minutes since midnight; null if not parseable. */
export function parsePlannerTimeToMinutes(raw: string): number | null {
  const t = raw.trim();
  if (!t || t.toLowerCase().includes('before')) return null;
  const m12 = t.match(/^(\d{1,2}):(\d{2})\s*(AM|PM)$/i);
  if (m12) {
    let h = parseInt(m12[1], 10);
    const min = parseInt(m12[2], 10);
    const pm = m12[3].toUpperCase() === 'PM';
    if (h === 12) h = pm ? 12 : 0;
    else if (pm) h += 12;
    return h * 60 + min;
  }
  const m24 = t.match(/^(\d{1,2}):(\d{2})$/);
  if (m24) return parseInt(m24[1], 10) * 60 + parseInt(m24[2], 10);
  return null;
}

export function isPlannerTimeLate(timeStr: string): boolean {
  const target = parsePlannerTimeToMinutes(timeStr);
  if (target === null) return false;
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  return nowMins > target;
}
