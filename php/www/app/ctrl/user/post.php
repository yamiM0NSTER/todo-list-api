<?php

$pdo = db_get_mysql_pdo();

header('Content-Type: application/json; charset=utf-8');

$payload = json_decode(file_get_contents('php://input'));

$userId = db_users_add($pdo, $payload);

$user = db_users_get_by_id($pdo, $userId);

$userJson = json_encode($user);

echo $userJson;
