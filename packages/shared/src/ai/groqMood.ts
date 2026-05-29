import type { Profile } from '../types';

type TranslateInput = {
  note: string;
  score: number;
  authorProfile: Profile;
};

function partnerProfile(author: Profile): Profile {
  return author === 'imperium' ? 'tending' : 'imperium';
}

export async function translateMoodWithGroq(input: TranslateInput): Promise<string> {
  const key = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  const trimmed = input.note.trim();
  if (!trimmed) return '';

  if (!key) {
    throw new Error('GROQ_UNAVAILABLE');
  }

  const target = partnerProfile(input.authorProfile);
  const targetVoice =
    target === 'imperium'
      ? 'direct, concise, strategic — INTJ register'
      : 'warm, relational, grounded — ESFJ register';
  const systemPrompt =
    'You translate a private journal entry into a short message the author\'s partner can read. ' +
    'The partner must understand what is going on emotionally without seeing the raw journal text. ' +
    'Keep it under 55 words. Preserve emotional truth, remove blame, and make it actionable for care. ' +
    'Do not use generic stock phrases — reflect this specific entry.';
  const userPrompt = [
    `Write for partner tradition: ${target}. Voice: ${targetVoice}.`,
    `Author mood score (1–10 private scale): ${input.score}.`,
    `Private journal entry: ${trimmed}`,
    'Output only the translated message for the partner. No preamble.',
  ].join('\n');

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.5,
      max_tokens: 120,
    }),
  });

  if (!response.ok) {
    throw new Error('GROQ_FAILED');
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const translated = json.choices?.[0]?.message?.content?.trim();
  if (!translated) {
    throw new Error('GROQ_EMPTY');
  }
  return translated;
}
