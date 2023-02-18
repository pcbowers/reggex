import {
  Assert,
  Contains,
  GroupIndices,
  HexChar,
  Join,
  Letter,
  OfLength,
  Overlaps,
  State,
  StateMerger,
} from "@types"
import { DEFAULT_STATE } from "@utils"
import { StateManager } from "./StateManager"
import { TypedRegExp } from "./TypedRegExp"

export class Input<
  TState extends State<Message, CurExpression, PrevExpression, GroupNames, Groups>,
  Message extends string = TState["message"],
  CurExpression extends string = TState["curExpression"],
  PrevExpression extends string = TState["prevExpression"],
  GroupNames extends string[] = TState["groupNames"],
  Groups extends string[] = TState["groups"]
> extends StateManager<TState> {
  get anyChar() {
    return new TypedRegExp(this.merge({ curExpression: `${this.state.curExpression}.` }))
  }

  get wordChar() {
    return new TypedRegExp(this.merge({ curExpression: `${this.state.curExpression}\\w` }))
  }

  backreferenceTo<
    CurGroupIndices extends (string | number)[] = GroupIndices<GroupNames, Groups>,
    Reference extends string | number = CurGroupIndices[number],
    GroupError = `❌ The Reference '${Reference}' is not a valid backreference. Possible values include: ${Join<CurGroupIndices>}`,
    Value extends string = Reference extends string ? `\\k<${Reference}>` : `\\${Reference}`
  >(reference: Assert<Reference, CurGroupIndices[number], GroupError> & Reference) {
    const ref = (typeof reference === "string" ? `\\k<${reference}>` : `\\${reference}`) as Value
    return new TypedRegExp(this.merge({ curExpression: `${this.state.curExpression}${ref}` }))
  }

  controlChar<
    ControlChar extends string,
    IsLetter = OfLength<ControlChar, 1, Letter>,
    ControlCharError = `❌ The control character '${ControlChar}' must be a single letter from A-Z`
  >(controlChar: ControlChar & Assert<IsLetter, ControlCharError>) {
    return new TypedRegExp(
      this.merge({ curExpression: `${this.state.curExpression}\\c${controlChar}` })
    )
  }

  hexCode<
    HexCode extends string,
    IsHexChar = OfLength<HexCode, number, HexChar>,
    TypeError = `❌ The HexCode '${HexCode}' must only contain valid hexidecimal digits`,
    IsLength2 = OfLength<HexCode, 2>,
    IsLength4 = OfLength<HexCode, 4>,
    LengthError = `❌ The HexCode '${HexCode}' must be a length of 2 or 4`
  >(
    hexChars: HexCode &
      Assert<IsHexChar, true, TypeError> &
      Assert<IsLength2 extends true ? true : IsLength4, true, LengthError>
  ) {
    const charType = (hexChars.length === 2 ? "\\x" : "\\u") as IsLength2 extends true
      ? "\\x"
      : "\\u"
    return new TypedRegExp(
      this.merge({ curExpression: `${this.state.curExpression}${charType}${hexChars}` })
    )
  }

  unicodeChar<
    UnicodeChar extends string,
    IsHexChar = OfLength<UnicodeChar, number, HexChar>,
    TypeError = `❌ The UnicodeChar '${UnicodeChar}' must only contain valid hexidecimal digits`,
    IsLength4 = OfLength<UnicodeChar, 4>,
    IsLength5 = OfLength<UnicodeChar, 5>,
    LengthError = `❌ The UnicodeChar '${UnicodeChar}' must be a length of 4 or 5`
  >(
    unicodeChar: UnicodeChar &
      Assert<IsHexChar, TypeError> &
      Assert<IsLength4 extends true ? true : IsLength5, LengthError>
  ) {
    return new TypedRegExp(
      this.merge({ curExpression: `${this.state.curExpression}\\u{${unicodeChar}}` })
    )
  }

  group<
    TMessage extends string,
    TCurExpression extends string,
    TPrevExpression extends string,
    TGroupNames extends string[],
    TGroups extends string[],
    IsCorrectType = Contains<TMessage, "">,
    InstanceError = "❌ Only finalized expressions of type 'TypedRegExp' can be appended",
    HasOverlap extends string | false = Overlaps<TGroupNames, GroupNames>,
    OverlapError = `❌ The name '${HasOverlap}' has already been used. Make sure none of the following names are duplicated: ${Join<GroupNames>}`
  >(
    instance: Assert<IsCorrectType, true, InstanceError> &
      TypedRegExp<
        State<TMessage, TCurExpression, TPrevExpression, [...TGroupNames], [...TGroups]>
      > &
      Assert<HasOverlap, false, OverlapError>
  ) {
    const newState = this.appendStateToCurrent(instance)
    const group = `(?:${newState.prevExpression}${newState.curExpression})` as const
    return new TypedRegExp({
      ...newState,
      curExpression: group,
      prevExpression: "",
    })
  }

  namedCapture<
    TMessage extends string,
    TCurExpression extends string,
    TPrevExpression extends string,
    TGroupNames extends string[],
    TGroups extends string[],
    Name extends string,
    ContainsValue = OfLength<Name, number>,
    NameError = `❌ The Name '${Name}' must be a non-empty string`,
    HasOverlap1 extends string | false = Overlaps<[Name], GroupNames>,
    OverlapError1 = `❌ The Name '${HasOverlap1}' has already been used. Make sure none of the following names are duplicated: ${Join<GroupNames>}`,
    IsCorrectType = Contains<TMessage, "">,
    InstanceError = "❌ Only finalized expressions of type 'TypedRegExp' can be appended",
    HasOverlap2 extends string | false = Overlaps<TGroupNames, [...GroupNames, Name]>,
    OverlapError2 = `❌ The name '${HasOverlap2}' has already been used. Make sure none of the following names are duplicated: ${Join<
      [...GroupNames, Name]
    >}`
  >(
    name: Name & Assert<HasOverlap1, false, OverlapError1> & Assert<ContainsValue, true, NameError>,
    instance: Assert<IsCorrectType, true, InstanceError> &
      TypedRegExp<
        State<TMessage, TCurExpression, TPrevExpression, [...TGroupNames], [...TGroups]>
      > &
      Assert<HasOverlap2, false, OverlapError2>
  ) {
    const newState = this.appendStateToCurrent(instance)
    const group = `(\\k<${name}>${newState.curExpression})` as const
    return new TypedRegExp({
      ...newState,
      curExpression: group,
      // eslint-disable-next-line @typescript-eslint/dot-notation
      groupNames: [...this.state.groupNames, name, ...instance["state"].groupNames] as [
        ...GroupNames,
        Name,
        ...TGroupNames
      ],
      // eslint-disable-next-line @typescript-eslint/dot-notation
      groups: [...this.state.groups, group, ...instance["state"].groups] as [
        ...Groups,
        typeof group,
        ...TGroups
      ],
    })
  }

  capture<
    NewState extends State<
      TMessage,
      `(${TPrevExpression}${TCurExpression})`,
      `${PrevExpression}${CurExpression}`,
      [...TGroupNames],
      [...Groups, `(${TPrevExpression}${TCurExpression})`, ...TGroups]
    >,
    TMessage extends string,
    TCurExpression extends string,
    TPrevExpression extends string,
    TGroupNames extends string[],
    TGroups extends string[],
    IsCorrectType = Contains<TMessage, "">,
    InstanceError = "❌ Only finalized expressions of type 'TypedRegExp' can be appended",
    HasOverlap extends string | false = Overlaps<TGroupNames, GroupNames>,
    OverlapError = `❌ The name '${HasOverlap}' has already been used. Make sure none of the following names are duplicated: ${Join<GroupNames>}`
  >(
    instance: Assert<IsCorrectType, true, InstanceError> &
      TypedRegExp<
        State<TMessage, TCurExpression, TPrevExpression, [...TGroupNames], [...TGroups]>
      > &
      Assert<HasOverlap, false, OverlapError>
  ): TypedRegExp<NewState> {
    const newState = this.appendStateToCurrent(instance)
    const group = `(${newState.curExpression})` as const
    return new TypedRegExp({
      message: newState.message,
      curExpression: group,
      prevExpression: newState.prevExpression,
      groupNames: newState.groupNames,
      // eslint-disable-next-line @typescript-eslint/dot-notation
      groups: [...this.state.groups, group, ...instance["state"].groups],
    } as unknown as NewState)
  }

  append<
    NewState extends State<
      TMessage,
      TCurExpression,
      `${PrevExpression}${CurExpression}${TPrevExpression}`,
      [...TGroupNames],
      [...TGroups]
    >,
    MergedState extends StateMerger<TState, NewState>,
    TMessage extends string,
    TCurExpression extends string,
    TPrevExpression extends string,
    TGroupNames extends string[],
    TGroups extends string[],
    IsCorrectType = Contains<TMessage, "">,
    InstanceError = "❌ Only finalized expressions of type 'TypedRegExp' can be appended",
    HasOverlap extends string | false = Overlaps<TGroupNames, GroupNames>,
    OverlapError = `❌ The name '${HasOverlap}' has already been used. Make sure none of the following names are duplicated: ${Join<GroupNames>}`
  >(
    instance: Assert<IsCorrectType, true, InstanceError> &
      TypedRegExp<
        State<TMessage, TCurExpression, TPrevExpression, [...TGroupNames], [...TGroups]>
      > &
      Assert<HasOverlap, false, OverlapError>
  ): TypedRegExp<MergedState> {
    return new TypedRegExp(this.appendState(instance))
  }

  static create() {
    return new Input(DEFAULT_STATE)
  }
}
