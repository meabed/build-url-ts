# build-url

[![Build Status](https://travis-ci.org/steverydz/build-url.svg?branch=master)](https://travis-ci.org/steverydz/build-url)

A library that builds a URL, including it's path, query parameters and fragment identifier. Works in node and in the browser.

## Usage

```
npm install build-url --save
```

If using node:

```
var buildUrl = require('build-url');

buildUrl('http://example.com', {
  path: 'about'
});
```

## Options

The `buildUrl` function accepts two arguments. The first is a URL e.g. `http://example.com`. The second is an object where you can specify the `path`, `hash`, and an object of `queryParams`:

```
buildUrl('http://example.com', {
  path: 'about'
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
