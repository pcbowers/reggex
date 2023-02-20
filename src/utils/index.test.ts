import { assign } from "@utils"
import { describe, it, expect } from "vitest"

const method = Symbol("method")
const property = Symbol("property")

describe("utils", () => {
  describe("assign", () => {
    class TestClass {
      public b = 2;
      [property] = "test"

      get c() {
        return this.b + 1
      }
      get [method]() {
        return this[property] + " test"
      }
    }

    it("works like Object.assign", () => {
      const methodFunc = () => "test test"
      expect(
        assign(
          { a: 1 },
          { b: 2 },
          { c: 3 },
          { d: 3 },
          { e: 3 },
          {
            [property]: "test",
            [method]: methodFunc,
          }
        )
      ).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 3,
        e: 3,
        [property]: "test",
        [method]: methodFunc,
      })
    })

    it("allows objects to be assigned with instances", () => {
      expect(assign({ a: 1 }, new TestClass())).toEqual({
        a: 1,
        b: 2,
        get c() {
          return this.b + 1
        },
        [property]: "test",
        get [method]() {
          return this[property] + " test"
        },
      })
    })

    it("allows instances to be assigned with objects", () => {
      const test = assign(new TestClass(), { a: 1 })
      expect(test).toEqual({ a: 1, b: 2, [property]: "test" })
      expect(test.c).toEqual(3)
      expect(test[method]).toEqual("test test")
    })

    it("allows functions to be assigned with instances and objects", () => {
      function TestFunc() {
        return { d: 4 }
      }

      expect(assign(TestFunc, { a: 1 }, new TestClass())).toEqual(
        assign(TestFunc, {
          a: 1,
          b: 2,
          get c() {
            return this.b + 1
          },
          [property]: "test",
          get [method]() {
            return this[property] + " test"
          },
        })
      )
    })
  })
})
