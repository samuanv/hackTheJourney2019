import React from "react";

  //define consts for our app
const apiKey = '2ZIvXogrvo6X1mK16yreIt6zX6Ad9eLEFY_WgVWyAA0';

const charity = 'https://cdn3.iconfinder.com/data/icons/flat-pro-basic-set-1-1/32/location-green-64.png';
const restaurant = 'https://cdn2.iconfinder.com/data/icons/places-4/100/food_place_marker_location_restaurant_eat_fork_knife-64.png'
const bar = 'https://cdn2.iconfinder.com/data/icons/places-4/100/drink_place_marker_location_bar_coctail_party-64.png'
const sagradaFamilia = 'https://cdn0.iconfinder.com/data/icons/famous-buildings-landmarks-volume-2/500/Sagrada_Familia-64.png';
const locations = [
    // {
    //   url: restaurant,
    //   coord: {lat:41.4034, lng:2.15444}
    // // },{
    //   url: bar,
    //   coord: {lat:41.4034, lng:2.16444}
    // },
    {
      url: sagradaFamilia,
      coord: {lat:41.4034, lng:2.17444}
    },
    {
      url: restaurant,
      coord: {lat:41.31567, lng:2.05724}
    },{
      url: bar,
      coord: {lat:41.31567, lng:2.08481}
    },{
      url: restaurant,
      coord: {lat:41.37653, lng:2.15324}
    },
    {
      url: charity,
      coord: {lat:41.3275, lng:2.0979}
    },{
      url: charity,
      coord: {lat:41.3482, lng:2.1228}
    },{
      url: charity,
      coord: {lat:41.3601, lng:2.0786}
    },
];

class Map extends React.Component {
  state = {
    map: null,
    platform: null
  }
  constructor(props) {
    super(props);
  }

  loadMap(isolineParams) {
    var platform = new window.H.service.Platform({
      apikey: apiKey
    });
    // Obtain the default map types from the platform object:
    var defaultLayers = platform.createDefaultLayers();

    // Instantiate (and display) a map object:
    var map = new window.H.Map(
      document.getElementById("mapContainer"),
      defaultLayers.vector.normal.map,
      {
        zoom: 10,
        center: { lat: 41.3851, lng: 2.1734 }
      }
    );

    window.addEventListener("resize", () => map.getViewPort().resize());

    // Add map events functionality to the map
    var mapEvents = new window.H.mapevents.MapEvents(map);

    // Add behavior to the map: panning, zooming, dragging.
    var behavior = new window.H.mapevents.Behavior(mapEvents);

    // set map dark style
    this.setStyle(map);

    this.setState({map, platform})
  }

  setStyle(map){
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

  addIsoline(funTime, map, platform){
    var onResult = function(result) {
      var center = new window.H.geo.Point(
          result.response.center.latitude,
          result.response.center.longitude
        ),
        isolineCoords = result.response.isoline[0].component[0].shape,
        linestring = new window.H.geo.LineString(),
        isolinePolygon,
        isolineCenter;

      // Add the returned isoline coordinates to a linestring:
      isolineCoords.forEach(function(coords) {
        linestring.pushLatLngAlt.apply(linestring, coords.split(","));
      });

      // Create a polygon and a marker representing the isoline:
      isolinePolygon = new window.H.map.Polygon(linestring);

      var icon = new window.H.map.Icon('https://cdn2.iconfinder.com/data/icons/location-map-simplicity/512/airport-64.png');
      isolineCenter = new window.H.map.Marker(center, {icon:icon} );

      // Add the polygon and marker to the map:
      map.addObjects([isolineCenter, isolinePolygon]);

      // Center and zoom the map so that the whole isoline polygon is
      // in the viewport:
      map
        .getViewModel()
        .setLookAtData({ bounds: isolinePolygon.getBoundingBox() });

        locations.forEach(function(item){
          var markerIcon = new window.H.map.Icon(item.url);
            map.addObject(new window.H.map.Marker(item.coord, {icon: markerIcon}));
          });    };

          var isolineParams = {
      mode: "fastest;truck;",
      start: "geo!41.2974,2.0833",
      range: parseInt(funTime),
      rangetype: "time"
    };
    // Get an instance of the routing service:
    var router = platform.getRoutingService();

    router.calculateIsoline(isolineParams, onResult, function(error) {
      alert(error.message);
    });
  }


  componentDidMount() {
      this.loadMap();
  }

  componentDidUpdate() {
    if (!this.props.funTime) {
      return
    }
    this.addIsoline(((this.props.funTime*60)/3), this.state.map, this.state.platform);
  }

  render() {
      console.log(this.props.funTime)
    return <div style={{width: '100%', height: '800px'}} id="mapContainer"></div>;
  }
}

export default Map;
