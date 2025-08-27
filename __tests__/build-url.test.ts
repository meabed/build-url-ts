import { buildUrl } from '../src';

describe('buildUrl', () => {
  it('should be defined', () => {
    expect(buildUrl).toBeDefined();
  });

  it('should return empty string if called with no arguments', () => {
    expect(buildUrl()).toBe('');
  });

  it('should return a string if called with an argument', () => {
    expect(typeof buildUrl('something')).toEqual('string');
  });

  it('should append a path when passed as an option', () => {
    expect(
      buildUrl('http://example.com', {
        path: 'about/me'
      })
    ).toEqual('http://example.com/about/me');
  });

  it('should append a path when passed an option with a leading "/"', () => {
    expect(
      buildUrl('http://example.com', {
        path: '/about/me'
      })
    ).toEqual('http://example.com/about/me');
  });

  it('should append a query string when passed as an option', () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          foo: 'bar',
          bar: 'baz'
        }
      })
    ).toEqual('http://example.com?foo=bar&bar=baz');
  });

  it('should transform an array to a comma separated list if part of queryParams', () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          foo: 'bar',
          bar: ['one', 'two', 'three']
        }
      })
    ).toEqual('http://example.com?foo=bar&bar=one%2Ctwo%2Cthree');
  });

  it('should append a fragment identifier when passed as an option', () => {
    expect(
      buildUrl('http://example.com', {
        hash: 'contact'
      })
    ).toEqual('http://example.com#contact');
  });

  it('should append a path and a query string when passed as options', () => {
    expect(
      buildUrl('http://example.com', {
        path: 'about/me',
        queryParams: {
          foo: 'bar',
          bar: 'baz'
        }
      })
    ).toEqual('http://example.com/about/me?foo=bar&bar=baz');
  });

  it('should append a path and a fragment identifier when passed as options', () => {
    expect(
      buildUrl('http://example.com', {
        path: 'about/me',
        hash: 'contact'
      })
    ).toEqual('http://example.com/about/me#contact');
  });

  it('should append a path, query string and a fragment identifier when passed as options', () => {
    expect(
      buildUrl('http://example.com', {
        path: 'about/me',
        hash: 'contact',
        queryParams: {
          foo: 'bar',
          bar: 'baz'
        }
      })
    ).toEqual('http://example.com/about/me?foo=bar&bar=baz#contact');
  });

  it('should append a query string and a fragment identifier when passed as options', () => {
    expect(
      buildUrl('http://example.com', {
        hash: 'contact',
        queryParams: {
          foo: 'bar',
          bar: 'baz'
        }
      })
    ).toEqual('http://example.com?foo=bar&bar=baz#contact');
  });

  it('should return only the query string when URL parameter is an empty string', () => {
    expect(
      buildUrl('', {
        queryParams: {
          foo: 'bar',
          bar: 'baz'
        }
      })
    ).toEqual('?foo=bar&bar=baz');
  });

  it('should return only the query string when URL parameter is null', () => {
    expect(
      buildUrl(null, {
        queryParams: {
          foo: 'bar',
          bar: 'baz'
        }
      })
    ).toEqual('?foo=bar&bar=baz');
  });

  it('should return only the query string when URL parameter is not present', () => {
    expect(
      buildUrl({
        queryParams: {
          foo: 'bar',
          bar: 'baz'
        }
      })
    ).toEqual('?foo=bar&bar=baz');
  });

  it('should return only the hash when URL parameter is an empty string', () => {
    expect(
      buildUrl('', {
        hash: 'about'
      })
    ).toEqual('#about');
  });

  it('should return only the hash when URL parameter is null', () => {
    expect(
      buildUrl(null, {
        hash: 'about'
      })
    ).toEqual('#about');
  });

  it('should return only the has when URL parameter is not present', () => {
    expect(
      buildUrl({
        hash: 'about'
      })
    ).toEqual('#about');
  });

  it('should return only the path when URL parameter is an empty string', () => {
    expect(
      buildUrl('', {
        path: 'contact'
      })
    ).toEqual('/contact');
  });

  it('should return only the path when URL parameter is null', () => {
    expect(
      buildUrl(null, {
        path: 'contact'
      })
    ).toEqual('/contact');
  });

  it('should return only the path when URL parameter is not present', () => {
    expect(
      buildUrl({
        path: 'contact'
      })
    ).toEqual('/contact');
  });

  it('should return only formatted options when URL parameter is an empty string', () => {
    expect(
      buildUrl('', {
        path: 'contact',
        hash: 'about',
        queryParams: {
          foo: 'bar',
          bar: 'baz'
        }
      })
    ).toEqual('/contact?foo=bar&bar=baz#about');
  });

  it('should return only formatted options when URL parameter is null', () => {
    expect(
      buildUrl(null, {
        path: 'contact',
        hash: 'about',
        queryParams: {
          foo: 'bar',
          bar: 'baz'
        }
      })
    ).toEqual('/contact?foo=bar&bar=baz#about');
  });

  it('should return only formatted options when URL parameter is not present', () => {
    expect(
      buildUrl({
        path: 'contact',
        hash: 'about',
        queryParams: {
          foo: 'bar',
          bar: 'baz'
        }
      })
    ).toEqual('/contact?foo=bar&bar=baz#about');
  });

  it("should not append a queryParam if it's undefined", () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          foo: 'bar',
          bar: void 0
        }
      })
    ).toEqual('http://example.com?foo=bar');
  });

  it("should not append a queryParam if it's number", () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          foo: 'bar',
          bar0: 0
        }
      })
    ).toEqual('http://example.com?foo=bar&bar0=0');
  });

  it('should not show a double slash with domain', () => {
    expect(
      buildUrl('http://example.com/', {
        path: '/contact'
      })
    ).toEqual('http://example.com/contact');
  });

  it('should encode query parameters', () => {
    const queryParams = {
      param0: 'Sanford & Sons',
      param1: "O'Reilly",
      param2: 'Hawai`i',
      param3: '"Bull" Connor',
      param4: 'Lech Wałęsa',
      param5: 'Herr Müller'
    };
    const url = buildUrl('https://example.com', { queryParams });
    const queryParamString = Object.values(queryParams)
      .map((param, i) => `param${i}=${encodeURIComponent(param)}`)
      .join('&');

    expect(url).toEqual(`https://example.com?${queryParamString}`);
  });

  it('should trim unwanted whitespace from path, query string and a fragment identifier which passed as options', () => {
    expect(
      buildUrl('http://example.com', {
        path: '  contact  ',
        hash: ' about ',
        queryParams: {
          foo: ' bar ',
          bar: ' baz '
        }
      })
    ).toEqual('http://example.com/contact?foo=bar&bar=baz#about');
  });

  it('should append a path, query string and a fragment identifier when passed as options which is of number type', () => {
    expect(
      buildUrl('http://example.com', {
        path: 12345,
        hash: 75885,
        queryParams: {
          foo: 12454,
          bar: 123457
        }
      })
    ).toEqual('http://example.com/12345?foo=12454&bar=123457#75885');
  });

  it("should change case of url path, query string and fragment identifier when lowerCase parameter passed as options with value 'true' ", () => {
    expect(
      buildUrl('http://example.com', {
        path: 'cOnTaCt',
        hash: 'aBOut12',
        lowerCase: true,
        queryParams: {
          foo: 'barRR',
          bar: 'baZXx                    '
        }
      })
    ).toEqual('http://example.com/contact?foo=barrr&bar=bazxx#about12');
  });

  it("should not change case of url path, query string and fragment identifier when lowerCase parameter passed as options with  value 'false' ", () => {
    expect(
      buildUrl('http://example.com', {
        path: 'AbouT',
        hash: 'ConTacT',
        lowerCase: false,
        queryParams: {
          foo: 'bAr',
          bar: ['oNe', 'TWO', 'thrEE', 123]
        }
      })
    ).toEqual('http://example.com/AbouT?foo=bAr&bar=oNe%2CTWO%2CthrEE%2C123#ConTacT');
  });

  it('should not change case of url path, query string and fragment identifier when when lowerCase parameter is not passed as argument', () => {
    expect(
      buildUrl('http://example.com', {
        path: 'AbouT',
        hash: 'ConTacT',
        queryParams: {
          foo: 'bAr',
          bar: ['oNe', 'TWO', 'thrEE', 123]
        }
      })
    ).toEqual('http://example.com/AbouT?foo=bAr&bar=oNe%2CTWO%2CthrEE%2C123#ConTacT');
  });

  it('should make array based parameters appear as a separate param for each of the values in array', () => {
    expect(
      buildUrl('http://example.com', {
        disableCSV: true,
        queryParams: {
          foo: 'bar',
          bar: ['one', 'two', 'three']
        }
      })
    ).toEqual('http://example.com?foo=bar&bar=one&bar=two&bar=three');
  });

  it('should maintain trailing slash if no options provided', () => {
    expect(buildUrl('http://example.com/api/v2/')).toEqual('http://example.com/api/v2/');
  });

  it('should maintain trailing slash if empty path is provided', () => {
    expect(buildUrl('http://example.com/api/v2/', { path: '' })).toEqual('http://example.com/api/v2/');
  });

  it('should maintain no trailing slash if one is not present in the url argument', () => {
    expect(buildUrl('http://example.com/api/v2')).toEqual('http://example.com/api/v2');
  });

  it('should maintain trailing slash if provided in path', () => {
    expect(buildUrl('http://example.com/api/v2', { path: '/' })).toEqual('http://example.com/api/v2/');
  });

  it('should treat null values in query param input as empty strings', () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          foo: 'bar',
          bar: null
        }
      })
    ).toEqual('http://example.com?foo=bar&bar=');
  });

  it('should handle undefined url', () => {
    expect(
      buildUrl(undefined, {
        path: '/api'
      })
    ).toEqual('/api');
  });

  it('should handle URLs with existing query parameters', () => {
    expect(
      buildUrl('http://example.com?existing=param', {
        queryParams: {
          foo: 'bar'
        }
      })
    ).toEqual('http://example.com?existing=param&foo=bar');
  });

  it('should handle URLs with existing hash', () => {
    expect(
      buildUrl('http://example.com#existing', {
        hash: 'new'
      })
    ).toEqual('http://example.com#new');
  });

  it('should handle URLs with port numbers', () => {
    expect(
      buildUrl('http://example.com:8080', {
        path: 'api',
        queryParams: {
          foo: 'bar'
        }
      })
    ).toEqual('http://example.com:8080/api?foo=bar');
  });

  it('should handle URLs with authentication', () => {
    expect(
      buildUrl('http://user:pass@example.com', {
        path: 'secure'
      })
    ).toEqual('http://user:pass@example.com/secure');
  });

  it('should handle protocol-relative URLs', () => {
    expect(
      buildUrl('//example.com', {
        path: 'api',
        queryParams: {
          foo: 'bar'
        }
      })
    ).toEqual('//example.com/api?foo=bar');
  });

  it('should handle localhost URLs', () => {
    expect(
      buildUrl('http://localhost:3000', {
        path: 'api/users',
        queryParams: {
          id: '123'
        }
      })
    ).toEqual('http://localhost:3000/api/users?id=123');
  });

  it('should handle IP address URLs', () => {
    expect(
      buildUrl('http://192.168.1.1', {
        path: 'admin',
        queryParams: {
          action: 'login'
        }
      })
    ).toEqual('http://192.168.1.1/admin?action=login');
  });

  it('should handle IPv6 URLs', () => {
    expect(
      buildUrl('http://[2001:db8::1]', {
        path: 'api'
      })
    ).toEqual('http://[2001:db8::1]/api');
  });

  it('should handle file:// protocol', () => {
    expect(
      buildUrl('file:///home/user/file.txt', {
        queryParams: {
          version: '2'
        }
      })
    ).toEqual('file:///home/user/file.txt?version=2');
  });

  it('should handle deeply nested paths', () => {
    expect(
      buildUrl('http://example.com', {
        path: 'api/v1/users/123/posts/456/comments/789'
      })
    ).toEqual('http://example.com/api/v1/users/123/posts/456/comments/789');
  });

  it('should handle special characters in paths', () => {
    expect(
      buildUrl('http://example.com', {
        path: 'api/users/@john/profile'
      })
    ).toEqual('http://example.com/api/users/@john/profile');
  });

  it('should handle empty string values in query params', () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          foo: '',
          bar: 'baz'
        }
      })
    ).toEqual('http://example.com?foo=&bar=baz');
  });

  it('should handle boolean values in query params', () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          active: true,
          disabled: false
        }
      })
    ).toEqual('http://example.com?active=true&disabled=false');
  });

  it('should handle mixed types in array query params', () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          items: [1, 'two', true, null]
        }
      })
    ).toEqual('http://example.com?items=1%2Ctwo%2Ctrue%2C');
  });

  it('should handle nested objects in query params (stringify)', () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          filter: { name: 'john', age: 30 }
        }
      })
    ).toEqual('http://example.com?filter=%7B%22name%22%3A%22john%22%2C%22age%22%3A30%7D');
  });

  it('should handle extremely long query strings', () => {
    const longValue = 'a'.repeat(1000);
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          data: longValue
        }
      })
    ).toEqual(`http://example.com?data=${encodeURIComponent(longValue)}`);
  });

  it('should handle multiple path segments with trailing slashes', () => {
    expect(
      buildUrl('http://example.com/api/', {
        path: '/v1/users/'
      })
    ).toEqual('http://example.com/api/v1/users/');
  });

  it('should handle hash with special characters', () => {
    expect(
      buildUrl('http://example.com', {
        hash: 'section-1.2.3'
      })
    ).toEqual('http://example.com#section-1.2.3');
  });

  it('should handle query params with dots and hyphens in keys', () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          'user.name': 'john',
          'api-key': 'secret'
        }
      })
    ).toEqual('http://example.com?user.name=john&api-key=secret');
  });

  it('should handle URLs with multiple consecutive slashes', () => {
    expect(
      buildUrl('http://example.com///api///', {
        path: '///users///'
      })
    ).toEqual('http://example.com///api/users/');
  });

  it('should preserve existing query string when adding new params', () => {
    expect(
      buildUrl('http://example.com?a=1&b=2', {
        queryParams: {
          c: '3',
          d: '4'
        }
      })
    ).toEqual('http://example.com?a=1&b=2&c=3&d=4');
  });

  it('should handle query params with equals signs in values', () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          formula: 'a=b+c',
          equation: '2+2=4'
        }
      })
    ).toEqual('http://example.com?formula=a%3Db%2Bc&equation=2%2B2%3D4');
  });

  it('should handle query params with ampersands in values', () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          company: 'Smith & Sons',
          title: 'R&D Manager'
        }
      })
    ).toEqual('http://example.com?company=Smith%20%26%20Sons&title=R%26D%20Manager');
  });

  it('should handle internationalized domain names', () => {
    expect(
      buildUrl('http://例え.jp', {
        path: 'ページ',
        queryParams: {
          検索: 'テスト'
        }
      })
    ).toEqual('http://例え.jp/ページ?%E6%A4%9C%E7%B4%A2=%E3%83%86%E3%82%B9%E3%83%88');
  });

  it('should handle emoji in query params', () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          mood: '😊',
          reaction: '👍'
        }
      })
    ).toEqual('http://example.com?mood=%F0%9F%98%8A&reaction=%F0%9F%91%8D');
  });

  it('should handle very large numbers in query params', () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          bigInt: Number.MAX_SAFE_INTEGER,
          bigFloat: 1.7976931348623157e308
        }
      })
    ).toEqual('http://example.com?bigInt=9007199254740991&bigFloat=1.7976931348623157e%2B308');
  });

  it('should handle negative numbers in query params', () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          temperature: -40,
          balance: -123.45
        }
      })
    ).toEqual('http://example.com?temperature=-40&balance=-123.45');
  });

  it('should handle scientific notation in query params', () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          small: 1e-10,
          large: 1e10
        }
      })
    ).toEqual('http://example.com?small=1e-10&large=10000000000');
  });

  it('should handle Date objects in query params', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          date: date
        }
      })
    ).toEqual(`http://example.com?date=${encodeURIComponent(date.toString())}`);
  });

  it('should handle Symbol.toString() in query params', () => {
    const sym = Symbol('test');
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          symbol: sym.toString()
        }
      })
    ).toEqual('http://example.com?symbol=Symbol(test)');
  });

  it('should handle disableCSV with empty arrays', () => {
    expect(
      buildUrl('http://example.com', {
        disableCSV: true,
        queryParams: {
          items: [],
          foo: 'bar'
        }
      })
    ).toEqual('http://example.com?foo=bar');
  });

  it('should handle disableCSV with single-item arrays', () => {
    expect(
      buildUrl('http://example.com', {
        disableCSV: true,
        queryParams: {
          items: ['only']
        }
      })
    ).toEqual('http://example.com?items=only');
  });

  it('should handle paths with query-like strings', () => {
    expect(
      buildUrl('http://example.com', {
        path: 'search?query=test'
      })
    ).toEqual('http://example.com/search?query=test');
  });

  it('should handle paths with hash-like strings', () => {
    expect(
      buildUrl('http://example.com', {
        path: 'page#section'
      })
    ).toEqual('http://example.com/page#section');
  });

  it('should handle combining path with existing URL path', () => {
    expect(
      buildUrl('http://example.com/api', {
        path: 'v2/users'
      })
    ).toEqual('http://example.com/api/v2/users');
  });

  it('should handle ftp:// protocol', () => {
    expect(
      buildUrl('ftp://ftp.example.com', {
        path: 'pub/files',
        queryParams: {
          type: 'binary'
        }
      })
    ).toEqual('ftp://ftp.example.com/pub/files?type=binary');
  });

  it('should handle data: URLs', () => {
    expect(
      buildUrl('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==', {
        queryParams: {
          version: '1'
        }
      })
    ).toEqual('data:text/plain;base64,SGVsbG8sIFdvcmxkIQ==?version=1');
  });

  it('should handle mailto: URLs', () => {
    expect(
      buildUrl('mailto:test@example.com', {
        queryParams: {
          subject: 'Hello World',
          body: 'Test message'
        }
      })
    ).toEqual('mailto:test@example.com?subject=Hello%20World&body=Test%20message');
  });

  it('should handle tel: URLs', () => {
    expect(
      buildUrl('tel:+1234567890', {
        queryParams: {
          extension: '123'
        }
      })
    ).toEqual('tel:+1234567890?extension=123');
  });

  it('should handle edge case with only hash character', () => {
    expect(
      buildUrl('http://example.com', {
        hash: '#'
      })
    ).toEqual('http://example.com##');
  });

  it('should handle edge case with only question mark', () => {
    expect(
      buildUrl('http://example.com', {
        queryParams: {
          '?': '?'
        }
      })
    ).toEqual('http://example.com?%3F=%3F');
  });

  it('should handle null in array with disableCSV', () => {
    expect(
      buildUrl('http://example.com', {
        disableCSV: true,
        queryParams: {
          items: ['one', null, 'three']
        }
      })
    ).toEqual('http://example.com?items=one&items=&items=three');
  });

  it('should handle undefined in array with disableCSV', () => {
    expect(
      buildUrl('http://example.com', {
        disableCSV: true,
        queryParams: {
          items: ['one', undefined, 'three']
        }
      })
    ).toEqual('http://example.com?items=one&items=three');
  });
});
