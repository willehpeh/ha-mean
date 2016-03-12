angular.module('ha-mean-angular', ['angular-storage']).controller('LoginCtrl', LoginCtrl);

function LoginCtrl($scope, $http, store, $window) {
  $scope.login = function() {
    $http.post(
      '/auth/login',
      {username: $scope.username, password: $scope.password})
      .then(function(data) {
        // Get Token and ID from response if successful, store to LocalStorage
        var userToken = data.data.token;
        var userId = data.data.user;
        store.set('user', userId);
        store.set('token', userToken);
        // Redirect to Dashboard with token as argument
        $window.location.href = '/dashboard?token=' + store.get('token');
      }, function(data) {
        // Login failed, display error message
        $scope.errorMessage = data.data.message;
      });
    }
  }
