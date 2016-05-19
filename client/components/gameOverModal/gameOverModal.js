'use strict';

angular.module('flappyBirdThreeJs')
    .directive('gameOverModal', function($rootScope, pointsService) {
        return {
            restrict: 'E',
            templateUrl: 'components/gameOverModal/gameOverModal.html',
            link: function($scope, elem) {
              elem.hide();
              $rootScope.$on('gameOver', function(){
                $scope.points = pointsService.getPoints();
                elem.show();
              });

              $scope.restartGame = function(){
                console.log('sending restart broadcast');
                $rootScope.$broadcast('restartGame');
                elem.hide();
              };
            }
        };
    });
