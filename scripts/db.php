<?php

global $db;


$user = 'u68607';
$pass = '7232008';
$db = new PDO('mysql:host=localhost;dbname=u68607', $user, $pass,
    [PDO::ATTR_PERSISTENT => true, PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]);

/*
global $db;
$db = new PDO('mysql:host=' . conf('db_host') . ';dbname=' . conf('db_name'), conf('db_user'), conf('db_psw'),
  array(PDO::MYSQL_ATTR_FOUND_ROWS => true, PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
*/


function getLangs(){
  global $db;
  try{
    $allowed_lang=[];
    $data = $db->query("SELECT lang_name FROM prog_lang")->fetchAll();
    foreach ($data as $lang) {
      $lang_name = $lang['lang_name'];
      $allowed_lang[$lang_name] = $lang_name;
    }
    return $allowed_lang;
  } catch(PDOException $e){
    print('Error: ' . $e->getMessage());
    exit();
  }
}

function password_check($login, $password) {
  global $db;
  $passw;
  try{
    $stmt = $db->prepare("SELECT password FROM users WHERE login = ?");
    $stmt->execute([$login]);
    $passw = $stmt->fetchColumn();
    if($passw===false){
      return false;
    }
    return password_verify($password, $passw);
  } 
  catch (PDOException $e){
    print('Error : ' . $e->getMessage());
    return false;
  }
}
function admin_password_check($login, $password) {
  global $db;
  $passw;
  try{
    $stmt = $db->prepare("SELECT password FROM users WHERE login = ? AND role='admin' ");
    $stmt->execute([$login]);
    $passw = $stmt->fetchColumn();
    if($passw===false){
      return false;
    }
    return password_verify($password, $passw);
  } 
  catch (PDOException $e){
    print('Error : ' . $e->getMessage());
    return false;
  }
}
function admin_login_check($login) {
  global $db;
  $check = false;
  try{
    $stmt = $db->prepare("SELECT login FROM users WHERE role='admin'");
    $stmt->execute();

    while ($row = $stmt->fetch(PDO::FETCH_OBJ)) {
      if($login == $row->login){
        $check=true;
      }
    }
  } 
  catch (PDOException $e){
    print('Error : ' . $e->getMessage());
    exit();
  }
  return $check;
}
function isValid($login) {
  global $db;
  $count;
  try{
    $stmt = $db->prepare("SELECT COUNT(*) FROM users WHERE login = ?");
    $stmt->execute([$login]);
    $count = $stmt->fetchColumn();
  } 
  catch (PDOException $e){
    print('Error : ' . $e->getMessage());
    exit();
  }
  return $count > 0;
}

function language_stats(){
  global $db;
  $rows = array();
  try {
      $stmt = $db->prepare("SELECT lang_name, count(id) AS stat FROM user_lang JOIN prog_lang USING (id_lang) GROUP BY id_lang");
      $stmt->execute();
      while($row = $stmt->fetch(PDO::FETCH_OBJ)){
          $rows[] = "<tr><td>$row->lang_name</td><td>$row->stat</td></tr>";
      }
  }
  catch (PDOException $e){
      print('ERROR : ' . $e->getMessage());
      exit();
  }
  return $rows;
}

function users_table(){
  global $db;
  $rows = array();
  try{
      $stmt = $db->prepare("SELECT login, id, role FROM users WHERE role='user' ORDER BY (id) desc");
      $stmt->execute();
      $log;
      $uid;
      while($row = $stmt->fetch(PDO::FETCH_OBJ)){
          $log=$row->login;
          $uid=$row->id;
          $r = "<tr><td>$uid</td><td>$log</td>";

          $form_data = $db->prepare("SELECT fio, number, email, gender AS gen, biography AS bio, bdate, checkbox FROM application WHERE id = ?");
          $form_data->execute([$uid]);
          $mas = $form_data->fetch(PDO::FETCH_ASSOC);
          foreach($mas as $field) {
              $r.="<td>$field</td>";
          }

          $sql = "select pl.lang_name from prog_lang pl JOIN user_lang ul ON pl.id_lang=ul.id_lang where ul.id = :login;";
          
              $stmt_lang = $db->prepare($sql);
              $stmt_lang->bindValue(':login', $uid, PDO::PARAM_STR);
              $stmt_lang->execute();
              $lang = $stmt_lang->fetchAll(PDO::FETCH_COLUMN, 0);
              $langs_value1 =(implode(", ", $lang));
              $r.="<td>$langs_value1</td>";

          $r.="<td class=\"buttons\">
          <form action=\"\" method=\"POST\">
          <input type=\"hidden\" name=\"del_by_uid\" value=\"$uid\">
          <input class=\"delete_button\" type=\"submit\" value=\"УДАЛИТЬ\">
          </form>";

          $r.="<br><div class=\"change_button\">
          <a href=\"index.php?uid=$row->id\">ИЗМЕНИТЬ</a>
          </div></td></tr>";

          $rows[]=$r;
      }
  } 
  catch (PDOException $e){
      print('ERROR : ' . $e->getMessage());
      exit();
  }
  return $rows;
}

function del_by_uid($uid){
  global $db;
  try{
      $stmt_delete_lang = $db->prepare("DELETE FROM user_lang WHERE id=?");
      $stmt_delete_application = $db->prepare("DELETE FROM application WHERE id=?");
      $stmt_delete_user = $db->prepare("DELETE FROM users WHERE id=?");
      $stmt_delete_lang->execute([$uid]);
      $stmt_delete_user->execute([$uid]);
      $stmt_delete_application->execute([$uid]);
    }
  catch(PDOException $e){
      print('Error : ' . $e->getMessage());
      exit();
  }
}

function getUID($login){
  global $db;
  $uid;
  try {
      $stmt_select = $db->prepare("SELECT id FROM users WHERE login=?");
      $stmt_select->execute([$login]);
      $uid = $stmt_select->fetchColumn();
  } catch (PDOException $e){
      print('Error : ' . $e->getMessage());
      exit();
  }
  return $uid;
}
function getlogin($uid){
  global $db;
  $login;
  try {
      $stmt_select = $db->prepare("SELECT login FROM users WHERE id=?");
      $stmt_select->execute([$uid]);
      $login = $stmt_select->fetchColumn();
  } catch (PDOException $e){
      print('Error : ' . $e->getMessage());
      exit();
  }
  return $login;
}

function UPDATE($user_id, $fio, $number, $email, $bdate, $gen, $bio, $check, $languages){
  global $db;
  try {
      $stmt_update = $db->prepare("UPDATE application SET fio=?, number=?, email=?, bdate=?, gender=?, biography=?, checkbox=? WHERE id=?");
      $stmt_update->execute([$fio, $number, $email, $bdate, $gen, $bio, $check, $user_id ]);
  
      $stmt_delete = $db->prepare("DELETE FROM user_lang WHERE id=?");
      $stmt_delete -> execute([$user_id]);

      $stmt_select = $db->prepare("SELECT id_lang FROM prog_lang WHERE lang_name = ?");

      $stmt_lang_update = $db->prepare("INSERT INTO user_lang (id, id_lang) VALUES (?,?)");
      foreach ($languages as $language) {
          $stmt_select ->execute([$language]);
          $id_lang = $stmt_select->fetchColumn();
    
          if ($id_lang) {
              $stmt_lang_update->execute([$user_id, $id_lang]);
          }
      }
  } catch (PDOException $e){
      print('update Error : ' . $e->getMessage());
      exit();
  }
}

function INSERT($login, $hash_password){
  global $db;
  try{
      $stmt = $db->prepare("INSERT INTO application (fio, number, email, bdate, gender, biography, checkbox ) values (?, ?, ?, ?, ?, ?, ? )");
      $stmt->execute([$_POST['fio'], $_POST['number'], $_POST['email'], $_POST['birthdate'], $_POST['radio-group-1'], $_POST['biography'], isset($_POST["checkbox"]) ? 1 : 0]);
  } catch (PDOException $e){
      print('Error : ' . $e->getMessage());
      exit();
  }
  $id=$db->lastInsertId();
  try{
      $stmt_select = $db->prepare("SELECT id_lang FROM prog_lang WHERE lang_name = ?");
      $stmt_insert = $db->prepare("INSERT INTO user_lang (id, id_lang) VALUES (?, ?)");
      $languages = $_POST['languages'] ?? [];
      foreach ($languages as $language) {
        $stmt_select ->execute([$language]);
        $id_lang = $stmt_select->fetchColumn();
        
        if ($id_lang) {
          $stmt_insert->execute([$id, $id_lang]);
        }
      }
  } catch (PDOException $e) {
      print('Error : ' . $e->getMessage());
      exit();
  }
  try {
      $stmt_insert = $db->prepare("INSERT INTO users (login, password, role, id ) VALUES (?, ?, ?, ?)");
      $stmt_insert->execute([ $login, $hash_password, "user", $id]);
  } catch (PDOException $e){
      print('Error : ' . $e->getMessage());
      exit();
  }
}

function INSERTData($login){
  global $db;
  $uid=getUID($login);
  $values = array();
  try{
      $mas=[];
      $stmt = $db->prepare("SELECT fio, number, email, biography AS bio, gender AS gen, bdate, checkbox FROM application WHERE id = ?");
      $stmt->execute([$uid]);
      $mas = $stmt->fetch(PDO::FETCH_ASSOC);
      $fields = ['fio', 'number', 'email', 'bio', 'gen', 'bdate', 'checkbox'];
      foreach($fields as $field) {
          $values[$field] = strip_tags($mas[$field]);
      }
  } catch (PDOException $e){
      print('ERROR : ' . $e->getMessage());
      exit();
  }
    $sql = "select pl.lang_name from prog_lang pl JOIN user_lang ul ON pl.id_lang=ul.id_lang where ul.id = :login;";
  try{
      $stmt = $db->prepare($sql);
      $stmt->bindValue(':login', $uid, PDO::PARAM_STR);
      $stmt->execute();
      $lang = $stmt->fetchAll(PDO::FETCH_COLUMN, 0);
      $langs_value1 =(implode(",", $lang));
      $values['lang']=$langs_value1;
  } catch(PDOException $e){
      print('Error : ' . $e->getMessage());
      exit();
  }
  return $values;
}



function db_row($stmt) {
  return $stmt->fetch(PDO::FETCH_ASSOC);
}

function db_error() {
  global $db;
  return $db->errorInfo();
}

function db_query($query) {
  global $db;
  $q = $db->prepare($query);
  $args = func_get_args();
  array_shift($args);
  $res = $q->execute($args);
  if ($res) {
    while ($row = db_row($res)) {
      if (isset($row['id']) && !isset($r[$row['id']])) {
        $r[$row['id']] = $row;
      }
      else {
        $r[] = $row;
      }
    }
  }
  return $r;
}

function db_result($query) {
  global $db;
  $q = $db->prepare($query);
  $args = func_get_args();
  array_shift($args);
  $res = $q->execute($args);
  if ($res) {
    if ($row = db_row($res)) {
      return $row[0];
    }
    else {
      return FALSE;
    }
  }
  else {
    return FALSE;
  }
}

function db_command($query) {
  global $db;
  $q = $db->prepare($query);
  $args = func_get_args();
  array_shift($args);
  return $res = $q->execute($args);
}

function db_insert_id() {
  global $db;
  return $db->lastInsertId();
}

function db_get($name, $default = FALSE) {
  if (strlen($name) == 0) {
    return $default;
  }
  $value = db_result("SELECT value FROM variable WHERE name = ?", $name);
  if ($value === FALSE) {
    return $default;
  }
  else {
    return $value;
  }
}

function db_set($name, $value) {
  if (strlen($name) == 0) {
    return;
  }

  $v = db_get($name);
  if ($v === FALSE) {
    $q = "INSERT INTO variable VALUES (?, ?)";
    return db_command($q, $name, $value) > 0;
  }
  else {
    $q = "UPDATE variable SET value = ? WHERE name = ?";
    return db_command($q, $value, $name) > 0;
  }
}

function db_sort_sql() {
}

function db_pager_query() {
}

function db_array() {
  $args = func_get_args();
  $key = array_shift($args);
  $query = array_shift($args);
  $q = $db->prepare($query);
  $res = $q->execute($args);
  $r = array();
  if ($res) {
    while ($row = db_row($res)) {
      if (!empty($key) && isset($row[$key]) && !isset($r[$row[$key]])) {
        $r[$row[$key]] = $row;
      }
      else {
        $r[] = $row;
      }
    }
  }
  return $r;
}


/*------------------------------*/

function generateCsrfToken() {
if (function_exists('random_bytes')) {
  $token = bin2hex(random_bytes(32));
} else {
  $token = md5(uniqid(rand(), true)); 
}
$_SESSION['csrf_token'] = $token;
$_SESSION['csrf_token_time'] = time();
return $token;
}

function validateCsrfToken() {
if (empty($_POST['csrf_token'])) {
  return false; 
}

if (empty($_SESSION['csrf_token'])) {
  return false; 
}

if ($_POST['csrf_token'] !== $_SESSION['csrf_token']) {
  return false; 
}

$token_age = time() - $_SESSION['csrf_token_time'];
if ($token_age > 3600) {
  return false; 
}

unset($_SESSION['csrf_token']); 
unset($_SESSION['csrf_token_time']);

return true;
}

function generateCsrfToken2($form_id) {
if (!isset($_SESSION['csrf_tokens'])) {
    $_SESSION['csrf_tokens'] = [];
}
if (empty($_SESSION['csrf_token'])){
$_SESSION['csrf_tokens'][$form_id] = bin2hex(random_bytes(32));
}

return $_SESSION['csrf_tokens'][$form_id];
}

function validateCsrfToken2($form_id, $token) {
if (!isset($_SESSION['csrf_tokens'][$form_id])) {
    return false;
}

if (!hash_equals($_SESSION['csrf_tokens'][$form_id], $token)) {
    return false;
}

unset($_SESSION['csrf_tokens'][$form_id]);

return true;
}