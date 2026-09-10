export default function About() {
  return (
    <main className="min-h-screen bg-[#F3ECDD] py-24 px-6">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <p className="text-[#B23A2E] text-sm tracking-wide mb-4">صفحه‌ی دفترچه</p>
        <h1 className="text-4xl font-bold text-[#1B2A44] mb-4">با ما آشنا شوید</h1>
        <p className="text-[#1B2A44]/60">دو مدرس، یک هدف مشترک</p>
      </div>

      <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8">
        {/* Amin */}
        <div className="bg-white p-8 shadow-sm relative -rotate-1">
          <div className="absolute -top-2 left-8 w-10 h-4 bg-[#B08D3E]/30 -rotate-3"></div>
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#B08D3E] flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl font-bold text-[#1B2A44]">A</span>
          </div>
          <h2 className="text-xl font-bold text-center text-[#1B2A44] mb-1">امین</h2>
          <p className="text-[#B23A2E] text-sm text-center mb-4">مدرس زبان آلمانی</p>
          <p className="text-[#1B2A44]/70 text-sm leading-relaxed text-center">
            با سال‌ها تجربه در آموزش زبان آلمانی، به شاگردانم کمک می‌کنم تا با
            روشی ساده و کاربردی به سطح مورد نظرشون برسن.
          </p>
        </div>

        {/* Fataneh */}
        <div className="bg-white p-8 shadow-sm relative rotate-1">
          <div className="absolute -top-2 right-8 w-10 h-4 bg-[#B08D3E]/30 rotate-3"></div>
          <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#B08D3E] flex items-center justify-center mx-auto mb-5">
            <span className="text-2xl font-bold text-[#1B2A44]">F</span>
          </div>
          <h2 className="text-xl font-bold text-center text-[#1B2A44] mb-1">فتانه</h2>
          <p className="text-[#B23A2E] text-sm text-center mb-4">مدرس زبان آلمانی</p>
          <p className="text-[#1B2A44]/70 text-sm leading-relaxed text-center">
            عاشق زبان و فرهنگ آلمان هستم و با صبر و انگیزه، همراه شاگردانم تا
            رسیدن به هدفشون می‌مونم.
          </p>
        </div>
      </div>
    </main>
  );
}