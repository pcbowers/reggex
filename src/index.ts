import { Appenders } from "./Appenders"
import { Inputs } from "./Inputs"

export * from "@types"
export * from "@utils"
export * from "./Groups"
export * from "./Appenders"
export * from "./Inputs"
export * from "./Quantifiers"
export * from "./Reggex"

export const anyChar = Inputs.create().anyChar
export const controlChar = Inputs.create().controlChar
export const hexCode = Inputs.create().hexCode
export const unicodeChar = Inputs.create().unicodeChar
export const wordChar = Inputs.create().wordChar
export const match = Inputs.create()

export const capture = Appenders.create().capture
export const group = Appenders.create().group
export const namedCapture = Appenders.create().namedCapture
