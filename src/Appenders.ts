import {
  AppenderOpts,
  Assert,
  Contains,
  GroupReferences,
  Join,
  Letter,
  MapWrap,
  NoOverlap,
  OfLength,
  StartsWith,
  State,
  NamespaceState
} from "@types"
import { createState, DEFAULT_MESSAGE } from "@utils"
import { BaseReggex } from "./BaseReggex"
import { Reggex } from "./Reggex"

export class Appenders<CurState extends State> extends BaseReggex<CurState> {
  private namespaceState = <
    TState extends State,
    Prefix extends string = "",
    Suffix extends string = ""
  >(
    state: TState,
    prefix: Prefix,
    suffix: Suffix
  ): NamespaceState<TState, Prefix, Suffix> => {
    const matchGroup = /(?<!(?:\\))\(\?<(.+?)>/g
    const matchRef = /(?<!(?:\\))\\k<(.*?)>/g

    return {
      msg: state.msg,
      curExp: `${state.curExp}`
        .replace(matchGroup, `(?<${prefix}$1${suffix}>`)
        .replace(matchRef, `\\k<${prefix}$1${suffix}>`),
      prvExp: `${state.prvExp}`
        .replace(matchGroup, `(?<${prefix}$1${suffix}>`)
        .replace(matchRef, `\\k<${prefix}$1${suffix}>`),
      names: state.names.map((name) => `${prefix}${name}${suffix}`),
      groups: state.groups.map((group) =>
        group
          .replace(matchGroup, `(?<${prefix}$1${suffix}>`)
          .replace(matchRef, `\\k<${prefix}$1${suffix}>`)
      )
    } as NamespaceState<TState, Prefix, Suffix>
  }

  group = <
    // parameter types
    TState extends State,
    Namespace extends string = "",
    AsPrefix extends boolean = true,
    // return types
    Prefix extends string = AsPrefix extends true ? Namespace : "",
    Suffix extends string = AsPrefix extends true ? "" : Namespace,
    // assertion types
    IsValidType = Contains<TState["msg"], typeof DEFAULT_MESSAGE>,
    InvalidTypeErr = `❌ Only finalized expressions ready for RegExp conversion can be appended`,
    HasNoOverlap = NoOverlap<MapWrap<TState["names"], Prefix, Suffix>, CurState["names"]>,
    OverlapErr = `❌ The name '${Join<HasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<
      CurState["names"]
    >}`
  >(
    instance: Assert<IsValidType, InvalidTypeErr> &
      BaseReggex<TState> &
      Assert<HasNoOverlap, OverlapErr>,
    options?: AppenderOpts<Namespace, AsPrefix>
  ) => {
    const opts = options ?? { namespace: "", asPrefix: true }
    const prefix = (opts.asPrefix ? opts.namespace : "") as Prefix
    const suffix = (opts.asPrefix ? "" : opts.namespace) as Suffix
    const newState = instance.getState()
    const namespacedState = this.namespaceState(newState, prefix, suffix)

    return new Reggex(
      this.merge({
        msg: namespacedState.msg,
        curExp: `(?:${namespacedState.prvExp}${namespacedState.curExp})`,
        prvExp: `${this.state.prvExp}${this.state.curExp}`,
        names: [...this.state.names, ...namespacedState.names],
        groups: [...this.state.groups, ...namespacedState.groups]
      })
    )
  }

  capture = <
    // parameter types
    TState extends State,
    Namespace extends string = "",
    AsPrefix extends boolean = true,
    // return types
    Prefix extends string = AsPrefix extends true ? Namespace : "",
    Suffix extends string = AsPrefix extends true ? "" : Namespace,
    // assertion types
    IsValidType = Contains<TState["msg"], typeof DEFAULT_MESSAGE>,
    InvalidTypeErr = `❌ Only finalized expressions ready for RegExp conversion can be appended`,
    HasNoOverlap = NoOverlap<MapWrap<TState["names"], Prefix, Suffix>, CurState["names"]>,
    OverlapErr = `❌ The name '${Join<HasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<
      CurState["names"]
    >}`
  >(
    instance: Assert<IsValidType, InvalidTypeErr> &
      BaseReggex<TState> &
      Assert<HasNoOverlap, OverlapErr>,
    options?: AppenderOpts<Namespace, AsPrefix>
  ) => {
    const opts = options ?? { namespace: "", asPrefix: true }
    const prefix = (opts.asPrefix ? opts.namespace : "") as Prefix
    const suffix = (opts.asPrefix ? "" : opts.namespace) as Suffix
    const newState = instance.getState()
    const namespacedState = this.namespaceState(newState, prefix, suffix)

    const group = `(${namespacedState.prvExp}${namespacedState.curExp})` as const

    return new Reggex(
      this.merge({
        msg: namespacedState.msg,
        curExp: group,
        prvExp: `${this.state.prvExp}${this.state.curExp}`,
        names: [...this.state.names, ...namespacedState.names],
        groups: [...this.state.groups, group, ...namespacedState.groups]
      })
    )
  }

  namedCapture = <
    // parameter types
    TState extends State,
    Name extends string,
    Namespace extends string = "",
    AsPrefix extends boolean = true,
    // return types
    Prefix extends string = AsPrefix extends true ? Namespace : "",
    Suffix extends string = AsPrefix extends true ? "" : Namespace,
    // assertion types
    NameIsNotEmpty = OfLength<Name, number>,
    NameEmptyErr = `❌ The Name '${Name}' must be a non-empty string`,
    NameStartsWithLetter = StartsWith<Name, Letter>,
    NameDoesNotStartWithLetterErr = `❌ The Name '${Name}' must start with a string`,
    NameHasNoOverlap = NoOverlap<[Name], CurState["names"]>,
    NameOverlapErr = `❌ The Name '${Join<NameHasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<
      CurState["names"]
    >}`,
    IsValidType = Contains<TState["msg"], typeof DEFAULT_MESSAGE>,
    InvalidTypeErr = `❌ Only finalized expressions ready for RegExp conversion can be appended`,
    InstanceHasNoOverlap = NoOverlap<
      MapWrap<TState["names"], Prefix, Suffix>,
      [...CurState["names"], Name]
    >,
    InstanceOverlapErr = `❌ The name '${Join<InstanceHasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<
      [...CurState["names"], Name]
    >}`
  >(
    name: Name &
      Assert<NameIsNotEmpty, NameEmptyErr> &
      Assert<NameStartsWithLetter, NameDoesNotStartWithLetterErr> &
      Assert<NameHasNoOverlap, NameOverlapErr>,
    instance: Assert<IsValidType, InvalidTypeErr> &
      BaseReggex<TState> &
      Assert<InstanceHasNoOverlap, InstanceOverlapErr>,
    options?: AppenderOpts<Namespace, AsPrefix>
  ) => {
    const opts = options ?? { namespace: "", asPrefix: true }
    const prefix = (opts.asPrefix ? opts.namespace : "") as Prefix
    const suffix = (opts.asPrefix ? "" : opts.namespace) as Suffix
    const newState = instance.getState()
    const namespacedState = this.namespaceState(newState, prefix, suffix)

    const group = `(?<${name}>${namespacedState.prvExp}${namespacedState.curExp})` as const

    return new Reggex(
      this.merge({
        msg: namespacedState.msg,
        curExp: group,
        prvExp: `${this.state.prvExp}${this.state.curExp}`,
        names: [...this.state.names, name, ...namespacedState.names],
        groups: [...this.state.groups, group, ...namespacedState.groups]
      })
    )
  }

  append = <
    // parameter types
    TState extends State,
    Namespace extends string = "",
    AsPrefix extends boolean = true,
    // return types
    Prefix extends string = AsPrefix extends true ? Namespace : "",
    Suffix extends string = AsPrefix extends true ? "" : Namespace,
    // assertion types
    IsValidType = Contains<TState["msg"], typeof DEFAULT_MESSAGE>,
    InvalidTypeErr = `❌ Only finalized expressions ready for RegExp conversion can be appended`,
    HasNoOverlap = NoOverlap<MapWrap<TState["names"], Prefix, Suffix>, CurState["names"]>,
    OverlapErr = `❌ The name '${Join<HasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<
      CurState["names"]
    >}`
  >(
    instance: Assert<IsValidType, InvalidTypeErr> &
      BaseReggex<TState> &
      Assert<HasNoOverlap, OverlapErr>,
    options?: AppenderOpts<Namespace, AsPrefix>
  ) => {
    const opts = options ?? { namespace: "", asPrefix: true }
    const prefix = (opts.asPrefix ? opts.namespace : "") as Prefix
    const suffix = (opts.asPrefix ? "" : opts.namespace) as Suffix
    const newState = instance.getState()
    const namespacedState = this.namespaceState(newState, prefix, suffix)

    return new Reggex(
      this.merge({
        msg: namespacedState.msg,
        curExp: namespacedState.curExp,
        prvExp: `${this.state.prvExp}${this.state.curExp}${namespacedState.prvExp}`,
        names: [...this.state.names, ...namespacedState.names],
        groups: [...this.state.groups, ...namespacedState.groups]
      })
    )
  }

  backreferenceTo = <
    // parameter types
    PossibleRefs extends (string | number)[] = GroupReferences<
      CurState["names"],
      CurState["groups"]
    >,
    Ref extends string | number = PossibleRefs[number],
    // return types
    RefType extends string = Ref extends string ? `\\k<${Ref}>` : `\\${Ref}`,
    // assertion types
    IsValidRef = Ref extends PossibleRefs[number] ? true : false,
    InvalidRefErr = `❌ The Reference '${Ref}' is not a valid backreference. Possible values include: ${Join<PossibleRefs>}`
  >(
    ref: Assert<IsValidRef, InvalidRefErr> & Ref
  ) => {
    const refType = (typeof ref === "string" ? `\\k<${ref}>` : `\\${ref}`) as RefType

    return new Reggex(this.merge({ curExp: `${this.state.curExp}${refType}` }))
  }

  static create() {
    const state = createState({ msg: "⏳ Select Appender..." })
    return new Appenders(state)
  }
}
