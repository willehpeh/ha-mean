function openPhoneMenu() {
  var menuBar = $('.menu-bar');
  var menuArrow = $('#menu-arrow');
  menuBar.css({
    "height" : "20em"
  });
  menuArrow.removeClass('fa-chevron-circle-down');
  menuArrow.addClass('fa-chevron-circle-up');
}

function closePhoneMenu() {
  var menuBar = $('.menu-bar');
  var menuArrow = $('#menu-arrow');
  menuBar.css({
    "height" : "4.5em"
  });
  menuArrow.removeClass('fa-chevron-circle-up');
  menuArrow.addClass('fa-chevron-circle-down');
}

function togglePhoneMenu() {
  var menuArrow = $('#menu-arrow');
  if(menuArrow.hasClass('fa-chevron-circle-down')) {
    openPhoneMenu();
  }
  else if(menuArrow.hasClass('fa-chevron-circle-up')) {
    closePhoneMenu();
  }
  else {
    console.log("Menu error.");
  }
}

$('.close-button').click(function() {
  $('.overlay').fadeOut();
  $('#menu').children().fadeOut();
});

$('.info-button').click(function() {
  $('.project-overlay').fadeIn();
});

$('.project-overlay-close').click(function() {
  $('.project-overlay').fadeOut();
});

$('.close-dashboard-overlay').click(function() {
  $('.dashboard-form').hide();
  $('.dashboard-overlay').fadeOut();
});

$('.new-post').click(function() {
  $('.new-post-form').show();
  $('.dashboard-overlay').fadeIn();
});

$('.new-project').click(function() {
  $('.new-project-form').show();
  $('.dashboard-overlay').fadeIn();
});

$('#logement').change(function() {
  if(this.checked) {
    $('.logement').show();
  }
  else if(!this.checked) {
    $('.logement').hide();
  }
});

$('#industriel').change(function() {
  if(this.checked) {
    $('.industriel').show();
  }
  else if(!this.checked) {
    $('.industriel').hide();
  }
});

$('#public').change(function() {
  if(this.checked) {
    $('.public').show();
  }
  else if(!this.checked) {
    $('.public').hide();
  }
});

$(document).ready(function() {

});
