import {FlowNode, Graph, NodeSpec} from 'labyrinth-nsg';
import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import {connect} from 'react-redux'
import {RouteComponentProps, withRouter} from "react-router";
import {Link, Redirect} from 'react-router-dom';

import {AnalyzerPathProps, Direction} from '../lib';
import {ApplicationState} from '../redux';

const keys = [
  'internet',
  'gateway',
  'subnet1',
  'subnet2',
  'subnet3',
  'vm1',
  'vm2',
  'vm3'
];

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

      return (
        <div>
          { this.renderRouteSelectors(a, nodes) }
          { renderExpanation(a) }

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%'
            }}
          >
            { this.renderMaster(a, flows) }
            { this.renderDetail(a, flows) }
          </div>
        </div>
      )
    }
  }

  renderMaster(a: AnalyzerPathProps, flows: FlowNode[]) {
    return (
      <div>
        <Nav
          className="flex-column"
          variant="pills"
          activeKey={a.endKey}
          onSelect={this.onSelect}
        >
          {
            flows.filter(
              flow => flow.routes.conjunctions.length > 0
            ).map((flow) => {
              const key = flow.node.key;
              const path = a.end(key);
              return (
                <Nav.Item key={key}>
                  <Nav.Link to={path} eventKey={key} as={Link}>{key}</Nav.Link>
                </Nav.Item>
              )
            })
          }
        </Nav>
      </div>
    );
  }

  renderDetail(a: AnalyzerPathProps, flows: FlowNode[]) {
    const flow = flows.find(flow => flow.node.key === a.endKey);
    if (flow === undefined) {
      return <div>Unknown node {a.endKey}</div>
    } else {
      return (
        <div style={{flexGrow: 1, backgroundColor: 'lightblue'}}>
          <h2>
            {
              // TODO: handle case where there are no routes
              (a.direction === Direction.TO) ? 
              `Routes from ${a.endKey} to ${a.startKey}` :
              `Routes from ${a.startKey} to ${a.endKey}`
            }
          </h2>
          <div>
            <pre>
              {flow.routes.format({})}
            </pre>
          </div>
        </div>
      );
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

function renderExpanation(a: AnalyzerPathProps) {
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

function mapStateToProps({ graph, nodes }: ApplicationState) {
  return { graph, nodes };
}

export default connect(mapStateToProps)(withRouter(AnalyzeMode))
// export default withRouter(AnalyzeMode);
