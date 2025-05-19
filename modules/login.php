<?php
require_once './scripts/db.php';
global $db;

function login_get($request, $db) {
    
    if (!empty($_SESSION['login'])) {
        return redirect('./');
    }
    
    $csrf_token = htmlspecialchars(generateCsrfToken());
    $data = [
      'csrf_token' => $csrf_token,
    ];
    // Формируем HTML-код формы входа
    return theme('login', $data);
    //return redirect();
  }
  


function login_post($request, $db) {

  /*
    if (!validateCsrfToken()) {
        http_response_code(403);
        die('csrf error');
      }
  */
      $login = $request['post']['login'];
      $password = $request['post']['password'];
  
    if (session_status() == PHP_SESSION_NONE) { 
        session_start();
    }

    if (isValid($login) && password_check($login, $password)) {
        
    $_SESSION['login'] = $login;
    $_SESSION['uid'] = getUID([$_SESSION['login']]);
  
    
    return redirect('');
    } else {
        return 'Неверный логин или пароль';
    }
}

?>