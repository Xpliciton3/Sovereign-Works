import type { Profile } from '../types';

type TranslateInput = {
  note: string;
  score: number;
  authorProfile: Profile;
};

function partnerProfile(author: Profile): Profile {
  return author === 'imperium' ? 'tending' : 'imperium';
}

function fallbackTranslation(score: number, authorProfile: Profile): string {
  const target = partnerProfile(authorProfile);
  const low = target === 'imperium'
    ? "I'm carrying too much today. Please keep it simple and stay close."
    : "I'm carrying too much today. Please keep things gentle and steady.";
  const mid = target === 'imperium'
    ? "I'm steady but limited today. Quiet support helps most."
    : "I'm steady but limited today. A calm check-in helps most.";
  const high = target === 'imperium'
    ? "I have capacity today. Connection is welcome."
    : "I have capacity today. Time together is welcome.";

  if (score <= 2) return low;
  if (score <= 4) return mid;
  return high;
}

export async function translateMoodWithGroq(input: TranslateInput): Promise<string> {
  const key = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  const trimmed = input.note.trim();
  if (!trimmed) return '';
  if (!key) return fallbackTranslation(input.score, input.authorProfile);

  const target = partnerProfile(input.authorProfile);
  const targetVoice = target === 'imperium' ? 'direct, concise, strategic' : 'warm, relational, grounded';
  const systemPrompt =
    'Translate a private mood reflection for a partner. Keep it under 55 words. ' +
    'Preserve emotional truth, remove blame, and make it actionable for care.';
  const userPrompt = [
    `Target voice: ${targetVoice}.`,
    `Score (1-5): ${input.score}.`,
    `Original note: ${trimmed}`,
    'Output only the translated reflection text.',
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
      temperature: 0.4,
      max_tokens: 120,
    }),
  });

  if (!response.ok) {
    return fallbackTranslation(input.score, input.authorProfile);
  }

  const json = (await response.json()) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  const translated = json.choices?.[0]?.message?.content?.trim();
  return translated || fallbackTranslation(input.score, input.authorProfile);
}
