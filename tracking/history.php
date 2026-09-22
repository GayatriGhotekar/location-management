<?php

session_start();

require "../config/db.php";

header("Content-Type: application/json");


if (!isset($_SESSION["user_id"])) {

    echo json_encode([]);

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
     ORDER BY recorded_at ASC";


$stmt = $conn->prepare($sql);


$stmt->bind_param(
    "i",
    $userId
);


$stmt->execute();


$result =
    $stmt->get_result();


$history = [];


while ($row = $result->fetch_assoc()) {

    $history[] = [

        "latitude" =>
            (float) $row["latitude"],

        "longitude" =>
            (float) $row["longitude"],

        "recorded_at" =>
            $row["recorded_at"]

    ];

}


echo json_encode($history);
?>