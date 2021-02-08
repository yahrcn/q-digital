import React, { useState, useEffect } from "react";

const MathTest = ({ question, difficulty }) => {
    console.log(question);
    const handleBack = () => {
        document.getElementsByClassName("math-test")[0].style.display = "none";
        document.getElementsByClassName("main")[0].style.display = "block";
    };

    const timer = () => {
        setTimeout(() => {
            question.time -= 1;
        }, 1000);
    };

    const handleAnswer = (event) => {
        event.preventDefault();
        const formData = new FormData();
        const myHeaders = new Headers();
        formData.append("type", 2);
        formData.append("type_hard", difficulty);
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
                question.points = result.data.points;
                question.time = result.data.time;
                question.question = result.data.question;
                question.options = result.data.options;
                console.log(result);
            });
    };
    return (
        <div className="math-test">
            <form>
                <div className="score">Score: {question.points}</div>
                <div className="timer">Timer: {question.time}</div>
                <div className="score">{question.question} = ?</div>
                {question.options.map((item, id) => {
                    return (
                        <button key={id} value={item} onClick={handleAnswer}>
                            {item}
                        </button>
                    );
                })}
            </form>
            <button onClick={handleBack}>Go Back</button>
        </div>
    );
};

export default MathTest;
