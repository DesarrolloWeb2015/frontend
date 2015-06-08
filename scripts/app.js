var tecnocrownApp = angular.module("tecnocrownApp", ['ngRoute','ngMd5']);

tecnocrownApp.config(function ($routeProvider,$locationProvider){

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
    .when('/profile/:username', {
    templateUrl: 'templates/profile.html',
    controller: 'profileCtrl',
    resolve: {
      auth: ["$q", "$cookie","md5","$routeParams", function($q, $cookie,md5,$routeParams){

        var session = $cookie.get('session');
        var username = window.location.hash.split('/')[2]
        if (session && md5.createHash(username) === session) {
          return $q.when(session);
        } else {
          return $q.reject({authenticated: false})
        }
      }]
    }
  })
    .when('/new_project',{
    templateUrl: 'templates/create_project.html',
    controller: 'globalCtrl'
  })
    .otherwise({
    redirectTo: '/home'
  });
});
tecnocrownApp.run(["$rootScope", "$location", function($rootScope, $location) {
  $rootScope.$on("$routeChangeError", function(event, current, previous, eventObj) {
    if (eventObj.authenticated === false) {
      $location.path("/");
    }
  });
}]);
tecnocrownApp.directive('projectDirective', [], function(){
  return {
    templateUrl: "templates/project_template.html"
    //controller: "projectCtrl"
  }
});
tecnocrownApp.service('$cookie', function () {
  this.get = function (name) {
    var cookies, result, patron, exp;
    cookies = document.cookie;
    patron = name+"=([^&#]*)";
    exp = new RegExp(patron);
    result = exp.exec(cookies);
    return result ? result[1] : undefined;
  };
  this.put  = function (key, value, expires, path, domain, secure) {
    var cookie;
    cookie = key + '=' + value;
    if (expires) {
      cookie += '; expires=' + expires;
    }
    if (path) {
      cookie += '; path=' + path; 
    }
    if (domain) {
      cookie += '; domain=' + domain;
    }
    if (secure) {
      cookie +='; secure';
    }
    document.cookie = cookie;
  };

  this.delete = function (name) {
    document.cookie = name + '=; expires= Thu, 01 jan 1970 00:00:00 UTC';
  }
  this.set = function (key, value, expires, path, domain, secure) {
    this.put(key, value, expires, path, domain, secure); 
  };
  this.getAll = function () {
    return document.cookie;
  }
});

tecnocrownApp.service('api',['$http',"$cookie","md5", function ($http, $cookie, md5) {
  this.projects = {}
  this.user = {}
  this.userProjects = {}

  this.getProjects = function(callback,errorCallback){
    $http.get('http://aiocs.es/projects/')
      .success(function(data, staus, headers, config){
      this.projects = data;
      if (callback)
        callback(data,status);
    })
      .error(function(data, staus, headers, config) {
      console.log("ERROR");  
      if (errorCallback)
        errorCallback(data,status);
    });
  };

  this.singin = function(data,callback,errorCallback){
    // send mail to confirm email account
    if(data.r_password === data.password) {
      delete data.r_password;
      $http.post('http://aiocs.es/users/', data)
        .success(function (data, status, headers, config) {
        if (callback)
          callback(data,status);
      })
        .error(function (data, status) {
        if (errorCallback)
          errorCallback(data,status);
      });
    }
  };

  this.validate_account = function(params){
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

  this.auth = function (user,callback,errorCallback) {
    if(user.password && user.username){
      $http.get('http://aiocs.es/users/login_user?username='+user.username+'&password='+user.password)
        .success(function(data, status, headers, config){
        if (callback) {
          callback(data,status)
        }
        this.user = data
        console.log(data);
        $cookie.put('session',md5.createHash(data.username))
      })
        .error(function(data, status){
        if (errorCallback)
          errorCallback(data,status)
          })
    }
  };
  this.getUserProjects = function (username, callback,errorCallback) {
    $http.get('http://aiocs.es/users/'+username+'/projects')
      .success(function (data,status) {
      if (callback)
        callback(data,status);
      this.userProjects = data;
    })
      .error(function (data, status) {
      if (errorCallback)
        errorCallback(data,status);
    });
  };
  return {
    projects: this.projects,
    usr: this.user,
    auth: this.auth,
    singin: this.singin,
    getProjects: this.getProjects,
    validate_account: this.validate_account,
    getUserProjects:  this.getUserProjects
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
tecnocrownApp.controller('globalCtrl',['$scope', '$http','api','$routeParams', '$location',function($scope, $http,api, $routeParams, $location){
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
    if($scope.userObj && $scope.userObj.username && $scope.userObj.password) {
      var callback = function(){
        $scope.user = api.usr
        $location.path('/profile/'+user.username);
        $scope.loginError = false;
      }
      var errorCallback = function() {$scope.loginError = $scope.language.login_error.password;}
      api.auth($scope.userObj,callback, errorCallback);

    } else
      $scope.loginError = $scope.language.login_error.void;
    return false;
  };

}]);

tecnocrownApp.controller('signinCrtl',['$scope', 'api','$location','md5',"$cookie", function($scope, api, $location,md5,$cookie){
  $scope.userObj = $scope.userObj || {};
  $scope.reset = function(){
    $scope.user = angular.copy($scope.userObj);
  };

  // launch signin form
  $scope.update = function(user){
    if (user) {
      if (user.password === user.r_password && user.password && user.username && user.email) {
        $scope.userObj = angular.copy(user)
        $scope.error = '';
        console.log("SENDING:::: "+JSON.stringify($scope.userObj))
        var callback = function() {
          var session = md5.createHash(user.username)
          $cookie.put('session',session)
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
tecnocrownApp.controller('profileCtrl',['$scope', 'api', '$cookie', function($scope, api, $cookie) {
  $scope.projects = api.projects || {};
  $scope.yourProject = api.getUserProjects($scope.$parent.params.username) || {}
}]);