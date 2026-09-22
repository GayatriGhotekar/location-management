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


$data =
    json_decode(
        file_get_contents("php://input"),
        true
    );


if (
    !isset($data["latitude"]) ||
    !isset($data["longitude"])
) {

    echo json_encode([
        "success" => false,
        "message" => "Location missing"
    ]);

    exit;
}


$userId = $_SESSION["user_id"];

$latitude = (float) $data["latitude"];
$longitude = (float) $data["longitude"];


$sql =
    "INSERT INTO location_history
    (user_id, latitude, longitude)
    VALUES (?, ?, ?)";


$stmt = $conn->prepare($sql);


$stmt->bind_param(
    "idd",
    $userId,
    $latitude,
    $longitude
);


if ($stmt->execute()) {

    echo json_encode([
        "success" => true
    ]);

} else {

    echo json_encode([
        "success" => false,
        "message" => $stmt->error
    ]);

}
?>