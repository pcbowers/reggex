import { describe, expect, it } from "vitest"
import { parse } from "acorn"
import { ReggexTransformerPlugin } from "./transform"

const testTransform = `
  import { compileReggex, match } from "reggex"
  const re1 = compileReggex(() => {
    const test = "hello"
    return match.anyChar.and.wordChar.as.namedCapture(test).and.anyChar
  })
`.trim()

const testTransformNoImport = testTransform.split("\n").slice(1).join("\n")

const expectedTransform = `
  import { compileReggex, match } from "reggex"
  const re1 = /.(?<hello>\\w)./
`.trim()

const expectedTransformNoImport = expectedTransform.split("\n").slice(1).join("\n")

describe("transformer", () => {
  it("ignores any non-JS files by default", () => {
    expect(transform(testTransform, "test.css")).toBeUndefined()
  })

  it("ignores any files that don't import from reggex", () => {
    const test1 = `import { match, compileReggex } from "reggx"\n//reggex\n` + testTransformNoImport
    const test2 = `import { match, compileReggex } from "reggx"\n` + testTransformNoImport

    expect(transform(test1)).toBeUndefined()
    expect(transform(test2)).toBeUndefined()
  })

  it("ignores default exports", () => {
    const expectedImports = `import reggex from "reggex"\n`
    const test =
      expectedImports +
      testTransformNoImport
        .replaceAll("match", "reggex.match")
        .replaceAll("compileReggex", "reggex.compileReggex")

    expect(transform(test)).toBeUndefined()
  })

  it("transforms js, jsx, ts, and tsx files", () => {
    expect(transform(testTransform, "test.js")).toEqual(expectedTransform)
    expect(transform(testTransform, "test.jsx")).toEqual(expectedTransform)
    expect(transform(testTransform, "test.ts")).toEqual(expectedTransform)
    expect(transform(testTransform, "test.tsx")).toEqual(expectedTransform)
  })

  it("handles namespaced imports", () => {
    const expectedImports = `import * as reggex from "reggex"\nimport * as reggex2 from "reggex"\n`
    const test =
      expectedImports +
      testTransformNoImport
        .replaceAll("match", "reggex.match")
        .replaceAll("compileReggex", "reggex2.compileReggex")

    expect(transform(test)).toEqual(expectedImports + expectedTransformNoImport)
  })

  it("handles renamed imports", () => {
    const expectedImports = `import { compileReggex as c, match as m } from "reggex"\n`
    const test =
      expectedImports +
      testTransformNoImport.replaceAll("match", "m").replaceAll("compileReggex", "c")

    expect(transform(test)).toEqual(expectedImports + expectedTransformNoImport)
  })

  it("handles more complex inputs", () => {
    const test = `
      import { something } from 'other-module'
      import { match, global, multiline, namedCapture, group, compileReggex } from "reggex"
      const re1 = group(namedCapture(test, match.anyChar.and.wordChar)).compile()

      const a = 7 === 5 ? 5 : 7
      console.log(a)
      const hmm = (c) => { a + 1 + c }

      const re2 = compileReggex(() => {
        const test = "test"
        const anyChar = match.anyChar
        return match.anyChar.as
          .namedCapture(test)
          .and.append(anyChar)
          .and.namedCapture(\`\${test}a\`, anyChar.as.namedCapture(test), {
            namespace: "pre",
            asPrefix: true
          })
          .and.group(anyChar.as.namedCapture(test), {
            namespace: "suf",
            asPrefix: false
          })
          .and.backreferenceTo("testsuf")
      }, [global])

      re2.test("abcab")

      const test = "hello"
      const re3 = compileReggex(() => {
        const wordAndChar = group(namedCapture(test, match.anyChar.and.wordChar))
        return match.anyChar.and.wordChar.as.namedCapture(test).and.anyChar.and.append(wordAndChar, { namespace: "pre", asPrefix: true })
      }, [multiline])
    `.trim()

    const expected = `
      import { something } from 'other-module'
      import { match, global, multiline, namedCapture, group, compileReggex } from "reggex"
      const re1 = group(namedCapture(test, match.anyChar.and.wordChar)).compile()

      const a = 7 === 5 ? 5 : 7
      console.log(a)
      const hmm = (c) => { a + 1 + c }

      const re2 = /(?<test>.).(?<testa>(?<pretest>.))(?:(?<testsuf>.))\\k<testsuf>/g

      re2.test("abcab")

      const test = "hello"
      const re3 = compileReggex(() => {
        const wordAndChar = group(namedCapture(test, match.anyChar.and.wordChar))
        return match.anyChar.and.wordChar.as.namedCapture(test).and.anyChar.and.append(wordAndChar, { namespace: "pre", asPrefix: true })
      }, [multiline])
    `.trim()

    expect(transform(test)).toEqual(expected)
  })
})

/* eslint-disable */
function transform(code: string | string[], id = "some-id.js", include?: RegExp[]) {
  const plugin = ReggexTransformerPlugin.vite(
    include === undefined ? undefined : { include }
  ) as any

  if ("transform" in plugin && typeof plugin.transform === "function") {
    return plugin.transform.call(
      { parse: (code: string) => parse(code, { ecmaVersion: 2022, sourceType: "module" }) },
      Array.isArray(code) ? code.join("\n") : code,
      id
    )?.code
  }
}
/* eslint-enable */
