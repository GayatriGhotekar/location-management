<?php

$conn = new mysqli(
    "127.0.0.1",
    "YOUR_DB_USERNAME",
    "YOUR_DB_PASSWORD",
    "location_management"
);

if ($conn->connect_error) {
    die("Database connection failed: " . $conn->connect_error);
}
?>