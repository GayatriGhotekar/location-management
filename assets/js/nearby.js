let nearbyMarkers = [];

async function findNearbyPlaces() {

    const locationSource =
        document.getElementById(
            "nearbyLocationSource"
        ).value;


    const placeType =
        document.getElementById(
            "nearbyType"
        ).value;


    const radius = Number(
        document.getElementById(
            "nearbyRadius"
        ).value
    );


    let sourceLatitude;
    let sourceLongitude;


    // ==========================================
    // CURRENT LOCATION
    // ==========================================

    if (locationSource === "current") {

        if (
            currentLatitude === null ||
            currentLongitude === null
        ) {

            alert(
                "Please get your current location first"
            );

            return;
        }


        sourceLatitude = currentLatitude;

        sourceLongitude = currentLongitude;

    }


    // ==========================================
    // SEARCHED LOCATION
    // ==========================================

    else if (locationSource === "search") {

        if (
            searchLatitude === null ||
            searchLongitude === null
        ) {

            alert(
                "Please search an address first"
            );

            return;
        }


        sourceLatitude = searchLatitude;

        sourceLongitude = searchLongitude;

    }


    // Remove previous nearby markers

    clearNearbyPlaces();


    document.getElementById(
        "nearbyResult"
    ).innerHTML =
        "Searching nearby places...";


    // ==========================================
    // OVERPASS QUERY
    // ==========================================

    const query = `
        [out:json][timeout:25];

        nwr
        ["amenity"="${placeType}"]
        (around:${radius},${sourceLatitude},${sourceLongitude});

        out center;
    `;


    // Public OpenStreetMap Overpass instances
    // can occasionally be busy.
    // Try another free instance before
    // reporting an error.

    const overpassEndpoints = [

        "https://overpass-api.de/api/interpreter",

        "https://overpass.kumi.systems/api/interpreter",

        "https://overpass.nchc.org.tw/api/interpreter"

    ];


    let data = null;

    let lastError = null;


    // ==========================================
    // TRY OVERPASS SERVERS
    // ==========================================

    for (
        const endpoint of overpassEndpoints
    ) {

        const controller =
            new AbortController();


        const timeoutId =
            setTimeout(
                function() {

                    controller.abort();

                },
                30000
            );


        try {

            const response =
                await fetch(
                    endpoint,
                    {

                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/x-www-form-urlencoded;charset=UTF-8"

                        },

                        body:
                            "data=" +
                            encodeURIComponent(
                                query
                            ),

                        signal:
                            controller.signal

                    }
                );


            if (!response.ok) {

                throw new Error(
                    "Server returned HTTP " +
                    response.status
                );

            }


            data =
                await response.json();


            clearTimeout(
                timeoutId
            );


            break;


        } catch (error) {


            clearTimeout(
                timeoutId
            );


            lastError =
                error;


            console.warn(
                "Overpass endpoint failed:",
                endpoint,
                error
            );

        }

    }


    // ==========================================
    // ALL SERVERS FAILED
    // ==========================================

    if (data === null) {

        console.error(
            "Nearby Places Error:",
            lastError
        );


        document.getElementById(
            "nearbyResult"
        ).textContent =

            "Nearby places service is temporarily unavailable. Please wait and try again.";


        return;

    }


    // ==========================================
    // NO PLACES FOUND
    // ==========================================

    if (
        !data.elements ||
        data.elements.length === 0
    ) {

        document.getElementById(
            "nearbyResult"
        ).textContent =

            "No nearby places found in this radius";


        return;

    }


    let markerCount = 0;


    const bounds =
        new google.maps.LatLngBounds();


    // ==========================================
    // CREATE MARKERS
    // ==========================================

    data.elements.forEach(
        function(place) {

            let latitude;

            let longitude;


            // Node

            if (
                place.type === "node"
            ) {

                latitude =
                    place.lat;

                longitude =
                    place.lon;

            }


            // Way / Relation

            else if (
                place.center
            ) {

                latitude =
                    place.center.lat;

                longitude =
                    place.center.lon;

            }


            else {

                return;

            }


            // Place name

            const name =

                place.tags &&
                place.tags.name

                    ? place.tags.name

                    : "Unnamed " +
                      placeType;


            // Create marker

            const marker =
                new google.maps.Marker({

                    position: {

                        lat: latitude,

                        lng: longitude

                    },

                    map: map,

                    title: name

                });


            // ==================================
            // INFO WINDOW
            // ==================================

            const infoContent =
                document.createElement(
                    "div"
                );


            const infoName =
                document.createElement(
                    "strong"
                );


            const infoType =
                document.createElement(
                    "div"
                );


            infoName.textContent =
                name;


            infoType.textContent =
                "Type: " +
                placeType;


            infoContent.appendChild(
                infoName
            );


            infoContent.appendChild(
                infoType
            );


            const infoWindow =
                new google.maps.InfoWindow({

                    content:
                        infoContent

                });


            marker.addListener(
                "click",
                function() {

                    infoWindow.open({

                        anchor:
                            marker,

                        map:
                            map

                    });

                }
            );


            // Save marker

            nearbyMarkers.push(
                marker
            );


            // Extend map bounds

            bounds.extend(
                marker.getPosition()
            );


            markerCount++;

        }
    );


    // ==========================================
    // RESULT
    // ==========================================

    document.getElementById(
        "nearbyResult"
    ).textContent =

        markerCount +
        " nearby places found";


    // ==========================================
    // FIT MAP
    // ==========================================

    if (
        markerCount > 0
    ) {

        // IMPORTANT:
        // Use selected source location
        // instead of always current location

        bounds.extend({

            lat:
                sourceLatitude,

            lng:
                sourceLongitude

        });


        map.fitBounds(
            bounds
        );

    }

}



function clearNearbyPlaces() {

    nearbyMarkers.forEach(function(marker) {

        marker.setMap(null);

    });


    nearbyMarkers = [];


    document.getElementById(
        "nearbyResult"
    ).innerHTML = "";

}
