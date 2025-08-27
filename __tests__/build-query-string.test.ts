import { buildQueryString } from '../src';

describe('buildQueryString', () => {
  it('should return a query string', () => {
    expect(
      buildQueryString({
        foo: 'bar',
        bar: 'baz'
      })
    ).toEqual('?foo=bar&bar=baz');
  });

  it('should transform an array to a comma separated list', () => {
    expect(
      buildQueryString({
        foo: 'bar',
        bar: ['one', 'two', 'three']
      })
    ).toEqual('?foo=bar&bar=one%2Ctwo%2Cthree');
  });

  it('should make array based parameters appear as a separate param for each of the values in array if disableCSV flag is given', () => {
    expect(
      buildQueryString(
        {
          foo: 'bar',
          bar: ['one', 'two', 'three']
        },
        false,
        true
      )
    ).toEqual('?foo=bar&bar=one&bar=two&bar=three');
  });

  it('maintains case if no lowerCase flag is given', () => {
    expect(buildQueryString({ foo: 'BAR' })).toBe('?foo=BAR');
  });

  it('returns all lowercase if lowerCase flag is given', () => {
    expect(buildQueryString({ foo: 'BAR' }, true)).toBe('?foo=bar');
  });

  it('Disable CSV array: should transform an array to a comma separated list', () => {
    expect(
      buildQueryString(
        {
          foo: 'bar',
          bar: ['one', 'two', 'three']
        },
        false,
        'array'
      )
    ).toEqual('?foo=bar&bar[]=one&bar[]=two&bar[]=three');
  });

  it('Disable CSV order_asc: should transform an array to a comma separated list', () => {
    expect(
      buildQueryString(
        {
          foo: 'bar',
          bar: ['one', 'two', 'three']
        },
        false,
        'order_asc'
      )
    ).toEqual('?foo=bar&bar[0]=one&bar[1]=two&bar[2]=three');
  });

  it('Disable CSV order_desc: should transform an array to a comma separated list', () => {
    expect(
      buildQueryString(
        {
          foo: 'bar',
          bar: ['one', 'two', 'three']
        },
        false,
        'order_desc'
      )
    ).toEqual('?foo=bar&bar[2]=one&bar[1]=two&bar[0]=three');
  });

  it('should handle empty object', () => {
    expect(buildQueryString({})).toEqual('');
  });

  it('should handle null values', () => {
    expect(
      buildQueryString({
        foo: null,
        bar: 'baz'
      })
    ).toEqual('?foo=&bar=baz');
  });

  it('should handle undefined values', () => {
    expect(
      buildQueryString({
        foo: undefined,
        bar: 'baz'
      })
    ).toEqual('?bar=baz');
  });

  it('should handle boolean values', () => {
    expect(
      buildQueryString({
        active: true,
        disabled: false,
        foo: 'bar'
      })
    ).toEqual('?active=true&disabled=false&foo=bar');
  });

  it('should handle number values including zero', () => {
    expect(
      buildQueryString({
        count: 0,
        page: 1,
        limit: 100,
        ratio: 3.14
      })
    ).toEqual('?count=0&page=1&limit=100&ratio=3.14');
  });

  it('should handle empty strings', () => {
    expect(
      buildQueryString({
        foo: '',
        bar: 'baz'
      })
    ).toEqual('?foo=&bar=baz');
  });

  it('should handle special characters that need encoding', () => {
    expect(
      buildQueryString({
        name: 'John & Jane',
        email: 'test@example.com',
        path: '/api/users?id=1',
        hash: '#section'
      })
    ).toEqual('?name=John%20%26%20Jane&email=test%40example.com&path=%2Fapi%2Fusers%3Fid%3D1&hash=%23section');
  });

  it('should handle non-ASCII characters', () => {
    expect(
      buildQueryString({
        name: 'にほんご',
        emoji: '😀',
        special: 'éáüñ'
      })
    ).toEqual('?name=%E3%81%AB%E3%81%BB%E3%82%93%E3%81%94&emoji=%F0%9F%98%80&special=%C3%A9%C3%A1%C3%BC%C3%B1');
  });

  it('should handle mixed type arrays', () => {
    expect(
      buildQueryString({
        items: [1, 'two', true, null, undefined, 3.14]
      })
    ).toEqual('?items=1%2Ctwo%2Ctrue%2C%2C3.14');
  });

  it('should handle empty arrays', () => {
    expect(
      buildQueryString({
        items: [],
        foo: 'bar'
      })
    ).toEqual('?foo=bar');
  });

  it('should handle nested objects (stringify)', () => {
    expect(
      buildQueryString({
        filter: { name: 'john', age: 30 },
        foo: 'bar'
      })
    ).toEqual('?filter=%7B%22name%22%3A%22john%22%2C%22age%22%3A30%7D&foo=bar');
  });

  it('should handle Date objects', () => {
    const date = new Date('2024-01-01T00:00:00Z');
    expect(
      buildQueryString({
        created: date
      })
    ).toEqual(`?created=${encodeURIComponent(date.toString())}`);
  });

  it('should handle very long strings', () => {
    const longString = 'a'.repeat(1000);
    expect(
      buildQueryString({
        data: longString
      })
    ).toEqual(`?data=${encodeURIComponent(longString)}`);
  });

  it('should handle keys with special characters', () => {
    expect(
      buildQueryString({
        'user.name': 'john',
        'api-key': 'secret',
        'items[]': 'value'
      })
    ).toEqual('?user.name=john&api-key=secret&items%5B%5D=value');
  });

  it('should maintain key order', () => {
    const result = buildQueryString({
      z: '1',
      y: '2',
      x: '3',
      a: '4'
    });
    expect(result).toEqual('?z=1&y=2&x=3&a=4');
  });

  it('should handle array with disableCSV as false (default CSV behavior)', () => {
    expect(
      buildQueryString(
        {
          items: ['one', 'two', 'three']
        },
        false,
        false
      )
    ).toEqual('?items=one%2Ctwo%2Cthree');
  });

  it('should handle single item arrays', () => {
    expect(
      buildQueryString({
        item: ['single']
      })
    ).toEqual('?item=single');
  });

  it('should handle arrays with special characters in disableCSV mode', () => {
    expect(
      buildQueryString(
        {
          items: ['a&b', 'c=d', 'e?f']
        },
        false,
        true
      )
    ).toEqual('?items=a%26b&items=c%3Dd&items=e%3Ff');
  });

  it('should handle lowerCase with mixed content', () => {
    expect(
      buildQueryString(
        {
          FOO: 'BAR',
          BaZ: ['ONE', 'TwO', 'THRee'],
          MiXeD: 123
        },
        true
      )
    ).toEqual('?foo=bar&baz=one%2Ctwo%2Cthree&mixed=123');
  });

  it('should handle array mode with empty arrays', () => {
    expect(
      buildQueryString(
        {
          items: [],
          foo: 'bar'
        },
        false,
        'array'
      )
    ).toEqual('?foo=bar');
  });

  it('should handle array mode with null and undefined in arrays', () => {
    expect(
      buildQueryString(
        {
          items: ['one', null, undefined, 'four']
        },
        false,
        'array'
      )
    ).toEqual('?items[]=one&items[]=&items[]=four');
  });

  it('should handle order_asc mode with mixed types', () => {
    expect(
      buildQueryString(
        {
          items: [1, 'two', true, null]
        },
        false,
        'order_asc'
      )
    ).toEqual('?items[0]=1&items[1]=two&items[2]=true&items[3]=');
  });

  it('should handle order_desc mode with single item', () => {
    expect(
      buildQueryString(
        {
          item: ['single']
        },
        false,
        'order_desc'
      )
    ).toEqual('?item[0]=single');
  });

  it('should handle negative numbers', () => {
    expect(
      buildQueryString({
        temperature: -40,
        balance: -123.45
      })
    ).toEqual('?temperature=-40&balance=-123.45');
  });

  it('should handle scientific notation', () => {
    expect(
      buildQueryString({
        small: 1e-10,
        large: 1e10
      })
    ).toEqual('?small=1e-10&large=10000000000');
  });

  it('should handle Infinity and NaN', () => {
    expect(
      buildQueryString({
        inf: Infinity,
        negInf: -Infinity,
        notANumber: NaN
      })
    ).toEqual('?inf=Infinity&negInf=-Infinity&notANumber=NaN');
  });

  it('should handle plus signs in values', () => {
    expect(
      buildQueryString({
        phone: '+1234567890',
        formula: '2+2=4'
      })
    ).toEqual('?phone=%2B1234567890&formula=2%2B2%3D4');
  });

  it('should handle percent signs in values', () => {
    expect(
      buildQueryString({
        discount: '50%',
        encoded: '%20'
      })
    ).toEqual('?discount=50%25&encoded=%2520');
  });

  it('should handle quotes in values', () => {
    expect(
      buildQueryString({
        single: "it's",
        double: '"quoted"',
        backtick: '`code`'
      })
    ).toEqual('?single=it%27s&double=%22quoted%22&backtick=%60code%60');
  });

  it('should handle newlines and tabs in values', () => {
    expect(
      buildQueryString({
        multiline: 'line1\nline2',
        tabbed: 'col1\tcol2'
      })
    ).toEqual('?multiline=line1%0Aline2&tabbed=col1%09col2');
  });

  it('should handle symbols converted to strings', () => {
    const sym = Symbol('test');
    expect(
      buildQueryString({
        symbol: sym.toString()
      })
    ).toEqual('?symbol=Symbol(test)');
  });

  it('should handle very large numbers', () => {
    expect(
      buildQueryString({
        maxInt: Number.MAX_SAFE_INTEGER,
        minInt: Number.MIN_SAFE_INTEGER
      })
    ).toEqual('?maxInt=9007199254740991&minInt=-9007199254740991');
  });

  it('should handle array with lowerCase and disableCSV', () => {
    expect(
      buildQueryString(
        {
          ITEMS: ['ONE', 'TWO', 'THREE']
        },
        true,
        true
      )
    ).toEqual('?items=one&items=two&items=three');
  });

  it('should handle complex nested structure', () => {
    expect(
      buildQueryString({
        user: {
          name: 'John',
          settings: {
            theme: 'dark',
            notifications: true
          }
        }
      })
    ).toEqual('?user=%7B%22name%22%3A%22John%22%2C%22settings%22%3A%7B%22theme%22%3A%22dark%22%2C%22notifications%22%3Atrue%7D%7D');
  });

  it('should handle functions (toString)', () => {
    const func = function testFunc() {};
    expect(
      buildQueryString({
        callback: func.toString()
      })
    ).toMatch(/^\?callback=function/);
  });

  it('should handle array indexes in array mode', () => {
    expect(
      buildQueryString(
        {
          items: ['a', 'b', 'c', 'd', 'e']
        },
        false,
        'array'
      )
    ).toEqual('?items[]=a&items[]=b&items[]=c&items[]=d&items[]=e');
  });

  it('should handle order_asc with large arrays', () => {
    const largeArray = Array.from({ length: 10 }, (_, i) => i);
    const result = buildQueryString(
      { items: largeArray },
      false,
      'order_asc'
    );
    expect(result).toContain('items[0]=0');
    expect(result).toContain('items[9]=9');
  });

  it('should handle order_desc with large arrays', () => {
    const largeArray = Array.from({ length: 5 }, (_, i) => i);
    expect(
      buildQueryString(
        { items: largeArray },
        false,
        'order_desc'
      )
    ).toEqual('?items[4]=0&items[3]=1&items[2]=2&items[1]=3&items[0]=4');
  });
});
