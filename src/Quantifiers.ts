import { Contains, State } from "@types"
import { BaseReggex } from "./BaseReggex"
import { Reggex } from "./Reggex"

export class Quantifiers<
  CurState extends State,
  IsLazy extends string = Contains<CurState["msg"], "lazy"> extends true ? "?" : ""
> extends BaseReggex<CurState> {
  private isLazy = (String(this.state.msg).includes("lazy") ? "?" : "") as IsLazy

  get zeroOrMore() {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}*${this.isLazy}` }))
  }

  get oneOrMore() {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}+${this.isLazy}` }))
  }
}
