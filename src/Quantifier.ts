import { Contains, State } from "@types"
import { DEFAULT_STATE } from "@utils"
import { StateManager } from "./StateManager"
import { TypedRegExp } from "./TypedRegExp"

export class Quantifier<
  TState extends State<Message, CurExpression, PrevExpression, GroupNames, Groups>,
  Message extends string = TState["message"],
  CurExpression extends string = TState["curExpression"],
  PrevExpression extends string = TState["prevExpression"],
  GroupNames extends string[] = TState["groupNames"],
  Groups extends string[] = TState["groups"]
> extends StateManager<TState> {
  private isLazy = (this.state.message.includes("lazy") ? "?" : "") as Contains<
    Message,
    "lazy"
  > extends true
    ? "?"
    : ""

  get zeroOrMore() {
    return new TypedRegExp(
      this.merge({ message: "", curExpression: `${this.state.curExpression}*${this.isLazy}` })
    )
  }

  get oneOrMore() {
    return new TypedRegExp(
      this.merge({ message: "", curExpression: `${this.state.curExpression}+${this.isLazy}` })
    )
  }

  static create() {
    return new Quantifier(DEFAULT_STATE)
  }
}
