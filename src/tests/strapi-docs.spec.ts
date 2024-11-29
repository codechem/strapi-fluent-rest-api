import { describe, test, expect } from "vitest";
import { query } from "..";

describe("Strapi Query Builder - Full Use Cases", () => {
  // Test 1: Find users with first name 'John'
  test("should filter users by first name using $eq", () => {
    const targetQuery = {
      filters: {
        username: {
          $eq: "John",
        },
      },
    };

    const result = query("users").where("username.$eq", "John");

    expect(result.get()).toEqual(targetQuery);
  });

  // Test 2: Find multiple restaurants by ID (e.g., 3, 6, 8)
  test("should filter restaurants by multiple IDs using $in", () => {
    const targetQuery = {
      filters: {
        id: {
          $in: [3, 6, 8],
        },
      },
    };

    const result = query("restaurants").where("id.$in", [3, 6, 8]);

    expect(result.get()).toEqual(targetQuery);
  });

  // Test 3: Complex Filtering with OR Condition
  test("should filter books by multiple dates and author using $or", () => {
    const targetQuery = {
      filters: {
        $or: [{ date: { $eq: "2020-01-01" } }, { date: { $eq: "2020-01-02" } }],
        author: {
          name: {
            $eq: "Kai doe",
          },
        },
      },
    };

    const result = query("books")
      .or({ date: { $eq: "2020-01-01" } })
      .or({ date: { $eq: "2020-01-02" } })
      .where("author.name.$eq", "Kai doe");

    expect(result.get()).toEqual(targetQuery);
  });

  // Test 4: Deep Filtering on Relations
  test("should filter restaurants based on chef's restaurant stars", () => {
    const targetQuery = {
      filters: {
        chef: {
          restaurants: {
            stars: {
              $eq: 5,
            },
          },
        },
      },
    };

    const result = query("restaurants").where("chef.restaurants.stars.$eq", 5);

    expect(result.get()).toEqual(targetQuery);
  });

  // Test 5: Status Filtering (Draft vs Published)
  test("should filter restaurants by draft status", () => {
    const targetQuery = {
      status: "draft",
    };

    const result = query("restaurants").status("draft");

    expect(result.get()).toEqual(targetQuery);
  });

  test("should filter restaurants by published status (default)", () => {
    const targetQuery = {
      status: "published",
    };

    const result = query("restaurants").status("published");

    expect(result.get()).toEqual(targetQuery);
  });

  // Test 6: Locale Filtering
  test("should filter restaurants by locale", () => {
    const targetQuery = {
      locale: "en",
    };

    const result = query("restaurants").locale("en");

    expect(result.get()).toEqual(targetQuery);
  });

  // Test 7: Combining Multiple Filters with $and, $or, and Locale
  test("should combine filters with $and, $or, and locale", () => {
    const targetQuery = {
      filters: {
        $and: [
          {
            name: { $eq: "John" },
          },
          {
            date: { $eq: "2020-01-01" },
          },
        ],
        $or: [
          {
            status: { $eq: "published" },
          },
          {
            status: { $eq: "draft" },
          },
        ],
      },
      locale: "en",
    };

    const result = query("users")
      .and({ name: { $eq: "John" } })
      .and({ date: { $eq: "2020-01-01" } })
      .or({ status: { $eq: "published" } }, { status: { $eq: "draft" } })
      .locale("en");

    expect(result.get()).toEqual(targetQuery);
  });

  // Test 8: Pagination
  test("should set pagination parameters correctly", () => {
    const targetQuery = {
      pagination: {
        page: 2,
        pageSize: 10,
      },
    };

    const result = query("articles").page(2).pageSize(10);

    expect(result.get()).toEqual(targetQuery);
  });

  test("should set pageSize and withCount", () => {
    const targetQuery = {
      pagination: {
        pageSize: 5,
        withCount: true,
      },
    };

    const result = query("articles").pageSize(5).withCount(true);

    expect(result.get()).toEqual(targetQuery);
  });

  // Test 9: Population of Relations
  test("should populate a single relation", () => {
    const targetQuery = {
      populate: ["user"],
    };

    const result = query("books").populate("user");

    expect(result.get()).toEqual(targetQuery);
  });

  test("should populate multiple relations", () => {
    const targetQuery = {
      populate: ["user", "readers.books"],
    };

    const result = query("books").populate("user", "readers.books");

    expect(result.get()).toEqual(targetQuery);
  });

  test("should populate a relation with filters", () => {
    const targetQuery = {
      populate: {
        user: {
          filters: {
            name: {
              $eq: "John Doe",
            },
          },
        },
      },
    };

    const result = query("books").populateQ("user", (user) =>
      user.where("name.$eq", "John Doe")
    );

    expect(result.get()).toEqual(targetQuery);
  });

  test("should populate nested relations with filters", () => {
    const targetQuery = {
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
    };

    const result = query("books").populateQ("user", (user) =>
      user
        .where("name.$eq", "John Doe")
        .populateQ("friends", (friends) =>
          friends.where("name.$eq", "Jane Doe")
        )
    );

    expect(result.get()).toEqual(targetQuery);
  });
});

describe("Population with Sorting and Filtering", () => {
  test("should populate categories with sorting and filtering", () => {
    const targetQuery = {
      populate: {
        categories: {
          sort: ["name:asc"],
          filters: {
            name: {
              $eq: "Cars",
            },
          },
        },
      },
    };

    const result = query("products").populateQ("categories", (q) =>
      q.sort("name", "asc").where("name.$eq", "Cars")
    );

    expect(result.get()).toEqual(targetQuery);
  });
});
