import React from "react";
import ParseData from "./components/parse";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Layout from "./components/layout";
import Groups from "./components/groups";

function App() {
  return (
    <Router>
      <Layout>
        <div>
          <Switch>
            <Route path="/time" exact>
              <div>TimeSeriesData</div>
            </Route>
            <Route path="/raw" exact>
              <ParseData />
            </Route>
            <Route path="/">
              <Groups />
            </Route>
          </Switch>
        </div>
      </Layout>
    </Router>
  );
}

export default App;

// ReactDOM.render(<App />, document.querySelector("#app"))
