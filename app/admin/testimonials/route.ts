import { NextResponse } from "next/server";
import { getAllTestimonials, approveTestimonial, rejectTestimonial } from "@/lib/testimonials";

export async function GET() {
  const testimonials = await getAllTestimonials();
  return NextResponse.json({ testimonials });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, action } = body;

    if (!id || !action || !["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const success = action === "approve" 
      ? await approveTestimonial(id) 
      : await rejectTestimonial(id);

    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}