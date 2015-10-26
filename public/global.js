var socket = io();
var myUsername = null;

/*          Main page                  */
// change pages
$('.sidenavselect').click(function() {
  var name = $(this).attr('data-target');
  console.log('showing ' + name);
  $('.contentDivs').addClass('.notshown');
  $('.sidenavselect').removeClass('active');
  $(name).removeClass('.notshown');
  $(this).addClass('active');
});


/*           MovieList page             */

// submit movie event
$('#submitmovie').click(function () {
  socket.emit('save movie', $('#movienameinput').val());
  $('#movienameinput').val('');
  return false;
});

// Add a movie to the list
socket.on('save entry', function(moviename){
  var rownum = 1 + $('#movietable > tbody > tr').length;
  var rowinfo = '<tr><td>' + rownum + '</td><td>' + moviename + '</td></tr>';
  $('#movietable > tbody:last-child').append(rowinfo);
});
