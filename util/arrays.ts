export function partition<T>(
  array: T[],
  predicate: (item: T, index: number, array: T[]) => boolean
): [T[], T[]] {
  return array.reduce<[T[], T[]]>(
    (result, item, index, arr) => {
      if (predicate(item, index, arr)) {
        result[0].push(item);
      } else {
        result[1].push(item);
      }
      return result;
    },
    [[], []]
  );
}
