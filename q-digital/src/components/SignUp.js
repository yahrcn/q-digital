import React from "react";
import { Link } from "react-router-dom";

import "../App.css";

export default class SignUp extends React.Component {
    handleSubmit(event) {
        event.preventDefault();
        const name = event.target[0].value;
        const email = event.target[1].value;
        const password = event.target[2].value;
        const confirmPassword = event.target[3].value;
        const formData = new FormData();

        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("password_confirmation", confirmPassword);

        if (password !== confirmPassword) {
            alert("Пароли не совпадают.");
        } else {
            fetch("https://internsapi.public.osora.ru/api/auth/signup", {
                method: "POST",
                body: formData,
            })
                .then((res) => res.json())
                .then((result) => {
                    if (!result.status) {
                        alert(result.errors.email);
                    } else {
                        this.props.history.push("/log-in");
                    }
                });
        }
    }
    render() {
        return (
            <div className="container">
                <form
                    className="auth sign-up"
                    onSubmit={this.handleSubmit.bind(this)}
                >
                    <legend>Регистрация</legend>
                    <label htmlFor="name">Введите имя:</label>
                    <input type="text" name="name" id="name" required />
                    <label htmlFor="email">Введите email:</label>
                    <input type="email" name="email" id="email" required />
                    <label htmlFor="pass">Введите пароль:</label>
                    <input type="password" name="pass" id="pass" required />
                    <label htmlFor="confirmPass">Подтвердите пароль:</label>
                    <input
                        type="password"
                        name="confirmPass"
                        id="confirmPass"
                        required
                    />
                    <button type="submit">Зарегистрироваться</button>
                    <span>Уже есть аккаунт?</span>
                    <Link to="/log-in">Авторизация</Link>
                </form>
            </div>
        );
    }
}
