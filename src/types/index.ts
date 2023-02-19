export type { Add, Length, MapAdd, Subtract } from "./arithmetic"
export type { Assert } from "./Assert"
export type { Contains } from "./Contains"
export type { Join } from "./Join"
export type { OfLength } from "./OfLength"
export type { NoOverlap } from "./Overlaps"
export type { StartsWith } from "./StartsWith"
export type { GroupReferences, State, StateMerger } from "./State"

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
export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
