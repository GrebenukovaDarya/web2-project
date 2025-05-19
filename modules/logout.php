<?php
require_once './scripts/db.php';
global $db;
   function logout_post($request, $db) {
        console.log("wenvkwe");
       if (isset($request['post']['logout'])) {
        echo "wiebnwoe woegw";
           session_unset();
           session_destroy();
           //
           return redirect('login');
       }
   }
?>