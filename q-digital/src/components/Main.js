import React, { useState } from "react";

import MathTest from "./MathTest";
import "../App.css";

const Main = ({ history }) => {
    const [difficulty, setDifficulty] = useState(1);
    const [question, setQuestion] = useState({
        points: 0,
        time: 0,
        question: 0,
        options: [0, 0, 0, 0],
    });
    const handleLogOut = () => {
        localStorage.clear();
        history.push("/");
    };

    const startTest = (event) => {
        event.preventDefault();

        const formData = new FormData();
        const myHeaders = new Headers();
        formData.append("type", 1);
        formData.append("type_hard", difficulty);
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
                setQuestion({
                    points: result.data.points,
                    time: result.data.time,
                    question: result.data.question,
                    options: result.data.options,
                });

                document.getElementsByClassName("math-test")[0].style.display =
                    "flex";
                document.getElementsByClassName("main")[0].style.display =
                    "none";
            });
    };

    if (!localStorage.getItem("user")) {
        document.location.href = "/";
    } else {
        return (
            <div className="container">
                <div className="main">
                    <form onSubmit={startTest}>
                        <select
                            onChange={(event) =>
                                setDifficulty(event.target.value)
                            }
                        >
                            <option disabled="disabled" value>
                                Выберите сложность
                            </option>
                            <option value="1">Easy/Легко</option>
                            <option value="2">Hard/Тяжело</option>
                        </select>
                        <button type="submit">Start</button>
                    </form>
                    <button onClick={handleLogOut}>Выход</button>
                </div>

                <MathTest question={question} difficulty={difficulty} />
            </div>
        );
    }
};

export default Main;
