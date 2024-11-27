import { describe, test, expect } from "vitest";
import { query } from "..";

describe("Population Operations", () => {
  test("should populate a single relation", () => {
    const result = query("books").populate("user");

    expect(result.get()).toEqual({
      populate: ["user"],
    });
  });

  test("should populate multiple relations", () => {
    const result = query("books").populate("user", "readers.books");

    expect(result.get()).toEqual({
      populate: ["user", "readers.books"],
    });
  });

  test("should populate a relation with filters", () => {
    const result = query("books").populateQuery(
      query("user").where("name.$eq", "John Doe")
    );

    expect(result.get()).toEqual({
      populate: {
        user: {
          filters: {
            name: {
              $eq: "John Doe",
            },
          },
        },
      },
    });
  });

  test("should populate nested relations with filters", () => {
    const result = query("books").populateQuery(
      query("user")
        .where("name.$eq", "John Doe")
        .populateQuery(
            query("friends")
                .where("name.$eq", "Jane Doe")
        )
    );

    expect(result.get()).toEqual({
      populate: {
        user: {
          filters: {
            name: {
              $eq: "John Doe",
            },
          },
          populate: {
            friends: {
              filters: {
                name: {
                  $eq: "Jane Doe",
                },
              },
            },
          },
        },
      },
    });
  });
});
