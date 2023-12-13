mapboxgl.accessToken = tokenMapbox;
var map = new mapboxgl.Map({
  container: 'mapa',
  style: 'mapbox://styles/mapbox/streets-v9',
  zoom: 7,
  center: [-78.887292, -2.869988]
});

// disable map zoom when using scroll
//map.scrollZoom.disable();

var geolocate = new mapboxgl.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: true
  },
  trackUserLocation: true,
  fitBoundsOptions: {
    maxZoom: 7
  },
  showUserLocation: true
});

// Add geolocate control to the map.
map.addControl(geolocate, 'top-left');

setTimeout(function() {
  geolocate.trigger();
}, 2000);

var tiposLocalidad = [];
map.on('load', function () {

  var toggleableLayerIds = [ 'cajeros', 'oficinas', 'corresponsales' ];

  for (var i = 0; i < toggleableLayerIds.length; i++) {
    var id = toggleableLayerIds[i];

    var link = document.createElement('a');
    link.href = '#';
    link.className = 'active ' + id;
    link.textContent = id;

    link.onclick = clickLayer;

    var layers = document.getElementById('menu');
    layers.appendChild(link);
    tiposLocalidad.push(id);
  }

  function clickLayer (e) {
    var clickedLayer = this.textContent;
    e.preventDefault();
    e.stopPropagation();

    var visibility = map.getLayoutProperty(clickedLayer, 'visibility');

    var ciudadVisible = $('#ciudad').find("option:selected");
    var nombreCiudadVisible = ciudadVisible.text();

    if (visibility === 'visible') {
      map.setLayoutProperty(clickedLayer, 'visibility', 'none');
      this.className = '';

      //oculta las localidades que sean del tipo de localidad que se desactivo
      $('.item-localidad').filter(function() {
        return $(this).data('tipo') == clickedLayer;
      }).hide();
      tiposLocalidad.splice(tiposLocalidad.indexOf(clickedLayer), 1);

    } else {
      this.className = 'active ' + clickedLayer;
      map.setLayoutProperty(clickedLayer, 'visibility', 'visible');

      //muestra las localidades de una ciudad y que sean del tipo de la localidad que este activa
      $('.item-localidad').filter(function() {
        if (nombreCiudadVisible != '') {
          return $(this).data('tipo') == clickedLayer && $(this).data('ciudad') == nombreCiudadVisible;
        } else {
          return $(this).data('tipo') == clickedLayer;
        }
      }).show();
      tiposLocalidad.push(clickedLayer);
    }
  };

  // When a click event occurs on a feature in the places layer, open a popup at the
  // location of the feature, with description HTML from its properties.
  function clickMarker(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;

    // Ensure that if the map is zoomed out such that multiple
    // copies of the feature are visible, the popup appears
    // over the copy being pointed to.
    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      var coorValue = -360;
      if (e.lngLat.lng > coordinates[0]) {
        coorValue = 360;
      }

      coordinates[0] += coorValue;
    }

    new mapboxgl.Popup()
      .setLngLat(coordinates)
      .setHTML(description)
      .addTo(map);

    map.flyTo({center: e.features[0].geometry.coordinates, speed: 0.2});
  }

  // Change the cursor to a pointer when the mouse is over the places layer.
  function mouseEnterMarker() {
    map.getCanvas().style.cursor = 'pointer';
  }

  // Change it back to a pointer when it leaves.
  function mouseLeaveMarker() {
    map.getCanvas().style.cursor = '';
  }

  // Cajeros
  var cajerosGeoJson = cajeros.map(function(cajero) {
    return {
      type: 'Feature',
      properties: {
        description: '<strong>Cajero - ' + cajero.titulo + ' - ' + cajero.ciudad + '</strong><p>' + cajero.direccion + '</p><p>' + cajero.descripcion + '</p>'
      },
      geometry: {
        type: 'Point',
        coordinates: [cajero.longitud, cajero.latitud]
      }
    };
  });

  // Oficinas
  var oficinasGeoJson = oficinas.map(function(oficina) {
    return {
      type: 'Feature',
      properties: {
        description: '<strong>Oficina - ' + oficina.titulo + ' - ' + oficina.ciudad + '</strong><p>' + oficina.direccion + '</p><p>' + oficina.descripcion + '</p>'
      },
      geometry: {
        type: 'Point',
        coordinates: [oficina.longitud, oficina.latitud]
      }
    };
  });

  // Corresponsales
  var corresponsalesGeoJson = corresponsales.map(function(corresponsal) {
    return {
      type: 'Feature',
      properties: {
        description: '<strong> Corresponsal - ' + corresponsal.titulo + ' - ' + corresponsal.ciudad + '</strong><p>' + corresponsal.direccion + '</p><p>' + corresponsal.descripcion + '</p>'
      },
      geometry: {
        type: 'Point',
        coordinates: [corresponsal.longitud, corresponsal.latitud]
      }
    };
  });

  // Agregar layer para mostrar cajeros.
  map.addLayer({
    "id": "cajeros",
    "type": "circle",
    "source": {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": cajerosGeoJson
      }
    },
    "paint": {
      "circle-radius": 8,
      "circle-color": "#04bb50"
    }
  });

  // Agregar layer para mostrar oficinas.
  map.addLayer({
    "id": "oficinas",
    "type": "circle",
    "source": {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": oficinasGeoJson
      }
    },
    "paint": {
      "circle-radius": 8,
      "circle-color": "#f9ea4f"
    }
  });

  // Agregar layer para mostrar corresponsales.
  map.addLayer({
    "id": "corresponsales",
    "type": "circle",
    "source": {
      "type": "geojson",
      "data": {
        "type": "FeatureCollection",
        "features": corresponsalesGeoJson
      }
    },
    "paint": {
      "circle-radius": 8,
      "circle-color": "#0E9EEB"
    }
  });

  map.on('click', 'cajeros', clickMarker);
  map.on('mouseenter', 'cajeros', mouseEnterMarker);
  map.on('mouseleave', 'cajeros', mouseLeaveMarker);

  map.on('click', 'oficinas', clickMarker);
  map.on('mouseenter', 'oficinas', mouseEnterMarker);
  map.on('mouseleave', 'oficinas', mouseLeaveMarker);

  map.on('click', 'corresponsales', clickMarker);
  map.on('mouseenter', 'corresponsales', mouseEnterMarker);
  map.on('mouseleave', 'corresponsales', mouseLeaveMarker);
});

var mapboxClient = mapboxSdk({ accessToken: mapboxgl.accessToken });

$(document).on('change', '#ciudad', function() {
  var index = $(this).val();
  var ciudad = $(this).find("option:selected");

  var nombrePais = 'Ecuador';
  var nombreProvincia = index === '' ? 'Azuay' : ciudad.parent().attr('label');
  var nombreCiudad = index === '' ? 'Cuenca' : ciudad.text();
  
  //oculta todas las localidades
  $('.item-localidad').hide();
  //muestra las localidades de una ciudad y que sean del tipo de localidad que este activa
  $('.item-localidad').filter(function() {
    if (index != '') {
      return $(this).data('ciudad') == nombreCiudad && (tiposLocalidad.indexOf($(this).data('tipo')) > -1);
    } else {
      return (tiposLocalidad.indexOf($(this).data('tipo')) > -1);
    }
    
  }).show();

  var zoom = index === '' ? 7 : 10;

  mapboxClient.geocoding.forwardGeocode({
    query: nombrePais + ' ' + nombreProvincia + ' ' + nombreCiudad,
    autocomplete: false,
    limit: 1
  })
    .send()
    .then(function (response) {
      if (response && response.body && response.body.features && response.body.features.length) {
        var feature = response.body.features[0];
        map.flyTo({
          center: feature.center,
          zoom: zoom
        });
      }
    });
});
