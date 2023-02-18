/**
 * Join a tuple of primitive types (strings, numbers, or booleans) into a string
 */
export type Join<
  Strings extends (string | number | boolean)[],
  Delimiter extends string = " | "
> = Strings extends []
  ? ""
  : Strings extends [infer Last]
  ? Last extends string
    ? `'${Last}'`
    : Last extends number | boolean
    ? `${Last}`
    : never
  : Strings extends [string | number | boolean, ...infer Rest]
  ? Rest extends (string | number | boolean)[]
    ? Strings[0] extends infer Last
      ? Last extends string
        ? `'${Last}'${Delimiter}${Join<Rest, Delimiter>}`
        : Last extends number | boolean
        ? `${Last}${Delimiter}${Join<Rest, Delimiter>}`
        : never
      : never
    : never
  : never
