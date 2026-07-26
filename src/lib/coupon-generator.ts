// Curated list of brand-appropriate, premium-sounding words used to build
// human-readable coupon codes in the format WORD-WORD-DDDD (e.g. GOLDEN-FALCON-4821).
const BRAND_WORDS: string[] = [
  "GOLDEN", "SILVER", "ROYAL", "NOBLE", "PRESTIGE", "LEGACY", "SUMMIT",
  "PLATINUM", "FALCON", "PHOENIX", "LAUREL", "CROWN", "ATLAS", "HORIZON",
  "STERLING", "EMPIRE", "ZENITH", "MERIDIAN", "IVORY", "OBSIDIAN",
  "AMBER", "COBALT", "QUARTZ", "MARBLE", "VELVET", "AURORA", "CASCADE",
  "TITAN", "MONARCH", "ECLIPSE",
];

function getRandomWord(exclude?: string): string {
  let word: string;
  do {
    word = BRAND_WORDS[Math.floor(Math.random() * BRAND_WORDS.length)];
  } while (word === exclude);
  return word;
}

function getRandomFourDigits(): string {
  return String(Math.floor(1000 + Math.random() * 9000));
}

/**
 * Generates a branded coupon code in the format WORD-WORD-DDDD,
 * e.g. "GOLDEN-FALCON-4821". The two words are guaranteed to be different.
 */
export function generateCouponCode(): string {
  const firstWord = getRandomWord();
  const secondWord = getRandomWord(firstWord);
  const digits = getRandomFourDigits();
  return `${firstWord}-${secondWord}-${digits}`;
}