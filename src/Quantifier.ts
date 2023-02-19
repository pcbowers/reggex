import { Contains, Primitive, State } from "@types"
import { DEFAULT_STATE } from "@utils"
import { StateManager } from "./StateManager"
import { TypedRegExp } from "./TypedRegExp"

export class Quantifier<
  CurState extends State<Msg, CurExp, PrvExp, Names, Groups>,
  Msg extends Primitive = CurState["msg"],
  CurExp extends string = CurState["curExp"],
  PrvExp extends string = CurState["prvExp"],
  Names extends string[] = CurState["names"],
  Groups extends string[] = CurState["groups"],
  IsLazy extends string = Contains<Msg, "lazy"> extends true ? "?" : ""
> extends StateManager<CurState> {
  private isLazy = (String(this.state.msg).includes("lazy") ? "?" : "") as IsLazy

  get zeroOrMore() {
    return new TypedRegExp(this.merge({ curExp: `${this.state.curExp}*${this.isLazy}` }))
  }

  get oneOrMore() {
    return new TypedRegExp(this.merge({ curExp: `${this.state.curExp}+${this.isLazy}` }))
  }

  static create() {
    return new Quantifier(DEFAULT_STATE)
  }
}
