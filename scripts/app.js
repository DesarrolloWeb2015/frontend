var tecnocrownApp = angular.module("tecnocrownApp", ['ngRoute', 'apiService']);

tecnocrownApp.config(function ($routeProvider){
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
tecnocrownApp.controller('globalCtrl',['$scope', '$http','api', '$routeParams',function($scope, $http,api, $routeParams){
    $scope.language = $scope.language || {};
    $scope.params = $routeParams;

    $http.get('lang/en_en.json').success(function (data,status) {
        $scope.language = data;

        $scope.changelang = function (language) {
            var file;
            file = language + '_' + language + '.json';
            $http.get('lang/' + file).success(function (data, status) {
                $scope.language = data;
            });
        };
    });
}]);

tecnocrownApp.controller('signinCrtl',['$scope', 'api', function($scope, api){
    $scope.userObj = $scope.userObj || {};

    $scope.reset = function(){
        $scope.user = angular.copy($scope.userObj);
    };

    // launch signin form
    $scope.update = function(user){
        $scope.userObj = angular.copy(user)
        console.log("SENDING:::: "+JSON.stringify($scope.userObj))
        api.singin($scope.userObj)
    };
}]);

tecnocrownApp.controller('loginCrtl',['$scope', 'api', function($scope, api){
    $scope.userObj = $scope.userObj || {};

    $scope.reset = function(){
        $scope.user = angular.copy($scope.userObj);
    };

    // launch signin form
    $scope.update = function(user){
        $scope.userObj = angular.copy(user)
        console.log($scope.userObj)
    };
}]);