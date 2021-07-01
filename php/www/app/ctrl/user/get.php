<?php

$pdo = db_get_mysql_pdo();

header('Content-Type: application/json; charset=utf-8');

if (isset($params[0])) {
  $user = db_users_get_by_email($pdo, $params[0]);

  if ($user == FALSE) {
    http_response_code(404);
    exit;
  }

  $user_json = json_encode($user);
  echo $user_json;
  exit;
}

$users = db_users_get($pdo);

$users_json = json_encode($users);

echo $users_json;
