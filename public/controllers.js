var listAppControllers = angular.module('listAppControllers', [])

listAppControllers.controller('sidenav-controller', ['$scope', '$route',function($scope, $route) {
  //follow routes
  $scope.$route = $route;
}]);

listAppControllers.controller('movie-list-controller', ['$scope', '$filter', 'movieQueries', function($scope, $filter, movieQueries) {
  //handle menu changes
  $scope.menu = 'add-edit'
  $scope.changeMenu = function(newmenu) {
    $scope.menu = newmenu;
  };

  //handle sorting
  var orderBy = $filter('orderBy');
  $scope.order = function(predicate, reverse) {
    $scope.movies = orderBy($scope.movies, predicate, reverse);
  };
  $scope.order('', false);
  $scope.now = new Date();
  //handle movie queries
  $scope.movies = {};
  $scope.moviename = '';
  movieQueries.on('sendingmovielist', function(movies) {
    $scope.movies = movies
  });
  $scope.sendMovie = function () {
    movieQueries.emit('sendmovie', {
      movieName: $scope.moviename,
      addedBy:   'user'
    });
    $scope.moviename = '';
    $scope.menu = 'add-edit';
  };
}]);

listAppControllers.controller('movie-search-controller', ['$http', '$scope', function($http, $scope) {
  //$scope.url = "http://www.omdbapi.com/?t=big%20hero&y=&plot=short&r=json"

  $scope.searchMovie = function () {

    //$http.get("http://www.omdbapi.com/?t=big+hero&y=&plot=short&r=json").success(function(data) {
    $http.get("https://angularjs.org/greet.php?callback=JSON_CALLBACK&name=Super%20Hero").success(function(data) {
      console.log(data);
    });
  }
}]);

listAppControllers.factory('movieQueries', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      })
    }
  };
});
