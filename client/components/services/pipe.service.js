'use strict';

angular.module('flappyBirdThreeJs')
  .service('pipeService', function ($rootScope) {
    class PipeService {
            constructor() {
              this.pipeGate = new THREE.Object3D();
              this.pipeGates = [];
              this.pipeObject = {};
              this.topPipeObject = {};
              this.loader = new THREE.ObjectLoader();
            }

            loadPipe(){
              this.loader.load('assets/models/pipe.json', (obj) => {
                obj.traverse( (child) => {
                    if ( child instanceof THREE.Mesh ) {
                        child.material.color.setRGB (0, 1, 0); //set pipe color to green
                        child.scale.set(4,5,4);
                        this.pipeObject = child; //assign child to this.pipeObject variable for building pipe gates
                        $rootScope.$broadcast('loaded:pipe');
                      }
                });
              });
            }

            buildPipeGate(scene){
              this.topPipeObject = this.pipeObject.clone();
  						this.topPipeObject.rotation.z = THREE.Math.degToRad( 180 ); //rotate the plane 90 degrees
              this.topPipeObject.position.set( 0, 5, 0 );  //move the background texture back off the bird and pipe gates a bit
              this.pipeGate.add(this.pipeObject);
              this.pipeGate.add(this.topPipeObject);
              this.pipeGates.push(this.pipeGate);
              scene.add(this.pipeGate);
            }

        }
        return new PipeService();
  });
