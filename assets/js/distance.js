let radiusCircle;

function calculateDistance(lat1, lng1, lat2, lng2) {

    const earthRadius = 6371;

    const latDifference =
        (lat2 - lat1) * Math.PI / 180;

    const lngDifference =
        (lng2 - lng1) * Math.PI / 180;


    const a =
        Math.sin(latDifference / 2) *
        Math.sin(latDifference / 2) +

        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *

        Math.sin(lngDifference / 2) *
        Math.sin(lngDifference / 2);


    const c =
        2 * Math.atan2(
            Math.sqrt(a),
            Math.sqrt(1 - a)
        );


    const distance =
        earthRadius * c;


    return distance;
}

function findNearestLocation() {

    if (
        currentLatitude === null ||
        currentLongitude === null
    ) {

        alert("Please get your current location first");

        return;
    }


    if (locations.length === 0) {

        alert("No saved locations found");

        return;
    }


    let nearestLocation = null;

    let nearestDistance = Infinity;


    locations.forEach(function(location) {

        const distance =
            calculateDistance(

                currentLatitude,
                currentLongitude,

                location.latitude,
                location.longitude

            );


        if (distance < nearestDistance) {

            nearestDistance = distance;

            nearestLocation = location;

        }

    });


    document.getElementById("nearestResult").innerHTML =

        "<strong>Nearest Location:</strong> " +
        nearestLocation.name +

        "<br>" +

        "<strong>Category:</strong> " +
        nearestLocation.category +

        "<br>" +

        "<strong>Address:</strong> " +
        nearestLocation.address +

        "<br>" +

        "<strong>Distance:</strong> " +
        nearestDistance.toFixed(2) +
        " km";


    const nearestPosition = {

        lat: nearestLocation.latitude,

        lng: nearestLocation.longitude

    };


    map.setCenter(nearestPosition);

    map.setZoom(15);

}


function findLocationsInRadius() {

    if (
        currentLatitude === null ||
        currentLongitude === null
    ) {

        alert("Please get your current location first");

        return;
    }


    const radius =
        parseFloat(
            document.getElementById("radius").value
        );


    const center = {

        lat: currentLatitude,
        lng: currentLongitude

    };


    if (radiusCircle) {

        radiusCircle.setMap(null);

    }


    radiusCircle =
        new google.maps.Circle({

            map: map,

            center: center,

            radius: radius * 1000,

            fillOpacity: 0.15,

            strokeOpacity: 0.8,

            strokeWeight: 2

        });


    let locationsInside = [];


    locations.forEach(function(location) {

        const distance =
            calculateDistance(

                currentLatitude,
                currentLongitude,

                location.latitude,
                location.longitude

            );


        if (distance <= radius) {

            locationsInside.push({

                location: location,

                distance: distance

            });

        }

    });


    let output =

        "<strong>Locations within " +
        radius +
        " KM:</strong><br><br>";


    if (locationsInside.length === 0) {

        output +=
            "No locations found inside this radius";

    } else {

        locationsInside.forEach(function(item) {

            output +=

                item.location.name + " - " +
                item.location.category + " - " +

                item.distance.toFixed(2) +

                " KM<br>";

        });

    }


    document.getElementById(
        "radiusResult"
    ).innerHTML = output;


    map.fitBounds(
        radiusCircle.getBounds()
    );

}

function findLocationsAroundSearch() {

    if (
        searchLatitude === null ||
        searchLongitude === null
    ) {

        alert("Please search an address first");

        return;
    }


    const radius =
        parseFloat(
            document.getElementById("radius").value
        );


    const center = {

        lat: searchLatitude,
        lng: searchLongitude

    };


    if (radiusCircle) {

        radiusCircle.setMap(null);

    }


    radiusCircle =
        new google.maps.Circle({

            map: map,

            center: center,

            radius: radius * 1000,

            fillOpacity: 0.15,

            strokeOpacity: 0.8,

            strokeWeight: 2

        });


    let locationsInside = [];


    locations.forEach(function(location) {

        const distance =
            calculateDistance(

                searchLatitude,
                searchLongitude,

                location.latitude,
                location.longitude

            );


        if (distance <= radius) {

            locationsInside.push({

                location: location,
                distance: distance

            });

        }

    });


    let output =

        "<strong>Locations within " +
        radius +
        " KM of searched address:</strong><br><br>";


    if (locationsInside.length === 0) {

        output +=
            "No saved locations found";

    } else {

        locationsInside.forEach(function(item) {

            output +=

                item.location.name +

                " - " +

                item.location.category +

                " - " +

                item.distance.toFixed(2) +

                " KM<br>";

        });

    }


    document.getElementById(
        "radiusResult"
    ).innerHTML = output;


    map.fitBounds(
        radiusCircle.getBounds()
    );

}
