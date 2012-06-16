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

var MATCH_DATA = [
  {
    time: 1380,
    team: 'England',
    type: 'goal',
    subjects: ['Carroll']
  },
  {
    time: 2940,
    team: 'Sweden',
    type: 'goal',
    subjects: ['Johnson']
  },
  {
    time: 3480,
    team: 'Sweden',
    type: 'yellow_card',
    subjects: ['Milner']
  }
];