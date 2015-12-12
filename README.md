# build-url

[![Build Status](https://travis-ci.org/steverydz/build-url.svg?branch=master)](https://travis-ci.org/steverydz/build-url)

A library that builds a URL, including it's path, query parameters and fragment identifier.

## Usage
To append a path:

```
buildUrl('http://example.com', {
  path: 'about'
});

// returns http://example.com/about
```

To append a query string:

```
buildUrl('http://example.com', {
  queryParams: {
    foo: 'bar',
    bar: 'baz'
  }
});

// returns http://example.com?foo=bar&bar=baz
```

To append a fragment identifier:

```
buildUrl('http://example.com', {
  hash: 'about'
});

// returns http://example.com#about
```
