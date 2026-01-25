// auth.js — регистрация, вход, профиль с загрузкой аватара

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

// ... (весь предыдущий код остаётся)

// В разделе профиля (editForm)
if (editForm) {
  // ... (загрузка данных)

  editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newStatus = document.getElementById('new-status').value.trim() || 'Новобранец';
    let newAvatar = document.getElementById('avatar-url').value.trim();

    const fileInput = document.getElementById('avatar-file');
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        newAvatar = event.target.result; // base64
        saveProfile(newStatus, newAvatar);
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      saveProfile(newStatus, newAvatar);
    }
  });

  function saveProfile(status, avatar) {
    user.status = status;
    user.avatar = avatar || user.avatar || '/default-avatar.png';

    users[currentUser] = user;
    localStorage.setItem('korbonUsers', JSON.stringify(users));

    document.getElementById('status-display').textContent = status;
    document.getElementById('avatar-preview').src = user.avatar;

    alert('Профиль обновлён!');
  }
}
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
    document.getElementById('avatar-url').value = user.avatar.startsWith('data:') ? '' : user.avatar;
  }

  editForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newStatus = document.getElementById('new-status').value.trim() || 'Новобранец';
    let newAvatar = document.getElementById('avatar-url').value.trim();

    // Если выбран файл — используем base64
    const fileInput = document.getElementById('avatar-file');
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        newAvatar = event.target.result; // base64 строка
        saveProfile(newStatus, newAvatar);
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      saveProfile(newStatus, newAvatar);
    }
  });

  function saveProfile(status, avatar) {
    user.status = status;
    user.avatar = avatar || '/default-avatar.png';

    users[currentUser] = user;
    localStorage.setItem('korbonUsers', JSON.stringify(users));

    document.getElementById('status-display').textContent = status;
    document.getElementById('avatar-preview').src = avatar || '/default-avatar.png';

    alert('Профиль обновлён!');
  }
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
