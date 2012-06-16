$(document).ready(function() {
  var clientId = '3365ff268278435aa79452ab1f3f80ca';
  
  $(".instagram.search").instagram({
    search: {
      lat: 50.43222,
      lng: 30.51803
    },
    clientId: clientId
  });

  $("#slider").slider({
    create: function(event, ui) {
      MATCH_DATA.forEach(function(match_event) {
        console.log(match_event);
        $("#slider").append("<div class='event " + match_event['type'] + "' style='left: " + ((match_event['time']/5400.0)*100) + "%'>" + match_event['type'] + " " + match_event['subjects'][0] + " (" + match_event['team'] + ")</div>")
      });
    }
  });
});