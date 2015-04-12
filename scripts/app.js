(function (document) {

  'use strict';
  /**
	 * @ngdoc overview
	 * @name PolymerBricks
	 * @description
	 * # PolymerBricks
	 *
	 * Main module of the application.
	*/
  angular
  .module('TecnoCrown', [
    'ngRoute'
  ])
  .config(function ($locationProvider, $routeProvider) {

    $routeProvider
    .when('/', {
      templateUrl: 'views/home.html',
      controller: 'HomeCtrl'

    })
    .otherwise({redirectTo: '/'})
    ;

  })(wrap(document));