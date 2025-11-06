// 👉 (NEW) Add your backend API base URL
// const API_BASE = "http://localhost:3000"; 
const API_BASE = "https://firoz-backend-1st-project.onrender.com"; 
// Change to your deployed backend URL later (e.g. https://your-backend.onrender.com)

let input = document.getElementById("task-input");
let btn = document.getElementById("add-btn");
let list = document.getElementById("task-list");

input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        btn.click();
    }
});

let currentEdit = null;

// 👉 (CHANGED) Updated createTask() to include todo ID
function createTask(text, completed = false, id = null) {
  let lii = document.createElement("li");
  lii.dataset.id = id; // 👉 (NEW) store MongoDB ID

  let span = document.createElement("span");
  let edit = document.createElement("button");
  let delBtn = document.createElement("button");
  let checkBox = document.createElement("input");

  edit.textContent = "Edit";
  edit.classList.add("edit-btn");
  delBtn.classList.add("delete-btn");
  delBtn.textContent = "Delete";
  lii.classList.add("list");

  list.appendChild(lii);
  lii.appendChild(checkBox);
  lii.appendChild(span);
  lii.appendChild(edit);
  lii.appendChild(delBtn);
  span.textContent = text;
  checkBox.setAttribute("type","checkbox");
  checkBox.checked = completed;
  if(completed) {
    span.style.textDecoration = "line-through";
    span.style.color = "grey";
  }

  checkBox.addEventListener("change", ()=> {
    if(checkBox.checked) {
      span.style.textDecoration = "line-through";
      span.style.color = "grey";
    } else {
      span.style.textDecoration = "none";
      span.style.color = "black";
    }
  });

  // 👉 (CHANGED) Delete now calls backend
  delBtn.addEventListener("click", async ()=> {
    try {
      await fetch(`${API_BASE}/todos/${lii.dataset.id}`, { method: "DELETE" });
      loadTasks(); // refresh list
    } catch(err) {
      console.error("Delete failed:", err);
    }
  });

  // 👉 (CHANGED) Edit stores ID for backend update
  edit.addEventListener("click", ()=>{
    input.value = span.textContent;
    input.focus();
    currentEdit = { span, id: lii.dataset.id }; // store id
    btn.textContent = "Update";
  });
}

// 👉 (NEW) Load tasks from MongoDB
async function loadTasks() {
  try {
    const res = await fetch(`${API_BASE}/todos`);
    const todos = await res.json();
    list.innerHTML = ""; // clear old list
    todos.forEach(todo => {
      createTask(todo.title, false, todo._id);
    });
  } catch (err) {
    console.error("Error loading tasks:", err);
  }
}

// 👉 (CHANGED) Button click — now talks to backend
btn.addEventListener("click", async ()=> {
  let taskValue  = input.value.trim();
  if (taskValue === "") {
    alert("Please enter a text");
    return;
  }

  // 👉 (NEW) Update existing task in DB
  if (currentEdit !== null) {
    try {
      await fetch(`${API_BASE}/todos/${currentEdit.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: input.value, description: "" })
      });
      currentEdit = null;
      input.value = "";
      btn.textContent = "Add Task";
      loadTasks(); // reload updated list
      return;
    } catch (err) {
      console.error("Update failed:", err);
    }
  }

  // 👉 (NEW) Add new task to MongoDB
  try {
    await fetch(`${API_BASE}/todos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: taskValue, description: "" })
    });
    input.value = "";
    loadTasks(); // refresh list
  } catch (err) {
    console.error("Add failed:", err);
  }
});

// 👉 (CHANGED) Call loadTasks() — no localStorage now
loadTasks();
