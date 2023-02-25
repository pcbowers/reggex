import { Expand, Length, MapAdd, MapWrap, MapWrapSearch, Primitive, WrapSearch } from "@types"
import { DEFAULT_MESSAGE } from "@utils"

/**
 * Merge two tuples of primitives
 * @param T First tuple
 * @param S Second tuple
 * @returns S if defined, T if defined, otherwise never
 */
type MergePrimitiveTuple<T, S> = [S] extends [never]
  ? T extends Primitive[]
    ? [...T]
    : never
  : S extends Primitive[]
  ? [...S]
  : T extends Primitive[]
  ? [...T]
  : never

/**
 * Merge two primitives
 * @param T First primitive
 * @param S Second primitive
 * @returns S if defined, T if defined, otherwise never
 */
type MergePrimitive<T, S> = [S] extends [never]
  ? T extends Primitive
    ? T
    : never
  : S extends Primitive
  ? S
  : T extends Primitive
  ? T
  : never

/**
 * The State of a Reggex
 * @param Msg The message to use to help indicate the user what is going on
 * @param CurExp The current expression
 * @param PrvExp The previous expression
 * @param Names The names of the groups
 * @param Groups The groups
 */
export interface State<
  Msg extends Primitive = Primitive,
  CurExp extends string = string,
  PrvExp extends string = string,
  Names extends string[] = string[],
  Groups extends string[] = string[]
> {
  msg: Msg
  curExp: CurExp
  prvExp: PrvExp
  names: [...Names]
  groups: [...Groups]
}

/**
 * A helper type to infer the state of a Reggex
 * @param Msg The message to use to help indicate the user what is going on
 * @param CurExp The current expression
 * @param PrvExp The previous expression
 * @param Names The names of the groups
 * @param Groups The groups
 */
export interface InferState<
  TState extends State<Msg, CurExp, PrvExp, Names, Groups>,
  Msg extends Primitive = TState["msg"],
  CurExp extends string = TState["curExp"],
  PrvExp extends string = TState["prvExp"],
  Names extends string[] = TState["names"],
  Groups extends string[] = TState["groups"]
> {
  msg: Msg
  curExp: CurExp
  prvExp: PrvExp
  names: [...Names]
  groups: [...Groups]
}

/**
 * The options for an Appender
 * @param Namespace The namespace to use for the appender
 * @param AsPrefix Whether or not to use the namespace as a prefix or a suffix
 */
export interface AppenderOpts<
  Namespace extends string = string,
  AsPrefix extends boolean = boolean
> {
  namespace: Namespace
  asPrefix: AsPrefix
}

/**
 * Merge two states
 * @param CurState Current state
 * @param NewState New state
 * @returns NewState if defined, CurState if defined, otherwise never. If NewState["msg"] is never, then the default "msg" is used.
 */
export type StateMerger<CurState extends State, NewState extends State> = InferState<
  Expand<{
    [Key in keyof State]: State[Key] extends Primitive[]
      ? [...MergePrimitiveTuple<CurState[Key], NewState[Key]>]
      : Key extends "msg"
      ? [NewState[Key]] extends [never]
        ? typeof DEFAULT_MESSAGE
        : MergePrimitive<CurState[Key], NewState[Key]>
      : MergePrimitive<CurState[Key], NewState[Key]>
  }>
>

/**
 * Get the indices of a tuple
 * @param T Tuple
 * @returns Indices of T
 */
type TupleIndices<T> = T extends [Primitive, ...infer Rest]
  ? Rest extends Primitive[]
    ? [...TupleIndices<Rest>, Length<Rest>]
    : [0]
  : []

/**
 * Get the possible references to existing regular expression groups
 * @param Names Array of group names
 * @param Groups Array of groups
 * @returns Array of group names along with their numerical references
 */
export type GroupReferences<Names extends Primitive[], Groups extends Primitive[]> = [
  ...Names,
  ...MapAdd<TupleIndices<Groups>, 1>
]

/**
 *  Namespace named capture groups with a prefix or suffix
 * @param TState The state to namespace
 * @param Prefix The prefix to use
 * @param Suffix The suffix to use
 * @returns Namespaced state
 */
export type NamespaceState<
  TState extends State,
  Prefix extends string = "",
  Suffix extends string = ""
> = State<
  TState["msg"],
  WrapSearch<WrapSearch<TState["curExp"], Prefix, Suffix, "?<", ">">, Prefix, Suffix, "\\k<", ">">,
  WrapSearch<WrapSearch<TState["prvExp"], Prefix, Suffix, "?<", ">">, Prefix, Suffix, "\\k<", ">">,
  MapWrap<TState["names"], Prefix, Suffix>,
  MapWrapSearch<
    MapWrapSearch<TState["groups"], Prefix, Suffix, "?<", ">">,
    Prefix,
    Suffix,
    "\\k<",
    ">"
  >
>
