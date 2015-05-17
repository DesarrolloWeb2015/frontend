var app = angular.module("TecnoCrown", ['ngRoute']);

app.config(function ($routeProvider) {

  $routeProvider
  /* Español */
    .when('/project/:projectId', {
    templateUrl: 'project.html',
    controller: 'globalCtrl'
  });
});

/* Controlador para el idioma  (cambiar a directiva ?) */
app.controller('globalCtrl',function($scope, $http){
  $scope.language = $scope.language || {};

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
app.service('$backend',function ($scope, $http) {
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