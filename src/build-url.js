;(function () {
  'use strict';

  var root = this;
  var previousBuildUrl = root.buildUrl;

  var encodedParam = function (param) {
    return param === null ? '' : encodeURIComponent(String(param).trim());
  };

  var buildUrl = function (url, options) {
    var queryString = [];
    var key;
    var builtUrl;
    var caseChange; 
    
    if (options && options.lowerCase) {
        caseChange = !!options.lowerCase;
    } else {
        caseChange = false;
    }

    if (url === null) {
      builtUrl = '';
    } else if (typeof(url) === 'object') {
      builtUrl = '';
      options = url;
    } else {
      builtUrl = url;
    }

    if (options) {
      if (options.path) {
        if(builtUrl && builtUrl[builtUrl.length - 1] === '/') {
          builtUrl = builtUrl.slice(0, -1);
        } 

        var localVar = String(options.path).trim(); 
        if (caseChange) {
          localVar = localVar.toLowerCase();
        }
        if (localVar.indexOf('/') === 0) {
            builtUrl += localVar;
        } else {
          builtUrl += '/' + localVar;
        }
      }

      if (options.queryParams) {
        for (key in options.queryParams) {
          if (options.queryParams.hasOwnProperty(key) && options.queryParams[key] !== void 0) {
            var param;
            if (options.disableCSV && Array.isArray(options.queryParams[key]) && options.queryParams[key].length) {
              for(var i = 0; i < options.queryParams[key].length; i++) {
                param = options.queryParams[key][i];
                queryString.push(key + '=' + encodedParam(param));
              }
            } else {              
              if (caseChange) {
                param = options.queryParams[key].toLowerCase();
              }
              else {
                param = options.queryParams[key];
              }
              queryString.push(key + '=' + encodedParam(param));
            }
          }
        }
        builtUrl += '?' + queryString.join('&');
      }

      if (options.hash) {
        if(caseChange)
            builtUrl += '#' + String(options.hash).trim().toLowerCase();
        else
            builtUrl += '#' + String(options.hash).trim();
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
