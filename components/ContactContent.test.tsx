import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ContactContent } from "./ContactContent";
import { LocaleProvider } from "./LocaleProvider";

function renderContact() {
  return render(
    <LocaleProvider initialLocale="fa">
      <ContactContent locale="fa" />
    </LocaleProvider>,
  );
}

describe("ContactContent", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("shows success only after a successful API response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);

    renderContact();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/نام و نام خانوادگی/i), "امین عبدالهی");
    await user.type(screen.getByLabelText(/ایمیل/i), "amin@example.com");
    await user.type(screen.getByLabelText(/شماره موبایل/i), "09911045947");
    await user.click(screen.getByRole("button", { name: /ارسال درخواست/i }));

    expect(await screen.findByText("درخواست شما ثبت شد!")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/contact",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("shows an error and keeps the form when the API fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));

    renderContact();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/نام و نام خانوادگی/i), "امین عبدالهی");
    await user.type(screen.getByLabelText(/ایمیل/i), "amin@example.com");
    await user.type(screen.getByLabelText(/شماره موبایل/i), "09911045947");
    await user.click(screen.getByRole("button", { name: /ارسال درخواست/i }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText("درخواست شما ثبت شد!")).not.toBeInTheDocument();
    expect(screen.getByLabelText(/نام و نام خانوادگی/i)).toBeInTheDocument();
  });

  it("does not mark the form as successful when the request throws", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));

    renderContact();
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/نام و نام خانوادگی/i), "امین عبدالهی");
    await user.type(screen.getByLabelText(/ایمیل/i), "amin@example.com");
    await user.type(screen.getByLabelText(/شماره موبایل/i), "09911045947");
    await user.click(screen.getByRole("button", { name: /ارسال درخواست/i }));

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.queryByText("درخواست شما ثبت شد!")).not.toBeInTheDocument();
  });
});
