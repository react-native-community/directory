export function pluralize(text: string, count: number) {
  return count > 1 || count === 0 ? `${text}s` : text;
}

export function isEmptyOrNull(text?: string) {
  return !text || !text.trim();
}
