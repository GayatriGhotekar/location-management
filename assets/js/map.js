let map;

function initMap() {

    const initialLocation = {
        lat: 19.9975,
        lng: 73.7898
    };


    map = new google.maps.Map(
        document.getElementById("map"),
        {
            center: initialLocation,
            zoom: 12
        }
    );



    locations.forEach(function(location) {

        const marker = new google.maps.Marker({

            position: {
                lat: location.latitude,
                lng: location.longitude
            },

            map: null,

            title: location.name

        });

        clusterMarkers.push(marker);


        locationMarkers.push({
            marker: marker,
            category: location.category
        });


        const infoWindow =
            new google.maps.InfoWindow({

                content:
                    "<h3>" + location.name + "</h3>" +
                    "<p>" + location.address + "</p>" +
                    "<p>Category: " + location.category + "</p>"

            });


        marker.addListener("click", function() {

            infoWindow.open({
                anchor: marker,
                map: map
            });

        });

    });

    markerCluster =
    new markerClusterer.MarkerClusterer({

        map: map,

        markers: []

    });

    loadSavedPolygons();

}
