import { Contains, State } from "@types"
import { BaseRegExp } from "./BaseRegExp"
import { TypedRegExp } from "./TypedRegExp"

export class Quantifiers<
  CurState extends State,
  IsLazy extends string = Contains<CurState["msg"], "lazy"> extends true ? "?" : ""
> extends BaseRegExp<CurState> {
  private isLazy = (String(this.state.msg).includes("lazy") ? "?" : "") as IsLazy

  get zeroOrMore() {
    return new TypedRegExp(this.merge({ curExp: `${this.state.curExp}*${this.isLazy}` }))
  }

  get oneOrMore() {
    return new TypedRegExp(this.merge({ curExp: `${this.state.curExp}+${this.isLazy}` }))
  }
}
