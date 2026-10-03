import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

// next/navigation را mock کن (صفحه client است)
vi.mock("next/navigation", () => ({
  useParams: () => ({ locale: "fa" }),
}));

// apiAsk را mock کنیم تا جواب آفلاین برگرداند
vi.mock("@/components/alphabet-world/api", async (importOriginal) => {
  const orig = (await importOriginal()) as Record<string, unknown>;
  return {
    ...orig,
    apiAsk: vi.fn().mockResolvedValue({
      text: "این یک جواب آفلاین است.",
      source: "offline",
      cached: false,
    }),
  };
});

import { apiAsk } from "@/components/alphabet-world/api";
import { Store } from "@/components/alphabet-world/store";
import AlphabetWorld from "@/components/alphabet-world/AlphabetWorld";

const START = "شروع کن";

describe("AlphabetWorld offline warning", () => {
  beforeEach(() => {
    localStorage.clear();
    // Store یک singleton است — حالت روی‌هم‌انباشته را ریست کن
    Store.data.onboarded = false;
    vi.clearAllMocks();
  });

  it("shows offline banner when the API returns source=offline", async () => {
    render(<AlphabetWorld />);

    const startBtn = await screen.findByText(START);
    fireEvent.click(startBtn);

    const input = await screen.findByPlaceholderText(/چیزی از حروف بپرس/);
    fireEvent.change(input, { target: { value: "Hallo" } });
    fireEvent.click(screen.getByRole("button", { name: "ارسال" }));

    // اخطار آفلاین باید ظاهر شود
    await waitFor(() => {
      expect(screen.getByText("هوش مصنوعی متصل نیست")).toBeInTheDocument();
    });
    expect(screen.getByText(/این جواب از حالت آفلاین بازیه/)).toBeInTheDocument();
    expect(screen.getByText("تنظیمات")).toBeInTheDocument();
    expect(screen.getByText("بعداً")).toBeInTheDocument();
    expect(apiAsk).toHaveBeenCalled();
  });

  it("hides the banner and opens settings when clicking CTA", async () => {
    render(<AlphabetWorld />);

    fireEvent.click(await screen.findByText(START));

    const input = await screen.findByPlaceholderText(/چیزی از حروف بپرس/);
    fireEvent.change(input, { target: { value: "Hallo" } });
    fireEvent.click(screen.getByRole("button", { name: "ارسال" }));

    const cta = await screen.findByText("تنظیمات");
    fireEvent.click(cta);

    await waitFor(() => {
      expect(screen.queryByText("هوش مصنوعی متصل نیست")).not.toBeInTheDocument();
    });
  });

  it("dismisses the banner with the later button", async () => {
    render(<AlphabetWorld />);

    fireEvent.click(await screen.findByText(START));

    const input = await screen.findByPlaceholderText(/چیزی از حروف بپرس/);
    fireEvent.change(input, { target: { value: "Hallo" } });
    fireEvent.click(screen.getByRole("button", { name: "ارسال" }));

    const dismiss = await screen.findByText("بعداً");
    fireEvent.click(dismiss);

    await waitFor(() => {
      expect(screen.queryByText("هوش مصنوعی متصل نیست")).not.toBeInTheDocument();
    });
  });
});


