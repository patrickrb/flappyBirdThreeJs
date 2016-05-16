'use strict';

angular.module('flappyBirdThreeJs')
    .directive('newGameModal', function() {
        return {
            restrict: 'E',
            templateUrl: 'components/newGameModal/newGameModal.html',
            link: function($scope) {
              console.log('new game modal loaded')
            }
        };
    });
