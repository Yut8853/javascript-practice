// タスクを追加するためのフォームを選択します
const addForm = document.querySelector('.td-add-form');
// タスクの入力フィールドを選択します
const addInput = document.querySelector('.td-add-input');
// 未完了のタスクを表示するリストを選択します
const todosUl = document.querySelector('.todos');
// 完了したタスクを表示するリストを選択します
const donesUl = document.querySelector('.dones');
// タスクを検索するためのフォームを選択します
const seachForm = document.querySelector('.td-search-form');
// タスクを検索するための入力フィールドを選択します
const seachInput = document.querySelector('.td-search-input');

// タスクのデータを保存するための配列を初期化します
let todoData = [];

// タスク追加フォームが送信された時の動作を定義します
addForm.addEventListener('submit', e => {
    e.preventDefault(); // ページのリロードを防ぐため、デフォルトの送信アクションをキャンセルします
    // 新しいタスクオブジェクトを作成します
    let todoObj = {
        content: addInput.value.trim(), // 入力されたタスクの内容を取得し、余分な空白を削除します
        isDone: false // タスクの状態を未完了に設定します
    }
    // タスクの内容が空でなければ、配列にタスクオブジェクトを追加します
    if(todoObj.content){
        todoData.push(todoObj);
    }
    // 入力フィールドをクリアします
    addInput.value = '';
    // ローカルストレージを更新します
    upDateLS();
    // タスクリストを更新します
    updateTodo();
});

// ローカルストレージにタスクデータを保存します
const upDateLS = () => {
    localStorage.setItem('myTodo', JSON.stringify(todoData));
}

// ローカルストレージからタスクデータを取得します
const getTodoData = () => {
    return JSON.parse(localStorage.getItem('myTodo') || '[]'); // ローカルストレージが空の場合、空の配列を返します
}

// タスクデータからタスクのHTML要素を作成します
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

// タスクリストを更新し、画面に表示します
const updateTodo = () => {
    // 未完了と完了のタスクリストの内容をクリアします
    todosUl.innerHTML = '';
    donesUl.innerHTML = '';
    // ローカルストレージから最新のタスクデータを取得します
    todoData = getTodoData();
    // 各タスクに対して、HTML要素を作成し追加します
    todoData.forEach(todo => {
        createTodoElement(todo);
    })
}

// 初回ページ読み込み時にタスクリストを表示します
updateTodo();

// タスク検索フォームが送信された時の動作を定義します
seachForm.addEventListener('submit', e => {
    e.preventDefault(); // ここには「e」が必要です。デフォルトの送信アクションをキャンセルします
})

// タスク検索入力フィールドでキーが押された時の動作を定義します
seachInput.addEventListener('keyup', () => {
    const searchWord = seachInput.value.trim().toLowerCase(); // 検索ワードを取得し、小文字に変換します
    const todoItems = document.querySelectorAll('.td-item'); // すべてのタスクアイテムを選択します
    // 各タスクアイテムに対して、検索ワードが含まれているか確認し、表示/非表示を切り替えます
    todoItems.forEach(todoItem => {
        if(!todoItem.textContent.toLowerCase().includes(searchWord)) {
            todoItem.classList.add('hide'); // タスクアイテムに「hide」クラスを追加します。ここは元のコードが間違っています。
        } else {
            todoItem.classList.remove('hide'); // タスクアイテムから「hide」クラスを削除します。ここは元のコードが間違っています。
        }
    })
})
