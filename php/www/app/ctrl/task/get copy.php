<?php

$pdo = db_get_mysql_pdo();

header('Content-Type: application/json; charset=utf-8');

if (isset($params[0])) {
  $task = db_tasks_get_by_guid($pdo,  $params[0]);
  if ($task == FALSE) {
    http_response_code(404);
    exit;
  }

  $user = db_users_get_by_id($pdo, $task['userId']);

  $task['User'] = $user;

  $task_json = json_encode($task);
  echo $task_json;
  exit;
}

$tasks = db_tasks_get($pdo);
for ($i = 0; $i < sizeof($tasks); $i++) {
  $task = $tasks[$i];
  $user = db_users_get_by_id($pdo, $task['userId']);
  $task['User'] = $user;
  $tasks[$i] = $task;
}

$tasks_json = json_encode($tasks);

echo $tasks_json;
