function buildHash(hash, lowerCase) {
  let hashString = `#${String(hash).trim()}`;
  return lowerCase ? hashString.toLowerCase() : hashString;
}

export default buildHash;
