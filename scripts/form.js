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

    //   ----------------

    const fields = ['fio', 'number', 'email', 'birthdate', 'radio-group-1','biography', 'checkbox', 'languages'];


    let error_messages = [];
    let errors = FALSE;

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