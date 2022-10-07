// Create the map, centering on the contiguous US
var myMap = L.map("map", {
  center: [39.8283, -98.5795],
  zoom: 5
});

// Create a function to assign a color based on the depth of the earthquake.
// Code adapted from https://leafletjs.com/examples/choropleth/
// Colors selected from https://colorbrewer2.org/#type=diverging&scheme=RdYlGn&n=9
function getColor(d) {
  return d > 90 ? '#d73027' :
         d > 70 ? '#f46d43' :
         d > 50 ? '#fdae61' :
         d > 30 ? '#fee08b' :
         d > 10 ? '#ffffbf' :
         d > -10 ? '#d9ef8b' :
                  '#a6d96a';
}

// Add a legend to the map for the depth colorscale.
// Code adapted from https://leafletjs.com/examples/choropleth/
var legend = L.control({position: 'bottomright'});
legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];
    // loop through the depth intervals and generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};
legend.addTo(myMap);

// Add the tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// Create a variable for the USGS URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

// Read the URL and create a function to loop through each earthquake entry
d3.json(url).then(function (response) {

  // console.log(response.features[0].geometry);
  for (var i = 0; i < response.features.length; i++) {
    var location = response.features[i].geometry;
    var magnitude = response.features[i].properties.mag;
    var place = response.features[i].properties.place
    var time = response.features[i].properties.time

    // console.log(location);
    // Add circles for each earthquake, using the depth to determine the color and the magnitude to determine radius
    if (location) {
      L.circleMarker([location.coordinates[1], location.coordinates[0]], {
        fillOpacity: 1.0,
        color: "black",
        weight: 0.5,
        fillColor: getColor(location.coordinates[2]),
        radius: Math.sqrt(magnitude) * 5
      }).bindPopup(`<h3>${place}</h3><hr><p>${new Date(time)}\n<p>Magnitude: ${magnitude}\n<p>Depth: 
                    ${location.coordinates[2]}`).addTo(myMap);
    };
  };
});

// Create a style for the tectonic plates portion of the map
var mapStyle = {
  color: "orange",
  fillOpacity: 0
};

// Create a variable for the tectonic plates URL
var platesUrl = 'https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_plates.json'

// Read through the URL and add the geojson info to the map
d3.json(platesUrl).then(function (response) {
  L.geoJSON(response, {
    style: mapStyle
  }).addTo(myMap);
});