document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('myform');
  if (!form) return;
  
  const messagesContainer = document.querySelector('.error_messages');
  
  form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = form.querySelector('#submit-btn');
      const originalBtnText = submitBtn.value;
      submitBtn.disabled = true;
      submitBtn.value = 'Отправка...';
      
      try {
          const formData = new FormData(form);
          const response = await fetch(form.action, {
              method: 'POST',
              headers: {
                  'X-Requested-With': 'XMLHttpRequest'
              },
              body: formData
          });
          
          const result = await response.json();
          
          // Очищаем предыдущие сообщения
          messagesContainer.innerHTML = '';
          messagesContainer.style.display = 'block';
          
          if (result.success) {
              // Показываем успешные сообщения
              result.messages.forEach(message => {
                  messagesContainer.innerHTML += `<div class="success">${message}</div>`;
              });
              
              // Если есть данные логина/пароля
              if (result.data && result.data.login && result.data.password) {
                  messagesContainer.innerHTML += 
                      `<div class="success">Ваш логин: ${result.data.login}<br>Ваш пароль: ${result.data.password}</div>`;
              }
              
              // Очищаем ошибки валидации
              document.querySelectorAll('.error').forEach(el => {
                  el.classList.remove('error');
              });
          } else {
              // Показываем ошибки
              Object.entries(result.errors).forEach(([field, error]) => {
                  messagesContainer.innerHTML += `<div class="error">${error}</div>`;
                  
                  // Подсвечиваем поле с ошибкой
                  const fieldElement = form.querySelector(`[name="${field}"]`);
                  if (fieldElement) {
                      fieldElement.classList.add('error');
                  }
              });
          }
      } catch (error) {
          messagesContainer.innerHTML = `<div class="error">Ошибка при отправке формы: ${error.message}</div>`;
          messagesContainer.style.display = 'block';
      } finally {
          submitBtn.disabled = false;
          submitBtn.value = originalBtnText;
      }
  });
});

// document.addEventListener('DOMContentLoaded', function () {
//     const form = document.getElementById('myform');
//     if (!form) return;
  
  
//     form.addEventListener('submit', async function (e) {
//       e.preventDefault();
  
//       const formData = new FormData(form);
//       try {
//         const response = await fetch(form.action, {
//           method: 'POST',
//           headers: {
//             'X-Requested-With': 'XMLHttpRequest'
//           },
//           body: formData
//         });
  
//         const result = await response.json();
//         const msgDiv = document.getElementById('messages');
//         msgDiv.innerHTML = '';
  
//         // Выводим сообщения
//         if (result.success) {
//           result.messages.forEach(message => {
//               msgDiv.innerHTML += `<div class="success">${message}</div>`;
//           });
//           form.reset();
//         } else {
//             result.errors.forEach((error, key) => {
//                 msgDiv.innerHTML += `<div class="error">Ошибка поля ${key}: ${error}</div>`;
//             });
//         }
//         msgDiv.style.display = 'block'; 
//       } catch (error) {
//         alert('Ошибка при отправке: ' + error.message);
//       }
//     });
//   });