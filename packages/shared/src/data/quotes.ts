export type DailyQuote = {
  text: string;
  author: string;
};

/** Famous quotes curated for Imperium — discipline, sovereignty, long game, inner power (INTJ register). */
export const IMPERIUM_QUOTES: DailyQuote[] = [
  { text: 'He who has a why to live can bear almost any how.', author: 'Friedrich Nietzsche' },
  { text: 'The best time to plant a tree was twenty years ago. The second best time is now.', author: 'Chinese proverb' },
  { text: 'You have power over your mind — not outside events. Realize this, and you will find strength.', author: 'Marcus Aurelius' },
  { text: 'It is not the mountain we conquer, but ourselves.', author: 'Edmund Hillary' },
  { text: 'The impediment to action advances action. What stands in the way becomes the way.', author: 'Marcus Aurelius' },
  { text: 'Know thyself.', author: 'Delphic maxim' },
  { text: 'A gem cannot be polished without friction, nor a man perfected without trials.', author: 'Seneca' },
  { text: 'Strategy without tactics is the slowest route to victory. Tactics without strategy is the noise before defeat.', author: 'Sun Tzu' },
  { text: 'The future belongs to those who prepare for it today.', author: 'Malcolm X' },
  { text: 'First, say to yourself what you would be; and then do what you have to do.', author: 'Epictetus' },
  { text: 'We suffer more often in imagination than in reality.', author: 'Seneca' },
  { text: 'The man who moves a mountain begins by carrying away small stones.', author: 'Confucius' },
  { text: 'Discipline is the bridge between goals and accomplishment.', author: 'Jim Rohn' },
  { text: 'He who conquers himself is the mightiest warrior.', author: 'Confucius' },
  { text: 'The only way to do great work is to love what you do.', author: 'Steve Jobs' },
  { text: 'Fortune favors the bold.', author: 'Virgil' },
  { text: 'What we fear doing most is usually what we most need to do.', author: 'Tim Ferriss' },
  { text: 'The mind is everything. What you think you become.', author: 'Buddha' },
  { text: 'Do not pray for an easy life. Pray for the strength to endure a difficult one.', author: 'Bruce Lee' },
  { text: 'A year from now you may wish you had started today.', author: 'Karen Lamb' },
  { text: 'The secret of change is to focus all of your energy not on fighting the old, but on building the new.', author: 'Socrates' },
  { text: 'He who is not courageous enough to take risks will accomplish nothing in life.', author: 'Muhammad Ali' },
  { text: 'The price of greatness is responsibility.', author: 'Winston Churchill' },
  { text: 'Master yourself. Master the moment.', author: 'Leonardo da Vinci' },
  { text: 'Luck is what happens when preparation meets opportunity.', author: 'Seneca' },
  { text: 'The obstacle is the path.', author: 'Zen proverb' },
  { text: 'Build your own dreams, or someone else will hire you to build theirs.', author: 'Farrah Gray' },
  { text: 'It is not death that a man should fear, but never beginning to live.', author: 'Marcus Aurelius' },
  { text: 'The strong man is strongest when alone.', author: 'Friedrich Schiller' },
  { text: 'Vision without execution is hallucination.', author: 'Thomas Edison' },
];

/** Famous quotes curated for Tending — care, boundaries, fullness, connection with strength (ESFJ register). */
export const TENDING_QUOTES: DailyQuote[] = [
  { text: 'You cannot pour from an empty cup.', author: 'Norman Vincent Peale' },
  { text: 'Rest when you are weary. Refresh and renew yourself, your body, your health, your relationships. Then get back to work.', author: 'Ralph Marston' },
  { text: 'The most basic of all human needs is the need to understand and be understood.', author: 'Carl Rogers' },
  { text: 'You are enough just as you are.', author: 'Meghan Markle' },
  { text: 'Caring for myself is not self-indulgence, it is self-preservation, and that is an act of political warfare.', author: 'Audre Lorde' },
  { text: 'The best way to find yourself is to lose yourself in the service of others.', author: 'Mahatma Gandhi' },
  { text: 'No one is useless in this world who lightens the burdens of another.', author: 'Charles Dickens' },
  { text: 'We rise by lifting others.', author: 'Robert Ingersoll' },
  { text: 'Kindness is a language which the deaf can hear and the blind can see.', author: 'Mark Twain' },
  { text: 'The wound is the place where the Light enters you.', author: 'Rumi' },
  { text: 'You yourself, as much as anybody in the entire universe, deserve your love and affection.', author: 'Buddha' },
  { text: 'To love and be loved is to feel the sun from both sides.', author: 'David Viscott' },
  { text: 'What you do makes a difference, and you have to decide what kind of difference you want to make.', author: 'Jane Goodall' },
  { text: 'The simplest acts of kindness are by far more powerful than a thousand heads bowing in prayer.', author: 'Mahatma Gandhi' },
  { text: 'You have been criticizing yourself for years and it has not worked. Try approving of yourself and see what happens.', author: 'Louise Hay' },
  { text: 'The only way out is through.', author: 'Robert Frost' },
  { text: 'Be the change you wish to see in the world.', author: 'Mahatma Gandhi' },
  { text: 'When we give cheerfully and accept gratefully, everyone is blessed.', author: 'Maya Angelou' },
  { text: 'You are braver than you believe, stronger than you seem, and smarter than you think.', author: 'A.A. Milne' },
  { text: 'The heart that gives, gathers.', author: 'Marianne Moore' },
  { text: 'Do small things with great love.', author: 'Mother Teresa' },
  { text: 'There is no exercise better for the heart than reaching down and lifting people up.', author: 'John Holmes' },
  { text: 'Almost everything will work again if you unplug it for a few minutes, including you.', author: 'Anne Lamott' },
  { text: 'The privilege of a lifetime is to become who you truly are.', author: 'Carl Jung' },
  { text: 'You are not obligated to set yourself on fire to keep other people warm.', author: 'Unknown' },
  { text: 'Love and compassion are necessities, not luxuries. Without them, humanity cannot survive.', author: 'Dalai Lama' },
  { text: 'Healing takes time, and asking for help is a courageous step.', author: 'Mariska Hargitay' },
  { text: 'Where there is love there is life.', author: 'Mahatma Gandhi' },
  { text: 'The best thing to hold onto in life is each other.', author: 'Audrey Hepburn' },
  { text: 'You have within you right now, everything you need to deal with whatever the world can throw at you.', author: 'Brian Tracy' },
];

function dayOfYear(): number {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  return Math.floor((now.getTime() - start.getTime()) / 86400000);
}

export function getTodayQuote(profile: 'imperium' | 'tending'): DailyQuote {
  const bank = profile === 'imperium' ? IMPERIUM_QUOTES : TENDING_QUOTES;
  const index = dayOfYear() % bank.length;
  return bank[index];
}

/** @deprecated Use getTodayQuote().text */
export const IMPERIUM_FALLBACK_QUOTES = IMPERIUM_QUOTES.map((q) => q.text);
export const TENDING_FALLBACK_QUOTES = TENDING_QUOTES.map((q) => q.text);
