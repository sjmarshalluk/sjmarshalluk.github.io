

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



            window.onload = () => {
                 renderPlaces();
            };


            function renderPlaces() {
                let scene = document.querySelector('a-scene');

                route.features[0].geometry.coordinates.forEach(function(turn) {
                  console.log("latitude: " + String(turn[1]) + "; longitude: " + String(turn[0]));
                  let latitude = turn[1];
                  let longitude = turn[0];

                  var latlng = "latitude: " + String(turn[1]) + "longitude: " + String(turn[0]);

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

                  model.setAttribute('gltf-model', './arrows.gltf');
                  model.setAttribute("gps-entity-place", "latitude: 41.892590; longitude: 12.489820;");
                  console.log(model);
                  model.setAttribute("rotation", '0 45 0');
                  model.setAttribute("color", "#4CC3D9");
                  model.setAttribute('scale', '0.5 0.5 0.5');


                  model.addEventListener('loaded', () => {
                      window.dispatchEvent(new CustomEvent('gps-entity-place-loaded'))
                  });

                  scene.appendChild(model);

                })


                console.log(scene);

            }