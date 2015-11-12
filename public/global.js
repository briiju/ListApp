
//var myUsername = user;

/*          Controllers                */

var angularListApp = angular.module('angularListApp', [
  'ngRoute',
  'listAppControllers'
]);

angularListApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/login', {
        templateUrl: 'partials/login.html'
      }).
      when('/overview', {
        templateUrl: 'partials/overview.html',
        activetab: 'overview'
      }).
      when('/movie-list', {
        templateUrl: 'partials/movie-list.html',
        controller: 'movie-list-controller',
        activetab: 'movie-list'
      }).
      otherwise(
        {redirectTo: '/overview'}
      );
  }]
);

$( document ).ready(function() {
});
