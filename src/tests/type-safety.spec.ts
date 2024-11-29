import { describe, expect, test } from "vitest";
import { query } from "..";
import { StrapiQuery } from "../types";

type Book = {
  title: string;
  published: boolean;
};

type User = {
  name: string;
  age: number;
  books: Book[];
};

describe("Type Safety", () => {
  test("should maintain type safety for populate operations", () => {
    const result = query<User>("users")
      .populateQ<Book>("books", (book) =>
        book.where("title.$containsi", "test")
      )
      .get();

    expect(result).toEqual({
      populate: {
        books: {
          filters: {
            title: {
              $containsi: "test",
            },
          },
        },
      },
    });
  });

  test("should maintain type safety for filtering operations", () => {
    const result: StrapiQuery<User> = query<User>("users")
      .where("name.$notNull", true)
      .get();
    expect(result).toEqual({
      filters: {
        name: {
          $notNull: true,
        },
      },
    });
  });

  test("should maintain type safety for sorting operations", () => {
    const result = query<User>("users").sort("name").get();
    expect(result).toEqual({
      sort: ["name:asc"],
    });
  });
});
