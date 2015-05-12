angular.module('TecnoCrown')
  .controller('HomeCtrl', function($scope) {
    $scope.crowfounding = [
    {name:'TecnoCrown',link:'www.tecnocrown.html',description:'Projecto para la construccion de un portal web',current:'15.000',remain:'21',needed:'30.000',img:'images/proy1.png',id:'1'},
    {name:'Polymer',link:'www.prueba.html',description:'Desarrollo de web component mediante tecnología Polymer',current:'15.000',remain:'21',needed:'30.000',img:'images/imagen2.png', id: '2'},
    {name:'AngularJs',link:'www.prueba.html',description:'Desarrollo de librerias para representación de gráficos',current:'15.000',remain:'21',needed:'30.000',img:'images/angularjs.jpg', id:'3'}
  ];
});