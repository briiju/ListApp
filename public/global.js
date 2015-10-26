var socket = io();
var myUsername = null;

$( document ).ready(function() {
  alertify.defaults = {
    // notifier defaults
    notifier:{
      // auto-dismiss wait time (in seconds)
      delay:5,
      // default position
      position:'bottom-right'
    }
  };
});

/*          Main page                  */
// change pages
$('.side-nav-select').click(function() {
  var name = $(this).attr('data-target');
  console.log('showing ' + name);
  $('.content-div').addClass('notshown');
  $('.side-nav-select').removeClass('active');
  $(name).removeClass('notshown');
  $(this).addClass('active');
});


/*           MovieList page             */

// submit movie event
$('#submit-movie').click(function () {
  var movieName = $('#movie-name-input').val();
  if (!movieName){
    alertify.error('Movie name cannot be blank');
    return;
  }
  $('.movie-input-group').addClass('notshown');
  $('#movie-add-edit').removeClass('notshown');
  socket.emit('save movie', movieName);
  $('#movie-name-input').val('');
  return false;
});
$('.movie-option-button').click(function() {
  var name = $(this).attr('data-target');
  console.log('showing ' + name);
  $('.movie-input-group').addClass('notshown');
  $(name).removeClass('notshown');
});

// Add a movie to the list
socket.on('save entry', function(moviename){
  var rownum = 1 + $('#movie-table > tbody > tr').length;
  var rowinfo = '<tr><td>' + rownum + '</td><td>' + moviename + '</td></tr>';
  $('#movie-table > tbody:last-child').append(rowinfo);
});
