import { describe, expect, test } from "vitest";
import { query } from "../index";

describe("Combined Operations", () => {
  test("should build complex query with multiple operations", () => {
    const result = query("templates")
      .where("title.$eq", "test")
      .where("description.$eq", "test description")
      .where("tags.$in", [1, 2, 3])
      .sort("id")
      .sort("createdAt", "desc")
      .page(1)
      .pageSize(10)
      .limit(10)
      .start(0)
      .withCount();

    expect(result.get()).toEqual({
      filters: {
        title: {
          $eq: "test",
        },
        description: {
          $eq: "test description",
        },
        tags: {
          $in: [1, 2, 3],
        },
      },
      sort: ["id", "createdAt:desc"],
      pagination: {
        page: 1,
        pageSize: 10,
        withCount: true,
        start: 0,
        limit: 10,
      },
    });
  });
});
