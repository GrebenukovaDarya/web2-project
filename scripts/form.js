/*node browser: true */ /*global $ */ /*global alert */
/*global updateContent */
window.addEventListener("DOMContentLoaded", function () {
    // Сохранение данных формы в localStorage
    window.onload = function () {
        const fieldsToStore = [
            "fio", "number", "email", "birthdate", 
            "biography", "languages[]", "radio-group-1", "checkbox"
        ];

        fieldsToStore.forEach(function(field) {
            const storedValue = localStorage.getItem(field);
            if (storedValue) {
                if (field === "languages[]") {
                    const languages = storedValue.split(',');
                    const select = document.getElementsByName(field)[0];
                    Array.from(select.options).forEach(option => {
                        option.selected = languages.includes(option.value);
                    });
                } else if (field === "checkbox") {
                    document.getElementsByName(field)[0].checked = storedValue === 'true';
                } else {
                    document.getElementsByName(field)[0].value = storedValue;
                }
            }
        });
    };

    // Сохранение данных при изменении формы
    const form = document.getElementById("myform");
    form.addEventListener("input", function () {
        const fieldsToStore = [
            "fio", "number", "email", "birthdate", 
            "biography", "languages[]", "radio-group-1", "checkbox"
        ];

        fieldsToStore.forEach(function(field) {
            if (field === "languages[]") {
                const select = document.getElementsByName(field)[0];
                const selectedOptions = Array.from(select.selectedOptions).map(opt => opt.value);
                localStorage.setItem(field, selectedOptions.join(','));
            } else if (field === "checkbox") {
                localStorage.setItem(field, document.getElementsByName(field)[0].checked);
            } else {
                localStorage.setItem(field, document.getElementsByName(field)[0].value);
            }
        });
    });

    // Обработка отправки формы
    form.addEventListener("submit", function(e) {
        e.preventDefault();
        
        // Собираем данные формы
        const formData = {
            uid: document.getElementsByName("uid")[0].value,
            fio: document.getElementsByName("fio")[0].value,
            number: document.getElementsByName("number")[0].value,
            email: document.getElementsByName("email")[0].value,
            birthdate: document.getElementsByName("birthdate")[0].value,
            biography: document.getElementsByName("biography")[0].value,
            "radio-group-1": document.querySelector('input[name="radio-group-1"]:checked')?.value,
            checkbox: document.getElementsByName("checkbox")[0].checked,
            "languages[]": Array.from(document.getElementsByName("languages[]")[0].selectedOptions)
                             .map(opt => opt.value)
        };

        // Валидация обязательных полей
        if (!formData.fio || !formData.number || !formData.email || !formData.birthdate || 
            !formData["radio-group-1"] || !formData.checkbox || formData["languages[]"].length === 0) {
            alert("Пожалуйста, заполните все обязательные поля формы");
            return;
        }

        // Отправка данных на сервер
        fetch('send.php', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Ошибка сети');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                alert('Данные успешно сохранены!');
                
                // Если это новый пользователь, показываем его данные
                if (data.login && data.password) {
                    alert(`Ваш логин: ${data.login}\nВаш пароль: ${data.password}`);
                }
                
                // Очищаем localStorage после успешной отправки
                const fieldsToClear = [
                    "fio", "number", "email", "birthdate", 
                    "biography", "languages[]", "radio-group-1", "checkbox"
                ];
                fieldsToClear.forEach(field => localStorage.removeItem(field));
                
                // Очищаем форму, если нужно
                if (data.clearForm) {
                    form.reset();
                }
            } else {
                // Показываем ошибки валидации
                if (data.errors) {
                    let errorMessage = 'Ошибки при заполнении формы:\n';
                    for (const [field, error] of Object.entries(data.errors)) {
                        errorMessage += `${field}: ${error}\n`;
                    }
                    alert(errorMessage);
                } else {
                    alert('Произошла ошибка при сохранении данных');
                }
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Произошла ошибка при отправке формы');
        });
    });

    // Обработка истории браузера (если нужно для popup)
    window.addEventListener("popstate", function (event) {
        const popup = document.getElementById("popup");
        const overlay = document.getElementById("overlay");
        
        if (popup && popup.style.display === "block") {
            popup.style.display = "none";
            overlay.classList.remove("show");
            window.history.replaceState("", "", "index.html");
        }
        
        if (updateContent) {
            updateContent(event.state?.content);
        }
    });
});