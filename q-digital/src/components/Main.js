import React from "react";

import "../App.css";

export default class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            points: 0,
            time: 0,
            question: 0,
            options: [0, 0, 0, 0],
            questions: [],
        };
        this.difficulty = 1;
    }

    componentDidMount() {
        this.myInterval = setInterval(() => {
            if (this.state.time !== 0) {
                this.setState(({ time }) => ({
                    time: time - 1,
                }));
            }
        }, 1000);
    }

    handleLogOut() {
        localStorage.clear();
        this.props.history.push("/");
    }

    startTest(event) {
        event.preventDefault();

        const formData = new FormData();
        const myHeaders = new Headers();
        formData.append("type", 1);
        formData.append("type_hard", this.difficulty);
        myHeaders.append(
            "Authorization",
            `Bearer ${
                JSON.parse(localStorage.getItem("user")).token.access_token
            }`
        );
        fetch("https://internsapi.public.osora.ru/api/game/play", {
            method: "POST",
            headers: myHeaders,
            body: formData,
        })
            .then((res) => res.json())
            .then((result) => {
                this.setState({
                    points: result.data.points,
                    time: result.data.time,
                    question: result.data.question,
                    options: result.data.options,
                });

                document
                    .getElementsByClassName("math-test")[0]
                    .classList.toggle("hidden");
                document
                    .getElementsByClassName("main")[0]
                    .classList.toggle("hidden");
            });
    }

    handleBack() {
        // document.getElementsByClassName("result")[0].style.display = "none";
        document
            .getElementsByClassName("math-test")[0]
            .classList.toggle("hidden");
        document.getElementsByClassName("main")[0].classList.toggle("hidden");
    }

    handleAnswer(event) {
        event.preventDefault();
        const formData = new FormData();
        const myHeaders = new Headers();
        formData.append("type", 2);
        formData.append("type_hard", this.difficulty);
        formData.append("answer", event.target.value);
        myHeaders.append(
            "Authorization",
            `Bearer ${
                JSON.parse(localStorage.getItem("user")).token.access_token
            }`
        );
        fetch("https://internsapi.public.osora.ru/api/game/play", {
            method: "POST",
            headers: myHeaders,
            body: formData,
        })
            .then((res) => res.json())
            .then((result) => {
                if (result.data.status !== 1) {
                    this.setState({
                        points: result.data.points,
                        time: result.data.time,
                        question: result.data.question,
                        options: result.data.options,
                    });
                } else {
                    localStorage.setItem(
                        "user",
                        JSON.stringify({
                            email: JSON.parse(localStorage.getItem("user"))
                                .email,
                            password: JSON.parse(localStorage.getItem("user"))
                                .password,
                            token: JSON.parse(localStorage.getItem("user"))
                                .token,
                            questions: result.data.questions,
                            score: this.state.points,
                        })
                    );
                    this.props.history.push("result");
                    // document.getElementsByClassName(
                    //     "math-test"
                    // )[0].style.display = "none";
                    // document.getElementsByClassName("result")[0].style.display =
                    //     "block";
                }
            });
    }

    render() {
        const { history } = this.props;
        if (!localStorage.getItem("user")) {
            history.push("/");
        } else {
            return (
                <div className="container">
                    <div className="main">
                        <form onSubmit={this.startTest.bind(this)}>
                            <select
                                className="difficulty"
                                onChange={(event) => {
                                    this.difficulty = event.target.value;
                                }}
                            >
                                <option disabled="disabled" value>
                                    Выберите сложность
                                </option>
                                <option value="1">Easy/Легко</option>
                                <option value="2">Hard/Тяжело</option>
                            </select>
                            <button type="submit">Start</button>
                        </form>
                        <button
                            className="back-btn"
                            onClick={this.handleLogOut.bind(this)}
                        >
                            Выход
                        </button>
                    </div>

                    <div className="math-test hidden">
                        <form>
                            <div className="score">
                                Score: {this.state.points}
                            </div>
                            <div className="timer">
                                Timer: {this.state.time}
                            </div>
                            <div className="question">
                                {this.state.question} = ?
                            </div>
                            <div className="inputs">
                                {this.state.options.length !== 0 ? (
                                    this.state.options.map((item, id) => {
                                        return (
                                            <button
                                                key={id}
                                                value={item}
                                                className="answer-btn"
                                                onClick={this.handleAnswer.bind(
                                                    this
                                                )}
                                            >
                                                {item}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <input
                                        onBlur={this.handleAnswer.bind(this)}
                                    />
                                )}
                            </div>
                        </form>
                        <button className="back-btn" onClick={this.handleBack}>
                            Go Back
                        </button>
                    </div>
                </div>
            );
        }
    }
}
