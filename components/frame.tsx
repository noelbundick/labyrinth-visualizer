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
import NavBar from './nav-bar';
import NotFound from './page-not-found';
import Welcome from './welcome-mode';

export default function Frame() {
  const router = useRouter();
  const { forward } = router.query;

  return (
    <Router>
      <Head>
        <title>Labyrinth Visualizer</title>
        <link rel="icon" href="/security-24px.svg" />
      </Head>
      <div>
        <NavBar/>

        {/* <div>
          Query: {forward}
        </div> */}

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
            <Edit />
          </Route>
          <Route exact path="/">
            <Welcome />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}
