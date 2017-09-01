'use strict';

angular.module('flappyBirdThreeJs', [
  'ui.router',
  'validation.match',
  'ui.bootstrap',
  'ngAudio'
])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
  });
