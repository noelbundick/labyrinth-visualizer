import React from "react";
import Dropdown from 'react-bootstrap/Dropdown';
import Nav from 'react-bootstrap/Nav';
import {RouteComponentProps, withRouter} from "react-router";
import {Link, Redirect} from 'react-router-dom';

import {AnalyzerPathProps, Direction} from '../lib';

// TODO
//   Sticky links
//   One or more errors in the network configuration are preventing analysis
//   Invalid start location
//   Invalid end location
//   No routes for this pair
//   Default to/from, start - from redux store
//   x Function to parse location
//   x favicon
//   x Convert to component

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

class AnalyzeMode extends React.Component<RouteComponentProps<any>> {
  onSelect = (detailKey: string | undefined) => {
    const history = this.props.history;
    const a = new AnalyzerPathProps(this.props.location.pathname);
    history.push(a.end(detailKey));
  }

  render() {
    const a = new AnalyzerPathProps(this.props.location.pathname);
    console.log(a.path());

    if (a.redirect) {
      console.log(`Redirecting from ${this.props.location.pathname} to ${a.path()}`)
      return <Redirect to={a.path()}/>
    } else {
      return (
        <div>
          {/* <h1>Analyze Mode</h1> */}
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
                  keys.map((key) => (
                    <Dropdown.Item to={a.start(key)} key={key} as={Link}>{key}</Dropdown.Item>
                  ))
                }
              </Dropdown.Menu>
            </Dropdown>
          </div>

          { renderExpanation(a) }

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              width: '100%'
            }}
          >
            <div>
              <Nav className="flex-column" variant="pills" activeKey={a.endKey} onSelect={this.onSelect}>
                {
                  keys.map((key) => {
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
            <div style={{flexGrow: 1, backgroundColor: 'lightblue'}}>
                <h2>
                  {
                    (a.direction === Direction.TO) ? 
                    `Routes from ${a.endKey} to ${a.startKey}` :
                    `Routes from ${a.startKey} to ${a.endKey}`
                  }
                </h2>
            </div>
          </div>
        </div>
      )
    }
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

export default withRouter(AnalyzeMode);
