'use strict';

angular.module('flappyBirdThreeJs')
    .directive('newGameModal', function($rootScope) {
        return {
            restrict: 'E',
            templateUrl: 'components/newGameModal/newGameModal.html',
            link: function($scope, elem) {
              $scope.playGame = function(){
    						elem.hide();
                $rootScope.$broadcast('playGame');
              };
            }
        };
    });
