import { Assert, HexChar, Letter, OfLength, State } from "@types"
import { createState } from "@utils"
import { BaseReggex } from "./BaseReggex"
import { Reggex } from "./Reggex"

export class Inputs<CurState extends State> extends BaseReggex<CurState> {
  get anyChar() {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}.` }))
  }

  get wordChar() {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\w` }))
  }

  controlChar = <
    ControlChar extends string,
    IsLetter = OfLength<ControlChar, 1, Letter>,
    NotLetterErr = `❌ The control character '${ControlChar}' must be a single letter from A-Z`
  >(
    controlChar: ControlChar & Assert<IsLetter, NotLetterErr>
  ) => {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\c${controlChar}` }))
  }

  hexCode = <
    HexCode extends string,
    IsHexChar = OfLength<HexCode, number, HexChar>,
    HexCharErr = `❌ The HexCode '${HexCode}' must only contain valid hexidecimal digits`,
    IsProperLength = OfLength<HexCode, 2 | 4>,
    ImproperLengthErr = `❌ The HexCode '${HexCode}' must be a length of 2 or 4`,
    CharType extends string = OfLength<HexCode, 2> extends true ? "\\x" : "\\u"
  >(
    hexChars: HexCode & Assert<IsHexChar, HexCharErr> & Assert<IsProperLength, ImproperLengthErr>
  ) => {
    const charType = (hexChars.length === 2 ? "\\x" : "\\u") as CharType
    return new Reggex(this.merge({ curExp: `${this.state.curExp}${charType}${hexChars}` }))
  }

  unicodeChar = <
    UnicodeChar extends string,
    IsHexChar = OfLength<UnicodeChar, number, HexChar>,
    HexCharErr = `❌ The UnicodeChar '${UnicodeChar}' must only contain valid hexidecimal digits`,
    IsProperLength = OfLength<UnicodeChar, 4 | 5>,
    ImproperLengthErr = `❌ The UnicodeChar '${UnicodeChar}' must be a length of 4 or 5`
  >(
    unicodeChar: UnicodeChar &
      Assert<IsHexChar, HexCharErr> &
      Assert<IsProperLength, ImproperLengthErr>
  ) => {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\u{${unicodeChar}}` }))
  }

  static create() {
    const state = createState({ msg: "⏳ Select Input..." })
    return new Inputs(state)
  }
}
