export * from "./assertions"
export * from "./state"

/**
 * A primitive type
 */
export type Primitive = string | number | boolean | null | undefined

/**
 * A helper type to extract the return type of a method
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RegularMethod<T> = T extends (...args: unknown[]) => any ? ReturnType<T> : never

/**
 * A helper type to extract the return type of a getter method
 */
export type GetMethod<T> = ReturnType<RegularMethod<T>>

// wrap a string in single quotes
export type WrapString<
  Value,
  Delimiter extends string = "",
  WrapString extends boolean = true
> = Value extends string
  ? WrapString extends true
    ? `'${Value}'${Delimiter}`
    : `${Value}${Delimiter}`
  : Value extends Primitive
  ? `${Value}${Delimiter}`
  : never

// join an array of primitives into a string
export type JoinPrimitives<
  Primitives extends Primitive[],
  Delimiter extends string = " | ",
  WrapStrings extends boolean = true
> = Primitives extends []
  ? ""
  : Primitives extends [infer Last]
  ? WrapString<Last, "", WrapStrings>
  : Primitives extends [Primitive, ...infer Rest]
  ? Rest extends Primitive[]
    ? Primitives[0] extends infer Last
      ? `${WrapString<Last, Delimiter, WrapStrings>}${JoinPrimitives<Rest, Delimiter, WrapStrings>}`
      : never
    : never
  : never

/**
 * Join an array of primitives into a string
 * @param Tuple The tuple to join
 * @param Delimiter The delimiter to use between each primitive
 * @param OnEmpty The string to return if the array is not an array of primitives or is empty
 * @param WrapStrings Whether or not to wrap strings in single quotes
 * @returns The joined string or "N/A" if the array is not an array of primitives or is empty
 */
export type Join<
  Tuple,
  Delimiter extends string = " | ",
  OnEmpty extends string = "N/A",
  WrapStrings extends boolean = true
> = Tuple extends Primitive[] ? JoinPrimitives<Tuple, Delimiter, WrapStrings> : OnEmpty
