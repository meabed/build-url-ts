/**
 * A function that builds a URL based on the arguments it's given
 * @param  {String} url     The first part of the URL e.g. `http://example.com`
 * @param  {Object} options A hash of options e.g. `{ path: '/about', hash: '#contact', queryParams: {}}`
 * @return {String}         The complete URL e.g. `http://example.com/about?foo=bar#contact`
 */
var buildUrl = function (url, options) {
  var builtUrl = url;
  var queryString = [];
  var key;

  if (options) {
    if (options.path) {
      builtUrl += '/' + options.path;
    }

    if (options.queryParams) {
      for (key in options.queryParams) {
        if (options.queryParams.hasOwnProperty(key)) {
          queryString.push(key + '=' + options.queryParams[key]);
        }
      }
      builtUrl += '?' + queryString.join('&');
    }

    if (options.hash) {
      builtUrl += '#' + options.hash;
    }
  }

  return builtUrl;
};

module.exports = buildUrl;
