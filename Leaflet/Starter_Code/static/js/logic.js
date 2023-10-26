<!DOCTYPE html>
<html>
<head>
    <title>Earthquake Visualization</title>

    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    />
    <script
      src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
    ></script>
    <style>
      
      #map {
        height: 600px;
        width: 100%;
      }
    </style>
</head>
<body>
    <div id="map"></div>

    <script>
        
        var map = L.map('map').setView([0, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        
        var earthquakeDataUrl = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson';

        
        var colors = ['#00FF00', '#FFFF00', '#FF9900', '#FF0000'];

        function getColor(depth) {
            if (depth < 30) return colors[0];
            else if (depth < 70) return colors[1];
            else if (depth < 300) return colors[2];
            else return colors[3];
        }

        var legend = L.control({ position: 'bottomright' });
        legend.onAdd = function (map) {
            var div = L.DomUtil.create('div', 'info legend');
            var labels = ['<strong>Depth</strong>'];
            var depthRanges = ['< 30 km', '30-70 km', '70-300 km', '>= 300 km'];

            for (var i = 0; i < depthRanges.length; i++) {
                div.innerHTML += labels.push(
                    '<i style="background:' + colors[i] + '"></i> ' + depthRanges[i]
                );
            }

            div.innerHTML = labels.join('<br>');
            return div;
        };
        legend.addTo(map);

        
        fetch(earthquakeDataUrl)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                L.geoJSON(data, {
                    pointToLayer: function (feature, latlng) {
                        var depth = feature.geometry.coordinates[2]; 
                        var magnitude = feature.properties.mag;

                        var markerOptions = {
                            radius: magnitude * 3, 
                            fillColor: getColor(depth),
                            color: '#000',
                            weight: 1,
                            opacity: 1,
                            fillOpacity: 0.8
                        };

                        return L.circleMarker(latlng, markerOptions);
                    },
                    onEachFeature: function (feature, layer) {
                        layer.bindPopup(
                            'Magnitude: ' + feature.properties.mag +
                            '<br>Location: ' + feature.properties.place +
                            '<br>Depth: ' + feature.geometry.coordinates[2] + ' km'
                        );
                    }
                }).addTo(map);
            });
    </script>
</body>
</html>
