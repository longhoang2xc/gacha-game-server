export const getQueryURL = (rootURL: string, params: any) => {
  const esc = encodeURIComponent;
  for (var propName in params) {
    if (params[propName] === null || params[propName] === undefined) {
      delete params[propName];
    }
  }
  const query = Object.keys(params)
    .map(k => {
      if (Array.isArray(params[k])) {
        let queryStringResult = "";

        params[k]?.forEach((paramValue: any, paramIndex: number) => {
          Object.keys(paramValue).forEach((keyParamValue: any) => {
            queryStringResult +=
              esc(k) +
              `[${paramIndex}]` +
              "." +
              keyParamValue +
              "=" +
              esc(paramValue[keyParamValue]) +
              "&";
          });
        });
        return queryStringResult;
      } else {
        return esc(k) + "=" + esc(params[k]);
      }
    })
    .join("&");
  return `${rootURL}?${query}`;
};
