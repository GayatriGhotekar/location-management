<?php

session_start();

require "../config/db.php";

if (!isset($_SESSION["user_id"])) {
    header("Location: ../login.php");
    exit;
}

$userId = $_SESSION["user_id"];

$sql = "SELECT * FROM locations
        WHERE user_id = ?
        ORDER BY id DESC";

$stmt = $conn->prepare($sql);

$stmt->bind_param("i", $userId);

$stmt->execute();

$result = $stmt->get_result();

?>

<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Locations | GeoTrack</title>
    <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="../css/style.css">

</head>

<body class="inner-page">
<header class="header"><a class="brand" href="../dashboard.php"><span class="brand-mark">G</span><span>GeoTrack</span></a><nav class="top-nav"><a class="nav-link" href="../dashboard.php">Dashboard</a><a class="nav-link nav-muted" href="../logout.php">Log out</a></nav></header>
<main class="page-container"><div class="heading-row"><section class="page-heading"><span class="eyebrow">Your collection</span><h1>Saved locations</h1><p>Review and manage every place on your map.</p></section><a class="btn btn-primary" href="add.php">+ Add location</a></div>
<div class="table-card"><div class="table-scroll"><table>

    <tr>
        <th>ID</th>
        <th>Name</th>
        <th>Address</th>
        <th>Latitude</th>
        <th>Longitude</th>
        <th>Category</th>
        <th>Action</th>
    </tr>

    <?php while ($location = $result->fetch_assoc()) { ?>

        <tr>

            <td>
                <?php echo $location["id"]; ?>
            </td>

            <td>
                <?php echo htmlspecialchars($location["name"]); ?>
            </td>

            <td>
                <?php echo htmlspecialchars($location["address"]); ?>
            </td>

            <td>
                <?php echo $location["latitude"]; ?>
            </td>

            <td>
                <?php echo $location["longitude"]; ?>
            </td>

            <td>
                <?php echo htmlspecialchars($location["category"]); ?>
            </td>

            <td>

                <a class="table-action edit-action" href="edit.php?id=<?php echo $location["id"]; ?>">
                    Edit
                </a>

                <a
                    class="table-action delete-action"
                    href="delete.php?id=<?php echo $location["id"]; ?>"
                    onclick="return confirm('Delete this location?')"
                >
                    Delete
                </a>

            </td>

        </tr>

    <?php } ?>

</table></div></div>
</main></body>

</html>
