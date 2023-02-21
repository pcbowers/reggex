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
  MapWrapSearch,
  WrapSearch,
} from "@types"
import { createState, DEFAULT_MESSAGE } from "@utils"
import { BaseRegExp } from "./BaseRegExp"
import { TypedRegExp } from "./TypedRegExp"

export class Appenders<CurState extends State> extends BaseRegExp<CurState> {
  private namespaceState = <
    TState extends State,
    Prefix extends string = "",
    Suffix extends string = "",
    TCurExp = WrapSearch<TState["curExp"], Prefix, Suffix, "?<", ">">,
    TPrvExp = WrapSearch<TState["prvExp"], Prefix, Suffix, "?<", ">">,
    TGroups = MapWrapSearch<TState["groups"], Prefix, Suffix, "?<", ">">,
    FinalNewNames = MapWrap<TState["names"], Prefix, Suffix>,
    FinalCurExp = WrapSearch<TCurExp, Prefix, Suffix, "\\k<", ">">,
    FinalPrvExp = WrapSearch<TPrvExp, Prefix, Suffix, "\\k<", ">">,
    FinalGroups = MapWrapSearch<TGroups, Prefix, Suffix, "\\k<", ">">
  >(
    state: TState,
    prefix: Prefix,
    suffix: Suffix
  ) => {
    const newCurExp = `${state.curExp}`
      .replace(/\?<(.*?)>/g, `?<${prefix}$1${suffix}>`)
      .replace(/\\k<(.*?)>/g, `\\k<${prefix}$1${suffix}>`)
    const newPrvExp = `${state.prvExp}`
      .replace(/\?<(.*?)>/g, `?<${prefix}$1${suffix}>`)
      .replace(/\\k<(.*?)>/g, `\\k<${prefix}$1${suffix}>`)
    const newNames = state.names.map((name) => `${prefix}${name}${suffix}`)
    const newGroups = state.groups.map((group) =>
      group
        .replace(/\?<(.*?)>/g, `?<${prefix}$1${suffix}>`)
        .replace(/\\k<(.*?)>/g, `\\k<${prefix}$1${suffix}>`)
    )

    return {
      msg: state.msg as TState["msg"],
      curExp: newCurExp as FinalCurExp,
      prvExp: newPrvExp as FinalPrvExp,
      names: newNames as FinalNewNames,
      groups: newGroups as FinalGroups,
    }
  }

  group = <
    TState extends State,
    Namespace extends string = "",
    AsPrefix extends boolean = true,
    Prefix extends string = AsPrefix extends true ? Namespace : "",
    Suffix extends string = AsPrefix extends true ? "" : Namespace,
    IsValidType = Contains<TState["msg"], typeof DEFAULT_MESSAGE>,
    InvalidTypeErr = `❌ Only finalized expressions ready for RegExp conversion can be appended`,
    HasNoOverlap = NoOverlap<MapWrap<TState["names"], Prefix, Suffix>, CurState["names"]>,
    OverlapErr = `❌ The name '${Join<HasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<
      CurState["names"]
    >}`
  >(
    instance: Assert<IsValidType, InvalidTypeErr> &
      BaseRegExp<TState> &
      Assert<HasNoOverlap, OverlapErr>,
    options?: AppenderOpts<Namespace, AsPrefix>
  ) => {
    const opts = options ?? { namespace: "", asPrefix: true }
    const prefix = (opts.asPrefix ? opts.namespace : "") as Prefix
    const suffix = (opts.asPrefix ? "" : opts.namespace) as Suffix
    const newState = instance.getState()
    const namespacedState = this.namespaceState(newState, prefix, suffix)

    return new TypedRegExp(
      this.merge({
        msg: namespacedState.msg,
        curExp: `(?:${namespacedState.prvExp}${namespacedState.curExp})`,
        prvExp: `${this.state.prvExp}${this.state.curExp}`,
        names: [...this.state.names, ...namespacedState.names],
        groups: [...this.state.groups, ...namespacedState.groups],
      })
    )
  }

  capture = <
    TState extends State,
    Namespace extends string = "",
    AsPrefix extends boolean = true,
    Prefix extends string = AsPrefix extends true ? Namespace : "",
    Suffix extends string = AsPrefix extends true ? "" : Namespace,
    IsValidType = Contains<TState["msg"], typeof DEFAULT_MESSAGE>,
    InvalidTypeErr = `❌ Only finalized expressions ready for RegExp conversion can be appended`,
    HasNoOverlap = NoOverlap<MapWrap<TState["names"], Prefix, Suffix>, CurState["names"]>,
    OverlapErr = `❌ The name '${Join<HasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<
      CurState["names"]
    >}`
  >(
    instance: Assert<IsValidType, InvalidTypeErr> &
      BaseRegExp<TState> &
      Assert<HasNoOverlap, OverlapErr>,
    options?: AppenderOpts<Namespace, AsPrefix>
  ) => {
    const opts = options ?? { namespace: "", asPrefix: true }
    const prefix = (opts.asPrefix ? opts.namespace : "") as Prefix
    const suffix = (opts.asPrefix ? "" : opts.namespace) as Suffix
    const newState = instance.getState()
    const namespacedState = this.namespaceState(newState, prefix, suffix)

    const group = `(${namespacedState.prvExp}${namespacedState.curExp})` as const
    return new TypedRegExp(
      this.merge({
        msg: namespacedState.msg,
        curExp: group,
        prvExp: `${this.state.prvExp}${this.state.curExp}`,
        names: [...this.state.names, ...namespacedState.names],
        groups: [...this.state.groups, group, ...namespacedState.groups],
      })
    )
  }

  namedCapture = <
    TState extends State,
    Name extends string,
    Namespace extends string = "",
    AsPrefix extends boolean = true,
    Prefix extends string = AsPrefix extends true ? Namespace : "",
    Suffix extends string = AsPrefix extends true ? "" : Namespace,
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
      BaseRegExp<TState> &
      Assert<InstanceHasNoOverlap, InstanceOverlapErr>,
    options?: AppenderOpts<Namespace, AsPrefix>
  ) => {
    const opts = options ?? { namespace: "", asPrefix: true }
    const prefix = (opts.asPrefix ? opts.namespace : "") as Prefix
    const suffix = (opts.asPrefix ? "" : opts.namespace) as Suffix
    const newState = instance.getState()
    const namespacedState = this.namespaceState(newState, prefix, suffix)

    const group = `(?<${name}>${namespacedState.prvExp}${namespacedState.curExp})` as const
    return new TypedRegExp(
      this.merge({
        msg: namespacedState.msg,
        curExp: group,
        prvExp: `${this.state.prvExp}${this.state.curExp}`,
        names: [...this.state.names, name, ...namespacedState.names],
        groups: [...this.state.groups, group, ...namespacedState.groups],
      })
    )
  }

  append = <
    TState extends State,
    Namespace extends string = "",
    AsPrefix extends boolean = true,
    Prefix extends string = AsPrefix extends true ? Namespace : "",
    Suffix extends string = AsPrefix extends true ? "" : Namespace,
    IsValidType = Contains<TState["msg"], typeof DEFAULT_MESSAGE>,
    InvalidTypeErr = `❌ Only finalized expressions ready for RegExp conversion can be appended`,
    HasNoOverlap = NoOverlap<MapWrap<TState["names"], Prefix, Suffix>, CurState["names"]>,
    OverlapErr = `❌ The name '${Join<HasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<
      CurState["names"]
    >}`
  >(
    instance: Assert<IsValidType, InvalidTypeErr> &
      BaseRegExp<TState> &
      Assert<HasNoOverlap, OverlapErr>,
    options?: AppenderOpts<Namespace, AsPrefix>
  ) => {
    const opts = options ?? { namespace: "", asPrefix: true }
    const prefix = (opts.asPrefix ? opts.namespace : "") as Prefix
    const suffix = (opts.asPrefix ? "" : opts.namespace) as Suffix
    const newState = instance.getState()
    const namespacedState = this.namespaceState(newState, prefix, suffix)

    return new TypedRegExp(
      this.merge({
        msg: namespacedState.msg,
        curExp: namespacedState.curExp,
        prvExp: `${this.state.prvExp}${this.state.curExp}${namespacedState.prvExp}`,
        names: [...this.state.names, ...namespacedState.names],
        groups: [...this.state.groups, ...namespacedState.groups],
      })
    )
  }

  backreferenceTo = <
    PossibleRefs extends (string | number)[] = GroupReferences<
      CurState["names"],
      CurState["groups"]
    >,
    Ref extends string | number = PossibleRefs[number],
    IsValidRef = Ref extends PossibleRefs[number] ? true : false,
    InvalidRefErr = `❌ The Reference '${Ref}' is not a valid backreference. Possible values include: ${Join<PossibleRefs>}`,
    RefType extends string = Ref extends string ? `\\k<${Ref}>` : `\\${Ref}`
  >(
    ref: Assert<IsValidRef, InvalidRefErr> & Ref
  ) => {
    const refType = (typeof ref === "string" ? `\\k<${ref}>` : `\\${ref}`) as RefType
    return new TypedRegExp(this.merge({ curExp: `${this.state.curExp}${refType}` }))
  }

  static create() {
    const state = createState({ msg: "⏳ Select Input..." })
    return new Appenders(state)
  }
}
