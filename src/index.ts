export type IQueryParams = Record<string, null | undefined | string | number | string[] | (string | number)[]>;
export enum IDisableCsvType { SIMPLE = 1, ARRAY, ORDER_ASC, ORDER_DESC }

export function buildQueryString(queryParams: IQueryParams, lowerCase?: boolean, disableCSV?: boolean | IDisableCsvType) {
  const queryString: string[] = [];

  for (const key in queryParams) {
    if (Object.prototype.hasOwnProperty.call(queryParams, key) && queryParams[key] !== void 0) {
      let param;

      if (Array.isArray(queryParams[key]) && (queryParams[key] as []).length) {
        if (disableCSV) {
          let i = (disableCSV as IDisableCsvType) === IDisableCsvType.ORDER_DESC ? (queryParams[key] as []).length - 1 : 0;
          (queryParams[key] as []).forEach((v) => {
            param = v !== 0 ? v || '' : 0;
            switch (disableCSV as IDisableCsvType) {
              case IDisableCsvType.ARRAY:
                queryString.push(`${key}[]=${encodeURIComponent(String(param).trim())}`);
                break;
              case IDisableCsvType.ORDER_ASC:
                queryString.push(`${key}[${i++}]=${encodeURIComponent(String(param).trim())}`);
                break;
              case IDisableCsvType.ORDER_DESC:
                queryString.push(`${key}[${i--}]=${encodeURIComponent(String(param).trim())}`);
                break;
              default:
                queryString.push(`${key}=${encodeURIComponent(String(param).trim())}`);
                break;
            }
          });
        } else {
          param = (queryParams[key] as []).map((v) => {
            const value = v !== 0 ? v || '' : 0;
            return encodeURIComponent(String(value).trim());
          });

          queryString.push(`${key}=${String(param)}`);
        }
      } else {
        if (lowerCase) {
          param = String(queryParams[key]).toLowerCase() || '';
        } else {
          param = queryParams[key] !== 0 ? queryParams[key] || '' : 0;
        }

        queryString.push(`${key}=${encodeURIComponent(String(param).trim())}`);
      }
    }
  }

  return `?${queryString.join('&')}`;
}

export function appendPath(path: string | number, builtUrl: string, lowerCase?: boolean) {
  if (typeof builtUrl === 'undefined') {
    builtUrl = '';
  }

  if (builtUrl[builtUrl.length - 1] === '/') {
    builtUrl = builtUrl.slice(0, -1);
  }

  let pathString = String(path).trim();

  if (lowerCase) {
    pathString = pathString.toLowerCase();
  }

  if (pathString.indexOf('/') === 0) {
    builtUrl += pathString;
  } else {
    builtUrl += `/${pathString}`;
  }

  return builtUrl;
}

export function buildHash(hash: string | number, lowerCase?: boolean): string {
  const hashString = `#${String(hash).trim()}`;
  return lowerCase ? hashString.toLowerCase() : hashString;
}

interface IUrlOptions {
  path?: string | number;
  lowerCase?: boolean;
  queryParams?: IQueryParams;
  disableCSV?: boolean | IDisableCsvType;
  hash?: string | number;
}

function buildUrl(url?: string | null | IUrlOptions, options?: IUrlOptions): string {
  let builtUrl;

  if (url === null) {
    builtUrl = '';
  } else if (typeof url === 'object') {
    builtUrl = '';
    options = url;
  } else {
    builtUrl = url;
  }

  if (options?.path) {
    builtUrl = appendPath(options.path, builtUrl as string, options.lowerCase);
  }

  if (options?.queryParams) {
    builtUrl += buildQueryString(options.queryParams, options.lowerCase, options.disableCSV);
  }

  if (options?.hash) {
    builtUrl += buildHash(options.hash, options.lowerCase);
  }

  return builtUrl;
}

export { buildUrl };
export default buildUrl;
