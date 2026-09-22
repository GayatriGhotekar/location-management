<?php

session_start();

require "../config/db.php";

header("Content-Type: application/json");

if (!isset($_SESSION["user_id"])) {

    echo json_encode([
        "success" => false,
        "message" => "User not logged in"
    ]);

    exit;
}

$data = json_decode(
    file_get_contents("php://input"),
    true
);

if (!isset($data["id"])) {

    echo json_encode([
        "success" => false,
        "message" => "Service area ID required"
    ]);

    exit;
}

$userId = $_SESSION["user_id"];

$id = (int) $data["id"];

$sql = "DELETE FROM service_areas
        WHERE id = ? AND user_id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "ii",
    $id,
    $userId
);

$stmt->execute();

if ($stmt->affected_rows > 0) {

    echo json_encode([
        "success" => true
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => "Service area not found"
    ]);
}