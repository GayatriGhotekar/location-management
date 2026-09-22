let currentLocationMarker;
let currentLatitude = null;
let currentLongitude = null;

function getCurrentLocation() {

    if (!navigator.geolocation) {

        alert("Geolocation is not supported by your browser");

        return;
    }


    navigator.geolocation.getCurrentPosition(

        function(position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            currentLatitude = latitude;
            currentLongitude = longitude;

            const currentLocation = {

                lat: latitude,
                lng: longitude

            };


            document.getElementById("currentLocation").innerHTML =
                "Latitude: " + latitude +
                "<br>Longitude: " + longitude;


            map.setCenter(currentLocation);

            map.setZoom(16);


            if (currentLocationMarker) {

                currentLocationMarker.setMap(null);

            }


            currentLocationMarker =
                new google.maps.Marker({

                    position: currentLocation,

                    map: map,

                    title: "My Current Location"

                });

        },


        function(error) {

            alert(
                "Unable to get current location: " +
                error.message
            );

        }

    );

}
