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
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic({});
    T.eq(fsm.moves, {});
    T.eq(fsm.start, void 0);
    T.eq(fsm.lstate, 'void');
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic fairly minimal FSM without moves"] = function(T, done) {
    var Intermatic, error, fsm, fsmd;
    ({Intermatic} = require('../../../apps/intermatic'));
    fsmd = {
      name: 'toolbox',
      cascades: ['start'],
      moves: {
        start: 'active'
      },
      before: {
        start: function() {
          return log('^IMATC@13344^', "IMATC.toolbox_fsm.before.start", this.cstate);
        }
      }
    };
    fsm = new Intermatic(fsmd);
    // debug '^3334^', fsm.moves
    T.eq(fsm.moves, {
      start: {
        void: 'active'
      }
    });
    T.eq(fsm.lstate, 'void');
    try {
      //.........................................................................................................
      validate.function(fsm.start);
    } catch (error1) {
      error = error1;
      T.fail(error.message);
    }
    T.ok(error === void 0);
    //.........................................................................................................
    fsm.start();
    T.eq(fsm.lstate, 'active');
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic before.start(), after.start()"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    ({result, show_result, register} = new_register());
    ({Intermatic} = require('../../../apps/intermatic'));
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      moves: {
        start: 'void'
      },
      before: {
        start: function() {
          return register("before start", this.move);
        }
      },
      after: {
        start: function() {
          return register("after start", this.move);
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    fsm = new Intermatic(fsmd);
    T.eq(fsm.start(), null);
    T.eq(fsm.lstate, 'void');
    show_result();
    T.eq(result, [
      [
        'before start',
        {
          stage: 'before',
          verb: 'start',
          dpar: 'void',
          dest: 'void',
          lstate: 'void'
        }
      ],
      [
        'after start',
        {
          stage: 'after',
          verb: 'start',
          dpar: 'void',
          dest: 'void',
          lstate: 'void'
        }
      ]
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic basics"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'meta_lamp',
      moves: {
        start: ['void', 'lit'],
        reset: ['any', 'void'],
        toggle: ['lit', 'dark', 'lit']
      },
      after: {
        change: function() {
          return register("after change", this.cstate);
        }
      },
      entering: {
        dark: function() {
          return register("entering dark", this.cstate);
        }
      },
      leaving: {
        lit: function() {
          return register("leaving lit", this.cstate);
        }
      },
      fail: function() {
        return register("failed", this.cstate);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, show_result, register} = new_register());
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    // info '^44455^', JSON.stringify fsm.moves, null, 2
    T.eq(fsm.moves, {
      start: {
        void: 'lit'
      },
      reset: {
        any: 'void'
      },
      toggle: {
        lit: 'dark',
        dark: 'lit'
      }
    });
    fsm.start();
    fsm.toggle();
    fsm.reset();
    fsm.toggle();
    show_result();
    T.eq(result, [
      [
        'after change',
        {
          stage: 'after',
          verb: 'start',
          dpar: 'void',
          dest: 'lit',
          changed: true,
          path: 'meta_lamp',
          lstate: 'lit'
        }
      ],
      [
        'leaving lit',
        {
          stage: 'leaving',
          verb: 'toggle',
          dpar: 'lit',
          dest: 'dark',
          changed: true,
          path: 'meta_lamp',
          lstate: 'lit'
        }
      ],
      [
        'entering dark',
        {
          stage: 'entering',
          verb: 'toggle',
          dpar: 'lit',
          dest: 'dark',
          changed: true,
          path: 'meta_lamp',
          lstate: 'dark'
        }
      ],
      [
        'after change',
        {
          stage: 'after',
          verb: 'toggle',
          dpar: 'lit',
          dest: 'dark',
          changed: true,
          path: 'meta_lamp',
          lstate: 'dark'
        }
      ],
      [
        'after change',
        {
          stage: 'after',
          verb: 'reset',
          dpar: 'dark',
          dest: 'void',
          changed: true,
          path: 'meta_lamp',
          lstate: 'void'
        }
      ],
      [
        'failed',
        {
          verb: 'toggle',
          dpar: 'void',
          failed: true,
          path: 'meta_lamp',
          lstate: 'void'
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
      moves: {
        start: 'lit',
        reset: ['any', 'void'],
        flash: ['any', 'flashing'],
        toggle: [['lit', 'dark', 'lit'], ['flashing', 'dark']]
      },
      after: {
        change: function(...P) {
          return register(this.history);
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register} = new_register());
    ({Intermatic} = require('../../../apps/intermatic'));
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
  this["__ Intermatic cancel moves"] = function(T, done) {
    var Intermatic, fsmd;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'boiler',
      // cascades:
      //   # start: 'any' ### TAINT all FSMs in tree? all sibling FSMs? parent FSMs? ###
      //   start: [ 'heater', ]
      moves: {
        start: 'operating'
      },
      before: {
        start: function(...P) {
          this.register('boiler.before.start', this.move);
          return this.heater.start(...P);
        }
      },
      after: {
        change: function(...P) {
          return this.register('boiler.after.change', this.move);
        }
      },
      heater: {
        data: {
          enabled: true,
          temparature: 20
        },
        moves: {
          start: ['void', 'idle'],
          switch_off: ['heating', 'idle'],
          switch_on: ['idle', 'heating']
        },
        // before:
        //   any:      -> @register 'heater.before.any', @move, @data
        entering: {
          heating: function() {
            if (!this.data.enabled) {
              warn('^3334^', "heater not enabled; cancelling");
              this.cancel();
            }
            debug('^445554^', this.lstate);
            debug('^445554^', this.move);
            return this.up.register('heater.entering.heating', this.lstate, this.move, this.data);
          }
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    Intermatic = require('../../../apps/intermatic');
    (() => {
      var boiler, register, result, show_result;
      ({result, show_result, register} = new_register());
      boiler = new Intermatic(fsmd);
      boiler.register = register;
      boiler.heater.data.enabled = true;
      boiler.start();
      boiler.heater.switch_on();
      return show_result();
    })();
    (() => {
      var boiler, register, result, show_result;
      ({result, show_result, register} = new_register());
      boiler = new Intermatic(fsmd);
      boiler.register = register;
      boiler.heater.data.enabled = false;
      boiler.start();
      boiler.heater.switch_on();
      return show_result();
    })();
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic goto 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'meta_lamp',
      moves: {
        start: 'lit',
        reset: ['any', 'void'],
        toggle: ['lit', 'dark', 'lit']
      },
      before: {
        any: function(...P) {
          return register('before.any', this.cstate, P);
        }
      },
      // after:
      //   change:     ( P... ) -> register 'after.change',  @cstate
      // entering:
      //   dark:       ( P... ) -> register 'entering.dark',    @cstate
      //   lit:        ( P... ) -> register 'entering.lit',     @cstate
      goto: 'any',
      fail: function(...P) {
        return register('failed', this.cstate, P);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    // T.eq ( Object.keys fsm ),  [ 'reserved', 'fsmd', 'moves', 'fsm_names', 'has_subfsms', '_lstate', 'before', 'entering', 'keeping', 'leaving', 'after', 'up', 'starts_with', 'start', 'toggle', 'reset', 'goto', 'name', 'fail' ]
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
          stage: 'before',
          verb: 'start',
          dpar: 'void',
          dest: 'lit',
          changed: true,
          lstate: 'void',
          path: 'meta_lamp'
        },
        ['M1']
      ],
      [
        'before.any',
        {
          stage: 'before',
          verb: 'toggle',
          dpar: 'lit',
          dest: 'dark',
          changed: true,
          lstate: 'lit',
          path: 'meta_lamp'
        },
        ['M2']
      ],
      [
        'before.any',
        {
          stage: 'before',
          verb: 'goto',
          dpar: 'dark',
          dest: 'lit',
          changed: true,
          lstate: 'dark',
          path: 'meta_lamp'
        },
        ['M3']
      ],
      [
        'before.any',
        {
          stage: 'before',
          verb: 'goto',
          dpar: 'lit',
          dest: 'lit',
          lstate: 'lit',
          path: 'meta_lamp'
        },
        ['M4']
      ],
      [
        'before.any',
        {
          stage: 'before',
          verb: 'goto',
          dpar: 'lit',
          dest: 'dark',
          changed: true,
          lstate: 'lit',
          path: 'meta_lamp'
        },
        ['M5']
      ],
      [
        'before.any',
        {
          stage: 'before',
          verb: 'toggle',
          dpar: 'dark',
          dest: 'lit',
          changed: true,
          lstate: 'dark',
          path: 'meta_lamp'
        },
        ['M6']
      ],
      [
        'before.any',
        {
          stage: 'before',
          verb: 'toggle',
          dpar: 'lit',
          dest: 'dark',
          changed: true,
          lstate: 'lit',
          path: 'meta_lamp'
        },
        ['M7']
      ],
      [
        'before.any',
        {
          stage: 'before',
          verb: 'toggle',
          dpar: 'dark',
          dest: 'lit',
          changed: true,
          lstate: 'dark',
          path: 'meta_lamp'
        },
        ['M8']
      ]
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic data attribute 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, mydata, register, result, show_result;
    mydata = {
      counter: 42
    };
    Object.defineProperties(mydata, {
      computed: {
        enumerable: true,
        get: function() {
          return 'helo';
        }
      }
    });
    debug('^55567^', mydata);
    debug('^55567^', mydata.computed);
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'simple',
      data: mydata,
      moves: {
        start: 'first',
        step: ['first', 'second', 'first']
      },
      before: {
        start: function(...P) {
          return this.sub.start();
        }
      },
      entering: {
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
      sub: {
        data: {
          frobs: 0
        },
        moves: {
          start: 'dub',
          toggle: ['dub', 'frob', 'dub']
        },
        leaving: {
          frob: function(...P) {
            this.data.frobs++;
            return help(this.data.frobs);
          }
        }
      }
    };
    ({result, show_result, register} = new_register());
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    T.eq(fsm.data, {
      counter: 42,
      computed: 'helo'
    });
    fsm.start();
    urge(fsm.cstate, fsm.data.counter, fsm.sub.data.frobs);
    fsm.step();
    urge(fsm.cstate, fsm.data.counter, fsm.sub.data.frobs);
    fsm.step();
    urge(fsm.cstate, fsm.data.counter, fsm.sub.data.frobs);
    fsm.step();
    urge(fsm.cstate, fsm.data.counter, fsm.sub.data.frobs);
    // fsm.step();   urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
    // fsm.step();   urge fsm.cstate, fsm.data.counter, fsm.sub.data.frobs
    show_result();
    T.eq(result, [
      {
        stage: 'entering',
        verb: 'start',
        dpar: 'void',
        dest: 'first',
        changed: true,
        lstate: 'first',
        path: 'simple',
        data: {
          counter: 43,
          computed: 'helo'
        },
        sub: {
          lstate: 'dub',
          path: 'simple/sub',
          data: {
            frobs: 0
          }
        }
      },
      {
        stage: 'entering',
        verb: 'step',
        dpar: 'first',
        dest: 'second',
        changed: true,
        lstate: 'second',
        path: 'simple',
        data: {
          counter: 43,
          computed: 'helo'
        },
        sub: {
          lstate: 'frob',
          path: 'simple/sub',
          data: {
            frobs: 0
          }
        }
      },
      {
        stage: 'entering',
        verb: 'step',
        dpar: 'second',
        dest: 'first',
        changed: true,
        lstate: 'first',
        path: 'simple',
        data: {
          counter: 44,
          computed: 'helo'
        },
        sub: {
          lstate: 'frob',
          path: 'simple/sub',
          data: {
            frobs: 0
          }
        }
      },
      {
        stage: 'entering',
        verb: 'step',
        dpar: 'first',
        dest: 'second',
        changed: true,
        lstate: 'second',
        path: 'simple',
        data: {
          counter: 44,
          computed: 'helo'
        },
        sub: {
          lstate: 'dub',
          path: 'simple/sub',
          data: {
            frobs: 1
          }
        }
      }
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic catchalls 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'knob',
      moves: {
        start: 'bar',
        step: ['bar', 'baz', 'gnu', 'doe', 'bar']
      },
      goto: 'any',
      before: {
        any: function(ref) {
          return register('before.any', this.move, ref);
        },
        change: function(ref) {
          return register('before.change', this.move, ref);
        }
      },
      entering: {
        any: function(ref) {
          return register('entering.any', this.move, ref);
        }
      },
      keeping: {
        any: function(ref) {
          return register('keeping.any', this.move, ref);
        }
      },
      leaving: {
        any: function(ref) {
          return register('leaving.any', this.move, ref);
        }
      },
      after: {
        any: function(ref) {
          return register('after.any', this.move, ref);
        },
        change: function(ref) {
          return register('after.change', this.move, ref);
        }
      },
      fail: function(ref) {
        return register('fail', this.move, ref);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    info("fsm.start()     ———");
    fsm.start('A1');
    info("fsm.step()      ———");
    fsm.step('A2');
    info(`fsm.goto.${fsm.lstate}()  ———`);
    fsm.goto(fsm.lstate, 'A3');
    show_result();
    T.eq(result, [
      [
        'before.any',
        {
          stage: 'before',
          verb: 'start',
          dpar: 'void',
          dest: 'bar',
          changed: true,
          lstate: 'void'
        },
        'A1'
      ],
      [
        'before.change',
        {
          stage: 'before',
          verb: 'start',
          dpar: 'void',
          dest: 'bar',
          changed: true,
          lstate: 'void'
        },
        'A1'
      ],
      [
        'leaving.any',
        {
          stage: 'leaving',
          verb: 'start',
          dpar: 'void',
          dest: 'bar',
          changed: true,
          lstate: 'void'
        },
        'A1'
      ],
      [
        'entering.any',
        {
          stage: 'entering',
          verb: 'start',
          dpar: 'void',
          dest: 'bar',
          changed: true,
          lstate: 'bar'
        },
        'A1'
      ],
      [
        'after.any',
        {
          stage: 'after',
          verb: 'start',
          dpar: 'void',
          dest: 'bar',
          changed: true,
          lstate: 'bar'
        },
        'A1'
      ],
      [
        'after.change',
        {
          stage: 'after',
          verb: 'start',
          dpar: 'void',
          dest: 'bar',
          changed: true,
          lstate: 'bar'
        },
        'A1'
      ],
      [
        'before.any',
        {
          stage: 'before',
          verb: 'step',
          dpar: 'bar',
          dest: 'baz',
          changed: true,
          lstate: 'bar'
        },
        'A2'
      ],
      [
        'before.change',
        {
          stage: 'before',
          verb: 'step',
          dpar: 'bar',
          dest: 'baz',
          changed: true,
          lstate: 'bar'
        },
        'A2'
      ],
      [
        'leaving.any',
        {
          stage: 'leaving',
          verb: 'step',
          dpar: 'bar',
          dest: 'baz',
          changed: true,
          lstate: 'bar'
        },
        'A2'
      ],
      [
        'entering.any',
        {
          stage: 'entering',
          verb: 'step',
          dpar: 'bar',
          dest: 'baz',
          changed: true,
          lstate: 'baz'
        },
        'A2'
      ],
      [
        'after.any',
        {
          stage: 'after',
          verb: 'step',
          dpar: 'bar',
          dest: 'baz',
          changed: true,
          lstate: 'baz'
        },
        'A2'
      ],
      [
        'after.change',
        {
          stage: 'after',
          verb: 'step',
          dpar: 'bar',
          dest: 'baz',
          changed: true,
          lstate: 'baz'
        },
        'A2'
      ],
      [
        'before.any',
        {
          stage: 'before',
          verb: 'goto',
          dpar: 'baz',
          dest: 'baz',
          lstate: 'baz'
        },
        'A3'
      ],
      [
        'keeping.any',
        {
          stage: 'keeping',
          verb: 'goto',
          dpar: 'baz',
          dest: 'baz',
          lstate: 'baz'
        },
        'A3'
      ],
      [
        'after.any',
        {
          stage: 'after',
          verb: 'goto',
          dpar: 'baz',
          dest: 'baz',
          lstate: 'baz'
        },
        'A3'
      ]
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic observables during moves 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'knob',
      moves: {
        start: 'bar',
        step: ['bar', 'baz', 'gnu', 'doe', 'bar']
      },
      goto: 'any',
      before: {
        any: function(...P) {
          return register('before any', fsm.move);
        }
      },
      fail: function(...P) {
        return register('fail', fsm.move);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    //.........................................................................................................
    register('first', fsm.move);
    info("fsm.start()");
    fsm.start();
    //.........................................................................................................
    register('mid1', fsm.move);
    info("fsm.step()");
    fsm.step();
    //.........................................................................................................
    register('mid2', fsm.move);
    fsm.goto(fsm.lstate);
    //.........................................................................................................
    register('last', fsm.move);
    //.........................................................................................................
    show_result();
    T.eq(result, [
      [
        'first',
        {
          lstate: 'void'
        }
      ],
      [
        'before any',
        {
          stage: 'before',
          verb: 'start',
          dpar: 'void',
          dest: 'bar',
          changed: true,
          lstate: 'void'
        }
      ],
      [
        'mid1',
        {
          lstate: 'bar'
        }
      ],
      [
        'before any',
        {
          stage: 'before',
          verb: 'step',
          dpar: 'bar',
          dest: 'baz',
          changed: true,
          lstate: 'bar'
        }
      ],
      [
        'mid2',
        {
          lstate: 'baz'
        }
      ],
      [
        'before any',
        {
          stage: 'before',
          verb: 'goto',
          dpar: 'baz',
          dest: 'baz',
          lstate: 'baz'
        }
      ],
      [
        'last',
        {
          lstate: 'baz'
        }
      ]
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic can 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'oneway_switch',
      moves: {
        start: 'off',
        toggle: ['off', 'on']
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    T.eq(true, fsm.can.start());
    T.eq(true, fsm.can('start'));
    fsm.start();
    T.eq(false, fsm.can.start());
    T.eq(false, fsm.can('start'));
    T.eq(true, fsm.can('toggle'));
    T.eq(true, fsm.can.toggle());
    fsm.toggle();
    T.eq(false, fsm.can('toggle'));
    T.eq(false, fsm.can.toggle());
    T.throws(/unknown verb "nonexisting_trigger"/, function() {
      return fsm.can('nonexisting_trigger');
    });
    T.throws(/unknown verb "nonexisting_trigger"/, function() {
      return fsm.can.nonexisting_trigger();
    });
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic tryto 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'oneway_switch',
      moves: {
        start: 'off',
        toggle: ['off', 'on']
      },
      goto: 'any'
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    T.eq(true, fsm.tryto.start());
    fsm.goto('void');
    T.eq(true, fsm.tryto('start'));
    T.eq(true, fsm.tryto('toggle'));
    fsm.goto('off');
    T.eq(true, fsm.tryto.toggle());
    T.eq(false, fsm.tryto('toggle'));
    T.eq(false, fsm.tryto.toggle());
    T.throws(/unknown verb "nonexisting_trigger"/, function() {
      return fsm.tryto('nonexisting_trigger');
    });
    T.throws(/unknown verb "nonexisting_trigger"/, function() {
      return fsm.can.nonexisting_trigger();
    });
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic cFsm 1"] = function(T, done) {
    var Intermatic, button, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      //.......................................................................................................
      moves: {
        start: 'released',
        reset: ['any', 'void'],
        press: ['released', 'pressed'],
        release: ['pressed', 'released']
      },
      entering: {
        pressed: function(...P) {
          this.lamp.goto('lit');
          return register("button: entering pressed", this.lstate);
        },
        released: function(...P) {
          this.lamp.goto('dark');
          return register("button: entering released", this.lstate);
        }
      },
      keeping: {
        pressed: function(...P) {
          return register("button: keeping pressed", this.lstate);
        },
        released: function(...P) {
          return register("button: keeping released", this.lstate);
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
      goto: 'any',
      //.......................................................................................................
      lamp: {
        moves: {
          start: 'lit',
          toggle: ['lit', 'dark', 'lit']
        },
        after: {
          change: function(...P) {
            return register("lamp: after change", this.lstate);
          }
        },
        entering: {
          dark: function(...P) {
            this.up.goto('released');
            return register("lamp: entering dark", this.lstate);
          },
          lit: function(...P) {
            this.up.goto('pressed');
            return register("lamp: entering lit", this.lstate);
          }
        },
        keeping: {
          dark: function(...P) {
            return register("lamp: keeping dark", this.lstate);
          },
          lit: function(...P) {
            return register("lamp: keeping lit", this.lstate);
          }
        },
        before: {
          trigger: function(...P) {
            return register("lamp: before *", this.lstate);
          }
        },
        goto: 'any',
        bar: 108
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
    ({Intermatic} = require('../../../apps/intermatic'));
    button = new Intermatic(fsmd);
    T.eq(button.foo, 42);
    T.eq(button.lamp.bar, 108);
    info(button.moves);
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
    T.eq(result, [['button: keeping released', 'released'], ['lamp: entering dark', 'dark'], ['lamp: after change', 'dark'], ['button: entering released', 'released'], ['root_fsm.change', 'released'], ['button: keeping pressed', 'pressed'], ['lamp: entering lit', 'lit'], ['lamp: after change', 'lit'], ['button: entering pressed', 'pressed'], ['root_fsm.change', 'pressed']]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic cFsm 2"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      cascades: ['start'],
      name: 'cfsm2',
      moves: {
        start: 'active'
      },
      //.....................................................................................................
      alpha_btn: {
        cascades: ['start'],
        moves: {
          start: 'released',
          reset: ['any', 'void'],
          press: ['released', 'pressed'],
          release: ['pressed', 'released']
        },
        //.....................................................................................................
        color: {
          moves: {
            start: 'red',
            toggle: ['red', 'green', 'red']
          }
        },
        //.....................................................................................................
        lamp: {
          moves: {
            start: 'lit',
            toggle: ['lit', 'dark', 'lit']
          }
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    //---------------------------------------------------------------------------------------------------------
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    register(fsm.cstate);
    fsm.start();
    register(fsm.cstate);
    show_result();
    T.eq(result, [
      {
        lstate: 'void',
        path: 'cfsm2',
        alpha_btn: {
          lstate: 'void',
          path: 'cfsm2/alpha_btn',
          color: {
            lstate: 'void',
            path: 'cfsm2/alpha_btn/color'
          },
          lamp: {
            lstate: 'void',
            path: 'cfsm2/alpha_btn/lamp'
          }
        }
      },
      {
        lstate: 'active',
        path: 'cfsm2',
        alpha_btn: {
          lstate: 'released',
          path: 'cfsm2/alpha_btn',
          color: {
            lstate: 'red',
            path: 'cfsm2/alpha_btn/color'
          },
          lamp: {
            lstate: 'lit',
            path: 'cfsm2/alpha_btn/lamp'
          }
        }
      }
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic cFsm event bubbling"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      cascades: ['start'],
      name: 'cfsm2',
      moves: {
        start: 'active'
      },
      //.....................................................................................................
      get_states: function() {
        return {
          btn: this.alpha_btn.lstate,
          color: this.alpha_btn.color.lstate,
          lamp: this.alpha_btn.lamp.lstate
        };
      },
      //.....................................................................................................
      after: {
        any: function() {
          return register('after.any', this.get_states());
        },
        // change:         -> register 'after.change',  @get_states()
        EXP_any_change: function(changed_fsm) {
          return register(`EXP_any_change ${changed_fsm.name}: ${changed_fsm.lstate}`);
        }
      },
      //.....................................................................................................
      alpha_btn: {
        cascades: ['start'],
        moves: {
          start: 'released',
          reset: ['any', 'void'],
          press: ['released', 'pressed'],
          release: ['pressed', 'released']
        },
        //.....................................................................................................
        entering: {
          pressed: function() {
            this.lamp.tryto.on();
            return this.color.step();
          },
          released: function() {
            return this.lamp.tryto.off();
          }
        },
        //.....................................................................................................
        color: {
          moves: {
            start: 'red',
            step: ['red', 'amber', 'green', 'red']
          }
        },
        //.....................................................................................................
        lamp: {
          moves: {
            start: 'dark',
            toggle: ['lit', 'dark', 'lit'],
            on: ['dark', 'lit'],
            off: ['lit', 'dark']
          }
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    //---------------------------------------------------------------------------------------------------------
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    info('fsm.start()');
    fsm.start();
    urge(fsm.get_states());
    info('fsm.alpha_btn.press()');
    fsm.alpha_btn.press();
    urge(fsm.get_states());
    info('fsm.alpha_btn.release()');
    fsm.alpha_btn.release();
    urge(fsm.get_states());
    info('fsm.alpha_btn.press()');
    fsm.alpha_btn.press();
    urge(fsm.get_states());
    show_result();
    T.eq(result, [
      'EXP_any_change color: red',
      'EXP_any_change lamp: dark',
      'EXP_any_change alpha_btn: released',
      [
        'after.any',
        {
          btn: 'released',
          color: 'red',
          lamp: 'dark'
        }
      ],
      'EXP_any_change lamp: lit',
      'EXP_any_change color: amber',
      'EXP_any_change alpha_btn: pressed',
      'EXP_any_change lamp: dark',
      'EXP_any_change alpha_btn: released',
      'EXP_any_change lamp: lit',
      'EXP_any_change color: green',
      'EXP_any_change alpha_btn: pressed'
    ]);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic cFsm root_fsm"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      cascades: ['start'],
      name: 'cfsm2',
      moves: {
        start: 'active'
      },
      //.....................................................................................................
      alpha_btn: {
        cascades: ['start'],
        moves: {
          start: 'released'
        },
        //.....................................................................................................
        color: {
          moves: {
            start: 'red'
          }
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    //---------------------------------------------------------------------------------------------------------
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    T.eq(fsm.root_fsm, null);
    T.eq(fsm.alpha_btn.root_fsm, fsm);
    T.eq(fsm.alpha_btn.color.root_fsm, fsm);
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic custom paths 1"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      cascades: ['start'],
      moves: {
        start: 'active'
      },
      //.....................................................................................................
      switch: {
        cascades: ['start'],
        moves: {
          start: 'released'
        },
        //.....................................................................................................
        lamp: {
          cascades: ['start'],
          moves: {
            start: 'dark',
            toggle: ['lit', 'dark', 'lit'],
            on: ['dark', 'lit'],
            off: ['lit', 'dark']
          },
          //...................................................................................................
          color: {
            moves: {
              start: 'red'
            }
          }
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    //---------------------------------------------------------------------------------------------------------
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    // urge fsm.omit_root_name,              false
    // urge fsm.switch.omit_root_name,       false
    // urge fsm.switch.lamp.omit_root_name,  false
    // urge fsm.path_separator,              '/'
    // urge fsm.switch.path_separator,       '/'
    // urge fsm.switch.lamp.path_separator,  '/'
    // urge fsm.breadcrumbs,                 [ 'FSM', ]
    // urge fsm.switch.breadcrumbs,          [ 'FSM',  'switch', ]
    // urge fsm.switch.lamp.breadcrumbs,     [ 'FSM',  'switch', 'lamp', ]
    // urge fsm.path,                        'FSM'
    // urge fsm.switch.path,                 'FSM/switch'
    // urge fsm.switch.lamp.path,            'FSM/switch/lamp'
    T.eq(fsm.omit_root_name, false);
    T.eq(fsm.switch.omit_root_name, false);
    T.eq(fsm.switch.lamp.omit_root_name, false);
    T.eq(fsm.path_separator, '/');
    T.eq(fsm.switch.path_separator, '/');
    T.eq(fsm.switch.lamp.path_separator, '/');
    T.eq(fsm.breadcrumbs, ['FSM']);
    T.eq(fsm.switch.breadcrumbs, ['FSM', 'switch']);
    T.eq(fsm.switch.lamp.breadcrumbs, ['FSM', 'switch', 'lamp']);
    T.eq(fsm.path, 'FSM');
    T.eq(fsm.switch.path, 'FSM/switch');
    T.eq(fsm.switch.lamp.path, 'FSM/switch/lamp');
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic custom paths 2"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      cascades: ['start'],
      name: 'cfsm2',
      omit_root_name: true,
      path_separator: '#',
      moves: {
        start: 'active'
      },
      //.....................................................................................................
      switch: {
        cascades: ['start'],
        moves: {
          start: 'released'
        },
        //.....................................................................................................
        lamp: {
          cascades: ['start'],
          moves: {
            start: 'dark',
            toggle: ['lit', 'dark', 'lit'],
            on: ['dark', 'lit'],
            off: ['lit', 'dark']
          },
          //...................................................................................................
          color: {
            moves: {
              start: 'red'
            }
          }
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    //---------------------------------------------------------------------------------------------------------
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    // urge fsm.omit_root_name,              true
    // urge fsm.switch.omit_root_name,       true
    // urge fsm.switch.lamp.omit_root_name,  true
    // urge fsm.path_separator,              '#'
    // urge fsm.switch.path_separator,       '#'
    // urge fsm.switch.lamp.path_separator,  '#'
    // urge fsm.breadcrumbs,                 []
    // urge fsm.switch.breadcrumbs,          [ 'switch', ]
    // urge fsm.switch.lamp.breadcrumbs,     [ 'switch', 'lamp', ]
    // urge fsm.path,                        'cfsm2'
    // urge fsm.switch.path,                 'switch'
    // urge fsm.switch.lamp.path,            'switch#lamp'
    T.eq(fsm.omit_root_name, true);
    T.eq(fsm.switch.omit_root_name, true);
    T.eq(fsm.switch.lamp.omit_root_name, true);
    T.eq(fsm.path_separator, '#');
    T.eq(fsm.switch.path_separator, '#');
    T.eq(fsm.switch.lamp.path_separator, '#');
    T.eq(fsm.breadcrumbs, []);
    T.eq(fsm.switch.breadcrumbs, ['switch']);
    T.eq(fsm.switch.lamp.breadcrumbs, ['switch', 'lamp']);
    T.eq(fsm.path, 'cfsm2');
    T.eq(fsm.switch.path, 'switch');
    T.eq(fsm.switch.lamp.path, 'switch#lamp');
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["____ Intermatic custom paths 2"] = function(T, done) {
    var Intermatic, fsm, fsmd, register, result, show_result;
    /* TAINT overwriting inheritables is under consideration; might re-write implementation to simplify code */
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      cascades: ['start'],
      name: 'cfsm2',
      omit_root_name: true,
      moves: {
        start: 'active'
      },
      //.....................................................................................................
      switch: {
        cascades: ['start'],
        path_separator: '=',
        moves: {
          start: 'released'
        },
        //.....................................................................................................
        lamp: {
          cascades: ['start'],
          moves: {
            start: 'dark',
            toggle: ['lit', 'dark', 'lit'],
            on: ['dark', 'lit'],
            off: ['lit', 'dark']
          },
          //...................................................................................................
          color: {
            moves: {
              start: 'red'
            }
          }
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    //---------------------------------------------------------------------------------------------------------
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    T.eq(fsm.omit_root_name, true);
    T.eq(fsm.switch.omit_root_name, true);
    T.eq(fsm.switch.lamp.omit_root_name, true);
    T.eq(fsm.path_separator, '#');
    T.eq(fsm.switch.path_separator, '#');
    T.eq(fsm.switch.lamp.path_separator, '#');
    T.eq(fsm.path, 'cfsm2');
    T.eq(fsm.switch.path, 'cfsm2#switch');
    T.eq(fsm.switch.lamp.path, 'cfsm2#switch#lamp');
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic reserved keys"] = function(T, done) {
    var Intermatic, fsm, fsmd;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      cascades: ['start'],
      name: 'cfsm2',
      moves: {
        start: 'active'
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    urge('^788345^', fsm._reserved_keys);
    // '_cancelled'
    // '_lstate'
    // '_nxt_dest'
    // '_nxt_dpar'
    // '_nxt_verb'
    // '_path'
    // '_prv_lstates'
    // '_prv_verbs'
    // '_reserved_keys'
    // '_stage'
    // '_state_stages'
    // '_tmp'
    // '_trigger_stages'
    T.ok(fsm._reserved_keys.has('after'));
    T.ok(fsm._reserved_keys.has('before'));
    T.ok(fsm._reserved_keys.has('cascades'));
    T.ok(fsm._reserved_keys.has('cstate'));
    T.ok(fsm._reserved_keys.has('data'));
    T.ok(fsm._reserved_keys.has('entering'));
    T.ok(fsm._reserved_keys.has('EXP_dstate'));
    T.ok(fsm._reserved_keys.has('fsm_names'));
    T.ok(fsm._reserved_keys.has('has_subfsms'));
    T.ok(fsm._reserved_keys.has('history_length'));
    T.ok(fsm._reserved_keys.has('keeping'));
    T.ok(fsm._reserved_keys.has('leaving'));
    T.ok(fsm._reserved_keys.has('lstate'));
    T.ok(fsm._reserved_keys.has('lstates'));
    T.ok(fsm._reserved_keys.has('moves'));
    T.ok(fsm._reserved_keys.has('up'));
    //---------------------------------------------------------------------------------------------------------
    return done();
  };

  //-----------------------------------------------------------------------------------------------------------
  this["Intermatic AAL style FSMDs 1"] = function(T, done) {
    var Intermatic, before_any, before_change, before_start_1, before_start_2, before_start_3, before_step, before_stop, fsm, fsmd, register, result, show_result;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'φ',
      moves: {
        start: 'a',
        step: ['a', 'b', 'c', 'c'],
        stop: ['c', 'void']
      },
      before: {
        any: before_any = function() {
          return register("before.any", this.move);
        },
        change: before_change = function() {
          return register("before.change", this.move);
        },
        start: [
          (before_start_1 = function() {
            return debug('^7776^',
          "before.start 1",
          this.move);
          }),
          (before_start_2 = function() {
            return debug('^7776^',
          "before.start 2",
          this.move);
          }),
          (before_start_3 = function() {
            return register("before.start",
          this.move);
          })
        ],
        step: before_step = function() {
          return register("before.step", this.move);
        },
        stop: before_stop = function() {
          return register("before.stop", this.move);
        }
      },
      after: {
        any: function() {
          return register("after.any", this.move);
        },
        change: function() {
          return register("after.change", this.move);
        },
        start: function() {
          return register("after.start", this.move);
        },
        step: function() {
          return register("after.step", this.move);
        },
        stop: function() {
          return register("after.stop", this.move);
        }
      },
      entering: {
        any: function() {
          return register("entering.any", this.move);
        },
        void: function() {
          return register("entering.void", this.move);
        },
        a: function() {
          return register("entering.a", this.move);
        },
        b: function() {
          return register("entering.b", this.move);
        },
        c: function() {
          return register("entering.c", this.move);
        }
      },
      leaving: {
        any: function() {
          return register("leaving.any", this.move);
        },
        void: function() {
          return register("leaving.void", this.move);
        },
        a: function() {
          return register("leaving.a", this.move);
        },
        b: function() {
          return register("leaving.b", this.move);
        },
        c: function() {
          return register("leaving.c", this.move);
        }
      },
      keeping: {
        any: function() {
          return register("keeping.any", this.move);
        },
        c: function() {
          return register("keeping.c", this.move);
        }
      },
      fail: function() {
        return register("fail", this.move);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({result, register, show_result} = new_register());
    //---------------------------------------------------------------------------------------------------------
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    echo('^4455^', CND.inspect(fsm));
    urge('^4455^', fsmd.moves);
    help('^4455^', fsm.moves);
    fsm.start();
    fsm.step();
    fsm.step();
    fsm.step();
    fsm.stop();
    fsm.step();
    show_result();
    T.eq(result, [
      [
        'before.any',
        {
          stage: 'before',
          verb: 'start',
          dpar: 'void',
          dest: 'a',
          changed: true,
          lstate: 'void'
        }
      ],
      [
        'before.change',
        {
          stage: 'before',
          verb: 'start',
          dpar: 'void',
          dest: 'a',
          changed: true,
          lstate: 'void'
        }
      ],
      [
        'before.start',
        {
          stage: 'before',
          verb: 'start',
          dpar: 'void',
          dest: 'a',
          changed: true,
          lstate: 'void'
        }
      ],
      [
        'leaving.any',
        {
          stage: 'leaving',
          verb: 'start',
          dpar: 'void',
          dest: 'a',
          changed: true,
          lstate: 'void'
        }
      ],
      [
        'leaving.void',
        {
          stage: 'leaving',
          verb: 'start',
          dpar: 'void',
          dest: 'a',
          changed: true,
          lstate: 'void'
        }
      ],
      [
        'entering.any',
        {
          stage: 'entering',
          verb: 'start',
          dpar: 'void',
          dest: 'a',
          changed: true,
          lstate: 'a'
        }
      ],
      [
        'entering.a',
        {
          stage: 'entering',
          verb: 'start',
          dpar: 'void',
          dest: 'a',
          changed: true,
          lstate: 'a'
        }
      ],
      [
        'after.any',
        {
          stage: 'after',
          verb: 'start',
          dpar: 'void',
          dest: 'a',
          changed: true,
          lstate: 'a'
        }
      ],
      [
        'after.change',
        {
          stage: 'after',
          verb: 'start',
          dpar: 'void',
          dest: 'a',
          changed: true,
          lstate: 'a'
        }
      ],
      [
        'after.start',
        {
          stage: 'after',
          verb: 'start',
          dpar: 'void',
          dest: 'a',
          changed: true,
          lstate: 'a'
        }
      ],
      [
        'before.any',
        {
          stage: 'before',
          verb: 'step',
          dpar: 'a',
          dest: 'b',
          changed: true,
          lstate: 'a'
        }
      ],
      [
        'before.change',
        {
          stage: 'before',
          verb: 'step',
          dpar: 'a',
          dest: 'b',
          changed: true,
          lstate: 'a'
        }
      ],
      [
        'before.step',
        {
          stage: 'before',
          verb: 'step',
          dpar: 'a',
          dest: 'b',
          changed: true,
          lstate: 'a'
        }
      ],
      [
        'leaving.any',
        {
          stage: 'leaving',
          verb: 'step',
          dpar: 'a',
          dest: 'b',
          changed: true,
          lstate: 'a'
        }
      ],
      [
        'leaving.a',
        {
          stage: 'leaving',
          verb: 'step',
          dpar: 'a',
          dest: 'b',
          changed: true,
          lstate: 'a'
        }
      ],
      [
        'entering.any',
        {
          stage: 'entering',
          verb: 'step',
          dpar: 'a',
          dest: 'b',
          changed: true,
          lstate: 'b'
        }
      ],
      [
        'entering.b',
        {
          stage: 'entering',
          verb: 'step',
          dpar: 'a',
          dest: 'b',
          changed: true,
          lstate: 'b'
        }
      ],
      [
        'after.any',
        {
          stage: 'after',
          verb: 'step',
          dpar: 'a',
          dest: 'b',
          changed: true,
          lstate: 'b'
        }
      ],
      [
        'after.change',
        {
          stage: 'after',
          verb: 'step',
          dpar: 'a',
          dest: 'b',
          changed: true,
          lstate: 'b'
        }
      ],
      [
        'after.step',
        {
          stage: 'after',
          verb: 'step',
          dpar: 'a',
          dest: 'b',
          changed: true,
          lstate: 'b'
        }
      ],
      [
        'before.any',
        {
          stage: 'before',
          verb: 'step',
          dpar: 'b',
          dest: 'c',
          changed: true,
          lstate: 'b'
        }
      ],
      [
        'before.change',
        {
          stage: 'before',
          verb: 'step',
          dpar: 'b',
          dest: 'c',
          changed: true,
          lstate: 'b'
        }
      ],
      [
        'before.step',
        {
          stage: 'before',
          verb: 'step',
          dpar: 'b',
          dest: 'c',
          changed: true,
          lstate: 'b'
        }
      ],
      [
        'leaving.any',
        {
          stage: 'leaving',
          verb: 'step',
          dpar: 'b',
          dest: 'c',
          changed: true,
          lstate: 'b'
        }
      ],
      [
        'leaving.b',
        {
          stage: 'leaving',
          verb: 'step',
          dpar: 'b',
          dest: 'c',
          changed: true,
          lstate: 'b'
        }
      ],
      [
        'entering.any',
        {
          stage: 'entering',
          verb: 'step',
          dpar: 'b',
          dest: 'c',
          changed: true,
          lstate: 'c'
        }
      ],
      [
        'entering.c',
        {
          stage: 'entering',
          verb: 'step',
          dpar: 'b',
          dest: 'c',
          changed: true,
          lstate: 'c'
        }
      ],
      [
        'after.any',
        {
          stage: 'after',
          verb: 'step',
          dpar: 'b',
          dest: 'c',
          changed: true,
          lstate: 'c'
        }
      ],
      [
        'after.change',
        {
          stage: 'after',
          verb: 'step',
          dpar: 'b',
          dest: 'c',
          changed: true,
          lstate: 'c'
        }
      ],
      [
        'after.step',
        {
          stage: 'after',
          verb: 'step',
          dpar: 'b',
          dest: 'c',
          changed: true,
          lstate: 'c'
        }
      ],
      [
        'before.any',
        {
          stage: 'before',
          verb: 'step',
          dpar: 'c',
          dest: 'c',
          lstate: 'c'
        }
      ],
      [
        'before.step',
        {
          stage: 'before',
          verb: 'step',
          dpar: 'c',
          dest: 'c',
          lstate: 'c'
        }
      ],
      [
        'keeping.any',
        {
          stage: 'keeping',
          verb: 'step',
          dpar: 'c',
          dest: 'c',
          lstate: 'c'
        }
      ],
      [
        'keeping.c',
        {
          stage: 'keeping',
          verb: 'step',
          dpar: 'c',
          dest: 'c',
          lstate: 'c'
        }
      ],
      [
        'after.any',
        {
          stage: 'after',
          verb: 'step',
          dpar: 'c',
          dest: 'c',
          lstate: 'c'
        }
      ],
      [
        'after.step',
        {
          stage: 'after',
          verb: 'step',
          dpar: 'c',
          dest: 'c',
          lstate: 'c'
        }
      ],
      [
        'before.any',
        {
          stage: 'before',
          verb: 'stop',
          dpar: 'c',
          dest: 'void',
          changed: true,
          lstate: 'c'
        }
      ],
      [
        'before.change',
        {
          stage: 'before',
          verb: 'stop',
          dpar: 'c',
          dest: 'void',
          changed: true,
          lstate: 'c'
        }
      ],
      [
        'before.stop',
        {
          stage: 'before',
          verb: 'stop',
          dpar: 'c',
          dest: 'void',
          changed: true,
          lstate: 'c'
        }
      ],
      [
        'leaving.any',
        {
          stage: 'leaving',
          verb: 'stop',
          dpar: 'c',
          dest: 'void',
          changed: true,
          lstate: 'c'
        }
      ],
      [
        'leaving.c',
        {
          stage: 'leaving',
          verb: 'stop',
          dpar: 'c',
          dest: 'void',
          changed: true,
          lstate: 'c'
        }
      ],
      [
        'entering.any',
        {
          stage: 'entering',
          verb: 'stop',
          dpar: 'c',
          dest: 'void',
          changed: true,
          lstate: 'void'
        }
      ],
      [
        'entering.void',
        {
          stage: 'entering',
          verb: 'stop',
          dpar: 'c',
          dest: 'void',
          changed: true,
          lstate: 'void'
        }
      ],
      [
        'after.any',
        {
          stage: 'after',
          verb: 'stop',
          dpar: 'c',
          dest: 'void',
          changed: true,
          lstate: 'void'
        }
      ],
      [
        'after.change',
        {
          stage: 'after',
          verb: 'stop',
          dpar: 'c',
          dest: 'void',
          changed: true,
          lstate: 'void'
        }
      ],
      [
        'after.stop',
        {
          stage: 'after',
          verb: 'stop',
          dpar: 'c',
          dest: 'void',
          changed: true,
          lstate: 'void'
        }
      ],
      [
        'fail',
        {
          verb: 'step',
          dpar: 'void',
          lstate: 'void',
          failed: true
        }
      ]
    ]);
    if (done != null) {
      //---------------------------------------------------------------------------------------------------------
      return done();
    }
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // @demo_2()
      // @toolbox_demo()
      return test(this);
    })();
  }

  // test @[ "Intermatic custom paths 1" ]
// test @[ "Intermatic custom paths 2" ]
// @[ "Intermatic custom paths 1" ]()
// test @[ "Intermatic cFsm root_fsm" ]
// @[ "Intermatic cFsm root_fsm" ]()
// test @[ "Intermatic cFsm event bubbling" ]
// test @[ "Intermatic reserved keys" ]
// test @[ "___ Intermatic attribute freezing"        ]
// test @[ "Intermatic empty FSM"                     ]
// test @[ "Intermatic fairly minimal FSM without moves" ]
// test @[ "Intermatic before.start(), after.start()" ]
// test @[ "Intermatic basics" ]
// test @[ "Intermatic history" ]
// @[ "Intermatic cancel moves" ]()
// test @[ "Intermatic cancel moves" ]
// test @[ "Intermatic goto 1" ]
// test @[ "Intermatic data attribute 1" ]
// test @[ "Intermatic catchalls 1" ]
// test @[ "Intermatic observables during moves 1" ]
// test @[ "Intermatic can 1" ]
// test @[ "Intermatic tryto 1" ]
// test @[ "Intermatic cFsm 1" ]
// test @[ "Intermatic cFsm 2" ]
// test @[ "Intermatic AAL style FSMDs 1" ]

}).call(this);

//# sourceMappingURL=main.tests.js.map