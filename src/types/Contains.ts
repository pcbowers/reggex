import { Add, Subtract } from "@types"

export type Contains<
  Str extends string,
  StrToCheck extends string,
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
  : Str extends ""
  ? false
  : false
