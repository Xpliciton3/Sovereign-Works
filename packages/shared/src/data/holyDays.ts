import type { Profile } from '../types';

export interface HolyDay {
  id: string;
  name: string;
  deity: string;
  function: string;
  functionCode: string;
  date: string;
  title: string;
  calendarSymbol: string;
  placement_meaning: string;
  personal_intj: string;
  personal_esfj: string;
  household: string;
  notification_3day: string;
  notification_day_of: string;
  log_prompt: string;
  beebe_intj: string;
  beebe_esfj: string;
}

export const HOLY_DAYS: HolyDay[] = [
  {
    id: 'vaelith_solstice',
    name: 'The Long Night of Far Seeing',
    deity: 'Vaelith',
    function: 'Introverted Intuition',
    functionCode: 'Ni',
    date: '12-21',
    title: 'The Long Night of Far Seeing',
    calendarSymbol: '◆',
    placement_meaning: 'Winter Solstice — the longest night before the return of light.',
    personal_intj:
      'Alone at night after full dark. Light a dark candle. Read the Long Record 20 minutes without annotation. Answer the Three Questions of the Solstice. Speak the Axiom three times. Write one sentence for the Rite Record.',
    personal_esfj:
      'After the household is settled, prepare Evening Architecture Blend tea. Name three instances where false certainty appeared this year. Find three genuine differences for each. Write one sentence about what the false record kept you from seeing.',
    household:
      'The Long Night Meal — each person brings one ingredient without coordinating. Before eating, one sentence each: This year I [accomplished or survived]. After the meal, each writes one intention on a slip for the Solstice container, opened June 21.',
    notification_3day: 'The Long Night of Far Seeing is in three days.',
    notification_day_of: 'Tonight: The Long Night of Far Seeing — Vaelith, Ni.',
    log_prompt: 'What does the long arc require next?',
    beebe_intj: 'Position 1 — Hero — Vaelith (Ni)',
    beebe_esfj: 'Position 7 — Trickster — Vaelith (Ni)',
  },
  {
    id: 'caelis_imbolc',
    name: 'The Day of Possible Doors',
    deity: 'Caelis',
    function: 'Extraverted Intuition',
    functionCode: 'Ne',
    date: '02-02',
    title: 'The Day of Possible Doors',
    calendarSymbol: '◇',
    placement_meaning: 'Imbolc — first stirring of returning light; possibility becomes faintly visible.',
    personal_intj:
      'Write five things you have never done that you have thought about. Pick one that would surprise you. Write it in the Rite Record with a revisit date. Spend 30 minutes in generative play with no product expected.',
    personal_esfj:
      'Name one tradition you keep from habit, not certainty. Name one untested curiosity. Write: One thing I am willing to not-know this year.',
    household:
      'The Possible Doors Walk — 20+ minutes, no destination. At each junction a different person chooses direction. When done, each names one thing noticed that a planned route would have missed. No phones.',
    notification_3day: 'The Day of Possible Doors is in three days.',
    notification_day_of: 'Today: The Day of Possible Doors — Caelis, Ne.',
    log_prompt: 'Which door will you revisit?',
    beebe_intj: 'Position 3 — Child — Caelis (Ne)',
    beebe_esfj: 'Position 3 — Child — Caelis (Ne)',
  },
  {
    id: 'varkon_equinox',
    name: 'The Day of the First Order',
    deity: 'Varkon',
    function: 'Extraverted Thinking',
    functionCode: 'Te',
    date: '03-20',
    title: 'The Day of the First Order',
    calendarSymbol: '▣',
    placement_meaning: 'Spring Equinox — equal light and dark; structure reasserts after winter.',
    personal_intj:
      'Forge Audit: review all structures. Retire what no longer holds. Name what each remaining structure produces. Establish one new measurable structure for the season.',
    personal_esfj:
      'Name three relationships you sustain. For each: giving from care or obligation? Write one relationship to tend more honestly and one specific change.',
    household:
      'The One Thing Built — each person names one structure they will maintain this season, posted visibly until Summer Solstice when each reports whether it held.',
    notification_3day: 'The Day of the First Order is in three days.',
    notification_day_of: 'Today: The Day of the First Order — Varkon, Te.',
    log_prompt: 'What structure are you building this season?',
    beebe_intj: 'Position 2 — Good Parent — Varkon (Te)',
    beebe_esfj: 'Position 8 — Daemon — Varkon (Te)',
  },
  {
    id: 'aureliane_beltane',
    name: 'The Day of the Lit Hearth',
    deity: 'Aureliane',
    function: 'Extraverted Feeling',
    functionCode: 'Fe',
    date: '05-01',
    title: 'The Day of the Lit Hearth',
    calendarSymbol: '♡',
    placement_meaning: 'Beltane — relational field at its most generative.',
    personal_intj:
      'Name one person you track in your interior without telling them. Write what you would say if Ti did not filter it first. You need not send it.',
    personal_esfj:
      'Prepare Morning Sovereignty Blend. Read the Oath. Name three specific gratitudes and who has tended you. Do one deliberate act of warmth that asks nothing in return.',
    household:
      'The Hearth Meal — everyone contributes to preparation. Household candle lit. Each names what someone present gave the household this year. Ten minutes at table after the meal.',
    notification_3day: 'The Day of the Lit Hearth is in three days.',
    notification_day_of: 'Today: The Day of the Lit Hearth — Aureliane, Fe.',
    log_prompt: 'What warmth did you give and receive?',
    beebe_intj: 'Position 8 — Anima — Aureliane (Fe)',
    beebe_esfj: 'Position 1 — Hero — Aureliane (Fe)',
  },
  {
    id: 'draven_midsummer',
    name: 'The Day of Full Presence',
    deity: 'Draven',
    function: 'Extraverted Sensing',
    functionCode: 'Se',
    date: '06-21',
    title: 'The Day of Full Presence',
    calendarSymbol: '☀',
    placement_meaning: 'Summer Solstice — maximum light; full physical presence.',
    personal_intj:
      'Do one unplanned bodily activity you cannot optimize. No performance analysis during. Afterward write one sentence about what the body knew that the mind did not.',
    personal_esfj:
      'One purely physical practice for yourself alone. Open the Winter Solstice intention container and read your slip. Write what happened.',
    household:
      'The Long Day — outdoors together one hour minimum. Evening: open December slips silently; each says one sentence: What I intended was X. What happened was Y.',
    notification_3day: 'The Day of Full Presence is in three days.',
    notification_day_of: 'Today: The Day of Full Presence — Draven, Se.',
    log_prompt: 'What did the body know?',
    beebe_intj: 'Position 4 — Inferior — Draven (Se)',
    beebe_esfj: 'Position 5 — Opposing — Draven (Se)',
  },
  {
    id: 'nemeir_lammas',
    name: 'The Day of the Inner Fire',
    deity: 'Nemeir',
    function: 'Introverted Feeling',
    functionCode: 'Fi',
    date: '08-01',
    title: 'The Day of the Inner Fire',
    calendarSymbol: '✦',
    placement_meaning: 'Lammas — interior conviction becomes visible in the world.',
    personal_intj:
      'Name one value you know but cannot defend in argument. Spend 20 minutes making something from genuine interior — imperfect is correct.',
    personal_esfj:
      'Name three beliefs not contingent on others agreement. Name one thing done from obligation not conviction and what it costs you.',
    household:
      'The Making — each person makes something and brings it to a shared table. One sentence each: what they made and why.',
    notification_3day: 'The Day of the Inner Fire is in three days.',
    notification_day_of: 'Today: The Day of the Inner Fire — Nemeir, Fi.',
    log_prompt: 'What conviction became visible?',
    beebe_intj: 'Position 3 — Child — Nemeir (Fi)',
    beebe_esfj: 'Position 6 — Witch root — Nemeir (Fi)',
  },
  {
    id: 'thalor_autumn',
    name: 'The Day of the Anchored Record',
    deity: 'Thalor',
    function: 'Introverted Sensing',
    functionCode: 'Si',
    date: '09-22',
    title: 'The Day of the Anchored Record',
    calendarSymbol: '▤',
    placement_meaning: 'Autumn Equinox — the year turns inward; the record is examined.',
    personal_intj:
      'Review practices: where did an old pattern misfit a new season? Write the update. Recommit to one thing the record shows consistently works.',
    personal_esfj:
      'Read Covenant entries. Conduct Annual Reservoir Assessment. Write five sentences, one per assessment question. One specific change for the coming season.',
    household:
      'The Record Dinner — each shares one belief the year verified with evidence. Not goals; what turned out true.',
    notification_3day: 'The Day of the Anchored Record is in three days.',
    notification_day_of: 'Today: The Day of the Anchored Record — Thalor, Si.',
    log_prompt: 'What did the record confirm?',
    beebe_intj: 'Position 6 — Witch — Thalor (Si)',
    beebe_esfj: 'Position 2 — Good Parent — Thalor (Si)',
  },
  {
    id: 'sereth_samhain',
    name: 'The Day of the Cutting Question',
    deity: 'Sereth',
    function: 'Introverted Thinking',
    functionCode: 'Ti',
    date: '10-31',
    title: 'The Day of the Cutting Question',
    calendarSymbol: '†',
    placement_meaning: 'Samhain — darkest threshold; the question that rejects the first answer.',
    personal_intj:
      'Name one settled self-belief. Find three pieces of evidence against it. Write what you have not finished testing.',
    personal_esfj:
      'Prepare Rite Preparation tea. Answer: What is one thing I have been performing rather than genuinely offering? Name it specifically. Write what genuine offering would look like.',
    household:
      'The Named Things — each names one hard thing this year in one sentence, then one person to remember. No discussion after. Eat something warm together.',
    notification_3day: 'The Day of the Cutting Question is in three days.',
    notification_day_of: 'Today: The Day of the Cutting Question — Sereth, Ti.',
    log_prompt: 'What did the cutting question reveal?',
    beebe_intj: 'Position 7 — Trickster — Sereth (Ti)',
    beebe_esfj: 'Position 4 — Inferior — Sereth (Ti)',
  },
];

export function daysUntilHolyDay(dateStr: string): number {
  const [mm, dd] = dateStr.split('-').map(Number);
  const now = new Date();
  const year = now.getFullYear();
  let target = new Date(year, mm - 1, dd);
  target.setHours(0, 0, 0, 0);
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  if (target < today) target = new Date(year + 1, mm - 1, dd);
  return Math.round((target.getTime() - today.getTime()) / 86400000);
}

export function getPersonalObservance(day: HolyDay, profile: Profile): string {
  return profile === 'imperium' ? day.personal_intj : day.personal_esfj;
}

export function getUpcomingHolyDays(limit = 8): HolyDay[] {
  return [...HOLY_DAYS].sort((a, b) => daysUntilHolyDay(a.date) - daysUntilHolyDay(b.date)).slice(0, limit);
}

export function holyDayOnDate(isoDate: string): HolyDay | undefined {
  const normalized = isoDate.slice(5);
  return HOLY_DAYS.find((h) => h.date === normalized);
}
