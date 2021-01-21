import * as yaml from 'js-yaml';

export interface ApplicationState {
  configYamlText: string;
}

export function initialState(): ApplicationState {
  const config = {
    types: [
      {
        name: 'ip address',
        key: 'ip',
        parser: 'ip',
        formatter: 'ip',
        domain: '0.0.0.0-255.255.255.255',
        values: [
          {symbol: 'internet', range: '0.0.0.0-255.255.255.255'},
          {symbol: 'localhost', range: '127.0.0.1'},
          {symbol: 'loopback', range: '127.0.0.0/8'},
        ],
      },
    ]  
  };

  const configYamlText = yaml.dump(config);

  return {configYamlText};
}
