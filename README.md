# build-url-ts ( Typescript )
[![Build Status](https://github.com/meabed/build-url-ts/actions/workflows/ci.yml/badge.svg)](https://github.com/meabed/build-url-ts/actions/workflows/ci.yml)
[![NPM version](https://img.shields.io/npm/v/build-url-ts.svg)](https://www.npmjs.com/package/build-url-ts)
[![Downloads](https://img.shields.io/npm/dm/build-url-ts.svg)](https://www.npmjs.com/package/build-url-ts)
[![UNPKG](https://img.shields.io/badge/UNPKG-OK-179BD7.svg)](https://unpkg.com/browse/build-url-ts@latest/)

A library that builds a URL, including its path, query parameters and fragment identifier. Works in node and in the browser.

> This is a fork from https://github.com/steverydz/build-url to add typescript support for the library

> CodeSandBox Demo: https://codesandbox.io/s/build-url-ts-demo-qer8y

## Installation

To install with npm:

```
npm install build-url-ts --save
```

## Usage

```
import { buildUrl } from 'build-url-ts';

buildUrl('http://example.com', {
  path: 'about',
  hash: 'contact',
  queryParams: {
    foo: bar,
    bar: ['foo', 'bar']
  }
});
```

## Options

The `buildUrl` function accepts two arguments. The first is a URL e.g. `http://example.com`. The second is an object where you can specify the `path`, `hash`, `lowerCase`, and an object of `queryParams`:

```
buildUrl('http://example.com', {
  path: 'about',
  hash: 'contact',
  queryParams: {
    foo: 'bar',
    bar: 'baz'
  }
});

// returns http://example.com/about?foo=bar&bar=baz#contact
```

If you pass an array to the `queryParams` object, it will be transformed to a comma separated list:

```
buildUrl('http://example.com', {
  queryParams: {
    foo: 'bar',
    bar: ['one', 'two', 'three']
  }
});

// returns http://example.com?foo=bar&bar=one,two,three
```

If you want to change the `path`, `hash` and `queryParams` case to all lowercase then pass `lowerCase` as true in arguments, default value of this will be `false`:

```
buildUrl('http://example.com', {
  path: 'AbouT',
  hash: 'ConTacT',
  lowerCase: true,
  queryParams: {
    foo: 'bAr',
    bar: ['oNe', 'TWO', 'thrEE', 123]
  }
});

// returns http://example.com/about?foo=bar&bar=one,two,three,123#contact
```

If you pass an array to the `queryParams` object, and want that they should not be comma separated use `disableCSV`:

```
buildUrl('http://example.com', {
  disableCSV: true,
  queryParams: {
    foo: 'bar',
    bar: ['one', 'two', 'three']
  }
});

// returns http://example.com?foo=bar&bar=one&bar=two&bar=three
```

If you only want the query string, path, hash, or any combination of the three you can skip the URL parameter or pass in an empty string or null:

```
buildUrl('', {
  queryParams: {
    foo: 'bar',
    bar: 'baz'
  }
});

// returns ?foo=bar&bar=baz

buildUrl(null, {
  queryParams: {
    foo: 'bar',
    bar: 'baz'
  }
});

// returns ?foo=bar&bar=baz

buildUrl({
  queryParams: {
    foo: 'bar',
    bar: 'baz'
  }
});
```

Any null values in the `queryParams` object will be treated as empty strings:

```
buildUrl('http://example.com', {
  queryParams: {
    foo: 'bar',
    bar: null
  }
});

// returns http://example.com?foo=bar&bar=
```

## License

This is licensed under an MIT License. [See details](LICENSE)
