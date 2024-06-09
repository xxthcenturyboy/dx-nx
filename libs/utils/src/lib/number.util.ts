export function isNumber(n?: string | number): boolean {
  return typeof n === 'number' && Number.isFinite(n) && !isNaN(n);
};
