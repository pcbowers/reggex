import { Flag, InferState, Join, State as S, TypedRegExp } from "@types"
import { merger } from "@utils"

export class BaseReggex<CurState extends S> {
  /**
   * Merge the current state with the new state
   * @param newState The new state to merge with the default state
   * @returns The merged state
   */
  protected merge

  constructor(protected state: InferState<CurState>) {
    this.merge = merger(this.state)
  }

  /**
   * Get the current state
   * @returns The current state
   */
  getState(): InferState<CurState> {
    return {
      msg: this.state.msg,
      curExp: this.state.curExp,
      prvExp: this.state.prvExp,
      names: [...this.state.names],
      groups: [...this.state.groups]
    }
  }

  /**
   * Extend the class with a new method
   * @param value The method to extend the class with
   * @param options The options for the method (name, type)
   * @returns The passed in method for type inference
   */
  static extend<Return, ExtenderFunction extends (...args: unknown[]) => Return>(
    value: ExtenderFunction,
    options: {
      name: string
      type?: "getMethod" | "method" | "value"
    }
  ): ExtenderFunction {
    Object.defineProperty(this.prototype, options.name, {
      [options.type === "getMethod" ? "get" : "value"]: value()
    })

    return value
  }

  compile<
    Flags extends Flag[] = [],
    FinalFlags extends string = Join<Flags, "", "", false>,
    FinalExpression extends string = `/${CurState["prvExp"]}${CurState["curExp"]}/${FinalFlags}`
  >(flags?: [...Flags]): TypedRegExp<FinalExpression> {
    const exp = `${this.state.prvExp}${this.state.curExp}`
    const flagsString = (flags ?? []).join("")
    return new RegExp(exp, flagsString) as TypedRegExp<FinalExpression>
  }
}

export const global = "g"
export const ignoreCase = "i"
export const multiline = "m"
export const dotAll = "s"
export const unicode = "u"
export const sticky = "y"
export const hasIndices = "d"
