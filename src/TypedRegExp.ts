import { Primitive, State } from "@types"
import { Group } from "./Group"
import { Input } from "./Input"
import { Quantifier } from "./Quantifier"
import { StateManager } from "./StateManager"

export class TypedRegExp<
  CurState extends State<Msg, CurExp, PrvExp, Names, Groups>,
  Msg extends Primitive = CurState["msg"],
  CurExp extends string = CurState["curExp"],
  PrvExp extends string = CurState["prvExp"],
  Names extends string[] = CurState["names"],
  Groups extends string[] = CurState["groups"]
> extends StateManager<CurState> {
  get thatOccurs() {
    const that = this
    return Object.assign(new Quantifier(this.merge({ msg: "⏳️ Select greedy Quantifier..." })), {
      get lazily() {
        return new Quantifier(that.merge({ msg: "⏳️ Select lazy Quantifier..." }))
      },
      get greedily() {
        return new Quantifier(that.merge({ msg: "⏳️ Select greedy Quantifier..." }))
      },
    })
  }

  get thatRepeats() {
    return this.thatOccurs
  }

  get groupedAs() {
    return new Group(this.merge({ msg: "⏳️ Select Group..." }))
  }

  get as() {
    return this.groupedAs
  }

  get and() {
    return new Input(
      this.merge(
        this.merge({
          msg: "⏳ Select Input...",
          curExp: "",
          prvExp: `${this.state.prvExp}${this.state.curExp}`,
        })
      )
    )
  }
}
