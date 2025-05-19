<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet"  href="./styles/style.css">
    <title> login </title>
  </head>
  <body>

    <form class="login_form" action="<?php echo url('login'); ?>" method="post">
      <label> 
        Логин <br/>
        <input name="login" />
      </label> <br/>
      <label> 
        Пароль <br/>
        <input name="password" />
      </label> <br/>
      
      <input class="login_button" type="submit" value="Войти" />

      <input type="hidden" name="csrf_token" value="<?php echo $csrf_token; ?>">
    </form>

    <a class="admin_ref" href="<?php echo url('admin'); ?>">Войти как администратор</a>

  </body>
</html>