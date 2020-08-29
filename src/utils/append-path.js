function appendPath(path, builtUrl, lowerCase) {
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

export default appendPath;
