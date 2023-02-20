import { Expand, InferState, Primitive, State, StateMerger, TupleToIntersection } from "@types"

export const DEFAULT_MESSAGE = "⚡ Ready for RegExp conversion!" as const

export function createState<
  Msg extends Primitive = typeof DEFAULT_MESSAGE,
  CurExp extends string = "",
  PrvExp extends string = "",
  Names extends string[] = [],
  Groups extends string[] = []
>(
  state?: Partial<State<Msg, CurExp, PrvExp, Names, Groups>>
): InferState<Expand<State<Msg, CurExp, PrvExp, Names, Groups>>> {
  return {
    msg: (state?.msg ?? DEFAULT_MESSAGE) as Msg,
    curExp: (state?.curExp ?? "") as CurExp,
    prvExp: (state?.prvExp ?? "") as PrvExp,
    names: (state?.names ?? []) as Names,
    groups: (state?.groups ?? []) as Groups,
  }
}

export function merger<DefaultState extends State>(defaultState: InferState<DefaultState>) {
  return function <
    NewState extends State<NewMsg, NewCurExp, NewPrvExp, NewNames, NewGroups>,
    NewMsg extends Primitive = never,
    NewCurExp extends string = never,
    NewPrvExp extends string = never,
    NewNames extends string[] = never,
    NewGroups extends string[] = never
  >(
    newState: Partial<State<NewMsg, NewCurExp, NewPrvExp, NewNames, NewGroups>>
  ): StateMerger<DefaultState, NewState> {
    return {
      msg: newState.msg ?? DEFAULT_MESSAGE,
      curExp: newState.curExp ?? defaultState.curExp,
      prvExp: newState.prvExp ?? defaultState.prvExp,
      names: [...(newState.names ?? defaultState.names)],
      groups: [...(newState.groups ?? defaultState.groups)],
    } as StateMerger<DefaultState, NewState>
  }
}

export function assign<T extends Record<any, any>, U extends Record<any, any>[]>(
  target: T,
  ...sources: U
): TupleToIntersection<T, U> {
  const isClass = (source: U[number]) => {
    return !Object.getOwnPropertyNames(Object.getPrototypeOf(source)).includes("__proto__")
  }

  const getKeys = (source: U[number]) => {
    const keys = Object.keys(source)
    const protoKeys = Object.getOwnPropertyNames(Object.getPrototypeOf(source))
    if (isClass(source)) {
      protoKeys.splice(protoKeys.indexOf("constructor"), 1)
      return [...keys, ...protoKeys]
    }

    return keys
  }

  const getSyms = (source: U[number]) => {
    const syms = Object.getOwnPropertySymbols(source)
    const protoSyms = Object.getOwnPropertySymbols(Object.getPrototypeOf(source))
    if (isClass(source)) {
      return [...syms, ...protoSyms]
    }

    return syms
  }

  const getDescriptor = (source: U[number], key: PropertyKey) => {
    if (isClass(source)) {
      const descriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(source), key)
      if (descriptor !== undefined) return Object.assign(descriptor, { enumerable: true })
    }

    return Object.getOwnPropertyDescriptor(source, key)
  }

  sources.forEach((source) => {
    const descriptors = getKeys(source).reduce<Record<PropertyKey, PropertyDescriptor>>(
      (descriptors, key) => {
        const descriptor = getDescriptor(source, key)
        if (descriptor !== undefined) descriptors[key] = descriptor
        return descriptors
      },
      {}
    )

    getSyms(source).forEach((sym) => {
      const descriptor = getDescriptor(source, sym)
      if (descriptor?.enumerable) {
        descriptors[sym] = descriptor
      }
    })

    Object.defineProperties(target, descriptors)
  })

  return target as TupleToIntersection<T, U>
}
