angular.module('ha-mean-angular').controller('ProjectsCtrl', ProjectsCtrl);
angular.module('ha-mean-angular').controller('ProjectDetailCtrl', ProjectDetailCtrl);
angular.module('ha-mean-angular').controller('NewsCtrl', NewsCtrl);
angular.module('ha-mean-angular').controller('PostCtrl', PostCtrl);
angular.module('ha-mean-angular').controller('HomeCtrl', HomeCtrl);

function HomeCtrl($scope, $http) {
  $http.get('/api/home').then(
    function(data) {
      $scope.data = data.data;
      for(i=0;i<$scope.data.length;i++) {
        for(j=0;j<$scope.data[i].photos.length;j++) {
          console.log($scope.data[i].photos[j]);
        }
      }
    }, function(data) {
      console.log(data.data);
    }
  );
}

function ProjectsCtrl($scope, $http, $window) {
  $http.get('/api/projects').then(
    function(data) {
      console.log(data.data);
      $scope.projects = data.data;
    }, function(data) {
      console.log(data.data);
    }
  );
  $scope.openProject = function(id) {
    $window.location.href = "/project-detail/?id=" + id;
  }
}

function ProjectDetailCtrl($scope, $http, $window, $location) {
  var id = $window.location.search;
  id = id.substring(4,id.length);
  $http.get('/api/projects/' + id).then(
    function(data) {
      $scope.project = data.data;
      console.log($scope.project);
    }, function(data) {
      console.log(data.data);
    }
  );
}

function NewsCtrl($scope, $http) {
  $http.get('/api/news').then(
    function(data) {
      $scope.news = data.data;
      console.log($scope.news);
    }, function(data) {
      console.log(data.data);
    }
  );
}

function PostCtrl($scope, $http, $window, $location) {
  var id = $window.location.search;
  id = id.substring(4, id.length);
  $http.get('/api/news/' + id).then(
    function(data) {
      $scope.post = data.data;
      console.log($scope.post);
    }, function(data) {
      console.log(data.data);
    }
  )
}
