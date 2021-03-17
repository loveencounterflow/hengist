(function() {
  'use strict';
  var CND, INTERTEXT, alert, badge, debug, echo, gitlog, help, info, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  badge = 'GITCOLLECTOR';

  debug = CND.get_logger('debug', badge);

  alert = CND.get_logger('alert', badge);

  whisper = CND.get_logger('whisper', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  info = CND.get_logger('info', badge);

  echo = CND.echo.bind(CND);

  INTERTEXT = require('intertext');

  ({rpr} = INTERTEXT.export());

  gitlog = (require('gitlog')).gitlogPromise;

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      var abbrevHash, authorDate, d, date, entry, files, i, id, len, ref, status, subject;
      d = {
        repo: '.',
        number: 1e6,
        all: true
      };
      ref = (await gitlog(d));
      for (i = 0, len = ref.length; i < len; i++) {
        entry = ref[i];
        ({abbrevHash, subject, authorDate, files, status} = entry);
        date = authorDate;
        status = `${files.length} ${status.join('')}`;
        id = abbrevHash;
        subject = subject.slice(0, 50).padEnd(50);
        echo([id, date, subject, status].join(' '));
      }
      return null;
    })();
  }

}).call(this);

//# sourceMappingURL=main.js.map