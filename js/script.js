'use strict';

const addButton = document.querySelector(".addButton");
const confirmButton = document.querySelector(".confirmButton");
const popup = document.querySelector(".popup");
const inputTodo = document.querySelector(".inputTodo");
const ulTodo = document.querySelector(".ulTodo");
const inputWarning = document.querySelector(".inputWarning");
const closeIcon = document.querySelector(".closeIcon");
const inputDate = document.querySelector("#inputDate");
const inputColor = document.querySelector("#inputColor");

const snd = new Audio("sound.mp3");

let todos = [];

class Todo {
    constructor(text) {
        this.text = text;
        this.element = this.createTodoElement();
    }

    createTodoElement() {
        const newTodo = document.createElement("li");
        newTodo.classList.add("entry");
        newTodo.textContent = this.text;

        let icon1 = document.createElement("ion-icon");
        icon1.classList.add("circle");
        icon1.name = "ellipse-outline"
        newTodo.appendChild(icon1);

        let icon2 = document.createElement("ion-icon");
        icon2.classList.add("check");
        icon2.name = "checkmark-outline";
        newTodo.appendChild(icon2);

        newTodo.addEventListener("click", () => this.removeTodo());
        return newTodo;
    }

    removeTodo() {
        let index = todos.indexOf(this.text);
        if (index !== -1) {
            todos.splice(index, 1);
            updateLocalStorage();
        }
        this.element.remove();
        snd.play();
    }
}



loadTasksFromLocalStorage();

addButton.addEventListener("click", () => openPopup());

closeIcon.addEventListener("click", () => closePopup());

document.addEventListener("click", (event) => closePopupOutside(event));

confirmButton.addEventListener("click", () => addTodo());

inputTodo.addEventListener("keypress", (event) => {
    if (event.keyCode === 13) {
        confirmButton.click();
    }
});

inputTodo.addEventListener("input", () => checkInputLength());

document.querySelector("#deleteAll").addEventListener("click", () => deleteAll());

//export
function openPopup() {
    popup.style.display = "block";
    inputTodo.focus();
}

function closePopup() {
    popup.style.display = "none";
    inputTodo.value = "";
}

function closePopupOutside(event) {
    if (!popup.contains(event.target) && event.target !== addButton) {
        closePopup();
    }
}

function addTodo() {
    let newTodo = new Todo(inputTodo.value);
    if (inputTodo.value.length === 0) {
        inputWarning.textContent = "Bitte Text eingeben!";
    } else {
        popup.style.display = "none";
        todos.push(inputTodo.value);
        ulTodo.appendChild(newTodo.element);
        inputTodo.value = "";
    }
    updateLocalStorage();
}

function checkInputLength() {
    var charCount = inputTodo.value.length;
    if (charCount === 30) {
        inputWarning.textContent = "Maximal 30 Zeichen!";
    } else {
        inputWarning.textContent = "";
    }
}

function deleteAll() {
    if (todos.length === 0) {
        alert("Keine Todo Einträge!")
    } else {
        if (confirm("Sind Sie sicher, dass alle Todo Einträge gelöscht werden sollen?")) {
            todos = [];
            ulTodo.innerHTML = "";
            updateLocalStorage();
        }
    }
}

function updateLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTasksFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);

        todos.forEach(function (todo) {
            let newTodo = new Todo(todo);
            ulTodo.appendChild(newTodo.element);
        });
    }
    updateLocalStorage();
}




// Export

document.querySelector("#exportButton").addEventListener("click", function() {
    exportTodos();
});

function exportTodos() {
    let filename;
    let isNull = true;

    filename = prompt("Gib den Dateinamen an: ");
    if (filename == "") {
        filename = "MeineTodoListe";
        isNull = false;
    } else if (filename == null) {
        console.log("Abbruch");
    } else {
        isNull = false;
    }
    
    if (!isNull) {
       const todosExport = JSON.stringify(todos, null, 2);
    
        const blob = new Blob([todosExport], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = filename + ".json";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url); 
    }  
}



// Import

document.querySelector("#importButton").addEventListener("click", function() {
    document.querySelector("#importInput").click();
});

document.querySelector("#importInput").addEventListener("change", function(event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                todos = [];
                const importedTodos = JSON.parse(e.target.result);
                importedTodos.forEach(todo => todos.push(todo));
                updateLocalStorage();
            } catch (error) {
                console.error("Fehler beim Parsen der JSON-Datei:", error);
            }
        };
        reader.onerror = function(error) {
            console.error("Fehler beim Lesen der Datei:", error);
        };
        reader.readAsText(file);
    }
    updateLocalStorage();
    location.reload();
});






// Beta


var isDragging = false;
var offsetX, offsetY;
const betaButton = document.querySelector("#beta");
const betaDot = document.querySelector(".dot");
const betaFeatures = document.querySelector("#betaFeatures");
const minimizeIconBeta = document.querySelector(".minimizeIconBeta");
const closeIconBeta = document.querySelector(".closeIconBeta");
const move = document.querySelector("#move")
const features = document.querySelector("#features");

betaButton.addEventListener("click", () => toggleBeta());

move.addEventListener('mousedown', function (e) {
    isDragging = true;
    offsetX = e.clientX - betaFeatures.getBoundingClientRect().left;
    offsetY = e.clientY - betaFeatures.getBoundingClientRect().top;
});

document.addEventListener('mousemove', function (e) {
    if (isDragging) {
        var newX = e.clientX - offsetX;
        var newY = e.clientY - offsetY;
        betaFeatures.style.left = newX + 'px';
        betaFeatures.style.top = newY + 'px';
    }
});

document.addEventListener('mouseup', function () {
    isDragging = false;
});


closeIconBeta.addEventListener("click", function() {
    betaFeatures.style.display = "none";
});

minimizeIconBeta.addEventListener("click", function() {
    var featuresStyle = features.style.display;
    if (featuresStyle == "flex" || featuresStyle == "") {
        betaFeatures.classList.add("minimizeBeta");
        betaFeatures.classList.remove("maxBeta");
        features.style.display = "none";
        console.log("none"); 
    } else {
        betaFeatures.classList.remove("minimizeBeta");
        betaFeatures.classList.add("maxBeta");
        setTimeout(function() {
            features.style.display = "flex";
        }, 200);
        console.log("block");
    }
    
});

function toggleBeta() {
    if (betaDot.classList.contains("transformToRight")) {
        betaDot.classList.remove("transformToRight");
        betaButton.style.backgroundColor = "#ffffff";
        betaDot.style.backgroundColor = "#000000";
        betaFeatures.style.display = "none";
       
    } else {
        betaDot.classList.add("transformToRight");
        betaButton.style.backgroundColor = "#000000";
        betaDot.style.backgroundColor = "#ffffff";
        betaFeatures.style.display = "flex";
    }
} 

// Change Color 
function changeColor() {
    let color = inputColor.value;
    const root = document.documentElement;
    root.style.setProperty('--primary-color', color);
}
function setColorToDefault() {
    let color = "#28A6FA";
    const root = document.documentElement;
    root.style.setProperty('--primary-color', color);
} 