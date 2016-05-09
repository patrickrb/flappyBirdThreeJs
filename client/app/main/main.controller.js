'use strict';
(function() {

    function MainController($scope, $rootScope) {
        this.awesomeThings = [];

    }

    angular.module('meanThree')
        .controller('MainController', MainController);

})();
