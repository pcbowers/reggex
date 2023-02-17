/**
 * Get the length of a tuple
 */
export type Length<T extends any[]> = T extends { length: infer L }
  ? L extends number
    ? L
    : never
  : never

type BuildTuple<L extends number, T extends any[] = []> = T extends { length: L }
  ? T
  : BuildTuple<L, [...T, any]>

/**
 * Add A to B
 */
export type Add<A, B> = A extends number
  ? B extends number
    ? Length<[...BuildTuple<A>, ...BuildTuple<B>]>
    : Length<[...BuildTuple<A>]>
  : B extends number
  ? Length<[...BuildTuple<B>]>
  : 0

/**
 * Subtract A from B. Currently, negative numbers are not supported
 */
export type Subtract<A, B> = A extends number
  ? B extends number
    ? BuildTuple<A> extends [...infer U, ...BuildTuple<B>]
      ? Length<U>
      : never
    : A
  : never
