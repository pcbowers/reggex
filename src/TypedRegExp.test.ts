import { GetMethod, RegularMethod } from "@types"
import { createState, DEFAULT_MESSAGE } from "@utils"
import { describe, expect, it } from "vitest"
import { Characters, match, State, TypedRegExp } from "./index"

declare module "./Characters" {
  interface Characters<CurState extends State> {
    readonly gmailDomain: GetMethod<typeof gmailDomain<CurState>>
    domain: RegularMethod<typeof domain<CurState>>
    helloString: ReturnType<typeof helloString>
  }
}

const gmailDomain = Characters.extend(
  <CurState extends State>() => {
    return function (this: Characters<CurState>) {
      return new TypedRegExp(this.merge({ curExp: `${this.state.curExp}\\bgmail.com\\b` }))
    }
  },
  { name: "gmailDomain", type: "getMethod" }
)

const domain = Characters.extend(
  <CurState extends State>() => {
    return function <Domain extends string>(this: Characters<CurState>, domain: Domain) {
      return new TypedRegExp(
        this.merge({
          curExp: `${this.state.curExp}\\b${domain}\\b`,
          groups: [...this.state.groups, "test"],
        })
      )
    }
  },
  { name: "domain", type: "method" }
)

const helloString = Characters.extend(
  () => {
    return "hello" as const
  },
  { name: "helloString", type: "value" }
)

describe("TypedRegExp", () => {
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
        createState({ curExp: "\\bbro.com\\b", prvExp: "\\btest.com\\b", groups: ["test", "test"] })
      )
    })

    it("allows extension via primitive values", () => {
      const test = match.anyChar.and.helloString
      expect(test).toEqual("hello")
    })
  })
})
