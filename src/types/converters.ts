import { Primitive } from "@types"

/**
 * Join an array of primitives into a string
 * @param Primitives The array of primitives to join
 * @param Delimiter The delimiter to use between each primitive
 * @returns The joined string
 */
type JoinPrimitives<
  Primitives extends Primitive[],
  Delimiter extends string = " | "
> = Primitives extends []
  ? ""
  : Primitives extends [infer Last]
  ? Last extends string
    ? `'${Last}'`
    : Last extends Primitive
    ? `${Last}`
    : never
  : Primitives extends [Primitive, ...infer Rest]
  ? Rest extends Primitive[]
    ? Primitives[0] extends infer Last
      ? Last extends string
        ? `'${Last}'${Delimiter}${JoinPrimitives<Rest, Delimiter>}`
        : Last extends Primitive
        ? `${Last}${Delimiter}${JoinPrimitives<Rest, Delimiter>}`
        : never
      : never
    : never
  : never

/**
 * Join an array of primitives into a string
 * @param Tuple The tuple to join
 * @param Delimiter The delimiter to use between each primitive
 * @returns The joined string or "N/A" if the array is not an array of primitives or is empty
 */
export type Join<Tuple, Delimiter extends string = " | "> = Tuple extends [
  infer First,
  ...infer Rest
]
  ? First extends Primitive
    ? Rest extends Primitive[]
      ? JoinPrimitives<[First, ...Rest], Delimiter>
      : "N/A"
    : "N/A"
  : "N/A"

/**
 * Convert a tuple to an intersection
 * @param T The type to intersect with
 * @param U The tuple to convert
 * @returns The intersection of T and U
 */
export type TupleToIntersection<T, U extends any[]> = U extends [infer First, ...infer Rest]
  ? T & TupleToIntersection<First, Rest>
  : T

/**
 * Replace all instances of a search string with a replacement string
 * @param Input The string to search
 * @param Replacement The string to replace the search string with
 * @param Search The string to search for
 * @returns The string with all instances of the search string replaced with the replacement string
 */
export type Replace<
  Input,
  Replacement,
  Search extends Primitive = "$"
> = Input extends `${infer Head}${Search}${infer Tail}`
  ? Replacement extends Primitive
    ? `${Head}${Replacement}${Replace<Tail, Replacement, Search>}`
    : Input
  : Input

/**
 * Wrap a primitive in a prefix and suffix
 * @param Input The primitive to wrap
 * @param Prefix The prefix to wrap the primitive with
 * @param Suffix The suffix to wrap the primitive with
 * @returns The wrapped primitive
 */
export type Wrap<
  Input,
  Prefix extends Primitive,
  Suffix extends Primitive
> = Input extends Primitive ? `${Prefix}${Input}${Suffix}` : Input extends Primitive ? Input : never

/**
 * Wrap all instances of a search string in a prefix and suffix
 * @param Input The string to search
 * @param Prefix The prefix to wrap the search string with
 * @param Suffix The suffix to wrap the search string with
 * @param PreSearch The string to search for before the search string
 * @param PostSearch The string to search for after the search string
 * @returns The string with all instances of the search string wrapped with the prefix and suffix
 */
export type WrapSearch<
  Input,
  Prefix extends Primitive,
  Suffix extends Primitive,
  PreSearch extends Primitive,
  PostSearch extends Primitive
> = Input extends `${infer Head}${PreSearch}${infer Middle}${PostSearch}${infer Tail}`
  ? `${Head}${PreSearch}${Prefix}${Middle}${Suffix}${PostSearch}${WrapSearch<
      Tail,
      Prefix,
      Suffix,
      PreSearch,
      PostSearch
    >}`
  : Input extends Primitive
  ? Input
  : never

/**
 * Map over a tuple and wrap each primitive in a prefix and suffix
 * @param T The tuple to map over
 * @param Prefix The prefix to wrap each primitive with
 * @param Suffix The suffix to wrap each primitive with
 * @returns The mapped tuple
 */
export type MapWrap<T, Prefix extends Primitive, Suffix extends Primitive> = T extends [
  infer First,
  ...infer Rest
]
  ? [Wrap<First, Prefix, Suffix>, ...MapWrap<Rest, Prefix, Suffix>]
  : []

/**
 * Map over a tuple and wrap all instances of a search string in a prefix and suffix
 * @param T The tuple to map over
 * @param Prefix The prefix to wrap the search string with
 * @param Suffix The suffix to wrap the search string with
 * @param PreSearch The string to search for before the search string
 * @param PostSearch The string to search for after the search string
 * @returns The mapped tuple
 */
export type MapWrapSearch<
  T,
  Prefix extends Primitive,
  Suffix extends Primitive,
  PreSearch extends Primitive,
  PostSearch extends Primitive
> = T extends [infer First, ...infer Rest]
  ? [
      WrapSearch<First, Prefix, Suffix, PreSearch, PostSearch>,
      ...MapWrapSearch<Rest, Prefix, Suffix, PreSearch, PostSearch>
    ]
  : []
