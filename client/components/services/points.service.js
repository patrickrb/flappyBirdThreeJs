'use strict';

angular.module('flappyBirdThreeJs')
  .service('pointsService', function () {
    class PointsService {
            constructor() {
              this.points = 0;
            }

            getPoints() {
              return this.points;
            }

            setPoints(newPointValue){
              this.points = newPointValue;
            }
        }
        return new PointsService();
  });
