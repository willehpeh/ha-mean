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
      $('.new-post-form').children().children('.btn').hide();
      $http.post('/api/news', $scope.newPost).then(function() {
        $scope.newPost = {};
        $('.new-post-form').children().children('.btn').show();
        $('.dashboard-form').hide();
        $('.dashboard-overlay').fadeOut();
        getNews();
      });
    } else {
      console.log("Missing data.");
    }
  }

  $scope.openModifyPost = function(id) {
    $('.modify-post-form').show();
    $('.dashboard-overlay').fadeIn();
    $http.get('/api/news/' + id).then(function(data) {
      $scope.modifyPost = data.data;
    });
  }

  $scope.updatePost = function(id) {
    $('.modify-post-form').children().children('.btn').hide();
    $http.put('/api/news/' + id, $scope.modifyPost).then(function() {
      $scope.modifyPost = {};
      $('.modify-post-form').children().children('.btn').show();
      $('.dashboard-form').hide();
      $('.dashboard-overlay').fadeOut();
      getNews();
    });
  }

  $scope.confirmDeletePost = function(id) {
    var postToDelete = $('#' + id);
    var deleteButton = postToDelete.children('.delete-post');
    var confirmDelete = postToDelete.children('.delete-confirm');
    if(confirmDelete.is(":hidden")) {
      confirmDelete
        .show()
        .animate({"width" : "50px"}, 300, "linear");
      deleteButton
        .html("Annuler")
        .removeClass("btn-danger")
        .addClass("btn-warning");
    }
    else {
      confirmDelete.animate({"width" : "0px"}, 300, "linear", function() {
        confirmDelete.hide();
      });
      deleteButton
        .html("Supprimer")
        .removeClass("btn-warning")
        .addClass("btn-danger");
    }
  }

  $scope.deletePost = function(id) {
    var postToDelete = $('#' + id);
    var deleteConfirmButton = postToDelete.children('.delete-confirm').children('.delete-confirm-cross');
    deleteConfirmButton
      .removeClass("fa-close")
      .addClass("fa-spinner")
      .addClass("spinning");
    $http.delete('/api/news/' + id).then(function() {
      getNews();
    });
  }
}
