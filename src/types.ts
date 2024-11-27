
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

export type Filters = {
    $and?: Filters[];
    $or?: Filters[];
    $not?: Filters[];

    [key: string]: Filters | Filters[] | FilterOperator | undefined;
};

export type Pagination = {
    page?: number;
    pageSize?: number;
    withCount?: boolean;
    start?: number;
    limit?: number;
};

export type Populate = {
    [key: string]: StrapiQuery | string[];
};

export type StrapiQuery = {
    sort?: string[];
    filters?: Filters;
    populate?: Populate | string[];
    fields?: string[];
    pagination?: Pagination;
    status?: "draft" | "published";
    locale?: string;
};
