import { Add, Primitive, Subtract } from "@types"

/**
 * A unique symbol used to brand error types
 */
declare const brand: unique symbol

/**
 * Define a unique error type that is unassignable to any other type
 * @param Token The unique token to brand the error type with
 * @returns The branded error type
 */
declare interface Err<Token> {
  readonly [brand]: Token
}

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
 * Assert that a type is true, otherwise throw an error
 * @param T The type to assert
 * @param ErrorMessage The error message to throw if the assertion fails
 * @returns An empty object if the assertion is true, otherwise an error type
 */
export type Assert<T, ErrorMessage = "ERROR"> = T extends true ? {} : Err<Replace<ErrorMessage, T>>

/**
 * Check if a string contains a substring a certain number of times
 * @param Str The string to check
 * @param StrToCheck The substring to check for
 * @param Times The number of times the substring should appear in the string
 * @param CurCount The current number of times the substring has appeared in the string
 * @returns Whether the string contains the substring a certain number of times
 */
export type Contains<
  Str extends Primitive,
  StrToCheck extends Primitive,
  Times extends number = 1,
  CurCount extends number = 0
> = Str extends `${StrToCheck}${infer Rest}`
  ? CurCount extends Subtract<Times, 1>
    ? true
    : Rest extends ""
    ? false
    : Contains<Rest, StrToCheck, Times, Add<CurCount, 1>>
  : Str extends `${string}${infer Rest}`
  ? Rest extends ""
    ? false
    : Contains<Rest, StrToCheck, Times, CurCount>
  : Str extends StrToCheck
  ? true
  : false

/**
 * Check if a string starts with another string
 * @param Str The string to check
 * @param StrToCheck The string to check for
 * @returns Whether the string starts with the other string
 */
export type StartsWith<
  Str extends Primitive,
  StrToCheck extends Primitive
> = Str extends `${StrToCheck}${any}` ? true : false

/**
 * Check if a string is of a certain length
 * @param T The string to check
 * @param DesiredLength The desired length of the string
 * @param DesiredType The desired type of the string
 * @param CurCount The current length of the string
 * @returns Whether the string is of the desired length and type
 */
export type OfLength<
  T extends string,
  DesiredLength extends number = 1,
  DesiredType extends string | number = string | number,
  CurCount extends number = 0
> = T extends `${DesiredType}${infer Rest}`
  ? Rest extends ""
    ? CurCount extends Subtract<DesiredLength, 1>
      ? true
      : number extends DesiredLength
      ? true
      : false
    : OfLength<Rest, DesiredLength, DesiredType, Add<CurCount, 1>>
  : false

/**
 * Get the overlap between two arrays of primitives
 * @param First The first array of primitives
 * @param Second The second array of primitives
 * @returns The overlap between the two arrays
 */
export type Overlaps<First extends Primitive[], Second extends Primitive[]> = First extends [
  infer Value,
  ...infer Rest
]
  ? Value extends Second[number]
    ? Rest extends Primitive[]
      ? [Value, ...Overlaps<Rest, Second>]
      : [Value]
    : Rest extends Primitive[]
    ? Overlaps<Rest, Second>
    : []
  : []

/**
 * Check if two arrays of primitives have no overlap
 * @param First The first array of primitives
 * @param Second The second array of primitives
 * @returns True if the arrays have no overlap, otherwise an array of the overlapping primitives
 */
export type NoOverlap<First extends Primitive[], Second extends Primitive[]> = Overlaps<
  [...First],
  [...Second]
> extends infer R
  ? R extends []
    ? true
    : R
  : true
