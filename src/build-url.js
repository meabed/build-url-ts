;(function () {
  'use strict';

  var root = this;
  var previousBuildUrl = root.buildUrl;

  var buildUrl = function (url, options) {
    var queryString = [];
    var key;
    var builtUrl;

    if (url === null) {
      builtUrl = '';
    } else if (typeof(url) === 'object') {
      builtUrl = '';
      options = url;
    } else {
      builtUrl = url;
    }

    if(builtUrl && builtUrl[builtUrl.length - 1] === '/'){
      builtUrl = builtUrl.slice(0, -1);
    }

    if (options) {
      if (options.path) {
        if (options.path.indexOf('/') === 0) {
          builtUrl += options.path;
        } else {
          builtUrl += '/' + options.path;
        }
      }

      if (options.queryParams) {
        for (key in options.queryParams) {
          if (options.queryParams.hasOwnProperty(key)
              && options.queryParams[key] !== void 0) {
            var encodedParam = encodeURIComponent(options.queryParams[key])
            queryString.push(key + '=' + encodedParam);
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

  buildUrl.noConflict = function () {
    root.buildUrl = previousBuildUrl;
    return buildUrl;
  };

  if (typeof(exports) !== 'undefined') {
    if (typeof(module) !== 'undefined' && module.exports) {
      exports = module.exports = buildUrl;
    }
    exports.buildUrl = buildUrl;
  } else {
    root.buildUrl = buildUrl;
  }
}).call(this);
