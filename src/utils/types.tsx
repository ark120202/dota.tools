export const isNotNil = <T,>(value: T): value is NonNullable<T> => value != null;

export const intersperse = <T, U>(values: readonly T[], separator: U): (T | U)[] =>
  values.flatMap((value, index) => (index === 0 ? [value] : [separator, value]));
