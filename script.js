document.addEventListener('DOMContentLoaded', function() {
    const todoInput = document.getElementById('todo-input');
    const dateInput = document.getElementById('date-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const sortDateBtn = document.getElementById('sort-date-btn');
    const sortNameBtn = document.getElementById('sort-name-btn');
    
    let todos = JSON.parse(localStorage.getItem('todos')) || [];
    
    // Render todos on page load
    renderTodos();
    
    // Add new todo
    addBtn.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
    
    // Sort buttons
    sortDateBtn.addEventListener('click', sortByDate);
    sortNameBtn.addEventListener('click', sortByName);
    
    function addTodo() {
        const todoText = todoInput.value.trim();
        const todoDate = dateInput.value;
        
        if (todoText && todoDate) {
            const newTodo = {
                id: Date.now(),
                text: todoText,
                date: todoDate,
                completed: false
            };
            
            todos.push(newTodo);
            saveTodos();
            renderTodos();
            
            // Clear inputs
            todoInput.value = '';
            dateInput.value = '';
        } else {
            alert('Silakan isi tugas dan tanggal!');
        }
    }
    
    function renderTodos() {
        todoList.innerHTML = '';
        
        if (todos.length === 0) {
            todoList.innerHTML = '<p>Tidak ada tugas. Tambahkan tugas baru!</p>';
            return;
        }
        
        todos.forEach(todo => {
            const todoItem = document.createElement('li');
            todoItem.className = `todo-item ${todo.completed ? 'completed' : ''}`;
            todoItem.innerHTML = `
                <span class="todo-text">${todo.text}</span>
                <span class="todo-date">${formatDate(todo.date)}</span>
                <button class="delete-btn" data-id="${todo.id}">Hapus</button>
            `;
            
            // Toggle completed status
            todoItem.addEventListener('click', function() {
                toggleCompleted(todo.id);
            });
            
            todoList.appendChild(todoItem);
        });
        
        // Add event listeners to delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.stopPropagation();
                deleteTodo(parseInt(this.getAttribute('data-id')));
            });
        });
    }
    
    function toggleCompleted(id) {
        todos = todos.map(todo => {
            if (todo.id === id) {
                return {...todo, completed: !todo.completed};
            }
            return todo;
        });
        saveTodos();
        renderTodos();
    }
    
    function deleteTodo(id) {
        if (confirm('Apakah Anda yakin ingin menghapus tugas ini?')) {
            todos = todos.filter(todo => todo.id !== id);
            saveTodos();
            renderTodos();
        }
    }
    
    function sortByDate() {
        todos.sort((a, b) => new Date(a.date) - new Date(b.date));
        saveTodos();
        renderTodos();
    }
    
    function sortByName() {
        todos.sort((a, b) => a.text.localeCompare(b.text));
        saveTodos();
        renderTodos();
    }
    
    function saveTodos() {
        localStorage.setItem('todos', JSON.stringify(todos));
    }
    
    function formatDate(dateString) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }
});