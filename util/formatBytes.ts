const MUL = 1024;
const SUFFIXES = ['B', 'KiB', 'MiB'];

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) {
    return '0 B';
  }

  const dm = Math.max(0, decimals);
  const sizeRange = Math.floor(Math.log(bytes) / Math.log(MUL));
  const value = bytes / Math.pow(MUL, sizeRange);
  const formatted = parseFloat(value.toFixed(dm));

  return `${formatted} ${SUFFIXES[sizeRange]}`;
}
