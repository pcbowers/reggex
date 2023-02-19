import {
  Assert,
  Contains,
  GroupReferences,
  HexChar,
  Join,
  Letter,
  OfLength,
  NoOverlap,
  Primitive,
  State,
  StartsWith,
} from "@types"
import { DEFAULT_STATE } from "@utils"
import { StateManager } from "./StateManager"
import { TypedRegExp } from "./TypedRegExp"

export class Input<
  CurState extends State<Msg, CurExp, PrvExp, Names, Groups>,
  Msg extends Primitive = CurState["msg"],
  CurExp extends string = CurState["curExp"],
  PrvExp extends string = CurState["prvExp"],
  Names extends string[] = CurState["names"],
  Groups extends string[] = CurState["groups"]
> extends StateManager<CurState> {
  get anyChar() {
    return new TypedRegExp(this.merge({ curExp: `${this.state.curExp}.` }))
  }

  get wordChar() {
    return new TypedRegExp(this.merge({ curExp: `${this.state.curExp}\\w` }))
  }

  backreferenceTo<
    PossibleRefs extends (string | number)[] = GroupReferences<Names, Groups>,
    Ref extends string | number = PossibleRefs[number],
    IsValidRef = Ref extends PossibleRefs[number] ? true : false,
    InvalidRefErr = `❌ The Reference '${Ref}' is not a valid backreference. Possible values include: ${Join<PossibleRefs>}`,
    RefType extends string = Ref extends string ? `\\k<${Ref}>` : `\\${Ref}`
  >(ref: Assert<IsValidRef, InvalidRefErr> & Ref) {
    const refType = (typeof ref === "string" ? `\\k<${ref}>` : `\\${ref}`) as RefType
    return new TypedRegExp(this.merge({ curExp: `${this.state.curExp}${refType}` }))
  }

  controlChar<
    ControlChar extends string,
    IsLetter = OfLength<ControlChar, 1, Letter>,
    NotLetterErr = `❌ The control character '${ControlChar}' must be a single letter from A-Z`
  >(controlChar: ControlChar & Assert<IsLetter, NotLetterErr>) {
    return new TypedRegExp(this.merge({ curExp: `${this.state.curExp}\\c${controlChar}` }))
  }

  hexCode<
    HexCode extends string,
    IsHexChar = OfLength<HexCode, number, HexChar>,
    HexCharErr = `❌ The HexCode '${HexCode}' must only contain valid hexidecimal digits`,
    IsProperLength = OfLength<HexCode, 2 | 4>,
    ImproperLengthErr = `❌ The HexCode '${HexCode}' must be a length of 2 or 4`,
    CharType extends string = OfLength<HexCode, 2> extends true ? "\\x" : "\\u"
  >(hexChars: HexCode & Assert<IsHexChar, HexCharErr> & Assert<IsProperLength, ImproperLengthErr>) {
    const charType = (hexChars.length === 2 ? "\\x" : "\\u") as CharType
    return new TypedRegExp(this.merge({ curExp: `${this.state.curExp}${charType}${hexChars}` }))
  }

  unicodeChar<
    UnicodeChar extends string,
    IsHexChar = OfLength<UnicodeChar, number, HexChar>,
    HexCharErr = `❌ The UnicodeChar '${UnicodeChar}' must only contain valid hexidecimal digits`,
    IsProperLength = OfLength<UnicodeChar, 4 | 5>,
    ImproperLengthErr = `❌ The UnicodeChar '${UnicodeChar}' must be a length of 4 or 5`
  >(
    unicodeChar: UnicodeChar &
      Assert<IsHexChar, HexCharErr> &
      Assert<IsProperLength, ImproperLengthErr>
  ) {
    return new TypedRegExp(this.merge({ curExp: `${this.state.curExp}\\u{${unicodeChar}}` }))
  }

  group<
    TMsg extends Primitive,
    TCurExp extends string,
    TPrvExp extends string,
    TNames extends string[],
    TGroups extends string[],
    IsValidType = Contains<TMsg, (typeof DEFAULT_STATE)["msg"]>,
    InvalidTypeErr = `❌ Only finalized expressions of type 'TypedRegExp' can be appended`,
    HasNoOverlap = NoOverlap<TNames, Names>,
    OverlapErr = `❌ The name '${Join<HasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<Names>}`
  >(
    instance: Assert<IsValidType, InvalidTypeErr> &
      TypedRegExp<State<TMsg, TCurExp, TPrvExp, TNames, TGroups>> &
      Assert<HasNoOverlap, OverlapErr>
  ) {
    const newState = this.extractState(instance)
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

  capture<
    TMsg extends Primitive,
    TCurExp extends string,
    TPrvExp extends string,
    TNames extends string[],
    TGroups extends string[],
    IsValidType = Contains<TMsg, (typeof DEFAULT_STATE)["msg"]>,
    InvalidTypeErr = `❌ Only finalized expressions of type 'TypedRegExp' can be appended`,
    HasNoOverlap = NoOverlap<TNames, Names>,
    OverlapErr = `❌ The name '${Join<HasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<Names>}`
  >(
    instance: Assert<IsValidType, InvalidTypeErr> &
      TypedRegExp<State<TMsg, TCurExp, TPrvExp, TNames, TGroups>> &
      Assert<HasNoOverlap, OverlapErr>
  ) {
    const newState = this.extractState(instance)
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

  namedCapture<
    TMsg extends Primitive,
    TCurExp extends string,
    TPrvExp extends string,
    TNames extends string[],
    TGroups extends string[],
    Name extends string,
    NameIsNotEmpty = OfLength<Name, number>,
    NameEmptyErr = `❌ The Name '${Name}' must be a non-empty string`,
    NameStartsWithLetter = StartsWith<Name, Letter>,
    NameDoesNotStartWithLetterErr = `❌ The Name '${Name}' must start with a string`,
    NameHasNoOverlap = NoOverlap<[Name], Names>,
    NameOverlapErr = `❌ The Name '${Join<NameHasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<Names>}`,
    IsValidType = Contains<TMsg, (typeof DEFAULT_STATE)["msg"]>,
    ValidTypeError = `❌ Only finalized expressions of type 'TypedRegExp' can be appended`,
    InstanceHasNoOverlap = NoOverlap<TNames, [...Names, Name]>,
    InstanceOverlapErr = `❌ The name '${Join<InstanceHasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<
      [...Names, Name]
    >}`
  >(
    name: Name &
      Assert<NameIsNotEmpty, NameEmptyErr> &
      Assert<NameStartsWithLetter, NameDoesNotStartWithLetterErr> &
      Assert<NameHasNoOverlap, NameOverlapErr>,
    instance: Assert<IsValidType, ValidTypeError> &
      TypedRegExp<State<TMsg, TCurExp, TPrvExp, TNames, TGroups>> &
      Assert<InstanceHasNoOverlap, InstanceOverlapErr>
  ) {
    const newState = this.extractState(instance)
    const group = `(\\k<${name}>${newState.prvExp}${newState.curExp})` as const
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

  append<
    TMsg extends Primitive,
    TCurExp extends string,
    TPrvExp extends string,
    TNames extends string[],
    TGroups extends string[],
    IsValidType = Contains<TMsg, (typeof DEFAULT_STATE)["msg"]>,
    InvalidTypeErr extends string = `❌ Only finalized expressions of type 'TypedRegExp' can be appended`,
    HasNoOverlap = NoOverlap<TNames, Names>,
    OverlapErr extends string = `❌ The name '${Join<HasNoOverlap>}' has already been used. Make sure none of the following names are duplicated: ${Join<Names>}`
  >(
    instance: Assert<IsValidType, InvalidTypeErr> &
      TypedRegExp<State<TMsg, TCurExp, TPrvExp, TNames, TGroups>> &
      Assert<HasNoOverlap, OverlapErr>
  ) {
    const newState = this.extractState(instance)
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
    return new Input(DEFAULT_STATE)
  }
}
