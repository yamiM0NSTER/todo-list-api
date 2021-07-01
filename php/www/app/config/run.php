<?php
require_once __DIR__ . '/pages.php';

$pages2run = array(
  PAGE_TASKS => array(
    'GET' => 'task/get.php',
    'POST' => 'task/post.php',
    'DELETE' => 'task/delete.php',
    'PATCH' => 'task/patch.php',
  ),
  PAGE_USERS => array(
    'GET' => 'user/get.php',
    'POST' => 'user/post.php',
    'DELETE' => 'user/delete.php',
    'PATCH' => 'user/patch.php',
  ),
  PAGE_TASKS_SET_SHOWN => array(
    'POST' => 'task/set_shown.php',
  ),
  PAGE_TASKS_GET_INCOMMING => array(
    'GET' => 'task/get_incomming.php',
  )
);


$TASK_STATUS = array(
  'NEW' => 1000,
  'SHOWN' => 2000,
  'DELETED' => 3000,
);
