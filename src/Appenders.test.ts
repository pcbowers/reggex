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
            { namespace: "pre", asPrefix: true }
          ),
        { namespace: "suf", asPrefix: false }
      )

      expect(test.getState()).toMatchObject(
        createState({
          curExp: "(?:(?<testsuf>.)(?:.(?<pretestsuf>\\w)\\k<pretestsuf>))",
          prvExp: "",
          names: ["testsuf", "pretestsuf"],
          groups: ["(?<testsuf>.)", "(?<pretestsuf>\\w)"]
        })
      )
    })
  })

  describe("capture", () => {
    it("works", () => {
      const test = capture(
        capture(match.anyChar.and.wordChar.as.namedCapture("test"), {
          namespace: "pre",
          asPrefix: true
        }),
        { namespace: "suf", asPrefix: false }
      )

      expect(test.getState()).toMatchObject(
        createState({
          curExp: "((.(?<pretestsuf>\\w)))",
          prvExp: "",
          names: ["pretestsuf"],
          groups: ["((.(?<pretestsuf>\\w)))", "(.(?<pretestsuf>\\w))", "(?<pretestsuf>\\w)"]
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
          { namespace: "pre", asPrefix: true }
        ).and.anyChar.as.capture.and.group(match.anyChar.and.wordChar),
        { namespace: "suf", asPrefix: false }
      )

      expect(test.getState()).toMatchObject(
        createState({
          curExp: "(?<test>(?<testsuf>.(?<prebrosuf>\\w+))(.)(?:.\\w))",
          prvExp: "",
          names: ["test", "testsuf", "prebrosuf"],
          groups: [
            "(?<test>(?<testsuf>.(?<prebrosuf>\\w+))(.)(?:.\\w))",
            "(?<testsuf>.(?<prebrosuf>\\w+))",
            "(?<prebrosuf>\\w+)",
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
          namespace: "pre",
          asPrefix: true
        })
        .and.append(match.anyChar.as.namedCapture("test"), {
          namespace: "suf",
          asPrefix: false
        })

      expect(test.getState()).toMatchObject(
        createState({
          curExp: "(?<testsuf>.)",
          prvExp: "(?<test>.).(?<pretest>.)",
          names: ["test", "pretest", "testsuf"],
          groups: ["(?<test>.)", "(?<pretest>.)", "(?<testsuf>.)"]
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
