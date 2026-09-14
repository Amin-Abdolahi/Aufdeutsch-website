import { describe, expect, it } from "vitest";
import { getDictionary, isLocale, languageMeta, locales } from "./i18n";

describe("i18n", () => {
  it("lists fa, de, and en", () => {
    expect(locales).toEqual(["fa", "de", "en"]);
  });

  it("accepts only known locales", () => {
    expect(isLocale("fa")).toBe(true);
    expect(isLocale("de")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("fr")).toBe(false);
    expect(isLocale(null)).toBe(false);
  });

  it("sets RTL for Persian and LTR for German and English", () => {
    expect(languageMeta.fa.dir).toBe("rtl");
    expect(languageMeta.de.dir).toBe("ltr");
    expect(languageMeta.en.dir).toBe("ltr");
  });

  it("returns the matching dictionary", () => {
    expect(getDictionary("fa").nav.home).toBe("خانه");
    expect(getDictionary("de").nav.home).toBe("Startseite");
    expect(getDictionary("en").nav.home).toBe("Home");
  });

  it("keeps the same keys across all dictionaries", () => {
    const fa = getDictionary("fa");
    const de = getDictionary("de");
    const en = getDictionary("en");

    expect(Object.keys(de)).toEqual(Object.keys(fa));
    expect(Object.keys(en)).toEqual(Object.keys(fa));
    expect(Object.keys(de.contact)).toEqual(Object.keys(fa.contact));
    expect(Object.keys(en.contact)).toEqual(Object.keys(fa.contact));
    expect(Object.keys(de.nav)).toEqual(Object.keys(fa.nav));
    expect(Object.keys(en.nav)).toEqual(Object.keys(fa.nav));
  });
});
