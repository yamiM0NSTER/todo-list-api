<?php

$pdo = db_get_mysql_pdo();

header('Content-Type: application/json; charset=utf-8');

$tasks = db_tasks_get_incomming($pdo);
for ($i = 0; $i < sizeof($tasks); $i++) {
  $task = $tasks[$i];
  $user = db_users_get_by_id($pdo, $task['userId']);
  $task['User'] = $user;
  $tasks[$i] = $task;
}

$tasks_json = json_encode($tasks);

echo $tasks_json;
