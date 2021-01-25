import * as yaml from 'js-yaml';

import {
  createSimplifier,
  ForwardRuleSpecEx,
  Graph,
  GraphBuilder,
  NodeSpec,
  Simplifier,
  Universe,
  UniverseSpec
} from "labyrinth-nsg";

export interface World {
  graph: Graph,
  universe: Universe,
  simplifier: Simplifier<ForwardRuleSpecEx>,
}

export function createWorld(
  universeSpec: UniverseSpec,
  nodes: NodeSpec[]
): World {
  const universe = new Universe(universeSpec);
  const simplifier = createSimplifier<ForwardRuleSpecEx>(universe);
  const builder = new GraphBuilder(universe, simplifier, nodes);
  const graph = builder.buildGraph();

  return { graph, universe, simplifier };
}
