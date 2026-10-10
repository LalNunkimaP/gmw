export const NEWS_TAGS = ['Khawtlang', 'Hriattirna', 'Ngenna', 'Chhiatna', 'Thu Lawmawm'] as const;

export type NewsTag = (typeof NEWS_TAGS)[number];
