import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export default function About() {
  const teachers = [
    {
      id: "amin",
      name: "امین",
      title: "مدرس زبان آلمانی",
      description: "با سالها تجربه در آموزش زبان آلمانی، به شاگردانم کمک میکنم تا با روشی ساده و کاربردی به سطح مورد نظرشون برسن.",
      expertise: ["گرامر پیشرفته", "آمادگی آزمون", "مکالمه تجاری"],
      years: 6,
      students: 120,
      accent: "Northern German",
    },
    {
      id: "fataneh",
      name: "فتانه",
      title: "مدرس زبان آلمانی",
      description: "عاشق زبان و فرهنگ آلمان هستم و با صبر و انگیزه، همراه شاگردانم تا رسیدن به هدفشون میمونم.",
      expertise: ["مکالمه روزمره", "آموزش مبتدی", "فرهنگ آلمانی"],
      years: 5,
      students: 95,
      accent: "Standard German",
    },
  ];

  const milestones = [
    { year: 2021, title: "تاسیس AUF Deutsch", description: "شروع فعالیت با تمرکز بر آموزش خصوصی" },
    { year: 2022, title: "آغاز آموزش آنلاین", description: "گسترش خدمات به دانشجویان خارج از کشور" },
    { year: 2023, title: "+۱۰۰ دانشجو", description: "رسیدن به مرز ۱۰۰ دانشجوی فعال" },
    { year: 2024, title: "راهاندازی دورههای گروهی", description: "افزودن کلاسهای گروهی کوچک" },
    { year: 2025, title: "برگزاری وبینارهای آموزشی", description: "ارائه محتوای رایگان برای جامعه" },
    {
      year: 2026, title: "توسعه پلتفرم یادگیری", description: "پیاده سازی سیستم تمرینات آنلاین"
    },
  ];

  const values = [
    {
      title: "شخصی سازی",
      description: "هر برنامه ی درسی دقیقاً متناسب با اهداف، سطح و سبک یادگیری شما طراحی میشود.",
    },
    {
      title: "کیفیت",
      description: "استفاده از منابع معتبر و روشهای تدریس اثبات شده برای بهترین نتایج.",
    },
    {
      title: "پشتیبانی",
      description: "همراهی مستمر در طول مسیر یادگیری، پاسخگویی به سؤالات و ارائه بازخورد.",
    },
    {
      title: "تعهد",
      description: "تعهد کامل به موفقیت شما، از اولین جلسه تا رسیدن به هدف نهایی.",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section variant="navy" className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="red" className="mb-6">درباره ما</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-paper-100 leading-[1.3] mb-6">
            دو مدرس، یک هدف مشترک
          </h1>
          <p className="text-paper-100/80 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            ما امین و فتانه هستیم، دو مدرس زبان آلمانی با عشق به تدریس و اشتیاق برای
            کمک به شما در یادگیری زبان آلمانی. تجربه و تخصص ما، مسیر شما را هموار میکند.
          </p>
          <Button href="/contact" variant="secondary" size="lg">
            مشاوره رایگان ←
          </Button>
        </div>
      </Section>

      {/* Teachers Section */}
      <Section className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">مدرسین ما</h2>
            <p className="text-navy-900/60 text-lg">تخصص و تجربه در کنار شما</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-20">
            {teachers.map((teacher) => (
              <Card key={teacher.id} rotate={teacher.id === "amin" ? "left" : "right"} className="h-full">
                <div className="flex flex-col items-center text-center">
                  <div className="w-32 h-32 rounded-full border-4 border-gold-500/20 mb-6 flex items-center justify-center bg-gradient-to-br from-gold-500/5 to-transparent">
                    <span className="text-4xl font-bold text-navy-900">
                      {teacher.name.charAt(0)}
                    </span>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-navy-900 mb-2">{teacher.name}</h3>
                    <p className="text-red-600 font-medium mb-3">{teacher.title}</p>
                    <p className="text-navy-900/70 text-sm leading-relaxed max-w-sm">
                      {teacher.description}
                    </p>
                  </div>

                  {/* Teacher Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6 w-full max-w-xs">
                    <div className="bg-navy-900/5 p-4 rounded-sm text-center">
                      <div className="text-2xl font-bold text-gold-600">{teacher.years}+</div>
                      <div className="text-navy-900/60 text-sm">سال تجربه</div>
                    </div>
                    <div className="bg-navy-900/5 p-4 rounded-sm text-center">
                      <div className="text-2xl font-bold text-gold-600">{teacher.students}+</div>
                      <div className="text-navy-900/60 text-sm">دانشجو</div>
                    </div>
                  </div>

                  {/* Expertise */}
                  <div className="mb-6">
                    <h4 className="font-bold text-navy-900 mb-3">تخصصها</h4>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {teacher.expertise.map((item) => (
                        <span key={item} className="bg-gold-500/10 text-gold-700 px-3 py-1 text-sm rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Accent */}
                  <div className="mt-auto">
                    <div className="text-navy-900/50 text-sm font-mono">
                      تلفظ: {teacher.accent}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Our Story */}
      <Section variant="navy" className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="gold" className="mb-4">داستان ما</Badge>
            <h2 className="text-3xl font-bold text-paper-100 mb-4">مسیر AUF Deutsch</h2>
            <p className="text-paper-100/80 text-lg">از یک ایده ساده تا یک جامعه یادگیری</p>
          </div>

          <div className="relative">
            {/* Timeline */}
            <div className="absolute right-1/2 translate-x-1/2 md:right-1/2 md:translate-x-1/2 top-0 bottom-0 w-0.5 bg-gold-500/30 hidden md:block" />
            
            <div className="space-y-12 md:space-y-0">
              {milestones.map((milestone, index) => (
                <div
                  key={milestone.year}
                  className={`relative ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'} md:w-1/2 ${index % 2 === 0 ? 'md:ml-auto' : ''}`}
                >
                  <div className="bg-navy-800 p-6 rounded-sm relative group hover:bg-navy-700 transition-all">
                    <div className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-gold-500 border-4 border-navy-900 group-hover:scale-110 transition-transform" />
                    <div className="text-gold-400 text-2xl font-bold mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-bold text-paper-100 mb-2">{milestone.title}</h3>
                    <p className="text-paper-100/70 text-sm">{milestone.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Our Values */}
      <Section className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">ارزشهای ما</h2>
            <p className="text-navy-900/60 text-lg">اصولی که هر روز در کار ما جاری هستند</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={value.title} rotate={index % 2 === 0 ? "left" : "right"}>
                <div className="mb-4">
                  <div className="w-16 h-16 rounded-full bg-red-600/10 flex items-center justify-center mb-4 mx-auto">
                    <span className="text-2xl font-bold text-red-600">{index + 1}</span>
                  </div>
                  <CardTitle className="text-center mb-3">{value.title}</CardTitle>
                  <CardDescription className="text-center">
                    {value.description}
                  </CardDescription>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </Section>

      {/* Why Choose Us */}
      <Section variant="navy" className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <Badge variant="red" className="mb-4">مزیت رقابتی</Badge>
            <h2 className="text-3xl font-bold text-paper-100 mb-6">چرا AUF Deutsch متفاوت است؟</h2>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-gold-400 mb-4">۲×۱</div>
              <h3 className="text-xl font-bold text-paper-100 mb-3">دو مدرس، دو تخصص</h3>
              <p className="text-paper-100/70">
                ترکیب تخصص امین در گرامر و فتانه در مکالمه، بهترین آموزش را برای شما فراهم میکند.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-gold-400 mb-4">۱۰۰٪</div>
              <h3 className="text-xl font-bold text-paper-100 mb-3">تمرکز بر نتیجه</h3>
              <p className="text-paper-100/70">
                موفقیت شما برای ما اولویت است. ما تا رسیدن به هدف، همراه شما خواهیم بود.
              </p>
            </div>

            <div className="text-center">
              <div className="text-4xl font-bold text-gold-400 mb-4">∞</div>
              <h3 className="text-xl font-bold text-paper-100 mb-3">پشتیبانی دائمی</h3>
              <p className="text-paper-100/70">
                حتی پس از پایان دوره، دسترسی به منابع و مشاوره برای شما حفظ میشود.
              </p>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-navy-900 mb-6">آماده شروع هستید؟</h2>
          <p className="text-navy-900/70 text-xl mb-10 max-w-2xl mx-auto">
            با ما تماس بگیرید و برنامهی یادگیری شخصیسازیشده خود را دریافت کنید.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="/contact" size="lg">
              تماس با ما ←
            </Button>
            <Button href="/courses" variant="outline" size="lg">
              مشاهده دورهها
            </Button>
          </div>
        </div>
      </Section>
    </div>
  );
}