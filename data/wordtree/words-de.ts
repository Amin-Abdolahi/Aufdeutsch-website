/**
 * Word Tree — German Words Database (نسخه ۲.۰)
 *
 * این فایل، منبع اصلی کلمات آلمانی بازیه.
 *
 * ⚠️ نکته‌ی مهم برای توسعه‌دهنده‌های آینده:
 *
 * ۱. هر کلمه باید یه `id` یکتا داشته باشه (مثل w1, w2, ...).
 * ۲. ترتیب `id`ها مهم نیست، ولی ترتیب `WORDS_DE` مهمه (چون `getDailyWords` ازش استفاده می‌کنه).
 * ۳. برای اضافه کردن کلمه‌ی جدید:
 *    - `id` جدید با شماره‌ی بعدی بساز.
 *    - `level` رو مشخص کن (A1/A2/B1).
 *    - `category` رو انتخاب کن.
 *    - اطلاعات گرامری (`noun` یا `verb`) رو حتماً پر کن.
 *    - `pronunciation` رو به فارسی‌نویسی بنویس.
 *    - `example` رو با جمله‌ی آلمانی و ترجمه‌ی سه‌زبانه بنویس.
 * ۴. اگه می‌خوای سطح‌بندی کنی، `WORDS_BY_LEVEL` رو ببین.
 */

import { WordEntry } from "@/lib/wordtree/types";

// ─────────────────────────────────────────────────────────────
// ۲۰ اسم (Nomen)
// ─────────────────────────────────────────────────────────────

const NOUNS: WordEntry[] = [
  {
    id: "w1",
    level: "A1",
    category: "noun",
    translations: { fa: "مرد", de: "der Mann", en: "man" },
    noun: { article: "der", plural: "die Männer" },
    pronunciation: { persian: "مان", ipa: "[man]" },
    example: {
      de: "Der Mann liest ein Buch.",
      translations: {
        fa: "مرد یک کتاب می‌خواند.",
        en: "The man is reading a book.",
        de: "Der Mann liest ein Buch.",
      },
    },
  },
  {
    id: "w2",
    level: "A1",
    category: "noun",
    translations: { fa: "زن", de: "die Frau", en: "woman" },
    noun: { article: "die", plural: "die Frauen" },
    pronunciation: { persian: "فراو", ipa: "[fʁaʊ]" },
    example: {
      de: "Die Frau arbeitet im Büro.",
      translations: {
        fa: "زن در دفتر کار می‌کند.",
        en: "The woman works in the office.",
        de: "Die Frau arbeitet im Büro.",
      },
    },
  },
  {
    id: "w3",
    level: "A1",
    category: "noun",
    translations: { fa: "کودک", de: "das Kind", en: "child" },
    noun: { article: "das", plural: "die Kinder" },
    pronunciation: { persian: "کینت", ipa: "[kɪnt]" },
    example: {
      de: "Das Kind spielt im Garten.",
      translations: {
        fa: "کودک در باغ بازی می‌کند.",
        en: "The child plays in the garden.",
        de: "Das Kind spielt im Garten.",
      },
    },
  },
  {
    id: "w4",
    level: "A1",
    category: "noun",
    translations: { fa: "خانه", de: "das Haus", en: "house" },
    noun: { article: "das", plural: "die Häuser" },
    pronunciation: { persian: "هاوس", ipa: "[haʊs]" },
    example: {
      de: "Das Haus ist sehr groß.",
      translations: {
        fa: "خانه خیلی بزرگ است.",
        en: "The house is very big.",
        de: "Das Haus ist sehr groß.",
      },
    },
  },
  {
    id: "w5",
    level: "A1",
    category: "noun",
    translations: { fa: "کتاب", de: "das Buch", en: "book" },
    noun: { article: "das", plural: "die Bücher" },
    pronunciation: { persian: "بوخ", ipa: "[buːx]" },
    example: {
      de: "Das Buch ist interessant.",
      translations: {
        fa: "کتاب جالب است.",
        en: "The book is interesting.",
        de: "Das Buch ist interessant.",
      },
    },
  },
  {
    id: "w6",
    level: "A1",
    category: "noun",
    translations: { fa: "آب", de: "das Wasser", en: "water" },
    noun: { article: "das", plural: "die Wasser" },
    pronunciation: { persian: "واسر", ipa: "[ˈvasɐ]" },
    example: {
      de: "Ich trinke jeden Tag viel Wasser.",
      translations: {
        fa: "من هر روز آب زیادی می‌نوشم.",
        en: "I drink a lot of water every day.",
        de: "Ich trinke jeden Tag viel Wasser.",
      },
    },
  },
  {
    id: "w7",
    level: "A1",
    category: "noun",
    translations: { fa: "نان", de: "das Brot", en: "bread" },
    noun: { article: "das", plural: "die Brote" },
    pronunciation: { persian: "بروت", ipa: "[bʁoːt]" },
    example: {
      de: "Ich kaufe frisches Brot beim Bäcker.",
      translations: {
        fa: "من نان تازه از نانوایی می‌خرم.",
        en: "I buy fresh bread at the bakery.",
        de: "Ich kaufe frisches Brot beim Bäcker.",
      },
    },
  },
  {
    id: "w8",
    level: "A1",
    category: "noun",
    translations: { fa: "شهر", de: "die Stadt", en: "city" },
    noun: { article: "die", plural: "die Städte" },
    pronunciation: { persian: "اشتات", ipa: "[ʃtat]" },
    example: {
      de: "Berlin ist eine große Stadt.",
      translations: {
        fa: "برلین یک شهر بزرگ است.",
        en: "Berlin is a big city.",
        de: "Berlin ist eine große Stadt.",
      },
    },
  },
  {
    id: "w9",
    level: "A1",
    category: "noun",
    translations: { fa: "کشور", de: "das Land", en: "country" },
    noun: { article: "das", plural: "die Länder" },
    pronunciation: { persian: "لانت", ipa: "[lant]" },
    example: {
      de: "Deutschland ist ein schönes Land.",
      translations: {
        fa: "آلمان کشور زیبایی است.",
        en: "Germany is a beautiful country.",
        de: "Deutschland ist ein schönes Land.",
      },
    },
  },
  {
    id: "w10",
    level: "A1",
    category: "noun",
    translations: { fa: "روز", de: "der Tag", en: "day" },
    noun: { article: "der", plural: "die Tage" },
    pronunciation: { persian: "تاک", ipa: "[taːk]" },
    example: {
      de: "Heute ist ein schöner Tag.",
      translations: {
        fa: "امروز روز زیبایی است.",
        en: "Today is a beautiful day.",
        de: "Heute ist ein schöner Tag.",
      },
    },
  },
  {
    id: "w11",
    level: "A1",
    category: "noun",
    translations: { fa: "شب", de: "die Nacht", en: "night" },
    noun: { article: "die", plural: "die Nächte" },
    pronunciation: { persian: "ناخت", ipa: "[naxt]" },
    example: {
      de: "Die Nacht ist ruhig und still.",
      translations: {
        fa: "شب آرام و ساکت است.",
        en: "The night is calm and quiet.",
        de: "Die Nacht ist ruhig und still.",
      },
    },
  },
  {
    id: "w12",
    level: "A1",
    category: "noun",
    translations: { fa: "سال", de: "das Jahr", en: "year" },
    noun: { article: "das", plural: "die Jahre" },
    pronunciation: { persian: "یار", ipa: "[jaːɐ̯]" },
    example: {
      de: "Ich lerne seit einem Jahr Deutsch.",
      translations: {
        fa: "من یک سال است که آلمانی یاد می‌گیرم.",
        en: "I have been learning German for a year.",
        de: "Ich lerne seit einem Jahr Deutsch.",
      },
    },
  },
  {
    id: "w13",
    level: "A1",
    category: "noun",
    translations: { fa: "خانواده", de: "die Familie", en: "family" },
    noun: { article: "die", plural: "die Familien" },
    pronunciation: { persian: "فامیلیه", ipa: "[faˈmiːli̯ə]" },
    example: {
      de: "Meine Familie wohnt in Teheran.",
      translations: {
        fa: "خانواده‌ی من در تهران زندگی می‌کند.",
        en: "My family lives in Tehran.",
        de: "Meine Familie wohnt in Teheran.",
      },
    },
  },
  {
    id: "w14",
    level: "A1",
    category: "noun",
    translations: { fa: "دوست", de: "der Freund", en: "friend" },
    noun: { article: "der", plural: "die Freunde" },
    pronunciation: { persian: "فروَنت", ipa: "[fʁɔɪ̯nt]" },
    example: {
      de: "Mein Freund kommt morgen zu Besuch.",
      translations: {
        fa: "دوست من فردا به دیدنم می‌آید.",
        en: "My friend is coming to visit tomorrow.",
        de: "Mein Freund kommt morgen zu Besuch.",
      },
    },
  },
  {
    id: "w15",
    level: "A1",
    category: "noun",
    translations: { fa: "کار", de: "die Arbeit", en: "work" },
    noun: { article: "die", plural: "die Arbeiten" },
    pronunciation: { persian: "آربایت", ipa: "[ˈaʁbaɪ̯t]" },
    example: {
      de: "Die Arbeit macht mir Spaß.",
      translations: {
        fa: "کار برایم لذت‌بخش است.",
        en: "I enjoy my work.",
        de: "Die Arbeit macht mir Spaß.",
      },
    },
  },
  {
    id: "w16",
    level: "A1",
    category: "noun",
    translations: { fa: "زمان", de: "die Zeit", en: "time" },
    noun: { article: "die", plural: "die Zeiten" },
    pronunciation: { persian: "تسایت", ipa: "[tsaɪ̯t]" },
    example: {
      de: "Ich habe heute keine Zeit.",
      translations: {
        fa: "من امروز وقت ندارم.",
        en: "I don't have time today.",
        de: "Ich habe heute keine Zeit.",
      },
    },
  },
  {
    id: "w17",
    level: "A1",
    category: "noun",
    translations: { fa: "غذا", de: "das Essen", en: "food" },
    noun: { article: "das", plural: "die Essen" },
    pronunciation: { persian: "اِسِن", ipa: "[ˈɛsn̩]" },
    example: {
      de: "Das Essen in diesem Restaurant ist lecker.",
      translations: {
        fa: "غذای این رستوران خوشمزه است.",
        en: "The food in this restaurant is delicious.",
        de: "Das Essen in diesem Restaurant ist lecker.",
      },
    },
  },
  {
    id: "w18",
    level: "A1",
    category: "noun",
    translations: { fa: "مدرسه", de: "die Schule", en: "school" },
    noun: { article: "die", plural: "die Schulen" },
    pronunciation: { persian: "شوله", ipa: "[ˈʃuːlə]" },
    example: {
      de: "Die Kinder gehen jeden Tag zur Schule.",
      translations: {
        fa: "بچه‌ها هر روز به مدرسه می‌روند.",
        en: "The children go to school every day.",
        de: "Die Kinder gehen jeden Tag zur Schule.",
      },
    },
  },
  {
    id: "w19",
    level: "A1",
    category: "noun",
    translations: { fa: "خیابان", de: "die Straße", en: "street" },
    noun: { article: "die", plural: "die Straßen" },
    pronunciation: { persian: "اشتراسه", ipa: "[ˈʃtʁaːsə]" },
    example: {
      de: "Ich wohne in einer ruhigen Straße.",
      translations: {
        fa: "من در خیابان آرامی زندگی می‌کنم.",
        en: "I live on a quiet street.",
        de: "Ich wohne in einer ruhigen Straße.",
      },
    },
  },
  {
    id: "w20",
    level: "A1",
    category: "noun",
    translations: { fa: "ماشین", de: "das Auto", en: "car" },
    noun: { article: "das", plural: "die Autos" },
    pronunciation: { persian: "آوتو", ipa: "[ˈaʊ̯to]" },
    example: {
      de: "Mein Auto ist alt, aber zuverlässig.",
      translations: {
        fa: "ماشین من قدیمی است، ولی قابل اعتماد.",
        en: "My car is old, but reliable.",
        de: "Mein Auto ist alt, aber zuverlässig.",
      },
    },
  },
];

// ─────────────────────────────────────────────────────────────
// ۱۵ فعل (Verben)
// ─────────────────────────────────────────────────────────────

const VERBS: WordEntry[] = [
  {
    id: "w21",
    level: "A1",
    category: "verb",
    translations: { fa: "بودن", de: "sein", en: "to be" },
    verb: { praeteritum: "war", perfekt: "ist gewesen", auxiliary: "sein", irregular: true },
    pronunciation: { persian: "زاین", ipa: "[zaɪ̯n]" },
    example: {
      de: "Ich bin müde.",
      translations: {
        fa: "من خسته‌ام.",
        en: "I am tired.",
        de: "Ich bin müde.",
      },
    },
  },
  {
    id: "w22",
    level: "A1",
    category: "verb",
    translations: { fa: "داشتن", de: "haben", en: "to have" },
    verb: { praeteritum: "hatte", perfekt: "hat gehabt", auxiliary: "haben", irregular: true },
    pronunciation: { persian: "هابن", ipa: "[ˈhaːbn̩]" },
    example: {
      de: "Ich habe einen Bruder.",
      translations: {
        fa: "من یک برادر دارم.",
        en: "I have a brother.",
        de: "Ich habe einen Bruder.",
      },
    },
  },
  {
    id: "w23",
    level: "A1",
    category: "verb",
    translations: { fa: "رفتن", de: "gehen", en: "to go" },
    verb: { praeteritum: "ging", perfekt: "ist gegangen", auxiliary: "sein", irregular: true },
    pronunciation: { persian: "گِیِن", ipa: "[ˈɡeːən]" },
    example: {
      de: "Ich gehe jeden Morgen zur Arbeit.",
      translations: {
        fa: "من هر صبح به سر کار می‌روم.",
        en: "I go to work every morning.",
        de: "Ich gehe jeden Morgen zur Arbeit.",
      },
    },
  },
  {
    id: "w24",
    level: "A1",
    category: "verb",
    translations: { fa: "آمدن", de: "kommen", en: "to come" },
    verb: { praeteritum: "kam", perfekt: "ist gekommen", auxiliary: "sein", irregular: true },
    pronunciation: { persian: "کومِن", ipa: "[ˈkɔmən]" },
    example: {
      de: "Meine Freundin kommt heute Abend.",
      translations: {
        fa: "دوست دخترم امشب می‌آید.",
        en: "My girlfriend is coming tonight.",
        de: "Meine Freundin kommt heute Abend.",
      },
    },
  },
  {
    id: "w25",
    level: "A1",
    category: "verb",
    translations: { fa: "دیدن", de: "sehen", en: "to see" },
    verb: { praeteritum: "sah", perfekt: "hat gesehen", auxiliary: "haben", irregular: true },
    pronunciation: { persian: "زِیِن", ipa: "[ˈzeːən]" },
    example: {
      de: "Ich sehe einen Vogel im Garten.",
      translations: {
        fa: "من یک پرنده در باغ می‌بینم.",
        en: "I see a bird in the garden.",
        de: "Ich sehe einen Vogel im Garten.",
      },
    },
  },
  {
    id: "w26",
    level: "A1",
    category: "verb",
    translations: { fa: "خوردن", de: "essen", en: "to eat" },
    verb: { praeteritum: "aß", perfekt: "hat gegessen", auxiliary: "haben", irregular: true },
    pronunciation: { persian: "اِسِن", ipa: "[ˈɛsn̩]" },
    example: {
      de: "Wir essen zusammen zu Mittag.",
      translations: {
        fa: "ما با هم ناهار می‌خوریم.",
        en: "We eat lunch together.",
        de: "Wir essen zusammen zu Mittag.",
      },
    },
  },
  {
    id: "w27",
    level: "A1",
    category: "verb",
    translations: { fa: "نوشیدن", de: "trinken", en: "to drink" },
    verb: { praeteritum: "trank", perfekt: "hat getrunken", auxiliary: "haben", irregular: true },
    pronunciation: { persian: "ترینکِن", ipa: "[ˈtʁɪŋkn̩]" },
    example: {
      de: "Ich trinke morgens Kaffee.",
      translations: {
        fa: "من صبح‌ها قهوه می‌نوشم.",
        en: "I drink coffee in the morning.",
        de: "Ich trinke morgens Kaffee.",
      },
    },
  },
  {
    id: "w28",
    level: "A1",
    category: "verb",
    translations: { fa: "خواندن", de: "lesen", en: "to read" },
    verb: { praeteritum: "las", perfekt: "hat gelesen", auxiliary: "haben", irregular: true },
    pronunciation: { persian: "لِیزِن", ipa: "[ˈleːzn̩]" },
    example: {
      de: "Er liest jeden Abend ein Buch.",
      translations: {
        fa: "او هر شب یک کتاب می‌خواند.",
        en: "He reads a book every evening.",
        de: "Er liest jeden Abend ein Buch.",
      },
    },
  },
  {
    id: "w29",
    level: "A1",
    category: "verb",
    translations: { fa: "نوشتن", de: "schreiben", en: "to write" },
    verb: { praeteritum: "schrieb", perfekt: "hat geschrieben", auxiliary: "haben", irregular: true },
    pronunciation: { persian: "شْرایبِن", ipa: "[ˈʃʁaɪ̯bn̩]" },
    example: {
      de: "Ich schreibe eine E-Mail an meinen Lehrer.",
      translations: {
        fa: "من به معلمم ایمیل می‌نویسم.",
        en: "I am writing an email to my teacher.",
        de: "Ich schreibe eine E-Mail an meinen Lehrer.",
      },
    },
  },
  {
    id: "w30",
    level: "A1",
    category: "verb",
    translations: { fa: "صحبت کردن", de: "sprechen", en: "to speak" },
    verb: { praeteritum: "sprach", perfekt: "hat gesprochen", auxiliary: "haben", irregular: true },
    pronunciation: { persian: "شْپْرِشِن", ipa: "[ˈʃpʁɛçn̩]" },
    example: {
      de: "Sprechen Sie Deutsch?",
      translations: {
        fa: "آیا آلمانی صحبت می‌کنید؟",
        en: "Do you speak German?",
        de: "Sprechen Sie Deutsch?",
      },
    },
  },
  {
    id: "w31",
    level: "A1",
    category: "verb",
    translations: { fa: "کار کردن", de: "arbeiten", en: "to work" },
    verb: { praeteritum: "arbeitete", perfekt: "hat gearbeitet", auxiliary: "haben", irregular: false },
    pronunciation: { persian: "آربایتِن", ipa: "[ˈaʁbaɪ̯tn̩]" },
    example: {
      de: "Sie arbeitet in einem Krankenhaus.",
      translations: {
        fa: "او در یک بیمارستان کار می‌کند.",
        en: "She works in a hospital.",
        de: "Sie arbeitet in einem Krankenhaus.",
      },
    },
  },
  {
    id: "w32",
    level: "A1",
    category: "verb",
    translations: { fa: "یاد گرفتن", de: "lernen", en: "to learn" },
    verb: { praeteritum: "lernte", perfekt: "hat gelernt", auxiliary: "haben", irregular: false },
    pronunciation: { persian: "لِرنِن", ipa: "[ˈlɛʁnən]" },
    example: {
      de: "Ich lerne jeden Tag neue Wörter.",
      translations: {
        fa: "من هر روز کلمات جدید یاد می‌گیرم.",
        en: "I learn new words every day.",
        de: "Ich lerne jeden Tag neue Wörter.",
      },
    },
  },
  {
    id: "w33",
    level: "A1",
    category: "verb",
    translations: { fa: "خریدن", de: "kaufen", en: "to buy" },
    verb: { praeteritum: "kaufte", perfekt: "hat gekauft", auxiliary: "haben", irregular: false },
    pronunciation: { persian: "کاوفِن", ipa: "[ˈkaʊ̯fn̩]" },
    example: {
      de: "Ich kaufe Brot und Milch.",
      translations: {
        fa: "من نان و شیر می‌خرم.",
        en: "I buy bread and milk.",
        de: "Ich kaufe Brot und Milch.",
      },
    },
  },
  {
    id: "w34",
    level: "A1",
    category: "verb",
    translations: { fa: "خوابیدن", de: "schlafen", en: "to sleep" },
    verb: { praeteritum: "schlief", perfekt: "hat geschlafen", auxiliary: "haben", irregular: true },
    pronunciation: { persian: "شْلافِن", ipa: "[ˈʃlaːfn̩]" },
    example: {
      de: "Das Baby schläft jetzt.",
      translations: {
        fa: "نوزاد الان خوابیده است.",
        en: "The baby is sleeping now.",
        de: "Das Baby schläft jetzt.",
      },
    },
  },
  {
    id: "w35",
    level: "A1",
    category: "verb",
    translations: { fa: "بازی کردن", de: "spielen", en: "to play" },
    verb: { praeteritum: "spielte", perfekt: "hat gespielt", auxiliary: "haben", irregular: false },
    pronunciation: { persian: "شْپیِلِن", ipa: "[ˈʃpiːlən]" },
    example: {
      de: "Die Kinder spielen im Park.",
      translations: {
        fa: "بچه‌ها در پارک بازی می‌کنند.",
        en: "The children are playing in the park.",
        de: "Die Kinder spielen im Park.",
      },
    },
  },
];

// ─────────────────────────────────────────────────────────────
// ۱۰ صفت (Adjektive)
// ─────────────────────────────────────────────────────────────

const ADJECTIVES: WordEntry[] = [
  {
    id: "w36",
    level: "A1",
    category: "adjective",
    translations: { fa: "خوشحال", de: "glücklich", en: "happy" },
    pronunciation: { persian: "گلوکلیش", ipa: "[ˈɡlʏklɪç]" },
    example: {
      de: "Ich bin heute sehr glücklich.",
      translations: {
        fa: "من امروز خیلی خوشحالم.",
        en: "I am very happy today.",
        de: "Ich bin heute sehr glücklich.",
      },
    },
  },
  {
    id: "w37",
    level: "A1",
    category: "adjective",
    translations: { fa: "غمگین", de: "traurig", en: "sad" },
    pronunciation: { persian: "تْراوریش", ipa: "[ˈtʁaʊ̯ʁɪç]" },
    example: {
      de: "Warum bist du so traurig?",
      translations: {
        fa: "چرا اینقدر غمگینی؟",
        en: "Why are you so sad?",
        de: "Warum bist du so traurig?",
      },
    },
  },
  {
    id: "w38",
    level: "A1",
    category: "adjective",
    translations: { fa: "بزرگ", de: "groß", en: "big" },
    pronunciation: { persian: "گْروس", ipa: "[ɡʁoːs]" },
    example: {
      de: "Das ist ein großes Haus.",
      translations: {
        fa: "این یک خانه‌ی بزرگ است.",
        en: "This is a big house.",
        de: "Das ist ein großes Haus.",
      },
    },
  },
  {
    id: "w39",
    level: "A1",
    category: "adjective",
    translations: { fa: "کوچک", de: "klein", en: "small" },
    pronunciation: { persian: "کلاین", ipa: "[klaɪ̯n]" },
    example: {
      de: "Ich habe eine kleine Katze.",
      translations: {
        fa: "من یک گربه‌ی کوچک دارم.",
        en: "I have a small cat.",
        de: "Ich habe eine kleine Katze.",
      },
    },
  },
  {
    id: "w40",
    level: "A1",
    category: "adjective",
    translations: { fa: "زیبا", de: "schön", en: "beautiful" },
    pronunciation: { persian: "شُون", ipa: "[ʃøːn]" },
    example: {
      de: "Der Garten ist sehr schön.",
      translations: {
        fa: "باغ خیلی زیباست.",
        en: "The garden is very beautiful.",
        de: "Der Garten ist sehr schön.",
      },
    },
  },
  {
    id: "w41",
    level: "A1",
    category: "adjective",
    translations: { fa: "خوب", de: "gut", en: "good" },
    pronunciation: { persian: "گوت", ipa: "[ɡuːt]" },
    example: {
      de: "Das Essen schmeckt sehr gut.",
      translations: {
        fa: "غذا خیلی خوب مزه می‌دهد.",
        en: "The food tastes very good.",
        de: "Das Essen schmeckt sehr gut.",
      },
    },
  },
  {
    id: "w42",
    level: "A1",
    category: "adjective",
    translations: { fa: "بد", de: "schlecht", en: "bad" },
    pronunciation: { persian: "شْلِشت", ipa: "[ʃlɛçt]" },
    example: {
      de: "Das Wetter ist heute schlecht.",
      translations: {
        fa: "امروز هوا بد است.",
        en: "The weather is bad today.",
        de: "Das Wetter ist heute schlecht.",
      },
    },
  },
  {
    id: "w43",
    level: "A1",
    category: "adjective",
    translations: { fa: "جدید", de: "neu", en: "new" },
    pronunciation: { persian: "نوی", ipa: "[nɔɪ̯]" },
    example: {
      de: "Ich habe ein neues Handy.",
      translations: {
        fa: "من یک گوشی جدید دارم.",
        en: "I have a new phone.",
        de: "Ich habe ein neues Handy.",
      },
    },
  },
  {
    id: "w44",
    level: "A1",
    category: "adjective",
    translations: { fa: "قدیمی", de: "alt", en: "old" },
    pronunciation: { persian: "آلت", ipa: "[alt]" },
    example: {
      de: "Mein Fahrrad ist schon alt.",
      translations: {
        fa: "دوچرخه‌ی من قدیمی است.",
        en: "My bicycle is already old.",
        de: "Mein Fahrrad ist schon alt.",
      },
    },
  },
  {
    id: "w45",
    level: "A1",
    category: "adjective",
    translations: { fa: "خسته", de: "müde", en: "tired" },
    pronunciation: { persian: "موده", ipa: "[ˈmyːdə]" },
    example: {
      de: "Nach der Arbeit bin ich immer müde.",
      translations: {
        fa: "بعد از کار همیشه خسته‌ام.",
        en: "After work I am always tired.",
        de: "Nach der Arbeit bin ich immer müde.",
      },
    },
  },
];

// ─────────────────────────────────────────────────────────────
// ۵ کلمه‌ی مفید (اعداد و رنگ‌ها)
// ─────────────────────────────────────────────────────────────

const MISC: WordEntry[] = [
  {
    id: "w46",
    level: "A1",
    category: "number",
    translations: { fa: "یک", de: "eins", en: "one" },
    pronunciation: { persian: "آینس", ipa: "[aɪ̯ns]" },
    example: {
      de: "Ich habe nur eins.",
      translations: {
        fa: "من فقط یکی دارم.",
        en: "I only have one.",
        de: "Ich habe nur eins.",
      },
    },
  },
  {
    id: "w47",
    level: "A1",
    category: "number",
    translations: { fa: "دو", de: "zwei", en: "two" },
    pronunciation: { persian: "تسوای", ipa: "[tsvaɪ̯]" },
    example: {
      de: "Ich habe zwei Schwestern.",
      translations: {
        fa: "من دو خواهر دارم.",
        en: "I have two sisters.",
        de: "Ich habe zwei Schwestern.",
      },
    },
  },
  {
    id: "w48",
    level: "A1",
    category: "color",
    translations: { fa: "قرمز", de: "rot", en: "red" },
    pronunciation: { persian: "روت", ipa: "[ʁoːt]" },
    example: {
      de: "Die Rose ist rot.",
      translations: {
        fa: "گل رز قرمز است.",
        en: "The rose is red.",
        de: "Die Rose ist rot.",
      },
    },
  },
  {
    id: "w49",
    level: "A1",
    category: "color",
    translations: { fa: "آبی", de: "blau", en: "blue" },
    pronunciation: { persian: "بْلاو", ipa: "[blaʊ̯]" },
    example: {
      de: "Der Himmel ist blau.",
      translations: {
        fa: "آسمان آبی است.",
        en: "The sky is blue.",
        de: "Der Himmel ist blau.",
      },
    },
  },
  {
    id: "w50",
    level: "A1",
    category: "color",
    translations: { fa: "سبز", de: "grün", en: "green" },
    pronunciation: { persian: "گْرون", ipa: "[ɡʁyːn]" },
    example: {
      de: "Das Gras ist grün.",
      translations: {
        fa: "چمن سبز است.",
        en: "The grass is green.",
        de: "Das Gras ist grün.",
      },
    },
  },
];

// ─────────────────────────────────────────────────────────────
// لیست کامل (۵۰ کلمه)
// ─────────────────────────────────────────────────────────────

/**
 * لیست کامل کلمات آلمانی.
 *
 * ⚠️ ترتیب مهمه! `getDailyWords` از این ترتیب استفاده می‌کنه
 * و روز اول ۵ کلمه‌ی اول رو برمی‌گردونه.
 *
 * ترتیب فعلی:
 * - w1-w20: اسم‌ها
 * - w21-w35: فعل‌ها
 * - w36-w45: صفت‌ها
 * - w46-w50: عدد و رنگ
 *
 * این ترتیب برای «تنوع در روز اول» طراحی شده:
 * روز اول: w1 (اسم) + w2 (اسم) + w3 (اسم) + w4 (اسم) + w5 (اسم)
 *
 * ⚠️ اگه می‌خوای تنوع بیشتری داشته باشی، ترتیب رو تغییر بده.
 */
export const WORDS_DE: WordEntry[] = [
  ...NOUNS,       // ۲۰ اسم
  ...VERBS,       // ۱۵ فعل
  ...ADJECTIVES,  // ۱۰ صفت
  ...MISC,        // ۵ عدد و رنگ
];

// ─────────────────────────────────────────────────────────────
// توابع کمکی
// ─────────────────────────────────────────────────────────────

/**
 * گرفتن کلمات بر اساس سطح.
 *
 * @example
 * const a1Words = getWordsByLevel("A1"); // همه‌ی کلمات A1
 */
export function getWordsByLevel(level: GermanLevel): WordEntry[] {
  return WORDS_DE.filter((w) => w.level === level);
}

/**
 * گرفتن کلمات بر اساس دسته.
 *
 * @example
 * const nouns = getWordsByCategory("noun"); // همه‌ی اسم‌ها
 */
export function getWordsByCategory(category: WordCategory): WordEntry[] {
  return WORDS_DE.filter((w) => w.category === category);
}

/**
 * گرفتن کلمات روزانه.
 *
 * ⚠️ این تابع در حال حاضر ۵ کلمه‌ی اول رو برمی‌گردونه.
 * برای فاز ۲ (آزمون باغبان)، باید بتونه کلمات بیشتری برگردونه
 * و از تکرار کلمات قبلی جلوگیری کنه.
 *
 * @param count - تعداد کلمات (پیش‌فرض: ۵)
 * @param excludeIds - کلماتی که نباید برگردونن (برای فاز ۲)
 */
export function getDailyWords(
  count: number = 5,
  excludeIds: string[] = []
): WordEntry[] {
  const available = WORDS_DE.filter((w) => !excludeIds.includes(w.id));
  return available.slice(0, count);
}