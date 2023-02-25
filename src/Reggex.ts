import { State } from "@types"
import { assign } from "@utils"
import { BaseReggex } from "./BaseReggex"
import { Groups } from "./Groups"
import { Appenders } from "./Appenders"
import { Inputs } from "./Inputs"
import { Quantifiers } from "./Quantifiers"

export class Reggex<CurState extends State> extends BaseReggex<CurState> {
  get thatOccurs() {
    const greedyState = this.merge({ msg: "⏳️ Select greedy Quantifier..." })
    const lazyState = this.merge({ msg: "⏳️ Select lazy Quantifier..." })
    return assign(new Quantifiers(greedyState), {
      get lazily() {
        return new Quantifiers(lazyState)
      },
      get greedily() {
        return new Quantifiers(greedyState)
      },
    })
  }

  get thatRepeats() {
    return this.thatOccurs
  }

  get groupedAs() {
    return new Groups(this.merge({ msg: "⏳️ Select Group..." }))
  }

  get as() {
    return this.groupedAs
  }

  get and() {
    const newState = this.merge({
      msg: "⏳ Select Input...",
      curExp: "",
      prvExp: `${this.state.prvExp}${this.state.curExp}`,
    })

    return assign(new Inputs(newState), new Appenders(newState))
  }
}
