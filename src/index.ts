import { stringify } from "qs";
import { set } from "lodash";
import { Filters, StrapiQuery } from "./types";

class StrapiQueryBuilder<T> {
  private query: StrapiQuery = {};

  constructor(public resourceName: string) {}

  private mergeFilter(addition: any) {
    this.query.filters = this.query.filters ?? {};
    this.query.filters = { ...this.query.filters, ...addition };
  }

  private op(
    op: "$and" | "$or" | "$not",
    ...incomingFilter: Record<string, any>[]
  ) {
    this.query.filters = this.query.filters ?? {};

    this.query.filters[op] = this.query.filters[op] ?? [];

    const existing = this.query.filters[op];

    this.query.filters[op] = [...existing, ...incomingFilter];
    return this;
  }

  private setPagination(key: string, val: number | boolean) {
    this.query.pagination = this.query.pagination ?? {};
    this.query.pagination[key] = val;
    return this;
  }

  filter(incomingFilter: Record<string, any>) {
    this.mergeFilter(incomingFilter);
    return this;
  }

  where(field: string, value: any) {
    this.query.filters = this.query.filters ?? {};
    set(this.query.filters, field, value);
    return this;
  }

  sort(field: string, direction: "asc" | "desc" = "asc") {
    this.query.sort = this.query.sort ?? [];
    this.query.sort.push(`${field}:${direction}`);
    return this;
  }

  and(...incomingFilter: Filters[]) {
    return this.op("$and", ...incomingFilter);
  }

  or(...incomingFilter: Filters[]) {
    return this.op("$or", ...incomingFilter);
  }

  not(...incomingFilter: Filters[]) {
    return this.op("$not", ...incomingFilter);
  }

  page(page: number) {
    return this.setPagination("page", page);
  }

  pageSize(pageSize: number) {
    return this.setPagination("pageSize", pageSize);
  }

  withCount(withCount: boolean = true) {
    return this.setPagination("withCount", withCount);
  }

  start(start: number) {
    return this.setPagination("start", start);
  }

  limit(limit: number) {
    return this.setPagination("limit", limit);
  }

  status(status: "draft" | "published") {
    this.query.status = status;
    return this;
  }

  drafts() {
    return this.status("draft");
  }

  published() {
    return this.status("published");
  }

  locale(locale: string) {
    this.query.locale = locale;
    return this;
  }

  fields(...fields: string[]) {
    this.query.fields = fields;
    return this;
  }

  select(...fieldArgs: string[]) {
    return this.fields(...fieldArgs);
  }

  populate(...relations: string[]) {
    this.query.populate = relations;
    return this;
  }

  populateRelation(relation: string, query: StrapiQuery) {
    this.query.populate = this.query.populate ?? {};
    this.query.populate[relation] = query;
    return this;
  }

  populateQuery<PT>(otherBuilder: StrapiQueryBuilder<PT>) {
    this.query.populate = this.query.populate ?? {};
    this.query.populate[otherBuilder.resourceName] = otherBuilder.get();
    return this;
  }

  qs() {
    return stringify(this.query, { encodeValuesOnly: true });
  }

  full() {
    return `${this.resourceName}?${this.qs()}`;
  }

  json() {
    return JSON.stringify(this.query, null, 2);
  }

  get() {
    return this.query;
  }
}

export const query = (resourceName: string) =>
  new StrapiQueryBuilder(resourceName);
