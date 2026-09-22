<?php

session_start();

require "../config/db.php";

if (!isset($_SESSION["user_id"])) {
    header("Location: ../login.php");
    exit;
}

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $userId = $_SESSION["user_id"];
    $name = $_POST["name"];
    $address = $_POST["address"];
    $latitude = $_POST["latitude"];
    $longitude = $_POST["longitude"];
    $category = $_POST["category"];

    $sql = "INSERT INTO locations
            (user_id, name, address, latitude, longitude, category)
            VALUES (?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "issdds",
        $userId,
        $name,
        $address,
        $latitude,
        $longitude,
        $category
    );

    if ($stmt->execute()) {
        $message = "Location saved successfully";
    } else {
        $message = "Failed to save location";
    }
}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Add Location | GeoTrack</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">
</head>

<body class="inner-page">
<header class="header"><a class="brand" href="../dashboard.php"><span class="brand-mark">G</span><span>GeoTrack</span></a><nav class="top-nav"><a class="nav-link" href="list.php">My locations</a><a class="nav-link nav-muted" href="../logout.php">Log out</a></nav></header>
<main class="page-container narrow-container">
<a class="back-link" href="../dashboard.php">← Back to dashboard</a>
<section class="page-heading"><span class="eyebrow">New place</span><h1>Add a location</h1><p>Save a useful place to your personal map.</p></section>
<?php if ($message !== "") { ?><p class="alert alert-success"><?php echo htmlspecialchars($message); ?></p><?php } ?>
<form method="POST" class="content-card modern-form">

    <label for="name">Location name</label>

    <input
        type="text"
        name="name" id="name" placeholder="e.g. City Hospital"
        required
    >

    <label for="address">Address</label>

    <input
        type="text"
        name="address" id="address" placeholder="Street, area and city"
        required
    >

    <div class="form-grid"><div><label for="latitude">Latitude</label>

    <input
        type="number"
        step="any"
        name="latitude" id="latitude" placeholder="e.g. 20.5937"
        required
    >

    </div><div><label for="longitude">Longitude</label>

    <input
        type="number"
        step="any"
        name="longitude" id="longitude" placeholder="e.g. 78.9629"
        required
    >

    </div></div>
    <label for="category">Category</label>

    <select name="category" id="category" required>

        <option value="">Select Category</option>

        <option value="Hospital">Hospital</option>

        <option value="Restaurant">Restaurant</option>

        <option value="ATM">ATM</option>

        <option value="Shop">Shop</option>

        <option value="Office">Office</option>

        <option value="Other">Other</option>

    </select>

    <button class="btn btn-primary" type="submit">Save location →</button>

</form>

</main></body>

</html>
