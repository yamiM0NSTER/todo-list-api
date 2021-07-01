<?php

$pdo = db_get_mysql_pdo();

header('Content-Type: application/json; charset=utf-8');

$payload = json_decode(file_get_contents('php://input'));

$taskId = db_tasks_add($pdo, $payload);

$task = db_tasks_get_by_id($pdo, $taskId);

$user = db_users_get_by_id($pdo, $task['userId']);
$task['User'] = $user;

$taskJson = json_encode($task);

echo $taskJson;
