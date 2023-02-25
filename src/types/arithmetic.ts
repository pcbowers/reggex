/**
 * Length of an array. Defaults to never if not an array
 * @param T The array to get the length of
 * @returns The length of the array
 */
export type Length<T extends unknown[]> = T extends { length: infer L }
  ? L extends number
    ? L
    : never
  : never

/**
 * Build a tuple of length L
 * @param L The length of the tuple to build
 * @param T The tuple to build
 * @returns A tuple of length L
 */
type BuildTuple<L extends number, T extends unknown[] = []> = T extends { length: L }
  ? T
  : BuildTuple<L, [...T, unknown]>

/**
 * Add A and B. Defaults to 0 if both are not numbers. Currently does not support negative numbers
 * @param A The first number to add
 * @param B The second number to add
 * @returns The sum of A and B
 */
export type Add<A, B> = A extends number
  ? B extends number
    ? Length<[...BuildTuple<A>, ...BuildTuple<B>]>
    : Length<[...BuildTuple<A>]>
  : B extends number
  ? Length<[...BuildTuple<B>]>
  : 0

/**
 * Map over an array and add N to each number
 * @param T The array to map over
 * @param N The number to add to each number in the array
 * @returns The mapped array
 */
export type MapAdd<T, N> = T extends [infer First, ...infer Rest]
  ? First extends number
    ? [Add<First, N>, ...MapAdd<Rest, N>]
    : [never, ...MapAdd<Rest, N>]
  : []

/**
 * Subtract B from A. Defaults to never if either are not numbers. Currently does not support negative numbers
 * @param A The number to subtract from
 * @param B The number to subtract
 * @returns The difference between A and B
 */
export type Subtract<A, B> = A extends number
  ? B extends number
    ? BuildTuple<A> extends [...infer U, ...BuildTuple<B>]
      ? Length<U>
      : never
    : A
  : never
