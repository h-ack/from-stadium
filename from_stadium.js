var timed_tweets = {};
var photos = {};

function searchTwitter(query) {
  $.ajax({
    url: 'http://search.twitter.com/search.json?' + jQuery.param(query),
    dataType: 'jsonp',
    success: function(data) {
      for (res in data['results']) {
       created_at = data['results'][res]['created_at'].split(',')
       time = created_at[1];
       time = time.substring(1,18);
       time = Date.parse(time);
       time = Math.floor(time / 1000);
       time = time - (time % 60) + (3600 * 2);
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
  time = time - (time % 60);
  console.log(time);
  if (typeof timed_tweets[time] != 'undefined')
    msgs = timed_tweets[time];
  console.log('<div>' + msgs + '</div><br/>');
  tweets.append('<div>' + msgs + '</div><br/>');
}

function showPhotos(time) {
  console.log("showPhotos: " + time);
  var photo_array = photos[time];
  console.log("photo_array: ");
  if (typeof photo_array != 'undefined') {
    $('#photos').html('');
    photo_array.forEach(function(photo) {
      console.log(photo);
      $('#photos').append($('<div>')
        .addClass('instagram-placeholder')
        .attr('id', photo.id)
        .append(
          $('<a>')
            .attr('target', '_blank')
            .attr('href', photo.link)
            .append(
              $('<img>')
                .addClass('instagram-image')
                .attr('src', photo.images.thumbnail.url)
            )
        )
      );
    })
  }
}

$(document).ready(function() {
  var clientId = '3365ff268278435aa79452ab1f3f80ca';
  var stadiumCoords = [50.43222, 30.51803]

  $(".instagram.search").instagram({
    search: {
      lat: stadiumCoords[0],
      lng: stadiumCoords[1],
      min_timestamp: 1339793100,
      max_timestamp: 1339800600
    },
    clientId: clientId,
    onComplete: function(data, res) {
      for (photo in res['data']) {
       time = (res['data'][photo]['created_time']);
       time = time - (time % 60)
       picture = res['data'][photo]
       if (typeof photos[time] == 'undefined') {
         photos[time] = [picture]
       }
       else {
         photos[time].push(picture)
       }
      }
    }
  });

  $("#slider").slider({
    min: 1339793100,
    max: 1339800600,
    step: 60,
    slide: function(event, ui) {
      console.log(ui.value);
      time = ui.value;
      setTime(time);
      time = time - (time % 60);
      console.log(time);
      console.log(photos[time]);
      console.log(timed_tweets[time]);
      showPhotos(time);
    },
    create: function(event, ui) {
      MATCH_DATA.forEach(function(match_event) {
       $("#slider").append("<div class='event " + match_event['type'] + "' style='left: " + ((match_event['time']/5400.0)*100) + "%'>" + match_event['type'] + " " + match_event['subjects'][0] + " (" + match_event['team'] + ")</div>")
     });
    }
  });

  twitter_params = {
    rpp: 100,
    since_id: 213725087092842497,
    max_id: 213763184979484672,
    geocode: stadiumCoords[0] + ',' + stadiumCoords[1] + ',1km'
  }
  searchTwitter(twitter_params);
});

$(document).bind('tweets-parsed', function() {
  initial_time = Date.parse('15 Jun 2012 20:45');
  setTime(initial_time);
});
