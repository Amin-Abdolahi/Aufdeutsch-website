import { useState } from "react";
import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Stamp } from "@/components/ui/Stamp";

interface ContactFormState {
  name: string;
  email: string;
  phone: string;
  level: string;
  message: string;
}

export default function Contact() {
  const [formState, setFormState] = useState<ContactFormState>({
    name: "",
    email: "",
    phone: "",
    level: "A1",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSuccess(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setFormState({ name: "", email: "", phone: "", level: "A1", message: "" });
      setIsSuccess(false);
    }, 3000);
  };

  const contactInfo = [
    {
      icon: "clock",
      title: "ساعت کاری",
      description: "شنبه تا چهارشنبه: ۱۰:۰۰ - ۲۰:۰۰",
      time: "۱۰:۰۰ - ۲۰:۰۰",
    },
    {
      icon: "phone",
      title: "تماس",
      description: "پشتیبانی آنلاین و مشاوره",
      phone: "+۹۸ (۹۱۲) ۰۰۰-۰۰۰۰",
    },
    {
      icon: "email",
      title: "ایمیل",
      description: "پاسخگویی در عرض ۲۴ ساعت",
      email: "info@aufdeutsch.ir",
    },
    {
      icon: "location",
      title: "آدرس",
      description: "تهران، خیابان آزادی، مجتمع فرهنگی",
      address: "تهران، خیابان آزادی",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Section variant="navy" className="relative overflow-hidden">
        <div className="max-w-6xl mx-auto text-center">
          <Badge variant="red" className="mb-6">تماس با ما</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-paper-100 leading-[1.3] mb-6">
            همین امروز شروع کنید
          </h1>
          <p className="text-paper-100/80 text-xl mb-10 max-w-3xl mx-auto leading-relaxed">
            جلسه مشاوره رایگان را رزرو کنید و برنامه شخصی سازی شده یادگیری آلمانی خود را دریافت کنید.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button href="tel:+989120000000" size="lg">
              تماس فوری ←
            </Button>
            <Button href="mailto:info@aufdeutsch.ir" variant="outline" size="lg">
              ارسال ایمیل
            </Button>
          </div>
        </div>
      </Section>

      {/* Form Section */}
      <Section className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <div>
              <div className="bg-navy-900 p-8 rounded-sm shadow-xl relative">
                <div className="absolute -top-3 -left-3 w-16 h-16 bg-gold-500 rounded-sm flex items-center justify-center">
                  <Stamp size={64} />
                </div>
                
                <h2 className="text-2xl font-bold text-paper-100 mb-6">فرم درخواست مشاوره</h2>
                <p className="text-paper-100/70 mb-8 text-sm">
                  لطفاً اطلاعات خود را وارد کنید. یکی از مدرسین ما در عرض ۲۴ ساعت با شما تماس میگیرد.
                </p>

                {isSuccess ? (
                  <div className="bg-green-500/10 border border-green-500/30 p-6 rounded-sm text-center">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h3 className="text-green-500 font-bold text-lg mb-2">درخواست شما ثبت شد!</h3>
                    <p className="text-green-600 text-sm">
                      ما در عرض ۲۴ ساعت با شما تماس میگیریم.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-paper-100 font-medium mb-2">
                        نا�� و نام خانوادگی *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formState.name}
                        onChange={handleChange}
                        className="w-full bg-navy-800 border border-navy-700 text-paper-100 px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        placeholder="مثال: علی محمدی"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-paper-100 font-medium mb-2">
                        ایمیل *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formState.email}
                        onChange={handleChange}
                        className="w-full bg-navy-800 border border-navy-700 text-paper-100 px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        placeholder="example@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-paper-100 font-medium mb-2">
                        شماره موبایل *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={formState.phone}
                        onChange={handleChange}
                        className="w-full bg-navy-800 border border-navy-700 text-paper-100 px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                        placeholder="۰۹۱۲۰۰۰۰۰۰۰۰"
                      />
                    </div>

                    <div>
                      <label htmlFor="level" className="block text-paper-100 font-medium mb-2">
                        سطح فعلی زبان *
                      </label>
                      <select
                        id="level"
                        name="level"
                        value={formState.level}
                        onChange={handleChange}
                        className="w-full bg-navy-800 border border-navy-700 text-paper-100 px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors"
                      >
                        <option value="A1">A1 - مبتدی</option>
                        <option value="A2">A2 - پایه</option>
                        <option value="B1">B1 - متوسط</option>
                        <option value="B2">B2 - پیشرفته</option>
                        <option value="C1">C1 - کاملاً پیشرفته</option>
                        <option value="test">آمادگی آزمون (Goethe/TestDaF)</option>
                        <option value="other">دیگر</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-paper-100 font-medium mb-2">
                        پیام شما
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={4}
                        value={formState.message}
                        onChange={handleChange}
                        className="w-full bg-navy-800 border border-navy-700 text-paper-100 px-4 py-3 rounded-sm focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500 transition-colors resize-none"
                        placeholder="سوالات خود را اینجا بنویسید..."
                      />
                    </div>

                    <Button type="submit" size="lg" disabled={isSubmitting} className="w-full">
                      {isSubmitting ? "در حال ارسال..." : "ارسال درخواست ←"}
                    </Button>

                    <p className="text-paper-100/50 text-xs text-center mt-4">
                      اطلاعات شما کاملاً محرمانه است و فقط برای ارتباط با شما استفاده میشود.
                    </p>
                  </form>
                )}
              </div>
            </div>

            {/* Contact Info */}
            <div>
              <h2 className="text-2xl font-bold text-navy-900 mb-8">اطلاعات تماس</h2>
              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <div key={index} className="bg-navy-50 p-6 rounded-sm border border-navy-100 flex items-start gap-4 hover:bg-navy-100 transition-colors">
                    <div className="w-12 h-12 rounded-full bg-gold-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-paper-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        {info.icon === "clock" && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        )}
                        {info.icon === "phone" && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        )}
                        {info.icon === "email" && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        )}
                        {info.icon === "location" && (
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        )}
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-navy-900 mb-1">{info.title}</h3>
                      <p className="text-navy-900/70 text-sm">{info.description}</p>
                      {info.time && <p className="text-gold-600 font-medium text-sm mt-1">{info.time}</p>}
                      {info.phone && <a href={`tel:${info.phone}`} className="text-gold-600 font-medium text-sm mt-1 block">{info.phone}</a>}
                      {info.email && <a href={`mailto:${info.email}`} className="text-gold-600 font-medium text-sm mt-1 block">{info.email}</a>}
                      {info.address && <p className="text-navy-900/70 text-sm mt-1">{info.address}</p>}
                    </div>
                  </div>
                ))}
              </div>

              {/* Social Media */}
              <div className="mt-10">
                <h3 className="font-bold text-navy-900 mb-4">ما را در شبکههای اجتماعی دنبال کنید</h3>
                <div className="flex gap-3">
                  <a href="https://instagram.com/aufdeutsch" target="_blank" rel="noopener noreferrer" className="flex-1 bg-navy-900 hover:bg-navy-800 text-paper-100 py-3 rounded-sm text-center transition-colors font-medium">
                    اینستاگرام
                  </a>
                  <a href="https://t.me/aufdeutsch" target="_blank" rel="noopener noreferrer" className="flex-1 bg-navy-900 hover:bg-navy-800 text-paper-100 py-3 rounded-sm text-center transition-colors font-medium">
                    تلگرام
                  </a>
                  <a href="https://youtube.com/@aufdeutsch" target="_blank" rel="noopener noreferrer" className="flex-1 bg-navy-900 hover:bg-navy-800 text-paper-100 py-3 rounded-sm text-center transition-colors font-medium">
                    یوتیوب
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      {/* Map Section */}
      <Section className="relative">
        <div className="max-w-6xl mx-auto">
          <div className="bg-navy-900 rounded-sm overflow-hidden shadow-2xl relative">
            <div className="absolute inset-0 bg-navy-900/90 z-10" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center text-paper-100 max-w-xl mx-auto px-6">
                <div className="w-20 h-20 border-4 border-gold-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">آدرس ما</h3>
                <p className="text-paper-100/80 mb-6">
                  تهران، خیابان آزادی، مجتمع فرهنگی، طبقه سوم، دفتر آموزشی AUF Deutsch
                </p>
                <Button href="https://maps.google.com" variant="secondary" className="mx-auto">
                  مشاهده در نقشه
                </Button>
              </div>
            </div>
            <div className="h-96" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80')", backgroundSize: "cover", backgroundPosition: "center" }} />
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="relative">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-navy-900 mb-4">سوالات متداول</h2>
            <p className="text-navy-900/60 text-lg">پاسخ به سوالات پرتکرار</p>
          </div>

          <div className="space-y-4">
            {[
              { q: "چگونه جلسه مشاوره رایگان رزرو کنم؟", a: "میتوانید از طریق فرم تماس در این صفحه یا تماس با شماره ۹۱۲-۰۰۰-۰۰۰۰ جلسه مشاوره رایگان را رزرو کنید." },
              { q: "آیا دورهها آنلاین هستند؟", a: "بله، تمام دورهها به صورت آنلاین و از طریق پلتفرمهای زوم و تیمویز برگزار میشوند." },
              { q: "چه زمانی میتوانم شروع کنم؟", a: "هر زمان که بخواهید! دورهها به صورت شروعباز شروع میشوند و برنامه کاملاً انعطافپذیر است." },
              { q: "آیا گواهی پایان دوره دریافت میکنم؟", a: "بله، پس از پایان موفق دوره و انجام آزمون نهایی، گواهی حضور و موفقیت دریافت میکنید." },
              { q: "آیا قابلیت تغییر مدرس وجود دارد؟", a: "بله، اگر به دلایلی نیاز به تغییر مدرس داشتید، در خدمتتان هستیم." },
              { q: "آیا امکان پرداخت اقساط وجود دارد؟", a: "بله، برای دورههای طولانیتر امکان پرداخت اقساط ماهانه را دارید." },
            ].map((faq, index) => (
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
    </div>
  );
}