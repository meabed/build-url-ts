type IQueryParams = Record<
  string,
  string | number | string[] | (string | number)[]
>;

function buildQueryString(
  queryParams: IQueryParams,
  lowerCase?: boolean,
  disableCSV?: boolean
) {
  const queryString = [];

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
        for (let i = 0; i < (queryParams[key] as []).length; i++) {
          param = queryParams[key][i] || "";
          queryString.push(
            `${key}=${encodeURIComponent(String(param).trim())}`
          );
        }
      } else {
        if (lowerCase) {
          param = String(queryParams[key]).toLowerCase() || "";
        } else {
          param = queryParams[key] || "";
        }

        queryString.push(`${key}=${encodeURIComponent(String(param).trim())}`);
      }
    }
  }

  return `?${queryString.join("&")}`;
}

export default buildQueryString;
