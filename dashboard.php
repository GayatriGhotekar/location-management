<?php

require_once __DIR__ . '/config/google_maps.php';

session_start();

require "config/db.php";

if (!isset($_SESSION["user_id"])) {
    header("Location: login.php");
    exit;
}

$userId = $_SESSION["user_id"];

$sql = "SELECT * FROM locations
        WHERE user_id = ?";

$stmt = $conn->prepare($sql);

$stmt->bind_param("i", $userId);

$stmt->execute();

$result = $stmt->get_result();

$locations = [];

while ($row = $result->fetch_assoc()) {

    $locations[] = [
        "id" => $row["id"],
        "name" => $row["name"],
        "address" => $row["address"],
        "latitude" => (float) $row["latitude"],
        "longitude" => (float) $row["longitude"],
        "category" => $row["category"]
    ];
}

?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>GeoTrack | Location Dashboard</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="assets/css/dashboard.css?v=<?php echo filemtime(__DIR__ . '/assets/css/dashboard.css'); ?>">
</head>

<body>

    <header class="header">
        <a class="brand" href="dashboard.php" aria-label="GeoTrack dashboard">
            <span class="brand-mark">G</span>
            <span>GeoTrack</span>
        </a>
        <nav class="top-nav" aria-label="Main navigation">
            <span class="welcome">Hello, <strong><?php echo htmlspecialchars($_SESSION["user_name"]); ?></strong></span>
            <a class="nav-link nav-primary" href="locations/add.php">+ Add location</a>
            <a class="nav-link" href="locations/list.php">My locations</a>
            <a class="nav-link nav-muted" href="logout.php">Log out</a>
        </nav>
    </header>

<div class="app">

    <!-- LEFT SIDEBAR -->
    <div class="sidebar">

        <div class="sidebar-intro">
            <span class="eyebrow">Control center</span>
            <h1>Explore your world</h1>
            <p>Search, track and manage every saved place from one map.</p>
        </div>

        <!-- My Location -->
        <div class="section">

            <h3>📍 My Location</h3>

            <button type="button" onclick="getCurrentLocation()"> My Current Location</button>

            <button type="button" onclick="findNearestLocation()"> Find Nearest Location</button>

            <p id="currentLocation"></p>

            <p id="nearestResult"></p>

        </div>

        <!-- Radius Search -->
        <div class="section">

            <h3>📏 Radius Search</h3>

            <select id="radius">

                <option value="5">5 KM</option>
                <option value="10">10 KM</option>
                <option value="20" selected>20 KM</option>
                <option value="50">50 KM</option>

            </select>

            <button type="button" onclick="findLocationsInRadius()"> Find Locations In Radius </button>

            <p id="radiusResult"></p>

        </div>

        <!-- Search Address -->
        <div class="section">

            <h3>🔎 Search Address</h3>

            <input type="text" id="addressInput" placeholder="Enter address">
            <button type="button" onclick="searchAddress()"> Search </button>
            <button type="button" onclick="findLocationsAroundSearch()"> Find Locations Around Address</button>

            <p id="searchResult"></p>

        </div>

        <!-- Filter Locations -->
        <div class="section">

            <h3>🗂 Filter Locations</h3>

            <select id="categoryFilter">

                <option value="All"> All Categories</option>
                <option value="Hospital"> Hospital </option>
                <option value="Restaurant"> Restaurant</option>
                <option value="ATM"> ATM </option>
                <option value="Shop"> Shop </option>
                <option value="Office"> Office </option>
                <option value="college"> college </option>
                <option value="Other"> Other </option>

            </select>

            <button type="button" onclick="filterMarkers()"> Filter </button>
            <button type="button" onclick="clearCluster()"> Clear Cluster </button>
            <button type="button" onclick="showCluster()"> Show Cluster </button>

        </div>

            <div class="section">

            <h3>Saved Locations</h3>

            <button type="button" onclick="showSavedLocations()"> Show Saved Locations </button>
            <button type="button" onclick="hideSavedLocations()"> Hide Saved Locations </button>

        </div>

        <!-- Route -->
        <div class="section">

            <h3>🚗 Route</h3>


            <label>Destination Type:</label>

            <select id="routeDestinationType" onchange="changeRouteDestinationType()">

                <option value="saved"> Saved Location </option>
                <option value="search"> Search Location </option>

            </select>

            <!-- SAVED LOCATION -->

            <div id="savedRouteSection">

                <label>Saved Location:</label>

                <select id="destinationLocation"> <option value=""> Select Destination </option>

                    <?php foreach ($locations as $location) { ?>

                        <option value="<?php echo $location["id"]; ?>">

                            <?php echo htmlspecialchars( $location["name"]); ?>

                        </option>

                    <?php } ?>

                </select>

            </div>

            <!-- SEARCH LOCATION -->

            <div id="searchRouteSection" style="display: none;" >

                <label>Search Destination:</label>

                <input type="text" id="routeSearchInput" placeholder="Enter destination">

                <button type="button" onclick="searchRouteDestination()"> Search Destination</button>

                <p id="routeSearchResult"></p>

            </div>

            <!-- ROUTE BUTTONS -->

            <button type="button" onclick="showRoute()" > Show Route </button>

            <button type="button" onclick="clearRoute()"> Clear Route</button>

            <p id="routeResult"></p>

        </div>

        <!-- Nearby Places -->
        <div class="section">

            <h3>🏥 Nearby Places</h3>

            <label>Search Around:</label>

            <select id="nearbyLocationSource">

                <option value="current"> My Current Location </option>

                <option value="search"> Searched Location</option>

            </select>

            <label>Place Type:</label>

            <select id="nearbyType">

                <option value="hospital"> Hospital</option>
                <option value="restaurant"> Restaurant </option>
                <option value="atm"> ATM </option>
                <option value="pharmacy"> Pharmacy</option>
                <option value="bank"> Bank</option>
                <option value="school"> School </option>
                <option value="college"> College </option>
                <option value="fuel"> Petrol Pump  </option>

            </select>

            <label>Radius:</label>

            <select id="nearbyRadius">

                <option value="1000"> 1 KM</option>
                <option value="2000"> 2 KM </option>
                <option value="5000" selected>  5 KM</option>
                <option value="10000"> 10 KM</option>

            </select>

            <button type="button" onclick="findNearbyPlaces()" > Find Nearby Places</button>
            <button type="button" onclick="clearNearbyPlaces()"> Clear Nearby</button>

            <p id="nearbyResult"></p>

        </div>

        <!-- Circle Geofence -->
        <div class="section">

            <h3>⭕ Service Area / Geofence</h3>

            <select id="geofenceRadius">

                <option value="2"> 2 KM </option>
                <option value="5"> 5 KM </option>
                <option value="10" selected> 10 KM</option>
                <option value="20"> 20 KM</option>

            </select>

            <button type="button" onclick="createGeofence()">Create Service Area</button>
            <button type="button" onclick="checkCurrentLocationInGeofence()"> Check My Location</button>
            <button type="button" onclick="clearGeofence()">Clear Area</button>
            <p id="geofenceResult"></p>

        </div>

        <!-- Polygon Service Area -->
        <div class="section">

            <h3>🔷 Polygon Service Area</h3>

            <button type="button" onclick="startPolygonDrawing()"> Draw Polygon</button>
            <button type="button"onclick="finishPolygon()"> Finish Polygon</button>
            <button type="button"onclick="checkLocationInPolygon()">Check My Location</button>
            <button type="button" onclick="savePolygon()"> Save Polygon</button>
            <button type="button"onclick="clearPolygon()"> Clear Polygon</button>

            <p id="polygonResult"></p>

        </div>

        <!-- Location Tracking -->
        <div class="section">

            <h3>📡 Location Tracking</h3>

            <button type="button" onclick="startTracking()">Start Tracking </button>
            <button type="button" onclick="stopTracking()"> Stop Tracking</button>
            <button type="button"onclick="showLocationHistory()">Show History</button>
            <button type="button" onclick="clearHistoryFromMap()"> Clear History From Map</button>

            <p id="trackingResult"></p>

        </div>

        <!-- Live Location -->
        <div class="section">

            <h3>🔴 Live Location</h3>

            <button type="button" onclick="startLiveView()"> Start Live View</button>
            <button type="button" onclick="stopLiveView()"> Stop Live View </button>

            <p id="liveResult"></p>

        </div>

    </div>

    <!-- RIGHT SIDE MAP -->
    <div class="map-area">
        <div class="map-badge"><span></span> Live map</div>
        <div id="map"></div>

    </div>

</div>

<script>
const locations = <?php echo json_encode($locations); ?>;
</script>

<script src="https://unpkg.com/@googlemaps/markerclusterer/dist/index.min.js"></script>
<script src="assets/js/markers.js?v=<?php echo filemtime(__DIR__ . '/assets/js/markers.js'); ?>"></script>
<script src="assets/js/service-area.js?v=<?php echo filemtime(__DIR__ . '/assets/js/service-area.js'); ?>"></script>
<script src="assets/js/map.js?v=<?php echo filemtime(__DIR__ . '/assets/js/map.js'); ?>"></script>
<script src="assets/js/current-location.js?v=<?php echo filemtime(__DIR__ . '/assets/js/current-location.js'); ?>"></script>
<script src="assets/js/distance.js?v=<?php echo filemtime(__DIR__ . '/assets/js/distance.js'); ?>"></script>
<script src="assets/js/search.js?v=<?php echo filemtime(__DIR__ . '/assets/js/search.js'); ?>"></script>
<script src="assets/js/route.js?v=<?php echo filemtime(__DIR__ . '/assets/js/route.js'); ?>"></script>
<script src="assets/js/nearby.js?v=<?php echo filemtime(__DIR__ . '/assets/js/nearby.js'); ?>"></script>
<script src="assets/js/geofence.js?v=<?php echo filemtime(__DIR__ . '/assets/js/geofence.js'); ?>"></script>
<script src="assets/js/tracking.js?v=<?php echo filemtime(__DIR__ . '/assets/js/tracking.js'); ?>"></script>

<script
    src="https://maps.googleapis.com/maps/api/js?key=<?php echo GOOGLE_MAPS_API_KEY; ?>&callback=initMap"
    async
    defer>
</script>

</body>

</html>
