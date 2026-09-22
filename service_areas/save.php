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
    !isset($data["name"]) ||
    !isset($data["coordinates"])
) {

    echo json_encode([
        "success" => false,
        "message" => "Invalid data"
    ]);

    exit;
}


$userId = $_SESSION["user_id"];

$name = $data["name"];

$coordinates =
    json_encode(
        $data["coordinates"]
    );


$sql =
    "INSERT INTO service_areas
    (user_id, name, coordinates)
    VALUES (?, ?, ?)";


$stmt = $conn->prepare($sql);


$stmt->bind_param(
    "iss",
    $userId,
    $name,
    $coordinates
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