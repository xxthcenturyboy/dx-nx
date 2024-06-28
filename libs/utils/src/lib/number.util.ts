export function isNumber(n?: string | number): boolean {
  return typeof n === 'number' && Number.isFinite(n) && !isNaN(n);
};

export function randomId(): number {
  const random = Math.random();
  const randomString = random.toString();
  return Number(randomString.slice(randomString.indexOf('.') + 1));
}
