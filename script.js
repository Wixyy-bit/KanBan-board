const todo = document.getElementById("todo")
const inprogress = document.getElementById("inprogress")
const done = document.getElementById("done")
const tasks = document.querySelectorAll(".task");
let dragedelemnt = null

const addtask = document.getElementById("new-task")
const form = document.querySelector(".create-task")
const bg = document.querySelector(".bg")
const addbtn = document.querySelector("#add-btn")

const arr = [todo, inprogress, done]


function loadTasks() {
    const saved = JSON.parse(localStorage.getItem("kanban-data")) || {}

    Object.keys(saved).forEach(columnId => {
        saved[columnId].forEach(task => {
            createTaskElement(task.title, task.desc, document.getElementById(columnId))
        })
    })

    UpdateCount()
}

function saveTasks() {
    const data = {
        todo: [],
        inprogress: [],
        done: []
    }

    arr.forEach(col => {
        const tasks = col.querySelectorAll(".task")

        tasks.forEach(t => {
            data[col.id].push({
                title: t.querySelector("h2").innerText,
                desc: t.querySelector("p").innerText
            })
        })
    })

    localStorage.setItem("kanban-data", JSON.stringify(data))
}


function createTaskElement(title, desc, parent) {
    const div = document.createElement("div")
    div.classList.add("task")
    div.setAttribute("draggable", "true")

    div.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
        <button>Delete</button>
    `

    // drag event
    div.addEventListener("drag", function () {
        dragedelemnt = div
    })

    // delete event
    div.querySelector("button").addEventListener("click", function () {
        div.remove()
        UpdateCount()
        saveTasks()
    })

    parent.appendChild(div)
}


function UpdateCount(){
    arr.forEach(function(col){
        const tasks = col.querySelectorAll(".task");
        const count = col.querySelector("#count")
        count.innerHTML = tasks.length  
    })
}


function taskdraggingeffects(name){
    name.addEventListener("dragenter", function(e){
        e.preventDefault();
        name.classList.add("drag-hover")
    })
    name.addEventListener("dragleave", function(e){
        e.preventDefault();
        name.classList.remove("drag-hover")
    })
    name.addEventListener("dragover", function(e){
        e.preventDefault();
    })
    name.addEventListener("drop", function(e){
        e.preventDefault();
        name.appendChild(dragedelemnt)
        name.classList.remove("drag-hover")
        UpdateCount()
        saveTasks()
    })
}

taskdraggingeffects(todo);
taskdraggingeffects(inprogress);
taskdraggingeffects(done);


addtask.addEventListener("click", function(){
    form.classList.add("active")
})

bg.addEventListener("click", function(){
    form.classList.remove("active")
})

addbtn.addEventListener("click", function(){
    const title = document.querySelector("#title").value
    const desc = document.querySelector("#Discription").value

    createTaskElement(title, desc, todo)
    UpdateCount()
    saveTasks()

    form.classList.remove("active")
    document.querySelector("#title").value = ""
    document.querySelector("#Discription").value = ""
})

loadTasks()
