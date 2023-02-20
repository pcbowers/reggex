import { Appenders } from "./Appenders"
import { Characters } from "./Characters"

export * from "@types"
export * from "@utils"
export * from "./Groups"
export * from "./Appenders"
export * from "./Characters"
export * from "./Quantifiers"
export * from "./TypedRegExp"

export const anyChar = Characters.create().anyChar
export const controlChar = Characters.create().controlChar
export const hexCode = Characters.create().hexCode
export const unicodeChar = Characters.create().unicodeChar
export const wordChar = Characters.create().wordChar
export const match = Characters.create()

export const capture = Appenders.create().capture
export const group = Appenders.create().group
export const namedCapture = Appenders.create().namedCapture
