<?php

/**
 * Establishes pdo connection to mySQL if one doesn't exist.
 *
 * @param bool   $create_new_connection
 * @param string $db_host
 * @param string $db_port
 * @param string $db_name
 * @param string $db_user
 * @param string $db_pass
 * @param int    $error_mode
 * @param int    $case_mode
 *
 * @return PDO
 */

function db_get_mysql_pdo($create_new_connection = FALSE, $db_host = '', $db_port = '', $db_name = '', $db_user = '', $db_pass = '', $error_mode = PDO::ERRMODE_EXCEPTION, $case_mode = PDO::CASE_NATURAL)
{
  global $__sql_pdo;

  if (($db_host . $db_port . $db_name . $db_user . $db_pass) != '') {
    $create_new_connection = TRUE;
  }

  if (!$create_new_connection && isset($__sql_pdo)) {
    return $__sql_pdo;
  }

  if ($db_host == '') {
    $db_host = DB_MYSQL_HOST;
  }
  if ($db_port == '') {
    $db_port = DB_MYSQL_PORT;
  }
  if ($db_name == '') {
    $db_name = DB_MYSQL_BASE;
  }
  if ($db_user == '') {
    $db_user = DB_MYSQL_USER;
  }
  if ($db_pass == '') {
    $db_pass = DB_MYSQL_PASS;
  }

  $mysql_dsn = 'mysql:host=' . $db_host . ';port=' . $db_port . ';dbname=' . $db_name;
  $mysql_pdo_options = array(
    PDO::ATTR_TIMEOUT => 30,
    PDO::ATTR_ERRMODE => $error_mode,
    PDO::ATTR_CASE    => $case_mode,
  );

  $mysql_pdo = new PDO($mysql_dsn, $db_user, $db_pass, $mysql_pdo_options);
  $mysql_pdo->exec("SET NAMES 'UTF8';");
  $mysql_pdo->exec("SET time_zone = 'UTC';");

  if (!$create_new_connection || !isset($__sql_pdo) || ($__sql_pdo === NULL)) {
    $__sql_pdo = $mysql_pdo;
  }

  return $mysql_pdo;
}
