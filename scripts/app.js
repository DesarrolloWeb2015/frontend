var tecnocrownApp = angular.module("tecnocrownApp", ['ngRoute']);

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
    .when('/validate', {
    templateUrl: 'templates/validate_account.html',
    controller: 'validateCtrl'
  })
    .when('/profile',{
    templateUrl: 'templates/profile.html',
    controller: 'globalCtrl'
  })
    .when('/new_project',{
    templateUrl: 'templates/create_project.html',
    controller: 'globalCtrl'
  })
    .otherwise({
    redirectTo: '/home'
  });
});

tecnocrownApp.directive('projectDirective', [], function(){
  return {
    templateUrl: "templates/project_template.html"
    //controller: "projectCtrl"
  }
});

tecnocrownApp.service('api',['$http', function ($http, $location) {
  var projects = {}
  var user = {}

  var getProjects = function(){
    $http.get('http://aiocs.es/projects/').
    success(function(data, staus, headers, config){
      console.log("DATA"+JSON.stringify(data))
      this.projects = data;
    }).
    error(function(data, staus, headers, config){
      console.log("ERROR")
    });
  };

  var singin = function(data,callback,errorCallback){
    // send mail to confirm email account
    if(data.r_password === data.password) {
      delete data.r_password;
      $http.post('http://aiocs.es/users/', data)
        .success(function (data, status, headers, config) {
        if (callback)
          callback(data,status)
      })
        .error(function (data, status) {
        if (errorCallback)
          errorCallback(data,status)
      });
    }
  };

  var validate_account = function(params){
    console.log(params)
    if(params.c){
      validate_code = params.c;
      // search user whit code params.c
      $http.get('http://aiocs.es/users/validate_account?c='+params.c)
        .success(function(data, status, headers, config){
        console.log("STATUS: "+ JSON.stringify(data))
        console.log("STATUS: "+status)
      })
        .error(function(data, status){
        console.log("STATUS: "+ JSON.stringify(data))
        console.log("STATUS ERR: "+status)
      })
    }
  };

  var auth = function (user,callback,errorCallback) {
    if(user.password && user.username){
      $http.get('http://aiocs.es/users/login_user?username='+user.username+'&password='+user.password)
        .success(function(data, status, headers, config){
        if (callback)
          callback(data,stat)
        this.user = data
      })
        .error(function(data, status){
          if (errorCallback)
          errorCallback(data,stat)
      })
    }
  };

  return {
    projects: projects,
    usr: user,
    auth: auth,
    singin: singin,
    getProjects: getProjects,
    validate_account: validate_account,
  }
  /*
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
     */

}]);




/* Controlador para el idioma  (cambiar a directiva ?) */
tecnocrownApp.controller('globalCtrl',['$scope', '$http','api','$routeParams',function($scope, $http,api, $routeParams){
  $scope.language = $scope.language || {};
  $scope.params = $routeParams;
  $scope.user = {}
  api.getProjects
  $scope.projects = api.projects
  console.log($scope.projects)

  $http.get('lang/es_es.json').success(function (data,status) {
    $scope.language = data;

    $scope.changelang = function (language) {
      var file;
      file = language + '_' + language + '.json';
      $http.get('lang/' + file).success(function (data, status) {
        $scope.language = data;
      });
    };
  });

  $scope.userObj = $scope.userObj || {};

  // launch login form
  $scope.login = function(user){
    $scope.userObj = angular.copy(user)
    if($scope.userObj.username !== "" && $scope.userObj.password !== "") {
      api.auth($scope.userObj);
      $scope.user = api.usr
    }
    else
      // TBD: form not valid
      return false;
  };

}]);

tecnocrownApp.controller('signinCrtl',['$scope', 'api','$location', function($scope, api, $location){
  $scope.userObj = $scope.userObj || {};
  $scope.reset = function(){
    $scope.user = angular.copy($scope.userObj);
  };

  // launch signin form
  $scope.update = function(user){
    if (user) {
      if (user.password === user.r_password && Object.keys(user).length === 8) {
        $scope.userObj = angular.copy(user)
        $scope.error = '';
        console.log("SENDING:::: "+JSON.stringify($scope.userObj))
        var callback = function() {
          $location.path("/validate")
        };
        var errorCallback = function(){
          $scope.error = $scope.language.signinFields.existUser
        };
        api.singin($scope.userObj,callback,errorCallback)
      } else if(user.password !== user.r_password && user.password) {
        $scope.error = $scope.language.signinFields.passwordError;
      } else if(!user.email) {
        $scope.error = $scope.language.signinFields.emailError; 
      } else {
        $scope.error = $scope.language.signinFields.boxError
      }
    }
  };
}]);

/*tecnocrownApp.controller('loginCrtl',['$scope', 'api', function($scope, api){

}]);*/

tecnocrownApp.controller('validateCtrl', ['api', '$location', function(api, $location){
  api.validate_account($location.search());
}]);