import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { resetStore } from "@/lib/planner/store";

// صفحه کلاینت است و next/navigation استفاده می‌کند — useParams را mock می‌کنیم
vi.mock("next/navigation", () => ({
  useParams: () => ({ locale: "fa" }),
}));

//Dynamic import بعد از mock
import LanguagePlannerPage from "@/app/[locale]/tools/language-planner/page";

describe("LanguagePlannerPage (fa)", () => {
  beforeEach(() => {
    resetStore();
    localStorage.clear();
  });

  it("shows setup wizard when no language is defined", async () => {
    render(<LanguagePlannerPage />);
    // ابتدا skeleton SSR
    await waitFor(() => {
      expect(screen.getByText("زبان‌ت را تعریف کن")).toBeInTheDocument();
    });
    expect(screen.getByPlaceholderText(/انگلیسی، آلمانی/)).toBeInTheDocument();
    expect(screen.getByText("شروع برنامه‌ریزی")).toBeInTheDocument();
  });

  it("creates a language and lands on the weekly grid", async () => {
    const user = userEvent.setup();
    render(<LanguagePlannerPage />);

    const input = await screen.findByPlaceholderText(/انگلیسی، آلمانی/);
    await user.type(input, "اسپانیایی");
    await user.click(screen.getByText("شروع برنامه‌ریزی"));

    // صفحه اصلی پلنر با پروفایل زبان نمایش داده می‌شود
    await waitFor(() => {
      expect(screen.getAllByText("اسپانیایی").length).toBeGreaterThan(0);
    });
    // حالت خالی (هنوز تسکی نیست) + دکمه قالب پیشنهادی
    expect(screen.getByText(/تسکی برای این زبان ثبت نشده/)).toBeInTheDocument();
    // سوییچر زبان و نوار پیشرفت
    expect(screen.getByText("پیشرفت هفته")).toBeInTheDocument();
  });

  it("fills the week with a template and shows the day grid", async () => {
    const user = userEvent.setup();
    render(<LanguagePlannerPage />);

    await user.type(await screen.findByPlaceholderText(/انگلیسی، آلمانی/), "انگلیسی");
    await user.click(screen.getByText("شروع برنامه‌ریزی"));

    const templateBtn = (await screen.findAllByText(/پر کردن هفته با قالب پیشنهادی/))[0];
    await user.click(templateBtn);

    // بعد از اعمال قالب، گرید روزها ظاهر می‌شود
    await waitFor(() => {
      expect(screen.getByText("شنبه")).toBeInTheDocument();
    });
    expect(screen.getByText("جمعه")).toBeInTheDocument();
  });

  it("marks a task complete and shows progress", async () => {
    const user = userEvent.setup();
    render(<LanguagePlannerPage />);

    await user.type(await screen.findByPlaceholderText(/انگلیسی، آلمانی/), "آلمانی");
    await user.click(screen.getByText("شروع برنامه‌ریزی"));

    await user.click((await screen.findAllByText(/پر کردن هفته با قالب پیشنهادی/))[0]);

    const checkboxes = await screen.findAllByRole("button", { name: "todo" });
    expect(checkboxes.length).toBeGreaterThan(0);
    await user.click(checkboxes[0]);

    await waitFor(() => {
      expect(screen.getAllByText(/تسک انجام‌شده/)[0]).toBeInTheDocument();
    });
  });
});
