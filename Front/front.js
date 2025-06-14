// Konfiguracja aplikacji
const API_BASE_URL = window.location.origin;

// Główny obiekt aplikacji
const TodoApp = {
    // Właściwości
    currentUserId: localStorage.getItem('userId'),
    currentUsername: localStorage.getItem('username'),

    // Inicjalizacja aplikacji
    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.initializePage();
        });
    },

    // Inicjalizacja strony na podstawie URL
    initializePage() {
        const currentPage = window.location.pathname;
        
        if (currentPage.includes('login.html') || currentPage === '/') {
            this.initLoginPage();
        } else if (currentPage.includes('index.html')) {
            this.initMainPage();
        }
    },

    // Inicjalizacja strony logowania
    initLoginPage() {
        // Sprawdź czy użytkownik jest już zalogowany
        if (this.currentUserId) {
            window.location.href = 'index.html';
            return;
        }

        // Dodaj event listener do formularza logowania
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
    },

    // Inicjalizacja strony głównej
    initMainPage() {
        // Sprawdź czy użytkownik jest zalogowany
        if (!this.currentUserId) {
            window.location.href = 'login.html';
            return;
        }

        // Ustaw nazwę użytkownika
        const currentUserElement = document.getElementById('currentUser');
        if (currentUserElement) {
            currentUserElement.textContent = this.currentUsername;
        }

        // Dodaj event listener do formularza zadań
        const todoForm = document.getElementById('todoForm');
        if (todoForm) {
            todoForm.addEventListener('submit', (e) => this.handleAddTodo(e));
        }

        // Załaduj zadania przy starcie
        this.loadTodos();
    },

    // Obsługa logowania
    async handleLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('errorMessage');
        const loadingDiv = document.getElementById('loadingMessage');
        
        // Ukryj poprzednie komunikaty
        this.hideMessage(errorDiv);
        this.showMessage(loadingDiv);
        
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            this.hideMessage(loadingDiv);

            if (response.ok) {
                // Zapisz dane użytkownika
                localStorage.setItem('userId', data.userId);
                localStorage.setItem('username', username);
                this.currentUserId = data.userId;
                this.currentUsername = username;
                
                // Przekieruj do strony głównej
                window.location.href = 'index.html';
            } else {
                this.showError(errorDiv, data.error || 'Błąd logowania');
            }
        } catch (error) {
            this.hideMessage(loadingDiv);
            this.showError(errorDiv, 'Błąd połączenia z serwerem');
            console.error('Login error:', error);
        }
    },

    // Wylogowanie
    logout() {
        localStorage.removeItem('userId');
        localStorage.removeItem('username');
        this.currentUserId = null;
        this.currentUsername = null;
        window.location.href = 'login.html';
    },

    // Obsługa dodawania zadania
    async handleAddTodo(e) {
        e.preventDefault();
        
        const title = document.getElementById('todoTitle').value.trim();
        const description = document.getElementById('todoDescription').value.trim();
        
        if (!title) {
            this.showTodoMessage('Tytuł zadania jest wymagany', 'error');
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/todos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-user-id': this.currentUserId
                },
                body: JSON.stringify({ title, description })
            });

            const data = await response.json();

            if (response.ok) {
                this.showTodoMessage('Zadanie zostało dodane!', 'success');
                document.getElementById('todoForm').reset();
                this.loadTodos(); // Odśwież listę zadań
            } else {
                this.showTodoMessage(data.error || 'Błąd podczas dodawania zadania', 'error');
            }
        } catch (error) {
            this.showTodoMessage('Błąd połączenia z serwerem', 'error');
            console.error('Add todo error:', error);
        }
    },

    // Ładowanie zadań
    async loadTodos() {
        const loadingDiv = document.getElementById('loadingTodos');
        
        this.showLoadingState(true);
        
        try {
            const response = await fetch(`${API_BASE_URL}/todos`, {
                headers: {
                    'x-user-id': this.currentUserId
                }
            });

            const todos = await response.json();
            this.showLoadingState(false);

            if (response.ok) {
                this.displayTodos(todos);
            } else {
                this.showTodoMessage(todos.error || 'Błąd podczas ładowania zadań', 'error');
            }
        } catch (error) {
            this.showLoadingState(false);
            this.showTodoMessage('Błąd połączenia z serwerem', 'error');
            console.error('Load todos error:', error);
        }
    },

    // Wyświetlanie zadań
    displayTodos(todos) {
        const todosList = document.getElementById('todosList');
        const noTodos = document.getElementById('noTodos');
        
        if (!todosList || !noTodos) return;
        
        // Wyczyść listę
        todosList.innerHTML = '';
        
        if (todos.length === 0) {
            noTodos.style.display = 'block';
            return;
        }
        
        noTodos.style.display = 'none';
        
        todos.forEach(todo => {
            const todoItem = this.createTodoElement(todo);
            todosList.appendChild(todoItem);
        });
    },

    // Tworzenie elementu zadania
    createTodoElement(todo) {
        const todoItem = document.createElement('li');
        todoItem.className = 'todo-item';
        todoItem.innerHTML = `
            <div class="todo-content">
                <div class="todo-info">
                    <h3>${this.escapeHtml(todo.title)}</h3>
                    ${todo.description ? `<p>${this.escapeHtml(todo.description)}</p>` : ''}
                    <small class="todo-date">Utworzono: ${this.formatDate(todo.created_at)}</small>
                </div>
                <div class="todo-actions">
                    <button class="btn btn-danger btn-small" onclick="TodoApp.deleteTodo(${todo.id})">
                        🗑️ Usuń
                    </button>
                </div>
            </div>
        `;
        return todoItem;
    },

    // Usuwanie zadania
    async deleteTodo(todoId) {
        if (!confirm('Czy na pewno chcesz usunąć to zadanie?')) {
            return;
        }
        
        try {
            const response = await fetch(`${API_BASE_URL}/todos/${todoId}`, {
                method: 'DELETE',
                headers: {
                    'x-user-id': this.currentUserId
                }
            });

            const data = await response.json();

            if (response.ok) {
                this.showTodoMessage('Zadanie zostało usunięte!', 'success');
                this.loadTodos(); // Odśwież listę zadań
            } else {
                this.showTodoMessage(data.error || 'Błąd podczas usuwania zadania', 'error');
            }
        } catch (error) {
            this.showTodoMessage('Błąd połączenia z serwerem', 'error');
            console.error('Delete todo error:', error);
        }
    },

    // Funkcje pomocnicze dla komunikatów
    showMessage(element) {
        if (element) element.style.display = 'block';
    },

    hideMessage(element) {
        if (element) element.style.display = 'none';
    },

    showError(element, message) {
        if (element) {
            element.textContent = message;
            element.style.display = 'block';
        }
    },

    showTodoMessage(message, type = 'success') {
        const messageDiv = document.getElementById('todoMessage');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.className = `message ${type}`;
            messageDiv.style.display = 'block';
            
            setTimeout(() => {
                messageDiv.style.display = 'none';
            }, 3000);
        }
    },

    showLoadingState(isLoading) {
        const loadingDiv = document.getElementById('loadingTodos');
        if (loadingDiv) {
            loadingDiv.style.display = isLoading ? 'block' : 'none';
        }
    },

    // Funkcje pomocnicze
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },

    formatDate(dateString) {
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
};

// Inicjalizacja aplikacji
TodoApp.init();

// Eksport dla kompatybilności z onclick w HTML
window.TodoApp = TodoApp;