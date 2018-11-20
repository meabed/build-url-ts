// Type definitions for BuildUrl
// Project: BuildUrl
// Definitions by: Tyler Kellogg <recurrence@gmail.com>

export = BuildUrl;

declare function BuildUrl(
  url: string,
  options?: BuildUrl.BuildUrlOptions
): string;

declare namespace BuildUrl {
  export interface BuildUrlOptions {
    path?: string;
    hash?: string;
    queryParams?: { [name: string]: string | string[] };
  }
}
