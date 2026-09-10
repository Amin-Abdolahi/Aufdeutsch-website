# SPEC: AUF Deutsch - آموزش زبان آلمانی

## موتور فنی
- Next.js 16.3.2 (App Router)
- React 19.2.8
- Tailwind CSS 4
- TypeScript 5
- Vercel Opt-in

## تم رنگی
| نام | HEX | کاربرد |
|-----|-----|--------|
| Background (Paper) | `#F3ECDD` | پس زمینه اصلی |
| Navy (Ink) | `#1B2A44` | هدر، فوتر، تاچ اصلی |
| Gold (Stamp) | `#B08D3E` | مهرها، هایلایتها |
| Red (Correction) | `#B23A2E` | اصلاحات، اکشنها |

## فونتها
- **فارسی**: Vazirmatn (variable)
- **انگلیسی/تکست**: Space Mono (monospace for UI elements)

## ساختار صفحات
| صفحه | URL | توضیحات |
|------|-----|---------|
| Home | `/` | لندینگ پیج اصلی |
| About | `/about` | معرفی مدرسین |
| Courses | `/courses` | لیست دورهها |
| Pricing | `/pricing` | قیمتگذاری |
| Contact | `/contact` | فرم تماس |
| Blog | `/blog` | مقالات |

## ویژگیها
- Landing page با تم دفترچه/پاسپورت
- دو مدرس (امین + فتانه)
- ارائه دورههای A1–C1
- فرم رزرو جلسه مشاوره رایگان
- فوتر اجتماعی (اینستاگرام، تلگرام)

## UI کامپوننتها
- Header sticky با ناوبری
- Footer با لینکهای سریع
- Hero با مهر پاسپورت
- Section با کارتهای ناهمگن
- Testimonials با افکت تارپی
- Stats با نشان دفترچه

## چیدمان ریسپانسیو
- Mobile-first
- Breakpoint md: ≥768px
- Breakpoint lg: ≥1024px
- RTL کامل (dir="rtl")
