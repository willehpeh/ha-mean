angular.module('ha-mean-angular', ['angular-storage']).controller('DashboardCtrl', DashboardCtrl);

function DashboardCtrl($scope, $http) {
  $scope.title = "Dashboard";
  $http.get('/api/projects/').then(
    function(data) {
      $scope.projects = data.data;
    }, function(data) {
      console.log(data);
    }
  );
  $http.get('/api/news').then(
    function(data) {
      $scope.posts = data.data;
    }, function(data) {
      console.log(data);
    }
  );
}
