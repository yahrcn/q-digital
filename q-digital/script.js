window.onload = function () {
    console.log(localStorage);
    radioChange();
    // sortLocalStorage();
    for (let i = localStorage.length - 1; i >= 0; i--) {
        let li = document.createElement("li");
        let key = localStorage.key(i);
        li.innerHTML = key;
        li.setAttribute("draggable", true);
        if (JSON.parse(localStorage.getItem(li.innerText)).fav) {
            favList.appendChild(li);
        } else {
            bookList.appendChild(li);
        }
        if (JSON.parse(localStorage.getItem(li.innerText)).done) {
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
                        openText.innerText = JSON.parse(
                            localStorage.getItem(li.innerText)
                        ).text;
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

function toLocal(book, bookText, doneStatus = false, favStatus = false) {
    localStorage.setItem(
        localStorage.length,
        JSON.stringify({
            title: book,
            text: bookText,
            done: doneStatus,
            fav: favStatus,
            time: new Date().getTime(),
        })
    );
}

// function sortLocalStorage() {
//     if (localStorage.length > 0) {
//         var localStorageArray = [];
//         for (i = 0; i < localStorage.length; i++) {
//             let content = localStorage.getItem(i);
//             localStorageArray.push(content);
//         }
//     }
//     console.log(localStorageArray);
//     var sortedArray = localStorageArray.sort(function (a, b) {
//         if (JSON.parse(a).time > JSON.parse(b).time) {
//             return 1;
//         } else return -1;
//     });
//     console.log(sortedArray);
// }

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
        if (event.target.id == "fav") {
            toLocal(
                draggableElement.innerText,
                JSON.parse(localStorage.getItem(draggableElement.innerText))
                    .text,
                JSON.parse(localStorage.getItem(draggableElement.innerText))
                    .done,
                true
            );
        } else {
            toLocal(
                draggableElement.innerText,
                JSON.parse(localStorage.getItem(draggableElement.innerText))
                    .text,
                JSON.parse(localStorage.getItem(draggableElement.innerText))
                    .done,
                false
            );
        }
    }
}

const radioChange = () => {
    let bookText = document.getElementById("bookText");
    let bookFile = document.getElementById("bookFile");
    if (optionText.checked) {
        bookFile.toggleAttribute("required");
        bookText.toggleAttribute("required");
        bookText.classList.add("active");
        bookFile.classList.remove("active");
    } else if (optionFile.checked) {
        bookFile.toggleAttribute("required");
        bookText.toggleAttribute("required");
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
    let title = document.getElementById("openTitle");
    let li = document.getElementsByClassName("opened")[0];
    if (JSON.parse(localStorage.getItem(title.innerText)).fav) {
        favList.removeChild(li);
    } else {
        bookList.removeChild(li);
    }
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
    toLocal(
        title,
        area.value,
        JSON.parse(localStorage.getItem(title)).done,
        JSON.parse(localStorage.getItem(title)).fav
    );
    span.innerText = area.value;
    area.style.display = "none";
    span.style.display = "block";
};

const doneBook = () => {
    let title = document.getElementById("openTitle");
    let text = document.getElementById("openText");
    let li = document.getElementsByClassName("opened")[0];
    if (JSON.parse(localStorage.getItem(li.innerText)).done) {
        toLocal(
            title.innerText,
            text.innerText,
            false,
            JSON.parse(localStorage.getItem(li.innerText)).fav
        );
    } else {
        toLocal(
            title.innerText,
            text.innerText,
            true,
            JSON.parse(localStorage.getItem(li.innerText)).fav
        );
    }
    li.innerText;
    li.classList.toggle("done");
};
