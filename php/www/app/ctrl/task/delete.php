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

$success = db_tasks_delete_by_guid($pdo, $params[0]);

if ($success == FALSE) {
  http_response_code(500);
  exit;
}
