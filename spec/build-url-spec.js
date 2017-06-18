describe('buildUrl', function () {
  var buildUrl = require('../dist/build-url');

  it('should be defined', function () {
    expect(buildUrl).toBeDefined();
  });

  it('should return undefined if called with no arguments', function () {
    expect(buildUrl()).toBe(undefined);
  });

  it('should return a string if called with an argument', function () {
    expect(typeof(buildUrl('something'))).toEqual('string');
  });

  it('should append a path when passed as an option', function () {
    expect(buildUrl('http://example.com', {
      path: 'about/me'
    })).toEqual('http://example.com/about/me');
  });

  it('should append a path when passed an option with a leading "/"', function() {
    expect(buildUrl('http://example.com', {
      path: '/about/me'
    })).toEqual('http://example.com/about/me');
  });

  it('should append a query string when passed as an option', function () {
    expect(buildUrl('http://example.com', {
      queryParams: {
        foo: 'bar',
        bar: 'baz'
      }
    })).toEqual('http://example.com?foo=bar&bar=baz');
  });

  it('should transform an array to a comma separated list if part of queryParams', function () {
    expect(buildUrl('http://example.com', {
      queryParams: {
        foo: 'bar',
        bar: ['one', 'two', 'three']
      }
    })).toEqual('http://example.com?foo=bar&bar=one,two,three');
  });

  it('should append a fragment identifier when passed as an option', function () {
    expect(buildUrl('http://example.com', {
      hash: 'contact'
    })).toEqual('http://example.com#contact');
  });

  it('should append a path and a query string when passed as options', function () {
    expect(buildUrl('http://example.com', {
      path: 'about/me',
      queryParams: {
        foo: 'bar',
        bar: 'baz'
      }
    })).toEqual('http://example.com/about/me?foo=bar&bar=baz');
  });

  it('should append a path and a fragment identifier when passed as options', function () {
    expect(buildUrl('http://example.com', {
      path: 'about/me',
      hash: 'contact'
    })).toEqual('http://example.com/about/me#contact');
  });

  it('should append a path, query string and a fragment identifier when passed as options', function () {
    expect(buildUrl('http://example.com', {
      path: 'about/me',
      hash: 'contact',
      queryParams: {
        foo: 'bar',
        bar: 'baz'
      }
    })).toEqual('http://example.com/about/me?foo=bar&bar=baz#contact');
  });

  it('should append a query string and a fragment identifier when passed as options', function () {
    expect(buildUrl('http://example.com', {
      hash: 'contact',
      queryParams: {
        foo: 'bar',
        bar: 'baz'
      }
    })).toEqual('http://example.com?foo=bar&bar=baz#contact');
  });

  it('should return only the query string when URL parameter is an empty string', function () {
    expect(buildUrl('', {
      queryParams: {
        foo: 'bar',
        bar: 'baz'
      }
    })).toEqual('?foo=bar&bar=baz');
  });

  it('should return only the query string when URL parameter is null', function () {
    expect(buildUrl(null, {
      queryParams: {
        foo: 'bar',
        bar: 'baz'
      }
    })).toEqual('?foo=bar&bar=baz');
  });

  it('should return only the query string when URL parameter is not present', function () {
    expect(buildUrl({
      queryParams: {
        foo: 'bar',
        bar: 'baz'
      }
    })).toEqual('?foo=bar&bar=baz');
  });

  it('should return only the hash when URL parameter is an empty string', function () {
    expect(buildUrl('', {
      hash: 'about'
    })).toEqual('#about');
  });

  it('should return only the hash when URL parameter is null', function () {
    expect(buildUrl(null, {
      hash: 'about'
    })).toEqual('#about');
  });

  it('should return only the has when URL parameter is not present', function () {
    expect(buildUrl({
      hash: 'about'
    })).toEqual('#about');
  });

  it('should return only the path when URL parameter is an empty string', function () {
    expect(buildUrl('', {
      path: 'contact'
    })).toEqual('/contact');
  });

  it('should return only the path when URL parameter is null', function () {
    expect(buildUrl(null, {
      path: 'contact'
    })).toEqual('/contact');
  });

  it('should return only the path when URL parameter is not present', function () {
    expect(buildUrl({
      path: 'contact'
    })).toEqual('/contact');
  });

  it('should return only formatted options when URL parameter is an empty string', function () {
    expect(buildUrl('', {
      path: 'contact',
      hash: 'about',
      queryParams: {
        foo: 'bar',
        bar: 'baz'
      }
    })).toEqual('/contact?foo=bar&bar=baz#about');
  });

  it('should return only formatted options when URL parameter is null', function () {
    expect(buildUrl(null, {
      path: 'contact',
      hash: 'about',
      queryParams: {
        foo: 'bar',
        bar: 'baz'
      }
    })).toEqual('/contact?foo=bar&bar=baz#about');
  });

  it('should return only formatted options when URL parameter is not present', function () {
    expect(buildUrl({
      path: 'contact',
      hash: 'about',
      queryParams: {
        foo: 'bar',
        bar: 'baz'
      }
    })).toEqual('/contact?foo=bar&bar=baz#about');
  });
});
