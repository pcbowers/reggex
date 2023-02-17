import { Add, Expand } from "@types"

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

export type GroupIndices<GroupNames extends string[], Groups extends string[]> =
  | GroupNames[number]
  | (Extract<keyof Groups, `${number}`> extends `${infer N extends number}`
      ? N extends number
        ? Add<N, 1>
        : never
      : never)
