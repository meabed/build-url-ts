export type IQueryParams = Record<string,
  null | undefined | string | number | string[] | (string | number)[]>;

export function buildQueryString(
  queryParams: IQueryParams,
  lowerCase?: boolean,
  disableCSV?: boolean
) {
  const queryString: string[] = [];

  for (let key in queryParams) {
    if (
      Object.prototype.hasOwnProperty.call(queryParams, key) &&
      queryParams[key] !== void 0
    ) {
      let param;

      if (
        disableCSV &&
        Array.isArray(queryParams[key]) &&
        (queryParams[key] as []).length
      ) {
        (queryParams[key] as []).forEach((v) => {
          param = v !== 0 ? v || "" : 0;
          queryString.push(
            `${key}=${encodeURIComponent(String(param).trim())}`
          );
        });
      } else {
        if (lowerCase) {
          param = String(queryParams[key]).toLowerCase() || "";
        } else {
          param = queryParams[key] !== 0 ? queryParams[key] || "" : 0;
        }

        queryString.push(`${key}=${encodeURIComponent(String(param).trim())}`);
      }
    }
  }

  return `?${queryString.join("&")}`;
}


export function appendPath(
  path: string | number,
  builtUrl: string,
  lowerCase?: boolean
) {
  if (builtUrl[builtUrl.length - 1] === "/") {
    builtUrl = builtUrl.slice(0, -1);
  }

  let pathString = String(path).trim();

  if (lowerCase) {
    pathString = pathString.toLowerCase();
  }

  if (pathString.indexOf("/") === 0) {
    builtUrl += pathString;
  } else {
    builtUrl += `/${pathString}`;
  }

  return builtUrl;
}

export function buildHash(hash: string | number, lowerCase?: boolean): string {
  let hashString = `#${String(hash).trim()}`;
  return lowerCase ? hashString.toLowerCase() : hashString;
}

interface IUrlOptions {
  path?: string | number;
  lowerCase?: boolean;
  queryParams?: IQueryParams;
  disableCSV?: boolean;
  hash?: string | number;
}

function buildUrl(url?: string | null | IUrlOptions, options?: IUrlOptions) {
  let builtUrl;

  if (url === null) {
    builtUrl = "";
  } else if (typeof url === "object") {
    builtUrl = "";
    options = url;
  } else {
    builtUrl = url;
  }

  if (options?.path) {
    builtUrl = appendPath(options.path, builtUrl as string, options.lowerCase);
  }

  if (options?.queryParams) {
    builtUrl += buildQueryString(
      options.queryParams,
      options.lowerCase,
      options.disableCSV
    );
  }

  if (options?.hash) {
    builtUrl += buildHash(options.hash, options.lowerCase);
  }

  return builtUrl;
}

export default buildUrl;
