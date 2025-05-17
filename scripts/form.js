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

      const csrfToken = document.querySelector('meta[name="csrf-token"]')?.textContent;
      if(csrfToken){
        formData.append('csrf_token', csrfToken);
      }

      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        showErrors(errors);
        submitBtn.disabled = false;
        submitBtn.value = originalBtnText;
        return;
      }


    //   ----------------

    //const fields = ['fio', 'number', 'email', 'birthdate', 'radio-group-1','biography', 'checkbox', 'languages'];


    //let error_messages = [];
    // let errors = FALSE; неправильная строка по синтаксису

    // fields.forEach(field => {
    //     const el=document.querySelector('[name="${field}"]');
    //     if(!el || !el.value.trim()) {
    //         errors = true;

    //     }
    // });
    
    // if(errors){
    //     alert("ERRORS");
    //     return;
    // }

//     const fio= document.querySelector
//     if (empty($fio)) {
//         setcookie('fio_error', '1');
//         $error_messages['fio'] = 'Имя не указано';
//         $errors = TRUE;
//     } elseif (strlen($fio) > 128 ) {
//         setcookie('fio_error', '2');
//         $error_messages['fio'] = 'Имя не должно превышать 128 символов';
//         $errors = TRUE;
//     } elseif ( !preg_match('/^[a-zA-Zа-яА-ЯёЁ\s]+$/u', $fio)) {
//         setcookie('fio_error', '3');
//         $errors = TRUE;
//         $error_messages['fio'] = 'Имя должно содержать только буквы и пробелы';
//     }
//     setcookie('fio_value', $fio, time() + 365 * 24 * 60 * 60);


//   if (empty($num)) {
//     setcookie('number_error', '1');
//     $errors = TRUE;
//     $error_messages['number'] = 'Номер не указан';
//   } elseif (!preg_match('/^\+7\d{10}$/', $num)) {
//     setcookie('number_error', '2');
//     $errors = TRUE;
//     $error_messages['number'] = 'Номер указан некорректно';
//   }
//   setcookie('number_value', $num, time() + 365 * 24 * 60 * 60);

//   if (empty($email) ) {
//     setcookie('email_error', '1');
//     $errors = TRUE;
//     $error_messages['email'] = 'Email не указан';
//   } elseif(!filter_var($email, FILTER_VALIDATE_EMAIL)){
//     setcookie('email_error', '2');
//     $error_messages['email'] = 'Email-error';
//     $errors = TRUE;
//   }
//   setcookie('email_value', $email, time() + 365 * 24 * 60 * 60);

//   if (empty($gen)){
//     setcookie('gen_error', '1');
//     $errors = TRUE;
//     $error_messages['gen'] = 'Пол не указан';
//   } else{
//     $allowed_genders = ["male", "female"];
//     if (!in_array($gen, $allowed_genders)) {
//       setcookie('gen_error', '2');
//       $errors = TRUE;
//     }
//   }
//   setcookie('gen_value', $gen, time() + 365 * 24 * 60 * 60);

//   if (empty($biography)) {
//     setcookie('bio_error', '1');
//     $errors = TRUE;
//     $error_messages['bio'] = 'Биография не указана';
//   } elseif(strlen($biography) > 512){
//     setcookie('bio_error', '2');
//     $errors = TRUE;
//     $error_messages['bio'] = 'Биография не должна быть более 512 символов';
//   } elseif(preg_match('/[<>{}\[\]]|<script|<\?php/i', $biography)){
//     setcookie('bio_error', '3');
//     $errors = TRUE;
//     $error_messages['bio'] = 'Недопустимые символы в биографии';
//   }
//   setcookie('bio_value', $biography, time() + 365 * 24 * 60 * 60);

//   if(empty($languages)) {
//     setcookie('lang_error', '1');
//     $errors = TRUE;
//     $error_messages['lang'] = 'Выберите хотя бы 1 язык';
//   } else {
//     foreach ($languages as $lang) {
//       if (!in_array($lang, $allowed_lang)) {
//           setcookie('lang_error', '2');
//           $errors = TRUE;
//       }
//     }
//   }
//   $langs_value =(implode(",", $languages));
//   setcookie('lang_value', $langs_value, time() + 365 * 24 * 60 * 60);

//   if(empty($bdate)) {
//     setcookie('bdate_error', '1');
//     $errors = TRUE;
//     $error_messages['bdate'] = 'Укажите дату рождения';
//   }
//   setcookie('bdate_value', $bdate, time() + 365 * 24 * 60 * 60);

//   if (!isset($_POST["checkbox"])) {
//     setcookie('checkbox_error', '1');
//     $errors = TRUE;
//     $error_messages['checkbox'] = 'Ознакомьтесь с контрактом';
//   }
//   setcookie('checkbox_value', $_POST["checkbox"], time() + 365 * 24 * 60 * 60);

  //--------------------------------------
      
      try {
          const formData = new FormData(form);

          const csrfToken = document.querySelector('input[name="csrf_token"]').value;
          formData.append('csrf_token', csrfToken);

          const response = await fetch(form.action, {
              method: 'POST',
              headers: {
                  'X-Requested-With': 'XMLHttpRequest'
              },
              body: formData
          });
          
          const result = await response.json();
          if (result.success) {
            showSuccess(result);
          } else {
            showErrors(result.errors);
          }
        //   // Очищаем предыдущие сообщения
        //   messagesContainer.innerHTML = '';
        //   messagesContainer.style.display = 'block';
          
        //   if (result.success) {
        //       // Показываем успешные сообщения
        //       result.messages.forEach(message => {
        //           messagesContainer.innerHTML += `<div class="success">${message}</div>`;
        //       });
              
        //       // Если есть данные логина/пароля
        //       if (result.data && result.data.login && result.data.password) {
        //           messagesContainer.innerHTML += 
        //               `<div class="success">Ваш логин: ${result.data.login}<br>Ваш пароль: ${result.data.password}</div>`;
        //       }
              
        //       // Очищаем ошибки валидации
        //       document.querySelectorAll('.error').forEach(el => {
        //           el.classList.remove('error');
        //       });
        //   } else {
        //       // Показываем ошибки
        //       Object.entries(result.errors).forEach(([field, error]) => {
        //           messagesContainer.innerHTML += `<div class="error">${error}</div>`;
                  
        //           // Подсвечиваем поле с ошибкой
        //           const fieldElement = form.querySelector(`[name="${field}"]`);
        //           if (fieldElement) {
        //               fieldElement.classList.add('error');
        //           }
        //       });
        //   }
      } catch (error) {
          messagesContainer.innerHTML = `<div class="error">Ошибка при отправке формы: ${error.message}</div>`;
          messagesContainer.style.display = 'block';
      } finally {
          submitBtn.disabled = false;
          submitBtn.value = originalBtnText;
      }
  });


// Функция валидации формы
function validateForm() {
    const errors = {};
    const fio = form.querySelector('[name="fio"]').value.trim();
    const phone = form.querySelector('[name="number"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const date = form.querySelector('[name="birthdate"]').value;
    const gender = form.querySelector('[name="radio-group-1"]:checked');
    const languages = Array.from(form.querySelectorAll('[name="languages[]"]:checked')).map(el => el.value);
    const biography = form.querySelector('[name="biography"]').value.trim();
    const contract = form.querySelector('[name="checkbox"]').checked;
    
    // Проверка ФИО
    if (!fio) {
      errors.fio = 'Заполните имя';
    } else if (fio.length > 150) {
      errors.fio = 'Имя не должно превышать 150 символов';
    } else if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/u.test(fio)) {
      errors.fio = 'Имя должно содержать только буквы и пробелы';
    }
    
    // Проверка телефона
    if (!phone) {
      errors.phone = 'Введите номер телефона';
    } else if (!/^\+7\d{10}$/.test(phone)) {
      errors.phone = 'Номер должен быть в формате +7XXXXXXXXXX';
    }
    
    if (!email) {
        errors.email = 'Введите email';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Введите корректный email';
    }
    if (!date) {
        errors.date = 'Выберите дату рождения';
    } else {
        const birthDate = new Date(date);
        const minDate = new Date();
        minDate.setFullYear(minDate.getFullYear() - 120); // 120 лет назад
        const maxDate = new Date();
        maxDate.setFullYear(maxDate.getFullYear() - 0); 
        
        if (birthDate < minDate) {
            errors.date = 'Дата рождения не может быть раньше ' + minDate.toLocaleDateString();
        } else if (birthDate > maxDate) {
            errors.date = 'Вам должно быть больше 0 лет';
        }
    }
    if (!gender) {
        errors.gender = 'Выберите пол';
    }
    if (languages.length === 0) {
        errors.favorite_languages = 'Выберите хотя бы один язык';
    } else if (languages.length > 3) {
        errors.favorite_languages = 'Можно выбрать не более 3 языков';
    }
    if (!biography) {
        errors.biography = 'Заполните биографию';
    } else if (biography.length > 512) {
        errors.biography = 'Биография не должна превышать 512 символов';
    } else if (/[<>{}[\]]|<\?php|<script/i.test(biography)) {
        errors.biography = 'Биография содержит запрещенные символы';
    }
    if (!contract) {
        errors.contract = 'Необходимо согласиться с условиями';
    }
    return errors;
  }
  
  // Показать ошибки
  function showErrors(errors) {
    messagesContainer.innerHTML = '';
    messagesContainer.style.display = 'block';
    
    // Очищаем предыдущие ошибки
    form.querySelectorAll('.error-field').forEach(el => {
      el.classList.remove('error-field');
    });
    
    // Добавляем новые ошибки
    for (const [field, message] of Object.entries(errors)) {
      const fieldElement = form.querySelector(`[name="${field}"]`);
      if (fieldElement) {
        fieldElement.classList.add('error-field');
        const errorElement = document.createElement('div');
        errorElement.className = 'error';
        errorElement.textContent = message;
        messagesContainer.appendChild(errorElement);
      }
    }
  }
  
  // Показать успешное сообщение
  function showSuccess(result) {
    messagesContainer.innerHTML = '';
    messagesContainer.style.display = 'block';
    
    result.messages.forEach(message => {
      const msgElement = document.createElement('div');
      msgElement.className = 'success';
      msgElement.innerHTML = message;
      messagesContainer.appendChild(msgElement);
    });
    
    // Если есть данные логина/пароля
    if (result.data && result.data.login) {
      const loginMsg = document.createElement('div');
      loginMsg.className = 'success';
      loginMsg.innerHTML = `Вы можете <a href="login.php">войти</a> с логином: ${result.data.login} и паролем: ${result.data.password}`;
      messagesContainer.appendChild(loginMsg);
    }
    
    // Очищаем форму если это не редактирование
    if (!form.querySelector('[name="uid"]')) {
      form.reset();
    }
  }
});