import { stringify } from "qs";
import { set } from "lodash";
import { Field, FieldWithOperator, FilterOperator, Filters, Populate, StrapiQuery } from "./types";

type QueryCallback<T> = (query: StrapiQueryBuilder<T>) => StrapiQueryBuilder<T>;

class StrapiQueryBuilder<T = any> {
  private query: StrapiQuery<T> = {};

  constructor(public resourceName: string) {}

  private mergeFilter(addition: any) {
    this.query.filters = this.query.filters ?? {} as Filters<T>;
    this.query.filters = { ...this.query.filters, ...addition };
  }

  private op(
    op: "$and" | "$or" | "$not",
    ...incomingFilter: Filters<T>[]
  ) {
    this.query.filters = this.query.filters ?? {} as Filters<T>;

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

  where(field: FieldWithOperator<T>, value: string | boolean | number | Array<any> | FilterOperator) {
    this.query.filters = this.query.filters ?? {} as Filters<T>;
    set(this.query.filters, field, value);
    return this;
  }

  whereQ(field: FieldWithOperator<T>, fn: QueryCallback<T>) {
    this.query.filters = this.query.filters ?? {} as Filters<T>;
    const qb = fn(new StrapiQueryBuilder<T>(field));
    set(this.query.filters, field, qb.get().filters);
    return this;
  }

  sort(field: Field<T>, direction: "asc" | "desc" = "asc") {
    this.query.sort = this.query.sort ?? [];
    this.query.sort.push(`${field}:${direction}`);
    return this;
  }

  and(...incomingFilter: Filters<T>[]) {
    return this.op("$and", ...incomingFilter);
  }

  or(...incomingFilter: Filters<T>[]) {
    return this.op("$or", ...incomingFilter);
  }

  not(...incomingFilter: Filters<T>[]) {
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

  populateRelation(relation: Field<T>, query: StrapiQuery<T>) {
    this.query.populate = this.query.populate ?? {} as Populate<T>;
    this.query.populate[relation as string] = query;
    return this;
  }

  populateQ<P=any>(fieldName: string, fn: QueryCallback<P>) {
    this.query.populate = this.query.populate ?? {} as Populate<T>;
    const qb = fn(query(fieldName));
    this.query.populate[qb.resourceName] = qb.get();
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

export const query = <T = any>(resourceName: string) =>
  new StrapiQueryBuilder<T>(resourceName);
