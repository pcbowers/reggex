import { Add, Subtract } from "@types"

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
