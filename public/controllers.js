var listAppControllers = angular.module('listAppControllers', [])

listAppControllers.controller('sidenav-controller', ['$scope', '$route',function($scope, $route) {
  $scope.$route = $route;
}]);

listAppControllers.controller('movie-list-controller', function($scope, mongoFactory) {
    $scope.mongoStuff = {};
    $scope.menu = 'add-edit'
    mongoFactory.getMongoStuff()
    .then(function (movies) {
      $scope.mongoStuff = movies;
    }, function (error) {
      console.error(error);
    });
    $scope.changeMenu = function(newmenu) {
      $scope.menu = newmenu;
    };
});

listAppControllers.factory('mongoFactory', function ($q, $http) {
  return {
    getMongoStuff: function () {
      var deferred = $q.defer()
      var httpPromise = $http.get('/movie-list');
      httpPromise.success(function (movies) {
        deferred.resolve(movies);
      })
        .error(function (error) {
          console.error('Error: ' + error);
        });
      return deferred.promise;
    }
  };
});
