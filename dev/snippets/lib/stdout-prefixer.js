(function() {
  'use strict';
  var CND, badge, debug, echo, help, info, prefix, rpr, urge, warn, whisper;

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

  //-----------------------------------------------------------------------------------------------------------
  prefix = function() {
    var stderr, stdin, stdout;
    info('^34534^');
    // debug date = Temporal.Now.plainDateISO()
    // info date.toString()
    ({stdin, stdout, stderr} = process);
    stdin.setEncoding('utf-8');
    // stdin.resume()
    stdin.on('data', (data) => {
      var i, len, line, now, ref, results;
      now = new Date().toString();
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