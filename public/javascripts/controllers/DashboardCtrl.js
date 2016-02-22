angular.module('ha-mean-angular', ['angular-storage', 'ngFileUpload']).controller('DashboardCtrl', DashboardCtrl);

function DashboardCtrl($scope, $http, store, $window, Upload) {

  $scope.title = "Dashboard";

  $scope.upload = function(file, id) {
    Upload.upload({
      url: "/api/projects/" + id + "/add-image",
      data: {file: file}
    }).then(function() {
        $('#' + id).children('.project-images').children('.progress').hide();
        getProjects();
      }, function(err) {
        console.log(err)
      }, function(evt) {
        var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
        $('#' + id).children('.project-images').children('.progress').show();
        $('#' + id).children('.project-images').children('.progress').children('.progress-bar').css({
          "width" : progressPercentage
        }).html(progressPercentage);
      }
    );
  }

  var getProjects = function() {
    $http.get('/api/projects/').then(
      function(data) {
        $scope.projects = data.data;
      }, function(data) {
        console.log(data);
      }
    );
  }

  var getNews = function() {
    $http.get('/api/news').then(function(data) {
      $scope.posts = data.data;
    }, function(data) {
      console.log(data);
    });
  }

  getProjects();
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

  $scope.confirmDeleteProject = function(id) {
    var projectToDelete = $('#' + id);
    var deleteButton = projectToDelete.children('.delete-project');
    var confirmDelete = projectToDelete.children('.delete-confirm');
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

  $scope.deleteProject = function(id) {
    var projectToDelete = $('#' + id);
    var deleteConfirmButton = projectToDelete.children('.delete-confirm').children('.delete-confirm-cross');
    deleteConfirmButton
      .removeClass("fa-close")
      .addClass("fa-spinner")
      .addClass("spinning");
    $http.delete('/api/projects/' + id).then(function() {
      getProjects();
    });
  }

  $scope.saveNewProject = function() {
    if($scope.newProject.name && $scope.newProject.description && $scope.newProject.family) {
      $('.new-project-form').children().children('.btn').hide();
      $http.post('/api/projects', $scope.newProject).then(function() {
        $scope.newProject = {};
        $('.new-project-form').children().children('.btn').show();
        $('.dashboard-form').hide();
        $('.dashboard-overlay').fadeOut();
        getProjects();
      });
    } else {
      console.log("Missing data.");
    }
  }

  $scope.openModifyProject = function(id) {
    $('.modify-project-form').show();
    $('.dashboard-overlay').fadeIn();
    $http.get('/api/projects/' + id).then(function(data) {
      $scope.modifyProject = data.data;
    });
  }

  $scope.updateProject = function(id) {
    $('.modify-project-form').children().children('.btn').hide();
    $http.put('/api/projects/' + id, $scope.modifyProject).then(function() {
      $scope.modifyProject = {};
      $('.modify-project-form').children().children('.btn').show();
      $('.dashboard-form').hide();
      $('.dashboard-overlay').fadeOut();
      getProjects();
    });
  }
}
