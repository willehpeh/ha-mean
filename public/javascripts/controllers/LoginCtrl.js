angular.module('ha-mean-angular', ['angular-storage']).controller('LoginCtrl', LoginCtrl);

function LoginCtrl($scope, $http, store, $window) {
  $scope.login = function() {
    $http.post(
      '/auth/login',
      {username: $scope.username, password: $scope.password})
      .then(function(data) {
        var userToken = data.data.token;
        store.set('token', userToken);
        $window.location.href = '/dashboard?token=' + store.get('token');
      }, function(data) {
        $scope.errorMessage = data.data.message;
      });
    }
  }
