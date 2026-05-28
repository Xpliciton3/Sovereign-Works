export type AlarmType =
  | 'wake'
  | 'winddown'
  | 'sleep'
  | 'hydration'
  | 'batchcook'
  | 'overtime'
  | 'custom';

export interface SovereignAlarm {
  id: string;
  label: string;
  hour: number;
  minute: number;
  days: number[];
  vibrate: boolean;
  snoozeMinutes: number;
  alarmType: AlarmType;
  enabled: boolean;
}
