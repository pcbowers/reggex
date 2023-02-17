import { State } from "@types"
import { DEFAULT_STATE } from "@utils"
import { Group } from "./Group"
import { Input } from "./Input"
import { Quantifier } from "./Quantifier"
import { StateManager } from "./StateManager"

export class TypedRegExp<
  TState extends State<Message, CurExpression, PrevExpression, GroupNames, Groups>,
  Message extends string = TState["message"],
  CurExpression extends string = TState["curExpression"],
  PrevExpression extends string = TState["prevExpression"],
  GroupNames extends string[] = TState["groupNames"],
  Groups extends string[] = TState["groups"]
> extends StateManager<TState> {
  get thatOccurs() {
    const that = this
    return Object.assign(
      new Quantifier(this.merge({ message: "⏳️ Waiting for greedy quantifier..." })),
      {
        get lazily() {
          return new Quantifier(that.merge({ message: "⏳️ Waiting for lazy quantifier..." }))
        },
        get greedily() {
          return new Quantifier(that.merge({ message: "⏳️ Waiting for greedy quantifier..." }))
        },
      }
    )
  }

  get thatRepeats() {
    return this.thatOccurs
  }

  get groupedAs() {
    return new Group(this.merge({ message: "⏳️ Waiting for group type..." }))
  }

  get as() {
    return this.groupedAs
  }

  get and() {
    return new Input(this.beginNewExp())
  }

  static create() {
    return new TypedRegExp(DEFAULT_STATE)
  }
}
