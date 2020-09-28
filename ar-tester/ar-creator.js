


var scene = {
  "metadata": {
    "version": 4.5,
    "type": "Object",
    "generator": "Object3D.toJSON"
  },
  "geometries": [],
  "materials": [],
  "object": {
    "uuid": "72B38E71-BB15-4D95-A014-B3F4057165E2",
    "type": "Scene",
    "name": "Scene",
    "layers": 1,
    "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
    "children": []
  }
}









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
  var center = turf.centerOfMass(route);

  renderPlaces(route,center);
  console.log(route);

  var arrowsCode = document.getElementById('arrows-code').innerHTML;
  var pathCode = document.getElementById('path-code').innerHTML;

  if (typeof(Storage) !== "undefined") {
    localStorage.setItem("arrowsCode", arrowsCode);
    localStorage.setItem("pathCode", pathCode);
  } else {
  }

  var goBtn = document.getElementById('go');
  goBtn.classList.add('show');
  goBtn.addEventListener('click', function () {
    window.location.href = 'simple-static-viewer.html';
  })
 
}




function renderPlaces(route,center) {

  var centerLng = center.geometry.coordinates[0];
  var centerLat = center.geometry.coordinates[1];

  let pathScene = document.getElementById('path-scene');

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

    model.setAttribute('gltf-model', './path.gltf');
    model.setAttribute("gps-entity-place", latlng);
    
    model.setAttribute("color", "#4CC3D9");
    model.setAttribute('scale', '0.5 0.5 0.5');


    model.addEventListener('loaded', () => {
        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
    });

    pathScene.appendChild(model);


    // threejs json
    var pointX = turf.point([longitude,centerLat]);
    var pointY = turf.point([centerLng,latitude]);
    var distanceX = turf.distance(pointX, center, {units: 'kilometers'});
    var distanceY = turf.distance(pointY, center, {units: 'kilometers'});

    var offsetX = (longitude - centerLng) * 10000;
    var offsetY = (latitude - centerLat) * 10000;

    addPath(offsetX,offsetY);



  };


  let arrowsScene = document.getElementById('arrows-scene');

  route.features[0].geometry.coordinates.forEach(function(turn,index) {
    let latitude = turn[1];
    let longitude = turn[0];


    var latlng = "latitude: " + String(turn[1]) + ";longitude: " + String(turn[0]);

    let model = document.createElement('a-entity');



    if (index < route.features[0].geometry.coordinates.length - 1) {
      var thisCoords = route.features[0].geometry.coordinates[index];
      var thisPoint = turf.point(thisCoords);

      var next = route.features[0].geometry.coordinates[index + 1];
      console.log(next)
      var nextPoint = turf.point(next);

      var bearing = turf.bearing(thisPoint, nextPoint);
      

      model.setAttribute("rotation", '0 ' + bearing + ' 0');

      // threejs json
      var pointX = turf.point([longitude,centerLat]);
      var pointY = turf.point([centerLng,latitude]);
      var distanceX = turf.distance(pointX, center, {units: 'kilometers'});
      var distanceY = turf.distance(pointY, center, {units: 'kilometers'});

      var offsetX = (thisCoords[0] - centerLng) * 10000;
      var offsetY = (thisCoords[1] - centerLat) * 10000;

      addPathPoint(offsetX,offsetY,bearing);
    }

    model.setAttribute('gltf-model', './arrows.gltf');
    model.setAttribute("gps-entity-place", latlng);
    
    model.setAttribute("color", "#4CC3D9");
    model.setAttribute('scale', '0.5 0.5 0.5');


    model.addEventListener('loaded', () => {
        window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
    });

    arrowsScene.appendChild(model);


    

  })



  document.getElementById('calculated-area').innerHTML = JSON.stringify(scene);
  

}






function addPathPoint(offsetX,offsetY) {
  var geometry =  {
      "uuid": "36726C8B-4F16-48FE-AC4B-1283EBD10588",
      "type": "BufferGeometry",
      "data": {
        "attributes": {
          "position": {
            "itemSize": 3,
            "type": "Float32Array",
            "array": [28.2843,0.857422,0,0,29.141701,0,53.357899,82.499603,0,0,135.856995,0,28.2843,164.141998,0,109.926003,82.499603,0,109.926003,82.499603,0,28.2843,0.857422,0,53.357899,82.499603,0,53.357899,82.499603,0,0,135.856995,0,109.926003,82.499603,0,53.357899,82.499603,10,0,29.141701,10,28.2843,0.857422,10,109.926003,82.499603,10,28.2843,164.141998,10,0,135.856995,10,53.357899,82.499603,10,28.2843,0.857422,10,109.926003,82.499603,10,109.926003,82.499603,10,0,135.856995,10,53.357899,82.499603,10,0,29.141701,0,28.2843,0.857422,0,0,29.141701,10,28.2843,0.857422,0,28.2843,0.857422,10,0,29.141701,10,28.2843,0.857422,0,109.926003,82.499603,0,28.2843,0.857422,10,109.926003,82.499603,0,109.926003,82.499603,10,28.2843,0.857422,10,109.926003,82.499603,0,28.2843,164.141998,0,109.926003,82.499603,10,28.2843,164.141998,0,28.2843,164.141998,10,109.926003,82.499603,10,28.2843,164.141998,0,0,135.856995,0,28.2843,164.141998,10,0,135.856995,0,0,135.856995,10,28.2843,164.141998,10,0,135.856995,0,53.357899,82.499603,0,0,135.856995,10,53.357899,82.499603,0,53.357899,82.499603,10,0,135.856995,10,53.357899,82.499603,0,0,29.141701,0,53.357899,82.499603,10,0,29.141701,0,0,29.141701,10,53.357899,82.499603,10],
            "normalized": false
          },
          "uv": {
            "itemSize": 2,
            "type": "Float32Array",
            "array": [28.2843,0.857422,0,29.141701,53.357899,82.499603,0,135.856995,28.2843,164.141998,109.926003,82.499603,109.926003,82.499603,28.2843,0.857422,53.357899,82.499603,53.357899,82.499603,0,135.856995,109.926003,82.499603,53.357899,82.499603,0,29.141701,28.2843,0.857422,109.926003,82.499603,28.2843,164.141998,0,135.856995,53.357899,82.499603,28.2843,0.857422,109.926003,82.499603,109.926003,82.499603,0,135.856995,53.357899,82.499603,29.141701,1,0.857422,1,29.141701,-9,0.857422,1,0.857422,-9,29.141701,-9,0.857422,1,82.499603,1,0.857422,-9,82.499603,1,82.499603,-9,0.857422,-9,82.499603,1,164.141998,1,82.499603,-9,164.141998,1,164.141998,-9,82.499603,-9,164.141998,1,135.856995,1,164.141998,-9,135.856995,1,135.856995,-9,164.141998,-9,135.856995,1,82.499603,1,135.856995,-9,82.499603,1,82.499603,-9,135.856995,-9,82.499603,1,29.141701,1,82.499603,-9,29.141701,1,29.141701,-9,82.499603,-9],
            "normalized": false
          },
          "normal": {
            "itemSize": 3,
            "type": "Float32Array",
            "array": [0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,-1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,-0.707107,-0.707107,0,-0.707107,-0.707107,0,-0.707107,-0.707107,0,-0.707107,-0.707107,0,-0.707107,-0.707107,0,-0.707107,-0.707107,0,0.707109,-0.707105,0,0.707109,-0.707105,0,0.707109,-0.707105,0,0.707109,-0.707105,0,0.707109,-0.707105,0,0.707109,-0.707105,0,0.70711,0.707104,0,0.70711,0.707104,0,0.70711,0.707104,0,0.70711,0.707104,0,0.70711,0.707104,0,0.70711,0.707104,0,-0.707116,0.707098,0,-0.707116,0.707098,0,-0.707116,0.707098,0,-0.707116,0.707098,0,-0.707116,0.707098,0,-0.707116,0.707098,0,-0.707103,-0.70711,0,-0.707103,-0.70711,0,-0.707103,-0.70711,0,-0.707103,-0.70711,0,-0.707103,-0.70711,0,-0.707103,-0.70711,0,-0.707107,0.707107,0,-0.707107,0.707107,0,-0.707107,0.707107,0,-0.707107,0.707107,0,-0.707107,0.707107,0,-0.707107,0.707107,0],
            "normalized": false
          }
        },
        "boundingSphere": {
          "center": [54.963001,82.49971,5],
          "radius": 98.546409
        }
      }
    }

  var material = {
      "uuid": "0FA2BF22-7AFA-418E-AF62-F894C07A287A",
      "type": "MeshBasicMaterial",
      "color": 2996451,
      "opacity": 0.8,
      "transparent": true,
      "depthFunc": 3,
      "depthTest": true,
      "depthWrite": false,
      "stencilWrite": false,
      "stencilWriteMask": 255,
      "stencilFunc": 519,
      "stencilRef": 0,
      "stencilFuncMask": 255,
      "stencilFail": 7680,
      "stencilZFail": 7680,
      "stencilZPass": 7680
    }

  var object = {
    "uuid": "198E37A2-4DD8-40E7-B0E2-FD5D9AD681F7",
    "type": "Group",
    "name": "arrows.gltf",
    "layers": 1,
    "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
    "children": [
      {
        "uuid": "1DD651A5-44A4-4570-A965-E841FA4F3BCC",
        "type": "Object3D",
        "layers": 1,
        "matrix": [0.005,0,0,0,0,0.005,0,0,0,0,0.005,0,offsetX,0,offsetY,1],
        "children": [
          {
            "uuid": "CE18DA18-2A86-4364-A031-988C93A289A1",
            "type": "Mesh",
            "name": "mesh_1",
            "layers": 1,
            "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
            "geometry": "36726C8B-4F16-48FE-AC4B-1283EBD10588",
            "material": "0FA2BF22-7AFA-418E-AF62-F894C07A287A"
          }]
      }]
  }

  scene.geometries.push(geometry);
  scene.materials.push(material);
  scene.object.children.push(object);

  console.log(scene);
  
}


function addPath(offsetX,offsetY) {


  var geometry = {
    "uuid": "D6486253-AB6D-461C-BEA1-BB90A67AFDDF",
    "type": "BufferGeometry",
    "data": {
      "attributes": {
        "position": {
          "itemSize": 3,
          "type": "Float32Array",
          "array": [158,79,0,155.308136,58.553295,0,147.416,39.5,0,134.861435,23.138565,0,118.5,10.583993,0,99.446701,2.69186,0,79,0,0,58.553295,2.69186,0,39.5,10.583993,0,23.138565,23.138565,0,10.583993,39.5,0,2.69186,58.553295,0,0,79,0,2.69186,99.446701,0,10.583993,118.5,0,23.138565,134.861435,0,39.5,147.416,0,58.553295,155.308136,0,79,158,0,99.446701,155.308136,0,118.5,147.416,0,134.861435,134.861435,0,147.416,118.5,0,155.308136,99.446701,0,158,79,0],
          "normalized": false
        },
        "normal": {
          "itemSize": 3,
          "type": "Float32Array",
          "array": [0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1,0,0,1],
          "normalized": false
        },
        "uv": {
          "itemSize": 2,
          "type": "Float32Array",
          "array": [158,79,155.308136,58.553295,147.416,39.5,134.861435,23.138565,118.5,10.583993,99.446701,2.69186,79,0,58.553295,2.69186,39.5,10.583993,23.138565,23.138565,10.583993,39.5,2.69186,58.553295,0,79,2.69186,99.446701,10.583993,118.5,23.138565,134.861435,39.5,147.416,58.553295,155.308136,79,158,99.446701,155.308136,118.5,147.416,134.861435,134.861435,147.416,118.5,155.308136,99.446701,158,79],
          "normalized": false
        }
      },
      "index": {
        "type": "Uint16Array",
        "array": [1,0,24,24,23,22,22,21,20,20,19,18,18,17,16,16,15,14,14,13,12,12,11,10,10,9,8,8,7,6,6,5,4,4,3,2,2,1,24,24,22,20,20,18,16,16,14,12,12,10,8,8,6,4,4,2,24,24,20,16,16,12,8,8,4,24,24,16,8]
      },
      "boundingSphere": {
        "center": [79,79,0],
        "radius": 111.722871
      }
    }
  }


  var material = {
    "uuid": "0923BDCB-FCB7-45EA-87D3-13C5844727ED",
    "type": "MeshBasicMaterial",
    "color": 3982316,
    "opacity": 0.8,
    "transparent": true,
    "depthFunc": 3,
    "depthTest": true,
    "depthWrite": false,
    "stencilWrite": false,
    "stencilWriteMask": 255,
    "stencilFunc": 519,
    "stencilRef": 0,
    "stencilFuncMask": 255,
    "stencilFail": 7680,
    "stencilZFail": 7680,
    "stencilZPass": 7680
  }

  var object = {
    "uuid": "2B929A76-148D-4E38-9E1F-2B81DC1D7557",
    "type": "Group",
    "name": "path.gltf",
    "layers": 1,
    "matrix": [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
    "children": [
      {
        "uuid": "8EE00991-4AAA-47E3-9FDB-BDA2B52F419A",
        "type": "Object3D",
        "layers": 1,

        "matrix": [0.005,0,0,0,0,-0.005,0,0,0,0,0.005,0,offsetX,0,offsetY,1],
        "children": [
          {
            "uuid": "43D0AD09-BE1B-443B-8C8C-31144890F30B",
            "type": "Mesh",
            "name": "mesh_0",
            "layers": 1,

            "matrix": [0.1,0,0,0,0,0,0.1,0,0,-0.1,0,0,0,0,0,1],
            "geometry": "D6486253-AB6D-461C-BEA1-BB90A67AFDDF",
            "material": "0923BDCB-FCB7-45EA-87D3-13C5844727ED"
          }]
      }]
    }


  scene.geometries.push(geometry);
  scene.materials.push(material);
  scene.object.children.push(object);

}

            