const API_BASE_URL = window.location.origin;
let currentUserId = localStorage.getItem('userId');
let currentUsername = localStorage.getItem('username');

document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Sprawdź czy użytkownik jest zalogowany
    if (!currentUserId) {
        window.location.href = 'login.html';
        return;
    }

    // Ustaw nazwę użytkownika
    document.getElementById('currentUser').textContent = currentUsername;

    // Dodaj event listenery
    document.getElementById('todoForm').addEventListener('submit', handleAddTodo);

    // Załaduj zadania przy starcie
    loadTodos();
}

// Funkcja wylogowania
function logout() {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    window.location.href = 'login.html';
}

// Funkcja pokazywania komunikatów
function showMessage(message, type = 'success') {
    const messageDiv = document.getElementById('todoMessage');
    messageDiv.textContent = message;
    messageDiv.className = `message ${type}`;
    messageDiv.style.display = 'block';
    
    setTimeout(() => {
        messageDiv.style.display = 'none';
    }, 3000);
}

// Obsługa dodawania nowego zadania
async function handleAddTodo(e) {
    e.preventDefault();
    
    const title = document.getElementById('todoTitle').value.trim();
    const description = document.getElementById('todoDescription').value.trim();
    
    if (!title) {
        showMessage('Tytuł zadania jest wymagany', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-user-id': currentUserId
            },
            body: JSON.stringify({ title, description })
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Zadanie zostało dodane!', 'success');
            document.getElementById('todoForm').reset();
            loadTodos(); // Odśwież listę zadań
        } else {
            showMessage(data.error || 'Błąd podczas dodawania zadania', 'error');
        }
    } catch (error) {
        showMessage('Błąd połączenia z serwerem', 'error');
        console.error('Add todo error:', error);
    }
}

// Ładowanie zadań
async function loadTodos() {
    const loadingDiv = document.getElementById('loadingTodos');
    
    showLoadingState(true);
    
    try {
        const response = await fetch(`${API_BASE_URL}/todos`, {
            headers: {
                'x-user-id': currentUserId
            }
        });

        const todos = await response.json();
        showLoadingState(false);

        if (response.ok) {
            displayTodos(todos);
        } else {
            showMessage(todos.error || 'Błąd podczas ładowania zadań', 'error');
        }
    } catch (error) {
        showLoadingState(false);
        showMessage('Błąd połączenia z serwerem', 'error');
        console.error('Load todos error:', error);
    }
}

// Wyświetlanie stanu ładowania
function showLoadingState(isLoading) {
    const loadingDiv = document.getElementById('loadingTodos');
    loadingDiv.style.display = isLoading ? 'block' : 'none';
}

// Wyświetlanie zadań
function displayTodos(todos) {
    const todosList = document.getElementById('todosList');
    const noTodos = document.getElementById('noTodos');
    
    // Wyczyść listę
    todosList.innerHTML = '';
    
    if (todos.length === 0) {
        noTodos.style.display = 'block';
        return;
    }
    
    noTodos.style.display = 'none';
    
    todos.forEach(todo => {
        const todoItem = createTodoElement(todo);
        todosList.appendChild(todoItem);
    });
}

// Tworzenie elementu zadania
function createTodoElement(todo) {
    const todoItem = document.createElement('li');
    todoItem.className = 'todo-item';
    todoItem.innerHTML = `
        <div class="todo-content">
            <div class="todo-info">
                <h3>${escapeHtml(todo.title)}</h3>
                ${todo.description ? `<p>${escapeHtml(todo.description)}</p>` : ''}
                <small class="todo-date">Utworzono: ${formatDate(todo.created_at)}</small>
            </div>
            <div class="todo-actions">
                <button class="btn btn-danger btn-small" onclick="deleteTodo(${todo.id})">
                    🗑️ Usuń
                </button>
            </div>
        </div>
    `;
    return todoItem;
}

// Usuwanie zadania
async function deleteTodo(todoId) {
    if (!confirm('Czy na pewno chcesz usunąć to zadanie?')) {
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
            method: 'DELETE',
            headers: {
                'x-user-id': currentUserId
            }
        });

        const data = await response.json();

        if (response.ok) {
            showMessage('Zadanie zostało usunięte!', 'success');
            loadTodos(); // Odśwież listę zadań
        } else {
            showMessage(data.error || 'Błąd podczas usuwania zadania', 'error');
        }
    } catch (error) {
        showMessage('Błąd połączenia z serwerem', 'error');
        console.error('Delete todo error:', error);
    }
}

// Funkcje pomocnicze
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleString('pl-PL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}