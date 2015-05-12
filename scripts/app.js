(function (document) {

	'use strict';
	/**
	 * @ngdoc overview
	 * @description
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
			templateUrl: 'index.html',
			controller: 'HomeCtrl'

	});

})(wrap(document));