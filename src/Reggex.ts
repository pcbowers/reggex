import { State as S, StateMerger, _ } from "@types"
import { assign } from "@utils"
import { Appenders } from "./Appenders"
import { BaseReggex } from "./BaseReggex"
import { Groups } from "./Groups"
import { Inputs } from "./Inputs"
import { Quantifiers } from "./Quantifiers"

export class Reggex<CurState extends S> extends BaseReggex<CurState> {
  get thatOccurs(): Quantifiers<
    StateMerger<CurState, S<"⏳️ Select greedy Quantifier...", _, _, _, _>>
  > & {
    readonly lazily: Quantifiers<
      StateMerger<CurState, S<"⏳️ Select lazy Quantifier...", _, _, _, _>>
    >
    readonly greedily: Quantifiers<
      StateMerger<CurState, S<"⏳️ Select greedy Quantifier...", _, _, _, _>>
    >
  } {
    const greedyState = this.merge({ msg: "⏳️ Select greedy Quantifier..." })
    const lazyState = this.merge({ msg: "⏳️ Select lazy Quantifier..." })
    return assign(new Quantifiers(greedyState), {
      get lazily() {
        return new Quantifiers<typeof lazyState>(lazyState)
      },
      get greedily() {
        return new Quantifiers<typeof greedyState>(greedyState)
      }
    })
  }

  get thatRepeats(): Quantifiers<
    StateMerger<CurState, S<"⏳️ Select greedy Quantifier...", _, _, _, _>>
  > & {
    readonly lazily: Quantifiers<
      StateMerger<CurState, S<"⏳️ Select lazy Quantifier...", _, _, _, _>>
    >
    readonly greedily: Quantifiers<
      StateMerger<CurState, S<"⏳️ Select greedy Quantifier...", _, _, _, _>>
    >
  } {
    return this.thatOccurs
  }

  get groupedAs(): Groups<StateMerger<CurState, S<"⏳️ Select Group...", _, _, _, _>>> {
    return new Groups(this.merge({ msg: "⏳️ Select Group..." }))
  }

  get as(): Groups<StateMerger<CurState, S<"⏳️ Select Group...", _, _, _, _>>> {
    return this.groupedAs
  }

  get and(): Inputs<
    StateMerger<
      CurState,
      S<"⏳ Select Input...", "", `${CurState["prvExp"]}${CurState["curExp"]}`, _, _>
    >
  > &
    Appenders<
      StateMerger<
        CurState,
        S<"⏳ Select Input...", "", `${CurState["prvExp"]}${CurState["curExp"]}`, _, _>
      >
    > {
    const newState = this.merge({
      msg: "⏳ Select Input...",
      curExp: "",
      prvExp: `${this.state.prvExp}${this.state.curExp}`
    })

    return assign(new Inputs(newState), new Appenders<typeof newState>(newState))
  }
}
