import Head from 'next/head'
import {useRouter} from 'next/router'
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
} from "react-router-dom";

import Analyze from './analyze-mode';
import Edit from './edit-mode';
import Editor from './editor';
import NavBar from './nav-bar';
import NotFound from './page-not-found';
import Welcome from './welcome-mode';

export default function Frame() {
  // const router = useRouter();
  // const { forward } = router.query;

  return (
    <Router>
      <Head>
        <title>Labyrinth Visualizer</title>
        <link rel="icon" href="/security-24px.svg" />
      </Head>
      <div style={{height:'100%', display: 'flex', flexDirection: 'column'}}>
        <NavBar/>

        {/* <div>
          Query: {forward}
        </div> */}

        <div style={{flexGrow: 1}}>
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
              <Editor />
            </Route>
            <Route exact path="/">
              <Welcome />
            </Route>
            <Route>
              <NotFound />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}
