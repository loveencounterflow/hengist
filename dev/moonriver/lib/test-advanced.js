(function() {
  'use strict';
  var CND, H, PATH, SQL, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'MOONRIVER/BASICS';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  PATH = require('path');

  // FS                        = require 'fs'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  SQL = String.raw;

  guy = require('../../../apps/guy');

  H = require('../../../lib/helpers');

  //-----------------------------------------------------------------------------------------------------------
  this._window_transform = function(T, done) {
    var $, $window, GUY, Pipeline, collect, collector, i, misfit, mr, nr, show;
    // T?.halt_on_error()
    GUY = require('../../../apps/guy');
    ({Pipeline, $} = require('../../../apps/moonriver'));
    ({$window} = require('../../../apps/moonriver/lib/transforms'));
    collector = [];
    mr = new Pipeline();
    misfit = Symbol('misfit');
    //.........................................................................................................
    mr.push($window(-2, +2, null));
    mr.push(show = function(d) {
      return urge('^45-1^', d);
    });
    mr.push(collect = function(d) {
      return collector.push(d);
    });
    for (nr = i = 1; i <= 9; nr = ++i) {
      mr.send(nr);
    }
    mr.run();
    debug('^45-2^', collector);
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (require.main === module) {
    (() => {
      return test(this);
    })();
  }

}).call(this);

//# sourceMappingURL=test-advanced.js.map