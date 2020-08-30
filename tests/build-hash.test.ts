import buildHash from "../src/utils/build-hash";

describe("buildHash", () => {
  it("should return string with preceding #", () => {
    expect(buildHash("foo")).toBe("#foo");
  });

  it("should return string as given if no lowercase flag", () => {
    expect(buildHash("fOo")).toBe("#fOo");
  });

  it("should return lowercased string if given lowercase flag", () => {
    expect(buildHash("FoO", true)).toBe("#foo");
  });
});
