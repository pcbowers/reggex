import { GetMethod, RegularMethod } from "@types"
import { createState, DEFAULT_MESSAGE } from "@utils"
import { describe, expect, it } from "vitest"
import { global, Inputs, match, multiline, Reggex, State } from "./index"

declare module "./Inputs" {
  interface Inputs<CurState extends State> {
    readonly gmailDomain: GetMethod<typeof gmailDomain<CurState>>
    domain: RegularMethod<typeof domain<CurState>>
    helloString: ReturnType<typeof helloString>
  }
}

const gmailDomain = Inputs.extend(
  <CurState extends State>() => {
    return function (this: Inputs<CurState>) {
      return new Reggex(this.merge({ curExp: `${this.state.curExp}\\bgmail.com\\b` }))
    }
  },
  { name: "gmailDomain", type: "getMethod" }
)

const domain = Inputs.extend(
  <CurState extends State>() => {
    return function <Domain extends string>(this: Inputs<CurState>, domain: Domain) {
      return new Reggex(
        this.merge({
          curExp: `${this.state.curExp}(\\b${domain}\\b)`,
          groups: [...this.state.groups, `(\\b${domain}\\b)`]
        })
      )
    }
  },
  { name: "domain", type: "method" }
)

const helloString = Inputs.extend(
  () => {
    return "hello" as const
  },
  { name: "helloString", type: "value" }
)

describe("Reggex", () => {
  describe("DEFAULT_MESSAGE", () => {
    it("is a string", () => {
      expect(typeof DEFAULT_MESSAGE).toBe("string")
    })
  })

  describe("and", () => {
    it("starts a new expression", () => {
      const test = match.anyChar.and.wordChar.and.anyChar

      expect(test.getState()).toEqual(createState({ curExp: ".", prvExp: ".\\w" }))
    })
  })

  describe("extend", () => {
    it("allows extension via get methods", () => {
      const test = match.gmailDomain.and.gmailDomain

      expect(test.getState()).toEqual(
        createState({ curExp: "\\bgmail.com\\b", prvExp: "\\bgmail.com\\b" })
      )
    })

    it("allows extension via regular methods", () => {
      const test = match.domain("test.com").and.domain("bro.com")

      expect(test.getState()).toEqual(
        createState({
          curExp: "(\\bbro.com\\b)",
          prvExp: "(\\btest.com\\b)",
          groups: ["(\\btest.com\\b)", "(\\bbro.com\\b)"]
        })
      )
    })

    it("allows extension via primitive values", () => {
      const test = match.anyChar.and.helloString

      expect(test).toEqual("hello")
    })
  })

  describe("compile", () => {
    it("compiles the expression with flags", () => {
      const test = match.anyChar.and.wordChar.and.anyChar.compile([multiline, global])

      expect(test).toEqual(/.\w./gm)
    })

    it("compiles the expression without flags", () => {
      const test = match.anyChar.and.wordChar.and.anyChar.compile()

      expect(test).toEqual(/.\w./)
    })

    it("compiles complex expressions", () => {
      const test = match
        .hexCode("0afd")
        .and.anyChar.thatRepeats.lazily.oneOrMore.groupedAs.namedCapture("test")
        .and.capture(match.wordChar.as.namedCapture("test"), {
          namespace: "prefix",
          asPrefix: true
        })
        .and.backreferenceTo("prefixtest")
        .compile([multiline, global])

      expect(test).toEqual(/\u0afd(?<test>.+?)((?<prefixtest>\w))\k<prefixtest>/gm)
    })
  })
})
