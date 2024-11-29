import { describe, test, expect } from "vitest";
import { query } from "..";

describe("Sorting Operations", () => {
  test("should maintain sort order based on method call sequence", () => {
    const forwardOrder = query("templates")
      .sort("id")
      .sort("createdAt", "desc");

    expect(forwardOrder.get()).toEqual({
      sort: ["id", "createdAt:desc"],
    });

    const reverseOrder = query("templates")
      .sort("createdAt", "desc")
      .sort("id");

    expect(reverseOrder.get()).toEqual({
      sort: ["createdAt:desc", "id"],
    });
  });

  test("Should be able to sort with field:dir specification", () => {
    const result = query("templates").sort("id:asc");

    expect(result.get()).toEqual({
      sort: ["id:asc"],
    });
  });

  test("Shortcut asc sort method", () => {
    const result = query("templates").asc("id");

    expect(result.get()).toEqual({
      sort: ["id:asc"],
    });
  });

  test("Shortcut desc sort method", () => {
    const result = query("templates").desc("id");

    expect(result.get()).toEqual({
      sort: ["id:desc"],
    });
  });
});
