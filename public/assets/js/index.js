$(document).ready(function() {
  console.log('ready');

  $(document).on('click', '.delete', function(event) {
    var id = $(event.target).parent().attr('value');

    $.post('/delete/' + id, function(res) {

      if(res) {
        $('#card-'+id).remove();
      }
    });
  })

  $(document).on('click', '.favorite', function(event) {

    var id = $(event.target).parent().attr('value');
    var currentFavState = $(event.target).parent().children('i').hasClass('selected');
    var newFavState = null;

    if(currentFavState) newFavState = '0';
      else newFavState = '1';

    $.post('/favorite/' + id + '/' + newFavState, function(res) {

      console.log(res);

      if(res) {
        if(newFavState === '1') $('#fav-' + id).addClass('selected').removeClass('unselected');
        if(newFavState === '0') $('#fav-' + id).removeClass('selected').addClass('unselected');
      }

      else {
        console.log('error during favorite selection.');
      }

    });
  })

})
