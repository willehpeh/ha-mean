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

$(document).ready(function() {

});
