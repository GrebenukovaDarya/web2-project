document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('myform');
    if (!form) return;
  
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
  
      const formData = new FormData(form);
      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: {
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: formData
        });
  
        const result = await response.json();
        const msgDiv = document.getElementById('messages');
        msgDiv.innerHTML = '';
  
        // Выводим сообщения
        if (result.success) {
          result.messages.forEach(message => {
              msgDiv.innerHTML += `<div class="success">${message}</div>`;
          });
          form.reset();
        } else {
            result.errors.forEach((error, key) => {
                msgDiv.innerHTML += `<div class="error">Ошибка поля ${key}: ${error}</div>`;
            });
        }
        msgDiv.style.display = 'block'; 
      } catch (error) {
        alert('Ошибка при отправке: ' + error.message);
      }
    });
  });