import { describe, test, expect } from "vitest";
import { query } from "..";

describe("Filtering Operations", () => {
    test("should return empty object when no filters are applied", () => {
      const result = query("templates").get();
      expect(result).toEqual({});
    });
  
    test("should build filters using where() method", () => {
      const result = query("templates")
        .where("title.$eq", "test")
        .where("description.$eq", "test description")
        .where("tags.$in", [1, 2, 3]);
  
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
      });
    });
  
    test("should build filters using single filter() call", () => {
      const result = query("templates").filter({
        title: {
          $eq: "test",
        },
        description: {
          $eq: "test description",
        },
        tags: {
          $in: [1, 2, 3],
        },
      });
  
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
      });
    });
  
    test("should merge multiple filter() calls", () => {
      const result = query("templates")
        .filter({
          title: {
            $eq: "test",
          },
          description: {
            $eq: "test description",
          },
        })
        .filter({
          tags: {
            $in: [1, 2, 3],
          },
        });
  
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
      });
    });
  });
  