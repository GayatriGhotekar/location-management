<?php

session_start();

require "config/db.php";

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $email = $_POST["email"];
    $password = $_POST["password"];

    $sql = "SELECT * FROM users WHERE email = ?";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param("s", $email);

    $stmt->execute();

    $result = $stmt->get_result();

    if ($result->num_rows === 1) {

        $user = $result->fetch_assoc();

        if (password_verify($password, $user["password"])) {

            $_SESSION["user_id"] = $user["id"];
            $_SESSION["user_name"] = $user["name"];

            header("Location: dashboard.php");
            exit;

        } else {

            $message = "Invalid password";
        }

    } else {

        $message = "User not found";
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sign in | GeoTrack</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="auth-page">
<main class="auth-shell">
<section class="auth-showcase">
    <a class="brand brand-light" href="login.php"><span class="brand-mark">G</span><span>GeoTrack</span></a>
    <div class="auth-copy">
        <span class="eyebrow">Smarter location management</span>
        <h1>Every important place, right where you need it.</h1>
        <p>Save locations, discover nearby services, build routes and track movement from one beautifully simple dashboard.</p>
        <div class="feature-pills"><span>Live tracking</span><span>Smart radius search</span><span>Custom geofences</span></div>
    </div>
    <div class="decorative-map" aria-hidden="true"><i></i><b>●</b><span>●</span></div>
</section>
<section class="auth-panel">
<div class="auth-card">
<span class="eyebrow">Welcome back</span>
<h2>Sign in to your account</h2>
<p class="form-subtitle">Continue managing your saved places.</p>
<?php if ($message !== "") { ?><p class="alert alert-error"><?php echo htmlspecialchars($message); ?></p><?php } ?>
<form method="POST" class="modern-form">
    <label for="email">Email address</label>

    <input
        type="email"
        name="email"
        id="email"
        placeholder="you@example.com"
        required
    >

    <label for="password">Password</label>
    <input
        type="password"
        name="password"
        id="password"
        placeholder="Enter your password"
        required
    >

    <button class="btn btn-primary btn-block" type="submit">Sign in <span>→</span></button>

</form>

<p class="form-switch">New to GeoTrack? <a href="register.php">Create an account</a></p>
</div>
</section>
</main>
</body>
</html>
