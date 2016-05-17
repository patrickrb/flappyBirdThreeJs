'use strict';

angular.module('flappyBirdThreeJs')
  .service('pointsService', function ($rootScope) {
    class PointsService {
            constructor() {
              this.points = 0;
            }

            getPoints() {
              return this.points;
            }

            setPoints(newPointValue){
              this.points = newPointValue;
              $rootScope.$broadcast('newpoint');
            }
        }
        return new PointsService();
  });
