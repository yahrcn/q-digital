import React from "react";
import { Link } from "react-router-dom";

import "../App.css";

const LogIn = ({ history }) => {
    const handleLogIn = (event) => {
        event.preventDefault();
        const email = event.target[0].value;
        const password = event.target[1].value;

        const formData = new FormData();
        formData.append("email", email);
        formData.append("password", password);

        fetch("https://internsapi.public.osora.ru/api/auth/login", {
            method: "POST",
            body: formData,
        })
            .then((res) => res.json())
            .then((result) => {
                localStorage.setItem(
                    "user",
                    JSON.stringify({
                        email: email,
                        password: password,
                        token: result.data,
                    })
                );
                history.push("/main");
            });
    };
    return (
        <div className="container">
            <form className="auth log-in" onSubmit={handleLogIn}>
                <legend>Авторизация</legend>
                <label htmlFor="email">Введите email:</label>
                <input type="email" name="email" id="email" required />
                <label htmlFor="pass">Введите пароль:</label>
                <input type="password" name="pass" id="pass" required />
                <button type="submit">Вход</button>
                <span>У вас нет аккаунта?</span>
                <Link to="/sign-up">Регистрация</Link>
            </form>
        </div>
    );
};

export default LogIn;
