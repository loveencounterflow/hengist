(function() {
  'use strict';
  var CND, X, badge, debug, echo, help, ic, info, rpr, urge, warn, whisper, x;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'ICQL/DBA';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  ic = (require('node-icecream'))();

  X = class X {
    foo() {
      return 'bar';
    }

    gnu(x) {
      return x ** x;
    }

  };

  x = new X();

  info(ic(x.foo(), 42, x.gnu(36)));

  ic();

  info('^454554^');

  ic('eertert');

  ic = (require('node-icecream'))({
    prefix: '',
    outputFunction: debug
  });

  ic(x.foo(), x.gnu());

}).call(this);

//# sourceMappingURL=debugging-with-icecream.js.map