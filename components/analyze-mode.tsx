import { Cycle, FlowNode, Graph, NodeSpec, Path } from 'labyrinth-nsg';
import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import {GoArrowRight} from 'react-icons/go';
import {GrNetwork, GrServer} from 'react-icons/gr';
import {ImCheckboxChecked} from 'react-icons/im';
import {connect} from 'react-redux'
import {RouteComponentProps, withRouter} from "react-router";
import {Link, Redirect} from 'react-router-dom';
// import { URLSearchParams } from "url"
// import url from 'url';
// const url = require('url');

import {AnalyzerPathProps, Direction, World} from '../lib';
import {ApplicationState} from '../redux';

interface Props extends RouteComponentProps<any> {
  world?: World;
}

class AnalyzeMode extends React.Component<Props> {
  onSelect = (detailKey: string | null) => {
    console.log(`onSelect(${detailKey})`);
    const history = this.props.history;

    // TODO: REVIEW: is there any way we can avoid this seemingly
    // redundant call to AnalyzerPathProps.create()?
    const a = AnalyzerPathProps.create(
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
      const a = AnalyzerPathProps.create(path, nodes);
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
    return (
      <div style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <div style={{fontSize: '16pt'}}>
          One or more errors in the network configuration are preventing analysis.
          Return to the <Link to='/edit'>Configuration Pane</Link> to fix the errors.
        </div>
      </div>
    )
  }

  renderPage(a: AnalyzerPathProps, nodes: NodeSpec[], graph: Graph) {
    if (!nodes.find(node => node.key === a.startKey)) {
      return this.renderUnknownNodeError(a, nodes);
    } else {
      // TODO: extract filter params here.
      // Handle bad filter error.
      // Analyze graph here.
      // Handle analysis failure here.
      // Move graph analysis and filtering code to lib.
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
    // TODO: surround with try/catch block
    const { cycles, flows } = graph.analyze(a.startKey, a.isOutbound);

    // Only render flows for reachable nodes.
    const filteredFlows = flows.filter(
      flow => flow.paths.length > 0
    );

    return (
      <div>
        {renderRouteSelectors(a, nodes)}
        {renderFilters(a, this.props.location.search)}
        {renderExpanation(a, filteredFlows)}

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
            {renderCycles(a, graph, cycles, a.isOutbound)}
            <b>
              {
                // TODO: handle case where there are no routes
                a.isOutbound ?
                `Routes from ${a.startKey} to ${a.endKey}` :
                `Routes from ${a.endKey} to ${a.startKey}`
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
                a.isOutbound ?
                  `Paths from ${a.startKey} to ${a.endKey}` :
                  `Paths from ${a.endKey} to ${a.startKey}`
              }
            </b>
            <div>
              {
                flow.paths.map((path, index) => (
                  <div key={index}>
                    {renderPath(a, graph, path, a.isOutbound)}
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
    if (a.isOutbound) {
      return (
        <div>
          The <b>{a.startKey}</b> node has no routes to other nodes.
        </div>
      )
    } else {
      return (
        <div>
          There are no nodes with routes to the <b>{a.startKey}</b> node.
        </div>
      )
    }
  } else {
    if (a.isOutbound) {
      return (
        <div>
          The <b>{a.startKey}</b> node has routes to the nodes listed below.
          Click on each node for more information.
        </div>
      )
    } else {
      return (
        <div>
          The nodes listed below have routes to the <b>{a.startKey}</b> node.
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
          {a.isOutbound ? 'From': 'To'}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          <Dropdown.Item to={a.to().path()} as={Link}>To</Dropdown.Item>
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

function renderFilters(a: AnalyzerPathProps, query: string) {
  // const x = new url.URLSearchParams(query);

  const params = [...new URLSearchParams(query).entries()];
  // let count = 0;
  // const result: {[others: string]: string} = {};
  // for(const [key, value] of params) {
  //   result[key] = value;
  //   count++;
  // }

  if (params.length === 0) {
    return null;
  } else {
    return (
      <div>
        <div style={{fontSize: '15pt'}}>
          Filters
        </div>
          {params.map(([key,value]) => (
            <div style={{marginLeft: '2ex'}}>
              <ImCheckboxChecked/>
              <b>{key}:</b>
              {value}
            </div>
          ))}
      </div>
    )
  }
}

function renderPath(
  a: AnalyzerPathProps,
  graph: Graph,
  path: Path,
  outbound: boolean
) {
  // TODO: figure out this case.
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
          a.isOutbound ?
            `Cycles from ${a.startKey}` :
            `Cycles to ${a.startKey}`
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
      keys.push(graph.nodes[p.node].key);
    }
  } else {
    for (const p of cycle) {
      keys.unshift(graph.nodes[p.node].key);
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
