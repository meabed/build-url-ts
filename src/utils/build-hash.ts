function buildHash(hash: string | number, lowerCase?: boolean): string {
  let hashString = `#${String(hash).trim()}`;
  return lowerCase ? hashString.toLowerCase() : hashString;
}

export default buildHash;
