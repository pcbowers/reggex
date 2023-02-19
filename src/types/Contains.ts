import { Add, Primitive, Subtract } from "@types"

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
