angular.module('ha-mean-angular').controller('LoginCtrl', LoginCtrl);

function LoginCtrl($scope, $http) {
  $scope.login = function() {
    $http.post(
      '/auth/login',
      {username: $scope.username, password: $scope.password})
      .then(function(data) {
        $http.get('/dashboard', { headers : { 'X-Access-Token' : data.data.token }});
      }, function(data) {
        $scope.errorMessage = data.data.message;
      });
    }
  }
