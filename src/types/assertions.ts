import { Join, Primitive } from "@types"

export type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9
export type HexChar = Digit | "a" | "b" | "c" | "d" | "e" | "f" | "A" | "B" | "C" | "D" | "E" | "F"
// prettier-ignore
export type LowerCaseLetter = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
// prettier-ignore
export type UpperCaseLetter = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z"
export type Letter = LowerCaseLetter | UpperCaseLetter
export type Alphanumeric = Letter | Digit

declare const brand: unique symbol

/**
 * An error type that cannot be instantiated
 * @param Token The token to use for the error
 */
export declare interface Err<Token> {
  readonly [brand]: Token
}

/**
 * Assert that a type is true
 * @param T The type to assert
 * @param ErrorMessage The error message to use if the assertion fails
 */
export type Assert<T, ErrorMessage = "ERROR"> = T extends true ? {} : Err<ErrorMessage>

/**
 * Assert that a type is false
 * @param T The type to assert
 * @param ErrorMessage The error message to use if the assertion fails
 */
export type AssertNot<T, ErrorMessage = "ERROR"> = T extends false ? {} : Err<ErrorMessage>

/**
 * Check that a string contains a substring
 * @param Value The string to check
 * @param SubString The substring to check for
 * @param Start The start of the string to check (optional)
 */
export type Contains<
  Value extends Primitive,
  SubString extends Primitive,
  Start extends Primitive = string
> = Value extends `${Start}${SubString}${string}` ? true : false

/**
 * Check that a string starts with a substring
 * @param Value The string to check
 * @param SubString The substring to check for
 */
export type StartsWith<Value extends Primitive, SubString extends Primitive> = Contains<
  Value,
  SubString,
  ""
>

/**
 * Check that a tuple overlaps with a list of values
 * @param Value The tuple to check
 * @param Values The values to check for
 */
export type Overlaps<Value extends Primitive[], Values extends Primitive> = Value extends [
  infer First,
  ...infer Rest
]
  ? First extends Values
    ? First
    : Rest extends Primitive[]
    ? Overlaps<Rest, Values>
    : false
  : false

/**
 * Check that a string is of a certain type
 * @param T The string to check
 * @param DesiredType The desired type of the string
 */
export type OfType<
  T extends Primitive,
  DesiredType extends Primitive = Primitive
> = T extends `${DesiredType}${infer Rest}`
  ? OfType<Rest, DesiredType>
  : T extends ""
  ? true
  : false

/**
 * Check that a string is of a certain length
 * @param T The string to check
 * @param DesiredLength The desired length of the string
 */
export type OfLength<
  T extends Primitive,
  DesiredLength extends number,
  Acc extends unknown[] = []
> = T extends `${string}${infer Rest}`
  ? OfLength<Rest, DesiredLength, [...Acc, unknown]>
  : Acc["length"] extends DesiredLength
  ? true
  : false

/**
 * Assert that a group name is valid
 * @param Name The name to check
 * @param Names The names to check against
 */
export type IsValidName<
  Name extends Primitive,
  Names extends Primitive[],
  Overlap extends Primitive = Overlaps<[Name], Names[number]>
> = Assert<StartsWith<Name, Letter>, `❌ The name '${Name}' must start with a letter`> &
  Assert<
    OfType<Name, Alphanumeric>,
    `❌ The name '${Name}' must only contain alphanumeric characters`
  > &
  AssertNot<
    Overlap,
    `❌ The name '${Overlap}' has already been used. Make sure none of the following names are duplicated: ${Join<Names>}`
  >

/**
 * Assert that an instance is valid
 * @param NewNames The names to check
 * @param Names The names to check against
 */
export type IsValidInstance<
  NewNames extends Primitive[],
  Names extends Primitive[],
  Overlap extends Primitive = Overlaps<NewNames, Names[number]>
> = AssertNot<
  Overlap,
  `❌ The name '${Overlap}' has already been used. Make sure none of the following names are duplicated: ${Join<Names>}`
>

/**
 * Assert that a hex code is valid
 * @param HexCode The hex code to check
 */
export type IsValidHexCode<HexCode extends Primitive> = Assert<
  OfLength<HexCode, 2 | 4>,
  `❌ The hex code '${HexCode}' must be a length of 2 or 4`
> &
  Assert<
    OfType<HexCode, HexChar>,
    `❌ The hex code '${HexCode}' must only contain valid hexidecimal digits`
  >

/**
 * Assert that a control character is valid
 * @param ControlChar The control character to check
 */
export type IsValidControlChar<ControlChar extends Primitive> = Assert<
  OfLength<ControlChar, 1>,
  `❌ The control character '${ControlChar}' must be a length of 1`
> &
  Assert<
    OfType<ControlChar, Letter>,
    `❌ The control character '${ControlChar}' can only be a letter from A-Z`
  >

/**
 * Assert that a unicode character is valid
 * @param UnicodeChar The unicode character to check
 */
export type IsValidUnicodeChar<UnicodeChar extends Primitive> = Assert<
  OfLength<UnicodeChar, 4 | 5>,
  `❌ The unicode character '${UnicodeChar}' must be a length of 4 or 5`
> &
  Assert<
    OfType<UnicodeChar, HexChar>,
    `❌ The unicode character '${UnicodeChar}' must only contain valid hexidecimal digits`
  >
