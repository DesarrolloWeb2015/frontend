/*
* Tecnocorwd app
*
* */
var tecnocrownApp = angular.module("tecnocrownApp", ['ngRoute']);

tecnocrownApp.config(function ($routeProvider) {
  $routeProvider
      .when('/home', {
          templateUrl: 'templates/home.html',
          controller: 'globalCtrl'
      })
      .when('/projects',{
          templateUrl: 'templates/projects_list.html',
          controller: 'globalCtrl'
      })
      .when('/project/:projectId', {
          templateUrl: 'templates/project_details.html',
          controller: 'globalCtrl'
      })
      .when('/about', {
          templateUrl: 'templates/about.html',
          controller: 'globalCtrl'
      })
      .when('/contact', {
          templateUrl: 'templates/contact.html',
          controller: 'globalCtrl'
      })
      .when('/login', {
          templateUrl: 'templates/login.html',
          controller: 'globalCtrl'
      })
      .otherwise({
          redirectTo: '/home'
      });
});

/* Controlador para el idioma  (cambiar a directiva ?) */
tecnocrownApp.controller('globalCtrl',function($scope, $http, $routeParams){
    $scope.language = $scope.language || {};
    $scope.params = $routeParams;

  $http.get('lang/en_en.json').success(function (data,status) {
    $scope.language = data;
  });

  $scope.changelang = function (language) {
    var file;
    file = language + '_' + language + '.json';
    $http.get('lang/' + file).success(function (data,status) {
      $scope.language = data;
    });
  };
});

/* Servicio para la conexion con el backend */ 
tecnocrownApp.service('$backend',function ($scope, $http) {
  this.login = function (user, password, callback, errorCallback) {

  };

  this.logout = function (user, callback, errorCallback) {

  };

  this.createProject = function (user,name, tille, time, money ,callback, errorCallback) {

  };

  this.myProject = function (user, callback, errorCallback) {

  };

  this.deleteMyProject = function (user,projectId, callback, errorCallback) {

  };

  this.addCrownfounding = function (user, projectId, money, callback, errorCallback) {

  };


});