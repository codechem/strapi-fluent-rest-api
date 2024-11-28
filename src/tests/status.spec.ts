import { describe, test, expect } from "vitest";
import { query } from "..";

describe("Content Status and Localization", () => {
  test("should set content status", () => {
    const result = query("templates").status("published");

    expect(result.get()).toEqual({
      status: "published",
    });
  });

  test("should set published status using shortcut", () => {
    const result = query("templates").published();

    expect(result.get()).toEqual({
      status: "published",
    });
  });

  test("should set draft status using shortcut", () => {
    const result = query("templates").drafts();

    expect(result.get()).toEqual({
      status: "draft",
    });
  });

  test("should set content locale", () => {
    const result = query("templates").locale("mk");

    expect(result.get()).toEqual({
      locale: "mk",
    });
  });

  test("should select specific fields using fields()", () => {
    const result = query("templates").fields("id", "title", "description");

    expect(result.get()).toEqual({
      fields: ["id", "title", "description"],
    });
  });

  test("should select specific fields using select() alias", () => {
    const result = query("templates").select("id", "title", "description");

    expect(result.get()).toEqual({
      fields: ["id", "title", "description"],
    });
  });
});
