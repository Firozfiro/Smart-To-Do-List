let input = document.getElementById("task-input")
let btn = document.getElementById("add-btn")
let list = document.getElementById("task-list")

input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        btn.click()
    }
})

function saveTasks() {
  let tasks = [];
  document.querySelectorAll("#task-list li").forEach(li => {
    let span = li.querySelector("span");
    let checkBox = li.querySelector("input[type='checkbox']");
    tasks.push({
      text: span.textContent,
      completed: checkBox.checked
    });
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function loadTasks() {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.forEach(task => {
    createTask(task.text, task.completed);
  });
}

let currentEdit = null;

function createTask(text, completed = false) {

let lii = document.createElement("li")
let span = document.createElement("span")
let edit = document.createElement("button")
let delBtn= document.createElement("button")
let checkBox= document.createElement("input")

edit.textContent = "Edit"
edit.classList.add("edit-btn")
delBtn.classList.add("delete-btn")
delBtn.textContent = "Delete"
lii.classList.add("list")

list.appendChild(lii)
lii.appendChild(checkBox)
lii.appendChild(span)
lii.appendChild(edit)
lii.appendChild(delBtn)
span.textContent = text
checkBox.setAttribute("type","checkbox")
checkBox.checked = completed 
if(completed) {
  span.style.textDecoration = "line-through";
  span.style.color = "grey";
}

checkBox.addEventListener("change", ()=> {
if(checkBox.checked) {
span.style.textDecoration = "line-through"
span.style.color = "grey"
}else {
span.style.textDecoration = "none"
span.style.color = "black"
}
saveTasks();
});

delBtn.addEventListener("click",()=> {
lii.remove()
input.value = ""
btn.textContent = "Add Task"
saveTasks()
});

edit.addEventListener("click",()=>{
input.value = span.textContent
input.focus()
currentEdit = span
btn.textContent = "Update"
});
}

btn.addEventListener("click", ()=> {
let taskValue  = input.value.trim()
if (taskValue === "") {
  alert("Please enter a text")
return 
}
if (currentEdit !== null) {
currentEdit.textContent = input.value
currentEdit = null
input.value = ""
btn.textContent = "Add Task"
saveTasks()
return
}
createTask(taskValue)
  input.value = ""
  saveTasks()
});
loadTasks();