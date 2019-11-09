import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import { PrimaryButton } from 'office-ui-fabric-react/lib/Button';
import { DefaultButton, Callout, Link, getTheme, FontWeights, mergeStyleSets, getId } from 'office-ui-fabric-react';

function App() {

  //define consts for our app
  const apiKey = '2ZIvXogrvo6X1mK16yreIt6zX6Ad9eLEFY_WgVWyAA0';
  const locations = [
    {lat:41.4034, lng:2.15444},
    {lat:41.4034, lng:2.16444},
    {lat:41.4034, lng:2.17444}
  ];

  function setStyle(map){
    // get the vector provider from the base layer
    var provider = map.getBaseLayer().getProvider();
    // Create the style object from the YAML configuration.
    // First argument is the style path and the second is the base URL to use for
    // resolving relative URLs in the style like textures, fonts.
    // all referenced resources relative to the base path https://js.api.here.com/v3/3.1/styles/omv.
    var style = new window.H.map.Style('https://heremaps.github.io/maps-api-for-javascript-examples/change-style-at-load/data/dark.yaml',
      'https://js.api.here.com/v3/3.1/styles/omv/');
    // set the style on the existing layer
    provider.setStyle(style);
  }


  function addMarkersToMap(map) {
    locations.forEach(function(item){
      map.addObject(new window.H.map.Marker(item));
    });
}

  function loadMap() {
    var platform = new window.H.service.Platform({
      'apikey': apiKey
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

    window.addEventListener('resize', () => map.getViewPort().resize());
    // var behavior = new window.H.mapevents.Behavior(new window.H.mapevents.MapEvents(map));

    // Add map events functionality to the map
    var mapEvents = new window.H.mapevents.MapEvents(map);

    // Add behavior to the map: panning, zooming, dragging.
    var behavior = new window.H.mapevents.Behavior(mapEvents);

    // set map dark style
    setStyle(map);

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
    // var icon = new window.H.map.Icon('airport-icon.png');
    isolineCenter = new window.H.map.Marker(center);

    // Add the polygon and marker to the map:
    map.addObjects([isolineCenter, isolinePolygon]);

    // Center and zoom the map so that the whole isoline polygon is
  // in the viewport:
  map.getViewModel().setLookAtData({bounds: isolinePolygon.getBoundingBox()});
  
  addMarkersToMap(map);
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

  const activityFilterBoxes = [
    { name: 'Points of Interest',
      key: 'checkbox1',
    },
    { name: 'Restaurants',
      key: 'checkbox2',
    },
    { name: 'Charities',
      key: 'checkbox3',
    },
  ]

  function handleInputChange(event) {
    const target = event.target;
    const value = target.type = 'checkbox' ? target.checked : target.value;
    const name = target.name
  }
     
  return (
    <div className="App">
      <div style={{width: '100%', height: '800px'}} id="mapContainer">
      <div style={{width: '200px', height: '200px'}}>
      {activityFilterBoxes.map( item => (
       <label>
         {item.name}
         <input
       name={item.name}
       type='checkbox'
      //  onChange= {this.handleInputChange}
       ></input>
       </label>
      ))}
    </div>
      </div>
    </div>
  );
}

export default App;
