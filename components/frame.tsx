import Head from 'next/head'
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Analyze from './analyze-mode';
import Editor from './editor';
import NavBar from './nav-bar';
import NotFound from './page-not-found';
import Welcome from './welcome-mode';
import { RouteComponentProps, withRouter } from "react-router";
import EditorWithResize from './editor';

class FrameBody extends React.Component<RouteComponentProps<any>> {
  render() {
    console.log(JSON.stringify(this.props));
    const display = (
      this.props.location.pathname === '/edit' ? 'block' : 'none'
    );

    return (
      <div style={{ flexGrow: 1, overflow: 'hidden' }}>
        <Switch>
          <Route
            path={[
              "/analyze/to/:start/:end",
              "/analyze/to/:start",
              "/analyze/to",
              "/analyze/from/:start/:end",
              "/analyze/from/:start",
              "/analyze/from",
              "/analyze"
            ]}
            component={Analyze}
          />
          <Route path="/edit">
            {/* <div>Editor placeholder</div> */}
            {/* <Editor /> */}
          </Route>
          <Route exact path="/">
            <Welcome />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>

        <div style={{
          display,
          width: '100%',
          height: '100%'
        }}>
          <Editor/>
        </div>
      </div>
    );
  }
}

const FrameBodyRouted = withRouter(FrameBody);

export default function Frame() {
  return (
    <Router>
      <Head>
        <title>Labyrinth Visualizer</title>
        <link rel="icon" href="/security-24px.svg" />
      </Head>
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <NavBar />
        <FrameBodyRouted/>
      </div>
    </Router>
  );
}
