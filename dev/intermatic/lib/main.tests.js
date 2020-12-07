(function() {
  'use strict';
  var CND, PATH, badge, debug, declare, echo, equals, freeze, help, info, isa, lets, log, new_register, rpr, test, type_of, types, urge, validate, warn, whisper;

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

  ({isa, validate, declare, equals, type_of} = types.export());

  ({freeze, lets} = require('letsfreezethat'));

  //-----------------------------------------------------------------------------------------------------------
  // declare

  //===========================================================================================================
  // HELPERS
  //-----------------------------------------------------------------------------------------------------------
  new_register = function() {
    var register, result, show_result;
    result = [];
    register = function(...P) {
      var x;
      x = P.length === 1 ? P[0] : P;
      whisper('^2321^', ...P);
      return result.push(x);
    };
    show_result = function() {
      var R, d;
      R = [
        '  T.eq result, [ ',
        ...((function() {
          var i,
        len,
        results;
          results = [];
          for (i = 0, len = result.length; i < len; i++) {
            d = result[i];
            results.push('    ' + rpr(d));
          }
          return results;
        })())
      ];
      echo((R.join('\n')) + ' ]');
      return null;
    };
    return {result, register, show_result};
  };

  //===========================================================================================================
  // TESTS
  //-----------------------------------------------------------------------------------------------------------
  this["___ Intermatic attribute freezing"] = function(T, done) {
    var d, e, pname, propd, ref1;
    d = Object.freeze({
      foo: 42
    });
    e = {};
    ref1 = Object.getOwnPropertyDescriptors(d);
    for (pname in ref1) {
      propd = ref1[pname];
      Object.defineProperty(e, pname, propd);
    }
    e.foo = d.foo;
    //d.foo++
    e.foo++;
    debug(d);
    debug(e);
    return done();
  };

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
    T.eq(fsm.lstate, 'void');
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
        start: function() {
          return register("before start");
        }
      },
      after: {
        start: function() {
          return register("after start");
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    fsm = new Intermatic(fsmd);
    T.eq(fsm.start(), null);
    T.eq(fsm.lstate, 'void');
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
        change: function() {
          return register("after change", this.cstate);
        }
      },
      enter: {
        dark: function() {
          return register("enter dark", this.cstate);
        }
      },
      leave: {
        lit: function() {
          return register("leave lit", this.cstate);
        }
      },
      fail: function() {
        return register("failed", this.cstate);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register} = new_register());
    Intermatic = require('../../../apps/intermatic');
    fsm = new Intermatic(fsmd);
    info('^44455^', JSON.stringify(fsm.triggers, null, 2));
    T.eq(fsm.triggers, {
      "start": {
        "void": "lit"
      },
      "toggle": {
        "lit": "dark",
        "dark": "lit"
      },
      "reset": {
        "void": "void",
        "lit": "void",
        "dark": "void"
      }
    });
    fsm.start();
    fsm.toggle();
    fsm.reset();
    fsm.toggle();
    // fsm.goto 'lit'
    // fsm.goto 'lit'
    // fsm.goto 'dark'
    echo(result);
    T.eq(result, [
      [
        'after change',
        {
          lstate: 'lit',
          path: 'meta_lamp',
          verb: 'start',
          dpar: 'void',
          dest: 'lit',
          changed: true
        }
      ],
      [
        'leave lit',
        {
          lstate: 'lit',
          path: 'meta_lamp',
          verb: 'toggle',
          dpar: 'lit',
          dest: 'dark',
          changed: true
        }
      ],
      [
        'enter dark',
        {
          lstate: 'dark',
          path: 'meta_lamp',
          verb: 'toggle',
          dpar: 'lit',
          dest: 'dark',
          changed: true
        }
      ],
      [
        'after change',
        {
          lstate: 'dark',
          path: 'meta_lamp',
          verb: 'toggle',
          dpar: 'lit',
          dest: 'dark',
          changed: true
        }
      ],
      [
        'after change',
        {
          lstate: 'void',
          path: 'meta_lamp',
          verb: 'reset',
          dpar: 'dark',
          dest: 'void',
          changed: true
        }
      ],
      [
        'failed',
        {
          lstate: 'void',
          path: 'meta_lamp',
          verb: 'toggle',
          dpar: 'void',
          failed: true
        }
      ]
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic history"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'meta_lamp',
      triggers: [['void', 'start', 'lit'], ['*', 'reset', 'void'], ['*', 'flash', 'flashing'], ['flashing', 'toggle', 'dark'], ['lit', 'toggle', 'dark'], ['dark', 'toggle', 'lit']],
      after: {
        change: function(...P) {
          return register(this.history);
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register} = new_register());
    Intermatic = require('../../../apps/intermatic');
    Intermatic._tid = 0;
    fsm = new Intermatic(fsmd);
    fsm.history_length = 3;
    fsm.start();
    fsm.toggle();
    fsm.toggle();
    fsm.flash();
    fsm.toggle();
    T.eq(result, [
      [
        {
          verb: 'start',
          dpar: 'void',
          dest: 'lit'
        }
      ],
      [
        {
          verb: 'start',
          dpar: 'void',
          dest: 'lit'
        },
        {
          verb: 'toggle',
          dpar: 'lit',
          dest: 'dark'
        }
      ],
      [
        {
          verb: 'start',
          dpar: 'void',
          dest: 'lit'
        },
        {
          verb: 'toggle',
          dpar: 'lit',
          dest: 'dark'
        },
        {
          verb: 'toggle',
          dpar: 'dark',
          dest: 'lit'
        }
      ],
      [
        {
          verb: 'toggle',
          dpar: 'lit',
          dest: 'dark'
        },
        {
          verb: 'toggle',
          dpar: 'dark',
          dest: 'lit'
        },
        {
          verb: 'flash',
          dpar: 'lit',
          dest: 'flashing'
        }
      ],
      [
        {
          verb: 'toggle',
          dpar: 'dark',
          dest: 'lit'
        },
        {
          verb: 'flash',
          dpar: 'lit',
          dest: 'flashing'
        },
        {
          verb: 'toggle',
          dpar: 'flashing',
          dest: 'dark'
        }
      ]
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic cancel moves"] = function(T, done) {
    var Intermatic, boiler, fsmd, register, result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'boiler',
      // cascades:
      //   # start: '*' ### TAINT all FSMs in tree? all sibling FSMs? parent FSMs? ###
      //   start: [ 'heater', ]
      before: {
        start: function(...P) {
          return this.heater.start(...P);
        }
      },
      after: {
        change: function(...P) {
          return register(this.cstate);
        }
      },
      fsms: {
        heater: {
          data: {
            temparature: 20
          },
          triggers: [['void', 'start', 'idle'], ['heating', 'switch_off', 'idle'], ['idle', 'switch_on', 'heating']]
        }
      }
    };
    // after:
    //   change: ( P... ) -> @up.
    //---------------------------------------------------------------------------------------------------------
    ({result, register} = new_register());
    Intermatic = require('../../../apps/intermatic');
    Intermatic._tid = 0;
    boiler = new Intermatic(fsmd);
    boiler.start();
    boiler.heater.switch_on();
    // boiler.thermo.
    // T.eq result,
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic goto 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'meta_lamp',
      triggers: [['void', 'start', 'lit'], ['*', 'reset', 'void'], ['lit', 'toggle', 'dark'], ['dark', 'toggle', 'lit']],
      // [ 'void',   'toggle', 'lit',  ]
      before: {
        any: function(...P) {
          return register('before.any', this.cstate, P);
        }
      },
      // after:
      //   change:     ( P... ) -> register 'after.change',  @cstate
      // enter:
      //   dark:       ( P... ) -> register 'enter.dark',    @cstate
      //   lit:        ( P... ) -> register 'enter.lit',     @cstate
      goto: '*',
      fail: function(...P) {
        return register('failed', this.cstate, P);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    Intermatic = require('../../../apps/intermatic');
    fsm = new Intermatic(fsmd);
    // T.eq ( Object.keys fsm ),  [ 'reserved', 'fsmd', 'triggers', 'fsm_names', 'has_subfsms', '_lstate', 'before', 'enter', 'stay', 'leave', 'after', 'up', 'starts_with', 'start', 'toggle', 'reset', 'goto', 'name', 'fail' ]
    fsm.start('M1');
    fsm.toggle('M2');
    fsm.goto('lit', 'M3');
    fsm.goto.lit('M4');
    fsm.goto('dark', 'M5');
    fsm.toggle('M6');
    fsm.toggle('M7');
    fsm.toggle('M8');
    show_result();
    T.eq(result, [
      [
        'before.any',
        {
          path: 'meta_lamp',
          lstate: 'void',
          verb: 'start',
          dpar: 'void',
          dest: 'lit',
          changed: true
        },
        ['M1']
      ],
      [
        'before.any',
        {
          path: 'meta_lamp',
          lstate: 'lit',
          verb: 'toggle',
          dpar: 'lit',
          dest: 'dark',
          changed: true
        },
        ['M2']
      ],
      [
        'before.any',
        {
          path: 'meta_lamp',
          lstate: 'dark',
          verb: 'goto',
          dpar: 'dark',
          dest: 'lit',
          changed: true
        },
        ['M3']
      ],
      [
        'before.any',
        {
          path: 'meta_lamp',
          lstate: 'lit',
          verb: 'goto',
          dpar: 'lit',
          dest: 'lit'
        },
        ['M4']
      ],
      [
        'before.any',
        {
          path: 'meta_lamp',
          lstate: 'lit',
          verb: 'goto',
          dpar: 'lit',
          dest: 'dark',
          changed: true
        },
        ['M5']
      ],
      [
        'before.any',
        {
          path: 'meta_lamp',
          lstate: 'dark',
          verb: 'toggle',
          dpar: 'dark',
          dest: 'lit',
          changed: true
        },
        ['M6']
      ],
      [
        'before.any',
        {
          path: 'meta_lamp',
          lstate: 'lit',
          verb: 'toggle',
          dpar: 'lit',
          dest: 'dark',
          changed: true
        },
        ['M7']
      ],
      [
        'before.any',
        {
          path: 'meta_lamp',
          lstate: 'dark',
          verb: 'toggle',
          dpar: 'dark',
          dest: 'lit',
          changed: true
        },
        ['M8']
      ]
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic cyclers 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'switch',
      triggers: [['void', 'start', 'off']],
      cyclers: {
        toggle: ['on', 'off'],
        step: ['bar', 'baz', 'gnu', 'doe']
      },
      goto: '*',
      after: {
        change: function(ref) {
          return register(this.cstate, ref);
        }
      },
      fail: function(ref) {
        return register(this.cstate, ref);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    Intermatic = require('../../../apps/intermatic');
    fsm = new Intermatic(fsmd);
    fsm.start('X1');
    fsm.toggle('X2');
    fsm.toggle('X3');
    fsm.step('X4');
    fsm.goto('doe', 'X5');
    fsm.step('X6');
    fsm.step('X7');
    fsm.step('X8');
    fsm.step('X9');
    fsm.step('X10');
    show_result();
    T.eq(result, [
      [
        {
          path: 'switch',
          lstate: 'off',
          verb: 'start',
          dpar: 'void',
          dest: 'off',
          changed: true
        },
        'X1'
      ],
      [
        {
          path: 'switch',
          lstate: 'on',
          verb: 'toggle',
          dpar: 'off',
          dest: 'on',
          changed: true
        },
        'X2'
      ],
      [
        {
          path: 'switch',
          lstate: 'off',
          verb: 'toggle',
          dpar: 'on',
          dest: 'off',
          changed: true
        },
        'X3'
      ],
      [
        {
          path: 'switch',
          lstate: 'off',
          verb: 'step',
          dpar: 'off',
          failed: true
        },
        'X4'
      ],
      [
        {
          path: 'switch',
          lstate: 'doe',
          verb: 'goto',
          dpar: 'off',
          dest: 'doe',
          changed: true
        },
        'X5'
      ],
      [
        {
          path: 'switch',
          lstate: 'bar',
          verb: 'step',
          dpar: 'doe',
          dest: 'bar',
          changed: true
        },
        'X6'
      ],
      [
        {
          path: 'switch',
          lstate: 'baz',
          verb: 'step',
          dpar: 'bar',
          dest: 'baz',
          changed: true
        },
        'X7'
      ],
      [
        {
          path: 'switch',
          lstate: 'gnu',
          verb: 'step',
          dpar: 'baz',
          dest: 'gnu',
          changed: true
        },
        'X8'
      ],
      [
        {
          path: 'switch',
          lstate: 'doe',
          verb: 'step',
          dpar: 'gnu',
          dest: 'doe',
          changed: true
        },
        'X9'
      ],
      [
        {
          path: 'switch',
          lstate: 'bar',
          verb: 'step',
          dpar: 'doe',
          dest: 'bar',
          changed: true
        },
        'X10'
      ]
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic data attribute 1"] = function(T, done) {
    var Intermatic, d, fsm, fsmd, i, len, register, result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'simple',
      data: {
        counter: 42
      },
      triggers: [['void', 'start', 'first']],
      cyclers: {
        step: ['first', 'second']
      },
      before: {
        start: function(...P) {
          return this.sub.start();
        }
      },
      enter: {
        first: function(...P) {
          T.ok(this.data.counter != null);
          this.data.counter++;
          info(this.data.counter);
          return register(this.cstate);
        },
        second: function(...P) {
          this.sub.toggle();
          return register(this.cstate);
        }
      },
      fsms: {
        sub: {
          data: {
            frobs: 0
          },
          triggers: [['void', 'start', 'dub']],
          cyclers: {
            toggle: ['dub', 'frob']
          },
          leave: {
            frob: function(...P) {
              this.data.frobs++;
              return help(this.data.frobs);
            }
          }
        }
      }
    };
    ({result, register} = new_register());
    Intermatic = require('../../../apps/intermatic');
    fsm = new Intermatic(fsmd);
    T.eq(fsm.data, {
      counter: 42
    });
    fsm.start();
    urge(fsm.cstate, fsm.data.counter, fsm.sub.data.frobs);
    fsm.step();
    urge(fsm.cstate, fsm.data.counter, fsm.sub.data.frobs);
    fsm.step();
    urge(fsm.cstate, fsm.data.counter, fsm.sub.data.frobs);
    fsm.step();
    urge(fsm.cstate, fsm.data.counter, fsm.sub.data.frobs);
    for (i = 0, len = result.length; i < len; i++) {
      d = result[i];
      // fsm.step();   urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
      // fsm.step();   urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
      info(d);
    }
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic catchalls 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'knob',
      triggers: [['void', 'start', 'bar']],
      cyclers: {
        step: ['bar', 'baz', 'gnu', 'doe']
      },
      goto: '*',
      before: {
        any: function(ref) {
          return register('before any', this.lstate, this.verb, ref);
        }
      },
      enter: {
        any: function(ref) {
          return register('enter any', this.lstate, this.verb, ref);
        }
      },
      stay: {
        any: function(ref) {
          return register('stay any', this.lstate, this.verb, ref);
        }
      },
      leave: {
        any: function(ref) {
          return register('leave any', this.lstate, this.verb, ref);
        }
      },
      after: {
        any: function(ref) {
          return register('after any', this.lstate, this.verb, ref);
        }
      },
      fail: function(ref) {
        return register('fail', this.lstate, this.verb, ref);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    Intermatic = require('../../../apps/intermatic');
    fsm = new Intermatic(fsmd);
    info("fsm.start()     ———");
    fsm.start('A1');
    info("fsm.step()      ———");
    fsm.step('A2');
    info(`fsm.goto.${fsm.lstate}()  ———`);
    fsm.goto(fsm.lstate, 'A3');
    show_result();
    T.eq(result, [['before any', 'void', 'start', 'A1'], ['leave any', 'void', 'start', 'A1'], ['enter any', 'bar', 'start', 'A1'], ['after any', 'bar', 'start', 'A1'], ['before any', 'bar', 'step', 'A2'], ['leave any', 'bar', 'step', 'A2'], ['enter any', 'baz', 'step', 'A2'], ['after any', 'baz', 'step', 'A2'], ['before any', 'baz', 'goto', 'A3'], ['stay any', 'baz', 'goto', 'A3'], ['after any', 'baz', 'goto', 'A3']]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic observables during moves 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'knob',
      triggers: [['void', 'start', 'bar']],
      cyclers: {
        step: ['bar', 'baz', 'gnu', 'doe']
      },
      goto: '*',
      before: {
        any: function(...P) {
          return register('before any', fsm.cstate);
        }
      },
      // enter:  any: ( P... ) -> register 'enter any',   fsm.cstate
      // stay:   any: ( P... ) -> register 'stay any',    fsm.cstate
      // leave:  any: ( P... ) -> register 'leave any',   fsm.cstate
      // after:  any: ( P... ) -> register 'after any',   fsm.cstate
      fail: function(...P) {
        return register('fail', fsm.cstate);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    Intermatic = require('../../../apps/intermatic');
    fsm = new Intermatic(fsmd);
    register('first', fsm.cstate);
    info("fsm.start()     ———");
    fsm.start();
    register('mid1', fsm.cstate);
    info("fsm.step()      ———");
    fsm.step();
    info(`fsm.goto.${fsm.lstate}()  ———`);
    fsm.goto(fsm.lstate);
    register('last', fsm.cstate);
    show_result();
    T.eq(result, [
      [
        'first',
        {
          path: 'knob',
          lstate: 'void'
        }
      ],
      [
        'before any',
        {
          path: 'knob',
          lstate: 'void',
          verb: 'start',
          dpar: 'void',
          dest: 'bar',
          changed: true
        }
      ],
      [
        'mid1',
        {
          path: 'knob',
          lstate: 'bar'
        }
      ],
      [
        'before any',
        {
          path: 'knob',
          lstate: 'bar',
          verb: 'step',
          dpar: 'bar',
          dest: 'baz',
          changed: true
        }
      ],
      [
        'before any',
        {
          path: 'knob',
          lstate: 'baz',
          verb: 'goto',
          dpar: 'baz',
          dest: 'baz'
        }
      ],
      [
        'last',
        {
          path: 'knob',
          lstate: 'baz'
        }
      ]
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic tryto 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'oneway_switch',
      triggers: [['void', 'start', 'off'], ['off', 'toggle', 'on']],
      after: {
        change: function(...P) {
          return register(`success: ${this.dpar}>-${this.verb}->${this.dest}`);
        }
      },
      fail: function(...P) {
        return register(`failure: ${this.dpar}>-${this.verb}->?`);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    Intermatic = require('../../../apps/intermatic');
    fsm = new Intermatic(fsmd);
    fsm.start();
    T.eq(true, fsm.can.toggle());
    T.eq(true, fsm.tryto.toggle());
    T.eq(false, fsm.can('toggle'));
    T.eq(false, fsm.tryto('toggle'));
    T.throws(/unknown trigger "nonexisting_trigger"/, function() {
      return fsm.can('nonexisting_trigger');
    });
    show_result();
    T.eq(result, ['success: void>-start->off', 'success: off>-toggle->on']);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic tryto 2"] = function(T, done) {
    var Intermatic, eq, fsm, fsmd, k, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'oneway_switch',
      triggers: [['void', 'start', 'one']],
      cyclers: {
        step: ['one', 'two', 'three']
      },
      after: {
        change: function(...P) {
          return register(this.cstate);
        }
      },
      // step:       ( P... ) -> @step()
      fail: function(...P) {
        return register(this.cstate);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    Intermatic = require('../../../apps/intermatic');
    fsm = new Intermatic(fsmd);
    eq = function(ref, test, outcome) {
      if (isa.function(test)) {
        ref += ' ' + test.toString().replace(/\n/g, ' ');
        test = test();
      }
      if (equals(test, outcome)) {
        return T.ok(true);
      } else {
        return T.fail(`test ${rpr(ref)} failed`);
      }
    };
    debug(((function() {
      var results;
      results = [];
      for (k in CND) {
        results.push(k);
      }
      return results;
    })()).sort());
    eq('^tt2@1', (function() {
      return fsm.lstate;
    }), 'void');
    eq('^tt2@2', (function() {
      return fsm.triggers.start;
    }), {
      void: 'one'
    });
    eq('^tt2@3', (function() {
      return fsm.can.start();
    }), true);
    eq('^tt2@4', (function() {
      return fsm.can('start');
    }), true);
    eq('^tt2@5', (function() {
      return fsm.start();
    }), null); // one
    eq('^tt2@6', (function() {
      return fsm.lstate;
    }), 'one');
    eq('^tt2@7', (function() {
      return fsm.can.start();
    }), false);
    eq('^tt2@8', (function() {
      return fsm.can('start');
    }), false);
    eq('^tt2@9', (function() {
      return fsm.step();
    }), null); // two
    eq('^tt2@10', (function() {
      return fsm.tryto.step();
    }), true); // three
    eq('^tt2@11', (function() {
      return fsm.step();
    }), null); // one
    eq('^tt2@12', (function() {
      return fsm.tryto.step();
    }), true); // two
    eq('^tt2@13', (function() {
      return fsm.tryto.start();
    }), false);
    show_result();
    T.eq(result, [
      {
        path: 'oneway_switch',
        lstate: 'one',
        verb: 'start',
        dpar: 'void',
        dest: 'one',
        changed: true
      },
      {
        path: 'oneway_switch',
        lstate: 'two',
        verb: 'step',
        dpar: 'one',
        dest: 'two',
        changed: true
      },
      {
        path: 'oneway_switch',
        lstate: 'three',
        verb: 'step',
        dpar: 'two',
        dest: 'three',
        changed: true
      },
      {
        path: 'oneway_switch',
        lstate: 'one',
        verb: 'step',
        dpar: 'three',
        dest: 'one',
        changed: true
      },
      {
        path: 'oneway_switch',
        lstate: 'two',
        verb: 'step',
        dpar: 'one',
        dest: 'two',
        changed: true
      }
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic cFsm 1"] = function(T, done) {
    var Intermatic, button, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      //.......................................................................................................
      triggers: [['void', 'start', 'released'], ['*', 'reset', 'void'], ['released', 'press', 'pressed'], ['pressed', 'release', 'released']],
      enter: {
        pressed: function(...P) {
          this.lamp.goto('lit');
          return register("button: enter pressed", this.lstate);
        },
        released: function(...P) {
          this.lamp.goto('dark');
          return register("button: enter released", this.lstate);
        }
      },
      stay: {
        pressed: function(...P) {
          return register("button: stay pressed", this.lstate);
        },
        released: function(...P) {
          return register("button: stay released", this.lstate);
        }
      },
      after: {
        start: function(...P) {
          return this.lamp.start();
        }
      },
      before: {
        trigger: function(...P) {
          return register("button: before *", this.lstate);
        }
      },
      goto: '*',
      //.......................................................................................................
      fsms: {
        //.....................................................................................................
        lamp: {
          triggers: [['void', 'start', 'lit'], ['lit', 'toggle', 'dark'], ['dark', 'toggle', 'lit']],
          after: {
            change: function(...P) {
              return register("lamp: after change", this.lstate);
            }
          },
          enter: {
            dark: function(...P) {
              this.up.goto('released');
              return register("lamp: enter dark", this.lstate);
            },
            lit: function(...P) {
              this.up.goto('pressed');
              return register("lamp: enter lit", this.lstate);
            }
          },
          stay: {
            dark: function(...P) {
              return register("lamp: stay dark", this.lstate);
            },
            lit: function(...P) {
              return register("lamp: stay lit", this.lstate);
            }
          },
          before: {
            trigger: function(...P) {
              return register("lamp: before *", this.lstate);
            }
          },
          goto: '*',
          bar: 108
        }
      },
      //.......................................................................................................
      after: {
        change: function(...P) {
          return register("root_fsm.change", this.lstate);
        }
      },
      foo: 42
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    //---------------------------------------------------------------------------------------------------------
    Intermatic = require('../../../apps/intermatic');
    button = new Intermatic(fsmd);
    T.eq(button.foo, 42);
    T.eq(button.lamp.bar, 108);
    info(button.triggers);
    info({
      button: {
        $value: button.lstate,
        lamp: button.lamp.lstate
      }
    });
    urge({
      button: button.lstate,
      'button/lamp': button.lamp.lstate
    });
    urge({
      button: button.lstate,
      button_lamp: button.lamp.lstate
    });
    urge({
      root: button.lstate,
      lamp: button.lamp.lstate
    });
    help([`°button:^${button.lstate}`, `°button/lamp:^${button.lamp.lstate}`]);
    button.start();
    info({
      button: {
        $value: button.lstate,
        lamp: button.lamp.lstate
      }
    });
    urge({
      button: button.lstate,
      'button/lamp': button.lamp.lstate
    });
    urge({
      button: button.lstate,
      button_lamp: button.lamp.lstate
    });
    urge({
      root: button.lstate,
      lamp: button.lamp.lstate
    });
    help([`°button:^${button.lstate}`, `°button/lamp:^${button.lamp.lstate}`]);
    button.press();
    info({
      button: {
        $value: button.lstate,
        lamp: button.lamp.lstate
      }
    });
    urge({
      button: button.lstate,
      'button/lamp': button.lamp.lstate
    });
    urge({
      button: button.lstate,
      button_lamp: button.lamp.lstate
    });
    urge({
      root: button.lstate,
      lamp: button.lamp.lstate
    });
    help([`°button:^${button.lstate}`, `°button/lamp:^${button.lamp.lstate}`]);
    show_result();
    T.eq(result, [['button: stay released', 'released'], ['lamp: enter dark', 'dark'], ['lamp: after change', 'dark'], ['button: enter released', 'released'], ['root_fsm.change', 'released'], ['button: stay pressed', 'pressed'], ['lamp: enter lit', 'lit'], ['lamp: after change', 'lit'], ['button: enter pressed', 'pressed'], ['root_fsm.change', 'pressed']]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic cFsm 2"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'cfsm2',
      fsms: {
        alpha_btn: {
          //.......................................................................................................
          triggers: [['void', 'start', 'released'], ['*', 'reset', 'void'], ['released', 'press', 'pressed'], ['pressed', 'release', 'released']],
          // enter:
          //   pressed:  ( P... ) ->
          //   released: ( P... ) ->
          // before:
          //   start:    ( P... ) -> @lamp.start()
          cascades: ['start'],
          after: {
            change: function(...P) {
              this.lamp.toggle();
              return register("alpha_btn.after.change", this.EXP_cstate);
            }
          },
          //.......................................................................................................
          fsms: {
            //.....................................................................................................
            color: {
              triggers: [['red', 'toggle', 'green'], ['green', 'toggle', 'red']],
              after: {
                change: function(...P) {
                  return register("color.after.change", this.EXP_cstate);
                }
              }
            },
            //.....................................................................................................
            lamp: {
              triggers: [['void', 'start', 'lit'], ['lit', 'toggle', 'dark'], ['dark', 'toggle', 'lit']],
              enter: {
                dark: function(...P) {
                  return this.up.color.toggle();
                }
              },
              after: {
                change: function(...P) {
                  return register("lamp.after.change", this.EXP_cstate);
                }
              }
            }
          }
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    //---------------------------------------------------------------------------------------------------------
    Intermatic = require('../../../apps/intermatic');
    fsm = new Intermatic(fsmd);
    // debug '^898922^', fsm
    // debug '^898922^', ( k for k of fsm )
    whisper('-----------');
    whisper('start');
    fsm.alpha_btn.start();
    whisper('-----------');
    whisper('press');
    fsm.alpha_btn.press();
    whisper('-----------');
    whisper('release');
    fsm.alpha_btn.release();
    whisper('-----------');
    whisper('press');
    fsm.alpha_btn.press();
    whisper('-----------');
    whisper('release');
    fsm.alpha_btn.release();
    whisper('-----------');
    show_result();
    T.eq(result, [
      [
        'color.after.change',
        {
          lstate: 'green'
        }
      ],
      [
        'lamp.after.change',
        {
          lstate: 'lit'
        }
      ],
      [
        'color.after.change',
        {
          lstate: 'red'
        }
      ],
      [
        'lamp.after.change',
        {
          lstate: 'dark'
        }
      ],
      [
        'alpha_btn.after.change',
        {
          lstate: 'released',
          color: {
            lstate: 'red'
          },
          lamp: {
            lstate: 'dark'
          }
        }
      ],
      [
        'lamp.after.change',
        {
          lstate: 'lit'
        }
      ],
      [
        'alpha_btn.after.change',
        {
          lstate: 'pressed',
          color: {
            lstate: 'red'
          },
          lamp: {
            lstate: 'lit'
          }
        }
      ],
      [
        'color.after.change',
        {
          lstate: 'green'
        }
      ],
      [
        'lamp.after.change',
        {
          lstate: 'dark'
        }
      ],
      [
        'alpha_btn.after.change',
        {
          lstate: 'released',
          color: {
            lstate: 'green'
          },
          lamp: {
            lstate: 'dark'
          }
        }
      ],
      [
        'lamp.after.change',
        {
          lstate: 'lit'
        }
      ],
      [
        'alpha_btn.after.change',
        {
          lstate: 'pressed',
          color: {
            lstate: 'green'
          },
          lamp: {
            lstate: 'lit'
          }
        }
      ],
      [
        'color.after.change',
        {
          lstate: 'red'
        }
      ],
      [
        'lamp.after.change',
        {
          lstate: 'dark'
        }
      ],
      [
        'alpha_btn.after.change',
        {
          lstate: 'released',
          color: {
            lstate: 'red'
          },
          lamp: {
            lstate: 'dark'
          }
        }
      ]
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic AAL style FSMDs 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'φ',
      moves: {
        start: 'a',
        step: ['a', 'b', 'c', 'c'],
        stop: ['c', 'void']
      },
      before: {
        start: [
          (function() {
            return debug('^7776^',
          "start.before 1");
          }),
          (function() {
            return debug('^7776^',
          "start.before 2");
          }),
          (function() {
            return register("start.before");
          })
        ],
        step: function() {
          return register("step.before");
        },
        stop: function() {
          return register("stop.before");
        }
      },
      after: {
        start: function() {
          return register("start.after");
        },
        step: function() {
          return register("step.after");
        },
        stop: function() {
          return register("stop.after");
        }
      },
      enter: {
        void: function() {
          return register("void.enter");
        },
        a: function() {
          return register("a.enter");
        },
        b: function() {
          return register("b.enter");
        },
        c: function() {
          return register("c.enter");
        }
      },
      leave: {
        void: function() {
          return register("void.leave");
        },
        a: function() {
          return register("a.leave");
        },
        b: function() {
          return register("b.leave");
        },
        c: function() {
          return register("c.leave");
        }
      },
      stay: {
        c: function() {
          return register("c.stay");
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    //---------------------------------------------------------------------------------------------------------
    Intermatic = require('../../../apps/intermatic');
    fsm = new Intermatic(fsmd);
    echo('^4455^', CND.inspect(fsm));
    urge('^4455^', fsmd.moves);
    help('^4455^', fsm.moves);
    fsm.start();
    // fsm.step()
    // fsm.step()
    // fsm.step()
    // fsm.stop()
    show_result();
    if (done != null) {
      // T.eq result, [
      //---------------------------------------------------------------------------------------------------------
      return done();
    }
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // @demo_2()
      // @toolbox_demo()
      // test @
      // test @[ "Intermatic AAL style FSMDs 1" ]
      return this["Intermatic AAL style FSMDs 1"]();
    })();
  }

  // test @[ "Intermatic observables during moves 1" ]
// test @[ "Intermatic catchalls 1" ]
// test @[ "Intermatic cyclers 1" ]
// test @[ "Intermatic goto 1" ]
// test @[ "Intermatic cancel moves" ]
// test @[ "Intermatic history" ]
// test @[ "Intermatic data attribute 1" ]
// @[ "Intermatic data attribute 1" ]()
// test @[ "Intermatic attribute freezing" ]
// test @[ "Intermatic toolbox" ]
// test @[ "Intermatic tryto 1" ]
// test @[ "Intermatic tryto 2" ]
// test @[ "Intermatic cFsm 1" ]
// test @[ "Intermatic cFsm 2" ]
// test @[ "Intermatic cFsm" ]
// test @[ "Intermatic empty FSM" ]
// test @[ "Intermatic before.start(), after.start()" ]
// @[ "Intermatic empty FSM" ]()

}).call(this);

//# sourceMappingURL=main.tests.js.map