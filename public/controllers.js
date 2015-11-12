var listAppControllers = angular.module('listAppControllers', [])

listAppControllers.controller('sidenav-controller', ['$scope', '$route',function($scope, $route) {
  //follow routes
  $scope.$route = $route;
}]);

listAppControllers.controller('movie-list-controller', function($scope, movieQueries) {
  //handle menu changes
  $scope.menu = 'add-edit'
  $scope.changeMenu = function(newmenu) {
    $scope.menu = newmenu;
  };
  //handle movie queries
  $scope.movies = {};
  $scope.moviename = '';
  /*
  mongoFactory.getMongoStuff()
  .then(function (movies) {
    $scope.movies = movies;
  }, function (error) {
    console.error(error);
  });
  */

  movieQueries.on('sendingmovielist', function(movies) {
    $scope.movies = movies
  });

  $scope.sendMovie = function () {
    movieQueries.emit('sendmovie', {
      movieName: $scope.moviename,
      addedBy:   'user'
    });
    //$scope.moviename = '';
    $scope.menu = 'add-edit';
  };
});

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
