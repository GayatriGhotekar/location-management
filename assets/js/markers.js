let locationMarkers = [];
let markerCluster;
let clusterMarkers = [];

function filterMarkers() {

    const selectedCategory =
        document.getElementById(
            "categoryFilter"
        ).value;


    const visibleMarkers = [];


    locationMarkers.forEach(function(item) {

        if (
            selectedCategory === "All" ||
            item.category === selectedCategory
        ) {

            item.marker.setVisible(true);

            visibleMarkers.push(
                item.marker
            );

        } else {

            item.marker.setVisible(false);

        }

    });


    markerCluster.clearMarkers();


    markerCluster.addMarkers(
        visibleMarkers
    );

}
function clearCluster() {

    if (markerCluster) {

        markerCluster.clearMarkers();

    }


    clusterMarkers.forEach(function(marker) {

        marker.setMap(null);

    });

}

function showCluster() {

    if (markerCluster) {

        markerCluster.clearMarkers();

        clusterMarkers.forEach(function(marker) {

            marker.setVisible(true);
            marker.setMap(null);

        });

        markerCluster.addMarkers(
            clusterMarkers
        );

    }

}


function showSavedLocations() {

    // Remove markers from cluster first

    if (markerCluster) {

        markerCluster.clearMarkers();

    }


    // Show all saved locations

    locationMarkers.forEach(function(item) {

        item.marker.setVisible(true);

        item.marker.setMap(map);

    });


    // Reset filter dropdown to All

    document.getElementById(
        "categoryFilter"
    ).value = "All";

}

function hideSavedLocations() {

    locationMarkers.forEach(function(item) {

        item.marker.setMap(null);

    });


    if (markerCluster) {

        markerCluster.clearMarkers();

    }

}
