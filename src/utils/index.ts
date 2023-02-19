import { Expand, Primitive, State } from "@types"

export function state<
  Msg extends Primitive = "⚡ Ready for RegExp conversion!",
  CurExp extends string = "",
  PrvExp extends string = "",
  Names extends string[] = [],
  Groups extends string[] = []
>(
  state?: Partial<State<Msg, CurExp, PrvExp, Names, Groups>>
): Expand<State<Msg, CurExp, PrvExp, Names, Groups>> {
  return {
    msg: (state?.msg ?? "⚡ Ready for RegExp conversion!") as Msg,
    curExp: (state?.curExp ?? "") as CurExp,
    prvExp: (state?.prvExp ?? "") as PrvExp,
    names: (state?.names ?? []) as Names,
    groups: (state?.groups ?? []) as Groups,
  }
}

export const DEFAULT_STATE = state()
