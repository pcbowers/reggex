import { merger } from "@utils"
import { InferState, State } from "./types/state"

export class BaseRegExp<CurState extends State> {
  /**
   * Merge the current state with the new state
   * @param newState The new state to merge with the default state
   * @returns The merged state
   */
  protected merge

  constructor(protected state: InferState<CurState>) {
    this.merge = merger(this.state)
  }

  getState(): InferState<CurState> {
    return {
      msg: this.state.msg,
      curExp: this.state.curExp,
      prvExp: this.state.prvExp,
      names: [...this.state.names],
      groups: [...this.state.groups],
    }
  }

  static extend<Return, ExtenderFunction extends (...args: any[]) => Return>(
    value: ExtenderFunction,
    options: {
      name: string
      type?: "getMethod" | "method" | "value"
    }
  ) {
    Object.defineProperty(this.prototype, options.name, {
      [options.type === "getMethod" ? "get" : "value"]: value(),
    })

    return value
  }
}
