export * from "./arithmetic"
export * from "./assertions"
export * from "./converters"
export * from "./state"

/**
 * A primitive type
 */
export type Primitive = string | number | boolean | null | undefined

// prettier-ignore
/**
 * A hex character
 */
export type HexChar = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | "a" | "b" | "c" | "d" | "e" | "f" | "A" | "B" | "C" | "D" | "E" | "F"

// prettier-ignore
/**
 * A lower case letter
 */
export type LowerCaseLetter = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"

// prettier-ignore
/**
 * An upper case letter
 */
export type UpperCaseLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z"

/**
 * A letter (upper or lower case)
 */
export type Letter = LowerCaseLetter | UpperCaseLetter

/**
 * A type that helps unwrap deeply nested types
 */
export type Expand<T> = T extends infer O
  ? O extends Record<any, any>
    ? { [K in keyof O]: O[K] }
    : O
  : never

/**
 * A helper type to extract the return type of a method
 */
export type RegularMethod<T> = T extends (...args: any[]) => any ? ReturnType<T> : never

/**
 * A helper type to extract the return type of a getter method
 */
export type GetMethod<T> = ReturnType<RegularMethod<T>>
