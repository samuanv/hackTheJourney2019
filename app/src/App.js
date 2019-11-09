import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  function loadMap() {
    console.log('window.H where are you', window.H);
  var platform = new window.H.service.Platform({
    'apikey': '2ZIvXogrvo6X1mK16yreIt6zX6Ad9eLEFY_WgVWyAA0'
  });
    // Obtain the default map types from the platform object:
  var defaultLayers = platform.createDefaultLayers();

  // Instantiate (and display) a map object:
  var map = new window.H.Map(
    document.getElementById('mapContainer'),
    defaultLayers.vector.normal.map,
    {
      zoom: 10,
      center: { lat:41.3851, lng: 2.1734 }
    });
  console.log('map: ', map);
    var isolineParams = {
      'mode': 'fastest;car;',
      'start': 'geo!41.2974,2.0833',
      'range': '10800',
      'rangetype': 'time'
    };

    var onResult = function(result) {
      var center = new window.H.geo.Point(
        result.response.center.latitude,
        result.response.center.longitude),
      isolineCoords = result.response.isoline[0].component[0].shape,
      linestring = new window.H.geo.LineString(),
      isolinePolygon,
      isolineCenter;

    // Add the returned isoline coordinates to a linestring:
    isolineCoords.forEach(function(coords) {
    linestring.pushLatLngAlt.apply(linestring, coords.split(','));
    });

    // Create a polygon and a marker representing the isoline:
    isolinePolygon = new window.H.map.Polygon(linestring);
    isolineCenter = new window.H.map.Marker(center);

    // Add the polygon and marker to the map:
    map.addObjects([isolineCenter, isolinePolygon]);

    // Center and zoom the map so that the whole isoline polygon is
  // in the viewport:
  map.getViewModel().setLookAtData({bounds: isolinePolygon.getBoundingBox()});
};

// Get an instance of the routing service:
var router = platform.getRoutingService();
// Call the Routing API to calculate an isoline:
router.calculateIsoline(
  isolineParams,
  onResult,
  function(error) {
  alert(error.message);
  }
);

  }

  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM is ready');
    loadMap();
  });
     
  return (
    <div className="App">
      <div style={{width: '100%', height: '480px'}} id="mapContainer"></div>
    </div>
  );
}

export default App;
