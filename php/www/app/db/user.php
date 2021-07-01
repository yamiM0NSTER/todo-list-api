<?php

function db_users_get(PDO $pdo)
{
  $sql  = 'SELECT
            CU.*
          FROM
            User AS CU;';
  $stmt = $pdo->prepare($sql);

  $users = array();
  if ($stmt->execute()) {
    while ($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
      array_push($users, $user);
    }
  }

  return $users;
}

function db_users_get_by_id(PDO $pdo, $id)
{
  $sql  = 'SELECT
            CU.*
          FROM
            User AS CU
          WHERE
            CU.id = upper(:id);';
  $stmt = $pdo->prepare($sql);
  $stmt->bindValue('id', $id, PDO::PARAM_INT);

  if ($stmt->execute()) {
    if ($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
      return $user;
    }
  }

  return FALSE;
}

function db_users_get_by_email(PDO $pdo, $email)
{
  $sql  = 'SELECT
            CU.*
          FROM
            User AS CU
          WHERE
            CU.email = upper(:mail);';
  $stmt = $pdo->prepare($sql);
  $stmt->bindValue('mail', $email, PDO::PARAM_STR);

  if ($stmt->execute()) {
    if ($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
      return $user;
    }
  }

  return FALSE;
}

function db_users_add(PDO $pdo, $payload)
{
  $sql  = 'INSERT INTO User
          (
            email,
            displayName,
            guid,
            updatedAt
          )
          VALUES
          (
            :email,
            :displayName,
            :guid,
            NOW()
          );';

  $stmt = $pdo->prepare($sql);
  $stmt->bindValue('email', $payload->{'email'}, PDO::PARAM_STR);
  $stmt->bindValue('displayName', $payload->{'displayName'}, PDO::PARAM_STR);
  $stmt->bindValue('guid', getGUID(), PDO::PARAM_STR);

  if ($stmt->execute()) {
    return $pdo->lastInsertId();
  }

  return FALSE;
}
