'use strict';

angular.module('flappyBirdThreeJs')
	.directive('threeDirective',function ($rootScope, controlsService) {
			return {
				restrict: 'E',
				link: function (scope, elem) {
					var camera;
					var scene;
					var renderer;
					var raycaster;
					var bird;
          var loader = new THREE.ObjectLoader();

					//init the scene
					init();
					animate();

					function init() {
						camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 999000);
						camera.position.set(-15, 0, 0);

						camera.lookAt(0,0, 0);

						scene = new Physijs.Scene();

						raycaster = new THREE.Raycaster();
						renderer = new THREE.WebGLRenderer({ antialias: true });
						renderer.setSize(window.innerWidth, window.innerHeight);
						renderer.sortObjects = true;

						elem[0].appendChild(renderer.domElement);
						//
            // var directionalLight = new THREE.DirectionalLight( 0xffeedd );
            // directionalLight.position.set( 0, 1, 1 );
            // scene.add( directionalLight );


            var ambientLight = new THREE.AmbientLight( 0xffeedd );
            ambientLight.position.set( 0, 1, 1 );
            scene.add( ambientLight );


            loader.load('assets/models/bird.json',function (obj) {
								bird = new Physijs.BoxMesh(
				            new THREE.CubeGeometry( 0.2, 0.2, 0.2 ),
				            new THREE.MeshBasicMaterial()
				        );
								bird.add(obj);
				        scene.add( bird );
            });

						loader.load('assets/models/pipe.json',function (obj) {
						  console.log('pipe object: ', obj);
						    scene.add( obj );
						});


						// Events
						window.addEventListener('resize',  onWindowResize, false);
						window.addEventListener('mousedown', onMouseDown, false);

            controlsService.addControls(camera, elem[0].childNodes[0]);
					}

					function onMouseDown(){
						console.log('mouse clicked');
						flapBird();
					}

					function onWindowResize() {
						renderer.setSize(window.innerWidth, window.innerHeight);
						camera.aspect = window.innerWidth / window.innerHeight;
						camera.updateProjectionMatrix();
					}

					function flapBird(){
						var effect = new THREE.Vector3(0,0.1,0);
						var offset = new THREE.Vector3(0,0,0);
						bird.applyImpulse(effect, offset);
					}


					function animate(time) {
						requestAnimationFrame(animate);
					  controlsService.getControls().update();
						render();
					}

					function render() {
						scene.simulate(); // run physics
						// renderer.render(backgroundScene , backgroundCamera )
						renderer.render(scene, camera);
					}
				}
			};
		}
	);
