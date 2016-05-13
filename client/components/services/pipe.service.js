'use strict';

angular.module('flappyBirdThreeJs')
  .service('pipeService', function ($rootScope, utilsService) {
    class PipeService {
            constructor() {
              this.pipeGate = new THREE.Object3D();
              this.pipeObject = {};
              this.topPipeObject = {};
              this.pointBox = {};
              this.loader = new THREE.ObjectLoader();
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

            buildPipeGate(scene,screenEdge){
              scene.remove(this.pipeGate);
              this.pipeGate = new THREE.Object3D();
              this.topPipeObject = this.pipeObject.clone();
  						this.topPipeObject.rotation.z = THREE.Math.degToRad( 180 ); //rotate the plane 90 degrees
              this.topPipeObject.position.set( 0, 3, 0 );  //move the background texture back off the bird and pipe gates a bit
              this.pointBox = new THREE.Mesh( new THREE.BoxGeometry( 100, 50, 0 ), new THREE.MeshBasicMaterial( {visible: false} ) );
              this.pointBox.name = "pointBox";
              this.pipeGate.add(this.pointBox);
              this.pipeGate.add(this.pipeObject);
              this.pipeGate.add(this.topPipeObject);
              this.pipeGate.position.set(0,utilsService.randNum(-6, 4),screenEdge);
              scene.add(this.pipeGate);
            }

        }
        return new PipeService();
  });
