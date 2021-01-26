import { Cycle, FlowNode, Graph, NodeSpec, Path } from 'labyrinth-nsg';
import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import {GoArrowRight} from 'react-icons/go';
import {GrNetwork, GrServer} from 'react-icons/gr';
import {connect} from 'react-redux'
import {RouteComponentProps, withRouter} from "react-router";
import {Link, Redirect} from 'react-router-dom';

import {AnalyzerPathProps, Direction, World} from '../lib';
import {ApplicationState} from '../redux';

interface Props extends RouteComponentProps<any> {
  world?: World;
}

class AnalyzeMode extends React.Component<Props> {
  onSelect = (detailKey: string | null) => {
    console.log(`onSelect(${detailKey})`);
    const history = this.props.history;
    const a = new AnalyzerPathProps(
      this.props.location.pathname,
      this.props.world!.graph.nodes.map(node => node.spec)
    );
    history.push(a.end(detailKey!));
  }

  render() {
    const world = this.props.world;
    console.log('this.props.location.search:');
    console.log(JSON.stringify(this.props.location.search));
    if (world === undefined) {
      return this.renderNoGraphError();
    } else {
      const graph = world.graph;
      const nodes = graph.nodes.map(node => node.spec);
      const path = this.props.location.pathname;
      const a = new AnalyzerPathProps(path, nodes);
      console.log(a.path());

      if (a.redirect) {
        console.log(`Redirecting from ${path} to ${a.path()}`)
        return <Redirect to={a.path()} />
      } else {
        return this.renderPage(a, nodes, graph);
      }
    }
  }

  renderNoGraphError() {
    return <div>
      One or more errors in the network configuration are preventing analysis.
      Return to the <Link to='/edit'>Configuration Pane</Link> to fix the errors.
    </div>
  }

  renderPage(a: AnalyzerPathProps, nodes: NodeSpec[], graph: Graph) {
    if (!nodes.find(node => node.key === a.startKey)) {
      return this.renderUnknownNodeError(a, nodes);
    } else {
      return this.renderValidPage(a, nodes, graph);
    }
  }

  renderUnknownNodeError(a: AnalyzerPathProps, nodes: NodeSpec[]) {
    return (
      <div>
        { renderRouteSelectors(a, nodes)}
        <div>Unknown node {a.startKey}</div>
      </div>
    )
  }

  renderValidPage(a: AnalyzerPathProps, nodes: NodeSpec[], graph: Graph) {
    // TODO: cache this computation. Only recompute if inputs change.
    const { cycles, flows } = graph.analyze(a.startKey, a.direction === Direction.FROM);

    // Only render flows for reachable nodes.
    const filteredFlows = flows.filter(
      flow => flow.paths.length > 0
    );

    return (
      <div>
        { renderRouteSelectors(a, nodes)}
        { renderExpanation(a, filteredFlows)}

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            width: '100%'
          }}
        >
          {this.renderMaster(a, filteredFlows)}
          {this.renderDetail(a, graph, filteredFlows, cycles)}
        </div>
      </div>
    );
  }

  renderMaster(a: AnalyzerPathProps, flows: FlowNode[]) {
    return (
      <div style={{ backgroundColor: 'lightgray' }}>
        <Nav
          className="flex-column"
          variant="pills"
          activeKey={a.endKey}
          onSelect={this.onSelect}
        >
          {
            flows.map((flow) => {
              const key = flow.node.key;
              const path = a.end(key);
              return (
                <Nav.Item key={key} style={{ paddingTop: '0', paddingBottom: '0' }}>
                  <Nav.Link
                    to={path}
                    eventKey={key}
                    as={Link}
                    style={{
                      whiteSpace: 'nowrap',
                      paddingTop: '0',
                      paddingBottom: '0'
                    }}
                  >
                    <GrServer style={{
                      visibility: flow.node.isEndpoint ? 'visible' : 'hidden',
                      marginRight: '5px'
                    }} />
                    {key}
                  </Nav.Link>
                </Nav.Item>
              )
            })
          }
        </Nav>
      </div>
    );
  }

  renderDetail(
    a: AnalyzerPathProps,
    graph: Graph,
    flows: FlowNode[],
    cycles: Cycle[]
  ) {
    console.log('cycles:');
    console.log(JSON.stringify(cycles, null, 2));
    if (!a.endKey) {
      return <div></div>
    } else {
      const flow = flows.find(flow => flow.node.key === a.endKey);
      if (flow === undefined) {
        return <div>Unknown node "{a.endKey}"</div>
      } else {
        return (
          <div style={{ flexGrow: 1, backgroundColor: 'lightblue' }}>
            {renderCycles(a, graph, cycles, a.direction === Direction.FROM)}
            <b>
              {
                // TODO: handle case where there are no routes
                (a.direction === Direction.TO) ?
                  `Routes from ${a.endKey} to ${a.startKey}` :
                  `Routes from ${a.startKey} to ${a.endKey}`
              }
            </b>
            <div>
              <pre>
                {flow.routes.format({})}
              </pre>
            </div>

            <b>
              {
                // TODO: handle case where there are no paths
                (a.direction === Direction.TO) ?
                  `Paths from ${a.endKey} to ${a.startKey}` :
                  `Paths from ${a.startKey} to ${a.endKey}`
              }
            </b>
            <div>
              {
                flow.paths.map((path, index) => (
                  <div key={index}>
                    {renderPath(a, graph, path, a.direction === Direction.FROM)}
                  </div>
                ))
              }
            </div>
          </div>
        );
      }
    }
  }
}

function renderExpanation(
  a: AnalyzerPathProps,
  flows: FlowNode[]
) {
  if (flows.length === 0) {
    if (a.direction === Direction.TO) {
      return (
        <div>
          There are no nodes with routes to the <b>{a.startKey}</b> node.
        </div>
      )
    } else {
      return (
        <div>
          The <b>{a.startKey}</b> node has no routes to other nodes.
        </div>
      )
    }
  } else {
    if (a.direction === Direction.TO) {
      return (
        <div>
          The nodes listed below have routes to the <b>{a.startKey}</b> node.
          Click on each node for more information.
        </div>
      )
    } else {
      return (
        <div>
          The <b>{a.startKey}</b> node has routes to the nodes listed below.
          Click on each node for more information.
        </div>
      )
    }
  }
}

function renderRouteSelectors(a: AnalyzerPathProps, nodes: NodeSpec[]) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      width: '100%',
    }}>
      <span style={{
        fontSize: '15pt',
        paddingRight: '1ex'
      }}>
        Routes
      </span>
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          {a.direction === Direction.TO ? 'To' : 'From'}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item to={a.to()} as={Link}>To</Dropdown.Item>
          <Dropdown.Item to={a.from()} as={Link}>From</Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
      <Dropdown>
        <Dropdown.Toggle variant="light" id="dropdown-basic">
          {a.startKey}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {
            nodes.map((node) => {
              const key = node.key;
              return <Dropdown.Item to={a.start(key)} key={key} as={Link}>{key}</Dropdown.Item>
            })
          }
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

function renderPath(
  a: AnalyzerPathProps,
  graph: Graph,
  path: Path,
  outbound: boolean
) {
  // if (path.routes.isEmpty()) {
  //   return null;
  // }

  console.log(JSON.stringify(path, null, 2));

  const keys: string[] = [];
  let p: Path | undefined = path;

  if (outbound) {
    while (p) {
      keys.unshift(graph.nodes[p.node].key);
      p = p.previous;
    }
  } else {
    while (p) {
      keys.push(graph.nodes[p.node].key);
      p = p.previous;
    }
  }

  const elements: JSX.Element[] = [];
  for (const [i, key] of keys.entries()) {
    if (i !== 0) {
      elements.push(<GoArrowRight key={'_arrow' + i} />);
    }
    elements.push(<Link to={key} key={key + i.toString()}>{key}</Link>);
  }

  elements.push(
    <pre key={'xyz'}>
      {path.routes.format({ prefix: '  ' })}
    </pre>
  );

  return elements;
}

function renderCycles(
  a: AnalyzerPathProps,
  graph: Graph,
  cycles: Cycle[],
  outbound: boolean
) {
  if (cycles.length === 0) {
    return null;
  }

  return (
    <div style={{ backgroundColor: 'lightpink' }}>
      <b>
        {
          (a.direction === Direction.TO) ?
            `Cycles to ${a.startKey}` :
            `Cycles from ${a.startKey}`
        }
      </b>
      <div>
        {
          cycles.map((path, index) => (
            <div key={index}>
              {renderOneCycle(a, graph, path, outbound)}
            </div>
          ))
        }
      </div>
    </div>
  );

}

function renderOneCycle(
  a: AnalyzerPathProps,
  graph: Graph,
  cycle: Cycle,
  outbound: boolean
) {
  const keys: string[] = [];

  if (outbound) {
    for (const p of cycle) {
      keys.unshift(graph.nodes[p.node].key);
    }
  } else {
    for (const p of cycle) {
      keys.push(graph.nodes[p.node].key);
    }
  }

  const elements: JSX.Element[] = [];
  for (const [i, key] of keys.entries()) {
    if (i !== 0) {
      elements.push(<GoArrowRight key={'_arrow' + i} />);
    }
    elements.push(<Link to={key} key={key + i.toString()}>{key}</Link>);
  }

  elements.push(
    <pre key={'xyz'}>
      {cycle[0].routes.format({ prefix: '  ' })}
    </pre>
  );

  return elements;
}

function mapStateToProps({ world }: ApplicationState) {
  return { world };
}

export default connect(mapStateToProps)(withRouter(AnalyzeMode))
