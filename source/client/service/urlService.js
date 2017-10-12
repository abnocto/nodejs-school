const stubRegexp = /\{([^}]*)}/;

/**
 * Replaces URL pattern's path parameter stubs ( '{...}' ) in given URL pattern with the given string parameters
 * ex: /api/entity/{entityIdA}/?target={entityIdB} -> /api/entity/2/?target=3 with given 2,3 values
 * @param { String } urlPattern
 * @param { Array } params
 * @returns { String } url
 */
export function completeURL(urlPattern, ...params) {
  let url = urlPattern;
  params.forEach((param) => {
    url = url.replace(stubRegexp, param);
  });
  return url;
}
