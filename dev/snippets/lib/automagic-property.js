(function() {
  'use strict';
  var CND, badge, debug, def, def_oneoff, demo_automagic_property, echo, help, info, rpr, urge, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'TEMPFILES';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  def = Object.defineProperty;

  def_oneoff = function(object, name, method) {
    return def(object, name, {
      enumerable: true,
      configurable: true,
      get: function() {
        var R;
        R = method();
        def(object, name, {
          enumerable: true,
          configurable: false,
          value: R
        });
        return R;
      }
    });
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_automagic_property = function() {
    var X, x;
    X = class X {
      constructor() {
        def_oneoff(this, 'd', function() {
          return "difficult to compute";
        });
        return void 0;
      }

    };
    //---------------------------------------------------------------------------------------------------------
    x = new X();
    info('^3445^', x);
    info('^3445^', Object.getOwnPropertyDescriptor(x, 'd'));
    info('^3445^', x.d);
    info('^3445^', Object.getOwnPropertyDescriptor(x, 'd'));
    info('^3445^', x);
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await demo_tempy_directory()
      return (await demo_automagic_property());
    })();
  }

}).call(this);

//# sourceMappingURL=automagic-property.js.map