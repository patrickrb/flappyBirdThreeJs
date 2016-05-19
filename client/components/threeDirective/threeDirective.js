'use strict';

angular.module('flappyBirdThreeJs')
	.directive('threeDirective',function ($rootScope, controlsService, pipeService, pointsService, soundService, utilsService) {
			return {
				restrict: 'E',
				link: function (scope, elem) {
					var camera;
					var scene;
					var renderer;
					var raycaster;
					var bird;
					var backgroundTexture;
					var paused = true;
					var loader = new THREE.ObjectLoader();
					var collisionRays = [
						new THREE.Vector3(0, 0, 1),
      			new THREE.Vector3(0, 1, 0),
      			new THREE.Vector3(0, -1, 0)
					];

					soundService.loadSounds();
					//init the scene
					init();
					animate();

					$rootScope.$on('restartGame', function(){
						pipeService.buildPipeGate(scene);
						paused = false;
						pointsService.setPoints(0);
						addBird();
					});

					$rootScope.$on('playGame', function(){
						paused = false;
					});

					function init() {
						camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 999000);
						camera.position.set(-15, 0, 0);

						camera.lookAt(0,0, 0);

						scene = new Physijs.Scene();

						scene.setGravity(new THREE.Vector3( 0,-100, 0 ));

						raycaster = new THREE.Raycaster();
						renderer = new THREE.WebGLRenderer({ antialias: true });
						renderer.setSize(window.innerWidth, window.innerHeight);
						renderer.sortObjects = true;

						elem[0].appendChild(renderer.domElement);
						//
            var directionalLight = new THREE.PointLight( 0xffeedd );
            directionalLight.position.set( -10, 0, 0 );
            scene.add( directionalLight );


						addBird();
						pipeService.loadPipe();
						$rootScope.$on('loaded:pipe', () => {
							pipeService.buildPipeGate(scene);
						});

						backgroundTexture = new THREE.TextureLoader().load( '/assets/textures/background.png' );
						backgroundTexture.wrapS = THREE.RepeatWrapping; //set background texture to repeat wrapping for animation
						var backgroundPlane = new THREE.Mesh( new THREE.PlaneGeometry( 100, 50, 0 ), new THREE.MeshBasicMaterial( {map: backgroundTexture, side: THREE.DoubleSide} ) );
						backgroundPlane.rotation.y = Math.PI / 2; //rotate the plane 90 degrees
            backgroundPlane.position.set( 10, 0, 0 );  //move the background texture back off the bird and pipe gates a bit
						scene.add( backgroundPlane );

						// Events
						window.addEventListener('resize',  onWindowResize, false);
						elem[0].addEventListener('mousedown', onMouseDown, false);
						// window.addEventListener('mousemove', onMouseMove, false);

            controlsService.addControls(camera, elem[0].childNodes[0]);
					}

					function addBird(){
						if(bird){
							scene.remove(bird);
						}
						//load bird asset
						loader.load('assets/models/bird.json',function (obj) {
								bird = new Physijs.BoxMesh(
										new THREE.CubeGeometry( 0.2, 0.2, 0.2 ),
										new THREE.MeshLambertMaterial()
								);
								bird.add(obj);

								bird.scale.set(5,5,5);
								scene.add( bird );
						});
					}

					function onMouseDown(){
						flapBird();
					}

					function onWindowResize() {
						renderer.setSize(window.innerWidth, window.innerHeight);
						camera.aspect = window.innerWidth / window.innerHeight;
						camera.updateProjectionMatrix();
					}

					function flapBird(){
						soundService.birdFlap.play();
						bird.setAngularVelocity({x: 0, y: 0, z: 0});
						var effect = new THREE.Vector3(0,40,0);
						var offset = new THREE.Vector3(0,0,0);
						bird.setLinearVelocity(effect);
					}


					function animate(time) {
						if(!paused){
						  controlsService.getControls().update();
							if(bird){
								if(bird.hasOwnProperty('geometry')){
									if(bird.getLinearVelocity().y < 0){
										if(bird.children[0].children[0].rotation.x <= 1){
											bird.children[0].children[0].rotation.x += 0.2;
										}
									}
									if(bird.getLinearVelocity().y > 0){
										if(bird.children[0].children[0].rotation.x >= -0.5){
											bird.children[0].children[0].rotation.x -= 0.2;
										}
									}
										for (var i = 0; i < collisionRays.length; i++) { //iterate through all potential collisions rays
											raycaster.set(bird.position, collisionRays[i]); //setup the raycaster inside bird in the direction of the collision ray
											var collisions = raycaster.intersectObjects(pipeService.pipeGateCollisionArray); //raycast from our bird into the pipe meshes and point boxes
											if(collisions.length > 0){ //check to see if there are any collisions first
												if((collisions[0].distance <= 1.5) && (collisions[0].object.name !== 'pointBox')){ //check if the bird ran into a pipe
													soundService.collision.play();
													paused = true;
													$rootScope.$broadcast('gameOver');
												}
												if((collisions[0].distance > 0.1) && (collisions[0].distance <= 0.201) && (collisions[0].object.name === 'pointBox')){ //check if bird scored a point
													pointsService.setPoints(pointsService.getPoints() + 1);
												}
											}
										}
								}
							}

							if(pipeService.pipeGate){
								for (var pipeGateIndex = 0; pipeGateIndex < pipeService.pipeGates.length; pipeGateIndex++){
							  	pipeService.pipeGates[pipeGateIndex].translateZ(-0.2);
									if(pipeService.pipeGates[pipeGateIndex].position.z <= -35){
										pipeService.pipeGates[pipeGateIndex].position.set(0,utilsService.randNum(-7, 5), 65);
									}
								}
							}
							backgroundTexture.offset.set(backgroundTexture.offset.x -= 0.0005,0);
						}
						requestAnimationFrame(animate);
						render();
					}

					function render() {
						if(!paused){
							scene.simulate(); // run physics
						}
						// renderer.render(backgroundScene , backgroundCamera )
						renderer.render(scene, camera);
					}
				}
			};
		}
	);
