import { State, StateMerger, Primitive, GroupReferences } from "@types"
import { DEFAULT_STATE } from "@utils"

export abstract class StateManager<
  CurState extends State<Msg, CurExp, PrvExp, Names, Groups>,
  Msg extends Primitive = CurState["msg"],
  CurExp extends string = CurState["curExp"],
  PrvExp extends string = CurState["prvExp"],
  Names extends string[] = CurState["names"],
  Groups extends string[] = CurState["groups"]
> {
  constructor(protected state: CurState) {}

  protected merge<
    NewState extends State<NewMsg, NewCurExp, NewPrvExp, NewNames, NewGroups>,
    MergedState extends StateMerger<CurState, NewState>,
    NewMsg extends Primitive = never,
    NewCurExp extends string = never,
    NewPrvExp extends string = never,
    NewNames extends string[] = never,
    NewGroups extends string[] = never
  >(newState: Partial<State<NewMsg, NewCurExp, NewPrvExp, NewNames, NewGroups>>): MergedState {
    return {
      curExp: newState.curExp ?? this.state.curExp,
      msg: newState.msg ?? DEFAULT_STATE.msg,
      prvExp: newState.prvExp ?? this.state.prvExp,
      names: [...(newState.names ?? this.state.names)],
      groups: [...(newState.groups ?? this.state.groups)],
    } as MergedState
  }

  protected extractState<
    InstanceState extends State<TMsg, TCurExp, TPrvExp, TNames, TGroups>,
    TMsg extends Primitive,
    TCurExp extends string,
    TPrvExp extends string,
    TNames extends string[],
    TGroups extends string[]
  >(instance: StateManager<InstanceState>): InstanceState {
    return {
      msg: instance.state.msg,
      curExp: instance.state.curExp,
      prvExp: instance.state.prvExp,
      names: [...instance.state.names],
      groups: [...instance.state.groups],
    } as InstanceState
  }

  protected get validRefs(): GroupReferences<Names, Groups> {
    return [...this.state.names, ...Object.keys(this.state.groups)] as GroupReferences<
      Names,
      Groups
    >
  }

  protected isValidRef(ref: string | number): ref is GroupReferences<Names, Groups>[number] {
    return !this.state.names.includes(ref as string) && !this.state.groups[ref as number]
  }
}
