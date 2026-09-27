import { NextResponse } from "next/server";
import { approveTestimonial, rejectTestimonial } from "@/lib/testimonials";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { action } = body;

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    const success = action === "approve" 
      ? await approveTestimonial(id) 
      : await rejectTestimonial(id);

    return NextResponse.json({ success });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}