import React from "react";
import Nav from 'react-bootstrap/Nav';
import {RouteComponentProps, withRouter} from "react-router";
import {Link} from "react-router-dom";

class NavBar extends React.Component<RouteComponentProps<any>> {
  render() {
    const { location } = this.props;

    return (
      <div>
        <div>You are now at {location.pathname}</div>
        <Nav variant="tabs" className="flex-row" defaultActiveKey={location.pathname}>
          <Nav.Item>
            <Nav.Link to='/' eventKey="/" as={Link}>Home</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link to='/edit' eventKey="/edit" as={Link}>Edit</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link to='/analyze' eventKey="/analyze" as={Link}>Analyze</Nav.Link>
          </Nav.Item>
        </Nav>
      </div>
    );
  }
}

export default withRouter(NavBar);
