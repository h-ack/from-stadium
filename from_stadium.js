var TIMED_TWEETS = {};
var PHOTOS = {};
var SCORE_BY_TIME = scoreByTime();

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
       if (typeof TIMED_TWEETS[time] == 'undefined') {
         TIMED_TWEETS[time] = [data['results'][res]['from_user'] + ' : <p>' + data['results'][res]['text'] + '</p>']
       }
       else {
         TIMED_TWEETS[time].push(data['results'][res]['from_user'] + ' : <p>' + data['results'][res]['text'] + '</p>')
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
  if (typeof TIMED_TWEETS[time] != 'undefined')
    msgs = TIMED_TWEETS[time];
  tweets.append('<div>' + msgs + '</div><br/>');
}

function createPhotoElement(photo) {
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
}

function showPhotos(time) {
  var photo_array = PHOTOS[time];
  $('#photos').html('');
  if (typeof photo_array != 'undefined') {
    photo_array.forEach(function(photo) {
      createPhotoElement(photo);
    })
  }
}

function matchEventsByTime() {
  var match_events_by_time = {};

  MATCH_EVENTS.forEach(function(match_event) {
    match_events_by_time[MATCH_START_TIME + match_event.time] = match_event;
  });

  return match_events_by_time;
}

function scoreByTime() {
  var score = {};
  var match_events_by_time = matchEventsByTime();

  for(var t = MATCH_START_TIME; t < MATCH_END_TIME; t += 60) {
    score[t] = t > MATCH_START_TIME ? score[t-60] : [0,0];

    if (typeof match_events_by_time[t] != 'undefined' && 'goal' == match_events_by_time[t]['type']) {
      score[t] = [score[t-60][0], score[t-60][1]];
      score[t][MATCH_TEAMS.indexOf(match_events_by_time[t]['team'])] += 1;
    }
  }

  return score;
}

function updateScore(time) {
  for(var i = 0; i < MATCH_TEAMS.length; i++) {
    $('#score .' + MATCH_TEAMS[i]).html(SCORE_BY_TIME[time][i]);
  }
}

$(document).ready(function() {
  var clientId = '3365ff268278435aa79452ab1f3f80ca';
  var stadiumCoords = [50.43222, 30.51803]

  $(".instagram.search").instagram({
    search: {
      lat: stadiumCoords[0],
      lng: stadiumCoords[1],
      min_timestamp: MATCH_START_TIME,
      max_timestamp: MATCH_END_TIME
    },
    clientId: clientId,
    onComplete: function(data, res) {
      for (photo in res['data']) {
       time = (res['data'][photo]['created_time']);
       time = time - (time % 60)
       picture = res['data'][photo]
       if (typeof PHOTOS[time] == 'undefined') {
         PHOTOS[time] = [picture]
       }
       else {
         PHOTOS[time].push(picture)
       }
      }
    }
  });

  $("#slider").slider({
    min: MATCH_START_TIME,
    max: MATCH_END_TIME,
    step: 60,
    slide: function(event, ui) {
      time = ui.value;
      setTime(time);
      time = time - (time % 60);
      showPhotos(time);
      updateScore(time);
    },
    create: function(event, ui) {
      MATCH_EVENTS.forEach(function(match_event) {
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
