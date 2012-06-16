/*

Event:

* time (in seconds from match start)
* team
* type (see event types)
* subjects (event subjects)

Event types:

* goal
* yellow_card
* red_card
* substitution

*/

var MATCH_EVENTS = [
  {
    time: 1380,
    team: 'england',
    type: 'goal',
    subjects: ['carroll']
  },
  {
    time: 2940,
    team: 'sweden',
    type: 'goal',
    subjects: ['johnson']
  },
  {
    time: 3480,
    team: 'sweden',
    type: 'yellow_card',
    subjects: ['milner']
  }
];

var MATCH_START_TIME = 1339793100;
var MATCH_END_TIME = 1339800600;
var MATCH_TEAMS = ['sweden', 'england'];