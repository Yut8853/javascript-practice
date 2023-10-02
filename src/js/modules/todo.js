const addForm = document.querySelector('.td-add-form');
const addInput = document.querySelector('.td-add-input');
const todosUl = document.querySelector('.todos');
const donesUl = document.querySelector('.dones');
const seachForm = document.querySelector('.td-search-form');
const seachInput = document.querySelector('.td-search-input');

let todoData = [];

addForm.addEventListener('submit', e => {
    e.preventDefault();
    let todoObj = {
        content: addInput.value.trim(),
        isDone: false
    }
    if(todoObj.content){
        todoData.push(todoObj);
    }
    addInput.value = '';
    upDateLS();
    updateTodo();
});

const upDateLS = () => {
    localStorage.setItem('myTodo', JSON.stringify(todoData));
}

const getTodoData = () => {
    return JSON.parse(localStorage.getItem('myTodo') || [])
}

const createTodoElement = (todo) => {
    const todoItem = document.createElement('li');
    todoItem.classList.add('td-item');
    const todoContent = document.createElement('p');
    todoContent.classList.add('td-content');
    todoContent.textContent = todo.content
    todoItem.appendChild(todoContent);

    const btnContainer = document.createElement('div');
    btnContainer.classList.add('td-btn-container');
    const btn = document.createElement('img');
    btn.classList.add('td-btn');
    const upBtn = btn.cloneNode(false);
    upBtn.setAttribute('src', './images/todo_button/up.png');

    if(!todo.isDone) {
        upBtn.classList.add('edit-btn');
        btn.classList.add('isDone-btn');
        btn.setAttribute('src', './images/todo_button/ok.png');
        btnContainer.appendChild(btn);
        btnContainer.appendChild(upBtn);
        todoItem.appendChild(btnContainer);
        todosUl.appendChild(todoItem);
    } else {
        upBtn.classList.add('undo-btn');
        btn.classList.add('delete-btn');
        btn.setAttribute('src', './images/todo_button/cancel.png');
        btnContainer.appendChild(btn);
        btnContainer.appendChild(upBtn);
        todoItem.appendChild(btnContainer);
        donesUl.appendChild(todoItem);
    }
    todoItem.addEventListener('click', e => {
        if(e.target.classList.contains('isDone-btn')) {
            todo.isDone = true;
        }
        if(e.target.classList.contains('delete-btn')) {
            todo.isDone = false;
        }
        if(e.target.classList.contains('edit-btn')) {
            addInput.value = e.target.parentElement.previousElementSibling.textContent
            todoData = todoData.filter(data => data !== todo);
            addInput.focus();
        }
        if(e.target.classList.contains('undo-btn')) {
            todoData = todoData.filter(data => data !== todo);
        }
        upDateLS();
        updateTodo();
    })
}

const updateTodo = () => {
    todosUl.innerHTML = '';
    donesUl.innerHTML = '';
    todoData = getTodoData();
    todoData.forEach(todo => {
        createTodoElement(todo);
    })
}

updateTodo();

seachForm.addEventListener('submit', () => {
    e.preventDefault();
})

seachInput.addEventListener('keyup', () => {
    const searchWord = seachInput.value.trim().toLowerCase();
    const todoItems = document.querySelectorAll('.td-item');
    todoItems.forEach(todoItem => {
        if(!todoItem.textContent.toLowerCase().includes(searchWord)) {
            todoItem.style.remove = ('hide');
        } else {
            todoItem.classList.add('hide');
        }
    })
})