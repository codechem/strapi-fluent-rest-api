# Strapi Fluent Query Builder

Strapi Fluent Query Builder is a powerful library designed to simplify building dynamic queries for Strapi, a popular open-source headless CMS. The library provides a fluent API for constructing complex queries, including filtering, sorting, pagination, relation population, and more.

While intended to be fully compatible with Strapi's REST API, this library is agnostic to Strapi and can be used with any RESTful API that follows similar conventions.

## Features

- **Fluent API**: Build queries using a clean, chainable API.
- **Filters**: Support for multiple filter types (equality, inclusion, `contains`, logical operators like `$and`, `$or`, `$not`, and more).
- **Sorting**: Sort by one or more fields, with both ascending and descending order.
- **Pagination**: Control pagination with options for page size, starting index, page number, and total count.
- **Relation Population**: Populate relations and nested relations with the ability to filter and select specific fields from related resources.
- **Content Status**: Easily filter content based on status (`published`, `draft`).
- **Localization**: Query content in different locales.
- **Field Selection**: Select specific fields to reduce payload size and improve performance.
- **Type Safety**: Built with TypeScript, ensuring full type safety across all query operations.

## Installation

To install the library, use npm or yarn:

```bash
npm install @codechem/strapi-fluent-rest-api
```

Or with yarn:

```bash
yarn add @codechem/strapi-fluent-rest-api
```

## Usage

### Basic Query Building

Create a query builder instance using the `query` function, then chain methods to customize your query:

```typescript
import { query } from '@codechem/strapi-fluent-rest-api';

const result = query('books')
    .where('title.$contains', 'example')
    .sort('createdAt', 'desc')
    .page(1)
    .pageSize(10)
    .get();

console.log(result);
```

### Filtering

You can apply filters using the `where` or `filter` methods. The `where` method allows you to specify a field and its value, while the `filter` method accepts a bulk filter object.

```typescript
// Using where method
const result = query('templates')
    .where('title.$eq', 'test')
    .where('status.$eq', 'published')
    .get();

// Using filter method
const result = query('templates').filter({
    title: { $eq: 'test' },
    status: { $eq: 'published' },
    tags: { $in: [1, 2, 3] },
}).get();
```

You can also use logical operators such as `$and`, `$or`, and `$not` to combine multiple filters.

```typescript
// Using logical operators
const result = query('templates')
    .and(
        { title: { $eq: 'test' } },
        { status: { $eq: 'published' } }
    )
    .or({ tags: { $in: [1, 2, 3] } })
    .get();
```

### Sorting

Sort the query results by one or more fields using the `sort` method. You can specify the sort direction (`asc` or `desc`):

```typescript
const result = query('templates')
    .sort('createdAt', 'desc')
    .sort('title', 'asc')
    .get();
```

### Pagination

Control pagination by using `page`, `pageSize`, `limit`, and `start` methods. You can also request the total count of results by using the `withCount` method:

```typescript
const result = query('templates')
    .page(1)
    .pageSize(10)
    .start(0)
    .limit(10)
    .withCount(true)
    .get();
```

### Population of Relations

You can populate related resources using the `populate` method. To populate nested relations or apply filters to related resources, use `populateQ`:

```typescript
// Populate a single relation
const result = query('books').populate('user');

// Populate multiple relations
const result = query('books').populate('user', 'readers.books');

// Populate relations with filters
const result = query('books').populateQ('user', user => user.where('name.$eq', 'John Doe'));

// Populate nested relations with filters
const result = query('books').populateQ(
    query('user')
        .where('name.$eq', 'John Doe')
        .populateQ('friends', friend => friend..where('name.$eq', 'Jane Doe'))
);
```

### Content Status & Localization

You can filter content based on its status (published or draft) using the `status`, `drafts`, and `published` methods:

```typescript
const result = query('templates').published();  // Status: published
const result = query('templates').drafts();     // Status: draft
```

Additionally, set the locale of the content with the `locale` method:

```typescript
const result = query('templates').locale('mk');
```

### Field Selection

Reduce the response size by selecting only the fields you need with the `fields` or `select` method:

```typescript
const result = query('templates').fields('id', 'title', 'description');
```

### Query String Generation

You can generate the full query string using the `qs` method, or generate the full URL with the `full` method, which includes the resource name and query string:

```typescript
const queryString = query('templates')
    .where('title.$eq', 'test')
    .qs();

console.log(queryString);  // Generated query string

const fullUrl = query('templates').full();
console.log(fullUrl);  // Full URL with query string
```

## TypeScript Support

This library is written in TypeScript and aims to provide as much type safety as possible for query building, ensuring that you can use autocompletion and type checking while constructing your queries. More support for type safety is hopefully coming in the future.

## Running Tests

To run the tests for this library, use the following command:

```bash
npm test
```

The library includes tests for various query operations, including filtering, sorting, pagination, and relation population.

## Contributing

Contributions are welcome! If you have ideas for new features or improvements, please open an issue or submit a pull request on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE.md) file for details.
