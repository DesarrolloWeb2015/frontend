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
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift()
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
      $http.post('http://aiocs.es/users/', JSON.stringify(data))
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
        $cookie.put('username',user.username);
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
  this.getUserCrowfounding = function(username,callback,errorCallback) { 
    $http.get('http://aiocs.es/users/'+username+'collaborators')
      .success(function(data,status) {

    })
      .error(function(data,status) {

    });

  };
  this.setUser = function (username,user, callback, errorCallback) {
    $http.put('http://aiocs.es/users/'+username,JSON.stringify(user))
      .success(function (data, status) {
      console.log("fue bien", data,status);
    })
      .error (function (data,status) {
      console.log('fue mal', data, status);
    });
  };
  this.getUser = function(username,callback,errorCallback) {
    $http.get('http://aiocs.es/users/'+username)
      .success(function(data,status) {
      if (callback) 
        callback(data,status);
    })
      .error(function(data, status) {
      if (errorCallback)
        errorCallback(data,status);
    });

  };
  this.createProject = function(project,callback, errorCallback) {
    $http.post('http://aiocs.es/project',JSON.stringify(project))
      .success(function (data,status) {
      if (callback)
        callback(data,status)
        })
      .error(function (data, status) {
      if (errorCallback)
        errorCallback(data, status);
    });
  };
  return {
    projects: this.projects,
    usr: this.user,
    setUser: this.setUser,
    auth: this.auth,
    singin: this.singin,
    getProjects: this.getProjects,
    validate_account: this.validate_account,
    getUserProjects:  this.getUserProjects,
    getUserCrowfounding: this.getUserCrowfounding,
    getUser: this.getUser,
    createProject: this.createProject
  }
}]);
/* Controlador para el idioma  (cambiar a directiva ?) */
tecnocrownApp.controller('globalCtrl',['$scope', '$http','api','$routeParams', '$location','md5','$cookie',function($scope, $http,api, $routeParams, $location,md5,$cookie){
  $scope.language = $scope.language || {};
  $scope.params = $routeParams;
  $scope.user = {}
  $scope.status = $cookie.get('session') ? true : false;
  $scope.username = $cookie.get('username');
  $scope.page = 0;

  $scope.projects = [
    {name:'TecnoCrown',link:'www.tecnocrown.html',description:'Projecto para la construccion de un portal web',current:'15.000',remain:'21',needed:'30.000',img:'images/proy1.png',id:'1'},
    {name:'Polymer',link:'www.prueba.html',description:'Desarrollo de web component mediante tecnología Polymer',current:'15.000',remain:'21',needed:'30.000',img:'images/imagen2.png', id: '2'},
    {name:'AngularJs',link:'www.prueba.html',description:'Desarrollo de librerias para representación de gráficos',current:'15.000',remain:'21',needed:'30.000',img:'images/angularjs.jpg', id:'3'},
    {name:'AngularJs',link:'www.prueba.html',description:'Desarrollo de librerias para representación de gráficos',current:'15.000',remain:'21',needed:'30.000',img:'images/angularjs.jpg', id:'3'},
    {name:'AngularJs',link:'www.prueba.html',description:'Desarrollo de librerias para representación de gráficos',current:'15.000',remain:'21',needed:'30.000',img:'images/angularjs.jpg', id:'3'}
  ];

  $scope.initial = {}

  $scope.load = function() {
    api.getProjects($scope.page,function(data) {$scope.projects=data;$scope.next(0)});
  };
  /* Cargamos la funcion inicial*/
 // $scope.load()
  $scope.next = function(next){
    $scope.page+=next;
    var pointer = 3*$scope.page;
    var restantes = ($scope.projects.length - pointer);
    if (next<0) {
      $scope.page-=next;

    } if ( restantes <= 0 ){
      $scope.page-=next;
    } else if ( restantes ==1) {
      $scope.initial = [$scope.projects[(pointer-2)],$scope.projects[(pointer)-1],$scope.projects[(pointer)]];
    } else if (restantes == 2) {
      $scope.initial = [$scope.projects[(pointer-1)],$scope.projects[(pointer)],$scope.projects[(pointer)+1]]; 
    } else {
      $scope.initial = [$scope.projects[(pointer)],$scope.projects[(pointer)+1],$scope.projects[(pointer)+2]];
    }

  }
  $scope.next(0);
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

  $scope.dividir = 
    // launch login form
    $scope.login = function(user){
    $scope.userObj = angular.copy(user)
    if($scope.userObj.username !== "" && $scope.userObj.password !== "") {
      api.auth($scope.userObj);
      $scope.user = api.usr
      if (api.usr) {
        $scope.$parent.status = true;
        var session = md5.createHash(user.username)
        $cookie.put('session',session)
        $cookie.put('username',user.username);
        $location.path('/profile/'+user.username);
      } else {
        //tratar error 
      }
    }
    else
      $scope.loginError = true;
    return false;
  };
  // Logout
  $scope.logout = function() {
    $scope.status = false;
    $cookie.delete('session');
    $location.path('/home');
  };



}]);

tecnocrownApp.controller('signinCrtl',['$scope', 'api','$location','md5',"$cookie", function($scope, api, $location,md5,$cookie){
  $scope.userObj = $scope.userObj || {};
  $scope.reset = function(){
    $scope.user = angular.copy($scope.userObj);
  };
  $scope.language = $scope.$parent.language;
  // launch signin form
  $scope.update = function(user){
    if (user) {
      if (user.password === user.r_password && user.password && user.username && user.email) {
        $scope.userObj = angular.copy(user)
        $scope.error = '';
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


/* Controlador validador*/
tecnocrownApp.controller('validateCtrl', ['api', '$location', function(api, $location){
  api.validate_account($location.search());
}]);


/*
*
* Controlador del perfil
*/

tecnocrownApp.controller('profileCtrl',['$scope', 'api', '$cookie', function($scope, api, $cookie) {

  $scope.username = $scope.$parent.params.username;
  $scope.crowfounding = {}
  $scope.yourProject = {}
  $scope.crowfounding = [
    {name:'TecnoCrown',link:'www.tecnocrown.html',description:'Projecto para la construccion de un portal web',current:'15.000',remain:'21',needed:'30.000',img:'images/proy1.png',id:'1'},
    {name:'Polymer',link:'www.prueba.html',description:'Desarrollo de web component mediante tecnología Polymer',current:'15.000',remain:'21',needed:'30.000',img:'images/imagen2.png', id: '2'},
    {name:'AngularJs',link:'www.prueba.html',description:'Desarrollo de librerias para representación de gráficos',current:'15.000',remain:'21',needed:'30.000',img:'images/angularjs.jpg', id:'3'},
    {name:'AngularJs',link:'www.prueba.html',description:'Desarrollo de librerias para representación de gráficos',current:'15.000',remain:'21',needed:'30.000',img:'images/angularjs.jpg', id:'3'}
  ];
  $scope.active = 1;
  $scope.msg=''  

  $scope.load = function() {
    api.getUserCrowfounding($scope.usrename,function(data){$scope.crowfounding = data})
    api.getUserProjects($scope.username,function(data){$scope.yourProject = data})
    api.getUser($scope.username, function(data){$scope.yourProject = data})
  }

  /* cargamos los datos */
  $scope.load();

  $scope.sendProfile = function (user) {
    if (Object.keys(user).length!=0) {
      api.setUser($scope.username, user);
    }
  };
}]);

tecnocrownApp.controller('createCtrl', ['$scope','api','$location','$timeout', function($scope,api, $location, $timeout) {
  $scope.project = {};
  $scope.projectObj = {};
  $scope.modal = false;
  $scope.reset = function(){
    $scope.project = angular.copy($scope.userObj);
  };
  $scope.create = function (project) {
    var currentTime = new Date().getTime()
    if (Object.keys(project).length !== 11) {
      $scope.error = '* Hay que rellenar todos los campos'
    } else {
      var inicialTime = new Date(project.initialDate)
      var endDate = new Date(project.endDate)

      if (inicialTime >= endDate || inicialTime > currentTime || endDate <= currentTime){
        $scope.error = '* Las fechas no son validas'

      } else {
        project.username = $scope.$parent.username;

        var callback = function (){
          $scope.modal = true;
          $timeout(function(){$scope.modal = false},2000);
        }
        api.createProject(project,callback);

      }
    }
  }
}]);