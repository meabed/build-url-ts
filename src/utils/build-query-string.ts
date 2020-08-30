export type IQueryParams = Record<
  string,
  null | undefined | string | number | string[] | (string | number)[]
>;

function buildQueryString(
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

export default buildQueryString;
