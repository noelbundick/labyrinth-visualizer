import {FlowNode, Graph, NodeSpec, Path} from 'labyrinth-nsg';
import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import { GoArrowLeft, GoArrowRight } from 'react-icons/go';
import {connect} from 'react-redux'
import {RouteComponentProps, withRouter} from "react-router";
import {Link, Redirect} from 'react-router-dom';

import {AnalyzerPathProps, Direction} from '../lib';
import {ApplicationState} from '../redux';

interface Props extends RouteComponentProps<any> {
  nodes: NodeSpec[] | undefined;
  graph: Graph | undefined;
}

class AnalyzeMode extends React.Component<Props> {
  onSelect = (detailKey: string | null) => {
    console.log(`onSelect(${detailKey})`);
    const history = this.props.history;
    const a = new AnalyzerPathProps(
      this.props.location.pathname,
      this.props.nodes
    );
    history.push(a.end(detailKey!));
  }

  render() {
    const nodes = this.props.nodes;
    const path = this.props.location.pathname;
    console.log('Match:');
    console.log(JSON.stringify(this.props.location.search));
    if (nodes === undefined) {
      return this.renderError();
    } else {
      const a = new AnalyzerPathProps(path, nodes);
      console.log(a.path());
  
      if (a.redirect) {
        console.log(`Redirecting from ${path} to ${a.path()}`)
        return <Redirect to={a.path()}/>
      } else {
        return this.renderPage(a, nodes);
      }  
    }
  }

  renderError() {
    return <div>
      One or more errors in the network configuration are preventing analysis.
      Return to the <Link to='/edit'>Configuration Pane</Link> to fix the errors.
    </div>
  }

  renderPage(a: AnalyzerPathProps, nodes: NodeSpec[]) {
    if (!nodes.find(node => node.key === a.startKey)) {
      return this.renderError2(a, nodes);
    } else {
      return this.renderPage2(a, nodes);
    }
  }

  renderError2(a: AnalyzerPathProps, nodes: NodeSpec[]) {
    return (
      <div>
        { this.renderRouteSelectors(a, nodes) }
        <div>Unknown node {a.startKey}</div>
      </div>
    )
  }

  renderPage2(a: AnalyzerPathProps, nodes: NodeSpec[]) {
    const graph = this.props.graph;
    if (graph === undefined) {
      return <div>Error: no graph</div>
    } else {
      // TODO: cache this computation. Only recompute if inputs change.
      const {cycles, flows} = graph.analyze(a.startKey, a.direction === Direction.FROM);
      const filteredFlows = flows.filter(
        flow => flow.paths.length > 0
      );
      // const filteredFlows = flows;

      return (
        <div>
          { this.renderRouteSelectors(a, nodes) }
          { renderExpanation(a, filteredFlows) }

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%'
            }}
          >
            { this.renderMaster(a, filteredFlows) }
            { this.renderDetail(a, graph, filteredFlows) }
          </div>
        </div>
      )
    }
  }

  renderMaster(a: AnalyzerPathProps, flows: FlowNode[]) {
    return (
      <div style={{backgroundColor: 'lightgray'}}>
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
                <Nav.Item key={key} style={{paddingTop: '0', paddingBottom: '0'}}>
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

  renderDetail(a: AnalyzerPathProps, graph: Graph, flows: FlowNode[]) {
    if (!a.endKey) {
      return <div></div>
    } else {
      const flow = flows.find(flow => flow.node.key === a.endKey);
      if (flow === undefined) {
        return <div>Unknown node "{a.endKey}"</div>
      } else {
        if (flow.paths.length === 0) {
          // TODO: better handling for this case.
          // This case may never happen now that flows are filtered.
          return (
            <div>No paths</div>
          );
        } else {
          return (
            <div style={{flexGrow: 1, backgroundColor: 'lightblue'}}>
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

  renderRouteSelectors(a: AnalyzerPathProps, nodes: NodeSpec[]) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'row',
        width: '100%',
        // height: '100%'
      }}>
        <span style={{
          fontSize: '15pt',
          paddingRight: '1ex'
        }}>
          Routes
        </span>
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            { a.direction === Direction.TO ? 'To' : 'From' }
          </Dropdown.Toggle>
  
          <Dropdown.Menu>
            <Dropdown.Item to={a.to()} as={Link}>To</Dropdown.Item>
            <Dropdown.Item to={a.from()} as={Link}>From</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
        <Dropdown>
          <Dropdown.Toggle variant="light" id="dropdown-basic">
            { a.startKey }
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

function renderPath(
  a: AnalyzerPathProps,
  graph: Graph,
  path: Path,
  outbound: boolean
) {
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
      elements.push(<GoArrowRight key={'_arrow' + i}/>);
    }
    elements.push(<Link to={key} key={key + i.toString()}>{key}</Link>);
  }

  return elements;
}


function mapStateToProps({ graph, nodes }: ApplicationState) {
  return { graph, nodes };
}

export default connect(mapStateToProps)(withRouter(AnalyzeMode))
