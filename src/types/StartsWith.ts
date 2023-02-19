import { Primitive } from "@types"

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
