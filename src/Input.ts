import {
  Assert,
  Contains,
  GroupIndices,
  HexChar,
  Join,
  JoinUnion,
  Letter,
  OfLength,
  Overlaps,
  State,
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
    Reference extends string | number = GroupIndices<GroupNames, Groups>,
    CurGroupIndices = GroupIndices<GroupNames, Groups>,
    GroupError = `❌ The Reference '${Reference}' is not a valid backreference. Possible values include: ${JoinUnion<CurGroupIndices>}`,
    Value extends string = Reference extends string ? `\\k<${Reference}>` : `\\${Reference}`
  >(reference: Assert<Reference, CurGroupIndices, GroupError> & Reference) {
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

  append<
    TMsg extends string,
    TExp extends string,
    TPrevExp extends string,
    TNames extends string[],
    TGroups extends string[],
    IsCorrectType = Contains<TMsg, "">,
    InstanceError = "❌ Only finalized expressions of type 'TypedRegExp' can be appended",
    HasOverlap extends string | false = Overlaps<TNames, GroupNames>,
    OverlapError = `❌ The name '${HasOverlap}' has already been used. Make sure none of the following names are duplicated: ${Join<GroupNames>}`
  >(
    instance: Assert<IsCorrectType, true, InstanceError> &
      TypedRegExp<State<TMsg, TExp, TPrevExp, [...TNames], [...TGroups]>> &
      Assert<HasOverlap, false, OverlapError>
  ) {
    return new TypedRegExp(this.appendState(instance))
  }

  static create() {
    return new Input(DEFAULT_STATE)
  }
}
