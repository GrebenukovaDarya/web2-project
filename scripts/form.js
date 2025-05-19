document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('myform');
  if (!form) return;
  
  const messagesContainer = document.querySelector('.error_messages');
  
    // Функция валидации формы
function validateForm(form) {
    const errors = {};
    const fio = form.querySelector('[name="fio"]')?.value.trim();
    const phone = form.querySelector('[name="number"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const date = form.querySelector('[name="birthdate"]')?.value;
    const gender = form.querySelector('[name="radio-group-1"]:checked');
    const languages = Array.from(form.querySelectorAll('[name="languages[]"]:checked')).map(el => el.value);
    const biography = form.querySelector('[name="biography"]')?.value.trim();
    const contract = form.querySelector('[name="checkbox"]')?.checked;

    // Проверка ФИО
    if (!fio) {
      errors.fio = 'Заполните имя, пожалуйста';
    } else if (fio.length > 150) {
      errors.fio = 'Имя не должно превышать 150 символов';
    } else if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/u.test(fio)) {
      errors.fio = 'Имя должно содержать только буквы и пробелы';
    }
    
    // Проверка телефона
    if (!phone) {
      errors.number = 'Введите номер телефона';
    } else if (!/^\+7\d{10}$/.test(phone)) {
      errors.number = 'Номер должен быть в формате +7XXXXXXXXXX';
    }
    
    // Проверка email
    if (!email) {
      errors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.email = 'Введите корректный email';
    }
    
    // Проверка даты рождения
    if (!date) {
      errors.birthdate = 'Выберите дату рождения';
    } else {
      const birthDate = new Date(date);
      const minDate = new Date();
      minDate.setFullYear(minDate.getFullYear() - 120);
      const maxDate = new Date();
      maxDate.setFullYear(maxDate.getFullYear() - 0);
      
      if (birthDate < minDate) {
        errors.birthdate = 'Дата рождения не может быть раньше ' + minDate.toLocaleDateString();
      } else if (birthDate > maxDate) {
        errors.birthdate = 'Вам должно быть больше 0 лет';
      }
    }
    
    // Проверка пола
    if (!gender) {
      errors['radio-group-1'] = 'Выберите пол';
    }
    
    // Проверка языков
    if (languages.length === 0) {
      errors.languages = 'Выберите хотя бы один язык';
    } else if (languages.length > 3) {
      errors.languages = 'Можно выбрать не более 3 языков';
    }
    
    // Проверка биографии
    if (!biography) {
      errors.biography = 'Заполните биографию';
    } else if (biography.length > 512) {
      errors.biography = 'Биография не должна превышать 512 символов';
    } else if (/[<>{}[\]]|<\?php|<script/i.test(biography)) {
      errors.biography = 'Биография содержит запрещенные символы';
    }
    
    // Проверка согласия
    if (!contract) {
      errors.checkbox = 'Необходимо согласиться с условиями';
    }
    
    return errors;
  }
  
  // Функция отображения ошибок
  function showErrors(errors, form, container) {
    container.innerHTML = '';
    container.style.display = 'block';
    
    // Очистка предыдущих ошибок
    form.querySelectorAll('.error-field').forEach(el => {
      el.classList.remove('error-field');
    });
    
    // Добавление новых ошибок
    for (const [field, message] of Object.entries(errors)) {
      let fieldElement;
      
      // Специальная обработка для radio и checkbox
      if (field === 'radio-group-1') {
        fieldElement = form.querySelector(`[name="${field}"]`)?.closest('fieldset');
      } else if (field === 'checkbox') {
        fieldElement = form.querySelector(`[name="${field}"]`)?.closest('label');
      } else {
        fieldElement = form.querySelector(`[name="${field}"]`);
      }
      
      if (fieldElement) {
        fieldElement.classList.add('error-field');
        const errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.textContent = message;
        container.appendChild(errorElement);
      }
    }
  }
  
  // Функция отображения успеха
  function showSuccess(result, container, form) {
    container.innerHTML = '';
    container.style.display = 'block';
    
    if (result.messages && Array.isArray(result.messages)) {
      result.messages.forEach(message => {
        const msgElement = document.createElement('div');
        msgElement.className = 'success';
        msgElement.innerHTML = message;
        container.appendChild(msgElement);
      });
    }
    
    if (result.data?.login && result.data?.password) {
      const loginMsg = document.createElement('div');
      loginMsg.className = 'success';
      loginMsg.innerHTML = `Вы можете войти с логином: ${result.data.login} и паролем: ${result.data.password}`;
      container.appendChild(loginMsg);
    }
    
    if (!form.querySelector('[name="uid"]')) {
      form.reset();
    }
  }

    
    
  form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      const submitBtn = form.querySelector('#submit-btn');
      const originalBtnText = submitBtn.value;
      submitBtn.disabled = true;
      submitBtn.value = 'Отправка...';
      
      
      try {
                        
        const errors = validateForm(form);
        if (Object.values(errors).length > 0) {
          showErrors(errors, form, messagesContainer);
          submitBtn.disabled = false;
          submitBtn.value = originalBtnText;
          return;
        }
          const formData = new FormData(form);
          console.log('Данные формы:', Object.fromEntries(formData.entries()));
        //   const csrfToken = document.querySelector('input[name="csrf_token"]').value;
        //   formData.append('csrf_token', csrfToken);

          const response = await fetch(form.action, {
              method: 'POST',
              headers: {
                  'X-Requested-With': 'XMLHttpRequest'
              },
              body: formData
          });
          
          const result = await response.json();
          if (result.success) {
            showSuccess(result, messagesContainer, form);
          } else {
            showErrors(result.errors || {}, form, messagesContainer);
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
