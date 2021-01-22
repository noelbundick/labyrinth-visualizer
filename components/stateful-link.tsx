import React from "react";
import Nav from 'react-bootstrap/Nav';
import {RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom";

interface Props extends RouteComponentProps<any> {
  mode: string;
}

class StatefulLink extends React.Component<Props> {
  path: string;

  constructor(props: Props) {
    super(props);
    this.path = '/' + this.props.mode;
  }

  render() {
    const pathName = this.props.location.pathname;
    const [ignore, mode, direction, start, end] = pathName.split('/');

    if (mode === this.props.mode && this.path !== pathName) {
      // console.log(`mode(${mode}): set path to ${pathName}`);
      this.path = pathName;
    }
    // console.log(`StatefulLink: render path = ${this.path}`);
    // console.log(`StatefulLink: mode = ${mode}`);

    return (
      <Nav.Item>
        <Nav.Link to={this.path} eventKey={this.props.mode} as={Link}>{this.props.children}</Nav.Link>
      </Nav.Item>
    );
  }
}

export default withRouter(StatefulLink);
