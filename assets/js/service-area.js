let savedPolygons = [];

function savePolygon() {

    if (polygonPoints.length < 3) {

        alert("Please create a polygon first");

        return;
    }


    const name =
        prompt("Enter service area name");


    if (!name) {

        return;

    }


    fetch("service_areas/save.php", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({

            name: name,

            coordinates: polygonPoints

        })

    })

    .then(function(response) {

        return response.json();

    })

    .then(function(data) {

        if (data.success) {

            alert(
                "Service area saved successfully"
            );

        } else {

            alert(
                "Unable to save service area: " +
                data.message
            );

        }

    })

    .catch(function(error) {

        console.log(error);

        alert(
            "Unable to save service area"
        );

    });

}


function loadSavedPolygons() {

    fetch("service_areas/load.php")

    .then(response => response.json())

    .then(data => {

        if (!data.success) {
            return;
        }

        data.areas.forEach(function(area) {

            const polygon =
                new google.maps.Polygon({

                    paths: area.coordinates,

                    map: map,

                    strokeOpacity: 0.8,

                    strokeWeight: 2,

                    fillOpacity: 0.15

                });


            savedPolygons.push(polygon);


            const infoWindow =
                new google.maps.InfoWindow({

                    content:
                        "<h3>" + area.name + "</h3>" +
                        "<button onclick='deleteServiceArea(" +
                        area.id +
                        ")'>" +
                        "Delete Service Area" +
                        "</button>"

                });


            polygon.addListener(
                "click",
                function(event) {

                    infoWindow.setPosition(
                        event.latLng
                    );

                    infoWindow.open(map);

                }
            );

        });

    })

    .catch(function(error) {

        console.log(error);

    });

}

function deleteServiceArea(id) {

    const confirmDelete =
        confirm(
            "Are you sure you want to delete this service area?"
        );

    if (!confirmDelete) {
        return;
    }


    fetch(
        "service_areas/delete.php",
        {
            method: "POST",

            headers: {
                "Content-Type":
                    "application/json"
            },

            body: JSON.stringify({
                id: id
            })
        }
    )

    .then(response => response.json())

    .then(data => {

        if (data.success) {

            alert(
                "Service area deleted successfully"
            );

            // Remove currently displayed
            // saved polygons
            savedPolygons.forEach(
                function(polygon) {

                    polygon.setMap(null);

                }
            );


            savedPolygons = [];

            // Load remaining polygons again
            loadSavedPolygons();

        } else {

            alert(
                data.message ||
                "Unable to delete service area"
            );

        }

    })

    .catch(error => {

        console.log(error);

        alert(
            "Unable to delete service area"
        );

    });

}
