import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Card, CardTitle, CardDescription } from "@/components/ui/Card";
import { Stamp } from "@/components/ui/Stamp";
import { Badge } from "@/components/ui/Badge";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section variant="navy" className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23F3ECDD' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
            backgroundSize: "60px 60px",
          }} />
        </div>

        <div className="max-w-6xl mx-auto relative">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            {/* Hero Content */}
            <div className="lg:w-1/2">
              <Badge variant="red" className="mb-6">یادگیری زبان آلمانی</Badge>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-paper-100 leading-[1.3] mb-8">
                آلمانی را
                <span className="relative inline-block mx-3 text-gold-400">
                  درست
                  <svg
                    className="absolute -bottom-2 right-0 w-full"
                    height="8"
                    viewBox="0 0 100 8"
                    preserveAspectRatio="none"
                  >
                    <path d="M0,5 Q24,0 50,4 T100,5" stroke="currentColor" strokeWidth="3" fill="none" />
                  </svg>
                </span>
                یاد بگیرید
              </h1>
              <p className="text-paper-100/80 text-xl mb-10 leading-relaxed max-w-2xl">
                آموزش خصوصی آنلاین با مدرسین مجرب — از صفر تا آزمونهای بینالمللی.
                مثل یک سفر، قدمبهقدم همراهتان هستیم.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button href="/contact" size="lg" className="font-mono">
                  رزرو جلسه رایگان ←
                </Button>
                <Button href="/courses" variant="outline" size="lg">
                  مشاهده دورهها
                </Button>
              </div>
            </div>

            {/* Hero Image / Stamp */}
            <div className="lg:w-1/2 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="bg-paper-100 p-12 rounded-sm shadow-2xl relative">
                  <div className="relative">
                    <div className="w-48 h-48 mx-auto">
                      <Stamp size={192} />
                    </div>
                  </div>
                </div>
                {/* Decorative elements */}
                <div className="absolute -top-4 -right-4 w-24 h-8 bg-gold-500/20 -rotate-12" />
                <div className="absolute -bottom-4 -left-4 w-24 h-8 bg-gold-500/20 rotate-12" />
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Stats Section */}
      <Section className="relative">
        <div className="absolute inset-0 bg-paper-50" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">چرا AUF Deutsch؟</h2>
            <p className="text-navy-900/60 text-lg">سه دلیل ساده</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card rotate="left">
              <CardTitle>شخصیسازیشده</CardTitle>
              <CardDescription>
                برنامهی درسی دقیقاً متناسب با هدف و سطح شما طراحی میشود.
              </CardDescription>
            </Card>
            <Card rotate="none">
              <CardTitle>دو مدرس، دو تخصص</CardTitle>
              <CardDescription>
                مکالمه، گرامر، و آمادگی آزمون از دو معلم مجرب.
              </CardDescription>
            </Card>
            <Card rotate="right">
              <CardTitle>کاملاً آنلاین</CardTitle>
              <CardDescription>
                از هر جای دنیا، در زمان دلخواه شما آموزش میبینید.
              </CardDescription>
            </Card>
          </div>
        </div>
      </Section>

      {/* Courses Preview */}
      <Section variant="navy" className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="gold" className="mb-4">دورههای تخصصی</Badge>
              <h2 className="text-3xl font-bold text-paper-100 mb-6">
                از A1 تا C1 — مسیر کامل یادگیری
              </h2>
              <p className="text-paper-100/80 text-lg mb-8">
                دورههای ما شما را از مبتدی تا پیشرفته همراهی میکنند.
                هر سطح شامل تمرینات عملی، پروژههای مکالمه و آمادگی آزمون است.
              </p>
              <Button href="/courses" variant="secondary" size="lg">
                مشاهده تمام دورهها
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-6">
              {[
                { level: "A1", title: "مبتدی", desc: "مکالمات روزمره" },
                { level: "A2", title: "پایه", desc: "جملهسازی حرفهای" },
                { level: "B1", title: "متوسط", desc: "مکالمه روان" },
                { level: "B2", title: "پیشمتوسط", desc: "تحصیل و کار" },
                { level: "C1", title: "پیشرفته", desc: "تجاری و آکادمیک" },
                { level: "TEST", title: "آزمون", desc: "Goethe، TestDaF" },
              ].map((course) => (
                <div
                  key={course.level}
                  className="bg-navy-800 hover:bg-navy-700 p-6 rounded-sm transition-all hover:scale-105 group"
                >
                  <div className="text-3xl font-bold text-gold-500 mb-2 group-hover:text-gold-400 transition-colors">
                    {course.level}
                  </div>
                  <div className="text-paper-100 font-bold mb-1">{course.title}</div>
                  <div className="text-paper-100/60 text-sm">{course.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%231B2A44' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E\")",
            backgroundSize: "50px 50px",
          }} />
        </div>

        <div className="max-w-3xl mx-auto relative z-10">
          <div className="bg-paper-100 p-10 md:p-14 shadow-2xl relative -rotate-1">
            <div className="absolute -top-3 left-10 w-14 h-6 bg-gold-500/30 rotate-[-4deg]" />
            <div className="absolute -top-3 right-10 w-14 h-6 bg-gold-500/30 rotate-3" />
            <div className="absolute -bottom-3 left-12 w-10 h-4 bg-red-600/20 rotate-12" />
            <div className="absolute -bottom-3 right-12 w-10 h-4 bg-red-600/20 -rotate-12" />
            
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-navy-900 mb-6">نظرات شاگردان</h3>
              <div className="space-y-8">
                {[
                  {
                    text: "با روش امین و فتانه، تو ۶ ماه به سطح B1 رسیدم — چیزی که فکر میکردم یک سال طول میکشه.",
                    name: "سارا محمدی",
                    course: "دانشجوی دوره B1",
                  },
                  {
                    text: "تدریس گرامر فتانه فوقالعاده بود. مفاهیم پیچیده رو ساده و کاربردی توضیح میداد.",
                    name: "علی کریمی",
                    course: "دانشجوی دوره A2",
                  },
                ].map((testimonial, index) => (
                  <div key={index} className="border-b border-navy-900/10 pb-8 last:border-0 last:pb-0">
                    <p className="text-navy-900/80 text-lg mb-4 leading-relaxed">
                      "{testimonial.text}"
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gold-500/10 flex items-center justify-center">
                        <span className="text-gold-600 font-bold text-lg">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <div className="font-bold text-navy-900">{testimonial.name}</div>
                        <div className="text-navy-900/60 text-sm">{testimonial.course}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* CTA Section */}
      <Section variant="navy" className="relative">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-paper-100 mb-6">
            همین امروز اولین قدم رو بردارید
          </h2>
          <p className="text-paper-100/80 text-xl mb-10 max-w-2xl mx-auto">
            جلسهی مشاوره رایگان با مدرسین ما رزرو کنید و برنامهی یادگیری شخصیسازیشده خود را دریافت نمایید.
          </p>
          <Button href="/contact" size="lg" className="text-lg px-10 py-4">
            رزرو جلسه مشاوره ←
          </Button>
        </div>
      </Section>
    </div>
  );
}