'use strict';

angular.module('flappyBirdThreeJs')
	.directive('threeDirective',function ($rootScope, controlsService, pipeService) {
			return {
				restrict: 'E',
				link: function (scope, elem) {
					var camera;
					var scene;
					var renderer;
					var raycaster;
					var bird;
					var backgroundTexture;
					var paused = false;
					var loader = new THREE.ObjectLoader();
					var frustum = new THREE.Frustum();
					var cameraViewProjectionMatrix = new THREE.Matrix4();
					var pipeGateVisible = true;
					var screenEdge;
					var collisionRays = [
						new THREE.Vector3(0, 0, 1),
      			new THREE.Vector3(0, 1, 0),
      			new THREE.Vector3(0, -1, 0)
					];
					//init the scene
					init();
					animate();

					function init() {
						camera = new THREE.PerspectiveCamera(90, window.innerWidth / window.innerHeight, 1, 999000);
						camera.position.set(-15, 0, 0);

						camera.lookAt(0,0, 0);

						scene = new Physijs.Scene();


						screenEdge = camera.getFilmWidth() / 2;

						raycaster = new THREE.Raycaster();
						renderer = new THREE.WebGLRenderer({ antialias: true });
						renderer.setSize(window.innerWidth, window.innerHeight);
						renderer.sortObjects = true;

						elem[0].appendChild(renderer.domElement);
						//
            var directionalLight = new THREE.PointLight( 0xffeedd );
            directionalLight.position.set( -10, 0, 0 );
            scene.add( directionalLight );



            // var ambientLight = new THREE.AmbientLight( 0xffeedd );
            // ambientLight.position.set( 0, 1, 1 );
            // scene.add( ambientLight );


						//load bird asset
            loader.load('assets/models/bird.json',function (obj) {
								bird = new Physijs.BoxMesh(
				            new THREE.CubeGeometry( 0.2, 0.2, 0.2 ),
				            new THREE.MeshBasicMaterial()
				        );
								bird.add(obj);

								bird.scale.set(5,5,5);
				        scene.add( bird );
            });

						pipeService.loadPipe();
						$rootScope.$on('loaded:pipe', (event, data) => {
							pipeService.buildPipeGate(scene, screenEdge);
						})

						backgroundTexture = new THREE.TextureLoader().load( '/assets/textures/background.png' );
						backgroundTexture.wrapS = THREE.RepeatWrapping; //set background texture to repeat wrapping for animation
						var backgroundPlane = new THREE.Mesh( new THREE.PlaneGeometry( 100, 50, 0 ), new THREE.MeshBasicMaterial( {map: backgroundTexture, side: THREE.DoubleSide} ) );
						backgroundPlane.rotation.y = Math.PI / 2; //rotate the plane 90 degrees
            backgroundPlane.position.set( 10, 0, 0 );  //move the background texture back off the bird and pipe gates a bit
						scene.add( backgroundPlane );

						// Events
						window.addEventListener('resize',  onWindowResize, false);
						window.addEventListener('mousedown', onMouseDown, false);
						// window.addEventListener('mousemove', onMouseMove, false);

            controlsService.addControls(camera, elem[0].childNodes[0]);
					}

					function onMouseDown(){
						flapBird();
					}

					function onWindowResize() {
						screenEdge = camera.getFilmWidth() / 2;
						renderer.setSize(window.innerWidth, window.innerHeight);
						camera.aspect = window.innerWidth / window.innerHeight;
						camera.updateProjectionMatrix();
					}

					function flapBird(){
						bird.setAngularVelocity({x: 0, y: 0, z: 0});
						var effect = new THREE.Vector3(0,0.1,0);
						var offset = new THREE.Vector3(0,0,0);
						bird.applyImpulse(effect, offset);
					}

					function checkPipeVisible(){
						camera.updateMatrixWorld(); // make sure the camera matrix is updated
						camera.matrixWorldInverse.getInverse( camera.matrixWorld );
						cameraViewProjectionMatrix.multiplyMatrices( camera.projectionMatrix, camera.matrixWorldInverse );
						frustum.setFromMatrix( cameraViewProjectionMatrix );
						if(pipeService.pipeGate.children[0]){
							pipeGateVisible = frustum.intersectsObject( pipeService.pipeGate.children[0] );
							if(!pipeGateVisible){
								pipeService.buildPipeGate(scene, screenEdge);
								pipeGateVisible = true;
							}
						}
					}


					function animate(time) {
						if(!paused){
							requestAnimationFrame(animate);
						  controlsService.getControls().update();
							if(bird){
								if(bird.hasOwnProperty('geometry')){
									bird.setAngularVelocity({x: - bird.getLinearVelocity().y / 5 , y: 0, z:0});
									for (var i = 0; i < collisionRays.length; i++) {
										raycaster.set(bird.position, collisionRays[i]);
										var collisions = raycaster.intersectObjects(pipeService.pipeGate.children);
										if(collisions.length > 0){
											if(collisions[0].distance <= 1.5){
												console.log('GAME OVER');
												paused = true;
											}
										}
									}
								}
							}

							if(pipeService.pipeGate){
								checkPipeVisible();
							  pipeService.pipeGate.translateZ(-0.2);
							}
							backgroundTexture.offset.set(backgroundTexture.offset.x -= .0005,0);
							render();
						}
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
