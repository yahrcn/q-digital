import React from "react";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import "./App.css";

import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import Main from "./components/Main";
import Result from "./components/Result";

class App extends React.Component {
    render() {
        const { history } = this.props;
        if (
            localStorage.getItem("user") &&
            JSON.parse(localStorage.getItem("user")).questions
        ) {
            return (
                <div className="App">
                    <Switch>
                        <Route
                            history={history}
                            path="/result"
                            component={Result}
                        />
                        <Route
                            history={history}
                            path="/main"
                            component={Main}
                        />
                        <Redirect from="/" to="/main" />
                    </Switch>
                </div>
            );
        } else if (
            localStorage.getItem("user") &&
            !JSON.parse(localStorage.getItem("user")).questions
        ) {
            return (
                <div className="App">
                    <Switch>
                        <Route
                            history={history}
                            path="/main"
                            component={Main}
                        />
                        <Redirect from="/" to="/main" />
                    </Switch>
                </div>
            );
        } else {
            return (
                <div className="App">
                    <Switch>
                        <Route
                            history={history}
                            path="/log-in"
                            component={LogIn}
                        />
                        <Route
                            history={history}
                            path="/sign-up"
                            component={SignUp}
                        />
                        <Redirect from="/" to="/log-in" />
                    </Switch>
                </div>
            );
        }
    }
}

export default withRouter(App);
