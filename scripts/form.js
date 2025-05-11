document.getElementById("myform").addEventListener("submit", function(event) {
  event.preventDefault();
  
  let formData = new FormData(this);

  fetch('index.php', {
      method: 'POST',
      body: formData
  })
  .then(response => response.json()) 
  ..then(data => {
    console.log(data);
    // Обновление страницы или вывода сообщений
    document.querySelector('.error_messages').style.display = 'block';
    document.querySelector('.error_messages').innerHTML = data.message;
})
  .catch(error => {
      console.error('Ошибка при отправке формы:', error);
  });
});
