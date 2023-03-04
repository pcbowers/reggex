import {
  AppenderOpts,
  ResolveRefs,
  IsValidInstance,
  IsValidName,
  NamespaceState,
  State as S,
  StateMerger,
  _,
  Prettify
} from "@types"
import { createState } from "@utils"
import { BaseReggex } from "./BaseReggex"
import { Reggex } from "./Reggex"

export class Appenders<CurState extends S> extends BaseReggex<CurState> {
  private namespaceState = <
    TState extends S,
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
    TState extends S,
    Namespace extends string = "",
    AsPrefix extends boolean = true,
    // return types
    Prefix extends string = AsPrefix extends true ? Namespace : "",
    Suffix extends string = AsPrefix extends true ? "" : Namespace,
    NState extends S = NamespaceState<TState, Prefix, Suffix>
  >(
    instance: BaseReggex<TState> & IsValidInstance<NState["names"], CurState["names"]>,
    options?: AppenderOpts<Namespace, AsPrefix>
  ): Reggex<
    StateMerger<
      CurState,
      S<
        NState["msg"],
        `(?:${NState["prvExp"]}${NState["curExp"]})`,
        `${CurState["prvExp"]}${CurState["curExp"]}`,
        [...CurState["names"], ...NState["names"]],
        [...CurState["groups"], ...NState["groups"]]
      >
    >
  > => {
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
    TState extends S,
    Namespace extends string = "",
    AsPrefix extends boolean = true,
    // return types
    Prefix extends string = AsPrefix extends true ? Namespace : "",
    Suffix extends string = AsPrefix extends true ? "" : Namespace,
    NState extends S = NamespaceState<TState, Prefix, Suffix>
  >(
    instance: BaseReggex<TState> & IsValidInstance<NState["names"], CurState["names"]>,
    options?: AppenderOpts<Namespace, AsPrefix>
  ): Reggex<
    StateMerger<
      CurState,
      S<
        NState["msg"],
        `(${NState["prvExp"]}${NState["curExp"]})`,
        `${CurState["prvExp"]}${CurState["curExp"]}`,
        [...CurState["names"], ...NState["names"]],
        [...CurState["groups"], `(${NState["prvExp"]}${NState["curExp"]})`, ...NState["groups"]]
      >
    >
  > => {
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
    TState extends S,
    Name extends string,
    Namespace extends string = "",
    AsPrefix extends boolean = true,
    // return types
    Prefix extends string = AsPrefix extends true ? Namespace : "",
    Suffix extends string = AsPrefix extends true ? "" : Namespace,
    NState extends S = NamespaceState<TState, Prefix, Suffix>
  >(
    name: Name & IsValidName<Name, CurState["names"]>,
    instance: BaseReggex<TState> & IsValidInstance<NState["names"], CurState["names"]>,
    options?: AppenderOpts<Namespace, AsPrefix>
  ): Reggex<
    StateMerger<
      CurState,
      S<
        NState["msg"],
        `(?<${Name}>${NState["prvExp"]}${NState["curExp"]})`,
        `${CurState["prvExp"]}${CurState["curExp"]}`,
        [...CurState["names"], Name, ...NState["names"]],
        [
          ...CurState["groups"],
          `(?<${Name}>${NState["prvExp"]}${NState["curExp"]})`,
          ...NState["groups"]
        ]
      >
    >
  > => {
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
    TState extends S,
    Namespace extends string = "",
    AsPrefix extends boolean = true,
    // return types
    Prefix extends string = AsPrefix extends true ? Namespace : "",
    Suffix extends string = AsPrefix extends true ? "" : Namespace,
    NState extends S = NamespaceState<TState, Prefix, Suffix>
  >(
    instance: BaseReggex<TState> & IsValidInstance<NState["names"], CurState["names"]>,
    options?: AppenderOpts<Namespace, AsPrefix>
  ): Reggex<
    StateMerger<
      CurState,
      S<
        NState["msg"],
        NState["curExp"],
        `${CurState["prvExp"]}${CurState["curExp"]}${NState["prvExp"]}`,
        [...CurState["names"], ...NState["names"]],
        [...CurState["groups"], ...NState["groups"]]
      >
    >
  > => {
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
    Ref extends string | number = ResolveRefs<CurState["names"], CurState["groups"]>[number],
    RefType extends string = Ref extends string ? `\\k<${Ref}>` : `\\${Ref}`
  >(
    ref: Ref
  ): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}${RefType}`, _, _, _>>> => {
    const refType = (typeof ref === "string" ? `\\k<${ref}>` : `\\${ref}`) as RefType

    return new Reggex(this.merge({ curExp: `${this.state.curExp}${refType}` }))
  }

  static create(): Appenders<Prettify<S<"⏳ Select Appender...", "", "", [], []>>> {
    const state = createState({ msg: "⏳ Select Appender..." })
    return new Appenders(state)
  }
}
