import { describe, test, expect } from "vitest";
import { query } from "..";

describe("Sorting Operations", () => {
  test("should maintain sort order based on method call sequence", () => {
    const forwardOrder = query("templates")
      .sort("id")
      .sort("createdAt", "desc");

    expect(forwardOrder.get()).toEqual({
      sort: ["id:asc", "createdAt:desc"],
    });

    const reverseOrder = query("templates")
      .sort("createdAt", "desc")
      .sort("id");

    expect(reverseOrder.get()).toEqual({
      sort: ["createdAt:desc", "id:asc"],
    });
  });
});
