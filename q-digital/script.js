window.onload = function () {
    var list = document.getElementById("task-list");

    var todos;

    function toLocal() {
        todos = list.innerHTML;
        localStorage.setItem("todos", todos);
    }

    list.addEventListener(
        "click",
        function (ev) {
            if (ev.target.tagName === "INPUT") {
                ev.target.parentNode.classList.toggle("checked");
                //ev.target.classList.toggle("checked");
            } else if (ev.target.tagName === "BUTTON") {
                let div = ev.target.parentNode;
                div.remove();
                toLocal();
            }
        },
        false
    );
    document
        .getElementById("addBtn")
        .addEventListener("click", newElement, false);

    function newElement() {
        let li = document.createElement("li");
        let inputValue = document.getElementById("task-input").value;
        let t = document.createTextNode(inputValue);
        li.appendChild(t);
        if (inputValue == "") {
            alert("Введите ваше дело!");
        } else {
            document.getElementById("task-list").appendChild(li);
        }
        document.getElementById("task-input").value = "";
        let checkbox = document.createElement("INPUT");
        checkbox.type = "checkbox";
        let deleteBtn = document.createElement("BUTTON");
        deleteBtn.innerHTML = "Удалить";
        li.appendChild(checkbox);
        li.appendChild(deleteBtn);
        toLocal();
    }
    document.getElementById("clearAll").addEventListener("click", clearAll);

    function clearAll() {
        let list = document.getElementById("task-list");
        list.innerHTML = "";
        toLocal();
    }
    document.getElementById("allDone").addEventListener("click", checkedAll);

    var add = true;
    function checkedAll() {
        var li = document.querySelectorAll("li");
        for (var i = 0; i < li.length; i++) {
            li[i].classList[add ? "add" : "remove"]("checked");
            if (add) li[i].firstElementChild.checked = "checked";
            else li[i].firstElementChild.checked = "";
        }
        add = !add;

        toLocal();
    }

    if (localStorage.getItem("todos")) {
        list.innerHTML = localStorage.getItem("todos");
    }
};
