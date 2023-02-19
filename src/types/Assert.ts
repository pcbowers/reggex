import { Primitive } from "@types"

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
