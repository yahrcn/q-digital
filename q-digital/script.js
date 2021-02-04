window.onload = function () {
    radioChange();
    sortLocalStorage();
    for (let i = booksArray.length - 1; i >= 0; i--) {
        let li = document.createElement("li");
        li.innerHTML = JSON.parse(booksArray[i]).title;
        li.setAttribute("draggable", true);
        if (JSON.parse(booksArray[i]).fav) {
            favList.appendChild(li);
        } else {
            bookList.appendChild(li);
        }
        if (JSON.parse(booksArray[i]).done) {
            li.classList.add("done");
        }
    }
    for (let i = 0; i < lists.length; i++) {
        lists[i].addEventListener(
            "click",
            function (event) {
                let openDiv = document.getElementById("openBook");
                let openTitle = document.getElementById("openTitle");
                let openText = document.getElementById("openText");
                let li = event.target;
                for (let i = 0; i < lis.length; i++) {
                    lis[i].classList.remove("opened");
                    if (event.target == lis[i]) {
                        openTitle.innerText = li.innerText;
                        for (item in booksArray) {
                            if (
                                JSON.parse(booksArray[item]).title ==
                                openTitle.innerText
                            ) {
                                openText.innerText = JSON.parse(
                                    booksArray[item]
                                ).text;
                            }
                        }
                        openDiv.style.display = "inline-block";
                    }
                }
                for (let i = 0; i < lis.length; i++) {
                    if (li == lis[i]) {
                        li.classList.add("opened");
                    }
                }
            },
            false
        );
    }
};

var lis = document.getElementsByTagName("li");
var lists = document.getElementsByTagName("ul");
var optionText = document.getElementById("radioText");
var optionFile = document.getElementById("radioFile");
var form = document.getElementById("addForm");
var bookList = document.getElementById("bookList");
var favList = document.getElementById("fav");
var textarea = document.getElementById("bookText");
var input = document.createElement("input");
var title = document.getElementById("bookTitle");
const booksArray = localStorage.getItem("books")
    ? JSON.parse(localStorage.getItem("books"))
    : [];

function toLocal(
    book,
    bookText,
    doneStatus = false,
    favStatus = false,
    date = new Date().getTime()
) {
    booksArray.push(
        JSON.stringify({
            title: book,
            text: bookText,
            done: doneStatus,
            fav: favStatus,
            date: date,
        })
    );
    localStorage.setItem("books", JSON.stringify(booksArray));
}

function sortLocalStorage() {
    booksArray.sort((a, b) => {
        if (JSON.parse(a).date > JSON.parse(b).date) {
            return 1;
        } else return -1;
    });
    for (item in booksArray) {
        if (JSON.parse(booksArray[item]).done) {
            booksArray.unshift(booksArray.splice(item, 1)[0]);
        }
    }
}

function onDragStart(event) {
    for (let i = 0; i < lis.length; i++) {
        if (event.target == lis[i]) {
            event.target.classList.add("inDrag");
        }
    }
}

function onDragEnd(event) {
    for (let i = 0; i < lis.length; i++) {
        if (event.target == lis[i]) {
            event.target.classList.remove("inDrag");
        }
    }
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    const draggableElement = document.getElementsByClassName("inDrag")[0];
    const dropzone = event.target;
    if (
        (dropzone.id == "fav" || dropzone.id == "bookList") &&
        draggableElement != undefined
    ) {
        dropzone.appendChild(draggableElement);
        for (item in booksArray) {
            if (
                event.target.id == "fav" &&
                JSON.parse(booksArray[item]).title == draggableElement.innerText
            ) {
                booksArray[item] = JSON.stringify({
                    title: JSON.parse(booksArray[item]).title,
                    text: JSON.parse(booksArray[item]).title,
                    done: JSON.parse(booksArray[item]).done,
                    fav: true,
                    date: JSON.parse(booksArray[item]).date,
                });
            } else if (
                JSON.parse(booksArray[item]).title == draggableElement.innerText
            ) {
                booksArray[item] = JSON.stringify({
                    title: JSON.parse(booksArray[item]).title,
                    text: JSON.parse(booksArray[item]).title,
                    done: JSON.parse(booksArray[item]).done,
                    fav: false,
                    date: JSON.parse(booksArray[item]).date,
                });
            }
        }
        localStorage.setItem("books", JSON.stringify(booksArray));
    }
}

const radioChange = () => {
    let bookText = document.getElementById("bookText");
    let bookFile = document.getElementById("bookFile");
    if (optionText.checked) {
        bookFile.removeAttribute("required");
        bookText.setAttribute("required", "required");
        bookText.classList.add("active");
        bookFile.classList.remove("active");
    } else if (optionFile.checked) {
        bookFile.setAttribute("required", "required");
        bookText.removeAttribute("required");
        bookFile.classList.add("active");
        bookText.classList.remove("active");
    }
};

const addBook = () => {
    let li = document.createElement("li");
    li.setAttribute("draggable", true);
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
};

const deleteBook = () => {
    let openDiv = document.getElementById("openBook");
    let li = document.getElementsByClassName("opened")[0];
    for (item in booksArray) {
        if (
            JSON.parse(booksArray[item]).title == li.innerText &&
            JSON.parse(booksArray[item]).fav
        ) {
            favList.removeChild(li);
        } else if (JSON.parse(booksArray[item]).title == li.innerText) {
            bookList.removeChild(li);
            booksArray.splice(item, 1);
            openDiv.style.display = "none";
        }
    }
    localStorage.setItem("books", JSON.stringify(booksArray));
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
    for (item in booksArray) {
        if (JSON.parse(booksArray[item]).title == title) {
            booksArray[item] = JSON.stringify({
                title: JSON.parse(booksArray[item]).title,
                text: area.value,
                done: JSON.parse(booksArray[item]).done,
                fav: JSON.parse(booksArray[item]).fav,
                date: JSON.parse(booksArray[item]).date,
            });
            localStorage.setItem("books", JSON.stringify(booksArray));
        }
    }
    span.innerText = area.value;
    area.style.display = "none";
    span.style.display = "block";
};

const doneBook = () => {
    let title = document.getElementById("openTitle");
    let text = document.getElementById("openText");
    let li = document.getElementsByClassName("opened")[0];
    for (item in booksArray) {
        if (
            JSON.parse(booksArray[item]).title == li.innerText &&
            JSON.parse(booksArray[item]).done
        ) {
            booksArray[item] = JSON.stringify({
                title: JSON.parse(booksArray[item]).title,
                text: JSON.parse(booksArray[item]).title,
                done: false,
                fav: JSON.parse(booksArray[item]).fav,
                date: JSON.parse(booksArray[item]).date,
            });
        } else if (JSON.parse(booksArray[item]).title == li.innerText) {
            booksArray[item] = JSON.stringify({
                title: JSON.parse(booksArray[item]).title,
                text: JSON.parse(booksArray[item]).title,
                done: true,
                fav: JSON.parse(booksArray[item]).fav,
                date: JSON.parse(booksArray[item]).date,
            });
        }
    }
    localStorage.setItem("books", JSON.stringify(booksArray));
    li.innerText;
    li.classList.toggle("done");
};
