import { Reducer } from 'redux';

import {
  ActionType,
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
      case ActionType.UPDATE_CONFIG_TEXT:
        return applyUpdateConfigText(state, action);
      default:
        return state;
    }
  }
);

function applyUpdateConfigText(
  appState: ApplicationState,
  { configYamlText }: UpdateConfigTextAction
): ApplicationState {
  return {
    ...appState,
    configYamlText
  }
}
