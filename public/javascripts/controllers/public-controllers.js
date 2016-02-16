angular.module('ha-mean-angular').controller('ProjectsCtrl', ProjectsCtrl);
angular.module('ha-mean-angular').controller('ProjectDetailCtrl', ProjectDetailCtrl);
angular.module('ha-mean-angular').controller('NewsCtrl', NewsCtrl);
angular.module('ha-mean-angular').controller('PostCtrl', PostCtrl);

function ProjectsCtrl($scope, $http) {
  $http.get('/api/projects').then(
    function(data) {
      console.log(data.data);
      $scope.projects = data.data;
    }, function(data) {
      console.log(data.data);
    }
  );
}

function ProjectDetailCtrl($scope, $http, $routeParams) {

}

function NewsCtrl($scope, $http) {

}

function PostCtrl($scope, $http, $routeParams) {

}
