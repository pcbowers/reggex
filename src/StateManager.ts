import { State, StateMerger } from "@types"
import { DEFAULT_STATE } from "@utils"

export class StateManager<
  TState extends State<Message, CurExpression, PrevExpression, GroupNames, Groups>,
  Message extends string = TState["message"],
  CurExpression extends string = TState["curExpression"],
  PrevExpression extends string = TState["prevExpression"],
  GroupNames extends string[] = TState["groupNames"],
  Groups extends string[] = TState["groups"]
> {
  constructor(protected state: TState) {}

  protected merge<
    NewState extends State<
      TMessage,
      TCurExpression,
      TPrevExpression,
      [...TGroupNames],
      [...TGroups]
    >,
    MergedState extends StateMerger<TState, NewState>,
    TMessage extends string = never,
    TCurExpression extends string = never,
    TPrevExpression extends string = never,
    TGroupNames extends string[] = never,
    TGroups extends string[] = never
  >(
    newState: Partial<
      State<TMessage, TCurExpression, TPrevExpression, [...TGroupNames], [...TGroups]>
    >
  ): MergedState {
    return {
      curExpression: newState.curExpression ?? this.state.curExpression,
      message: newState.message ?? this.state.message,
      prevExpression: newState.prevExpression ?? this.state.prevExpression,
      groupNames: [
        ...this.state.groupNames.filter((str) => str !== ""),
        ...(newState.groupNames ?? []).filter((str) => str !== ""),
      ],
      groups: [
        ...this.state.groups.filter((str) => str !== ""),
        ...(newState.groups ?? []).filter((str) => str !== ""),
      ],
    } as MergedState
  }

  protected appendStateToCurrent<
    NewState extends State<
      TMessage,
      `${TPrevExpression}${TCurExpression}`,
      `${PrevExpression}${CurExpression}`,
      [...TGroupNames],
      [...TGroups]
    >,
    MergedState extends StateMerger<TState, NewState>,
    TMessage extends string,
    TCurExpression extends string,
    TPrevExpression extends string,
    TGroupNames extends string[],
    TGroups extends string[]
  >(
    instance: StateManager<
      State<TMessage, TCurExpression, TPrevExpression, [...TGroupNames], [...TGroups]>
    >
  ): MergedState {
    return this.merge({
      curExpression: `${instance.state.prevExpression}${instance.state.curExpression}`,
      prevExpression: `${this.state.prevExpression}${this.state.curExpression}`,
      message: instance.state.message,
      groupNames: instance.state.groupNames,
      groups: instance.state.groups,
    })
  }

  protected appendState<
    NewState extends State<
      TMessage,
      TCurExpression,
      `${PrevExpression}${CurExpression}${TPrevExpression}`,
      [...TGroupNames],
      [...TGroups]
    >,
    MergedState extends StateMerger<TState, NewState>,
    TMessage extends string,
    TCurExpression extends string,
    TPrevExpression extends string,
    TGroupNames extends string[],
    TGroups extends string[]
  >(
    instance: StateManager<
      State<TMessage, TCurExpression, TPrevExpression, [...TGroupNames], [...TGroups]>
    >
  ): MergedState {
    return this.merge({
      curExpression: instance.state.curExpression,
      prevExpression: `${this.state.prevExpression}${this.state.curExpression}${instance.state.prevExpression}`,
      message: instance.state.message,
      groupNames: instance.state.groupNames,
      groups: instance.state.groups,
    })
  }

  protected beginNewExp() {
    return this.merge({
      curExpression: "",
      prevExpression: `${this.state.prevExpression}${this.state.curExpression}`,
    })
  }

  static create() {
    return new StateManager(DEFAULT_STATE)
  }
}
