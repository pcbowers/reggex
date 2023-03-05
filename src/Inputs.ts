import {
  IsValidControlChar,
  IsValidHexCode,
  IsValidSpecificChar,
  IsValidUnicodeChar,
  Join,
  OfLength,
  Prettify,
  State as S,
  StateMerger,
  WrapCharacters,
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

  get anyButWordChar(): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}\\W`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\W` }))
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

  // TODO: Escape special characters
  specificChar = <Char extends string>(
    char: Char & IsValidSpecificChar<Char>
  ): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}${Char}`, _, _, _>>> => {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}${char}` }))
  }

  unicodeProperty = <UnicodeProperty extends string>(
    unicodeProperty: UnicodeProperty
  ): Reggex<
    StateMerger<CurState, S<_, `${CurState["curExp"]}\\p{${UnicodeProperty}}`, _, _, _>>
  > => {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\p{${unicodeProperty}}` }))
  }

  anyButUnicodeProperty = <UnicodeProperty extends string>(
    unicodeProperty: UnicodeProperty
  ): Reggex<
    StateMerger<CurState, S<_, `${CurState["curExp"]}\\P{${UnicodeProperty}}`, _, _, _>>
  > => {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\P{${unicodeProperty}}` }))
  }

  get whitespaceChar(): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}\\s`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\s` }))
  }

  get anyButWhitespaceChar(): Reggex<
    StateMerger<CurState, S<_, `${CurState["curExp"]}\\S`, _, _, _>>
  > {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\S` }))
  }

  get anyDigit(): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}\\d`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\d` }))
  }

  get anyButDigit(): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}\\D`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\D` }))
  }

  get nullByte(): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}\\0`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\0` }))
  }

  get tab(): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}\\t`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\t` }))
  }

  get verticalTab(): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}\\v`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\v` }))
  }

  get newline(): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}\\n`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\n` }))
  }

  get carriageReturn(): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}\\r`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\r` }))
  }

  get formfeed(): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}\\f`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}\\f` }))
  }

  get backspace(): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}[\\b]`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}[\\b]` }))
  }

  // TODO: Escape special characters
  string = <Str extends string>(
    str: Str
  ): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}${Str}`, _, _, _>>> => {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}${str}` }))
  }

  // TODO: Escape special characters
  anyButString = <
    Str extends string,
    WrappedString extends string = Join<WrapCharacters<Str, "[^", "]">, "", "", false>
  >(
    str: Str
  ): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}${WrappedString}`, _, _, _>>> => {
    const wrappedString = str
      .split("")
      .map((char) => `[^${char}]`)
      .join("") as WrappedString
    return new Reggex(this.merge({ curExp: `${this.state.curExp}${wrappedString}` }))
  }

  // TODO: Escape special characters
  anyInRange = <Range extends string>(
    range: Range
  ): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}[${Range}]`, _, _, _>>> => {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}[${range}]` }))
  }

  range = this.anyInRange.bind(this)

  // TODO: Escape special characters
  anyNotInRange = <Range extends string>(
    range: Range
  ): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}[^${Range}]`, _, _, _>>> => {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}[^${range}]` }))
  }

  static create(): Inputs<Prettify<S<"⏳ Select Input...", "", "", [], []>>> {
    const state = createState({ msg: "⏳ Select Input..." })
    return new Inputs(state)
  }
}
