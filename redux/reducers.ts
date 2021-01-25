import {Reducer} from 'redux';

import {createWorldFromYaml} from '../lib';

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
  { configYamlText, universeYamlText }: AnalyzeAction
): ApplicationState {

  try {
    const world = createWorldFromYaml(universeYamlText, configYamlText);

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
