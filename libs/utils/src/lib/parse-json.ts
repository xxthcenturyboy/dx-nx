export function parseJson<TData>(stringToParseToJson: string): TData | null {
  if (
    stringToParseToJson
    && typeof stringToParseToJson === 'string'
  ) {
    try {
      return JSON.parse(stringToParseToJson) as TData;
    } catch (err) {
      console.error(err);
      return null;
    }
  }

  return null;
};
