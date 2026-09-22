let routePolyline = null;
let routeDestinationLatitude = null;
let routeDestinationLongitude = null;
let routeDestinationMarker = null;
let routeDestinationName = null;

function showRoute() {

    // Current location is the starting point

    if (
        currentLatitude === null ||
        currentLongitude === null
    ) {

        alert(
            "Please get your current location first"
        );

        return;
    }


    const destinationType =
        document.getElementById(
            "routeDestinationType"
        ).value;


    let destinationLatitude;

    let destinationLongitude;

    let destinationName;


    // =====================================
    // SAVED LOCATION
    // =====================================

    if (destinationType === "saved") {

        const locationId =
            document.getElementById(
                "destinationLocation"
            ).value;


        if (locationId === "") {

            alert(
                "Please select a saved location"
            );

            return;
        }


        const destination =
            locations.find(
                function(location) {

                    return (
                        String(location.id) ===
                        String(locationId)
                    );

                }
            );


        if (!destination) {

            alert(
                "Saved location not found"
            );

            return;
        }


        destinationLatitude =
            parseFloat(
                destination.latitude
            );


        destinationLongitude =
            parseFloat(
                destination.longitude
            );


        destinationName =
            destination.name;

    }


    // =====================================
    // SEARCHED LOCATION
    // =====================================

    else {

        if (
            routeDestinationLatitude === null ||
            routeDestinationLongitude === null
        ) {

            alert(
                "Please search a destination first"
            );

            return;
        }


        destinationLatitude =
            routeDestinationLatitude;


        destinationLongitude =
            routeDestinationLongitude;


        destinationName =
            routeDestinationName;

    }


    document.getElementById(
        "routeResult"
    ).textContent =
        "Finding route...";


    // =====================================
    // OSRM
    // IMPORTANT:
    // OSRM uses longitude,latitude
    // =====================================

    const url =
        "https://router.project-osrm.org/route/v1/driving/" +

        currentLongitude +
        "," +
        currentLatitude +

        ";" +

        destinationLongitude +
        "," +
        destinationLatitude +

        "?overview=full&geometries=geojson";


    fetch(url)

    .then(function(response) {

        if (!response.ok) {

            throw new Error(
                "Route request failed"
            );

        }

        return response.json();

    })

    .then(function(data) {

        if (
            !data.routes ||
            data.routes.length === 0
        ) {

            document.getElementById(
                "routeResult"
            ).textContent =
                "Route not found";

            return;
        }


        const route =
            data.routes[0];


        const routeCoordinates =
            route.geometry.coordinates.map(
                function(point) {

                    return {

                        lat:
                            point[1],

                        lng:
                            point[0]

                    };

                }
            );


        // Remove previous route

        if (routePolyline) {

            routePolyline.setMap(
                null
            );

        }


        // Draw route

        routePolyline =
            new google.maps.Polyline({

                path:
                    routeCoordinates,

                map:
                    map,

                strokeOpacity:
                    1,

                strokeWeight:
                    5

            });


        // Distance in KM

        const distance =
            route.distance / 1000;


        // Time in minutes

        const duration =
            route.duration / 60;


        document.getElementById(
            "routeResult"
        ).innerHTML =

            "<strong>Destination:</strong> " +
            destinationName +

            "<br>" +

            "<strong>Distance:</strong> " +
            distance.toFixed(2) +
            " KM" +

            "<br>" +

            "<strong>Estimated Time:</strong> " +
            Math.round(duration) +
            " minutes";


        // Fit complete route on map

        const bounds =
            new google.maps.LatLngBounds();


        routeCoordinates.forEach(
            function(point) {

                bounds.extend(
                    point
                );

            }
        );


        map.fitBounds(
            bounds
        );

    })

    .catch(function(error) {

        console.log(
            "Route Error:",
            error
        );


        document.getElementById(
            "routeResult"
        ).textContent =
            "Unable to find route";

    });

}


function searchRouteDestination() {

    const address =
        document.getElementById(
            "routeSearchInput"
        ).value;


    if (address.trim() === "") {

        alert(
            "Please enter a destination"
        );

        return;
    }


    document.getElementById(
        "routeSearchResult"
    ).textContent =
        "Searching destination...";


    const url =
        "https://nominatim.openstreetmap.org/search" +
        "?format=json" +
        "&limit=1" +
        "&q=" +
        encodeURIComponent(address);


    fetch(url)

    .then(function(response) {

        if (!response.ok) {

            throw new Error(
                "Unable to search destination"
            );

        }

        return response.json();

    })

    .then(function(data) {

        if (data.length === 0) {

            document.getElementById(
                "routeSearchResult"
            ).textContent =
                "Destination not found";

            return;
        }


        routeDestinationLatitude =
            parseFloat(
                data[0].lat
            );


        routeDestinationLongitude =
            parseFloat(
                data[0].lon
            );


        routeDestinationName =
            data[0].display_name;


        const position = {

            lat:
                routeDestinationLatitude,

            lng:
                routeDestinationLongitude

        };


        // Remove previous searched
        // destination marker

        if (routeDestinationMarker) {

            routeDestinationMarker.setMap(
                null
            );

        }


        // Add destination marker

        routeDestinationMarker =
            new google.maps.Marker({

                position:
                    position,

                map:
                    map,

                title:
                    routeDestinationName

            });


        map.setCenter(
            position
        );


        map.setZoom(
            15
        );


        document.getElementById(
            "routeSearchResult"
        ).textContent =
            routeDestinationName;

    })

    .catch(function(error) {

        console.log(
            "Destination Search Error:",
            error
        );


        document.getElementById(
            "routeSearchResult"
        ).textContent =
            "Unable to search destination";

    });

}


function clearRoute() {

    // Remove route line

    if (routePolyline) {

        routePolyline.setMap(
            null
        );

        routePolyline = null;

    }


    // Remove searched destination marker

    if (routeDestinationMarker) {

        routeDestinationMarker.setMap(
            null
        );

        routeDestinationMarker = null;

    }


    routeDestinationLatitude =
        null;

    routeDestinationLongitude =
        null;

    routeDestinationName =
        null;


    document.getElementById(
        "routeResult"
    ).textContent = "";


    document.getElementById(
        "routeSearchResult"
    ).textContent = "";

    document.getElementById(
    "routeSearchInput"
).value = "";

}


function changeRouteDestinationType() {

    const destinationType =
        document.getElementById(
            "routeDestinationType"
        ).value;

    const savedSection =
        document.getElementById(
            "savedRouteSection"
        );

    const searchSection =
        document.getElementById(
            "searchRouteSection"
        );

    if (destinationType === "saved") {

        savedSection.style.display = "block";
        searchSection.style.display = "none";

    } else {

        savedSection.style.display = "none";
        searchSection.style.display = "block";

    }
}
