import { State } from "@types"

export const DEFAULT_STATE = {
  message: "" as const,
  curExpression: "" as const,
  prevExpression: "" as const,
  groupNames: [] as [],
  groups: [] as [],
} satisfies State
