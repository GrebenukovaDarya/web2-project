<?php
require_once './scripts/db.php';
global $db;
   function logout_post($request, $db) {

       if (isset($request['post']['logout'])) {
           session_start();
           
           session_unset();
           session_destroy();
           //
           return redirect('');
           exit;
       }
   }
?>