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

export default function Frame() {
  return (
    <Router>
      <Head>
        <title>Labyrinth Visualizer</title>
        <link rel="icon" href="/security-24px.svg" />
      </Head>
      <div style={{
        width: '100%',
        height:'100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <NavBar/>

        <div style={{flexGrow: 1, overflow: 'hidden'}}>
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
