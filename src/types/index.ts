export type { Add, Length, Subtract } from "./arithmetic"
export type { Assert } from "./Assert"
export type { Contains } from "./Contains"
export type { Join, JoinUnion } from "./Join"
export type { OfLength } from "./OfLength"
export type { Overlaps } from "./Overlaps"
export type { State, StateMerger, GroupIndices } from "./State"

// prettier-ignore
export type HexChar = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | "a" | "b" | "c" | "d" | "e" | "f" | "A" | "B" | "C" | "D" | "E" | "F"

// prettier-ignore
export type LowerCaseLetter = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"

// prettier-ignore
export type UpperCaseLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z"

export type Letter = LowerCaseLetter | UpperCaseLetter

export type Expand<T> = T extends infer O ? { [K in keyof O]: O[K] } : never
