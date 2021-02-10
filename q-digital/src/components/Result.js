import React from "react";

export default class Result extends React.Component {
    render() {
        const { questions, score } = JSON.parse(localStorage.getItem("user"));
        const { history } = this.props;
        return (
            <div className="result">
                <div className="score">Score: {score}</div>
                <div className="end">END GAME</div>
                <table className="result__table">
                    <tbody>
                        <tr>
                            <th>Question</th>
                            <th>Answer</th>
                            <th>Correct</th>
                        </tr>
                        {questions.map((item, id) => {
                            if (item.answer === item.current_answer) {
                                return (
                                    <tr key={id} className="correct">
                                        <td>{item.question}</td>
                                        <td>{item.current_answer}</td>
                                        <td>{item.answer}</td>
                                    </tr>
                                );
                            } else {
                                return (
                                    <tr key={id}>
                                        <td>{item.question}</td>
                                        <td>{item.current_answer}</td>
                                        <td>{item.answer}</td>
                                    </tr>
                                );
                            }
                        })}
                    </tbody>
                </table>
                <button
                    className="back-btn"
                    onClick={() => history.push("/main")}
                >
                    Go Back
                </button>
            </div>
        );
    }
}
