import { Primitive, State } from "@types"
import { Input } from "./Input"
import { TypedRegExp } from "./TypedRegExp"

declare module "./Input" {
  interface Input<
    CurState extends State<Msg, CurExp, PrvExp, Names, Groups>,
    Msg extends Primitive = CurState["msg"],
    CurExp extends string = CurState["curExp"],
    PrvExp extends string = CurState["prvExp"],
    Names extends string[] = CurState["names"],
    Groups extends string[] = CurState["groups"]
  > {
    gmailDomain: ReturnType<ReturnType<typeof extendTypedRegEx<CurState>>["gmailDomain"]>
    domain: ReturnType<typeof extendTypedRegEx<CurState>>["domain"]
  }
}

const extendTypedRegEx = <
  CurState extends State<Msg, CurExp, PrvExp, Names, Groups>,
  Msg extends Primitive = CurState["msg"],
  CurExp extends string = CurState["curExp"],
  PrvExp extends string = CurState["prvExp"],
  Names extends string[] = CurState["names"],
  Groups extends string[] = CurState["groups"]
>() => ({
  gmailDomain: function (this: Input<CurState>) {
    return new TypedRegExp(this.merge({ curExp: `${this.state.curExp}\\bgmail.com\\b` }))
  },
  domain: function <Domain extends string>(this: Input<CurState>, domain: Domain) {
    return new TypedRegExp(this.merge({ curExp: `${this.state.curExp}\\b${domain}\\b` }))
  },
})

Object.defineProperties(Input.prototype, {
  gmailDomain: { get: extendTypedRegEx().gmailDomain },
  domain: { value: extendTypedRegEx().domain },
})

const test = Input.create()
  .anyChar.groupedAs.namedCapture("a$123")
  .and.anyChar.and.domain("test.com")
  .groupedAs.namedCapture("bro")

const test2 = Input.create()
  .anyChar.groupedAs.namedCapture("hello")
  .and.backreferenceTo("hello")
  .groupedAs.namedCapture("asdf")
  .and.gmailDomain.and.group(test)

console.log(test2)
