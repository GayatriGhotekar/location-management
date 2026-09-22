<?php

require "config/db.php";

$message = "";

if ($_SERVER["REQUEST_METHOD"] === "POST") {

    $name = $_POST["name"];
    $email = $_POST["email"];
    $password = password_hash($_POST["password"], PASSWORD_DEFAULT);

    $sql = "INSERT INTO users (name, email, password)
            VALUES (?, ?, ?)";

    $stmt = $conn->prepare($sql);

    $stmt->bind_param(
        "sss",
        $name,
        $email,
        $password
    );

    if ($stmt->execute()) {

        $message = "Registration successful";

    } else {

        $message = "Registration failed: " . $stmt->error;
    }
}

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Create account | GeoTrack</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="css/style.css">
</head>
<body class="auth-page">
<main class="auth-shell">
<section class="auth-showcase">
    <a class="brand brand-light" href="login.php"><span class="brand-mark">G</span><span>GeoTrack</span></a>
    <div class="auth-copy"><span class="eyebrow">Start exploring</span><h1>Your places deserve a better map.</h1><p>Create an account and turn scattered location details into one clear, interactive workspace.</p><div class="feature-pills"><span>Save favorites</span><span>Plan routes</span><span>Explore nearby</span></div></div>
    <div class="decorative-map" aria-hidden="true"><i></i><b>●</b><span>●</span></div>
</section>
<section class="auth-panel"><div class="auth-card">
<span class="eyebrow">Get started</span><h2>Create your account</h2><p class="form-subtitle">It only takes a moment.</p>
<?php if ($message !== "") { ?><p class="alert <?php echo $message === 'Registration successful' ? 'alert-success' : 'alert-error'; ?>"><?php echo htmlspecialchars($message); ?></p><?php } ?>
<form method="POST" class="modern-form">
    <label for="name">Full name</label>

    <input
        type="text"
        name="name"
        id="name"
        placeholder="Your full name"
        required
    >

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
        placeholder="Create a secure password"
        required
    >

    <button class="btn btn-primary btn-block" type="submit">Create account <span>→</span></button>

</form>

<p class="form-switch">Already have an account? <a href="login.php">Sign in</a></p>
</div></section></main>
</body>
</html>
