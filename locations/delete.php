<?php

session_start();

require "../config/db.php";

if (!isset($_SESSION["user_id"])) {
    header("Location: ../login.php");
    exit;
}

if (!isset($_GET["id"])) {
    die("Location ID is required");
}

$id = (int) $_GET["id"];

$userId = $_SESSION["user_id"];

$sql = "DELETE FROM locations
        WHERE id = ? AND user_id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ii",
    $id,
    $userId
);

$stmt->execute();

header("Location: list.php");

exit;
?>