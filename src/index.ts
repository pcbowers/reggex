import { State } from "@types"
import { Input } from "./Input"
import { TypedRegExp } from "./TypedRegExp"

declare module "./TypedRegExp" {
  interface TypedRegExp<
    TState extends State<Message, CurExpression, PrevExpression, GroupNames, Groups>,
    Message extends string = TState["message"],
    CurExpression extends string = TState["curExpression"],
    PrevExpression extends string = TState["prevExpression"],
    GroupNames extends string[] = TState["groupNames"],
    Groups extends string[] = TState["groups"]
  > {
    thatRepeatsTest: ReturnType<ReturnType<typeof extendTypedRegEx<TState>>["thatRepeatsTest"]>
    groupedAsTest: ReturnType<typeof extendTypedRegEx<TState>>["groupedAsTest"]
  }
}

const extendTypedRegEx = <
  TState extends State<Message, CurExpression, PrevExpression, GroupNames, Groups>,
  Message extends string = TState["message"],
  CurExpression extends string = TState["curExpression"],
  PrevExpression extends string = TState["prevExpression"],
  GroupNames extends string[] = TState["groupNames"],
  Groups extends string[] = TState["groups"]
>() => ({
  thatRepeatsTest: function (this: TypedRegExp<TState>) {
    return new TypedRegExp(this.merge({ curExpression: `${this.state.curExpression}+` }))
  },
  groupedAsTest: function <Name extends string>(this: TypedRegExp<TState>, name: Name) {
    const group = `(?<${name}>${this.state.curExpression})` as const
    return new TypedRegExp(
      this.merge({ curExpression: group, groupNames: [name], groups: [group] })
    )
  },
})

Object.defineProperties(TypedRegExp.prototype, {
  thatRepeatsTest: { get: extendTypedRegEx().thatRepeatsTest },
  groupedAsTest: { value: extendTypedRegEx().groupedAsTest },
})

const test =
  Input.create().anyChar.groupedAs.captureGroup.and.anyChar.thatRepeatsTest.groupedAs.namedCapture(
    "asdf"
  )
const test2 = Input.create()
  .anyChar.groupedAs.namedCapture("hello")
  .and.backreferenceTo("hello")
  .and.append(test).and.anyChar

console.log(test2)
