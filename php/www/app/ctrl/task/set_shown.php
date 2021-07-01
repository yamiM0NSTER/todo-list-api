<?php

$pdo = db_get_mysql_pdo();

header('Content-Type: application/json; charset=utf-8');

$payload = json_decode(file_get_contents('php://input'));

db_tasks_set_shown($pdo, $payload);
