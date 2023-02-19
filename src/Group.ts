import { Assert, Join, Letter, NoOverlap, OfLength, Primitive, StartsWith, State } from "@types"
import { StateManager } from "./StateManager"
import { TypedRegExp } from "./TypedRegExp"

export class Group<
  CurState extends State<Msg, CurExp, PrvExp, Names, Groups>,
  Msg extends Primitive = CurState["msg"],
  CurExp extends string = CurState["curExp"],
  PrvExp extends string = CurState["prvExp"],
  Names extends string[] = CurState["names"],
  Groups extends string[] = CurState["groups"]
> extends StateManager<CurState> {
  get nonCaptureGroup() {
    return new TypedRegExp(this.merge({ curExp: `(?:${this.state.curExp})` }))
  }

  get captureGroup() {
    const group = `(${this.state.curExp})` as const
    return new TypedRegExp(this.merge({ curExp: group, groups: [...this.state.groups, group] }))
  }

  namedCaptureGroup = <
    Name extends string,
    IsNotEmpty = OfLength<Name, number>,
    EmptyErr = `❌ The Name '${Name}' must be a non-empty string`,
    NameStartsWithLetter = StartsWith<Name, Letter>,
    NameDoesNotStartWithLetterErr = `❌ The Name '${Name}' must start with a string`,
    HasNoOverlap = NoOverlap<[Name], Names>,
    OverlapErr = `❌ The Name '$' has already been used. Make sure none of the following names are duplicated: ${Join<Names>}`
  >(
    name: Name &
      Assert<IsNotEmpty, EmptyErr> &
      Assert<NameStartsWithLetter, NameDoesNotStartWithLetterErr> &
      Assert<HasNoOverlap, OverlapErr>
  ) => {
    const group = `(?<${name}>${this.state.curExp})` as const
    return new TypedRegExp(
      this.merge({
        curExp: group,
        names: [...this.state.names, name],
        groups: [...this.state.groups, group],
      })
    )
  }

  namedCapture = this.namedCaptureGroup.bind(this)
}
