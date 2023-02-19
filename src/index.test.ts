import { Primitive, State } from "@types"
import { beforeAll, describe, expect, it } from "vitest"
import { Input, match } from "./Input"
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

describe("index", () => {
  beforeAll(() => {
    Object.defineProperties(Input.prototype, {
      gmailDomain: { get: extendTypedRegEx().gmailDomain },
      domain: { value: extendTypedRegEx().domain },
    })
  })
  it("should allow get extension", () => {
    const test = match.gmailDomain
    expect(test["state"].curExp).toEqual("\\bgmail.com\\b")
  })

  it("should allow value extension", () => {
    const test = match.domain("test.com")
    expect(test["state"].curExp).toEqual("\\btest.com\\b")
  })
})
