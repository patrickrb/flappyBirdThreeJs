'use strict';

angular.module('meanThree')
    .directive('footer', function() {
        return {
            restrict: 'E',
            templateUrl: 'components/footer/footer.html',
            link: function($scope) {
            }
        };
    });
