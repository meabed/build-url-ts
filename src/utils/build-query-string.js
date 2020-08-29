function buildQueryString(queryParams, lowerCase, disableCSV) {
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
        queryParams[key].length
      ) {
        for (let i = 0; i < queryParams[key].length; i++) {
          param = queryParams[key][i] || "";
          queryString.push(
            `${key}=${encodeURIComponent(String(param).trim())}`
          );
        }
      } else {
        if (lowerCase) {
          param = queryParams[key].toLowerCase() || "";
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
