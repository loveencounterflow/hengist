(function() {
  'use strict';
  var CND, badge, dayjs, debug, echo, help, info, prefix, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'PREFIXER';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  dayjs = require('dayjs');

  // do =>
  //   utc               = require 'dayjs/plugin/utc';               dayjs.extend utc
  //   relativeTime      = require 'dayjs/plugin/relativeTime';      dayjs.extend relativeTime
  //   toObject          = require 'dayjs/plugin/toObject';          dayjs.extend toObject
  //   customParseFormat = require 'dayjs/plugin/customParseFormat'; dayjs.extend customParseFormat
  //   duration          = require 'dayjs/plugin/duration';          dayjs.extend duration

  //-----------------------------------------------------------------------------------------------------------
  prefix = function() {
    var stderr, stdin, stdout;
    // debug date = Temporal.Now.plainDateISO()
    // info date.toString()
    ({stdin, stdout, stderr} = process);
    stdin.setEncoding('utf-8');
    // stdin.resume()
    stdin.on('data', (data) => {
      var i, len, line, now, ref, results;
      data = data.replace(/\n$/, '');
      now = dayjs().format("HH:mm:ss");
      ref = data.split('\n');
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        line = ref[i];
        results.push(echo(`${now} ${line}`));
      }
      return results;
    });
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return prefix();
    })();
  }

}).call(this);

//# sourceMappingURL=stdout-prefixer.js.map