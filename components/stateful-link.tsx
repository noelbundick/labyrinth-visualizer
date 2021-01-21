import React from "react";
import Nav from 'react-bootstrap/Nav';
import {RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom";

class StatefulLink extends React.Component<RouteComponentProps<any>> {
  path: string;

  constructor(props) {
    super(props);
    this.path = '/analyze';
  }

  render() {
    const pathName = this.props.location.pathname;
    const [ignore, mode, direction, start, end] = pathName.split('/');

    if (mode === 'analyze' && this.path !== pathName) {
      console.log(`set path = ${pathName}`);
      this.path = pathName;
    }
    console.log(`render path = ${this.path}`);

    return (
      <Nav.Item>
        <Nav.Link to={this.path} eventKey="analyze" as={Link}>Analyze</Nav.Link>
      </Nav.Item>
    );
  }
}

export default withRouter(StatefulLink);
