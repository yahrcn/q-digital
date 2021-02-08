import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";

import "./App.css";

import SignUp from "./components/SignUp";
import LogIn from "./components/LogIn";
import Main from "./components/Main";

function App({ history }) {
    if (localStorage.getItem("user")) {
        const formData = new FormData();
        formData.append(
            "email",
            JSON.parse(localStorage.getItem("user")).email
        );
        formData.append(
            "password",
            JSON.parse(localStorage.getItem("user")).password
        );
        fetch("https://internsapi.public.osora.ru/api/auth/login", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${
                    JSON.parse(localStorage.getItem("user")).token
                }`,
            },
            body: formData,
        })
            .then((res) => res.json())
            .then((result) => {
                console.log(result);
            });
        return (
            <div className="App">
                <Switch>
                    <Route history={history} path="/log-in" component={LogIn} />
                    <Route
                        history={history}
                        path="/sign-up"
                        component={SignUp}
                    />
                    <Route history={history} path="/main" component={Main} />
                    <Redirect from="/" to="/main" />
                </Switch>
            </div>
        );
    } else {
        return (
            <div className="App">
                <Switch>
                    <Route history={history} path="/log-in" component={LogIn} />
                    <Route
                        history={history}
                        path="/sign-up"
                        component={SignUp}
                    />
                    <Route history={history} path="/main" component={Main} />
                    <Redirect from="/" to="/log-in" />
                    <Redirect from="/main" to="/log-in" />
                </Switch>
            </div>
        );
    }
}

export default App;
