import configYamlText from '../data/config.yaml';
import universeYamlText from '../data/universe.yaml';
import {createWorldFromYaml, World} from '../lib';

export interface ApplicationState {
  universeYamlText: string;
  configYamlText: string;
  world?: World;
  error?: Error;
}

export function initialState(): ApplicationState {
  try {
    const world = createWorldFromYaml(universeYamlText, configYamlText);
    return {
      universeYamlText,
      configYamlText,
      world,
      error: undefined
    };
  } catch (error) {
    return {
      universeYamlText,
      configYamlText,
      error: error as Error
    };
  }
}
