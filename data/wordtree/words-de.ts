import { WordEntry } from "@/lib/wordtree/types";

export const WORDS_DE: WordEntry[] = [
  {
    id: "w1",
    level: "A1",
    category: "noun",
    translations: {
      fa: "آب",
      de: "das Wasser",
      en: "water",
    },
    example: {
      fa: "من آب می‌نوشم.",
      de: "Ich trinke Wasser.",
      en: "I drink water.",
    },
  },
  {
    id: "w2",
    level: "A1",
    category: "noun",
    translations: {
      fa: "کتاب",
      de: "das Buch",
      en: "book",
    },
    example: {
      fa: "این کتاب جالبیه.",
      de: "Das Buch ist interessant.",
      en: "The book is interesting.",
    },
  },
  {
    id: "w3",
    level: "A1",
    category: "adjective",
    translations: {
      fa: "خوشحال",
      de: "glücklich",
      en: "happy",
    },
    example: {
      fa: "من خوشحالم.",
      de: "Ich bin glücklich.",
      en: "I am happy.",
    },
  },
  {
    id: "w4",
    level: "A1",
    category: "verb",
    translations: {
      fa: "دویدن",
      de: "laufen",
      en: "to run",
    },
    example: {
      fa: "او هر روز می‌دوه.",
      de: "Er läuft jeden Tag.",
      en: "He runs every day.",
    },
  },
  {
    id: "w5",
    level: "A1",
    category: "noun",
    translations: {
      fa: "درخت",
      de: "der Baum",
      en: "tree",
    },
    example: {
      fa: "درخت سبزه.",
      de: "Der Baum ist grün.",
      en: "The tree is green.",
    },
  },
  {
    id: "w6",
    level: "A1",
    category: "noun",
    translations: {
      fa: "خانه",
      de: "das Haus",
      en: "house",
    },
    example: {
      fa: "خانه‌ی من بزرگه.",
      de: "Mein Haus ist groß.",
      en: "My house is big.",
    },
  },
  {
    id: "w7",
    level: "A1",
    category: "verb",
    translations: {
      fa: "خوردن",
      de: "essen",
      en: "to eat",
    },
    example: {
      fa: "من سیب می‌خورم.",
      de: "Ich esse einen Apfel.",
      en: "I eat an apple.",
    },
  },
  {
    id: "w8",
    level: "A1",
    category: "noun",
    translations: {
      fa: "دوست",
      de: "der Freund",
      en: "friend",
    },
    example: {
      fa: "او دوست من است.",
      de: "Er ist mein Freund.",
      en: "He is my friend.",
    },
  },
  {
    id: "w9",
    level: "A1",
    category: "adjective",
    translations: {
      fa: "زیبا",
      de: "schön",
      en: "beautiful",
    },
    example: {
      fa: "این گل زیباست.",
      de: "Diese Blume ist schön.",
      en: "This flower is beautiful.",
    },
  },
  {
    id: "w10",
    level: "A1",
    category: "verb",
    translations: {
      fa: "دیدن",
      de: "sehen",
      en: "to see",
    },
    example: {
      fa: "من تو را می‌بینم.",
      de: "Ich sehe dich.",
      en: "I see you.",
    },
  },
];

export function getWordsByLevel(level: string): WordEntry[] {
  return WORDS_DE.filter((w) => w.level === level);
}

export function getDailyWords(count: number = 5): WordEntry[] {
  return WORDS_DE.slice(0, count);
}