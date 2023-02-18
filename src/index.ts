import { State } from "@types"
import { Input } from "./Input"
import { TypedRegExp } from "./TypedRegExp"

declare module "./Input" {
  interface Input<
    TState extends State<Message, CurExpression, PrevExpression, GroupNames, Groups>,
    Message extends string = TState["message"],
    CurExpression extends string = TState["curExpression"],
    PrevExpression extends string = TState["prevExpression"],
    GroupNames extends string[] = TState["groupNames"],
    Groups extends string[] = TState["groups"]
  > {
    gmailDomain: ReturnType<ReturnType<typeof extendTypedRegEx<TState>>["gmailDomain"]>
    domain: ReturnType<typeof extendTypedRegEx<TState>>["domain"]
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
  gmailDomain: function (this: Input<TState>) {
    return new TypedRegExp(
      this.merge({ curExpression: `${this.state.curExpression}\\bgmail.com\\b` })
    )
  },
  domain: function <Domain extends string>(this: Input<TState>, domain: Domain) {
    return new TypedRegExp(
      this.merge({ curExpression: `${this.state.curExpression}\\b${domain}\\b` })
    )
  },
})

Object.defineProperties(Input.prototype, {
  gmailDomain: { get: extendTypedRegEx().gmailDomain },
  domain: { value: extendTypedRegEx().domain },
})

const test = Input.create()
  .anyChar.groupedAs.captureGroup.and.anyChar.and.domain("test.com")
  .groupedAs.namedCapture("asdf")

const test2 = Input.create()
  .anyChar.groupedAs.namedCapture("hello")
  .and.backreferenceTo("hello")
  .and.gmailDomain.and.capture(test)

console.log(test2)
