
//var myUsername = user;

/*          Controllers                */

var angularListApp = angular.module('angularListApp', [
  'angularMoment',
  'ngRoute',
  'listAppControllers',
  'listAppServices'
])
  .config(function($routeProvider, $locationProvider, $httpProvider) {
    //================================================
    // Check if the user is connected
    //================================================
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
      // Initialize a new promise
      var deferred = $q.defer();
      // Make an AJAX call to check if the user is logged in
      $http.get('/loggedin').success(function(user){
        // Authenticated
        console.log('checking authentication');
        if (user !== '0') {
          deferred.resolve();
          console.log('user is authenticated');
        // Not Authenticated
        } else {
          console.log('user is not authenticated. returned user: ' + user);
          $rootScope.message = 'You need to log in.';
          deferred.reject();
          $location.url('/login');
        }
      });
      return deferred.promise;
    };
    var returnFromGoogle = function($q, $timeout, $http, $location, $rootScope) {
        // Initialize a new promise
        var deferred = $q.defer();
        // Make an AJAX call initiate loggedin
        $http.get('/test').success(function(user) {
          console.log('returned user (0 if undefined): ' + user);
        });
        deferred.resolve();
        return deferred.promise;
    }
    //================================================
    // Add an interceptor for AJAX errors
    //================================================
    $httpProvider.interceptors.push(function($q, $location) {
      return {
        response: function(response) {
          // do something on success
          return response;
        },
        responseError: function(response) {
          if (response.status === 401)
            $location.url('/login');
          return $q.reject(response);
        }
      };
    });
    //================================================
    // Define all the routes
    //================================================
    $routeProvider
      .when('/login', {
        templateUrl: 'partials/login.html',
        activetab: 'login'
      })
      .when('/overview', {
        templateUrl: 'partials/overview.html',
        activetab: 'overview'
      })
      .when('/getAuth', {
        templateUrl: 'partials/overview.html',
        resolve: {
          loggedin: returnFromGoogle
        },
        activetab: 'overview'
      })
      .when('/movie-list', {
        templateUrl: 'partials/movie-list.html',
        controller: 'movieListController',
        activetab: 'movie-list'
      })
      .when('/movie-search', {
        templateUrl: 'partials/movie-search.html',
        //controller: 'movie-search-controller',
        resolve: {
          loggedin: checkLoggedin
        },
        activetab: 'movie-search'
      })
      .when('/settings', {
        templateUrl: 'partials/settings.html',
        //controller: 'settings-controller',
        activetab: 'settings'
      })
      .otherwise({
        redirectTo: '/overview'
      });
  })
  .run(function($rootScope, $http){
    $rootScope.message = '';
    // Logout function is available in any pages
    $rootScope.logout = function(){
      $rootScope.message = 'Logged out.';
      $http.post('/logout');
    };
  });

angularListApp.directive('clickOff', function($parse, $document) {
  var dir = {
    compile: function($element, attr) {
      // Parse the expression to be executed
      // whenever someone clicks _off_ this element.
      var fn = $parse(attr["clickOff"]);
      return function(scope, element, attr) {
        // add a click handler to the element that
        // stops the event propagation.
        element.bind("click", function(event) {
          event.stopPropagation();
        });
        angular.element($document[0].body).bind("click", function(event) {
            scope.$apply(function() {
                fn(scope, {$event:event});
            });
        });
      };
    }
  };
  return dir;
});

$( document ).ready(function() {
});
