var apiService = angular.module("apiService", []);

apiService.service('api',['$http',function ($http) {

    this.getProjects = function(){
        $http.get('http://s525041140.mialojamiento.es/bitacora/').
            success(function(data, staus, headers, config){
               console.log(data)
            }).
            error(function(data, staus, headers, config){
                console.log("ERROR")
            });
    };

    this.singin = function(data){
      // send mail to confirm email account
        if(data.r_password === data.password) {
            delete data.r_password;
            $http.post('http://aiocs.es/users/', data)
                .success(function (data, status, headers, config) {
                    console.log("HEADER: " + headers)
                    console.log("DATA: " + JSON.stringify(data))
                    console.log("STATUS: " + status)
                })
                .error(function (data, status) {
                    console.log("DATA ER: " + data)
                    console.log("STATUS: " + status);
                });
        }
    };
    /*
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
    */

}]);
