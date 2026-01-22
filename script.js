document.addEventListener('DOMContentLoaded', () => {
  // Матрица на фоне (если canvas есть на странице)
  const canvas = document.getElementById('matrix-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');

    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;

    window.addEventListener('resize', () => {
      canvas.height = window.innerHeight;
      canvas.width = window.innerWidth;
    });

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*'.split('');
    const fontSize = 14;
    const columns = canvas.width / fontSize;
    const drops = Array(Math.floor(columns)).fill(1);

    function drawMatrix() {
      ctx.fillStyle = 'rgba(10, 10, 10, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00ff9d';
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const text = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;

        ctx.fillText(text, x, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    }

    setInterval(drawMatrix, 40);
  }

  // Обработка формы (только на странице join.html)
  const form = document.getElementById('join-form');
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();

      const submitBtn = form.querySelector('.submit-btn');
      const messageDiv = document.getElementById('form-message');
      const originalText = submitBtn.innerHTML;

      // Проверка reCAPTCHA
      const recaptchaResponse = grecaptcha.getResponse();
      if (!recaptchaResponse) {
        messageDiv.textContent = 'Пройдите проверку "Я не робот"';
        messageDiv.classList.remove('hidden', 'success');
        messageDiv.classList.add('error');
        return;
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span>Отправка...</span>';
      messageDiv.classList.add('hidden');

      const formData = new FormData(this);
      const data = {};
      formData.forEach((value, key) => { data[key] = value; });

      const message = {
        embeds: [{
          title: "🛡️ Новая заявка в KorbonEXE",
          color: 0x00FF9D,
          description: "Поступила свежая заявка с проверенной капчей.",
          fields: [
            { name: "Позывной / Имя", value: data.name || "—", inline: true },
            { name: "Желаемая роль", value: data.role || "—", inline: true },
            { name: "Ключевые навыки", value: "```" + (data.skills || "—") + "```", inline: false },
            { name: "Почему KorbonEXE?", value: "```" + (data.why || "—") + "```", inline: false },
            { name: "Связь", value: data.contact || "—", inline: true },
            { name: "reCAPTCHA", value: "Пройдена", inline: true }
          ],
          timestamp: new Date().toISOString(),
          footer: { text: "KorbonEXE • .EXE YOUR LIMITS • " + new Date().toLocaleString('ru-RU') }
        }]
      };

      try {
        const response = await fetch(
          "https://discord.com/api/webhooks/1463840248630083616/3NhxZjbV-nDTcp4hdTY8zcNPGTt3evlz7MI31_dbeOXgTqsiOXk5-dSzb4cI7gAOyOD9",
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(message)
          }
        );

        if (response.ok) {
          messageDiv.textContent = 'Заявка успешно отправлена. Если ты полезен — скоро получишь сигнал.';
          messageDiv.classList.remove('hidden', 'error');
          messageDiv.classList.add('success');
          form.reset();
          grecaptcha.reset();
        } else {
          messageDiv.textContent = 'Ошибка отправки. Попробуй позже.';
          messageDiv.classList.remove('hidden', 'success');
          messageDiv.classList.add('error');
        }
      } catch (err) {
        messageDiv.textContent = 'Нет связи с сервером.';
        messageDiv.classList.remove('hidden', 'success');
        messageDiv.classList.add('error');
        console.error(err);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    });
  }

  // Fade-in элементы (если остались на других страницах)
  const fadeElements = document.querySelectorAll('.fade-in');
  const galleryItems = document.querySelectorAll('.gallery-item');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15 });

  fadeElements.forEach(el => observer.observe(el));
  galleryItems.forEach(item => observer.observe(item));
});
