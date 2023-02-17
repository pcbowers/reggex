declare const brand: unique symbol
declare interface Err<Token> {
  readonly [brand]: Token
}

export type Assert<T, Value = true, ErrorMessage = "ERROR"> = T extends Value
  ? {}
  : Err<ErrorMessage>
