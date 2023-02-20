import { Assert, Join, Letter, NoOverlap, OfLength, StartsWith, State } from "@types"
import { BaseRegExp } from "./BaseRegExp"
import { TypedRegExp } from "./TypedRegExp"

export class Groups<CurState extends State> extends BaseRegExp<CurState> {
  get nonCapture() {
    return new TypedRegExp(this.merge({ curExp: `(?:${this.state.curExp})` }))
  }

  get capture() {
    const group = `(${this.state.curExp})` as const
    return new TypedRegExp(this.merge({ curExp: group, groups: [...this.state.groups, group] }))
  }

  namedCapture = <
    Name extends string,
    IsNotEmpty = OfLength<Name, number>,
    EmptyErr = `❌ The Name '${Name}' must be a non-empty string`,
    NameStartsWithLetter = StartsWith<Name, Letter>,
    NameDoesNotStartWithLetterErr = `❌ The Name '${Name}' must start with a string`,
    HasNoOverlap = NoOverlap<[Name], CurState["names"]>,
    OverlapErr = `❌ The Name '$' has already been used. Make sure none of the following names are duplicated: ${Join<
      CurState["names"]
    >}`
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
}
