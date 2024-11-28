import { parse } from "qs";
import { describe, test, expect } from "vitest";
import { query } from "..";

describe("Query String Generation", () => {
  test("should generate an empty query string when no parameters are set", () => {
    const result = query("api::example.example").qs();
    expect(result).toBe("");
  });

  test("should generate a complex query string with multiple filters, sorts and relations", () => {
    const expectedQueryString = `
  sort[0]=createdAt:desc&filters[user_id][id][$eq]=2&filters[permissions][$eq]=private&filters[$and][0][categories][$containsi]=favorite&filters[$and][1][categories][$containsi]=invoice&filters[$and][2][categories][$containsi]=mail&populate[user_id][fields][0]=id&populate[creator][fields][0]=username&pagination[pageSize]=2&pagination[page]=1
  `.trim();

    const builder = query("api::example.example")
      .sort("createdAt", "desc")
      .where("user_id.id", { $eq: 2 })
      .where("permissions", { $eq: "private" })

      .and({ categories: { $containsi: "favorite" } })
      .and({ categories: { $containsi: "invoice" } })
      .and({ categories: { $containsi: "mail" } })
      .populateRelation("user_id", { fields: ["id"] })
      .populateRelation("creator", { fields: ["username"] })
      .pageSize(2)
      .page(1);

    const queryString = builder.qs();
    const parsedResult = parse(queryString);
    const parsedExpected = parse(expectedQueryString);

    expect(parsedResult).toEqual(parsedExpected);
  });
});
