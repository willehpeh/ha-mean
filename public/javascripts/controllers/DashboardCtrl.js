angular.module('ha-mean-angular', ['angular-storage', 'ngFileUpload']).controller('DashboardCtrl', DashboardCtrl);

// Controller for Dashboard page

function DashboardCtrl($scope, $http, store, $window, Upload, $timeout) {

  $scope.title = "Dashboard";

  // Allows uploading of images
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

  // Refresh projects
  var getProjects = function() {
    $http.get('/api/projects/').then(
      function(data) {
        $scope.projects = data.data;
      }, function(data) {
        console.log(data);
      }
    );
  }

  // Refresh news
  var getNews = function() {
    $http.get('/api/news').then(function(data) {
      $scope.posts = data.data;
    }, function(data) {
      console.log(data);
    });
  }

  getProjects();
  getNews();


  // Logout of Dashboard
  $scope.logout = function() {
    store.remove('token');
    $window.location.href = "/auth/login";
  }


  // Opens overlay to change password
  $scope.openChangePassword = function() {
    $('.change-password-form').show();
    $('.dashboard-overlay').fadeIn();
  }

  // Does actual password changing
  $scope.changePasswordConfirm = function() {
    var oldPassword = $scope.changePassword.oldPassword;
    var newPassword = $scope.changePassword.newPassword;
    var newPasswordCheck = $scope.changePassword.newPasswordCheck;
    var userId = store.get('user');
    if(newPassword != newPasswordCheck) {
      $scope.passwordMessage = "Le nouveau mot de passe et sa vérification ne sont pas les mêmes."
    }
    else if(newPassword == newPasswordCheck) {
      $('.change-password-form').children().children('.btn').hide();
      $http.put('/api/change-pw/' + userId, $scope.changePassword, {headers: {'X-Access-Token' : store.get('token')}}).then(function(data) {
        $scope.passwordMessage = data.data.message;
        $timeout(function() {
          $scope.changePassword = {};
          $('.change-password-form').children().children('.btn').show();
          $('.dashboard-form').hide();
          $('.dashboard-overlay').fadeOut();
        }, 2000);
      }, function(data) {
        $window.location.href = '/dashboard';
      });
    }
  }

  // Saves new post entered in New Post overlay
  $scope.saveNewPost = function() {
    if($scope.newPost.title && $scope.newPost.text) {
      $('.new-post-form').children().children('.btn').hide();
      $http.post('/api/news', $scope.newPost, {headers: {'X-Access-Token' : store.get('token')}}).then(function() {
        $scope.newPost = {};
        $('.new-post-form').children().children('.btn').show();
        $('.dashboard-form').hide();
        $('.dashboard-overlay').fadeOut();
        getNews();
      }, function(data) {
        $window.location.href = '/dashboard';
      });
    } else {
      console.log("Missing data.");
    }
  }

  // Opens Modify Post overlay
  $scope.openModifyPost = function(id) {
    $('.modify-post-form').show();
    $('.dashboard-overlay').fadeIn();
    $http.get('/api/news/' + id).then(function(data) {
      $scope.modifyPost = data.data;
    });
  }

  // Saves post entered in Modify Post overlay
  $scope.updatePost = function(id) {
    $('.modify-post-form').children().children('.btn').hide();
    $http.put('/api/news/' + id, $scope.modifyPost, {headers: {'X-Access-Token' : store.get('token')}}).then(function() {
      $scope.modifyPost = {};
      $('.modify-post-form').children().children('.btn').show();
      $('.dashboard-form').hide();
      $('.dashboard-overlay').fadeOut();
      getNews();
    }, function(data) {
      $window.location.href = '/dashboard';
    });
  }

  // Displays Delete Post button
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

  // Deletes Post
  $scope.deletePost = function(id) {
    var postToDelete = $('#' + id);
    var deleteConfirmButton = postToDelete.children('.delete-confirm').children('.delete-confirm-cross');
    deleteConfirmButton
      .removeClass("fa-close")
      .addClass("fa-spinner")
      .addClass("spinning");
    $http.delete('/api/news/' + id, {headers: {'X-Access-Token' : store.get('token')}}).then(function() {
      getNews();
    }, function(data) {
      $window.location.href = '/dashboard';
    });
  }

  // Opens Delete Project button
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

  // Deletes project
  $scope.deleteProject = function(id) {
    var projectToDelete = $('#' + id);
    var deleteConfirmButton = projectToDelete.children('.delete-confirm').children('.delete-confirm-cross');
    deleteConfirmButton
      .removeClass("fa-close")
      .addClass("fa-spinner")
      .addClass("spinning");
    $http.delete('/api/projects/' + id, {headers: {'X-Access-Token' : store.get('token')}}).then(function() {
      getProjects();
    }, function(data) {
      $window.location.href = '/dashboard';
    });
  }

  // Saves project entered in New Project overlay
  $scope.saveNewProject = function() {
    if($scope.newProject.name) {
      $('.new-project-form').children().children('.btn').hide();
      $http.post('/api/projects', $scope.newProject, {headers: {'X-Access-Token' : store.get('token')}}).then(function() {
        $scope.newProject = {};
        $('.new-project-form').children().children('.btn').show();
        $('.dashboard-form').hide();
        $('.dashboard-overlay').fadeOut();
        getProjects();
      }, function(data) {
        $window.location.href = '/dashboard';
      });
    } else {
      console.log("Missing data.");
    }
  }

  // Opens Modify Project overlay
  $scope.openModifyProject = function(id) {
    $('.modify-project-form').show();
    $('.dashboard-overlay').fadeIn();
    $http.get('/api/projects/' + id).then(function(data) {
      $scope.modifyProject = data.data;
    });
  }

  // Saves project in Modify Project overlay
  $scope.updateProject = function(id) {
    $('.modify-project-form').children().children('.btn').hide();
    $http.put('/api/projects/' + id, $scope.modifyProject, {headers: {'X-Access-Token' : store.get('token')}}).then(function() {
      $scope.modifyProject = {};
      $('.modify-project-form').children().children('.btn').show();
      $('.dashboard-form').hide();
      $('.dashboard-overlay').fadeOut();
      getProjects();
    }, function(data){
      $window.location.href = '/dashboard';
    });
  }

  // Displays photo delete buttons
  $scope.prepareDeletePhoto = function(id) {
    var deleteButtons = $('#' + id).children('.project-images').children('.project-photo').children('.photo-delete-button');
    var mainDeleteButton = $('#' + id).children('.prepare-delete-photo');
    if(deleteButtons.is(':hidden')) {
      deleteButtons.fadeIn();
      mainDeleteButton
        .removeClass('btn-danger')
        .addClass('btn-warning')
        .html('Terminé');
    } else {
      deleteButtons.fadeOut();
      mainDeleteButton
        .addClass('btn-danger')
        .removeClass('btn-warning')
        .html('Supprimer une image');
    }
  }

  // Deletes selected photo
  $scope.deletePhoto = function(photo, id) {
    if(photo === "/images/placeholder.jpg") {
      photo = photo.substring(8);
    } else {
      photo = photo.substring(16);
    }
    $http.delete("/api/projects/" + id + "/rem-image/" + photo, {headers: {'X-Access-Token' : store.get('token')}}).then(function() {
      getProjects();
    }, function(data) {
      $window.location.href = '/dashboard';
    });
  }
}
