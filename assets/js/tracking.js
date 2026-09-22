let trackingWatchId = null;
let historyMarkers = [];
let historyPolyline = null;
let liveInterval = null;
let liveMarker = null;
let lastSavedLatitude = null;
let lastSavedLongitude = null;
let lastSavedTime = null;
const minimumDistance = 10;
const maximumTime = 30000;
const maximumAccuracy = 50;

function startTracking() {

    if (!navigator.geolocation) {

        alert(
            "Geolocation is not supported"
        );

        return;
    }


    if (trackingWatchId !== null) {

        alert(
            "Tracking is already running"
        );

        return;
    }


    document.getElementById(
        "trackingResult"
    ).innerHTML =
        "Tracking started...";


    trackingWatchId =
        navigator.geolocation.watchPosition(

            function(position) {

                const latitude =
                    position.coords.latitude;

                const longitude =
                    position.coords.longitude;

                const accuracy =
                    position.coords.accuracy;


                currentLatitude = latitude;
                currentLongitude = longitude;


                checkAndSaveLocation(
                    latitude,
                    longitude,
                    accuracy
                );

            },


            function(error) {

                console.log(
                    "Tracking Error:",
                    error
                );

            },


            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }

        );

}
function stopTracking() {

    if (trackingWatchId === null) {

        alert(
            "Tracking is not running"
        );

        return;
    }


    navigator.geolocation.clearWatch(
        trackingWatchId
    );


    trackingWatchId = null;


    document.getElementById(
        "trackingResult"
    ).innerHTML =
        "Tracking stopped";

}


function showLocationHistory() {

    clearHistoryFromMap();


    fetch("tracking/history.php")

        .then(function(response) {

            return response.json();

        })

        .then(function(history) {

            if (history.length === 0) {

                alert(
                    "No location history found"
                );

                return;
            }


            const path = [];

            const bounds =
                new google.maps.LatLngBounds();


            history.forEach(
                function(item) {

                    const position = {

                        lat: item.latitude,

                        lng: item.longitude

                    };


                    path.push(position);

                    bounds.extend(position);


                    const marker =
                        new google.maps.Marker({

                            position: position,

                            map: map,

                            title:
                                item.recorded_at

                        });


                    historyMarkers.push(
                        marker
                    );

                }
            );


            historyPolyline =
                new google.maps.Polyline({

                    path: path,

                    map: map,

                    strokeOpacity: 1,

                    strokeWeight: 4

                });


            map.fitBounds(bounds);


            document.getElementById(
                "trackingResult"
            ).innerHTML =

                history.length +
                " location points loaded";

        })

        .catch(function(error) {

            console.log(error);

            alert(
                "Unable to load history"
            );

        });

}


function clearHistoryFromMap() {

    historyMarkers.forEach(
        function(marker) {

            marker.setMap(null);

        }
    );


    historyMarkers = [];


    if (historyPolyline) {

        historyPolyline.setMap(null);

        historyPolyline = null;

    }

}


function getLatestLocation() {

    fetch(
        "tracking/latest_location.php"
    )

    .then(function(response) {

        return response.json();

    })

    .then(function(data) {

        if (!data.success) {

            document.getElementById(
                "liveResult"
            ).innerHTML =
                data.message;

            return;
        }


        const position = {

            lat: data.latitude,

            lng: data.longitude

        };


        if (!liveMarker) {

            liveMarker =
                new google.maps.Marker({

                    position: position,

                    map: map,

                    title: "Live Location"

                });

        } else {

            liveMarker.setPosition(
                position
            );

        }


        map.setCenter(position);


        document.getElementById(
            "liveResult"
        ).innerHTML =

            "<strong>Live Location</strong>" +

            "<br>Latitude: " +
            data.latitude +

            "<br>Longitude: " +
            data.longitude +

            "<br>Last Update: " +
            data.recorded_at;

    })

    .catch(function(error) {

        console.log(
            "Live tracking error:",
            error
        );

    });

}


function startLiveView() {

    if (liveInterval !== null) {

        alert(
            "Live view is already running"
        );

        return;

    }


    getLatestLocation();


    liveInterval =
        setInterval(
            getLatestLocation,
            5000
        );


    document.getElementById(
        "liveResult"
    ).innerHTML =
        "Starting live view...";

}


function stopLiveView() {

    if (liveInterval !== null) {

        clearInterval(
            liveInterval
        );

        liveInterval = null;

    }


    document.getElementById(
        "liveResult"
    ).innerHTML =
        "Live view stopped";

}


function saveTrackingLocation(
    latitude,
    longitude
) {

    fetch(
        "tracking/save_location.php",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                latitude: latitude,
                longitude: longitude
            })
        }
    )

    .then(function(response) {
        return response.json();
    })

    .then(function(data) {

        if (data.success) {

            document.getElementById(
                "trackingResult"
            ).innerHTML =

                "Tracking...<br>" +

                "Latitude: " +
                latitude +

                "<br>Longitude: " +
                longitude;

        }

    })

    .catch(function(error) {

        console.log(error);

    });

}

function calculateDistanceMeters(
    lat1,
    lng1,
    lat2,
    lng2
) {

    const distanceKm =
        calculateDistance(
            lat1,
            lng1,
            lat2,
            lng2
        );

    return distanceKm * 1000;
}


function checkAndSaveLocation(
    latitude,
    longitude,
    accuracy
) {

    // 1. Check GPS accuracy
    if (accuracy > maximumAccuracy) {

        console.log(
            "Location ignored. Poor GPS accuracy:",
            accuracy,
            "meters"
        );

        document.getElementById(
            "trackingResult"
        ).innerHTML =
            "Waiting for better GPS accuracy..." +
            "<br>Current accuracy: " +
            Math.round(accuracy) +
            " meters";

        return;
    }


    const currentTime = Date.now();


    // 2. First location
    // Always save the first valid location
    if (
        lastSavedLatitude === null ||
        lastSavedLongitude === null ||
        lastSavedTime === null
    ) {

        saveTrackingLocation(
            latitude,
            longitude
        );


        lastSavedLatitude = latitude;

        lastSavedLongitude = longitude;

        lastSavedTime = currentTime;


        console.log(
            "First location saved"
        );

        return;
    }


    // 3. Calculate distance from
    // last saved location
    const distance =
        calculateDistanceMeters(

            lastSavedLatitude,
            lastSavedLongitude,

            latitude,
            longitude

        );


    // 4. Calculate time since
    // last saved location
    const timeDifference =
        currentTime - lastSavedTime;


    console.log(
        "GPS Accuracy:",
        accuracy.toFixed(2),
        "meters"
    );


    console.log(
        "Distance moved:",
        distance.toFixed(2),
        "meters"
    );


    console.log(
        "Time since last save:",
        (timeDifference / 1000).toFixed(0),
        "seconds"
    );


    // 5. Save if user moved 10 meters
    // OR 30 seconds have passed
    if (
        distance >= minimumDistance ||
        timeDifference >= maximumTime
    ) {

        saveTrackingLocation(
            latitude,
            longitude
        );


        // Update last saved position
        lastSavedLatitude = latitude;

        lastSavedLongitude = longitude;

        lastSavedTime = currentTime;


        console.log(
            "Location saved"
        );


        document.getElementById(
            "trackingResult"
        ).innerHTML =

            "Tracking..." +

            "<br>Location saved" +

            "<br>Moved: " +
            distance.toFixed(2) +
            " meters" +

            "<br>Accuracy: " +
            accuracy.toFixed(2) +
            " meters";

    } else {

        console.log(
            "Location not saved"
        );


        document.getElementById(
            "trackingResult"
        ).innerHTML =

            "Tracking..." +

            "<br>Location not saved" +

            "<br>Moved: " +
            distance.toFixed(2) +
            " meters" +

            "<br>Time: " +
            (timeDifference / 1000).toFixed(0) +
            " seconds" +

            "<br>Accuracy: " +
            accuracy.toFixed(2) +
            " meters";

    }

}
