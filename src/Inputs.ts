import {
  IsValidControlChar,
  IsValidHexCode,
  IsValidUnicodeChar,
  OfLength,
  Prettify,
  State as S,
  StateMerger,
  _
} from "@types"
import { createState } from "@utils"
import { BaseReggex } from "./BaseReggex"
import { Reggex } from "./Reggex"

export class Inputs<CurState extends S> extends BaseReggex<CurState> {
  get anyChar(): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}.`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}.` }))
  }

  get wordChar(): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}\\w`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\w` }))
  }

  controlChar = <ControlChar extends string>(
    controlChar: ControlChar & IsValidControlChar<ControlChar>
  ): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}\\c${ControlChar}`, _, _, _>>> => {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\c${controlChar}` }))
  }

  hexCode = <
    HexCode extends string,
    CharType extends string = OfLength<HexCode, 2> extends true ? "\\x" : "\\u"
  >(
    hexChars: HexCode & IsValidHexCode<HexCode>
  ): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}${CharType}${HexCode}`, _, _, _>>> => {
    const charType = (hexChars.length === 2 ? "\\x" : "\\u") as CharType
    return new Reggex(this.merge({ curExp: `${this.state.curExp}${charType}${hexChars}` }))
  }

  unicodeChar = <UnicodeChar extends string>(
    unicodeChar: UnicodeChar & IsValidUnicodeChar<UnicodeChar>
  ): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}\\u{${UnicodeChar}}`, _, _, _>>> => {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\u{${unicodeChar}}` }))
  }

  static create(): Inputs<Prettify<S<"⏳ Select Input...", "", "", [], []>>> {
    const state = createState({ msg: "⏳ Select Input..." })
    return new Inputs(state)
  }
}
