import * as yaml from 'js-yaml';
import { firewallSpec, loadYamlNodeSpecs, NodeSpec} from 'labyrinth-nsg';

import { createWorld, World } from '../lib';

export interface ApplicationState {
  universeYamlText: string;
  configYamlText: string;
  world?: World;
  error?: Error;
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

  const nodes: NodeSpec[] = [
    {
      name: 'internet',
      key: 'internet',
      endpoint: true,
      rules: [
        {
          destination: 'gateway',
        },
      ],
    },
    {
      name: 'gateway',
      key: 'gateway',
      rules: [
        {
          destination: 'subnet1',
          destinationIp: '10.0.0.0/8',
        },
        {
          destination: 'subnet2',
          destinationIp: '10.0.0.0/7',
        },
      ],
    },
    {
      name: 'subnet1',
      key: 'subnet1',
      rules: [
        {
          destination: 'subnet2',
          destinationPort: '80',
        },
        {
          destination: 'subnet3',
        },
      ],
    },
    {
      name: 'subnet2',
      key: 'subnet2',
      rules: [
        {
          destination: 'server',
          protocol: 'tcp',
        },
      ],
    },
    {
      name: 'subnet3',
      key: 'subnet3',
      rules: [],
    },
    {
      name: 'server',
      key: 'server',
      endpoint: true,
      rules: [
        {
          destination: 'subnet2',
          destinationIp: 'except loopback'
        }
      ],
    },
  ];

  const configYamlText = yaml.dump(nodes);
  const universeYamlText = yaml.dump(firewallSpec);

  // TODO: put this all in a function wrapped in a try/catch.
  // Share with applyAnalyze()
  try {
    const graphSpec = loadYamlNodeSpecs(configYamlText);
    const world = createWorld(firewallSpec, graphSpec);
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
