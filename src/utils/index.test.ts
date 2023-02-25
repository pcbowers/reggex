import { assign, createState, merger } from "@utils"
import { describe, it, expect } from "vitest"

const method = Symbol("method")
const property = Symbol("property")

describe("utils", () => {
  describe("createState", () => {
    it("creates a new state object", () => {
      const test = createState()
      expect(test.msg).toBeTypeOf("string")
      expect(test.curExp).toBeTypeOf("string")
      expect(test.prvExp).toBeTypeOf("string")
      expect(test.names).toHaveLength(0)
      expect(test.groups).toHaveLength(0)
    })

    it("creates a new state object based on the given state", () => {
      const test = createState({
        msg: "test",
        curExp: "test",
        prvExp: "test",
        names: ["test"],
        groups: ["test"]
      })

      expect(test.msg).toBe("test")
      expect(test.curExp).toBe("test")
      expect(test.prvExp).toBe("test")
      expect(test.names).toHaveLength(1)
      expect(test.groups).toHaveLength(1)
    })
  })

  describe("merger", () => {
    it("merges the msg appropriately", () => {
      const merge = merger(createState({ msg: "test" }))

      expect(merge({ msg: "test2" }).msg).toEqual("test2")
      expect(merge({ msg: "" }).msg).toEqual("")
      expect(merge({ msg: 0 }).msg).toEqual(0)
      expect(merge({ msg: null }).msg).toEqual(createState().msg)
      expect(merge({ msg: undefined }).msg).toEqual(createState().msg)
      expect(merge({}).msg).toEqual(createState().msg)
    })

    it("merges the curExp appropriately", () => {
      const merge = merger(createState({ curExp: "test" }))

      expect(merge({ curExp: "test2" }).curExp).toEqual("test2")
      expect(merge({ curExp: "" }).curExp).toEqual("")
      expect(merge({ curExp: undefined }).curExp).toEqual("test")
      expect(merge({}).curExp).toEqual("test")
    })

    it("merges the prvExp appropriately", () => {
      const merge = merger(createState({ prvExp: "test" }))

      expect(merge({ prvExp: "test2" }).prvExp).toEqual("test2")
      expect(merge({ prvExp: "" }).prvExp).toEqual("")
      expect(merge({ prvExp: undefined }).prvExp).toEqual("test")
      expect(merge({}).prvExp).toEqual("test")
    })

    it("merges the names appropriately", () => {
      const merge = merger(createState({ names: ["test"] }))

      expect(merge({ names: ["test2"] }).names).toEqual(["test2"])
      expect(merge({ names: [] }).names).toEqual([])
      expect(merge({ names: undefined }).names).toEqual(["test"])
      expect(merge({}).names).toEqual(["test"])
    })

    it("merges the groups appropriately", () => {
      const merge = merger(createState({ groups: ["test"] }))

      expect(merge({ groups: ["test2"] }).groups).toEqual(["test2"])
      expect(merge({ groups: [] }).groups).toEqual([])
      expect(merge({ groups: undefined }).groups).toEqual(["test"])
      expect(merge({}).groups).toEqual(["test"])
    })
  })

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
            [method]: methodFunc
          }
        )
      ).toEqual({
        a: 1,
        b: 2,
        c: 3,
        d: 3,
        e: 3,
        [property]: "test",
        [method]: methodFunc
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
        }
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
          }
        })
      )
    })
  })
})
