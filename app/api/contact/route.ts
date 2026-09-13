import { NextResponse } from "next/server";
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
    const { name, email, phone, level, message } = body;

    if (!name || !email || !phone || !level) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const levelLabels: Record<string, string> = {
      a1: "A1 - مبتدی",
      a2: "A2 - پایه",
      b1: "B1 - متوسط",
      b2: "B2 - پیشرفته",
      c1: "C1 - کاملاً پیشرفته",
      test: "آمادگی آزمون (Goethe/TestDaF)",
      other: "دیگر",
    };

    const selectedLevel = levelLabels[level] || level;

    const emailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #1B2A44; border-bottom: 2px solid #B08D3E; padding-bottom: 10px;">
          درخواست تماس جدید از AUF Deutsch
        </h2>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <tr>
            <td style="padding: 10px; background: #F3ECDD; font-weight: bold; width: 30%;">نام</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #F3ECDD; font-weight: bold;">ایمیل</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${email}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #F3ECDD; font-weight: bold;">تلفن</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${phone}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #F3ECDD; font-weight: bold;">سطح زبان</td>
            <td style="padding: 10px; border: 1px solid #ddd;">${selectedLevel}</td>
          </tr>
        </table>

        ${message ? `
        <div style="margin-top: 20px;">
          <h3 style="color: #1B2A44;">پیام:</h3>
          <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; border: 1px solid #ddd; white-space: pre-wrap;">
            ${message}
          </div>
        </div>
        ` : ""}

        <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
        <p style="color: #666; font-size: 12px;">
          ارسال شده در: ${new Date().toLocaleString("fa-IR", { timeZone: "Asia/Tehran" })}<br>
          از طریق: https://aufdeutsch.ir
        </p>
      </div>
    `;

    // Send email via Resend
    const resendClient = getResendClient();
    if (resendClient) {
      try {
        await resendClient.emails.send({
          from: "AUF Deutsch Contact <onboarding@resend.dev>",
          to: TO_EMAIL,
          subject: `🔔 درخواست تماس جدید: ${name} - ${selectedLevel}`,
          html: emailHtml,
          replyTo: email,
        });
      } catch (emailError) {
        console.error("Resend error:", emailError);
        // Don't fail the request if email fails, just log it
      }
    } else {
      console.warn("RESEND_API_KEY not set, logging only:", { name, email, phone, level, message });
    }

    return NextResponse.json({ success: true, message: "Form submitted successfully" });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}