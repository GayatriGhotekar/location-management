let geofenceCircle = null;
let geofenceLatitude = null;
let geofenceLongitude = null;
let geofenceRadius = null;
let polygonPoints = [];
let polygonMarkers = [];
let servicePolygon = null;
let drawingPolygon = false;
let polygonClickListener = null;

function createGeofence() {

    if (
        searchLatitude === null ||
        searchLongitude === null
    ) {
        alert("Please search an address first");
        return;
    }


    geofenceRadius =
        parseFloat(
            document.getElementById(
                "geofenceRadius"
            ).value
        );


    geofenceLatitude = searchLatitude;
    geofenceLongitude = searchLongitude;


    if (geofenceCircle) {
        geofenceCircle.setMap(null);
    }


    geofenceCircle =
        new google.maps.Circle({

            map: map,

            center: {
                lat: geofenceLatitude,
                lng: geofenceLongitude
            },

            radius: geofenceRadius * 1000,

            fillOpacity: 0.15,

            strokeOpacity: 0.8,

            strokeWeight: 2

        });


    map.fitBounds(
        geofenceCircle.getBounds()
    );


    document.getElementById(
        "geofenceResult"
    ).innerHTML =

        "Service area created.<br>" +

        "Radius: " +
        geofenceRadius +
        " KM";

}


function checkCurrentLocationInGeofence() {

    if (
        geofenceLatitude === null ||
        geofenceLongitude === null
    ) {
        alert("Please create a service area first");
        return;
    }


    if (
        currentLatitude === null ||
        currentLongitude === null
    ) {
        alert("Please get your current location first");
        return;
    }


    const distance =
        calculateDistance(

            geofenceLatitude,
            geofenceLongitude,

            currentLatitude,
            currentLongitude

        );


    if (distance <= geofenceRadius) {

        document.getElementById(
            "geofenceResult"
        ).innerHTML =

            "<strong>Your location is INSIDE the service area</strong>" +

            "<br>Distance from center: " +

            distance.toFixed(2) +

            " KM";

    } else {

        document.getElementById(
            "geofenceResult"
        ).innerHTML =

            "<strong>Your location is OUTSIDE the service area</strong>" +

            "<br>Distance from center: " +

            distance.toFixed(2) +

            " KM";

    }

}


function clearGeofence() {

    if (geofenceCircle) {

        geofenceCircle.setMap(null);

        geofenceCircle = null;

    }


    geofenceLatitude = null;
    geofenceLongitude = null;
    geofenceRadius = null;


    document.getElementById(
        "geofenceResult"
    ).innerHTML = "";

}

function startPolygonDrawing() {

    clearPolygon();

    drawingPolygon = true;

    document.getElementById(
        "polygonResult"
    ).innerHTML =
        "Click points on the map to create the service area";


    polygonClickListener =
        map.addListener(
            "click",
            function(event) {

                if (!drawingPolygon) {
                    return;
                }


                const point = {

                    lat: event.latLng.lat(),

                    lng: event.latLng.lng()

                };


                polygonPoints.push(point);


                const pointMarker =
                    new google.maps.Marker({

                        position: point,

                        map: map

                    });


                polygonMarkers.push(
                    pointMarker
                );


                drawTemporaryPolygon();

            }
        );

}


function drawTemporaryPolygon() {

    if (servicePolygon) {

        servicePolygon.setMap(null);

    }


    servicePolygon =
    new google.maps.Polygon({

        paths: polygonPoints,

        map: map,

        strokeOpacity: 0.8,

        strokeWeight: 2,

        fillOpacity: 0.15

    });

}


function finishPolygon() {

    if (polygonPoints.length < 3) {

        alert(
            "Please select at least 3 points"
        );

        return;
    }


    drawingPolygon = false;


    if (polygonClickListener) {

        google.maps.event.removeListener(
            polygonClickListener
        );

        polygonClickListener = null;

    }


    document.getElementById(
        "polygonResult"
    ).innerHTML =

        "Polygon service area created with " +

        polygonPoints.length +

        " points";

}

function isPointInsidePolygon(
    latitude,
    longitude,
    polygon
) {

    let inside = false;


    for (
        let i = 0, j = polygon.length - 1;
        i < polygon.length;
        j = i++
    ) {

        const xi = polygon[i].lng;
        const yi = polygon[i].lat;

        const xj = polygon[j].lng;
        const yj = polygon[j].lat;


        const intersect =

            ((yi > latitude) !==
             (yj > latitude))

            &&

            (
                longitude <

                (xj - xi) *
                (latitude - yi) /
                (yj - yi) +
                xi
            );


        if (intersect) {

            inside = !inside;

        }

    }


    return inside;

}


function checkLocationInPolygon() {

    if (polygonPoints.length < 3) {

        alert(
            "Please create a polygon first"
        );

        return;
    }


    if (
        currentLatitude === null ||
        currentLongitude === null
    ) {

        alert(
            "Please get your current location first"
        );

        return;
    }


    const inside =
        isPointInsidePolygon(

            currentLatitude,

            currentLongitude,

            polygonPoints

        );


    if (inside) {

        document.getElementById(
            "polygonResult"
        ).innerHTML =

            "<strong>" +
            "Your location is INSIDE the polygon" +
            "</strong>";

    } else {

        document.getElementById(
            "polygonResult"
        ).innerHTML =

            "<strong>" +
            "Your location is OUTSIDE the polygon" +
            "</strong>";

    }

}


function clearPolygon() {

    drawingPolygon = false;


    // Remove map click listener
    if (polygonClickListener) {

        google.maps.event.removeListener(
            polygonClickListener
        );

        polygonClickListener = null;
    }


    // Remove currently drawn polygon
    if (servicePolygon) {

        servicePolygon.setMap(null);

        servicePolygon = null;
    }


    // Remove point markers
    polygonMarkers.forEach(
        function(marker) {

            marker.setMap(null);

        }
    );

    polygonMarkers = [];


    // Remove saved polygons from map
    savedPolygons.forEach(
        function(polygon) {

            polygon.setMap(null);

        }
    );

    savedPolygons = [];


    // Clear polygon coordinates
    polygonPoints = [];


    document.getElementById(
        "polygonResult"
    ).innerHTML = "";

}
