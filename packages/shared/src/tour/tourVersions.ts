export const TOUR_VERSIONS = {
  v1: {
    key: 'tour_v1_complete',
    label: 'Initial guided tour',
    version: 1,
  },
} as const;

export type TourVersionKey = keyof typeof TOUR_VERSIONS;

export async function determineTourToShow(
  getItem: (key: string) => Promise<string | null>
): Promise<TourVersionKey | null> {
  const versions = Object.entries(TOUR_VERSIONS).sort(
    ([, a], [, b]) => a.version - b.version
  );

  for (const [key, meta] of versions) {
    const complete = await getItem(meta.key);
    if (!complete) {
      return key as TourVersionKey;
    }
  }

  return null;
}

export async function clearAllTourKeys(
  removeItem: (key: string) => Promise<void>
): Promise<void> {
  await Promise.all(
    Object.values(TOUR_VERSIONS).map((meta) => removeItem(meta.key))
  );
}
