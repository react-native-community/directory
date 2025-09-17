export function parseQueryParams(params: Partial<Record<string, string | string[]>>) {
  return Object.fromEntries(
    Object.entries(params).map(([key, val]) => [key, Array.isArray(val) ? val[0] : val])
  );
}
