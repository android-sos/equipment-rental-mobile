angular.module('App.ownerRequests', [])
  .controller('ownerRequestsCtrl', function($scope, $http, $rootScope) {

    $scope.count = 15;


    $scope.start = 0;



    if ($rootScope.loggedIn) {
      // updateResults();
    } else {
      $scope.view = false;
    }

    $scope.doRefresh = function() {
      updateResults();
    }

    $scope.$watch("count", function(newValue) {
      // console.log(newValue);
      window.localStorage.setItem("product_count", newValue);
      updateResults();
    });

    $scope.back = function() {
      if ($scope.start - $scope.count < 0) {
        $scope.viewResults = false;
      } else {
        $scope.viewResults = true;
        $scope.start = $scope.start - $scope.count;
        updateResults();
      }
    }

    $scope.forward = function() {
      if ($scope.start >= $scope.products.total - $scope.count) {
        $scope.viewResults = false;
      } else {
        $scope.viewResults = true;
        $scope.start = $scope.start + $scope.count;
        updateResults();
      }
    }

    function updateResults() {
      $http({
        url: backend + "/p",
        method: 'GET',
        headers: {
          'Start': $scope.start,
          'Count': $scope.count
        }
      }).success(function(data, status, headers, config) {
        console.log(data);
        $scope.products = data;
      }).
      error(function(data, status, headers, config) {
        $scope.error = true;
      }).finally(function() {
        $scope.$broadcast('scroll.refreshComplete');
      });
    }

  });
