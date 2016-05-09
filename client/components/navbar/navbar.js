'use strict';

angular.module('meanThree')
    .directive('navbar', function($rootScope, $cookieStore) {
        return {
            restrict: 'E',
            templateUrl: 'components/navbar/navbar.html',
            link: function($scope) {
            }
        };
    });
