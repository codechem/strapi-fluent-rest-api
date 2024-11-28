
export type FilterOperator = {
    $eq?: any;
    $ne?: any;
    $lt?: any;
    $lte?: any;
    $gt?: any;
    $gte?: any;
    $in?: any[];
    $nin?: any[];
    $contains?: string;
    $containsi?: string;
    $null?: boolean;
    $notNull?: boolean;
    $between?: [any, any];
    $startsWith?: string;
    $endsWith?: string;
};

export type Field<T> = Extract<keyof T, string>;

export type Operators = Extract<keyof FilterOperator, string>;

export type FieldWithOperator<T> = Field<T> | `${Field<T>}.${Field<T>}` | `${Field<T>}.${Operators}`;

export type FieldWithSort<T> = Field<T> | `${Field<T>}:${"asc" | "desc"}`;

type AllKeys<T> = {
    [k in keyof T]: Filters<T> | Filters<T>[] | FilterOperator | undefined;
}

export type Filters<T=any> = AllKeys<T> & {
    $and?: Filters<T>[];
    $or?: Filters<T>[];
    $not?: Filters<T>[];
};

export type Pagination = {
    page?: number;
    pageSize?: number;
    withCount?: boolean;
    start?: number;
    limit?: number;
};

export type Populate<T> = {
    [key in keyof T]: StrapiQuery | string[];
};

export type StrapiQuery<T=any> = {
    sort?: FieldWithSort<T>[];
    filters?: Filters<T>;
    populate?: Populate<T> | string[];
    fields?: string[];
    pagination?: Pagination;
    status?: "draft" | "published";
    locale?: string;
};
