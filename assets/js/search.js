let searchMarker;
let searchLatitude = null;
let searchLongitude = null;

function searchAddress() {

    const address =
        document.getElementById("addressInput").value;

    if (address === "") {

        alert("Please enter an address");

        return;
    }


    const url =
        "https://nominatim.openstreetmap.org/search" +
        "?format=json" +
        "&limit=1" +
        "&q=" + encodeURIComponent(address);


    fetch(url)

        .then(response => response.json())

        .then(data => {

            if (data.length === 0) {

                alert("Address not found");

                return;
            }


            searchLatitude =
                parseFloat(data[0].lat);

            searchLongitude =
                parseFloat(data[0].lon);


            const location = {

                lat: searchLatitude,
                lng: searchLongitude

            };


            document.getElementById(
                "searchResult"
            ).innerHTML =

                "Address: " +
                data[0].display_name +

                "<br>Latitude: " +
                searchLatitude +

                "<br>Longitude: " +
                searchLongitude;


            map.setCenter(location);

            map.setZoom(16);


            if (searchMarker) {

                searchMarker.setMap(null);

            }


            searchMarker =
                new google.maps.Marker({

                    position: location,

                    map: map,

                    title: data[0].display_name

                });

        })

        .catch(error => {

            console.log(error);

            alert("Unable to search address");

        });

}
