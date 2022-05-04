(function() {
  'use strict';
  var CND, badge, debug, echo, equals, guy, help, info, isa, rpr, test, type_of, types, urge, validate, validate_list_of, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'DBAY-VOGUE/TESTS/CONSTRUCTION';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  //...........................................................................................................
  test = require('../../../apps/guy-test');

  // PATH                      = require 'path'
  // FS                        = require 'fs'
  // H                         = require './helpers'
  types = new (require('intertype')).Intertype();

  ({isa, equals, type_of, validate, validate_list_of} = types.export());

  guy = require('../../../apps/guy');

  // MMX                       = require '../../../apps/multimix/lib/cataloguing'

  //-----------------------------------------------------------------------------------------------------------
  this["scheduler: duration pattern"] = function(T, done) {
    var Vogue_scheduler, duration_pattern, ref, ref1, ref2, ref3, ref4, ref5;
    if (T != null) {
      T.halt_on_error();
    }
    ({Vogue_scheduler} = require('../../../apps/dbay-vogue'));
    duration_pattern = Vogue_scheduler.C.duration_pattern;
    if (T != null) {
      T.eq(type_of(duration_pattern), 'regex');
    }
    if (T != null) {
      T.eq((ref = "23 minutes".match(duration_pattern)) != null ? ref.groups.amount : void 0, '23');
    }
    if (T != null) {
      T.eq((ref1 = "23e2 weeks".match(duration_pattern)) != null ? ref1.groups.amount : void 0, '23e2');
    }
    if (T != null) {
      T.eq((ref2 = "23.5e22 weeks".match(duration_pattern)) != null ? ref2.groups.amount : void 0, '23.5e22');
    }
    if (T != null) {
      T.eq((ref3 = "23 minutes".match(duration_pattern)) != null ? ref3.groups.unit : void 0, 'minutes');
    }
    if (T != null) {
      T.eq((ref4 = "23e2 weeks".match(duration_pattern)) != null ? ref4.groups.unit : void 0, 'weeks');
    }
    if (T != null) {
      T.eq((ref5 = "23.5e22 weeks".match(duration_pattern)) != null ? ref5.groups.unit : void 0, 'weeks');
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this["scheduler: add_interval_cfg"] = function(T, done) {
    var Vogue_scheduler, voge_scheduler;
    if (T != null) {
      T.halt_on_error();
    }
    ({Vogue_scheduler} = require('../../../apps/dbay-vogue'));
    voge_scheduler = new Vogue_scheduler();
    ({types} = voge_scheduler);
    if (T != null) {
      T.eq(type_of(types.isa.vogue_scheduler_add_interval_cfg), 'function');
    }
    // types.validate.vogue_scheduler_add_interval_cfg { repeat: '1.5 hours', callee: ( -> ), }
    if (T != null) {
      T.ok(types.isa.vogue_scheduler_add_interval_cfg({
        repeat: '1.5 hours',
        callee: (function() {})
      }));
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // test @[ "scheduler: duration pattern" ]
      return test(this["scheduler: add_interval_cfg"]);
    })();
  }

}).call(this);

//# sourceMappingURL=scheduler.tests.js.map