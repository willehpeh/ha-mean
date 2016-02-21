angular.module('ha-mean-angular', ['angular-storage']).controller('DashboardCtrl', DashboardCtrl);

function DashboardCtrl($scope, $http, store, $window) {

  $scope.title = "Dashboard";

  $http.get('/api/projects/').then(
    function(data) {
      $scope.projects = data.data;
    }, function(data) {
      console.log(data);
    }
  );

  var getNews = function() {
    $http.get('/api/news').then(function(data) {
      $scope.posts = data.data;
    }, function(data) {
      console.log(data);
    });
  }
  getNews();

  $scope.logout = function() {
    store.remove('token');
    $window.location.href = "/auth/login";
  }
  $scope.saveNewPost = function() {
    if($scope.newPost.title && $scope.newPost.text) {
      $http.post('/api/news', $scope.newPost).then(function() {
        $scope.newPost = {};
        $('.dashboard-form').hide();
        $('.dashboard-overlay').fadeOut();
        getNews();
      });
    } else {
      console.log("Missing data.");
    }
  }
}
