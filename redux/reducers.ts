import {firewallSpec, loadYamlNodeSpecs} from 'labyrinth-nsg';
import {Reducer} from 'redux';

import {createWorld} from '../lib';

import {
  ActionType,
  AnalyzeAction,
  AnyAction,
  UpdateConfigTextAction,
} from './actions';

import {
  ApplicationState,
  initialState,
} from './application-state';

export const ApplicationStateReducer: Reducer<ApplicationState, AnyAction> = (
  (state: ApplicationState = initialState(), action): ApplicationState => {
    switch (action.type) {
      case ActionType.ANALYZE:
        return applyAnalyze(state, action);
      case ActionType.UPDATE_CONFIG_TEXT:
        return applyUpdateConfigText(state, action);
      default:
        return state;
    }
  }
);

function applyAnalyze(
  appState: ApplicationState,
  { configYamlText }: AnalyzeAction
): ApplicationState {

  // TODO: put this all in a function wrapped in a try/catch.
  // Share with initialState()
  // const nodes = yaml.load(configYamlText) as NodeSpec[];
  // const builder = new GraphBuilder(appState.universe, appState.simplifier, nodes);
  // const graph = builder.buildGraph();

  
  try {
    const graphSpec = loadYamlNodeSpecs(configYamlText);
    const world = createWorld(firewallSpec, graphSpec);
    return {
      ...appState,
      configYamlText,
      world,
      error: undefined
    };
  } catch (error) {
    return {
      ...appState,
      world: undefined,
      error: error as Error
    };
  }
  // console.log('applyAnalyze');
  // console.log('nodes:');
  // console.log(JSON.stringify(nodes, null, 2));

  // return {
  //   ...appState,
  //   nodes,
  //   graph
  // }
}

function applyUpdateConfigText(
  appState: ApplicationState,
  { configYamlText }: UpdateConfigTextAction
): ApplicationState {
  return {
    ...appState,
    configYamlText
  }
}
