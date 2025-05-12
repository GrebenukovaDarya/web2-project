<?php

require_once './scripts/db.php';

function admin_get($request, $db) {

  $user_log=$_SERVER['PHP_AUTH_USER'];
  $user_pass=$_SERVER['PHP_AUTH_PW'];
  
  if (empty($_SERVER['PHP_AUTH_USER']) ||
      empty($_SERVER['PHP_AUTH_PW']) ||
      !admin_login_check($user_log) ||
      !admin_password_check($user_log, $user_pass)) {

    header('HTTP/1.1 401 Unanthorized');
    header('WWW-Authenticate: Basic realm="My site"');
    print('<h1>401 Требуется авторизация</h1>');
    exit();
  }

  //print('<div class="">Вы успешно авторизовались и видите защищенные паролем данные.<div>');

  $language_table = language_stats();
  $user_table = users_table();

  $data = [
    'language_table' => $language_table,
    'user_table'=>$user_table
  ];

  return theme('admin', $data);
}

function admin_post($request, $db) {

  if(!empty($_POST['del_by_uid']) && !empty($_SERVER['PHP_AUTH_USER'])){
    del_by_uid($_POST['del_by_uid']);
  } 

  //return redirect('admin');
  $data = [
    'language_table' => $language_table,
    'user_table'=>$user_table
  ];

  return theme('admin', $data);
}