// ============================================================
//  Alphabet World — German word dictionary (offline)
//  برای بازی «کلمه بساز»: بررسی اینکه آیا ترکیب حروف یک کلمهٔ
//  معنادار آلمانی است یا نه. هدف آموزشی است، نه جامع بودن.
// ============================================================

// کلمات رایج آلمانی که با حروف الفبای موجود قابل ساخت‌اند.
// کلید: حرف کوچک. مقدار: شکل صحیح + معنی فارسی.
const WORDS: Record<string, { de: string; fa: string }> = {
  // انسان و خانواده
  mutter: { de: "Mutter", fa: "مادر" },
  vater: { de: "Vater", fa: "پدر" },
  kind: { de: "Kind", fa: "بچه" },
  baby: { de: "Baby", fa: "نوزاد" },
  sohn: { de: "Sohn", fa: "پسر" },
  frau: { de: "Frau", fa: "زن" },
  mann: { de: "Mann", fa: "مرد" },
  kindheit: { de: "Kindheit", fa: "کودکی" },
  geschwister: { de: "Geschwister", fa: "خواهر و برادر" },

  // خانه و محیط
  haus: { de: "Haus", fa: "خانه" },
  tür: { de: "Tür", fa: "در" },
  wand: { de: "Wand", fa: "دیوار" },
  dach: { de: "Dach", fa: "سقف" },
  bett: { de: "Bett", fa: "تخت" },
  stuhl: { de: "Stuhl", fa: "صندلی" },
  tisch: { de: "Tisch", fa: "میز" },
  fenster: { de: "Fenster", fa: "پنجره" },
  licht: { de: "Licht", fa: "نور" },
  lampe: { de: "Lampe", fa: "چراغ" },
  teppich: { de: "Teppich", fa: "فرش" },
  kuche: { de: "Küche", fa: "آشپزخانه" },
  bad: { de: "Bad", fa: "حمام" },
  garten: { de: "Garten", fa: "باغ" },
  baum: { de: "Baum", fa: "درخت" },
  blume: { de: "Blume", fa: "گل" },
  gras: { de: "Gras", fa: "چمن" },
  stein: { de: "Stein", fa: "سنگ" },
  wasser: { de: "Wasser", fa: "آب" },
  erde: { de: "Erde", fa: "زمین" },
  himmel: { de: "Himmel", fa: "آسمان" },
  sonne: { de: "Sonne", fa: "خورشید" },
  mond: { de: "Mond", fa: "ماه" },
  stern: { de: "Stern", fa: "ستاره" },
  wolke: { de: "Wolke", fa: "ابر" },
  regen: { de: "Regen", fa: "باران" },
  schnee: { de: "Schnee", fa: "برف" },
  wind: { de: "Wind", fa: "باد" },
  feuer: { de: "Feuer", fa: "آتش" },
  nacht: { de: "Nacht", fa: "شب" },
  tag: { de: "Tag", fa: "روز" },
  morgen: { de: "Morgen", fa: "صبح / فردا" },
  abend: { de: "Abend", fa: "عصر" },

  // حیوانات
  hund: { de: "Hund", fa: "سگ" },
  katze: { de: "Katze", fa: "گربه" },
  maus: { de: "Maus", fa: "موش" },
  vogel: { de: "Vogel", fa: "پرنده" },
  fisch: { de: "Fisch", fa: "ماهی" },
  pferd: { de: "Pferd", fa: "اسب" },
  kuh: { de: "Kuh", fa: "گاو" },
  schaf: { de: "Schaf", fa: "گوسفند" },
  ziege: { de: "Ziege", fa: "بز" },
  hase: { de: "Hase", fa: "خرگوش" },
  fuchs: { de: "Fuchs", fa: "روباه" },
  wolf: { de: "Wolf", fa: "گرگ" },
  bar: { de: "Bär", fa: "خرس" },
  loewe: { de: "Löwe", fa: "شیر" },
  tiere: { de: "Tiere", fa: "حیوانات" },
  vogelbuch: { de: "Vogelbuch", fa: "کتاب پرنده‌شناسی" },

  // غذا و نوشیدنی
  brot: { de: "Brot", fa: "نان" },
  milch: { de: "Milch", fa: "شیر" },
  kaffee: { de: "Kaffee", fa: "قهوه" },
  tee: { de: "Tee", fa: "چای" },
  saft: { de: "Saft", fa: "آبمیوه" },
  wasserflasche: { de: "Wasserflasche", fa: "بطری آب" },
  apfel: { de: "Apfel", fa: "سیب" },
  birne: { de: "Birne", fa: "گلابی" },
  kirsche: { de: "Kirsche", fa: "گیلاس" },
  traube: { de: "Traube", fa: "انگور" },
  kartoffel: { de: "Kartoffel", fa: "سیب‌زمینی" },
  tomaten: { de: "Tomaten", fa: "گوجه‌فرنگی" },
  gemuse: { de: "Gemüse", fa: "سبزیجات" },
  obst: { de: "Obst", fa: "میوه" },
  fleisch: { de: "Fleisch", fa: "گوشت" },
  ei: { de: "Ei", fa: "تخم‌مرغ" },
  suppe: { de: "Suppe", fa: "سوپ" },
  salat: { de: "Salat", fa: "سالاد" },
  butter: { de: "Butter", fa: "کره" },
  kase: { de: "Käse", fa: "پنیر" },
  wurst: { de: "Wurst", fa: "سوسیس" },
  schokolade: { de: "Schokolade", fa: "شکلات" },
  kuchen: { de: "Kuchen", fa: "کیک" },
  eis: { de: "Eis", fa: "بستنی" },

  // بدن
  kopf: { de: "Kopf", fa: "سر" },
  auge: { de: "Auge", fa: "چشم" },
  augen: { de: "Augen", fa: "چشم‌ها" },
  ohren: { de: "Ohren", fa: "گوش‌ها" },
  nase: { de: "Nase", fa: "بینی" },
  mund: { de: "Mund", fa: "دهان" },
  hand: { de: "Hand", fa: "دست" },
  hande: { de: "Hände", fa: "دست‌ها" },
  finger: { de: "Finger", fa: "انگشت" },
  bein: { de: "Bein", fa: "پا" },
  beine: { de: "Beine", fa: "پاها" },
  fuß: { de: "Fuß", fa: "پا (قدم)" },
  herz: { de: "Herz", fa: "قلب" },
  rücken: { de: "Rücken", fa: "کمر" },
  bauch: { de: "Bauch", fa: "شکم" },
  haar: { de: "Haar", fa: "موی" },
  zahn: { de: "Zahn", fa: "دندان" },
  zahne: { de: "Zähne", fa: "دندان‌ها" },

  // پوشاک
  hemd: { de: "Hemd", fa: "پیراهن" },
  hose: { de: "Hose", fa: "شلوار" },
  rock: { de: "Rock", fa: "دامن" },
  kleid: { de: "Kleid", fa: "لباس" },
  jacke: { de: "Jacke", fa: "کت" },
  mantel: { de: "Mantel", fa: "پالتو" },
  schuh: { de: "Schuh", fa: "کفش" },
  schuhe: { de: "Schuhe", fa: "کفش‌ها" },
  socke: { de: "Socke", fa: "جوراب" },
  mutze: { de: "Mütze", fa: "کلاه" },

  // رنگ‌ها و صفات
  rot: { de: "rot", fa: "قرمز" },
  blau: { de: "blau", fa: "آبی" },
  grun: { de: "grün", fa: "سبز" },
  gelb: { de: "gelb", fa: "زرد" },
  schwarz: { de: "schwarz", fa: "سیاه" },
  weiß: { de: "weiß", fa: "سفید" },
  braun: { de: "braun", fa: "قهوه‌ای" },
  grau: { de: "grau", fa: "خاکستری" },
  bunt: { de: "bunt", fa: "رنگارنگ" },
  groß: { de: "groß", fa: "بزرگ" },
  klein: { de: "klein", fa: "کوچک" },
  alt: { de: "alt", fa: "قدیمی" },
  jung: { de: "jung", fa: "جوان" },
  neu: { de: "neu", fa: "جدید" },
  gut: { de: "gut", fa: "خوب" },
  schlecht: { de: "schlecht", fa: "بد" },
  schon: { de: "schön", fa: "زیبا" },
  hesslich: { de: "hässlich", fa: "زشت" },
  schnell: { de: "schnell", fa: "سریع" },
  langsam: { de: "langsam", fa: "آهسته" },
  warm: { de: "warm", fa: "گرم" },
  kalt: { de: "kalt", fa: "سرد" },
  heiß: { de: "heiß", fa: "داغ" },
  laut: { de: "laut", fa: "بلند" },
  leise: { de: "leise", fa: "آرام" },
  stark: { de: "stark", fa: "قوی" },
  schwach: { de: "schwach", fa: "ضعیف" },
  reich: { de: "reich", fa: "ثروتمند" },
  arm: { de: "arm", fa: "فقیر" },
  glucklich: { de: "glücklich", fa: "خوشحال" },
  traurig: { de: "traurig", fa: "غمگین" },
  mude: { de: "müde", fa: "خسته" },
  krank: { de: "krank", fa: "بیمار" },
  gesund: { de: "gesund", fa: "سالم" },
  fertig: { de: "fertig", fa: "آماده" },
  wichtig: { de: "wichtig", fa: "مهم" },
  richtig: { de: "richtig", fa: "درست" },
  falsch: { de: "falsch", fa: "اشتباه" },
  leicht: { de: "leicht", fa: "آسان" },
  schwer: { de: "schwer", fa: "سخت" },
  teuer: { de: "teuer", fa: "گران" },
  billig: { de: "billig", fa: "ارزان" },
  interessen: { de: "interessant", fa: "جالب" },

  // اعداد و زمان
  uhr: { de: "Uhr", fa: "ساعت" },
  zeit: { de: "Zeit", fa: "زمان" },
  stunde: { de: "Stunde", fa: "ساعت (مدت)" },
  minute: { de: "Minute", fa: "دقیقه" },
  woche: { de: "Woche", fa: "هفته" },
  monat: { de: "Monat", fa: "ماه" },
  jahr: { de: "Jahr", fa: "سال" },
  heute: { de: "heute", fa: "امروز" },
  gestern: { de: "gestern", fa: "دیروز" },
  jetzt: { de: "jetzt", fa: "الان" },
  spät: { de: "spät", fa: "دیر" },
  früh: { de: "früh", fa: "زود" },

  // طبیعت و فصل
  fruhling: { de: "Frühling", fa: "بهار" },
  sommer: { de: "Sommer", fa: "تابستان" },
  herbst: { de: "Herbst", fa: "پاییز" },
  winter: { de: "Winter", fa: "زمستان" },
  berg: { de: "Berg", fa: "کوه" },
  see: { de: "See", fa: "دریاچه" },
  fluss: { de: "Fluss", fa: "رودخانه" },
  meer: { de: "Meer", fa: "دریا" },
  strand: { de: "Strand", fa: "ساحل" },
  wald: { de: "Wald", fa: "جنگل" },
  feld: { de: "Feld", fa: "مزرعه" },
  insel: { de: "Insel", fa: "جزیره" },
  blatt: { de: "Blatt", fa: "برگ" },
  wurzel: { de: "Wurzel", fa: "ریشه" },
  samen: { de: "Samen", fa: "بذر" },
  pilz: { de: "Pilz", fa: "قارچ" },
  moos: { de: "Moos", fa: "خزه" },

  // وسایل و تکنولوژی
  auto: { de: "Auto", fa: "ماشین" },
  bus: { de: "Bus", fa: "اتوبوس" },
  zug: { de: "Zug", fa: "قطار" },
  rad: { de: "Rad", fa: "چرخ" },
  fahrrad: { de: "Fahrrad", fa: "دوچرخه" },
  motor: { de: "Motor", fa: "موتور" },
  flugzeug: { de: "Flugzeug", fa: "هواپیما" },
  schiff: { de: "Schiff", fa: "کشتی" },
  boot: { de: "Boot", fa: "قایق" },
  telefon: { de: "Telefon", fa: "تلفن" },
  computer: { de: "Computer", fa: "کامپیوتر" },
  bildschirm: { de: "Bildschirm", fa: "مانیتور" },
  tastatur: { de: "Tastatur", fa: "صفحه‌کلید" },
  kamera: { de: "Kamera", fa: "دوربین" },
  radio: { de: "Radio", fa: "رادیو" },
  uhrwerk: { de: "Armbanduhr", fa: "ساعت مچی" },

  // مدرسه و کار
  schule: { de: "Schule", fa: "مدرسه" },
  buch: { de: "Buch", fa: "کتاب" },
  bucher: { de: "Bücher", fa: "کتاب‌ها" },
  heft: { de: "Heft", fa: "دفتر" },
  stift: { de: "Stift", fa: "مداد" },
  tafel: { de: "Tafel", fa: "تخته‌سیاه" },
  lehrer: { de: "Lehrer", fa: "معلم" },
  schuler: { de: "Schüler", fa: "دانش‌آموز" },
  klasse: { de: "Klasse", fa: "کلاس" },
  prufung: { de: "Prüfung", fa: "امتحان" },
  note: { de: "Note", fa: "نمره" },
  hausaufgaben: { de: "Hausaufgaben", fa: "تکلیف" },
  feuerzeug: { de: "Feuerzeug", fa: "فندک" },
  arbeit: { de: "Arbeit", fa: "کار" },
  beruf: { de: "Beruf", fa: "شغل" },
  buro: { de: "Büro", fa: "اداره" },
  chef: { de: "Chef", fa: "رئیس" },
  kollege: { de: "Kollege", fa: "همکار" },
  meeting: { de: "Meeting", fa: "جلسه" },

  // احساسات و افعال
  liebe: { de: "Liebe", fa: "عشق" },
  freude: { de: "Freude", fa: "شادی" },
  angst: { de: "Angst", fa: "ترس" },
  wut: { de: "Wut", fa: "خشم" },
  traum: { de: "Traum", fa: "رویا" },
  hoffnung: { de: "Hoffnung", fa: "امید" },
  gedanke: { de: "Gedanke", fa: "فکر" },
  frage: { de: "Frage", fa: "سؤال" },
  antwort: { de: "Antwort", fa: "جواب" },
  geschichte: { de: "Geschichte", fa: "داستان/تاریخ" },
  musik: { de: "Musik", fa: "موسیقی" },
  tanz: { de: "Tanz", fa: "رقص" },
  spiel: { de: "Spiel", fa: "بازی" },
  sport: { de: "Sport", fa: "ورزش" },
  reise: { de: "Reise", fa: "سفر" },
  urlaub: { de: "Urlaub", fa: "تعطیلات" },
  geschenk: { de: "Geschenk", fa: "هدیه" },
  party: { de: "Party", fa: "جشن" },
  feier: { de: "Feier", fa: "جشن گرفتن" },
  erfolg: { de: "Erfolg", fa: "موفقیت" },
  fehler: { de: "Fehler", fa: "اشتباه" },
  problem: { de: "Problem", fa: "مشکل" },
  lösung: { de: "Lösung", fa: "راه‌حل" },
  versuch: { de: "Versuch", fa: "تلاش" },
  gewinn: { de: "Gewinn", fa: "برد" },
  verlust: { de: "Verlust", fa: "باخت" },

  // مفاهیم انتزاعی
  zeitgeist: { de: "Zeitgeist", fa: "روح زمانه" },
  fernweh: { de: "Fernweh", fa: "دلتنگی برای دوردست‌ها" },
  heimweh: { de: "Heimweh", fa: "دلتنگی برای وطن" },
  sehnsucht: { de: "Sehnsucht", fa: "اشتیاق" },
  gemutlichkeit: { de: "Gemütlichkeit", fa: "آرامش و راحتی" },
  schadenfreude: { de: "Schadenfreude", fa: "شادی از بدبختی دیگران" },

  // سایر کلمات رایج
  ding: { de: "Ding", fa: "چیز" },
  sache: { de: "Sache", fa: "شیء/موضوع" },
  weg: { de: "Weg", fa: "راه" },
  ort: { de: "Ort", fa: "مکان" },
  stadt: { de: "Stadt", fa: "شهر" },
  dorf: { de: "Dorf", fa: "روستا" },
  land: { de: "Land", fa: "کشور/زمین" },
  welt: { de: "Welt", fa: "جهان" },
  deutschland: { de: "Deutschland", fa: "آلمان" },
  sprache: { de: "Sprache", fa: "زبان" },
  wort: { de: "Wort", fa: "کلمه" },
  worter: { de: "Wörter", fa: "کلمات" },
  satz: { de: "Satz", fa: "جمله" },
  text: { de: "Text", fa: "متن" },
  buchstabe: { de: "Buchstabe", fa: "حرف" },
  alphabet: { de: "Alphabet", fa: "الفبا" },
  name: { de: "Name", fa: "نام" },
  nummer: { de: "Nummer", fa: "شماره" },
  farbe: { de: "Farbe", fa: "رنگ" },
  form: { de: "Form", fa: "شکل" },
  grund: { de: "Grund", fa: "دلیل" },
  ziel: { de: "Ziel", fa: "هدف" },
  plan: { de: "Plan", fa: "نقشه" },
  idee: { de: "Idee", fa: "ایده" },
};

// نرمال‌سازی کلید: Umlaut‌ها به حرف پایه فرو می‌ریزند (ä→a، ö→o، ü→u، ß→s).
// این‌طوری هم کلیدهای دیکشنری (نوشته‌شده با شکل نرمال‌شده مثل «kuche»)
// و هم ورودی کاربر با Umlaut واقعی (مثل «Küche») به یک کلید می‌رسند.
function normalizeKey(s: string): string {
  return s
    .toLowerCase()
    .replace(/ä/g, "a")
    .replace(/ö/g, "o")
    .replace(/ü/g, "u")
    .replace(/ß/g, "s")
    .replace(/[^a-z]/g, "");
}

// نسخهٔ نرمال‌شدهٔ دیکشنری برای جستجوی سریع
const WORDS_NORM: Record<string, { de: string; fa: string }> = {};
for (const k of Object.keys(WORDS)) {
  WORDS_NORM[normalizeKey(k)] = WORDS[k];
}

// جستجوی کلمه — ورودی می‌تواند حروف پراکنده باشد
export function lookupWord(letters: string): { de: string; fa: string } | null {
  return WORDS_NORM[normalizeKey(letters)] ?? null;
}

// کلمات ممکن از یک مجموعه حروف (برای پیشنهاد به کاربر)
export function wordsFromLetters(letters: string): string[] {
  const pool = normalizeKey(letters).split("");
  const out: string[] = [];
  for (const key of Object.keys(WORDS_NORM)) {
    const need = key.split("");
    const have = [...pool];
    let ok = true;
    for (const c of need) {
      const i = have.indexOf(c);
      if (i < 0) {
        ok = false;
        break;
      }
      have.splice(i, 1);
    }
    if (ok) out.push(WORDS_NORM[key].de);
  }
  return out.sort((a, b) => a.length - b.length).slice(0, 8);
}

// انتخاب یک کلمهٔ هدف که کامل با حروف موجود قابل ساخت باشد.
// available: حروفی که کاربر در اختیار دارد (مثلاً الفبای روی صفحه).
// minLen/maxLen: محدودیت طول کلمه (برای سختی).
export function pickBuildableWord(
  available: string[],
  minLen = 3,
  maxLen = 7
): string | null {
  const pool = available
    .map((c) => normalizeKey(c))
    .join("")
    .split("");
  const ok: string[] = [];
  for (const key of Object.keys(WORDS_NORM)) {
    if (key.length < minLen || key.length > maxLen) continue;
    const have = [...pool];
    let good = true;
    for (const c of key) {
      const i = have.indexOf(c);
      if (i < 0) {
        good = false;
        break;
      }
      have.splice(i, 1);
    }
    if (good) ok.push(key);
  }
  if (!ok.length) return null;
  return ok[(Math.random() * ok.length) | 0];
}
