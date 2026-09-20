import { NextResponse } from "next/server";
import { addTestimonial } from "@/lib/testimonials";
import { Resend } from "resend";

const TO_EMAIL = process.env.CONTACT_EMAIL || "abdollahi.amin@gmail.com";

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

export async function POST(request: Request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { authorName, course, text, rating, locale } = body || {};

  // Validate required fields
  if (!authorName || !course || !text || rating === undefined || rating === null || !locale) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
  }

  const validLocales = ["fa", "de", "en"] as const;
  if (!validLocales.includes(locale as any)) {
    return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
  }

  // Save testimonial (pending approval) — on Vercel the filesystem is read-only,
  // so this may fail. We still send the notification email regardless.
  let testimonialId = `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  let fileSaved = true;
  try {
    const testimonial = await addTestimonial({
      authorName: authorName.trim(),
      course: course.trim(),
      text: text.trim(),
      rating,
      locale: locale as "fa" | "de" | "en",
    });
    testimonialId = testimonial.id;
  } catch (saveError) {
    // Filesystem not writable (e.g. Vercel serverless) — continue to send email
    fileSaved = false;
    console.error("Failed to save testimonial to file:", saveError);
  }

  // Send notification email for approval
  // This is the primary delivery method on Vercel where filesystem is read-only
  const resendClient = getResendClient();
  if (resendClient) {
    const approvalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://aufdeutsch.ir"}/api/admin/testimonials/approve/${testimonialId}`;
    const rejectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://aufdeutsch.ir"}/api/admin/testimonials/reject/${testimonialId}`;

    try {
      await resendClient.emails.send({
        from: "AUF Deutsch Testimonials <onboarding@resend.dev>",
        to: TO_EMAIL,
        subject: `📝 نظر جدید برای تایید: ${authorName} (${locale.toUpperCase()})`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #1B2A44; border-bottom: 2px solid #B08D3E; padding-bottom: 10px;">
              نظر جدید شاگرد - نیاز به تایید
            </h2>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; background: #F3ECDD; font-weight: bold; width: 30%;">نام</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${authorName}</td>
              </tr>
              <tr>
                <td style="padding: 10px; background: #F3ECDD; font-weight: bold;">دوره/سطح</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${course}</td>
              </tr>
              <tr>
                <td style="padding: 10px; background: #F3ECDD; font-weight: bold;">امتیاز</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${rating}/5 ${"★".repeat(rating)}${"☆".repeat(5-rating)}</td>
              </tr>
              <tr>
                <td style="padding: 10px; background: #F3ECDD; font-weight: bold;">زبان</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${locale.toUpperCase()}</td>
              </tr>
            </table>

            <div style="margin-top: 20px;">
              <h3 style="color: #1B2A44;">متن نظر:</h3>
              <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #ddd; white-space: pre-wrap;">
                ${text}
              </div>
            </div>

            <div style="margin-top: 30px;">
              <a href="${approvalUrl}" style="background: #22c55e; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; margin-right: 10px; display: inline-block;">✅ تایید و انتشار</a>
              <a href="${rejectUrl}" style="background: #ef4444; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; display: inline-block;">❌ رد و حذف</a>
            </div>

            ${!fileSaved ? `
            <div style="margin-top: 20px; padding: 10px; background: #fff3cd; border: 1px solid #ffc107; border-radius: 5px;">
              ⚠️ توجه: نظر در فایل ذخیره نشد (احتمالاً به دلیل read-only بودن فایل‌سیستم در Vercel).
              برای انتشار این نظر، آن را به صورت دستی به فایل <code>data/testimonials.json</code> اضافه کنید.
            </div>
            ` : ""}

            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 12px;">
              ارسال شده در: ${new Date().toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })}<br>
              از طریق: https://aufdeutsch.ir
            </p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error("Resend email error:", emailError);
      // If both file save and email failed, return error
      if (!fileSaved) {
        return NextResponse.json(
          { error: "Could not submit testimonial. Please try again later." },
          { status: 500 }
        );
      }
    }
  } else {
    console.warn("RESEND_API_KEY not set, testimonial saved to file:", testimonialId);
    // If no Resend key AND file save failed, we can't do anything
    if (!fileSaved) {
      return NextResponse.json(
        { error: "Server not configured for testimonial submission." },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ 
    success: true, 
    message: "Testimonial submitted for review",
    testimonialId 
  });
}