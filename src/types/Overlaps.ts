import { Primitive } from "@types"

/**
 * Get the overlap between two arrays of primitives
 * @param First The first array of primitives
 * @param Second The second array of primitives
 * @returns The overlap between the two arrays
 */
export type Overlaps<First extends Primitive[], Second extends Primitive[]> = First extends [
  infer Value,
  ...infer Rest
]
  ? Value extends Second[number]
    ? Rest extends Primitive[]
      ? [Value, ...Overlaps<Rest, Second>]
      : [Value]
    : Rest extends Primitive[]
    ? Overlaps<Rest, Second>
    : []
  : []

/**
 * Check if two arrays of primitives have no overlap
 * @param First The first array of primitives
 * @param Second The second array of primitives
 * @returns True if the arrays have no overlap, otherwise an array of the overlapping primitives
 */
export type NoOverlap<First extends Primitive[], Second extends Primitive[]> = Overlaps<
  [...First],
  [...Second]
> extends infer R
  ? R extends []
    ? true
    : R
  : true
