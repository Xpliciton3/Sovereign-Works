export interface SleepWindow {
  windDown: string;
  sleep: string;
  wake: string;
  note: string;
}

function fmt24(hour: number): string {
  const n = ((hour % 24) + 24) % 24;
  const h = n === 0 ? 12 : n > 12 ? n - 12 : n;
  const ampm = n < 12 || n === 0 ? 'AM' : 'PM';
  return `${h}:00 ${ampm}`;
}

export function calculateSleepWindow(
  shiftStart: string,
  shiftEnd: string,
  isWorkDay: boolean
): SleepWindow {
  if (!isWorkDay) {
    return { windDown: '9:30 PM', sleep: '10:30 PM', wake: '6:30 AM', note: 'Rest day' };
  }
  const startHour = parseInt(shiftStart.split(':')[0], 10);
  const endHour = parseInt(shiftEnd.split(':')[0], 10);
  const isNight = startHour >= 17;

  if (isNight) {
    const sleepHour = (endHour + 1) % 24;
    const wakeHour = (endHour + 8) % 24;
    return {
      windDown: fmt24(sleepHour),
      sleep: fmt24(sleepHour),
      wake: fmt24(wakeHour),
      note: 'Night shift — darken the room',
    };
  }
  const wakeHour = startHour - 1;
  const sleepHour = startHour - 9;
  return {
    windDown: fmt24(sleepHour + 1),
    sleep: fmt24(sleepHour),
    wake: fmt24(wakeHour),
    note: 'Pre-shift — full 8 hours',
  };
}
