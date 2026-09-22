<?php

session_start();

require "../config/db.php";

if (!isset($_SESSION["user_id"])) {
    header("Location: ../login.php");
    exit;
}

$userId = $_SESSION["user_id"];

if (!isset($_GET["id"])) {
    die("Location ID is required");
}

$id = (int) $_GET["id"];

$sql = "SELECT * FROM locations
        WHERE id = ? AND user_id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("ii", $id, $userId);

$stmt->execute();

$result = $stmt->get_result();

if ($result->num_rows !== 1) {
    die("Location not found");
}

$location = $result->fetch_assoc();

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name = $_POST["name"];
    $address = $_POST["address"];
    $latitude = $_POST["latitude"];
    $longitude = $_POST["longitude"];
    $category = $_POST["category"];

    $sql = "UPDATE locations
            SET name = ?,
                address = ?,
                latitude = ?,
                longitude = ?,
                category = ?
            WHERE id = ? AND user_id = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "ssddsii",
        $name,
        $address,
        $latitude,
        $longitude,
        $category,
        $id,
        $userId
    );

    if ($stmt->execute()) {

        header("Location: list.php");
        exit;

    } else {

        echo "Failed to update location";
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Location | GeoTrack</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
</head>

<body class="inner-page">
<header class="header"><a class="brand" href="../dashboard.php"><span class="brand-mark">G</span><span>GeoTrack</span></a><nav class="top-nav"><a class="nav-link" href="list.php">My locations</a><a class="nav-link nav-muted" href="../logout.php">Log out</a></nav></header>
<main class="page-container narrow-container"><a class="back-link" href="list.php">← Back to locations</a>
<section class="page-heading"><span class="eyebrow">Update place</span><h1>Edit location</h1><p>Keep your saved location details accurate.</p></section>
<form method="POST" class="content-card modern-form">

    <label for="name">Location name</label>

    <input
        type="text"
        name="name" id="name"
        value="<?php echo htmlspecialchars($location["name"]); ?>"
        required
    >

    <label for="address">Address</label>

    <input
        type="text"
        name="address" id="address"
        value="<?php echo htmlspecialchars($location["address"]); ?>"
        required
    >

    <div class="form-grid"><div><label for="latitude">Latitude</label>

    <input
        type="number"
        step="any"
        name="latitude" id="latitude"
        value="<?php echo $location["latitude"]; ?>"
        required
    >

    </div><div><label for="longitude">Longitude</label>

    <input
        type="number"
        step="any"
        name="longitude" id="longitude"
        value="<?php echo $location["longitude"]; ?>"
        required
    >

    </div></div><label for="category">Category</label>

    <select name="category" id="category" required>

        <option value="Hospital"
            <?php if ($location["category"] === "Hospital") echo "selected"; ?>>
            Hospital
        </option>

        <option value="Restaurant"
            <?php if ($location["category"] === "Restaurant") echo "selected"; ?>>
            Restaurant
        </option>

        <option value="ATM"
            <?php if ($location["category"] === "ATM") echo "selected"; ?>>
            ATM
        </option>

        <option value="Shop"
            <?php if ($location["category"] === "Shop") echo "selected"; ?>>
            Shop
        </option>

        <option value="Office"
            <?php if ($location["category"] === "Office") echo "selected"; ?>>
            Office
        </option>

        <option value="Other"
            <?php if ($location["category"] === "Other") echo "selected"; ?>>
            Other
        </option>

    </select>

    <button class="btn btn-primary" type="submit">Update location →</button>

</form>

</main></body>

</html>
