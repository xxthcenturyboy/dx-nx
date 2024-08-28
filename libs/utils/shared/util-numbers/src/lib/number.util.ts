export function isNumber(n?: string | number): boolean {
  return typeof n === 'number' && Number.isFinite(n) && !isNaN(n);
}

export function formatBytes(bytes: number, decimals = 2) {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function randomId(): number {
  const random = Math.random();
  const randomString = random.toString();
  return Number(randomString.slice(randomString.indexOf('.') + 1));
}
