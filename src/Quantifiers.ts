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

  get optionally(): Reggex<
    StateMerger<CurState, S<_, `${CurState["curExp"]}?${IsLazy}`, _, _, _>>
  > {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}?${this.isLazy}` }))
  }

  atLeast<Times extends number>(
    times: Times
  ): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}{${Times},}${IsLazy}`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}{${times},}${this.isLazy}` }))
  }

  atMost<Times extends number>(
    times: Times
  ): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}{,${Times}}${IsLazy}`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}{,${times}}${this.isLazy}` }))
  }

  exactly<Times extends number>(
    times: Times
  ): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}{${Times}}${IsLazy}`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}{${times}}${this.isLazy}` }))
  }

  between<From extends number, To extends number>(
    from: From,
    to: To
  ): Reggex<StateMerger<CurState, S<_, `${CurState["curExp"]}{${From},${To}}${IsLazy}`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `${this.state.curExp}{${from},${to}}${this.isLazy}` }))
  }
}
