import { Add, Subtract } from "./index"

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
