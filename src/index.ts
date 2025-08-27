export type QueryParamValue =
  | null
  | undefined
  | string
  | number
  | boolean
  | (string | number | boolean | null | undefined)[]
  | Date
  | object;
export type IQueryParams = Record<string, QueryParamValue>;

export type IDisableCsvType = 'array' | 'order_asc' | 'order_desc';

export interface IBuildUrlOptions {
  path?: string | number;
  lowerCase?: boolean;
  queryParams?: IQueryParams;
  disableCSV?: boolean | IDisableCsvType;
  hash?: string | number;
}

/**
 * Custom URI encoding that handles additional characters
 */
function customEncodeURIComponent(str: string): string {
  return encodeURIComponent(str).replace(/'/g, '%27').replace(/`/g, '%60');
}

/**
 * Builds a query string from parameters
 */
export function buildQueryString(
  queryParams: IQueryParams,
  lowerCase?: boolean,
  disableCSV?: boolean | IDisableCsvType,
  useCustomEncoding: boolean = true
): string {
  const queryParts: string[] = [];
  const entries = Object.entries(queryParams);

  for (const [key, value] of entries) {
    if (value === undefined) continue;

    // Apply lowerCase to keys if specified
    const processedKey = lowerCase ? key.toLowerCase() : key;
    const encodedKey = useCustomEncoding ? customEncodeURIComponent(processedKey) : encodeURIComponent(processedKey);

    if (Array.isArray(value)) {
      // Filter out undefined values from arrays
      const filteredArray = value.filter((item) => item !== undefined);

      // Skip empty arrays entirely
      if (filteredArray.length === 0) continue;

      if (disableCSV) {
        const arrayLength = filteredArray.length;
        let index = disableCSV === 'order_desc' ? arrayLength - 1 : 0;

        for (const item of filteredArray) {
          const encodedValue = useCustomEncoding
            ? customEncodeURIComponent(formatValue(item, lowerCase))
            : encodeURIComponent(formatValue(item, lowerCase));

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
      } else {
        const csvValue = filteredArray.map((item) => formatValue(item, lowerCase)).join(',');
        queryParts.push(
          `${encodedKey}=${useCustomEncoding ? customEncodeURIComponent(csvValue) : encodeURIComponent(csvValue)}`
        );
      }
    } else {
      const encodedValue = useCustomEncoding
        ? customEncodeURIComponent(formatValue(value, lowerCase))
        : encodeURIComponent(formatValue(value, lowerCase));
      queryParts.push(`${encodedKey}=${encodedValue}`);
    }
  }

  return queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
}

/**
 * Formats a single value for use in query string
 */
function formatValue(value: QueryParamValue, lowerCase?: boolean): string {
  if (value === null) return '';
  if (value === undefined) return '';
  if (typeof value === 'boolean') return value.toString();
  if (value === 0) return '0';

  // Handle NaN explicitly
  if (typeof value === 'number' && isNaN(value)) return 'NaN';

  if (!value) return '';

  // Handle Date objects
  if (value instanceof Date) {
    const stringValue = value.toString();
    return lowerCase ? stringValue.toLowerCase() : stringValue;
  }

  // Handle objects (stringify them)
  if (typeof value === 'object' && !Array.isArray(value)) {
    const stringValue = JSON.stringify(value);
    return lowerCase ? stringValue.toLowerCase() : stringValue;
  }

  const stringValue = String(value).trim();
  return lowerCase ? stringValue.toLowerCase() : stringValue;
}

/**
 * Appends a path segment to a URL
 */
export function appendPath(path: string | number, builtUrl: string, lowerCase?: boolean): string {
  const url = builtUrl ?? '';
  const trimmedPath = String(path).trim();
  const pathString = lowerCase ? trimmedPath.toLowerCase() : trimmedPath;

  // Handle empty path
  if (!pathString) return url;

  // Special case: if path is exactly '/', just add trailing slash
  if (pathString === '/') {
    return url.endsWith('/') ? url : `${url}/`;
  }

  // Clean up consecutive slashes in the path while preserving trailing slash
  const hasTrailingSlash = pathString.endsWith('/');
  const cleanedPath = pathString
    .split('/')
    .filter((segment) => segment.length > 0)
    .join('/');

  const finalPath = hasTrailingSlash && cleanedPath ? `${cleanedPath}/` : cleanedPath;

  // Remove all trailing slashes from URL
  const baseUrl = url.replace(/\/+$/, '');

  // Add path with proper slash handling
  return finalPath ? `${baseUrl}/${finalPath}` : baseUrl;
}

/**
 * Builds a hash fragment for a URL
 */
export function buildHash(hash: string | number, lowerCase?: boolean): string {
  const trimmedHash = String(hash).trim();
  if (!trimmedHash) return '';

  const hashString = `#${trimmedHash}`;
  return lowerCase ? hashString.toLowerCase() : hashString;
}

/**
 * Parses a URL into its components
 */
function parseUrl(url: string): { baseUrl: string; queryParams: IQueryParams; hash: string } {
  const hashIndex = url.indexOf('#');
  const queryIndex = url.indexOf('?');

  let baseUrl = url;
  const queryParams: IQueryParams = {};
  let hash = '';

  // Extract hash
  if (hashIndex !== -1) {
    hash = url.substring(hashIndex + 1);
    baseUrl = url.substring(0, hashIndex);
  }

  // Extract query parameters
  const workingUrl = hashIndex !== -1 ? url.substring(0, hashIndex) : url;
  const workingQueryIndex = workingUrl.indexOf('?');

  if (workingQueryIndex !== -1) {
    const queryString = workingUrl.substring(workingQueryIndex + 1);
    baseUrl = workingUrl.substring(0, workingQueryIndex);

    // Parse existing query parameters
    if (queryString) {
      const pairs = queryString.split('&');
      for (const pair of pairs) {
        const [key, value] = pair.split('=');
        if (key) {
          queryParams[decodeURIComponent(key)] = value ? decodeURIComponent(value) : '';
        }
      }
    }
  }

  return { baseUrl, queryParams, hash };
}

/**
 * Builds a complete URL from components
 * @param url - Base URL or options object
 * @param options - URL building options
 * @returns The constructed URL string
 */
function buildUrl(url?: string | null | IBuildUrlOptions, options?: IBuildUrlOptions): string {
  let baseUrl: string;
  let buildOptions: IBuildUrlOptions | undefined;
  let existingQueryParams: IQueryParams = {};
  let existingHash = '';

  // Handle different input patterns
  if (url === null || url === undefined) {
    baseUrl = '';
    buildOptions = options;
  } else if (typeof url === 'object') {
    baseUrl = '';
    buildOptions = url;
  } else {
    // Parse existing URL components
    const parsed = parseUrl(url);
    baseUrl = parsed.baseUrl;
    existingQueryParams = parsed.queryParams;
    existingHash = parsed.hash;
    buildOptions = options;
  }

  // Apply transformations in order
  let result = baseUrl;

  if (buildOptions?.path) {
    result = appendPath(buildOptions.path, result, buildOptions.lowerCase);
  }

  // Merge existing and new query parameters
  const allQueryParams = { ...existingQueryParams, ...(buildOptions?.queryParams || {}) };
  if (Object.keys(allQueryParams).length > 0) {
    const queryString = buildQueryString(
      allQueryParams,
      buildOptions?.lowerCase,
      buildOptions?.disableCSV,
      false // Don't use custom encoding when called from buildUrl
    );
    result += queryString;
  }

  // Use new hash if provided, otherwise keep existing
  const finalHash = buildOptions?.hash !== undefined ? buildOptions.hash : existingHash;
  if (finalHash) {
    result += buildHash(finalHash, buildOptions?.lowerCase);
  }

  return result;
}

export { buildUrl };
export default buildUrl;
