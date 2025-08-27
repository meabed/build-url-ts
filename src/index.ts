export type QueryParamValue = null | undefined | string | number | boolean | (string | number | boolean)[];
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
 * Builds a query string from parameters
 */
export function buildQueryString(
  queryParams: IQueryParams,
  lowerCase?: boolean,
  disableCSV?: boolean | IDisableCsvType
): string {
  const queryParts: string[] = [];
  const entries = Object.entries(queryParams);

  for (const [key, value] of entries) {
    if (value === undefined) continue;

    if (Array.isArray(value) && value.length > 0) {
      if (disableCSV) {
        const arrayLength = value.length;
        let index = disableCSV === 'order_desc' ? arrayLength - 1 : 0;
        
        for (const item of value) {
          const encodedValue = encodeURIComponent(formatValue(item, lowerCase));
          
          switch (disableCSV) {
            case 'array':
              queryParts.push(`${key}[]=${encodedValue}`);
              break;
            case 'order_asc':
              queryParts.push(`${key}[${index++}]=${encodedValue}`);
              break;
            case 'order_desc':
              queryParts.push(`${key}[${index--}]=${encodedValue}`);
              break;
            default:
              queryParts.push(`${key}=${encodedValue}`);
              break;
          }
        }
      } else {
        const csvValue = value
          .map((item) => formatValue(item, lowerCase))
          .join(',');
        queryParts.push(`${key}=${encodeURIComponent(csvValue)}`);
      }
    } else {
      const encodedValue = encodeURIComponent(formatValue(value, lowerCase));
      queryParts.push(`${key}=${encodedValue}`);
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
  if (!value) return '';
  
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
  
  // Remove trailing slash from URL if present
  const baseUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  
  // Add path with proper slash handling
  return pathString.startsWith('/') ? `${baseUrl}${pathString}` : `${baseUrl}/${pathString}`;
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
 * Builds a complete URL from components
 * @param url - Base URL or options object
 * @param options - URL building options
 * @returns The constructed URL string
 */
function buildUrl(url?: string | null | IBuildUrlOptions, options?: IBuildUrlOptions): string {
  let baseUrl: string;
  let buildOptions: IBuildUrlOptions | undefined;

  // Handle different input patterns
  if (url === null || url === undefined) {
    baseUrl = '';
    buildOptions = options;
  } else if (typeof url === 'object') {
    baseUrl = '';
    buildOptions = url;
  } else {
    baseUrl = url;
    buildOptions = options;
  }

  // Apply transformations in order
  let result = baseUrl;

  if (buildOptions?.path) {
    result = appendPath(buildOptions.path, result, buildOptions.lowerCase);
  }

  if (buildOptions?.queryParams && Object.keys(buildOptions.queryParams).length > 0) {
    const queryString = buildQueryString(
      buildOptions.queryParams,
      buildOptions.lowerCase,
      buildOptions.disableCSV
    );
    result += queryString;
  }

  if (buildOptions?.hash) {
    result += buildHash(buildOptions.hash, buildOptions.lowerCase);
  }

  return result;
}

export { buildUrl };
export default buildUrl;
