import { appendPath, buildHash, buildQueryString } from "./utils";

function buildUrl(url, options = {}) {
  let builtUrl;

  if (url === null) {
    builtUrl = "";
  } else if (typeof url === "object") {
    builtUrl = "";
    options = url;
  } else {
    builtUrl = url;
  }

  if (options.path) {
    builtUrl = appendPath(options.path, builtUrl, options.lowerCase);
  }

  if (options.queryParams) {
    builtUrl += buildQueryString(
      options.queryParams,
      options.lowerCase,
      options.disableCSV
    );
  }

  if (options.hash) {
    builtUrl += buildHash(options.hash, options.lowerCase);
  }

  return builtUrl;
}

export default buildUrl;
