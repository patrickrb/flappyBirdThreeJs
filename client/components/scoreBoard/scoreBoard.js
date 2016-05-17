'use strict';

angular.module('flappyBirdThreeJs')
    .directive('scoreBoard', function($rootScope, pointsService) {
        return {
            restrict: 'E',
            templateUrl: 'components/scoreBoard/scoreBoard.html',
            link: function($scope) {
              $scope.points = pointsService.getPoints();
              $rootScope.$on('newpoint', function(){
                $scope.points = pointsService.getPoints();
              });
            }
        };
    });
