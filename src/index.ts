/**
 * `build-url-ts` — a small, fast, zero-dependency library for composing URLs
 * from their parts (path, query string, and hash fragment).
 *
 * It runs anywhere JavaScript does (Node.js, Bun, Deno, edge runtimes, and
 * browsers) and ships both ESM and CommonJS builds with full type definitions.
 *
 * @packageDocumentation
 * @example
 * ```ts
 * import { buildUrl } from 'build-url-ts';
 *
 * buildUrl('https://api.example.com', {
 *   path: 'users/123',
 *   queryParams: { tab: 'profile', limit: 10 },
 *   hash: 'summary',
 * });
 * // → https://api.example.com/users/123?tab=profile&limit=10#summary
 * ```
 */

/**
 * A value accepted for a single query parameter.
 *
 * - `string` / `number` / `boolean` are stringified as-is.
 * - `null` becomes an empty value (`key=`).
 * - `undefined` is omitted entirely.
 * - An array is rendered as a comma-separated list by default, or as repeated /
 *   indexed keys via {@link IBuildUrlOptions.disableCSV}.
 * - A `Date` is serialized with `Date.prototype.toString()`.
 * - Any other `object` is serialized with `JSON.stringify()`.
 */
export type QueryParamValue =
  | null
  | undefined
  | string
  | number
  | boolean
  | (string | number | boolean | null | undefined)[]
  | Date
  | object;

/** A map of query parameter names to {@link QueryParamValue}s. */
export type IQueryParams = Record<string, QueryParamValue>;

/**
 * How array query parameters are serialized when CSV joining is disabled.
 *
 * - `'array'` → `key[]=a&key[]=b`
 * - `'order_asc'` → `key[0]=a&key[1]=b`
 * - `'order_desc'` → `key[1]=a&key[0]=b`
 *
 * The boolean `true` (see {@link IBuildUrlOptions.disableCSV}) produces repeated
 * keys without brackets: `key=a&key=b`.
 */
export type IDisableCsvType = 'array' | 'order_asc' | 'order_desc';

/** Options describing the parts of the URL to build. */
export interface IBuildUrlOptions {
  /**
   * A single path segment appended to the URL. Leading, trailing, and duplicate
   * slashes are normalized.
   *
   * @example 'about/me' // → /about/me
   */
  path?: string | number;
  /**
   * Multiple path segments appended in order. Use this instead of (or in
   * addition to) {@link IBuildUrlOptions.path}; when both are given, `path` is
   * applied first, then each entry of `paths`.
   *
   * @example ['about', '/my/', '/cat'] // → /about/my/cat
   */
  paths?: (string | number)[];
  /** Lowercase the generated path, query string, and hash. Defaults to `false`. */
  lowerCase?: boolean;
  /** Query parameters to append, merged on top of any already present on the URL. */
  queryParams?: IQueryParams;
  /**
   * Control how array query parameters are rendered. `false`/omitted joins them
   * into a comma-separated list; `true` repeats the key; a {@link IDisableCsvType}
   * selects a bracketed format.
   */
  disableCSV?: boolean | IDisableCsvType;
  /** Hash/fragment identifier to append (without the leading `#`). */
  hash?: string | number;
}

/**
 * Encodes a string with `encodeURIComponent`, additionally escaping the
 * single quote (`'`) and backtick (`` ` ``) which `encodeURIComponent` leaves
 * untouched but which can be ambiguous inside a URL.
 */
function customEncodeURIComponent(str: string): string {
  return encodeURIComponent(str).replace(/'/g, '%27').replace(/`/g, '%60');
}

/**
 * Builds a query string (including the leading `?`) from a parameters object.
 *
 * @param queryParams - The parameters to serialize.
 * @param lowerCase - Lowercase keys and values. Defaults to `false`.
 * @param disableCSV - How to render array values. See {@link IDisableCsvType}.
 * @param useCustomEncoding - Use {@link customEncodeURIComponent} (escapes `'`
 *   and `` ` ``) instead of plain `encodeURIComponent`. Defaults to `true`.
 *   {@link buildUrl} passes `false` because it encodes values itself.
 * @returns The query string (e.g. `?foo=bar&bar=baz`), or `''` when empty.
 *
 * @example
 * ```ts
 * buildQueryString({ foo: 'bar', ids: [1, 2, 3] });
 * // → ?foo=bar&ids=1%2C2%2C3
 * ```
 */
export function buildQueryString(
  queryParams: IQueryParams,
  lowerCase?: boolean,
  disableCSV?: boolean | IDisableCsvType,
  useCustomEncoding: boolean = true
): string {
  const encode = (input: string): string =>
    useCustomEncoding ? customEncodeURIComponent(input) : encodeURIComponent(input);
  const queryParts: string[] = [];

  for (const [key, value] of Object.entries(queryParams)) {
    // `undefined` means "omit this parameter entirely".
    if (value === undefined) continue;

    const encodedKey = encode(lowerCase ? key.toLowerCase() : key);

    if (!Array.isArray(value)) {
      queryParts.push(`${encodedKey}=${encode(formatValue(value, lowerCase))}`);
      continue;
    }

    // Drop `undefined` array items, then skip the parameter if nothing remains.
    const items = value.filter((item) => item !== undefined);
    if (items.length === 0) continue;

    if (!disableCSV) {
      // Default: join into a single comma-separated value.
      const csvValue = items.map((item) => formatValue(item, lowerCase)).join(',');
      queryParts.push(`${encodedKey}=${encode(csvValue)}`);
      continue;
    }

    // Otherwise render one entry per item, in the requested key format.
    let index = disableCSV === 'order_desc' ? items.length - 1 : 0;
    for (const item of items) {
      const encodedValue = encode(formatValue(item, lowerCase));
      switch (disableCSV) {
        case 'array':
          queryParts.push(`${encodedKey}[]=${encodedValue}`);
          break;
        case 'order_asc':
          queryParts.push(`${encodedKey}[${index++}]=${encodedValue}`);
          break;
        case 'order_desc':
          queryParts.push(`${encodedKey}[${index--}]=${encodedValue}`);
          break;
        default:
          queryParts.push(`${encodedKey}=${encodedValue}`);
          break;
      }
    }
  }

  return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
}

/**
 * Converts a single query value into its string form, before URL encoding.
 * `null`/`undefined`/empty become `''`; `Date` and plain objects are
 * serialized; everything else is stringified and trimmed.
 */
function formatValue(value: QueryParamValue, lowerCase?: boolean): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'boolean') return value.toString();
  // Guard `0` before the falsy check below so it is not treated as empty.
  if (value === 0) return '0';
  if (typeof value === 'number' && Number.isNaN(value)) return 'NaN';
  if (!value) return '';

  const stringValue =
    value instanceof Date
      ? value.toString()
      : typeof value === 'object' && !Array.isArray(value)
        ? JSON.stringify(value)
        : String(value).trim();

  return lowerCase ? stringValue.toLowerCase() : stringValue;
}

/**
 * Appends a single path segment to a URL, normalizing slashes so there are no
 * empty or doubled segments while any meaningful trailing slash is preserved.
 *
 * @param path - The segment to append.
 * @param builtUrl - The URL built so far.
 * @param lowerCase - Lowercase the segment. Defaults to `false`.
 * @returns The URL with the segment appended.
 *
 * @example
 * ```ts
 * appendPath('users/123', 'https://api.example.com');
 * // → https://api.example.com/users/123
 * ```
 */
export function appendPath(path: string | number, builtUrl: string, lowerCase?: boolean): string {
  const url = builtUrl ?? '';
  const trimmedPath = String(path).trim();
  const pathString = lowerCase ? trimmedPath.toLowerCase() : trimmedPath;

  if (!pathString) return url;

  // A lone '/' only ensures a single trailing slash.
  if (pathString === '/') {
    return url.endsWith('/') ? url : `${url}/`;
  }

  // Collapse repeated slashes within the segment while keeping a trailing one.
  const hasTrailingSlash = pathString.endsWith('/');
  const cleanedPath = pathString
    .split('/')
    .filter((segment) => segment.length > 0)
    .join('/');
  const finalPath = hasTrailingSlash && cleanedPath ? `${cleanedPath}/` : cleanedPath;

  // Strip trailing slashes from the base before joining with a single '/'.
  const baseUrl = url.replace(/\/+$/, '');
  return finalPath ? `${baseUrl}/${finalPath}` : baseUrl;
}

/**
 * Builds a hash fragment (including the leading `#`) from a value.
 *
 * @param hash - The fragment text (without `#`).
 * @param lowerCase - Lowercase the fragment. Defaults to `false`.
 * @returns The hash fragment (e.g. `#section`), or `''` when empty.
 *
 * @example
 * ```ts
 * buildHash('Section-1', true); // → #section-1
 * ```
 */
export function buildHash(hash: string | number, lowerCase?: boolean): string {
  const trimmedHash = String(hash).trim();
  if (!trimmedHash) return '';

  const hashString = `#${trimmedHash}`;
  return lowerCase ? hashString.toLowerCase() : hashString;
}

/**
 * Splits an existing URL into its base, query parameters, and hash so new
 * options can be merged on top of what is already present.
 */
function parseUrl(url: string): { baseUrl: string; queryParams: IQueryParams; hash: string } {
  const queryParams: IQueryParams = {};

  // Split off the hash first; everything after the first '#' is the fragment.
  const hashIndex = url.indexOf('#');
  const hash = hashIndex === -1 ? '' : url.substring(hashIndex + 1);
  const withoutHash = hashIndex === -1 ? url : url.substring(0, hashIndex);

  // Then split off the query string at the first '?'.
  const queryIndex = withoutHash.indexOf('?');
  if (queryIndex === -1) {
    return { baseUrl: withoutHash, queryParams, hash };
  }

  const baseUrl = withoutHash.substring(0, queryIndex);
  const queryString = withoutHash.substring(queryIndex + 1);

  for (const pair of queryString.split('&')) {
    if (!pair) continue;
    // Split on the first '=' only so values may themselves contain '='.
    const eqIndex = pair.indexOf('=');
    const rawKey = eqIndex === -1 ? pair : pair.substring(0, eqIndex);
    const rawValue = eqIndex === -1 ? '' : pair.substring(eqIndex + 1);
    if (rawKey) {
      queryParams[decodeURIComponent(rawKey)] = rawValue ? decodeURIComponent(rawValue) : '';
    }
  }

  return { baseUrl, queryParams, hash };
}

/**
 * Builds a complete URL from a base URL and/or a set of options.
 *
 * Query parameters and hash already present on the base URL are preserved and
 * merged with the supplied options (options take precedence on conflicts).
 *
 * @param url - The base URL, or — when called with a single argument — the
 *   options object itself. `null`/`undefined` builds a relative URL.
 * @param options - The parts to add. See {@link IBuildUrlOptions}.
 * @returns The constructed URL string.
 *
 * @example
 * ```ts
 * // Base URL plus options
 * buildUrl('https://example.com', { path: 'about', hash: 'team' });
 * // → https://example.com/about#team
 *
 * // Options only (relative URL)
 * buildUrl({ path: 'api/v2', queryParams: { format: 'json' } });
 * // → /api/v2?format=json
 *
 * // Multiple path segments
 * buildUrl('https://example.com', { paths: ['about', '/my/', '/cat'] });
 * // → https://example.com/about/my/cat
 * ```
 */
function buildUrl(url?: string | null | IBuildUrlOptions, options?: IBuildUrlOptions): string {
  // Resolve the overloaded first argument into a base URL + options, capturing
  // any query/hash already present on a string URL so they can be merged.
  const hasStringUrl = typeof url === 'string';
  const parsed = hasStringUrl ? parseUrl(url) : null;
  const buildOptions = url !== null && typeof url === 'object' ? url : options;

  let result = parsed?.baseUrl ?? '';

  // 1. Path — the single `path` (applied first, for backward compatibility),
  //    then each segment of `paths`, in order.
  const segments: (string | number)[] = [];
  if (buildOptions?.path) segments.push(buildOptions.path);
  if (buildOptions?.paths) segments.push(...buildOptions.paths);
  for (const segment of segments) {
    result = appendPath(segment, result, buildOptions?.lowerCase);
  }

  // 2. Query string — merge existing params with the supplied ones.
  const allQueryParams = { ...parsed?.queryParams, ...buildOptions?.queryParams };
  if (Object.keys(allQueryParams).length > 0) {
    // Values are already decoded here, so skip the extra custom encoding pass.
    result += buildQueryString(allQueryParams, buildOptions?.lowerCase, buildOptions?.disableCSV, false);
  }

  // 3. Hash — a supplied hash wins, otherwise keep the URL's existing one.
  const finalHash = buildOptions?.hash !== undefined ? buildOptions.hash : (parsed?.hash ?? '');
  if (finalHash) {
    result += buildHash(finalHash, buildOptions?.lowerCase);
  }

  return result;
}

export { buildUrl };
export default buildUrl;
