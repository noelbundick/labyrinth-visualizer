export enum ActionType {
  UPDATE_CONFIG_TEXT = 'UPDATE_CONFIG_TEXT'
};

export interface UpdateConfigTextAction {
  type: ActionType.UPDATE_CONFIG_TEXT;
  configYamlText: string;
};

export type AnyAction = (
  UpdateConfigTextAction
);
