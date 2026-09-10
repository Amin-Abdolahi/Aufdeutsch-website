import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

interface Course {
  level: string;
  title: string;
  description: string;
  duration: string;
  price: number;
  features: string[];
  accent: string;
}

export default function Courses() {
  const courses: Course[] = [
    {
      level: "A1",
      title: "مبتدی",
      description: "آشنایی با مکالمات روزمره و مفاهیم پایه زبان آلمانی",
      duration: "۸ هفته",
      price: 0,
      features: [
        "آموزش الفبا و تلفظ صحیح",
        "مکالمات روزمره و مقدماتی",
        "آشنایی با گرامر پایه",
        "تمرینات لغت و عبارات کلیدی",
        "آمادگی برای آزمون  A1",
      ],
      accent: "Northern German",
    },
    {
      level: "A2",
      title: "پایه",
      description: "توسعه مهارتهای مکالمه و جملهسازی حرفهای",
      duration: "۱۰ هفته",
      price: 0,
      features: [
        "گسترش مفردات و عبارات",
        "تمرین مکالمه در موقعیتهای مختلف",
        "آشنایی با گرامر متوسط",
        "نوشتار ساده و جامع",
        "آمادگی برای آزمون  A2",
      ],
      accent: "Standard German",
    },
    {
      level: "B1",
      title: "متوسط",
      description: "رسیدن به سطح مکالمه روان و قابل فهم",
      duration: "۱۲ هفته",
      price: 0,
      features: [
        "مکالمه روان و روزمره",
        "درک مطلب و گوش دادن فعال",
        "گرامر پیشرفتهتر",
        "نوشتار آکادمیک و اداری",
        "آمادگی برای آزمون  B1",
      ],
      accent: "Standard German",
    },
    {
      level: "B2",
      title: "پیشرفته",
      description: "آمادگی برای تحصیل و کار در محیط آلمانی",
      duration: "۱۴ هفته",
      price: 0,
      features: [
        "مکالمه حرفهای در محیط کار",
        "درک مطلب آکادمیک",
        "گرامر پیشرفته و ادبی",
        "نوشتار تحلیلی و ارائهها",
        "آمادگی برای آزمون  B2",
      ],
      accent: "Standard German",
    },
    {
      level: "C1",
      title: "پیشرفته",
      description: "سلطه کامل بر زبان برای محیط کار و تحصیل",
      duration: "۱۶ هفته",
      price: 0,
      features: [
        "مکالمه و ارائه حرفهای",
        "نوشتار آکادمیک و تحلیلی",
        "درک نکات ریز زبانی",
        "آمادگی برای آزمون  C1",
      ],
      accent: "Northern German",
    },
    {
      level: "TEST",
      title: "آزمون",
      description: "آمادگی خاص برای آزمونهای بین المللی Goethe و TestDaF",
      duration: "۸ هفته",
      price: 2000000,
      features: [
        "آشنایی با ساختار آزمون",
        "تمرین آنلاین و تمرینات نمونه",
        "ارزیابی عملکرد و بازخورد",
        "تکنیکهای مدیریت زمان",
        "پشتیبانی تا اخذ نتیجه موفق",
      ],
      accent: "Standard German",
    },
  ];

  const pricingPlans = [
    {
      title: "تک جلسه",
      price: 0,
      period: "۶۰ دقیقه",
      features: [
        "جلسه مشاوره شخصی",
        "ارزیابی سطح زبان",
        "مشاوره در انتخاب دوره",
      ],
      recommended: false,
    },
    {
      title: "پکیج ویژه A1",
      price: 0,
      period: "۸ هفته",
      features: [
        "۱۶ جلسه ۶۰ دقیقهای",
        "کتاب و منابع آموزشی",
        "تمرینات آنلاین",
        "گواهی پایان دوره",
      ],
      recommended: true,
    },
    {
      title: "پکیج تمامعیار",
      price: 0,
      period: "۱۶ هفته",
      features: [
        "۳۲ جلسه ۶۰ دقیقهای",
        "کتاب و منابع آموزشی",
        "تمرینات آنلاین",
        "گواهی پایان دوره",
        "مشاوره تا موفقیت",
      ],
      recommended: false,
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section variant="navy" className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="gold" className="mb-6">دورههای تخصصی</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-paper-100 leading-[1.3] mb-6">
            از A1 تا C1 — مسیر کامل یادگیری
          </h1>
          <p className="text-paper-100/80 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            دوره های ما شما را از مبتدی تا پیشرفته همراهی میکنند.
            هر سطح شامل تمرینات عملی، پروژههای مکالمه و آمادگی آزمون است.
          </p>
          <Button href="/contact" variant="secondary" size="lg">
            مشاوره رایگان ←
          </Button>
        </div>
      </Section>

      {/* Course Levels */}
      <Section className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">سطوح آموزشی</h2>
            <p className="text-navy-900/60 text-lg">مسیر یادگیری کامل زبان آلمانی</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Card key={course.level} className="h-full hover:shadow-lg transition-shadow">
                <div className="relative">
                  <div className="absolute -top-3 left-8 w-10 h-4 bg-gold-500/30 -rotate-5" />
                  <div className="absolute -bottom-3 right-8 w-10 h-4 bg-gold-500/30 -rotate-175" />
                  
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-gold-600 mb-2">{course.level}</div>
                    <h3 className="text-xl font-bold text-navy-900">{course.title}</h3>
                    <p className="text-navy-900/50 text-sm mt-1">{course.duration}</p>
                  </div>

                  <p className="text-navy-900/70 text-sm mb-6">{course.description}</p>

                  <div className="space-y-3 mb-6">
                    {course.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-gold-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-sm text-navy-900/80">{feature}</span>
                      </div>
                    ))}
                    {course.features.length > 3 && (
                      <div className="flex items-center gap-2 text-xs text-navy-900/60 mt-2">
                        <span>و {course.features.length - 3} مورد دیگر...</span>
                      </div>
                    )}
                  </div>

                  <div className="pt-6 border-t border-navy-900/10 flex justify-between items-center">
                    <span className="text-2xl font-bold text-gold-600">{course.price.toLocaleString("fa-IR")}</span>
                    <span className="text-navy-900/50 text-sm">تومان</span>
                  </div>
                  
                  <Button href="/contact" className="w-full mt-6">
                    شروع دوره ←
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Why Learn German */}
      <Section variant="navy" className="relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-paper-100 mb-4">چرا زبان آلمانی یاد بگیرید؟</h2>
            <p className="text-paper-100/70">مزایای یادگیری زبان آلمانی</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "🎓", title: "تحصیل رایگان", desc: "دانشگاههای آلمان با کیفیت بالا و هزینه تحصیل بسیار پایین" },
              { icon: "💼", title: "فرصتهای شغلی", desc: "پشتیبانی از مهاجران با نیاز بالا به کارگران مهارت دار" },
              { icon: "🌍", title: "فرهنگ و تاریخ", desc: "دسترسی به فرهنگ، هنر و تاریخ غنی آلمان و کشورهای اروپایی" },
            ].map((item, index) => (
              <div key={index} className="text-center p-6">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">{item.title}</h3>
                <p className="text-navy-900/70 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* Pricing Plans */}
      <Section className="relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">برنامه های آموزشی</h2>
            <p className="text-navy-900/60 text-lg">پلنی که با نیاز شما هماهنگ است</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`relative bg-white rounded-sm shadow-lg p-8 ${
                  plan.recommended ? "border-4 border-gold-500 transform scale-105 z-10" : "border border-navy-900/10"
                }`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 right-1/2 -translate-x-1/2 bg-gold-500 text-paper-100 px-4 py-1 rounded-sm font-bold">
                    پیشنهاد ویژه
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-navy-900 mb-2">{plan.title}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-3xl font-bold text-gold-600">{plan.price.toLocaleString("fa-IR")}</span>
                    <span className="text-navy-900/50">تومان</span>
                  </div>
                  <div className="text-navy-900/60 text-sm mt-2">{plan.period}</div>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-navy-900/80">
                      <svg className="w-5 h-5 text-gold-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button href="/contact" variant={plan.recommended ? "primary" : "outline"} className="w-full">
                  انتخاب پلن ←
                </Button>
              </div>
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