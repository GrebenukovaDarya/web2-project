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
  
        if (result.success) {
          msgDiv.innerHTML = '<div class="success">Данные успешно отправлены!</div>';
          form.reset();
        } else {
          Object.entries(result.errors).forEach(([key, val]) => {
            msgDiv.innerHTML += `<div class="error">Ошибка поля ${key}</div>`;
          });
        }
      } catch (error) {
        alert('Ошибка при отправке: ' + error.message);
      }
    });
  });