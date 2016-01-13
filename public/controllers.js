var listAppControllers = angular.module('listAppControllers', []);
var listAppServices = angular.module('listAppServices', []);

listAppControllers.controller('ui-controller', ['$scope', '$route', function($scope, $route) {
  //follow routes
  $scope.$route = $route;
  $scope.activeDrop = "none";
  $scope.search = [];

  //alertify.success('initializing UI Controller');


  $scope.toggleDropdown = function(evt) {
    var target = evt.currentTarget.attributes['data-target'].value;
    var targetObject = document.querySelector(target);
    var targetContent = $(target + " li");

    if ($scope.activeDrop == target) { //if the target is the same as the previous drop, close the target drop
      $scope.animateDropdown(targetObject, targetContent, 'hide');
      $scope.activeDrop = "none";
    } else if ($scope.activeDrop == "none") { //if there was no previous drop, just open the target drop
      $scope.animateDropdown(targetObject, targetContent, 'show');
      $scope.activeDrop = target;
    } else if ($scope.activeDrop != target && $scope.activeDrop != "none") { //if there was a previous drop open, close it then open the target
      var targetObject1 = document.querySelector($scope.activeDrop);
      var targetContent1 = $($scope.activeDrop + " li");
      $scope.animateDropdown(targetObject1, targetContent1, 'hide');
      $scope.animateDropdown(targetObject, targetContent, 'show');
      $scope.activeDrop = target;
    }
  };

  $scope.closeDropdown = function(target) {
    if (target == $scope.activeDrop) {
      var targetObject = document.querySelector(target);
      var targetContent = $(target + " li");
      $scope.animateDropdown(targetObject, targetContent, 'hide');
      $scope.activeDrop = "none";
    }
  }

  $scope.animateDropdown = function(object, content, intent) {
    if (intent == "show") {
      dynamics.animate(object, {
        opacity: 1,
        scale: 1
      }, {
        type: dynamics.spring,
        frequency: 200,
        friction: 270,
        duration: 800
      })
      for(var i=0; i<content.length; i++) {
        var item = content[i];
        dynamics.css(item, {
          opacity: 0,
          translateY: 20
        })
        dynamics.animate(item, {
          opacity: 1,
          translateY: 0
        }, {
          type: dynamics.spring,
          frequency: 300,
          friction: 435,
          duration: 1000,
          delay: 100 + i * 40
        })
      }
    } else if (intent == "hide") {
      dynamics.animate(object, {
        opacity: 0,
        scale: .1
      }, {
        type: dynamics.easeInOut,
        duration: 300,
        friction: 100
      })
    }
  }
}]);

listAppControllers.controller('movieListController', ['$scope', '$filter', 'movieQueries', '$rootScope', function($scope, $filter, movieQueries, $rootScope) {
  //handle menu changes
  //console.log('initializing movie list controller');

  $scope.movieToEdit = '';
  $scope.movieTab = "fullMovieList";
  $scope.randomWatchedFilter = "Not Watched";
  $scope.randomMovieResult = '';

  $scope.getRandomMovie = function() {
    //don't forget to actually filter based on the choices
    $scope.randomMovieResult = $scope.movies[Math.floor((Math.random()*$scope.movies.length))].movieName;
  }

  $scope.changeTab = function(targetTab) {
    $scope.movieTab = targetTab;
  }

  $scope.enableEdits = function(movieID) {
    if ($scope.movieToEdit == movieID) {
      $scope.movieToEdit = '';
    } else {
      $scope.movieToEdit = movieID;
    }
    //alertify.success($scope.movieToEdit)
  }

  $scope.changeMovieParameter = function(movieID) {
    alertify.error('Movie edits disabled until logins are implemented');
    $scope.movieToEdit = '';
    //take in changes as parameters
    //send changes to server
    //have server update clients
  }

  $scope.menu = 'add-edit'
  $scope.changeMenu = function(newMenu) {
    $scope.menu = newMenu;
    $scope.movieToEdit = '';
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
    if ($scope.moviename == '') {
      alertify.error('Movie name cannot be blank');
      return;
    }
    movieQueries.emit('sendmovie', {
      movieName: $scope.moviename,
      addedBy:   $scope.addedby
    });
    //console.log('sending movie to server');
    $scope.moviename = '';
    $scope.menu = 'add-edit';
  };
}]);

listAppControllers.controller('movie-search-controller', [function() {
  //Planned on using this controller to query an IMDb API or something in order to test
  //  movie search capabilities. Apparently that's actually illegal...
  //Waiting on a license for an open movie db to go through
}]);

//handle movie-list database queries
listAppServices.factory('movieQueries', function ($rootScope) {
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
