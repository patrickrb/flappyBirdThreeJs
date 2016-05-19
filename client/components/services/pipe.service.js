'use strict';

angular.module('flappyBirdThreeJs')
  .service('pipeService', function ($rootScope, utilsService) {
    class PipeService {
            constructor() {
              this.pipeGate = new THREE.Object3D();
              this.pipeGates = [];
              this.pipeObject = {};
              this.topPipeObject = {};
              this.pointBox = {};
              this.loader = new THREE.ObjectLoader();
              this.pointBox = new THREE.Mesh( new THREE.BoxGeometry( 100, 50, 0 ), new THREE.MeshBasicMaterial( {visible: false} ) );
              this.pointBox.name = 'pointBox';
              this.pipeGateCollisionArray = [];
            }

            loadPipe(){
              this.loader.load('assets/models/pipe.json', (obj) => {
                obj.traverse( (child) => {
                    if ( child instanceof THREE.Mesh ) {
                        child.material.color.setRGB (0, 1, 0); //set pipe color to green
                        child.scale.set(2,10,5);
                        this.pipeObject = child; //assign child to this.pipeObject variable for building pipe gates
                        $rootScope.$broadcast('loaded:pipe');
                      }
                });
              });
            }

            buildPipeGate(scene){
              var distance = 25;
              this.pipeGates.forEach(function(pipeGate){
                scene.remove(pipeGate);
              });
              this.pipeGates.length = 0;
              this.pipeGateCollisionArray.length = 0;
              for(var i=0; i < 4; i++){
                this.pipeGate = new THREE.Object3D();
                this.bottomPipeObject = this.pipeObject.clone();
                this.topPipeObject = this.pipeObject.clone();
                this.gatePointBox = this.pointBox.clone();
    						this.topPipeObject.rotation.z = THREE.Math.degToRad( 180 ); //rotate the plane 90 degrees
                this.topPipeObject.position.set( 0, 0.75, 0 );  //move the background texture back off the bird and pipe gates a bit
                this.pipeGate.add(this.gatePointBox);
                this.pipeGate.add(this.bottomPipeObject);
                this.pipeGate.add(this.topPipeObject);
                this.pipeGate.position.set(0,utilsService.randNum(-7, 5), distance);
                distance = distance + 25;
                this.pipeGates.push(this.pipeGate);
                this.pipeGateCollisionArray.push(this.gatePointBox);
                this.pipeGateCollisionArray.push(this.bottomPipeObject);
                this.pipeGateCollisionArray.push(this.topPipeObject);
                scene.add(this.pipeGate);
              }
            }

        }
        return new PipeService();
  });
