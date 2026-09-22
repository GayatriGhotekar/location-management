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
    "SELECT id, name, coordinates
     FROM service_areas
     WHERE user_id = ?
     ORDER BY id DESC";


$stmt = $conn->prepare($sql);

$stmt->bind_param(
    "i",
    $userId
);

$stmt->execute();


$result =
    $stmt->get_result();


$areas = [];


while ($row = $result->fetch_assoc()) {

    $areas[] = [

        "id" => $row["id"],

        "name" => $row["name"],

        "coordinates" =>
            json_decode(
                $row["coordinates"],
                true
            )

    ];

}


echo json_encode($areas);
?>