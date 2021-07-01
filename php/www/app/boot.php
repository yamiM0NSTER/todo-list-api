<?php
// -----------------------------------------------------------------------------------------------------------------

if (!isset($_SERVER['DOCUMENT_ROOT'])) {
  $_SERVER['DOCUMENT_ROOT'] = '/';
}
if (!isset($_SERVER['SCRIPT_FILENAME'])) {
  $_SERVER['SCRIPT_FILENAME'] = '/index.php';
}
if (!isset($_SERVER['REQUEST_URI'])) {
  $_SERVER['REQUEST_URI'] = '';
}

$__dr = $_SERVER['DOCUMENT_ROOT'];
if (substr($__dr, -1) == '/') {
  $__dr = substr($__dr, 0, -1);
}

$__fs = explode('/', str_replace($__dr, '', $_SERVER['SCRIPT_FILENAME']));
$__rs = explode('/', $_SERVER['REQUEST_URI']);
$__ss = array();

for ($__id = 0; $__id < min(count($__fs), count($__rs)); $__id++) {
  if ($__fs[$__id] == 'index.php') {
    break;
  }
  if ($__fs[$__id] != $__rs[$__id]) {
    break;
  }
  $__ss[] = $__fs[$__id];
}
$__ss[] = '';

define('BASE_URL', implode('/', $__ss));
unset($__dr);
unset($__fs);
unset($__rs);
unset($__ss);
unset($__id);

// -----------------------------------------------------------------------------------------------------------------

$__di = realpath(__DIR__ . '/..');
if (substr($__di, -1) != DIRECTORY_SEPARATOR) {
  $__di .= DIRECTORY_SEPARATOR;
}

define('BASE_DIR', $__di);
unset($__di);

// -----------------------------------------------------------------------------------------------------------------

$__rq = substr($_SERVER['REQUEST_URI'], strlen(BASE_URL));
$__ri = strpos($__rq, '?');
if ($__ri !== FALSE) {
  $__rq = substr($__rq, 0, $__ri);
}
if (substr($__rq, 0, 10) == 'index.php/') {
  $__rq = substr($__rq, 10);
}
if (substr($__rq, 0, 9) == 'index.php') {
  $__rq = substr($__rq, 9);
}
define('BASE_REQ', $__rq);
unset($__rq);
unset($__ri);

$__stack = explode('/', BASE_REQ);
foreach ($__stack as $__sIdx => $__sVal) {
  $__stack[$__sIdx] = urldecode($__sVal);
}

$page    = '';
$params = array();
if (isset($__stack[0])) {
  $page   = trim($__stack[0]);
  $params = array_slice($__stack, 1);
}

unset($__stack);
unset($__sIdx);
unset($__sVal);
