
//var myUsername = user;

/*          Controllers                */

var angularListApp = angular.module('angularListApp', [
  'angularMoment',
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
      when('/movie-search', {
        templateUrl: 'partials/movie-search.html',
        //controller: 'movie-search-controller',
        activetab: 'movie-search'
      }).
      otherwise(
        {redirectTo: '/overview'}
      );
  }]
);

$( document ).ready(function() {
});
