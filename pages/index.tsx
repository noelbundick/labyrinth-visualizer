import { useRouter } from 'next/router'
import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
  Link,
  // useLocation
} from "react-router-dom";

// function useQuery() {
//   const location = useLocation();
//   if (location) {
//     return new URLSearchParams(location.search);
//   } else {
//     return new Map<string,string>();
//   }
// }

export default function App() {
  const router = useRouter();
  const { forward } = router.query

  return (
    <Router>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/edit">Edit</Link>
            </li>
            <li>
              <Link to="/analyze/to">Analyze</Link>
            </li>
            <li>
              <Link to="/404">Bad link</Link>
            </li>
          </ul>
        </nav>

        <div>
          Query: {forward}
        </div>

        <Switch>
          <Route
            path={[
              "/analyze/to/:start/:end",
              "/analyze/to/:start",
              "/analyze/to",
              "/analyze/from/:start/:end",
              "/analyze/from/:start",
              "/analyze/from"
            ]}
            component={Analyze}
          />
          <Route path="/edit">
            <Edit />
          </Route>
          <Route exact path="/">
            <Home />
          </Route>
          <Route>
            {/* <Redirect to="/" /> */}
            <NotFound />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

function Analyze(props) {
  const path = props.match.path as string;
  const forward = path.endsWith('to');
  return (
    <div>
      <h1>Analyze</h1>
      <p>Path: {path}</p>
      <p>Forward: {String(forward)}</p>
      <p>Start: {props.match.params.start ?? "(undefined)"}</p>
      <p>End: {props.match.params.end ?? "(undefined)"}</p>
    </div>
  );
}

function Home() {
  return <h2>Intro</h2>;
}

function Edit() {
  return <h2>Edit</h2>;
}

function NotFound() {
  return <h2>Page not found</h2>;
}
