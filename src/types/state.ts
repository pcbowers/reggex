import { Primitive } from "@types"
import { DEFAULT_MESSAGE } from "@utils"

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
 * Merge two tuples of primitives
 * @param T The first tuple
 * @param S The second tuple
 * @returns S if defined, T if defined, otherwise never
 */
export type MergePrimitiveTuple<T, S> = [S] extends [never]
  ? T extends Primitive[]
    ? [...T]
    : never
  : S extends Primitive[]
  ? [...S]
  : never

/**
 * Merge two primitives
 * @param T The first primitive
 * @param S The second primitive
 * @returns S if defined, T if defined, otherwise never
 */
export type MergePrimitive<T, S> = [S] extends [never]
  ? T extends Primitive
    ? T
    : never
  : S extends Primitive
  ? S
  : never

/**
 * Prettify a type
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {}

/**
 * Merge two states
 * @param CurState Current state
 * @param NewState New state
 * @returns NewState if defined, CurState if defined, otherwise never. If NewState["msg"] is never, then the default "msg" is used.
 */
export type StateMerger<CurState extends State, NewState extends State> = Prettify<
  InferState<{
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
 * A helper type which is useful when using the never type as a placeholder
 */
export type _ = never

/**
 * Get the indices of a tuple
 * @param T The tuple
 * @param AddOne Whether or not to add one to the indices
 */
export type TupleIndices<T, AddOne extends boolean = true> = T extends [Primitive, ...infer Rest]
  ? Rest extends Primitive[]
    ? AddOne extends true
      ? [...TupleIndices<Rest, AddOne>, [...Rest, unknown]["length"]]
      : [...TupleIndices<Rest, AddOne>, Rest["length"]]
    : []
  : []

/**
 * Get the possible references to existing regular expression groups
 * @param Names Array of group names
 * @param Groups Array of groups
 * @returns Array of group names along with their numerical references
 */
export type ResolveRefs<Names extends Primitive[], Groups extends Primitive[]> = [
  ...Names,
  ...TupleIndices<Groups>
]

/**
 * Search for a string and wrap it in a prefix and suffix
 * @param Input The string to search
 * @param Prefix The prefix to use
 * @param Suffix The suffix to use
 * @param PreSearch The string to search for before the string to wrap
 * @param PostSearch The string to search for after the string to wrap
 */
export type WrapSearch<
  Input,
  Prefix extends Primitive,
  Suffix extends Primitive,
  PreSearch extends Primitive,
  PostSearch extends Primitive
> = Input extends `${infer Head}${PreSearch}${infer Middle}${PostSearch}${infer Tail}`
  ? Head extends `${string}\\`
    ? Input extends Primitive
      ? Input
      : never
    : `${Head}${PreSearch}${Prefix}${Middle}${Suffix}${PostSearch}${WrapSearch<
        Tail,
        Prefix,
        Suffix,
        PreSearch,
        PostSearch
      >}`
  : Input extends Primitive
  ? Input
  : never

/**
 * Map over a tuple and wrap all instances of a search string in a prefix and suffix
 * @param T The tuple to map over
 * @param Prefix The prefix to use
 * @param Suffix The suffix to use
 * @param PreSearch The string to search for before the string to wrap
 * @param PostSearch The string to search for after the string to wrap
 */
export type MapWrapSearch<
  T,
  Prefix extends Primitive,
  Suffix extends Primitive,
  PreSearch extends Primitive,
  PostSearch extends Primitive
> = T extends [infer First, ...infer Rest]
  ? [
      WrapSearch<First, Prefix, Suffix, PreSearch, PostSearch>,
      ...MapWrapSearch<Rest, Prefix, Suffix, PreSearch, PostSearch>
    ]
  : []

/**
 * Map over a tuple and wrap all instances in a prefix and suffix
 * @param T The tuple to map over
 * @param Prefix The prefix to use
 * @param Suffix The suffix to use
 */
export type MapWrap<
  T extends Primitive[],
  Prefix extends Primitive,
  Suffix extends Primitive
> = T extends [infer First, ...infer Rest]
  ? First extends Primitive
    ? Rest extends Primitive[]
      ? [`${Prefix}${First}${Suffix}`, ...MapWrap<Rest, Prefix, Suffix>]
      : [`${Prefix}${First}${Suffix}`]
    : Rest extends Primitive[]
    ? [...MapWrap<Rest, Prefix, Suffix>]
    : []
  : []

/**
 * Convert a string to a tuple of characters
 * @param T The string to convert
 */
export type StringToTuple<T extends Primitive> = T extends `${infer Head}${infer Tail}`
  ? [Head, ...StringToTuple<Tail>]
  : []

/**
 * Wrap all characters in a string in a prefix and suffix
 * @param T The string to wrap
 * @param Prefix The prefix to use
 * @param Suffix The suffix to use
 */
export type WrapCharacters<
  T extends Primitive,
  Prefix extends Primitive,
  Suffix extends Primitive
> = MapWrap<StringToTuple<T>, Prefix, Suffix>

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

declare const expressionSymbol: unique symbol

/**
 * A typed regular expression
 * @param Expression The regular expression
 */
export type TypedRegExp<Expression extends string> = RegExp & {
  [expressionSymbol]: Expression
}

/**
 * Flags for a regular expression
 */
export type Flag = "g" | "i" | "m" | "s" | "u" | "y" | "d"
