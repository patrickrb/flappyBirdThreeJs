'use strict';

angular.module('flappyBirdThreeJs')
    .directive('footer', function() {
        return {
            restrict: 'E',
            templateUrl: 'components/footer/footer.html',
            link: function($scope) {
            }
        };
    });
