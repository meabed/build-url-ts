# build-url-ts

[![Build Status](https://github.com/meabed/build-url-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/meabed/build-url-ts/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/build-url-ts.svg)](https://www.npmjs.com/package/build-url-ts)
[![Downloads](https://img.shields.io/npm/dm/build-url-ts.svg)](https://www.npmjs.com/package/build-url-ts)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/build-url-ts)](https://bundlephobia.com/package/build-url-ts)
[![UNPKG](https://img.shields.io/badge/UNPKG-OK-179BD7.svg)](https://unpkg.com/browse/build-url-ts@latest/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A small, fast library for building URLs with a fluent API. Fully typed for TypeScript and works in Node.js and browsers.

[![Edit build-url-ts-demo](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/build-url-ts-demo-qer8y?fontsize=14&hidenavigation=1&theme=dark)

## Features

- 🚀 **Small & Fast** - Minimal footprint with zero dependencies
- 📦 **TypeScript Support** - Full TypeScript definitions included
- 🌐 **Universal** - Works in Node.js and all modern browsers
- 🔧 **Flexible** - Multiple ways to handle array query parameters
- ✨ **Clean API** - Simple and intuitive interface
- 🛡️ **Safe** - Properly encodes URLs and handles edge cases

## Installation

```bash
# npm
npm install build-url-ts

# yarn
yarn add build-url-ts

# pnpm
pnpm add build-url-ts
```

## Quick Start

```typescript
import { buildUrl } from 'build-url-ts';

const url = buildUrl('https://api.example.com', {
  path: 'users/123',
  queryParams: {
    tab: 'profile',
    limit: 10
  }
});
// Result: https://api.example.com/users/123?tab=profile&limit=10
```

## API Reference

### `buildUrl(baseUrl?, options?)`

Builds a complete URL from components.

#### Parameters

- `baseUrl` (optional): `string | null` - The base URL
- `options` (optional): `IBuildUrlOptions` - URL building options

#### Options

```typescript
interface IBuildUrlOptions {
  path?: string | number;           // Path to append
  queryParams?: IQueryParams;       // Query parameters object
  hash?: string | number;           // Hash/fragment identifier
  lowerCase?: boolean;              // Convert to lowercase
  disableCSV?: boolean | IDisableCsvType; // Array handling
}
```

## Usage Examples

### Basic URL Building

```typescript
import { buildUrl } from 'build-url-ts';

// Simple URL with path
buildUrl('https://example.com', {
  path: 'about'
});
// → https://example.com/about

// With query parameters
buildUrl('https://example.com', {
  path: 'search',
  queryParams: {
    q: 'typescript',
    category: 'tutorials'
  }
});
// → https://example.com/search?q=typescript&category=tutorials

// With hash
buildUrl('https://example.com', {
  path: 'docs',
  hash: 'installation'
});
// → https://example.com/docs#installation

// All combined
buildUrl('https://api.example.com', {
  path: 'v1/users',
  queryParams: {
    role: 'admin',
    active: true
  },
  hash: 'summary'
});
// → https://api.example.com/v1/users?role=admin&active=true#summary
```

### Working with Arrays

```typescript
// Default: Arrays as comma-separated values
buildUrl('https://api.example.com', {
  queryParams: {
    ids: [1, 2, 3]
  }
});
// → https://api.example.com?ids=1,2,3

// Arrays as repeated parameters
buildUrl('https://api.example.com', {
  queryParams: {
    id: [1, 2, 3]
  },
  disableCSV: true
});
// → https://api.example.com?id=1&id=2&id=3

// Arrays with bracket notation
buildUrl('https://api.example.com', {
  queryParams: {
    id: [1, 2, 3]
  },
  disableCSV: 'array'
});
// → https://api.example.com?id[]=1&id[]=2&id[]=3

// Arrays with indexed notation (ascending)
buildUrl('https://api.example.com', {
  queryParams: {
    id: [1, 2, 3]
  },
  disableCSV: 'order_asc'
});
// → https://api.example.com?id[0]=1&id[1]=2&id[2]=3

// Arrays with indexed notation (descending)
buildUrl('https://api.example.com', {
  queryParams: {
    id: [1, 2, 3]
  },
  disableCSV: 'order_desc'
});
// → https://api.example.com?id[2]=1&id[1]=2&id[0]=3
```

### Case Transformation

```typescript
// Convert to lowercase
buildUrl('https://example.com', {
  path: 'About',
  hash: 'Contact',
  queryParams: {
    Filter: 'NEW'
  },
  lowerCase: true
});
// → https://example.com/about?filter=new#contact
```

### Building Partial URLs

```typescript
// Query string only
buildUrl(null, {
  queryParams: {
    page: 1,
    limit: 20
  }
});
// → ?page=1&limit=20

// Path only
buildUrl(null, {
  path: 'users/profile'
});
// → /users/profile

// Hash only
buildUrl(null, {
  hash: 'top'
});
// → #top

// Using options as first parameter
buildUrl({
  path: 'api/v2',
  queryParams: {
    format: 'json'
  }
});
// → /api/v2?format=json
```

### Handling Special Values

```typescript
// Null values become empty strings
buildUrl('https://api.example.com', {
  queryParams: {
    name: 'John',
    age: null
  }
});
// → https://api.example.com?name=John&age=

// Undefined values are omitted
buildUrl('https://api.example.com', {
  queryParams: {
    name: 'John',
    age: undefined
  }
});
// → https://api.example.com?name=John

// Number values
buildUrl('https://api.example.com', {
  path: 404,
  queryParams: {
    code: 0,
    retry: 3
  }
});
// → https://api.example.com/404?code=0&retry=3

// Boolean values
buildUrl('https://api.example.com', {
  queryParams: {
    active: true,
    deleted: false
  }
});
// → https://api.example.com?active=true&deleted=false
```

## Advanced Usage

### Using Individual Functions

The library also exports individual functions for more granular control:

```typescript
import { 
  buildQueryString, 
  appendPath, 
  buildHash 
} from 'build-url-ts';

// Build query string only
const qs = buildQueryString({
  search: 'typescript',
  limit: 10
});
// → ?search=typescript&limit=10

// Append path to URL
const urlWithPath = appendPath('users/123', 'https://api.example.com');
// → https://api.example.com/users/123

// Build hash fragment
const hash = buildHash('section-2');
// → #section-2
```

### TypeScript Types

```typescript
import type { 
  IQueryParams, 
  IBuildUrlOptions,
  IDisableCsvType 
} from 'build-url-ts';

// Custom query params type
interface MyParams extends IQueryParams {
  userId: number;
  tags?: string[];
  active?: boolean;
}

const options: IBuildUrlOptions = {
  path: 'api/users',
  queryParams: {
    userId: 123,
    tags: ['admin', 'verified']
  } as MyParams
};
```

## URL Encoding

All values are properly encoded for URLs:

```typescript
buildUrl('https://example.com', {
  queryParams: {
    name: 'John Doe',
    email: 'john@example.com',
    message: 'Hello & goodbye!',
    unicode: '你好世界'
  }
});
// → https://example.com?name=John%20Doe&email=john%40example.com&message=Hello%20%26%20goodbye!&unicode=%E4%BD%A0%E5%A5%BD%E4%B8%96%E7%95%8C
```

## Edge Cases

The library handles various edge cases gracefully:

```typescript
// Empty or missing base URL
buildUrl('', { path: 'api' }); // → /api
buildUrl(null, { path: 'api' }); // → /api
buildUrl(undefined, { path: 'api' }); // → /api

// Trailing slashes
buildUrl('https://example.com/', { path: '/users' }); 
// → https://example.com/users (no double slash)

// Empty values
buildUrl('https://example.com', {
  path: '',      // ignored
  hash: '',      // ignored
  queryParams: {
    empty: '',   // included as empty
    zero: 0,     // included as "0"
    false: false // included as "false"
  }
});
// → https://example.com?empty=&zero=0&false=false
```

## Migration Guide

### From `build-url`

This library is a TypeScript fork of the original `build-url` package with improvements:

```javascript
// Before (build-url)
var buildUrl = require('build-url');

// After (build-url-ts)
import { buildUrl } from 'build-url-ts';
```

The API remains fully compatible, so you can simply replace the import.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Running Tests

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test-watch

# Build the library
npm run build

# Run linting
npm run lint
```

## License

This is licensed under MIT License. [See details](LICENSE)

## Acknowledgments

This is a TypeScript enhancement of the original [build-url](https://github.com/steverydz/build-url) library by [Steve Rydz](https://github.com/steverydz).
