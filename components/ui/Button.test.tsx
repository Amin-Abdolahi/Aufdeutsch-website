import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders a button by default", () => {
    render(<Button>ارسال</Button>);
    expect(screen.getByRole("button", { name: "ارسال" })).toBeInTheDocument();
  });

  it("renders a link when href is provided", () => {
    render(<Button href="/fa/contact">تماس</Button>);
    const link = screen.getByRole("link", { name: "تماس" });
    expect(link).toHaveAttribute("href", "/fa/contact");
  });

  it("disables the submit button while pending", () => {
    render(
      <Button type="submit" disabled>
        در حال ارسال...
      </Button>,
    );
    expect(screen.getByRole("button")).toBeDisabled();
  });
});
