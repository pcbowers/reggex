import { createState } from "@utils"
import { describe, expect, it } from "vitest"
import { capture, group, match, namedCapture } from "./index"

describe("Appenders", () => {
  describe("group", () => {
    it("works", () => {
      const test = group(
        match.anyChar.as
          .namedCapture("test")
          .and.group(
            match.anyChar.and.wordChar.groupedAs.namedCapture("test").and.backreferenceTo("test"),
            { namespace: "prefix-", asPrefix: true }
          ),
        { namespace: "-suffix", asPrefix: false }
      )

      expect(test.getState()).toMatchObject(
        createState({
          curExp: "(?:(?<test-suffix>.)(?:.(?<prefix-test-suffix>\\w)\\k<prefix-test-suffix>))",
          prvExp: "",
          names: ["test-suffix", "prefix-test-suffix"],
          groups: ["(?<test-suffix>.)", "(?<prefix-test-suffix>\\w)"]
        })
      )
    })
  })

  describe("capture", () => {
    it("works", () => {
      const test = capture(
        capture(match.anyChar.and.wordChar.as.namedCapture("test"), {
          namespace: "prefix-",
          asPrefix: true
        }),
        { namespace: "-suffix", asPrefix: false }
      )

      expect(test.getState()).toMatchObject(
        createState({
          curExp: "((.(?<prefix-test-suffix>\\w)))",
          prvExp: "",
          names: ["prefix-test-suffix"],
          groups: [
            "((.(?<prefix-test-suffix>\\w)))",
            "(.(?<prefix-test-suffix>\\w))",
            "(?<prefix-test-suffix>\\w)"
          ]
        })
      )
    })
  })

  describe("namedCapture", () => {
    it("works with high complexity", () => {
      const test = namedCapture(
        "test",
        namedCapture(
          "test",
          match.anyChar.and.wordChar.thatRepeats.greedily.oneOrMore.groupedAs.namedCapture("bro"),
          { namespace: "prefix-", asPrefix: true }
        ).and.anyChar.as.capture.and.group(match.anyChar.and.wordChar),
        { namespace: "-suffix", asPrefix: false }
      )

      expect(test.getState()).toMatchObject(
        createState({
          curExp: "(?<test>(?<test-suffix>.(?<prefix-bro-suffix>\\w+))(.)(?:.\\w))",
          prvExp: "",
          names: ["test", "test-suffix", "prefix-bro-suffix"],
          groups: [
            "(?<test>(?<test-suffix>.(?<prefix-bro-suffix>\\w+))(.)(?:.\\w))",
            "(?<test-suffix>.(?<prefix-bro-suffix>\\w+))",
            "(?<prefix-bro-suffix>\\w+)",
            "(.)"
          ]
        })
      )
    })
  })

  describe("append", () => {
    it("works", () => {
      const test = match.anyChar.as
        .namedCapture("test")
        .and.append(match.anyChar)
        .and.append(match.anyChar.as.namedCapture("test"), {
          namespace: "prefix-",
          asPrefix: true
        })
        .and.append(match.anyChar.as.namedCapture("test"), {
          namespace: "-suffix",
          asPrefix: false
        })

      expect(test.getState()).toMatchObject(
        createState({
          curExp: "(?<test-suffix>.)",
          prvExp: "(?<test>.).(?<prefix-test>.)",
          names: ["test", "prefix-test", "test-suffix"],
          groups: ["(?<test>.)", "(?<prefix-test>.)", "(?<test-suffix>.)"]
        })
      )
    })
  })

  describe("backreferenceTo", () => {
    it("works with a numbered reference", () => {
      const test = capture(match.anyChar).and.backreferenceTo(1)

      expect(test.getState()).toMatchObject(
        createState({ curExp: "\\1", prvExp: "(.)", groups: ["(.)"] })
      )
    })

    it("works with a named reference", () => {
      const test = namedCapture("test", match.anyChar).and.backreferenceTo("test")

      expect(test.getState()).toMatchObject(
        createState({
          curExp: "\\k<test>",
          prvExp: "(?<test>.)",
          names: ["test"],
          groups: ["(?<test>.)"]
        })
      )
    })
  })
})
