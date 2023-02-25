import { merger } from "@utils"
import { InferState, State } from "./types/state"

export class BaseReggex<CurState extends State> {
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
}
