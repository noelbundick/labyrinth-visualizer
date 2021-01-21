import * as yaml from 'js-yaml';
import { Reducer } from 'redux';

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

  const nodes = yaml.load(configYamlText) as string[];

  console.log('applyAnalyze');
  console.log('nodes:');
  console.log(JSON.stringify(nodes, null, 2));

  return {
    ...appState,
    nodes
  }
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
