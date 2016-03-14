angular.module('ha-mean-angular').controller('ProjectsCtrl', ProjectsCtrl);
angular.module('ha-mean-angular').controller('ProjectDetailCtrl', ProjectDetailCtrl);
angular.module('ha-mean-angular').controller('NewsCtrl', NewsCtrl);
angular.module('ha-mean-angular').controller('PostCtrl', PostCtrl);
angular.module('ha-mean-angular').controller('HomeCtrl', HomeCtrl);
angular.module('ha-mean-angular').controller('ContactCtrl', ContactCtrl);


// Home page controller
function HomeCtrl($scope, $http, $timeout, $interval) {
  $http.get('/api/home').then(
    function(data) {
      $scope.data = data.data;
      $scope.photoArray = [];
      var container = $('.background-container');
      var index = 0;
      for(i=0;i<$scope.data.length;i++) {
        for(j=0;j<$scope.data[i].photos.length;j++) {
          $scope.photoArray.push($scope.data[i].photos[j]);
        }
      }

      container.css({
        'background-image' : 'url(' + $scope.photoArray[index] + ')'
      });

      var resetSlider = function() {
        index = 0;
        container.css({
          'background-image' : 'url(' + $scope.photoArray[index] + ')'
        });
      }

      var fadeBackOut = function(callback) {
        container.animate({opacity:0}, 1000, function() {
          container.css({
            'background-image' : 'url(' + $scope.photoArray[++index] + ')'
          });
          if(index == $scope.photoArray.length) {
            resetSlider();
          }
          callback();
        });
      }

      var fadeBackIn = function() {
        container.animate({opacity:1}, 1000);
      }

      $interval(function() {
        fadeBackOut(fadeBackIn);
      }, 8000);
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

function ProjectDetailCtrl($scope, $http, $window, $location, $interval) {
  var id = $window.location.search;
  id = id.substring(4,id.length);
  var index = 0
  var container = $('.project-background-image');
  var slideshowContainer = $('.slideshow-image-container');

  $scope.nextImage = function() {
    index++;
    selectImage(index);
  }

  $scope.prevImage = function() {
    if(index === 0) {
      slideshowContainer.css({
        'left' : -($scope.photoArray.length*100) + "%"
      });
      index = $scope.photoArray.length - 1;
      selectImage(index);
    }
    else {
      index--;
      selectImage(index);
    }
  }

  $scope.moveToImage = function(id) {
    index = id;
    selectImage(index);
  }

  var selectImage = function(id) {
    slideshowContainer.animate({
      'left' : -id*100 + '%'
    }, 1000, function() {
      if(index === $scope.photoArray.length) {
        index = 0;
        slideshowContainer.css({
          'left' : '0%'
        });
        $('#button0').addClass('selected');
        $('#button0').siblings().removeClass('selected');
      }
    });
    $('#button' + id).addClass('selected');
    $('#button' + id).siblings().removeClass('selected');
  }

  $http.get('/api/projects/' + id).then(
    function(data) {
      $scope.project = data.data;
      $scope.photoArray = $scope.project.photos;
      $scope.smallArray = $scope.photoArray.slice(0, 2);
      container.css({
        'background-image' : 'url(' + $scope.photoArray[0] + ')'
      });
      $('.slideshow-image-container').css({
        'width' : ($scope.photoArray.length + 1) * 100 + "%"
      });
      $('#looper').css({
        'background-image' : 'url(' + $scope.photoArray[0] + ')'
      });
      $interval(function() {
        $scope.nextImage();
      }, 8000);
    }
  );
}

function NewsCtrl($scope, $http) {
  $http.get('/api/news').then(
    function(data) {
      var posts = data.data;
      for(i=0;i<posts.length;i++) {
        posts[i].year = posts[i].created_at.substr(0, 4);
        posts[i].month = posts[i].created_at.substr(5, 2);
        posts[i].day = posts[i].created_at.substr(8, 2);
        posts[i].time = posts[i].created_at.substr(11, 5);
      }
      $scope.news = data.data;
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

function ContactCtrl($scope, $http) {
  $scope.sendEmail = function() {
    $http.post('/api/contact', $scope.contact).then(
      function(data) {
        $scope.sentMessage = "Message envoyé.";
        $scope.contact = {};
      }, function(data) {
        $scope.sentMessage = "Une erreur est survenue."
      }
    );
  }
}
