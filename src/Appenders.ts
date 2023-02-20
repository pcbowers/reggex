import type { Assert, Contains, Join, Letter, NoOverlap, OfLength, StartsWith, State } from "@types"
import { createState, DEFAULT_MESSAGE } from "@utils"
import { BaseRegExp } from "./BaseRegExp"
import { TypedRegExp } from "./TypedRegExp"

export class Appenders<CurState extends State> extends BaseRegExp<CurState> {
  group = <
    TState extends State,
    IsValidType = Contains<TState["msg"], typeof DEFAULT_MESSAGE>,
    InvalidTypeErr = `❌ Only finalized expressions of type 'TypedRegExp' can be appended`,
    HasNoOverlap = NoOverlap<TState["names"], CurState["names"]>,
    OverlapErr = `❌ The name '${Join<HasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<
      CurState["names"]
    >}`
  >(
    instance: Assert<IsValidType, InvalidTypeErr> &
      TypedRegExp<TState> &
      Assert<HasNoOverlap, OverlapErr>
  ) => {
    const newState = instance.getState()
    return new TypedRegExp(
      this.merge({
        msg: newState.msg,
        curExp: `(?:${newState.prvExp}${newState.curExp})`,
        prvExp: `${this.state.prvExp}${this.state.curExp}`,
        names: [...this.state.names, ...newState.names],
        groups: [...this.state.groups, ...newState.groups],
      })
    )
  }

  capture = <
    TState extends State,
    IsValidType = Contains<TState["msg"], typeof DEFAULT_MESSAGE>,
    InvalidTypeErr = `❌ Only finalized expressions of type 'TypedRegExp' can be appended`,
    HasNoOverlap = NoOverlap<TState["names"], CurState["names"]>,
    OverlapErr = `❌ The name '${Join<HasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<
      CurState["names"]
    >}`
  >(
    instance: Assert<IsValidType, InvalidTypeErr> &
      TypedRegExp<TState> &
      Assert<HasNoOverlap, OverlapErr>
  ) => {
    const newState = instance.getState()
    const group = `(${newState.prvExp}${newState.curExp})` as const
    return new TypedRegExp(
      this.merge({
        msg: newState.msg,
        curExp: group,
        prvExp: `${this.state.prvExp}${this.state.curExp}`,
        names: [...this.state.names, ...newState.names],
        groups: [...this.state.groups, group, ...newState.groups],
      })
    )
  }

  namedCapture = <
    TState extends State,
    Name extends string,
    NameIsNotEmpty = OfLength<Name, number>,
    NameEmptyErr = `❌ The Name '${Name}' must be a non-empty string`,
    NameStartsWithLetter = StartsWith<Name, Letter>,
    NameDoesNotStartWithLetterErr = `❌ The Name '${Name}' must start with a string`,
    NameHasNoOverlap = NoOverlap<[Name], CurState["names"]>,
    NameOverlapErr = `❌ The Name '${Join<NameHasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<
      CurState["names"]
    >}`,
    IsValidType = Contains<TState["msg"], typeof DEFAULT_MESSAGE>,
    ValidTypeError = `❌ Only finalized expressions of type 'TypedRegExp' can be appended`,
    InstanceHasNoOverlap = NoOverlap<TState["names"], [...CurState["names"], Name]>,
    InstanceOverlapErr = `❌ The name '${Join<InstanceHasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<
      [...CurState["names"], Name]
    >}`
  >(
    name: Name &
      Assert<NameIsNotEmpty, NameEmptyErr> &
      Assert<NameStartsWithLetter, NameDoesNotStartWithLetterErr> &
      Assert<NameHasNoOverlap, NameOverlapErr>,
    instance: Assert<IsValidType, ValidTypeError> &
      TypedRegExp<TState> &
      Assert<InstanceHasNoOverlap, InstanceOverlapErr>
  ) => {
    const newState = instance.getState()
    const group = `(?<${name}>${newState.prvExp}${newState.curExp})` as const
    return new TypedRegExp(
      this.merge({
        msg: newState.msg,
        curExp: group,
        prvExp: `${this.state.prvExp}${this.state.curExp}`,
        names: [...this.state.names, name, ...newState.names],
        groups: [...this.state.groups, group, ...newState.groups],
      })
    )
  }

  append = <
    TState extends State,
    IsValidType = Contains<TState["msg"], typeof DEFAULT_MESSAGE>,
    InvalidTypeErr extends string = `❌ Only finalized expressions of type 'TypedRegExp' can be appended`,
    HasNoOverlap = NoOverlap<TState["names"], CurState["names"]>,
    OverlapErr extends string = `❌ The name '${Join<HasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<
      CurState["names"]
    >}`
  >(
    instance: Assert<IsValidType, InvalidTypeErr> &
      BaseRegExp<TState> &
      Assert<HasNoOverlap, OverlapErr>
  ) => {
    const newState = instance.getState()
    return new TypedRegExp(
      this.merge({
        msg: newState.msg,
        curExp: newState.curExp,
        prvExp: `${this.state.prvExp}${this.state.curExp}${newState.prvExp}`,
        names: [...this.state.names, ...newState.names],
        groups: [...this.state.groups, ...newState.groups],
      })
    )
  }

  static create() {
    return new Appenders(createState({ msg: "⏳ Select Input..." }))
  }
}
