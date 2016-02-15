angular.module('ha-mean-angular').controller('LoginCtrl', LoginCtrl);

function LoginCtrl($scope, $http) {
  $scope.login = function() {
    $http.post(
      '/auth/login',
      {username: $scope.username, password: $scope.password})
      .then(function(data) {
        $scope.errorMessage = data.data.message;
      }, function(data) {
        $scope.errorMessage = data.data.message;
      });
    }
  }
