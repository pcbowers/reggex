import { Node, walk } from "estree-walker"
import MagicString from "magic-string"
import { findStaticImports, parseStaticImport } from "mlly"
import { createUnplugin } from "unplugin"
import { Context, createContext, runInContext } from "vm"
import * as reggex from "./index"

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */

/**
 * Options for the ReggexTransformerPlugin
 * @param include - An array of regexes that will be used to match any files that should be transformed
 */
export interface Options {
  /**
   * An array of regexes that will be used to match any files that should be transformed
   */
  include: RegExp[]
}

export const ReggexTransformerPlugin = createUnplugin(
  (options: Options = { include: [/\.[tj]sx?$/g] }) => {
    return {
      name: "reggex-transformer-plugin",
      enforce: "post",

      transformInclude(id) {
        // transform only files that match the include option
        return options.include.some((r) => r.test(id))
      },

      transform(code, id) {
        // only transform files that import from reggex
        if (!code.includes("reggex")) return

        const statements = findStaticImports(code).filter((i) => i.specifier === "reggex")

        const context: Context = { ...reggex }
        const namespaces: string[] = []
        const wrappers: string[] = []

        for (const statement of statements.flatMap((i) => parseStaticImport(i))) {
          // add all exports from reggex to the context under a namespace
          if (statement.namespacedImport) {
            namespaces.push(statement.namespacedImport)
            context[statement.namespacedImport] = reggex
          }

          // add all named exports from reggex to the context
          if (statement.namedImports) {
            for (const [name, alias] of Object.entries(statement.namedImports)) {
              context[alias] = reggex[name as keyof typeof reggex]
            }

            // if the user imported compileReggex, add it to the wrappers
            if (statement.namedImports.compileReggex) {
              wrappers.push(statement.namedImports.compileReggex)
            }
          }

          // default exports are ignored
        }

        const nodeContext = createContext(context)
        const s = new MagicString(code)

        walk(this.parse(code) as Node, {
          enter(node) {
            // only transform SimpleCallExpressions
            if (node.type !== "CallExpression") return

            // only transform calls to compileReggex or if it's a namespaced import
            // @ts-expect-error - this is a hack to get around the fact that the types for estree-walker are finnicky here
            if (!wrappers.includes(node.callee.name)) {
              if (
                node.callee.type !== "MemberExpression" ||
                node.callee.object.type !== "Identifier" ||
                node.callee.property.type !== "Identifier" ||
                node.callee.property.name !== "compileReggex" ||
                !namespaces.includes(node.callee.object.name)
              )
                return
            }

            // extract the start and end of the node
            const { start, end } = node as unknown as { start: number; end: number }

            try {
              // evaluate the code and replace the call with the result
              const value = runInContext(code.slice(start, end), nodeContext).toString()
              s.overwrite(start, end, value)
            } catch {
              // silently ignore if the evaluation failed because Reggex can be evaluated at runtime
            }
          }
        })

        // only return the transformed code if it has changed
        if (!s.hasChanged()) return

        return {
          code: s.toString(),
          map: s.generateMap({ includeContent: true, source: id })
        }
      }
    }
  }
)
