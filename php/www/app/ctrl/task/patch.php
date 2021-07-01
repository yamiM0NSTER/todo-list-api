<?php

$pdo = db_get_mysql_pdo();

if (!isset($params[0])) {
  http_response_code(400);
  exit;
}

header('Content-Type: application/json; charset=utf-8');

$task = db_tasks_get_by_guid($pdo,  $params[0]);
if ($task == FALSE) {
  http_response_code(404);
  exit;
}

$payload = json_decode(file_get_contents('php://input'));

$success = db_tasks_update($pdo, $params[0], $payload);

$updatedTask = db_tasks_get_by_guid($pdo,  $params[0]);
$user = db_users_get_by_id($pdo, $task['userId']);
$updatedTask['User'] = $user;

$updatedTaskJson = json_encode($updatedTask);

echo $updatedTaskJson;
