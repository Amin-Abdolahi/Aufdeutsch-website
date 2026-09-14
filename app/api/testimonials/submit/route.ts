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
  try {
    const body = await request.json();
    console.log("Testimonial submit body:", body);
    const { authorName, course, text, rating, locale } = body;

    if (!authorName || !course || !text || rating === undefined || rating === null || !locale) {
      console.log("Validation failed:", { authorName, course, text, rating, locale });
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be 1-5" }, { status: 400 });
    }

    const validLocales = ["fa", "de", "en"] as const;
    if (!validLocales.includes(locale as any)) {
      return NextResponse.json({ error: "Invalid locale" }, { status: 400 });
    }

    // Save testimonial (pending approval)
    const testimonial = await addTestimonial({
      authorName: authorName.trim(),
      course: course.trim(),
      text: text.trim(),
      rating,
      locale: locale as "fa" | "de" | "en",
    });

    // Send notification email for approval
    const resendClient = getResendClient();
    if (resendClient) {
      const approvalUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://aufdeutsch.ir"}/api/admin/testimonials/approve/${testimonial.id}`;
      const rejectUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://aufdeutsch.ir"}/api/admin/testimonials/reject/${testimonial.id}`;

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
      }
    } else {
      console.warn("RESEND_API_KEY not set, testimonial saved but no email sent:", testimonial);
    }

    return NextResponse.json({ 
      success: true, 
      message: "Testimonial submitted for review",
      testimonialId: testimonial.id 
    });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}