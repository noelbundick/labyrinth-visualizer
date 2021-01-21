import React from "react";
import Nav from 'react-bootstrap/Nav';
import {RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom";

import StatefulLink from '../components/stateful-link';

class NavBar extends React.Component<RouteComponentProps<any>> {
  render() {
    // const { location } = this.props;
    const pathName = this.props.location.pathname;
    const [ignore, mode] = pathName.split('/');

    return (
      <div>
        {/* <div>You are now at {location.pathname}</div> */}
        <Nav variant="tabs" className="flex-row" activeKey={mode}>
          <Nav.Item>
            <Nav.Link to='/' eventKey="" as={Link}>Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link to='/edit' eventKey="edit" as={Link}>Configure</Nav.Link>
          </Nav.Item>
          <StatefulLink mode="analyze">Analyze</StatefulLink>
        </Nav>
      </div>
    );
  }
}

export default withRouter(NavBar);
