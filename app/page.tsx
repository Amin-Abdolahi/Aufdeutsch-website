export default function Home() {
  return (
    <main className="min-h-screen bg-[#F3ECDD]">
      {/* Hero — notebook page on ink background */}
      <section className="bg-[#1B2A44] py-24 px-6 relative">
        <div className="max-w-3xl mx-auto bg-[#F3ECDD] rounded-sm shadow-2xl px-10 py-16 md:px-16 relative">
                    {/* Passport stamp */}
          <div className="absolute -top-6 -left-6 md:-top-8 md:-left-8 w-32 h-32 rotate-[-30deg]">
            
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="78" fill="none" stroke="#B08D3E" strokeWidth="1" />
              <path id="topCurve" d="M 30,100 A 70,70 0 0,1 170,100" fill="none" />
              <path id="bottomCurve" d="M 40,115 A 60,60 0 0,0 160,115" fill="none" />
              <circle cx="100" cy="100" r="92" fill="none" stroke="#B08D3E" strokeWidth="2" />
              <text fill="#B08D3E" fontSize="15" fontWeight="bold" letterSpacing="3">
                <textPath href="#topCurve" startOffset="50%" textAnchor="middle">
                  A-U-F DEUTSCH
                </textPath>
              </text>
              <text fill="#B08D3E" fontSize="11" letterSpacing="2">
                <textPath href="#bottomCurve" startOffset="50%" textAnchor="middle">
                  ★ SPRACHSCHULE ★
                </textPath>
              </text>
              <text x="100" y="98" fill="#B08D3E" fontSize="35" fontWeight="bold" textAnchor="middle">
                A♦F
              </text>
              <text x="100" y="118" fill="#B08D3E" fontSize="10" textAnchor="middle" letterSpacing="2">
                EST. 2026
              </text>
            </svg>
          </div>

          <p className="text-[#B23A2E] text-sm tracking-wide mb-6 mr-24 md:mr-32">
            یادگیری زبان آلمانی
          </p>
          <h1 className="text-4xl md:text-6xl font-bold text-[#1B2A44] leading-[1.3] mb-8">
          آلمانی را
            <span className="relative inline-block mx-2">
              درست
              <svg
                className="absolute -bottom-2 left-0 w-full"
                height="8"
                viewBox="0 0 100 8"
                preserveAspectRatio="none"
              >
                <path d="M0,5 Q24,0 50,4 T100,5" stroke="#B23A2E" strokeWidth="3" fill="none" />
              </svg>
            </span>
            یاد بگیرید
          </h1>
          <p className="text-[#1B2A44]/70 text-lg mb-10 leading-relaxed max-w-lg">
            آموزش خصوصی آنلاین با مدرسین مجرب — از صفر تا آزمون‌های بین‌المللی. مثل یک سفر، قدم‌به‌قدم همراهتان هستیم.
          </p>
          
          <a
            href="/contact"
            className="inline-block bg-[#1B2A44] hover:bg-[#243758] text-[#F3ECDD] font-bold px-9 py-4 rounded-sm transition-all"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            رزرو جلسه‌ی  رایگان ←
          </a>
        </div>
      </section>

      {/* Notebook lines section — stats as handwritten notes */}
      <section
        className="py-20 px-6"
        style={{
          backgroundImage:
            "repeating-linear-gradient(#F3ECDD, #F3ECDD 39px, #D9CDB0 40px)",
        }}
      >
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { n: "+۸", l: "سال تجربه" },
            { n: "A1–C1", l: "تمام سطوح" },
            { n: "۲", l: "مدرس متخصص" },
          ].map((s, i) => (
            <div key={i} className="relative">
              <p className="text-4xl font-bold text-[#1B2A44]">{s.n}</p>
              <p className="text-[#1B2A44]/60 text-sm mt-1">{s.l}</p>
              <div className="w-10 h-10 border-2 border-[#B23A2E] rounded-full absolute -top-2 left-1/2 -translate-x-1/2 -z-10 opacity-40"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Why us — index cards */}
      <section className="py-28 px-6 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-[#1B2A44] mb-4 text-center">
          چرا AUF Deutsch؟
        </h2>
        <p className="text-center text-[#1B2A44]/50 text-sm mb-16" style={{ fontFamily: "var(--font-mono)" }}>
          سه دلیل ساده
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { t: "شخصی‌سازی‌شده", d: "برنامه‌ی درسی دقیقاً متناسب با هدف و سطح شما" },
            { t: "دو مدرس، دو تخصص", d: "مکالمه، گرامر، و آمادگی آزمون از دو معلم مجرب" },
            { t: "کاملاً آنلاین", d: "از هر جای دنیا، در زمان دلخواه شما" },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 shadow-sm relative"
              style={{ transform: `rotate(${i === 1 ? "0deg" : i === 0 ? "-1deg" : "1deg"})` }}
            >
              <div className="absolute -top-2 left-8 w-10 h-4 bg-[#B08D3E]/30 -rotate-5"></div>
              <div className="absolute -bottom-2 right-8 w-10 h-4 bg-[#B08D3E]/30 -rotate-175"></div>
              <h3 className="text-lg font-bold mb-3 text-[#1B2A44]">{item.t}</h3>
              <p className="text-[#1B2A44]/60 text-sm leading-relaxed">{item.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonial — torn paper with tape */}
      <section className="bg-[#1B2A44] py-28 px-6">
        <div className="max-w-xl mx-auto bg-[#F3ECDD] p-10 md:p-14 shadow-2xl relative -rotate-3">
          <div className="absolute -top-3 left-10 w-14 h-6 bg-[#B08D3E]/40 rotate-[-4deg]"></div>
          <div className="absolute -top-3 right-10 w-14 h-6 bg-[#B08D3E]/40 rotate-3"></div>
          <p className="text-xl md:text-2xl text-[#1B2A44] leading-relaxed mb-6">
            &quot;با روش امین و فتانه، تو ۶ ماه به سطح B1 رسیدم — چیزی که فکر می‌کردم یک
            سال طول می‌کشه.&quot;
          </p>
          <p className="text-[#B23A2E] text-sm" style={{ fontFamily: "var(--font-mono)" }}>
            — یکی از شاگردان AUF Deutsch
          </p>
        </div>
      </section>
    </main>
  );
}