import fs from "fs/promises";
import path from "path";

export interface Testimonial {
  id: string;
  authorName: string;
  authorInitial: string;
  course: string;
  text: string;
  rating: number;
  locale: "fa" | "de" | "en";
  approved: boolean;
  createdAt: string;
}

interface TestimonialsFile {
  testimonials: Testimonial[];
}

const DATA_PATH = path.join(process.cwd(), "data", "testimonials.json");

async function readTestimonials(): Promise<TestimonialsFile> {
  try {
    const data = await fs.readFile(DATA_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return { testimonials: [] };
  }
}

async function writeTestimonials(data: TestimonialsFile): Promise<void> {
  await fs.writeFile(DATA_PATH, JSON.stringify(data, null, 2), "utf-8");
}

export async function getApprovedTestimonials(locale: "fa" | "de" | "en"): Promise<Testimonial[]> {
  const { testimonials } = await readTestimonials();
  return testimonials
    .filter((t) => t.approved && t.locale === locale)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const { testimonials } = await readTestimonials();
  return testimonials.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function addTestimonial(
  testimonial: Omit<Testimonial, "id" | "approved" | "createdAt" | "authorInitial">
): Promise<Testimonial> {
  const { testimonials } = await readTestimonials();
  
  const newTestimonial: Testimonial = {
    ...testimonial,
    id: `t_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    authorInitial: testimonial.authorName.trim().charAt(0).toUpperCase(),
    approved: false,
    createdAt: new Date().toISOString(),
  };
  
  testimonials.unshift(newTestimonial);
  await writeTestimonials({ testimonials });
  
  return newTestimonial;
}

export async function approveTestimonial(id: string): Promise<boolean> {
  const { testimonials } = await readTestimonials();
  const idx = testimonials.findIndex((t) => t.id === id);
  if (idx === -1) return false;
  
  testimonials[idx].approved = true;
  await writeTestimonials({ testimonials });
  return true;
}

export async function rejectTestimonial(id: string): Promise<boolean> {
  const { testimonials } = await readTestimonials();
  const filtered = testimonials.filter((t) => t.id !== id);
  if (filtered.length === testimonials.length) return false;
  
  await writeTestimonials({ testimonials: filtered });
  return true;
}