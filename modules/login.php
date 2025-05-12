<?php
require_once './scripts/db.php';
global $db;

function login_get($request, $db) {
    
    if (!empty($_SESSION['login'])) {
        return redirect('./');
    }
    
    // Формируем HTML-код формы входа
      return theme('form', $data);
  }
  


function login_post($request, $db) {
  
      $login = $request['post']['login'];
      $password = $request['post']['password'];
  
    if (session_status() == PHP_SESSION_NONE) { 
        session_start();
    }
  

    if (isValid($login) && password_check($login, $password)) {
        
    $_SESSION['login'] = $login;
    $_SESSION['uid'] = getUID([$_SESSION['login']]);
  
    
    return redirect();
    } else {
        return 'Неверный логин или пароль';
    }
}

?>