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

  it('should append a query string when passed as an option', function () {
    expect(buildUrl('http://example.com', {
      queryParams: {
        foo: 'bar',
        bar: 'baz'
      }
    })).toEqual('http://example.com?foo=bar&bar=baz');
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
});
