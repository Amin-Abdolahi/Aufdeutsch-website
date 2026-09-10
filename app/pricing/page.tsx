import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function Pricing() {
  const pricingTiers = [
    {
      title: "تک جلسه مشاوره",
      price: 0,
      period: "۶۰ دقیقه",
      description: "مناسب برای افرادی که فقط نیاز به مشاوره دارند",
      features: [
        "جلسه مشاوره شخصی 15 دقیقهای",
        "ارزیابی سطح زبان دقیق",
        "مشاوره در انتخاب مناسب ترین دوره",
        "دریافت برنامه شخصی سازی شده",
      ],
      recommended: false,
      popular: false,
    },
    {
      title: "پکیج مبتدی (A1-A2)",
      price: 0,
      period: "۱۸ جلسه",
      description: "شروع مسیر یادگیری زبان آلمانی با قیمت ویژه",
      features: [
        "۱۸ جلسه ۶۰ دقیقهای (۲ جلسه در هفته)",
        "کتاب مخصوص دوره",
        "دسترسی به تمرینات آنلاین",
        "مشاوره تا موفقیت در آزمون",
        "۱۰٪ تخفیف روی دوره بعدی",
      ],
      recommended: true,
      popular: true,
    },
    {
      title: "پکیج متوسط (B1-B2)",
      price: 0,
      period: "۳۰ جلسه",
      description: "رسیدن به سطح متوسط و پیشرفته برای تحصیل یا کار",
      features: [
        "۳۰ جلسه ۶۰ دقیقهای (۳ جلسه در هفته)",
        "کتاب مخصوص دوره",
        "تمرینات مکالمه و آزمون",
        "مشاوره تا موفقیت در آزمون",
        "دسترسی به منابع آکادمیک",
        "۱۵٪ تخفیف روی دوره بعدی",
        "کارنامه آزمونهای نمونه",
      ],
      recommended: false,
      popular: false,
    },
    {
      title: "پکیج پیشرفته (C1)",
      price: 0,
      period: "۴۰ جلسه",
      description: "رسیدن به سطح فوقالعاده برای محیط کار و تحصیل",
      features: [
        "۴۰ جلسه ۶۰ دقیقهای (۴ جلسه در هفته)",
        "کتاب مخصوص دوره",
        "تمرینات پیشرفته و آکادمیک",
        "ارسال تکالیف با بازخورد شخصی",
        "مشاوره تا موفقیت در آزمون",
        "دسترسی به تمام منابع آکادمیک",
        "۲۰٪ تخفیف روی دوره بعدی",
        "ارسال فایل آموزشی خاص",
      ],
      recommended: false,
      popular: false,
    },
    {
      title: "پکیج آزمون (Goethe/TestDaF)",
      price: 0,
      period: "۲۰ جلسه",
      description: "آمادگی خاص برای آزمونهای بین المللی زبان آلمانی",
      features: [
        "۲۰ جلسه ۶۰ دقیقهای (۲ جلسه در هفته)",
        "کتاب آمادگی آزمون",
        "تمرینات آنلاین آزمونهای نمونه",
        "ارزیابی تک جلسهای",
        "کارنامه عملکرد دقیق",
        "مشاوره تا اخذ نتیجه موفق",
        "تکنیکهای مدیریت زمان",
        "پشتیبانی تا اخذ گواهی",
      ],
      recommended: true,
      popular: false,
    },
    {
      title: "کلاس گروهی کوچک",
      price: 0,
      period: "۱۶ جلسه",
      description: "یادگیری جذاب در محیط گروهی با ۴ تا ۶ نفر",
      features: [
        "کلاس گروهی با حداکثر ۶ دانشجو",
        "۱۶ جلسه ۹۰ دقیقهای",
        "کتاب و منابع آموزشی",
        "تمرینات مکالمه و تعاملی",
        "ارزیابی عملکرد ماهانه",
        "گواهی حضور و موفقیت",
      ],
      recommended: false,
      popular: true,
    },
  ];

  const paymentMethods = [
    { name: "شبا", icon: "bank", details: "شماره شبا: IR000000000000000000000000" },
    { name: "کارت به کارت", icon: "card", details: "شماره کارت: " },
    { name: "پرداخت آنلاین", icon: "online", details: "درگاه پرداخت امن" },
    { name: "درگاه بانکی", icon: "bank-card", details: "پرداخت با تمام کارتهای بانکی" },
  ];

  const FAQ = [
    { q: "آیا امکان پرداخت اقساط وجود دارد؟", a: "بله، برای دورههای طولانی تر (بیش از ۴۰ جلسه) امکان پرداخت اقساط ماهانه را دارید. کافیست با ما تماس بگیرید." },
    { q: "آیا اگر ناامید شدم، پولم را برمیگردونید؟", a: "بله، ما ۷ روز ضمانت بازگشت پول داریم. اگر با کیفیت آموزش راضی نبودید، در آن مدت پول کامل را برمیگردانیم." },
    { q: "آیا میتوانم مدرس را تغییر دهم؟", a: "بله، اگر به دلایلی با مدرس هماهنگ نبودید، در خدمتتان هستیم تا مدرس دیگری برای شما انتخاب کنیم." },
    { q: "آیا جلسات ضبط میشوند؟", a: "بله، با رضایت شما، جلسات ضبط میشوند و میتوانید در صورت نیاز به آنها دسترسی داشته باشید." },
    { q: "آیا منابع آموزشی رایگان ارائه میشود؟", a: "بله، تمامی منابع آموزشی، کتابهای الکترونیکی و تمرینات آنلاین به صورت رایگان برای شما ارائه میشود." },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section variant="navy" className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="red" className="mb-6">قیمت گذاری</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-paper-100 leading-[1.3] mb-6">
            قیمت مناسب برای یادگیری زبان آلمانی
          </h1>
          <p className="text-paper-100/80 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            با کیفیت بالا و قیمتی رقابتی. بهترین انتخاب برای یادگیری زبان آلمانی.
          </p>
          <Button href="/contact" variant="secondary" size="lg">
            مشاوره رایگان ←
          </Button>
        </div>
      </Section>

      {/* Pricing Tiers */}
      <Section className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">انتخاب پلن مناسب</h2>
            <p className="text-navy-900/60 text-lg">پلنی که با نیاز شما هماهنگ است</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-sm shadow-lg p-8 transition-all hover:shadow-xl ${
                  tier.recommended
                    ? "border-2 border-gold-500 transform scale-105 z-10"
                    : tier.popular
                    ? "border-2 border-navy-900"
                    : "border border-navy-900/10"
                }`}
              >
                {tier.recommended && (
                  <div className="absolute -top-4 right-1/2 -translate-x-1/2 bg-gold-500 text-paper-100 px-4 py-1 rounded-sm font-bold text-sm">
                    بهترین انتخاب
                  </div>
                )}
                
                {tier.popular && !tier.recommended && (
                  <div className="absolute -top-4 right-1/2 -translate-x-1/2 bg-navy-900 text-paper-100 px-4 py-1 rounded-sm font-bold text-sm">
                    پرفروشترین
                  </div>
                )}

                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-navy-900 mb-3">{tier.title}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gold-600">{tier.price.toLocaleString("fa-IR")}</span>
                    <span className="text-navy-900/50">تومان</span>
                  </div>
                  <div className="text-navy-900/60 text-sm mt-2">{tier.period}</div>
                </div>

                <p className="text-navy-900/70 text-sm mb-6 text-center">{tier.description}</p>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-navy-900/80">
                      <svg className="w-5 h-5 text-gold-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button href="/contact" variant={tier.recommended ? "primary" : "outline"} className="w-full">
                  شروع دوره ←
                </Button>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Payment Methods */}
      <Section variant="navy" className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-paper-100 mb-4">روشهای پرداخت</h2>
            <p className="text-paper-100/70">پرداخت آسان و امن</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {paymentMethods.map((method, index) => (
              <div key={index} className="text-center p-6 bg-navy-800 rounded-sm hover:bg-navy-700 transition-colors">
                <div className="w-12 h-12 rounded-full bg-gold-500/20 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {method.icon === "bank" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    )}
                    {method.icon === "card" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    )}
                    {method.icon === "online" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    )}
                    {method.icon === "bank-card" && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    )}
                  </svg>
                </div>
                <h3 className="font-bold text-paper-100 mb-2">{method.name}</h3>
                <p className="text-paper-100/70 text-xs">{method.details}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">سوالات متداول</h2>
            <p className="text-navy-900/60 text-lg">پاسخ به سوالات پرتکرار درباره قیمتگذاری</p>
          </div>

          <div className="space-y-4">
            {FAQ.map((faq, index) => (
              <details key={index} className="bg-navy-50 rounded-sm p-6 hover:bg-navy-100 transition-colors group">
                <summary className="cursor-pointer font-bold text-navy-900 text-lg flex items-center gap-3 list-none">
                  <span className="w-8 h-8 rounded-full bg-gold-500 text-paper-100 flex items-center justify-center flex-shrink-0 group-open:bg-gold-600 transition-colors">
                    {index + 1}
                  </span>
                  {faq.q}
                </summary>
                <p className="text-navy-900/70 mt-4 pl-11">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* CTA */}
      <Section variant="navy" className="relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-paper-100 mb-6">آماده شروع هستید؟</h2>
          <p className="text-paper-100/80 text-xl mb-10 max-w-2xl mx-auto">
            جلسه مشاوره رایگان رزرو کنید و برنامه شخصی سازی شده خود را دریافت کنید.
          </p>
          <Button href="/contact" size="lg" className="text-lg px-10 py-4">
            شروع مسیر یادگیری ←
          </Button>
        </div>
      </Section>
    </div>
  );
}