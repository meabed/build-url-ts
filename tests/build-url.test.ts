import buildUrl from "../src/build-url";

describe("buildUrl", () => {
  it("should be defined", () => {
    expect(buildUrl).toBeDefined();
  });

  it("should return undefined if called with no arguments", () => {
    expect(buildUrl()).toBe(undefined);
  });

  it("should return a string if called with an argument", () => {
    expect(typeof buildUrl("something")).toEqual("string");
  });

  it("should append a path when passed as an option", () => {
    expect(
      buildUrl("http://example.com", {
        path: "about/me",
      })
    ).toEqual("http://example.com/about/me");
  });

  it('should append a path when passed an option with a leading "/"', () => {
    expect(
      buildUrl("http://example.com", {
        path: "/about/me",
      })
    ).toEqual("http://example.com/about/me");
  });

  it("should append a query string when passed as an option", () => {
    expect(
      buildUrl("http://example.com", {
        queryParams: {
          foo: "bar",
          bar: "baz",
        },
      })
    ).toEqual("http://example.com?foo=bar&bar=baz");
  });

  it("should transform an array to a comma separated list if part of queryParams", () => {
    expect(
      buildUrl("http://example.com", {
        queryParams: {
          foo: "bar",
          bar: ["one", "two", "three"],
        },
      })
    ).toEqual("http://example.com?foo=bar&bar=one%2Ctwo%2Cthree");
  });

  it("should append a fragment identifier when passed as an option", () => {
    expect(
      buildUrl("http://example.com", {
        hash: "contact",
      })
    ).toEqual("http://example.com#contact");
  });

  it("should append a path and a query string when passed as options", () => {
    expect(
      buildUrl("http://example.com", {
        path: "about/me",
        queryParams: {
          foo: "bar",
          bar: "baz",
        },
      })
    ).toEqual("http://example.com/about/me?foo=bar&bar=baz");
  });

  it("should append a path and a fragment identifier when passed as options", () => {
    expect(
      buildUrl("http://example.com", {
        path: "about/me",
        hash: "contact",
      })
    ).toEqual("http://example.com/about/me#contact");
  });

  it("should append a path, query string and a fragment identifier when passed as options", () => {
    expect(
      buildUrl("http://example.com", {
        path: "about/me",
        hash: "contact",
        queryParams: {
          foo: "bar",
          bar: "baz",
        },
      })
    ).toEqual("http://example.com/about/me?foo=bar&bar=baz#contact");
  });

  it("should append a query string and a fragment identifier when passed as options", () => {
    expect(
      buildUrl("http://example.com", {
        hash: "contact",
        queryParams: {
          foo: "bar",
          bar: "baz",
        },
      })
    ).toEqual("http://example.com?foo=bar&bar=baz#contact");
  });

  it("should return only the query string when URL parameter is an empty string", () => {
    expect(
      buildUrl("", {
        queryParams: {
          foo: "bar",
          bar: "baz",
        },
      })
    ).toEqual("?foo=bar&bar=baz");
  });

  it("should return only the query string when URL parameter is null", () => {
    expect(
      buildUrl(null, {
        queryParams: {
          foo: "bar",
          bar: "baz",
        },
      })
    ).toEqual("?foo=bar&bar=baz");
  });

  it("should return only the query string when URL parameter is not present", () => {
    expect(
      buildUrl({
        queryParams: {
          foo: "bar",
          bar: "baz",
        },
      })
    ).toEqual("?foo=bar&bar=baz");
  });

  it("should return only the hash when URL parameter is an empty string", () => {
    expect(
      buildUrl("", {
        hash: "about",
      })
    ).toEqual("#about");
  });

  it("should return only the hash when URL parameter is null", () => {
    expect(
      buildUrl(null, {
        hash: "about",
      })
    ).toEqual("#about");
  });

  it("should return only the has when URL parameter is not present", () => {
    expect(
      buildUrl({
        hash: "about",
      })
    ).toEqual("#about");
  });

  it("should return only the path when URL parameter is an empty string", () => {
    expect(
      buildUrl("", {
        path: "contact",
      })
    ).toEqual("/contact");
  });

  it("should return only the path when URL parameter is null", () => {
    expect(
      buildUrl(null, {
        path: "contact",
      })
    ).toEqual("/contact");
  });

  it("should return only the path when URL parameter is not present", () => {
    expect(
      buildUrl({
        path: "contact",
      })
    ).toEqual("/contact");
  });

  it("should return only formatted options when URL parameter is an empty string", () => {
    expect(
      buildUrl("", {
        path: "contact",
        hash: "about",
        queryParams: {
          foo: "bar",
          bar: "baz",
        },
      })
    ).toEqual("/contact?foo=bar&bar=baz#about");
  });

  it("should return only formatted options when URL parameter is null", () => {
    expect(
      buildUrl(null, {
        path: "contact",
        hash: "about",
        queryParams: {
          foo: "bar",
          bar: "baz",
        },
      })
    ).toEqual("/contact?foo=bar&bar=baz#about");
  });

  it("should return only formatted options when URL parameter is not present", () => {
    expect(
      buildUrl({
        path: "contact",
        hash: "about",
        queryParams: {
          foo: "bar",
          bar: "baz",
        },
      })
    ).toEqual("/contact?foo=bar&bar=baz#about");
  });

  it("should not append a queryParam if it's undefined", () => {
    expect(
      buildUrl("http://example.com", {
        queryParams: {
          foo: "bar",
          bar: void 0,
        },
      })
    ).toEqual("http://example.com?foo=bar");
  });

  it("should not append a queryParam if it's number", () => {
    expect(
      buildUrl("http://example.com", {
        queryParams: {
          foo: "bar",
          bar0: 0,
        },
      })
    ).toEqual("http://example.com?foo=bar&bar0=0");
  });

  it("should not show a double slash with domain", () => {
    expect(
      buildUrl("http://example.com/", {
        path: "/contact",
      })
    ).toEqual("http://example.com/contact");
  });

  it("should encode query parameters", () => {
    const queryParams = {
      param0: "Sanford & Sons",
      param1: "O'Reilly",
      param2: "Hawai`i",
      param3: '"Bull" Connor',
      param4: "Lech Wałęsa",
      param5: "Herr Müller",
    };
    const url = buildUrl("https://example.com", { queryParams });
    const queryParamString = Object.values(queryParams)
      .map((param, i) => `param${i}=${encodeURIComponent(param)}`)
      .join("&");

    expect(url).toEqual(`https://example.com?${queryParamString}`);
  });

  it("should trim unwanted whitespace from path, query string and a fragment identifier which passed as options", () => {
    expect(
      buildUrl("http://example.com", {
        path: "  contact  ",
        hash: " about ",
        queryParams: {
          foo: " bar ",
          bar: " baz ",
        },
      })
    ).toEqual("http://example.com/contact?foo=bar&bar=baz#about");
  });

  it("should append a path, query string and a fragment identifier when passed as options which is of number type", () => {
    expect(
      buildUrl("http://example.com", {
        path: 12345,
        hash: 75885,
        queryParams: {
          foo: 12454,
          bar: 123457,
        },
      })
    ).toEqual("http://example.com/12345?foo=12454&bar=123457#75885");
  });

  it("should change case of url path, query string and fragment identifier when lowerCase parameter passed as options with value 'true' ", () => {
    expect(
      buildUrl("http://example.com", {
        path: "cOnTaCt",
        hash: "aBOut12",
        lowerCase: true,
        queryParams: {
          foo: "barRR",
          bar: "baZXx                    ",
        },
      })
    ).toEqual("http://example.com/contact?foo=barrr&bar=bazxx#about12");
  });

  it("should not change case of url path, query string and fragment identifier when lowerCase parameter passed as options with  value 'false' ", () => {
    expect(
      buildUrl("http://example.com", {
        path: "AbouT",
        hash: "ConTacT",
        lowerCase: false,
        queryParams: {
          foo: "bAr",
          bar: ["oNe", "TWO", "thrEE", 123],
        },
      })
    ).toEqual(
      "http://example.com/AbouT?foo=bAr&bar=oNe%2CTWO%2CthrEE%2C123#ConTacT"
    );
  });

  it("should not change case of url path, query string and fragment identifier when when lowerCase parameter is not passed as argument", () => {
    expect(
      buildUrl("http://example.com", {
        path: "AbouT",
        hash: "ConTacT",
        queryParams: {
          foo: "bAr",
          bar: ["oNe", "TWO", "thrEE", 123],
        },
      })
    ).toEqual(
      "http://example.com/AbouT?foo=bAr&bar=oNe%2CTWO%2CthrEE%2C123#ConTacT"
    );
  });

  it("should make array based parameters appear as a separate param for each of the values in array", () => {
    expect(
      buildUrl("http://example.com", {
        disableCSV: true,
        queryParams: {
          foo: "bar",
          bar: ["one", "two", "three"],
        },
      })
    ).toEqual("http://example.com?foo=bar&bar=one&bar=two&bar=three");
  });

  it("should maintain trailing slash if no options provided", () => {
    expect(buildUrl("http://example.com/api/v2/")).toEqual(
      "http://example.com/api/v2/"
    );
  });

  it("should maintain trailing slash if empty path is provided", () => {
    expect(buildUrl("http://example.com/api/v2/", { path: "" })).toEqual(
      "http://example.com/api/v2/"
    );
  });

  it("should maintain no trailing slash if one is not present in the url argument", () => {
    expect(buildUrl("http://example.com/api/v2")).toEqual(
      "http://example.com/api/v2"
    );
  });

  it("should maintain trailing slash if provided in path", () => {
    expect(buildUrl("http://example.com/api/v2", { path: "/" })).toEqual(
      "http://example.com/api/v2/"
    );
  });

  it("should treat null values in query param input as empty strings", () => {
    expect(
      buildUrl("http://example.com", {
        queryParams: {
          foo: "bar",
          bar: null,
        },
      })
    ).toEqual("http://example.com?foo=bar&bar=");
  });
});
