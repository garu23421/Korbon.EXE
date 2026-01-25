// auth.js — простая регистрация и профиль на localStorage

const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');
const editForm = document.getElementById('edit-form');

if (registerForm) {
  registerForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    const discord = document.getElementById('discord').value.trim();
    const avatarUrl = document.getElementById('avatar-url').value.trim();

    if (password.length < 6) {
      showMessage('register-message', 'Пароль минимум 6 символов', 'error');
      return;
    }

    const users = JSON.parse(localStorage.getItem('korbonUsers')) || {};

    if (users[username]) {
      showMessage('register-message', 'Позывной занят', 'error');
      return;
    }

    users[username] = {
      password,
      discord: discord || 'Не указан',
      avatar: avatarUrl || '/default-avatar.png',
      status: 'Новобранец'
    };

    localStorage.setItem('korbonUsers', JSON.stringify(users));
    localStorage.setItem('currentUser', username);

    showMessage('register-message', 'Регистрация успешна! Теперь войди.', 'success');
    setTimeout(() => window.location.href = 'login.html', 2000);
  });
}

if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    const users = JSON.parse(localStorage.getItem('korbonUsers')) || {};

    if (!users[username] || users[username].password !== password) {
      showMessage('login-message', 'Неверный ник или пароль', 'error');
      return;
    }

    localStorage.setItem('currentUser', username);
    showMessage('login-message', 'Вход выполнен!', 'success');
    setTimeout(() => window.location.href = 'profile.html', 1500);
  });
}

if (editForm) {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) {
    window.location.href = 'login.html';
  }

  const users = JSON.parse(localStorage.getItem('korbonUsers')) || {};
  const user = users[currentUser];

  if (user) {
    document.getElementById('username-display').textContent = currentUser;
    document.getElementById('discord-display').textContent = user.discord;
    document.getElementById('status-display').textContent = user.status;
    document.getElementById('avatar-preview').src = user.avatar;

    document.getElementById('new-status').value = user.status;
    document.getElementById('new-avatar').value = user.avatar === '/default-avatar.png' ? '' : user.avatar;
  }

  editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newStatus = document.getElementById('new-status').value.trim() || 'Новобранец';
    const newAvatar = document.getElementById('new-avatar').value.trim() || '/default-avatar.png';

    user.status = newStatus;
    user.avatar = newAvatar;

    users[currentUser] = user;
    localStorage.setItem('korbonUsers', JSON.stringify(users));

    document.getElementById('status-display').textContent = newStatus;
    document.getElementById('avatar-preview').src = newAvatar;

    alert('Профиль обновлён!');
  });
}

const logoutBtn = document.getElementById('logout');
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('currentUser');
    window.location.href = 'index.html';
  });
}

function showMessage(id, text, type) {
  const msg = document.getElementById(id);
  if (msg) {
    msg.textContent = text;
    msg.className = `auth-message ${type}`;
    msg.classList.remove('hidden');
    setTimeout(() => msg.classList.add('hidden'), 5000);
  }
}
