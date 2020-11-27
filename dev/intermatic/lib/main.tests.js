(function() {
  'use strict';
  var CND, PATH, badge, debug, declare, echo, freeze, help, info, isa, lets, log, new_register, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/INTERMATIC';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  log = urge;

  //...........................................................................................................
  test = require('guy-test');

  PATH = require('path');

  types = new (require('intertype')).Intertype();

  ({isa, validate, declare, type_of} = types.export());

  ({freeze, lets} = require('letsfreezethat'));

  //-----------------------------------------------------------------------------------------------------------
  // declare

  //===========================================================================================================
  // HELPERS
  //-----------------------------------------------------------------------------------------------------------
  new_register = function() {
    var register, result;
    result = [];
    register = function(x) {
      whisper('^2321^', rpr(x));
      return result.push(x);
    };
    return {result, register};
  };

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic empty FSM"] = function(T, done) {
    var Intermatic, fsm;
    Intermatic = require('../../../apps/intermatic');
    fsm = new Intermatic({});
    T.eq(fsm.triggers, {
      start: {
        void: 'void'
      }
    });
    T.eq(fsm.start(), null);
    T.eq(fsm.state, 'void');
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic before.start(), after.start()"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result;
    ({result, register} = new_register());
    Intermatic = require('../../../apps/intermatic');
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      before: {
        start: function(s) {
          return register("before start");
        }
      },
      after: {
        start: function(s) {
          return register("after start");
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    fsm = new Intermatic(fsmd);
    T.eq(fsm.start(), null);
    T.eq(fsm.state, 'void');
    T.eq(result, ['before start', 'after start']);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic basics"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'meta_lamp',
      triggers: [['void', 'start', 'lit'], ['*', 'reset', 'void'], ['lit', 'toggle', 'dark'], ['dark', 'toggle', 'lit']],
      // [ 'void',   'toggle', 'lit',  ]
      after: {
        change: function(s) {
          return register(`after change:  ${rpr(s)}`);
        }
      },
      enter: {
        dark: function(s) {
          return register(`enter dark:    ${rpr(s)}`);
        }
      },
      leave: {
        lit: function(s) {
          return register(`leave lit      ${rpr(s)}`);
        }
      },
      fail: function(s) {
        return register(`failed: ${rpr(s)}`);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register} = new_register());
    Intermatic = require('../../../apps/intermatic');
    fsm = new Intermatic(fsmd);
    fsm.start();
    fsm.toggle();
    fsm.reset();
    fsm.toggle();
    // fsm.goto 'lit'
    // fsm.goto 'lit'
    // fsm.goto 'dark'
    echo(result);
    T.eq(result, ["after change:  { '$key': '^trigger', from: 'void', via: 'start', to: 'lit', changed: true }", "leave lit      { '$key': '^trigger', from: 'lit', via: 'toggle', to: 'dark', changed: true }", "enter dark:    { '$key': '^trigger', from: 'lit', via: 'toggle', to: 'dark', changed: true }", "after change:  { '$key': '^trigger', from: 'lit', via: 'toggle', to: 'dark', changed: true }", "after change:  { '$key': '^trigger', from: 'dark', via: 'reset', to: 'void', changed: true }", "failed: { '$key': '^trigger', failed: true, from: 'void', via: 'toggle' }"]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic goto 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'meta_lamp',
      triggers: [['void', 'start', 'lit'], ['*', 'reset', 'void'], ['lit', 'toggle', 'dark'], ['dark', 'toggle', 'lit']],
      // [ 'void',   'toggle', 'lit',  ]
      after: {
        change: function(s) {
          return register(`after change:  ${rpr(s)}`);
        }
      },
      enter: {
        dark: function(s) {
          return register(`enter dark:    ${rpr(s)}`);
        }
      },
      leave: {
        lit: function(s) {
          return register(`leave lit      ${rpr(s)}`);
        }
      },
      goto: '*',
      fail: function(s) {
        return register(`failed: ${rpr(s)}`);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register} = new_register());
    Intermatic = require('../../../apps/intermatic');
    fsm = new Intermatic(fsmd);
    T.eq(Object.keys(fsm), ['reserved', 'fsmd', 'triggers', '_state', 'before', 'enter', 'stay', 'leave', 'after', 'my', 'our', 'starts_with', 'start', 'toggle', 'reset', 'goto']);
    fsm.start();
    fsm.toggle();
    fsm.reset();
    fsm.toggle();
    fsm.goto('lit');
    fsm.goto('lit');
    fsm.goto('dark');
    echo(result);
    T.eq(result, ["after change:  { '$key': '^trigger', from: 'void', via: 'start', to: 'lit', changed: true }", "leave lit      { '$key': '^trigger', from: 'lit', via: 'toggle', to: 'dark', changed: true }", "enter dark:    { '$key': '^trigger', from: 'lit', via: 'toggle', to: 'dark', changed: true }", "after change:  { '$key': '^trigger', from: 'lit', via: 'toggle', to: 'dark', changed: true }", "after change:  { '$key': '^trigger', from: 'dark', via: 'reset', to: 'void', changed: true }", "failed: { '$key': '^trigger', failed: true, from: 'void', via: 'toggle' }", "after change:  { '$key': '^trigger', from: 'void', via: 'goto', to: 'lit', changed: true }", "leave lit      { '$key': '^trigger', from: 'lit', via: 'goto', to: 'dark', changed: true }", "enter dark:    { '$key': '^trigger', from: 'lit', via: 'goto', to: 'dark', changed: true }", "after change:  { '$key': '^trigger', from: 'lit', via: 'goto', to: 'dark', changed: true }"]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["_________________________ Intermatic cFsm"] = function(T, done) {
    var Intermatic, button_fsm, fsmd, register, result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      //.......................................................................................................
      meta_btn: {
        triggers: [['void', 'start', 'released'], ['*', 'reset', 'void'], ['released', 'press', 'pressed'], ['pressed', 'release', 'released']],
        enter: {
          'pressed': function(s) {
            return this.fsms.meta_lamp.light();
          },
          'released': function(s) {
            return this.fsms.meta_lamp.goto('dark');
          }
        }
      },
      //.......................................................................................................
      my: {
        //.....................................................................................................
        lamp: {
          triggers: [['void', 'start', 'lit'], ['lit', 'toggle', 'dark'], ['dark', 'toggle', 'lit']],
          after: {
            change: function(s) {
              return register(`after change:  ${rpr(s)}`);
            }
          },
          enter: {
            dark: function(s) {
              return register(`enter dark:    ${rpr(s)}`);
            },
            lit: function(s) {
              return register(`enter lit:     ${rpr(s)}`);
            }
          },
          goto: '*'
        }
      },
      //.......................................................................................................
      after: {
        change: function(s) {
          return register("ima.change");
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register} = new_register());
    Intermatic = require('../../../apps/intermatic');
    button_fsm = new Intermatic({
      meta_btn: fsmd.meta_btn
    });
    button_fsm.start();
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // @demo_2()
      // @toolbox_demo()
      return test(this);
    })();
  }

  // test @[ "Intermatic cFsm" ]
// test @[ "Intermatic empty FSM" ]
// test @[ "Intermatic before.start(), after.start()" ]
// @[ "Intermatic empty FSM" ]()

}).call(this);

//# sourceMappingURL=main.tests.js.map