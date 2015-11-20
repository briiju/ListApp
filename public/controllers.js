var listAppControllers = angular.module('listAppControllers', [])

listAppControllers.controller('sidenav-controller', ['$scope', '$route',function($scope, $route) {
  //follow routes
  $scope.$route = $route;
}]);

listAppControllers.controller('movie-list-controller', ['$scope', '$filter', 'movieQueries', '$rootScope', function($scope, $filter, movieQueries, $rootScope) {
  //handle menu changes
  //console.log('initializing movie list controller');
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

  movieQueries.emit('requestmovies');

  movieQueries.on('sendingmovielist', function(movies) {
    $scope.movies = movies
    //console.log('getting movies from server');
  });
  $scope.sendMovie = function () {
  //console.log('preparing to send movie to server');
    movieQueries.emit('sendmovie', {
      movieName: $scope.moviename,
      addedBy:   'user'
    });
    //console.log('sending movie to server');
    $scope.moviename = '';
    $scope.menu = 'add-edit';
  };
}]);

listAppControllers.controller('movie-search-controller', ['$http', '$scope', function($http, $scope) {
  //Planned on using this controller to query an IMDb API or something in order to test
  //  movie search capabilities. Apparently that's actually illegal...
  //Waiting on a license for an open movie db to go through
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
