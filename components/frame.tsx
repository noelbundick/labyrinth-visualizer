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
// import Edit from './edit-mode';

// Works
import Editor from './editor';

// Fails with 
//   ./node_modules/monaco-editor/esm/vs/base/browser/ui/actionbar/actionbar.css
//   Global CSS cannot be imported from within node_modules.
//   Read more: https://err.sh/next.js/css-npm
// import Editor from './editor2';

// Works, but is not connected. Will morph editor4 into correct form.
// import Editor from './editor3';
// import Editor from './editor4';

// import Editor from './resize-detector';

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
      <div style={{
        width: '100%',
        height:'100%',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <NavBar/>

        {/* <div>
          Query: {forward}
        </div> */}

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
