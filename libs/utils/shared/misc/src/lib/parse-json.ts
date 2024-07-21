export function parseJson<TData>(stringToParseToJson: string): TData | null {
  if (stringToParseToJson && typeof stringToParseToJson === 'string') {
    try {
      return JSON.parse(stringToParseToJson) as TData;
    } catch (err) {
      false && console.log(err);
    }
  }

  return stringToParseToJson as TData;
}
