'use strict';

const addButton = document.querySelector(".addButton");
const confirmButton = document.querySelector(".confirmButton");
const popup = document.querySelector(".popup");
const inputTodo = document.querySelector(".inputTodo");
const ulTodo = document.querySelector(".ulTodo")
const inputWarning = document.querySelector(".inputWarning");
const closeIcon = document.querySelector(".closeIcon");
const inputDate = document.querySelector("#inputDate");
const inputColor = document.querySelector("#inputColor");

const darkmodeButton = document.querySelector("#darkmode");
const darkmodeDot = document.querySelector(".dot");

const snd = new Audio("sound.mp3");

let todos = [];

loadTasksFromLocalStorage();


// Notizen
// Evtl. Objekt pro Todo Eintrag erzeugen für weitere Eigenschaften wie Date ..., Favicon, farbe wechseln, settings costumizable

// Darkmode
darkmodeButton.addEventListener("click", function() {
    if (darkmodeDot.classList.contains("transformToRight")) {
        darkmodeDot.classList.remove("transformToRight");
        darkmodeButton.style.backgroundColor = "#ffffff";
        darkmodeDot.style.backgroundColor = "#000000"
    } else {
        darkmodeDot.classList.add("transformToRight");
        darkmodeButton.style.backgroundColor = "#000000";
        darkmodeDot.style.backgroundColor = "#ffffff"
    }
});  


// Popup öffnen
addButton.addEventListener("click", function() {
    popup.style.display = "block";
    inputTodo.focus();
});

// Popup schliessen
closeIcon.addEventListener("click", function() {
    popup.style.display = "none";
    inputTodo.value = "";
});

// Popup schliessen, wenn man ausserhalb des Popups drückt
document.addEventListener("click", function(event) {
    if (!popup.contains(event.target) && event.target !== addButton) {
        popup.style.display = "none";
        inputTodo.value = "";
    }
});

// Bestätigungsknop für Todo
confirmButton.addEventListener("click", function() {
    let newTodo =  document.createElement("li");
    if (inputTodo.value.length == 0) {
        inputWarning.textContent = "Bitte Text eingeben!";
    } else {
        console.log(inputDate.value);
        popup.style.display = "none";
        todos.push(inputTodo.value);
        newTodo.classList.add("entry");
        newTodo.textContent = inputTodo.value;
        ulTodo.appendChild(newTodo);
        inputTodo.value = "";

        let icon1 = document.createElement("ion-icon");
        icon1.classList.add("circle");
        icon1.name = "ellipse-outline"
        newTodo.appendChild(icon1);
        
        let icon2 = document.createElement("ion-icon");
        icon2.classList.add("check");
        icon2.name = "checkmark-outline";
        newTodo.appendChild(icon2);
    }
    
    newTodo.addEventListener("click", function(event) {   
        let todoText = newTodo.textContent.trim();
        let index = todos.indexOf(todoText);
        if (index !== -1) {
            todos.splice(index, 1)
            console.log("test1");
            updateLocalStorage();
        }
        newTodo.remove();
        snd.play();
    });
    updateLocalStorage();
});

// Entertaste für Bestätigung
inputTodo.addEventListener("keypress", function(event) {
    if (event.keyCode === 13) {
        confirmButton.click();
    }
});

// Textlänge überprüfen
inputTodo.addEventListener("input", function() {
    var charCount = inputTodo.value.length;
    if (charCount == 30) {
        inputWarning.textContent = "Maximal 30 Zeichen!";
    } else {
        inputWarning.textContent = "";
    }
});

// Alles löschen
document.querySelector("#deleteAll").addEventListener("click", function() {
    if (todos.length == 0) {
        alert("Keine Todo Einträge!")
    } else {
        if (confirm("Sind Sie sicher, dass alle Todo Einträge gelöscht werden sollen?")) {
            todos = [];
            ulTodo.innerHTML = "";
            updateLocalStorage(); 
        }
    }
    
});



// Im Browser Local speichernas
function updateLocalStorage() {
    localStorage.setItem('todos', JSON.stringify(todos));
}
function loadTasksFromLocalStorage() {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
        todos = JSON.parse(storedTodos);

        todos.forEach(function(todo) {
            let newTodo = document.createElement("li");
            newTodo.classList.add("entry");
            newTodo.innerHTML = todo;
            ulTodo.appendChild(newTodo);
            inputTodo.value = "";

            let icon1 = document.createElement("ion-icon");
            icon1.classList.add("circle");
            icon1.name = "ellipse-outline"
            newTodo.appendChild(icon1);
            
            let icon2 = document.createElement("ion-icon");
            icon2.classList.add("check");
            icon2.name = "checkmark-outline";
            newTodo.appendChild(icon2);

            newTodo.addEventListener("click", function() {
                let todoText = newTodo.textContent.trim();
                let index = todos.indexOf(todoText);
                if (index !== -1) {
                    todos.splice(index, 1);
                    console.log("test2");
                    updateLocalStorage();
                }
                newTodo.remove();
                snd.play();
            });
            
        });
    }updateLocalStorage();
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


// Überprüfen maximale Länge von Liste 
if (todos.length === 10) {
    console.log("maximale Anzahl von Einträgen erreicht!")
}


// Change Color 

/* let color = inputColor.value;
console.log(color);
document.body.style.color = color;
const root = document.documentElement;
root.style.setProperty('--primary-color', color); */