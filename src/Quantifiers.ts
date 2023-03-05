import { Contains, State as S, StateMerger, _ } from "@types"
import { BaseReggex } from "./BaseReggex"
import { ReggexTimes } from "./Reggex"

export class Quantifiers<
  CurState extends S,
  IsLazy extends string = Contains<CurState["msg"], "lazy"> extends true ? "?" : ""
> extends BaseReggex<CurState> {
  private isLazy = (String(this.state.msg).includes("lazy") ? "?" : "") as IsLazy

  get zeroOrMore(): ReggexTimes<
    StateMerger<CurState, S<_, `${CurState["curExp"]}*${IsLazy}`, _, _, _>>
  > {
    return new ReggexTimes(this.merge({ curExp: `${this.state.curExp}*${this.isLazy}` }))
  }

  get oneOrMore(): ReggexTimes<
    StateMerger<CurState, S<_, `${CurState["curExp"]}+${IsLazy}`, _, _, _>>
  > {
    return new ReggexTimes(this.merge({ curExp: `${this.state.curExp}+${this.isLazy}` }))
  }

  get optionally(): ReggexTimes<
    StateMerger<CurState, S<_, `${CurState["curExp"]}?${IsLazy}`, _, _, _>>
  > {
    return new ReggexTimes(this.merge({ curExp: `${this.state.curExp}?${this.isLazy}` }))
  }

  atLeast<Times extends number>(
    times: Times
  ): ReggexTimes<
    StateMerger<CurState, S<_, `${CurState["curExp"]}{${Times},}${IsLazy}`, _, _, _>>
  > {
    return new ReggexTimes(this.merge({ curExp: `${this.state.curExp}{${times},}${this.isLazy}` }))
  }

  atMost<Times extends number>(
    times: Times
  ): ReggexTimes<
    StateMerger<CurState, S<_, `${CurState["curExp"]}{,${Times}}${IsLazy}`, _, _, _>>
  > {
    return new ReggexTimes(this.merge({ curExp: `${this.state.curExp}{,${times}}${this.isLazy}` }))
  }

  exactly<Times extends number>(
    times: Times
  ): ReggexTimes<StateMerger<CurState, S<_, `${CurState["curExp"]}{${Times}}${IsLazy}`, _, _, _>>> {
    return new ReggexTimes(this.merge({ curExp: `${this.state.curExp}{${times}}${this.isLazy}` }))
  }

  between<From extends number, To extends number>(
    from: From,
    to: To
  ): ReggexTimes<
    StateMerger<CurState, S<_, `${CurState["curExp"]}{${From},${To}}${IsLazy}`, _, _, _>>
  > {
    return new ReggexTimes(
      this.merge({ curExp: `${this.state.curExp}{${from},${to}}${this.isLazy}` })
    )
  }
}
