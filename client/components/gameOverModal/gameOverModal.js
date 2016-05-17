'use strict';

angular.module('flappyBirdThreeJs')
    .directive('gameOverModal', function($rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'components/gameOverModal/gameOverModal.html',
            link: function($scope, elem) {
              elem.hide();
              $rootScope.$on('gameOver', function(){
                elem.fadeIn();
              });

              $scope.restartGame = function(){
                console.log('sending restart broadcast');
                $rootScope.$broadcast('restartGame');
                elem.fadeOut();
              };
            }
        };
    });
