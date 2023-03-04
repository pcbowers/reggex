import {
  Flag,
  InferState,
  Join,
  Prettify,
  Primitive,
  State,
  StateMerger,
  TypedRegExp
} from "@types"
import { BaseReggex } from "BaseReggex"

export const DEFAULT_MESSAGE = "⚡ Ready for RegExp conversion!" as const

/**
 * Create a new state object
 * @param state The state object to merge with the default state
 * @returns The new state object
 */
export function createState<
  Msg extends Primitive = typeof DEFAULT_MESSAGE,
  CurExp extends string = "",
  PrvExp extends string = "",
  Names extends string[] = [],
  Groups extends string[] = []
>(
  state?: Partial<State<Msg, CurExp, PrvExp, Names, Groups>>
): InferState<Prettify<State<Msg, CurExp, PrvExp, Names, Groups>>> {
  return {
    msg: (state?.msg ?? DEFAULT_MESSAGE) as Msg,
    curExp: (state?.curExp ?? "") as CurExp,
    prvExp: (state?.prvExp ?? "") as PrvExp,
    names: (state?.names ?? []) as Names,
    groups: (state?.groups ?? []) as Groups
  }
}

/**
 * Create a function that merges the current state with the new state
 * @param curState The current state
 * @returns A function that merges the current state with the new state
 */
export function merger<CurState extends State>(curState: InferState<CurState>) {
  return function <
    NewState extends State<NewMsg, NewCurExp, NewPrvExp, NewNames, NewGroups>,
    NewMsg extends Primitive = never,
    NewCurExp extends string = never,
    NewPrvExp extends string = never,
    NewNames extends string[] = never,
    NewGroups extends string[] = never
  >(
    newState: Partial<State<NewMsg, NewCurExp, NewPrvExp, NewNames, NewGroups>>
  ): StateMerger<CurState, NewState> {
    return {
      msg: newState.msg ?? DEFAULT_MESSAGE,
      curExp: newState.curExp ?? curState.curExp,
      prvExp: newState.prvExp ?? curState.prvExp,
      names: [...(newState.names ?? curState.names)],
      groups: [...(newState.groups ?? curState.groups)]
    } as StateMerger<CurState, NewState>
  }
}

type TupleToIntersection<T, U extends unknown[]> = U extends [infer First, ...infer Rest]
  ? T & TupleToIntersection<First, Rest>
  : T

/**
 * A better Object.assign that merges the prototype properties while keeping the enumerable property descriptors
 * @param target The target object
 * @param sources The source objects
 * @returns The target object with the merged properties from the source objects
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function assign<T extends Record<any, any>, U extends Record<any, any>[]>(
  target: T,
  ...sources: U
): TupleToIntersection<T, U> {
  // Check if the source object is a class
  const isClass = (source: U[number]) => {
    return !Object.getOwnPropertyNames(Object.getPrototypeOf(source)).includes("__proto__")
  }

  // Get the keys of the source object
  const getKeys = (source: U[number]) => {
    const keys = Object.keys(source)
    const protoKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(source))
    if (isClass(source)) {
      protoKeys.splice(protoKeys.indexOf("constructor"), 1)
      return [...keys, ...protoKeys]
    }

    return keys
  }

  // Get the symbols of the source object
  const getSyms = (source: U[number]) => {
    const syms = Object.getOwnPropertySymbols(source)
    const protoSyms = Object.getOwnPropertySymbols(Object.getPrototypeOf(source))
    if (isClass(source)) {
      return [...syms, ...protoSyms]
    }

    return syms
  }

  // Get the property descriptor of the source object
  const getDescriptor = (source: U[number], key: PropertyKey) => {
    if (isClass(source)) {
      const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(source), key)
      if (descriptor !== undefined) return Object.assign(descriptor, { enumerable: true })
    }

    return Object.getOwnPropertyDescriptor(source, key)
  }

  // Loop through the source objects and get the property descriptors
  sources.forEach((source) => {
    // Get the property descriptors
    const descriptors = getKeys(source).reduce<Record<PropertyKey, PropertyDescriptor>>(
      (descriptors, key) => {
        const descriptor = getDescriptor(source, key)
        if (descriptor !== undefined) descriptors[key] = descriptor
        return descriptors
      },
      {}
    )

    // Get the symbol property descriptors
    getSyms(source).forEach((sym) => {
      const descriptor = getDescriptor(source, sym)
      if (descriptor?.enumerable) {
        descriptors[sym] = descriptor
      }
    })

    // Assign the property descriptors to the target object
    Object.defineProperties(target, descriptors)
  })

  // Return the target object
  return target as TupleToIntersection<T, U>
}

/**
 * Compile a Reggex into a TypedRegExp. If used with the transformer plugin, all uses of this function will be replaced with the compiled Reggex (assuming the function doesn't have any side effects)
 * @param func A function that returns a Reggex
 * @param flags The flags to compile the Reggex with
 * @returns The compiled TypedRegExp
 */
export function compileReggex<
  // parameter types
  ExtenderFunction extends (...args: unknown[]) => Return,
  Return extends BaseReggex<TState> = ReturnType<ExtenderFunction>,
  TState extends State = InferState<Return extends BaseReggex<infer S> ? S : State>,
  // return types
  Flags extends Flag[] = [],
  FinalFlags extends string = Join<Flags, "", "", false>,
  FinalExpression extends string = `/${TState["prvExp"]}${TState["curExp"]}/${FinalFlags}`
>(func: ExtenderFunction, flags?: [...Flags]): TypedRegExp<FinalExpression> {
  return func().compile(flags)
}
