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
