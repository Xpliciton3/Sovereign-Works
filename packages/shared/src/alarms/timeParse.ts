/** Parse "5:00 AM" / "9:30 PM" into 24h hour and minute. */
export function parseClock12(timeStr: string): { hour: number; minute: number } {
  const [time, ampm] = timeStr.trim().split(' ');
  const [hRaw, mRaw] = time.split(':');
  let hour = Number(hRaw) % 12;
  if (ampm?.toUpperCase() === 'PM') hour += 12;
  return { hour, minute: Number(mRaw) || 0 };
}

export function subtractMinutes(
  timeStr: string,
  minutes: number
): { hour: number; minute: number } {
  const { hour, minute } = parseClock12(timeStr);
  let total = hour * 60 + minute - minutes;
  total = ((total % (24 * 60)) + 24 * 60) % (24 * 60);
  return { hour: Math.floor(total / 60), minute: total % 60 };
}

export function formatClock12(hour: number, minute: number): string {
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const h12 = hour % 12 || 12;
  return `${h12}:${String(minute).padStart(2, '0')} ${ampm}`;
}
