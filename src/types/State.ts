import { Expand, Length } from "./index"

type FilterEmpty<T extends string[]> = T extends [infer F, ...infer R]
  ? F extends string
    ? R extends string[]
      ? F extends ""
        ? R extends string[]
          ? FilterEmpty<R>
          : []
        : [F, ...FilterEmpty<R>]
      : []
    : []
  : []

type MergeTuple<T, S> = T extends string[]
  ? S extends string[]
    ? [...FilterEmpty<T>, ...FilterEmpty<S>]
    : FilterEmpty<T>
  : S extends string[]
  ? FilterEmpty<S>
  : []

export interface State<
  Message extends string = string,
  CurExpression extends string = string,
  PrevExpression extends string = string,
  GroupNames extends string[] = string[],
  Groups extends string[] = string[]
> {
  message: Message
  curExpression: CurExpression
  prevExpression: PrevExpression
  groupNames: GroupNames
  groups: Groups
}

export type StateMerger<CurState extends State, NewState extends State> = Expand<{
  [Key in keyof State]: State[Key] extends string[]
    ? [NewState[Key]] extends [never]
      ? CurState[Key]
      : MergeTuple<CurState[Key], NewState[Key]>
    : State[Key] extends string
    ? [NewState[Key]] extends [never]
      ? CurState[Key]
      : NewState[Key]
    : []
}>

export type TupleIndices<T extends string[]> = T extends [any, ...infer Rest]
  ? Rest extends string[]
    ? [...TupleIndices<Rest>, Length<Rest>]
    : [0]
  : []

export type GroupIndices<GroupNames extends string[], Groups extends string[]> = [
  ...GroupNames,
  ...TupleIndices<Groups>
]
