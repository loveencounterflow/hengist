(function() {
  'use strict';
  var CND, badge, debug, demo, echo, help, info, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'TAGGED-TEMPLATE-LITERALS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var bar, f;
    f = function(strings, ...values) {
      info();
      info("strings     ", strings);
      info("strings.raw ", strings.raw);
      info("values      ", values);
      return null;
    };
    urge(f`helo \n world`);
    bar = 42;
    urge(f`foo \${bar} baz`);
    urge(f`foo ${bar} baz`);
    // urge f"foo #{bar:blah} baz"
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return demo();
    })();
  }

}).call(this);

//# sourceMappingURL=tagged-tempplate-literals.js.map