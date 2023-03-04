import { Contains, State as S, StateMerger, _ } from "@types"
import { BaseReggex } from "./BaseReggex"
import { Reggex } from "./Reggex"

export class Quantifiers<
  CurState extends S,
  IsLazy extends string = Contains<CurState["msg"], "lazy"> extends true ? "?" : ""
> extends BaseReggex<CurState> {
  private isLazy = (String(this.state.msg).includes("lazy") ? "?" : "") as IsLazy

  get zeroOrMore(): Reggex<
    StateMerger<CurState, S<_, `${CurState["curExp"]}*${IsLazy}`, _, _, _>>
  > {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}*${this.isLazy}` }))
  }

  get oneOrMore(): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}+${IsLazy}`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}+${this.isLazy}` }))
  }
}
