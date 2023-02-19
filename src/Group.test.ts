import { state } from "@utils"
import { describe, expect, it } from "vitest"
import { match } from "./Input"

describe("Group", () => {
  describe("groupedAs", () => {
    describe("namedCaptureGroup", () => {
      it("resolves", () => {
        const test = match.anyChar.groupedAs.namedCaptureGroup("test")
        expect(test["state"]).toMatchObject(
          state({ curExp: "(?<test>.)", names: ["test"], groups: ["(?<test>.)"] })
        )
      })
    })
    describe("namedCapture", () => {
      it("resolves", () => {
        const test = match.anyChar.groupedAs.namedCapture("test")
        expect(test["state"]).toMatchObject(
          state({ curExp: "(?<test>.)", names: ["test"], groups: ["(?<test>.)"] })
        )
      })
    })
    describe("captureGroup", () => {
      it("resolves", () => {
        const test = match.anyChar.groupedAs.captureGroup
        expect(test["state"]).toMatchObject(state({ curExp: "(.)", groups: ["(.)"] }))
      })
    })
    describe("nonCaptureGroup", () => {
      it("resolves", () => {
        const test = match.anyChar.groupedAs.nonCaptureGroup
        expect(test["state"]).toMatchObject(state({ curExp: "(?:.)" }))
      })
    })
  })
  describe("as", () => {
    describe("namedCaptureGroup", () => {
      it("resolves", () => {
        const test = match.anyChar.as.namedCaptureGroup("test")
        expect(test["state"]).toMatchObject(
          state({ curExp: "(?<test>.)", names: ["test"], groups: ["(?<test>.)"] })
        )
      })
    })
    describe("namedCapture", () => {
      it("resolves", () => {
        const test = match.anyChar.as.namedCapture("test")
        expect(test["state"]).toMatchObject(
          state({ curExp: "(?<test>.)", names: ["test"], groups: ["(?<test>.)"] })
        )
      })
    })
    describe("captureGroup", () => {
      it("resolves", () => {
        const test = match.anyChar.as.captureGroup
        expect(test["state"]).toMatchObject(state({ curExp: "(.)", groups: ["(.)"] }))
      })
    })
    describe("nonCaptureGroup", () => {
      it("resolves", () => {
        const test = match.anyChar.as.nonCaptureGroup
        expect(test["state"]).toMatchObject(state({ curExp: "(?:.)" }))
      })
    })
  })
})
