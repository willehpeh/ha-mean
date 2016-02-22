$('.menu-button').click(function() {
  $('.overlay').fadeIn();
  $('#menu').children().each(function(i) {
    var self = $(this);
    setTimeout(function() {
      self.fadeIn(1000);
    }, i*50);
  });
});
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

$(document).ready(function() {

});
