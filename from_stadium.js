var timed_tweets = {};
function searchTwitter(query) {
  $.ajax({
    url: 'http://search.twitter.com/search.json?' + jQuery.param(query),
    dataType: 'jsonp',
    success: function(data) {
      for (res in data['results']) {
	created_at = data['results'][res]['created_at'].split(',')
	time = created_at[1];
	time = time.substring(1,18);
	if (typeof timed_tweets[time] == 'undefined') {
	  timed_tweets[time] = [data['results'][res]['from_user'] + ' : <p>' + data['results'][res]['text'] + '</p>']
	}
	else {
	  timed_tweets[time].push(data['results'][res]['from_user'] + ' : <p>' + data['results'][res]['text'] + '</p>')
	}
      }
      $(document).trigger('tweets-parsed');
    }
  });
}

function setTime(time) {
  var tweets = $('#tweets');
  tweets.html('');
  msgs = 'NO TWEETS';
  if (typeof timed_tweets[time] != 'undefined')
    msgs = timed_tweets[time];
  tweets.append('<div>' + msgs + '</div><br/>');
}

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
    min: 1339793100,
    max: 1339800600,
    step: 60,
    slide: function(event, ui) {
      console.log(event);
      console.log(ui);
      console.log(ui.value);
    },
    create: function(event, ui) {
      MATCH_DATA.forEach(function(match_event) {
	console.log(match_event);
	$("#slider").append("<div class='event " + match_event['type'] + "' style='left: " + ((match_event['time']/5400.0)*100) + "%'>" + match_event['type'] + " " + match_event['subjects'][0] + " (" + match_event['team'] + ")</div>")
      });
    }
  });

  twitter_params = {
    rpp: 100,
    since_id: 213725087092842497,
    max_id: 213763184979484672,
    geocode: '50.43222,30.51803,1km'
  }
  searchTwitter(twitter_params);
});

$(document).bind('tweets-parsed', function() {
  initial_time = '15 Jun 2012 20:45';
  setTime(initial_time);
});
