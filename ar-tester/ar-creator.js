


mapboxgl.accessToken = 'pk.eyJ1Ijoic2ptYXJzaGFsbHVrIiwiYSI6ImNpeDBleG1hdjAwNGEyenBoODAxODRxeGkifQ.tad1YtixbGXoQGGF_Z84Ng';
var map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: [-0.93875203281641,51.005568447565174],
  zoom: 18
});


getLocation();

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);

    
  } else {
    console.log("Geolocation is not supported by this browser.");
  }
}

function showPosition(position) {
  map.flyTo({ center: [position.coords.longitude, position.coords.latitude] });
}
 
var draw = new MapboxDraw({
displayControlsDefault: false,
controls: {
line_string: true,
trash: true
}
});
map.addControl(draw);

map.on('draw.create', updateArea);
map.on('draw.delete', updateArea);
map.on('draw.update', updateArea);

function updateArea(e) {
  var route = draw.getAll();
  renderPlaces(route);
  console.log(route);
}




var arrowsBtn = document.getElementById('arrows-btn');
arrowsBtn.addEventListener('click', function () {
  window.location.href = 'simple-static-viewer.html';
})

var pathBtn = document.getElementById('path-btn');
pathBtn.addEventListener('click', function () {
  window.location.href = 'simple-static-viewer.html';
})

/*
var checkBtn = document.getElementById('checkbtn');
checkBtn.addEventListener('click', function () {
  var code = localStorage.getItem("code");
  console.log(code)
})
*/


/*

            var route = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            -0.9389340877532959,
            51.00544819406518
          ],
          [
            -0.9402644634246827,
            51.00611992190385
          ],
          [
            -0.9403073787689209,
            51.00601528152339
          ],
          [
            -0.9404683113098143,
            51.00551232930397
          ],
          [
            -0.9407418966293336,
            51.00449965728553
          ],
          [
            -0.9408921003341675,
            51.00452666215957
          ],
          [
            -0.9408974647521973,
            51.004479403619676
          ],
          [
            -0.9409403800964355,
            51.004384886395414
          ],
          [
            -0.9419757127761841,
            51.00450978411512
          ],
          [
            -0.9433597326278687,
            51.004607676687414
          ],
          [
            -0.943375825881958,
            51.00446927678342
          ]
        ]
      }
    }
  ]
}
*/





function renderPlaces(route) {
  let scene = document.querySelector('a-scene');





  var arPathPoints = {
    "type":"FeatureCollection",
    "features":[]
  };

  var routeLength = turf.length(route.features[0], {units: 'kilometers'});
  var options = {units: 'kilometers'};
  var lengthMetres = routeLength * 1000;

  var i;
  for (i = 0; i < lengthMetres; i++) {
    var distanceAlong = i * 0.001;
    var along = turf.along(route.features[0], distanceAlong, options);
    arPathPoints.features.push(along)

    if (i === lengthMetres || i > lengthMetres) {
      //console.log(arPathPoints)
    }
  }

  for(i=0; i < arPathPoints.features.length; i++) {









    let latitude = arPathPoints.features[i].geometry.coordinates[1];
    let longitude = arPathPoints.features[i].geometry.coordinates[0];
    var latlng = "latitude: " + String(latitude) + ";longitude: " + String(longitude);

    let model = document.createElement('a-entity');

    model.setAttribute('gltf-model', './arrows.gltf');
    model.setAttribute("gps-entity-place", latlng);
    
    model.setAttribute("color", "#4CC3D9");
    model.setAttribute('scale', '0.5 0.5 0.5');


    model.addEventListener('loaded', () => {
        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
    });

    scene.appendChild(model);


  };




  var html = document.getElementById('content').innerHTML;
  console.log(html);


  function htmlToText(html) {
      var temp = document.getElementById('content');
      temp.innerHTML = html;
      return temp; // Or return temp.innerText if you need to return only visible text. It's slower.
  }


  if (typeof(Storage) !== "undefined") {
    localStorage.setItem("code", html);
  } else {
    // Sorry! No Web Storage support..
  }





}




function arrows() {
    route.features[0].geometry.coordinates.forEach(function(turn,index) {
    let latitude = turn[1];
    let longitude = turn[0];


    

    /*
    var thisPoint = turf.point([route.features[0].geometry.coordinates[in], route.features[0].geometry.coordinates]);
    var nextPoint = turf.point([turn[0], turn[1]]);



    
    */


    var latlng = "latitude: " + String(turn[1]) + ";longitude: " + String(turn[0]);

    let model = document.createElement('a-entity');
    //model.setAttribute('gps-entity-place', `latitude: ${latitude}; longitude: ${longitude};`);

    /*
    model.setAttribute('gltf-model', './assets/magnemite/scene.gltf');
    model.setAttribute('rotation', '0 180 0');
    model.setAttribute('animation-mixer', '');
    model.setAttribute('scale', '0.5 0.5 0.5');
    model.addEventListener('loaded', () => {
        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
    });
    */


    if (index < route.features[0].geometry.coordinates.length - 1) {
      var thisCoords = route.features[0].geometry.coordinates[index];
      var thisPoint = turf.point(thisCoords);

      var next = route.features[0].geometry.coordinates[index + 1];
      console.log(next)
      var nextPoint = turf.point(next);

      var bearing = turf.bearing(thisPoint, nextPoint);
      

      model.setAttribute("rotation", '0 ' + bearing + ' 0');
    }

    model.setAttribute('gltf-model', './arrows.gltf');
    model.setAttribute("gps-entity-place", latlng);
    
    model.setAttribute("color", "#4CC3D9");
    model.setAttribute('scale', '0.5 0.5 0.5');


    model.addEventListener('loaded', () => {
        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
    });

    scene.appendChild(model);

  })


  var html = document.getElementById('content').innerHTML;
  console.log(html);


  function htmlToText(html) {
      var temp = document.getElementById('content');
      temp.innerHTML = html;
      return temp; // Or return temp.innerText if you need to return only visible text. It's slower.
  }


  if (typeof(Storage) !== "undefined") {
    localStorage.setItem("code", html);
  } else {
    // Sorry! No Web Storage support..
  }

}


            
