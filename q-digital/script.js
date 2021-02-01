window.onload = function () {
    console.log(localStorage);
    radioChange();
    for (let i = 0; i < localStorage.length; i++) {
        let li = document.createElement("li");
        let key = localStorage.key(i);
        li.innerHTML = key;
        bookList.appendChild(li);
    }
};

var optionText = document.getElementById("radioText");
var optionFile = document.getElementById("radioFile");
var form = document.getElementById("addForm");
var bookList = document.getElementById("bookList");
var textarea = document.createElement("textarea");
var input = document.createElement("input");
var title = document.getElementById("bookTitle");
var books;

function toLocal(book, text) {
    books = bookList.innerHTML;
    localStorage.setItem(book, text);
}

const radioChange = () => {
    if (optionText.checked) {
        textarea.cols = 20;
        textarea.rows = 8;
        textarea.style.resize = "none";
        textarea.name = "bookText";
        textarea.required = "true";
        form.removeChild(form.lastChild);
        form.appendChild(textarea);
    } else if (optionFile.checked) {
        input.type = "file";
        input.name = "file";
        input.required = "true";
        input.accept = "text/plain";
        form.removeChild(form.lastChild);
        form.appendChild(input);
    }
};
const addBook = () => {
    if (optionText.checked) {
        let li = document.createElement("li");
        li.innerHTML = title.value;
        bookList.appendChild(li);
        toLocal(title.value, textarea.value);
    } else if (optionFile.checked) {
        const formData = new FormData();
        formData.append("login", title.value);
        formData.append("file", document.querySelector("[type=file]").files[0]);
        fetch("https://apiinterns.osora.ru/", {
            method: "POST",
            body: formData,
        })
            .then((response) => response.json())
            .then((result) => {
                console.log(result);
                if (result.status) {
                    let li = document.createElement("li");
                    li.innerHTML = title.value;
                    bookList.appendChild(li);
                }
                toLocal(title.value, result.text);
            });
    }
};
