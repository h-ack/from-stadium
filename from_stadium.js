$(document).ready(function() {
  var clientId = '3365ff268278435aa79452ab1f3f80ca';
  
  $(".instagram.search").instagram({
    search: {
      lat: 50.43222,
      lng: 30.51803
    },
    clientId: clientId
  });

  $("#slider").slider();
});