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

type UnionToIntersection<U> = (U extends unknown ? (arg: U) => any : never) extends (
  arg: infer I
) => 0
  ? I
  : never

type LastInUnion<U> = UnionToIntersection<U extends unknown ? (x: U) => any : never> extends (
  x: infer L
) => 0
  ? L
  : never

type UnionToTuple<T, Last = LastInUnion<T>> = [T] extends [never]
  ? []
  : [Last, ...UnionToTuple<Exclude<T, Last>>]

type StrNumBoolTuple<T> = T extends (string | number | boolean)[] ? T : never

/**
 * Join a union of primitive types (strings, numbers, or booleans) into a string
 */
export type JoinUnion<Union, Delimiter extends string = " | "> = Join<
  StrNumBoolTuple<UnionToTuple<Union>>,
  Delimiter
>
