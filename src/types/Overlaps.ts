export type Overlaps<
  First extends (string | number)[],
  Second extends (string | number)[]
> = First extends [infer Value, ...infer Rest]
  ? Value extends Second[number]
    ? Value
    : Rest extends (string | number)[]
    ? Overlaps<Rest, Second>
    : false
  : false
