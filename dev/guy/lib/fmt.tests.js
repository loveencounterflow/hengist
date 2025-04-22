(function() {
  'use strict';
  var CND, FS, H, PATH, alert, badge, debug, echo, equals, freeze, help, info, isa, log, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  PATH = require('path');

  FS = require('fs');

  //...........................................................................................................
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'GUY/TESTS/FS';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  FS = require('fs');

  H = require('./helpers');

  types = new (require('intertype')).Intertype();

  ({freeze} = require('letsfreezethat'));

  ({isa, type_of, validate, validate_list_of, equals} = types.export());

  //-----------------------------------------------------------------------------------------------------------
  this.guy_fmt_basics = function(T, done) {
    var GUY, format, new_formatter;
    // T?.halt_on_error()
    GUY = require(H.guy_path);
    ({format, new_formatter} = GUY.fmt);
    (() => {      //.........................................................................................................
      if (T != null) {
        T.eq(format('*<+20,.5g', '11456.15454'), '+11,456*************');
      }
      return T != null ? T.eq(format('*<+20,.5g', 11456.15454), '+11,456*************') : void 0;
    })();
    (() => {      // urge 'Ω___1', rpr format '*=+20,.5g', 11456.15454
      //.........................................................................................................
      if (T != null) {
        T.eq(format(' > 15,.2f', 1), '           1.00');
      }
      if (T != null) {
        T.eq(format(' > 15,.2f', 12), '          12.00');
      }
      if (T != null) {
        T.eq(format(' > 15,.2f', 123), '         123.00');
      }
      if (T != null) {
        T.eq(format(' > 15,.2f', 1234), '       1,234.00');
      }
      if (T != null) {
        T.eq(format(' > 15,.2f', -11456.15454), '     -11,456.15');
      }
      if (T != null) {
        T.eq(format(' > 15,.2f', 53443.32455), '      53,443.32');
      }
      if (T != null) {
        T.eq(format(' > 15,.2f', 885673.367553), '     885,673.37');
      }
      return T != null ? T.eq(format(' > 15s', 'helo'), '           helo') : void 0;
    })();
    (() => {      //.........................................................................................................
      var f152f, f15s;
      f152f = new_formatter(' > 15,.2f');
      f15s = new_formatter(' > 15s');
      if (T != null) {
        T.eq(f152f(1), '           1.00');
      }
      if (T != null) {
        T.eq(f152f(12), '          12.00');
      }
      if (T != null) {
        T.eq(f152f(123), '         123.00');
      }
      if (T != null) {
        T.eq(f152f(1234), '       1,234.00');
      }
      if (T != null) {
        T.eq(f152f(-11456.15454), '     -11,456.15');
      }
      if (T != null) {
        T.eq(f152f(53443.32455), '      53,443.32');
      }
      if (T != null) {
        T.eq(f152f(885673.367553), '     885,673.37');
      }
      return T != null ? T.eq(f15s('helo'), '           helo') : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.guy_fmt_numbers = function(T, done) {
    var GUY, format, new_formatter;
    // T?.halt_on_error()
    GUY = require(H.guy_path);
    ({format, new_formatter} = GUY.fmt);
    (() => {      //.........................................................................................................
      if (T != null) {
        T.eq(format('*<+20,.5g', 11456.15454), '+11,456*************');
      }
      if (T != null) {
        T.eq(format('*^+20,.5g', 11456.15454), '******+11,456*******');
      }
      return T != null ? T.eq(format('*>+20,.5g', 11456.15454), '*************+11,456') : void 0;
    })();
    (() => {      //.........................................................................................................
      if (T != null) {
        T.eq(format('_> 20.2e', 1234.56789), '____________ 1.23e+3');
      }
      if (T != null) {
        T.eq(format('_> 20.2f', 1234.56789), '____________ 1234.57');
      }
      if (T != null) {
        T.eq(format('_> 20.2g', 1234.56789), '_____________ 1.2e+3');
      }
      //.......................................................................................................
      if (T != null) {
        T.eq(format('_> 20.2e', 123456789.123456789), '____________ 1.23e+8');
      }
      if (T != null) {
        T.eq(format('_> 20.2f', 123456789.123456789), '_______ 123456789.12');
      }
      return T != null ? T.eq(format('_> 20.2g', 123456789.123456789), '_____________ 1.2e+8') : void 0;
    })();
    (() => {      //.........................................................................................................
      if (T != null) {
        T.eq(format('_> 20.5e', 1234.56789), '_________ 1.23457e+3');
      }
      if (T != null) {
        T.eq(format('_> 20.5f', 1234.56789), '_________ 1234.56789');
      }
      if (T != null) {
        T.eq(format('_> 20.5g', 1234.56789), '_____________ 1234.6');
      }
      //.......................................................................................................
      if (T != null) {
        T.eq(format('_> 20.5e', 123456789.123456789), '_________ 1.23457e+8');
      }
      if (T != null) {
        T.eq(format('_> 20.5f', 123456789.123456789), '____ 123456789.12346');
      }
      return T != null ? T.eq(format('_> 20.5g', 123456789.123456789), '__________ 1.2346e+8') : void 0;
    })();
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.guy_fmt_chat_gpt_generated = function(T, done) {
    var GUY, format, new_formatter;
    // T?.halt_on_error()
    GUY = require(H.guy_path);
    ({format, new_formatter} = GUY.fmt);
    //.........................................................................................................
    if (T != null) {
      T.eq(format('.2f', 3.14159), '3.14');
    }
    if (T != null) {
      T.eq(format('>10s', "test"), '      test');
    }
    if (T != null) {
      T.eq(format('<10s', "test"), 'test      ');
    }
    if (T != null) {
      T.eq(format('^10s', "test"), '   test   ');
    }
    if (T != null) {
      T.eq(format('>10.3f', 1.23456), '     1.235');
    }
    if (T != null) {
      T.eq(format('^10s', "hi"), '    hi    ');
    }
    if (T != null) {
      T.eq(format(' >10s', "test"), '      test');
    }
    if (T != null) {
      T.eq(format(' <10s', "test"), 'test      ');
    }
    if (T != null) {
      T.eq(format(' ^10s', "test"), '   test   ');
    }
    if (T != null) {
      T.eq(format(' >10.3f', 1.23456), '     1.235');
    }
    if (T != null) {
      T.eq(format(' ^10s', "hi"), '    hi    ');
    }
    if (T != null) {
      T.eq(format('04d', 42), '0042');
    }
    if (T != null) {
      T.eq(format('+d', 42), '+42');
    }
    if (T != null) {
      T.eq(format('-d', -42), '-42');
    }
    if (T != null) {
      T.eq(format('x', 255), 'ff');
    }
    if (T != null) {
      T.eq(format('#x', 255), '0xff');
    }
    if (T != null) {
      T.eq(format('#o', 8), '0o10');
    }
    if (T != null) {
      T.eq(format('#b', 5), '0b101');
    }
    if (T != null) {
      T.eq(format('e', 12345.6789), '1.234568e+4');
    }
    if (T != null) {
      T.eq(format(',.2f', 1234567.891), '1,234,567.89');
    }
    if (T != null) {
      T.eq(format('%', 0.85), '85.000000%');
    }
    if (T != null) {
      T.eq(format('.1%', 0.85), '85.0%');
    }
    if (T != null) {
      T.eq(format('.0%', 0.12345), '12%');
    }
    if (T != null) {
      T.eq(format('.0%', 0.125), '13%');
    }
    return typeof done === "function" ? done() : void 0;
  };

  // #-----------------------------------------------------------------------------------------------------------
  // @guy_str_pluralize = ( T, done ) ->
  //   # T?.halt_on_error()
  //   GUY     = require H.guy_path
  //   probes_and_matchers = [
  //     [ '',               '',                     ]
  //     [ 'a',              'as',                   ]
  //     [ 'y',              'ys',                   ]
  //     [ 'aye',            'ayes',                 ]
  //     [ 'why',            'whies',                ]
  //     [ 'leaf',           'leafs',                ]
  //     [ 'potato',         'potatos',              ]
  //     [ 'fix',            'fixes',                ]
  //     [ 'bun',            'buns',                 ]
  //     [ 'regex',          'regexes',              ]
  //     [ 'regexes',        'regexeses',            ]
  //     [ 'property',       'properties',           ]
  //     [ 'PROPERTY',       'PROPERTIES',           ]
  //     [ 'propertY',       'propertIES',           ]
  //     ]
  //   #.........................................................................................................
  //   for [ probe, matcher, error, ] in probes_and_matchers
  //     await T.perform probe, matcher, error, -> return new Promise ( resolve, reject ) ->
  //       result = GUY.str.pluralize probe
  //       resolve result
  //   #.........................................................................................................
  //   return done?()

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      // @guy_str_escape_for_regex()
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=fmt.tests.js.map