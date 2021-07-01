<?php
try {
  require_once __DIR__ . '/config/run.php';

  $method = strtoupper($_SERVER['REQUEST_METHOD']);

  if (!isset($pages2run[$page]) || !isset($pages2run[$page][$method])) {
    http_response_code(404);
    exit;
  }

  $pdo = db_get_mysql_pdo();

  /** @noinspection PhpIncludeInspection */
  require_once __DIR__ . '/run/' . $pages2run[$page][$method];
} catch (Exception $e) {
  echo $e->getMessage() . ' ' . $e->getTraceAsString();
  exit;
}
