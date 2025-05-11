<?php
header('Content-Type: application/json');
require_once './scripts/db.php';

$response = ['success' => false, 'errors' => []];

// Получаем данные из тела запроса
$input = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $allowed_lang = getLangs();
    
    // Валидация данных
    $errors = false;
    
    // ФИО
    if (empty($input['fio'])) {
        $response['errors']['fio'] = 'Имя не указано';
        $errors = true;
    } elseif (strlen($input['fio']) > 128) {
        $response['errors']['fio'] = 'Имя не должно превышать 128 символов';
        $errors = true;
    } elseif (!preg_match('/^[a-zA-Zа-яА-ЯёЁ\s]+$/u', $input['fio'])) {
        $response['errors']['fio'] = 'Имя должно содержать только буквы и пробелы';
        $errors = true;
    }
    
    // Номер телефона
    if (empty($input['number'])) {
        $response['errors']['number'] = 'Номер не указан';
        $errors = true;
    } elseif (!preg_match('/^\+7\d{10}$/', $input['number'])) {
        $response['errors']['number'] = 'Номер указан некорректно (формат: +7XXXXXXXXXX)';
        $errors = true;
    }
    
    // Email
    if (empty($input['email'])) {
        $response['errors']['email'] = 'Email не указан';
        $errors = true;
    } elseif (!filter_var($input['email'], FILTER_VALIDATE_EMAIL)) {
        $response['errors']['email'] = 'Email указан некорректно';
        $errors = true;
    }
    
    // Дата рождения
    if (empty($input['birthdate'])) {
        $response['errors']['birthdate'] = 'Дата рождения не указана';
        $errors = true;
    }
    
    // Пол
    if (empty($input['radio-group-1'])) {
        $response['errors']['gender'] = 'Пол не указан';
        $errors = true;
    } else {
        $allowed_genders = ["male", "female"];
        if (!in_array($input['radio-group-1'], $allowed_genders)) {
            $response['errors']['gender'] = 'Недопустимое значение пола';
            $errors = true;
        }
    }
    
    // Биография
    if (empty($input['biography'])) {
        $response['errors']['biography'] = 'Заполните биографию';
        $errors = true;
    } elseif (strlen($input['biography']) > 512) {
        $response['errors']['biography'] = 'Биография не должна превышать 512 символов';
        $errors = true;
    } elseif (preg_match('/[<>{}\[\]]|<script|<\?php/i', $input['biography'])) {
        $response['errors']['biography'] = 'Биография содержит недопустимые символы';
        $errors = true;
    }
    
    // Языки программирования
    if (empty($input['languages[]'])) {
        $response['errors']['languages'] = 'Укажите любимые языки программирования';
        $errors = true;
    } else {
        foreach ($input['languages[]'] as $lang) {
            if (!in_array($lang, $allowed_lang)) {
                $response['errors']['languages'] = 'Указан недопустимый язык';
                $errors = true;
                break;
            }
        }
    }
    
    // Чекбокс
    if (empty($input['checkbox']) || $input['checkbox'] === false) {
        $response['errors']['checkbox'] = 'Подтвердите ознакомление с контрактом';
        $errors = true;
    }
    
    if (!$errors) {
        try {
            if (!empty($_SERVER['PHP_AUTH_USER']) && !empty($_SERVER['PHP_AUTH_PW']) &&
                admin_login_check($_SERVER['PHP_AUTH_USER']) && admin_password_check($_SERVER['PHP_AUTH_USER'], $_SERVER['PHP_AUTH_PW'])) {
                
                if (!empty($input['uid'])) {
                    UPDATE(
                        $input['uid'],
                        $input['fio'],
                        $input['number'],
                        $input['email'],
                        $input['birthdate'],
                        $input['radio-group-1'],
                        $input['biography'],
                        $input['checkbox'] ? 1 : 0,
                        $input['languages[]']
                    );
                    $response['success'] = true;
                    $response['message'] = 'Данные успешно обновлены';
                }
            } elseif (isset($_COOKIE[session_name()]) && session_start() && !empty($_SESSION['login'])) {
                $user_id = getUID($_SESSION['login']);
                UPDATE(
                    $user_id,
                    $input['fio'],
                    $input['number'],
                    $input['email'],
                    $input['birthdate'],
                    $input['radio-group-1'],
                    $input['biography'],
                    $input['checkbox'] ? 1 : 0,
                    $input['languages[]']
                );
                $response['success'] = true;
                $response['message'] = 'Данные успешно обновлены';
            } else {
                $permitted_chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
                $login = substr(md5(time()), 0, 16);
                while(isValid($login)) {
                    $login = substr(md5(time()), 0, 16);
                }
                $password = substr(str_shuffle($permitted_chars), 0, 12);
                $hash_password = password_hash($password, PASSWORD_DEFAULT);
                
                INSERT($login, $hash_password);
                
                $response['success'] = true;
                $response['login'] = $login;
                $response['password'] = $password;
                $response['message'] = 'Пользователь успешно создан';
            }
        } catch(PDOException $e) {
            $response['errors']['database'] = 'Ошибка базы данных: ' . $e->getMessage();
        }
    }
}

echo json_encode($response);