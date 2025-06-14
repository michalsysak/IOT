const API_BASE_URL = window.location.origin;

document.addEventListener('DOMContentLoaded', function() {
    // Sprawdź czy użytkownik jest już zalogowany
    if (localStorage.getItem('userId')) {
        window.location.href = 'index.html';
    }

    // Obsługa formularza logowania
    document.getElementById('loginForm').addEventListener('submit', handleLogin);
});

async function handleLogin(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('errorMessage');
    const loadingDiv = document.getElementById('loadingMessage');
    
    // Ukryj poprzednie komunikaty
    hideMessage(errorDiv);
    showMessage(loadingDiv);
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        hideMessage(loadingDiv);

        if (response.ok) {
            // Zapisz dane użytkownika w localStorage
            localStorage.setItem('userId', data.userId);
            localStorage.setItem('username', username);
            
            // Przekieruj do strony głównej
            window.location.href = 'index.html';
        } else {
            showError(errorDiv, data.error || 'Błąd logowania');
        }
    } catch (error) {
        hideMessage(loadingDiv);
        showError(errorDiv, 'Błąd połączenia z serwerem');
        console.error('Login error:', error);
    }
}

function showMessage(element) {
    element.style.display = 'block';
}

function hideMessage(element) {
    element.style.display = 'none';
}

function showError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}