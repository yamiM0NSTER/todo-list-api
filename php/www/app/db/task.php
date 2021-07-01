<?php

function db_tasks_get(PDO $pdo)
{
  $sql  = 'SELECT
            TA.*
          FROM
            Task AS TA;';
  $stmt = $pdo->prepare($sql);

  $tasks = array();
  if ($stmt->execute()) {
    while ($task = $stmt->fetch(PDO::FETCH_ASSOC)) {
      array_push($tasks, $task);
    }
  }

  return $tasks;
}

function db_tasks_get_by_guid(PDO $pdo, $guid)
{
  $sql  = 'SELECT
            TA.*
          FROM
            Task AS TA
          WHERE
            TA.guid = upper(:guid);';
  $stmt = $pdo->prepare($sql);
  $stmt->bindValue('guid', $guid, PDO::PARAM_STR);

  if ($stmt->execute()) {
    if ($task = $stmt->fetch(PDO::FETCH_ASSOC)) {
      return $task;
    }
  }

  return FALSE;
}

function db_tasks_get_by_id(PDO $pdo, $id)
{
  $sql  = 'SELECT
            TA.*
          FROM
            Task AS TA
          WHERE
            TA.id = upper(:id);';
  $stmt = $pdo->prepare($sql);
  $stmt->bindValue('id', $id, PDO::PARAM_INT);

  if ($stmt->execute()) {
    if ($task = $stmt->fetch(PDO::FETCH_ASSOC)) {
      return $task;
    }
  }

  return FALSE;
}

function db_tasks_delete_by_guid(PDO $pdo, $guid)
{
  $sql  = 'DELETE FROM
            Task
          WHERE
            guid = :guid
          ';
  $stmt = $pdo->prepare($sql);
  $stmt->bindValue('guid', $guid, PDO::PARAM_STR);

  if ($stmt->execute()) {
    return $stmt->rowCount();
  }

  return FALSE;
}

function db_tasks_update(PDO $pdo, $guid, $payload)
{
  $sql  = 'UPDATE Task SET
            title = :title,
            notificationText = :notificationText,
            notificationTime = :notificationTime
          WHERE
            guid = :guid';

  $stmt = $pdo->prepare($sql);

  $stmt->bindValue('title', $payload->{'title'}, PDO::PARAM_STR);
  $stmt->bindValue('notificationText', $payload->{'notificationText'}, PDO::PARAM_STR);
  $stmt->bindValue('notificationTime', $payload->{'notificationTime'}, PDO::PARAM_STR);
  $stmt->bindValue('guid', $guid, PDO::PARAM_STR);

  if ($stmt->execute()) {
    return $stmt->rowCount();
  }

  return FALSE;
}

function db_tasks_add(PDO $pdo, $payload)
{
  $sql  = 'INSERT INTO Task
          (
            guid,
            title,
            notificationText,
            notificationTime,
            userId,
            createdAt,
            updatedAt
          )
          VALUES
          (
            :guid,
            :title,
            :notificationText,
            :notificationTime,
            :userId,
            NOW(),
            NOW()
          );';

  $stmt = $pdo->prepare($sql);
  $stmt->bindValue('title', $payload->{'title'}, PDO::PARAM_STR);
  $stmt->bindValue('notificationText', $payload->{'notificationText'}, PDO::PARAM_STR);
  $stmt->bindValue('notificationTime', $payload->{'notificationTime'}, PDO::PARAM_STR);
  $stmt->bindValue('userId', $payload->{'userId'}, PDO::PARAM_INT);
  $stmt->bindValue('guid', getGUID(), PDO::PARAM_STR);

  if ($stmt->execute()) {
    return $pdo->lastInsertId();
  }

  return FALSE;
}

function db_tasks_set_shown(PDO $pdo, $payload)
{
  global $TASK_STATUS;

  $sql  = 'UPDATE Task SET
            taskState = :taskState,
            seen = :seen
          WHERE
            id = :id';

  $stmt = $pdo->prepare($sql);

  $stmt->bindValue('taskState', $TASK_STATUS['SHOWN'], PDO::PARAM_INT);
  $stmt->bindValue('seen', $payload->{'seen'}, PDO::PARAM_INT);
  $stmt->bindValue('id', $payload->{'id'}, PDO::PARAM_INT);

  if ($stmt->execute()) {
    return $stmt->rowCount();
  }

  return FALSE;
}

function db_tasks_get_incomming(PDO $pdo)
{
  global $TASK_STATUS;

  $sql  = 'SELECT
            TA.*
          FROM
            Task AS TA
          WHERE
            TA.taskState = :taskState
            AND (TA.notificationTime >= NOW()
            AND TA.notificationTime <= (NOW() + INTERVAL 1 MINUTE))';
  $stmt = $pdo->prepare($sql);
  $stmt->bindValue('taskState', $TASK_STATUS['NEW'], PDO::PARAM_INT);

  $tasks = array();
  if ($stmt->execute()) {
    while ($task = $stmt->fetch(PDO::FETCH_ASSOC)) {
      array_push($tasks, $task);
    }
  }

  return $tasks;
}
