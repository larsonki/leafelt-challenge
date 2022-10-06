var myMap = L.map("map", {
    center: [39.8283, -98.5795],
    zoom: 5
  });

  // Create a function to assign a color based on the depth of the earthquake.
  // Code adapted from https://leafletjs.com/examples/choropleth/
  function getColor(d) {
  return d > 90 ? '#d73027' :
         d > 70 ? '#f46d43' :
         d > 50 ? '#fdae61' :
         d > 30 ? '#fee08b' :
         d > 10 ? '#ffffbf' :
         d > -10 ? '#d9ef8b' :
                  '#a6d96a';
}
  
  // Adding the tile layer
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(myMap);
  
  var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";
  
  d3.json(url).then(function(response) {
  
    // console.log(response.features[0].geometry);
 
    // i < response.features.length
    
    for (var i = 0; i < response.features.length; i++) {
      var location = response.features[i].geometry;
      var magnitude = response.features[i].properties.mag;

      // console.log(location);
  
      if (location) {
        L.circleMarker([location.coordinates[1], location.coordinates[0]], {
          fillOpacity: 1.0,
          color: "black",
          weight: 0.5,
          fillColor: getColor(location.coordinates[2]),
          radius: Math.sqrt(magnitude) * 5     
        }).addTo(myMap);
        // console.log(color)
      };
    };
  });
// var geojsonMarker = {
//     radius: location.coordinates[2],
//     fillColor: "#ff7800",
//     color: "#000",
//     weight: 1,
//     opacity: 1,
//     fillOpacity: 0.8
// };

// L.geoJSON(someGeojsonFeature, {
//     pointToLayer: function (feature, latlng) {
//         return L.circleMarker(latlng, geojsonMarkerOptions);
//     }
// }).addTo(map);




