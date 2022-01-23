(function() {
  'use strict';
  var CND, alert, badge, debug, echo, help, info, log, rpr, urge, warn, whisper;

  // coffeelint: disable=max_line_length

  //###########################################################################################################
  CND = require('cnd');

  badge = 'SONIFICATION';

  rpr = CND.rpr;

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //-----------------------------------------------------------------------------------------------------------
  this.demo_notify = function(me) {
    var playAlert;
    playAlert = require('alert-sound-notify');
    playAlert(); // Plays default alert "bottle"
    playAlert('purr');
    return playAlert.volume(1.5);
  };

  /*
https://github.com/mastilver/linux-vol/blob/master/index.js
https://github.com/TooTallNate/node-lame
https://github.com/TooTallNate/node-speaker
https://github.com/shime/play-sound
https://github.com/TooTallNate/node-lame
https://sonic-pi.net/
pactl list sinks | grep 'Volume: f' | sed -E 's/^.*\s([0-9]+)%.*$/\1/g'
*/

}).call(this);

//# sourceMappingURL=main.js.map