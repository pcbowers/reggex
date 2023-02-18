import { StateManager } from "./StateManager"
import { TypedRegExp } from "./TypedRegExp"
import { Assert, Join, OfLength, Overlaps, State } from "@types"
import { DEFAULT_STATE } from "@utils"

export class Group<
  TState extends State<Message, CurExpression, PrevExpression, GroupNames, Groups>,
  Message extends string = TState["message"],
  CurExpression extends string = TState["curExpression"],
  PrevExpression extends string = TState["prevExpression"],
  GroupNames extends string[] = TState["groupNames"],
  Groups extends string[] = TState["groups"]
> extends StateManager<TState> {
  get nonCaptureGroup() {
    return new TypedRegExp(
      this.merge({ message: "", curExpression: `(?:${this.state.curExpression})` })
    )
  }

  get captureGroup() {
    const group = `(${this.state.curExpression})` as const
    return new TypedRegExp(this.merge({ message: "", curExpression: group, groups: [group] }))
  }

  namedCaptureGroup<
    Name extends string,
    ContainsValue = OfLength<Name, number>,
    NameError = `❌ The Name '${Name}' must be a non-empty string`,
    HasOverlap extends string | false = Overlaps<[Name], GroupNames>,
    OverlapError = `❌ The Name '${HasOverlap}' has already been used. Make sure none of the following names are duplicated: ${Join<GroupNames>}`
  >(name: Name & Assert<HasOverlap, false, OverlapError> & Assert<ContainsValue, true, NameError>) {
    const group = `(?<${name}>${this.state.curExpression})` as const
    return new TypedRegExp(
      this.merge({ message: "", curExpression: group, groupNames: [name], groups: [group] })
    )
  }

  namedCapture = this.namedCaptureGroup.bind(this)

  static create() {
    return new Group(DEFAULT_STATE)
  }
}
