export function isNumber(n?: string | number): boolean {
  return typeof n === 'number' && Number.isFinite(n) && !isNaN(n);
};

export function randomId(): number {
  const random = Math.random();
  const randomString = random.toString();
  const numZeros = randomString.length - 2;
  let multiplier = '1';
  for (let i = 0; i < numZeros; i += 1) {
    multiplier += '0';
  }
  return random * Number(multiplier);
}
