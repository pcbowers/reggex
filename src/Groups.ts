import { IsValidName, State as S, StateMerger, _ } from "@types"
import { BaseReggex } from "./BaseReggex"
import { Reggex } from "./Reggex"
export class Groups<CurState extends S> extends BaseReggex<CurState> {
  get nonCapture(): Reggex<StateMerger<CurState, S<_, `(?:${CurState["curExp"]})`, _, _, _>>> {
    return new Reggex(this.merge({ curExp: `(?:${this.state.curExp})` }))
  }

  get capture(): Reggex<
    StateMerger<
      CurState,
      S<_, `(${CurState["curExp"]})`, _, _, [...CurState["groups"], `(${CurState["curExp"]})`]>
    >
  > {
    const group = `(${this.state.curExp})` as const
    return new Reggex(this.merge({ curExp: group, groups: [...this.state.groups, group] }))
  }

  namedCapture = <Name extends string>(
    name: Name & IsValidName<Name, CurState["names"]>
  ): Reggex<
    StateMerger<
      CurState,
      S<
        _,
        `(?<${Name}>${CurState["curExp"]})`,
        _,
        [...CurState["names"], Name],
        [...CurState["groups"], `(?<${Name}>${CurState["curExp"]})`]
      >
    >
  > => {
    const group = `(?<${name}>${this.state.curExp})` as const
    return new Reggex(
      this.merge({
        curExp: group,
        names: [...this.state.names, name],
        groups: [...this.state.groups, group]
      })
    )
  }
}
