window.onload = function () {
    console.log(localStorage);
    radioChange();
    for (let i = 0; i < localStorage.length; i++) {
        console.log(i, localStorage.key(i));
        let li = document.createElement("li");
        let key = localStorage.key(i);
        li.innerHTML = key;
        bookList.appendChild(li);
        if (JSON.parse(localStorage.getItem(li.innerText)).status) {
            li.classList.add("done");
        }
        li.addEventListener(
            "click",
            function () {
                let openDiv = document.getElementById("openBook");
                let openTitle = document.getElementById("openTitle");
                let openText = document.getElementById("openText");
                let lis = document.getElementsByTagName("li");
                for (let i = 0; i < lis.length; i++) {
                    lis[i].id = "";
                }
                li.id = "opened";
                openTitle.innerText = li.innerText;
                openText.innerText = JSON.parse(
                    localStorage.getItem(li.innerText)
                ).text;
                openDiv.style.display = "inline-block";
            },
            false
        );
    }
};

var optionText = document.getElementById("radioText");
var optionFile = document.getElementById("radioFile");
var form = document.getElementById("addForm");
var bookList = document.getElementById("bookList");
var textarea = document.createElement("textarea");
var input = document.createElement("input");
var title = document.getElementById("bookTitle");

function toLocal(book, bookText, bookStatus = false) {
    localStorage.setItem(
        book,
        JSON.stringify({ text: bookText, status: bookStatus })
    );
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
    let li = document.createElement("li");
    li.addEventListener(
        "click",
        function () {
            let openDiv = document.getElementById("openBook");
            let openTitle = document.getElementById("openTitle");
            let openText = document.getElementById("openText");
            let opened = document.getElementsByTagName("li");
            for (let i = 0; i < opened.length; i++) {
                opened[i].id = "";
            }
            li.id = "opened";
            openTitle.innerText = li.innerText;
            openText.innerText = localStorage.getItem(li.innerText);
            openDiv.style.display = "inline-block";
        },
        false
    );
    if (optionText.checked) {
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
                    li.innerHTML = title.value;
                    bookList.appendChild(li);
                }
                toLocal(title.value, result.text);
            });
    }
    console.log(localStorage);
};

const deleteBook = () => {
    let openDiv = document.getElementById("openBook");
    let title = document.getElementById("openTitle");
    let li = document.getElementById("opened");
    bookList.removeChild(li);
    localStorage.removeItem(title.innerText);
    openDiv.style.display = "none";
};

const editBook = () => {
    let span = document.getElementById("openText");
    let area = document.getElementById("openArea");
    span.style.display = "none";
    area.style.display = "block";
    area.value = span.innerText;
    area.focus();
};

const handleEditBlur = () => {
    let span = document.getElementById("openText");
    let area = document.getElementById("openArea");
    let title = document.getElementById("openTitle").innerText;
    toLocal(title, area.value);
    span.innerText = area.value;
    area.style.display = "none";
    span.style.display = "block";
};

const doneBook = () => {
    let title = document.getElementById("openTitle");
    let text = document.getElementById("openText");
    let li = document.getElementById("opened");
    if (JSON.parse(localStorage.getItem(li.innerText)).status) {
        toLocal(title.innerText, text.innerText, false);
    } else {
        toLocal(title.innerText, text.innerText, true);
    }
    li.innerText;
    li.classList.toggle("done");
};
