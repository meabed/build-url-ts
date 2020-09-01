import {appendPath} from "../build-url";

describe("appendPath", () => {
  it("should append path", () => {});

  it("should append path", () => {
    expect(appendPath("about", "https://foo.com")).toBe(
      "https://foo.com/about"
    );
    expect(appendPath("/about", "https://foo.com")).toBe(
      "https://foo.com/about"
    );
  });

  it("should return full path if no URL given", () => {
    expect(appendPath("/about", "")).toBe("/about");
    expect(appendPath("/about", "")).toBe("/about");
  });

  it("should return path in given case if no lowerCase flag given", () => {
    expect(appendPath("/aBout", "")).toBe("/aBout");
  });

  it("should return lowercased path if no lowerCase flag given", () => {
    expect(appendPath("/aBOut", "", true)).toBe("/about");
  });
});
