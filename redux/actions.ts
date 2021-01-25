export enum ActionType {
  ANALYZE = 'ANALYZE',
  UPDATE_CONFIG_TEXT = 'UPDATE_CONFIG_TEXT'
};

export interface AnalyzeAction {
  type: ActionType.ANALYZE;
  configYamlText: string;
  universeYamlText: string;
};

export function analyzeAction(
  universeYamlText: string,
  configYamlText: string
): AnalyzeAction {
  return {
    type: ActionType.ANALYZE,
    configYamlText,
    universeYamlText
  }
}

export interface UpdateConfigTextAction {
  type: ActionType.UPDATE_CONFIG_TEXT;
  configYamlText: string;
};

export function updateConfigTextAction(configYamlText: string): UpdateConfigTextAction {
  return {
    type: ActionType.UPDATE_CONFIG_TEXT,
    configYamlText
  }
}

export type AnyAction = (
  AnalyzeAction |
  UpdateConfigTextAction
);
