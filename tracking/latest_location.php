<?php

session_start();

require "../config/db.php";

header("Content-Type: application/json");


if (!isset($_SESSION["user_id"])) {

    echo json_encode([
        "success" => false,
        "message" => "Not logged in"
    ]);

    exit;
}


$userId = $_SESSION["user_id"];


$sql =
    "SELECT
        latitude,
        longitude,
        recorded_at
     FROM location_history
     WHERE user_id = ?
     ORDER BY id DESC
     LIMIT 1";


$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "i",
    $userId
);

$stmt->execute();


$result =
    $stmt->get_result();


if ($result->num_rows === 0) {

    echo json_encode([
        "success" => false,
        "message" => "No location found"
    ]);

    exit;
}


$location =
    $result->fetch_assoc();


echo json_encode([

    "success" => true,

    "latitude" =>
        (float) $location["latitude"],

    "longitude" =>
        (float) $location["longitude"],

    "recorded_at" =>
        $location["recorded_at"]

]);
?>