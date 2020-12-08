(function() {
  'use strict';
  var CND, Intermatic, PATH, Recorder, after, badge, debug, declare, demo_regulator, demo_watertower, echo, equals, every, freeze, help, info, isa, lets, log, new_regulator_fsm, new_watertower_fsm, rpr, sleep, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/WATERTOWER';

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

  ({isa, equals, validate, declare, type_of} = types.export());

  ({freeze, lets} = require('letsfreezethat'));

  Intermatic = require('../../../apps/intermatic');

  Recorder = require('./recorder');

  after = function(dts, f) {
    return setTimeout(f, dts * 1000);
  };

  every = function(dts, f) {
    return setInterval(f, dts * 1000);
  };

  sleep = function(dts) {
    return new Promise(function(done) {
      return after(dts, done);
    });
  };

  //===========================================================================================================
  // TYPES
  //-----------------------------------------------------------------------------------------------------------
  // declare 'toolbox_button_cfg', tests:
  //   "x is an object": ( x ) -> @isa.object x

  //===========================================================================================================
  // FACTORIES
  //-----------------------------------------------------------------------------------------------------------
  new_watertower_fsm = function() {
    var barrel, fsmd, inlet, outlet;
    //---------------------------------------------------------------------------------------------------------
    barrel = {
      triggers: [['void', 'start', 'active'], ['active', 'stop', 'stopped']],
      data: {
        max_level: 110, // maximum fill level in ℓ
        min_level: 90, // minimum fill level in ℓ
        level: 0 // current fill level in ℓ
      }
    };
    //---------------------------------------------------------------------------------------------------------
    inlet = {
      triggers: [['void', 'start', 'active'], ['active', 'stop', 'stopped']],
      data: {
        max_rate: 10, // maximum water filling rate in ℓ / s
        min_rate: 0, // minimum water filling rate in ℓ / s
        rate: 0 // current water filling rate in ℓ / s
      }
    };
    //---------------------------------------------------------------------------------------------------------
    outlet = {
      triggers: [['void', 'start', 'active'], ['active', 'stop', 'stopped']],
      data: {
        max_rate: 20, // maximum water outflow rate in ℓ / s
        min_rate: 0, // minimum water outflow rate in ℓ / s
        rate: 0 // current water outflow rate in ℓ / s
      }
    };
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'tower',
      triggers: [['void', 'start', 'active'], ['active', 'stop', 'stopped']],
      cascades: ['start', 'stop'],
      fsms: {barrel, inlet, outlet}
    };
    //---------------------------------------------------------------------------------------------------------
    return new Intermatic(fsmd);
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo_watertower = function() {
    var fsm, recorder;
    fsm = new_watertower_fsm();
    recorder = new Recorder(fsm);
    // debug '^3334^', fsm.barrel.EXP_dstate
    // debug '^3334^', fsm.inlet.EXP_dstate
    // debug '^3334^', fsm.outlet.EXP_dstate
    // echo CND.inspect fsm.EXP_dstate
    help(fsm.EXP_dstate);
    info('fsm.start()');
    fsm.start();
    help(fsm.EXP_dstate);
    //---------------------------------------------------------------------------------------------------------
    return null;
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  new_regulator_fsm = function() {
    var fsmd;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'regulator',
      triggers: [['void', 'start', 'idle'], ['idle', 'stop', 'stopped'], ['idle', 'tick', 'idle'], ['growing', 'tick', 'growing'], ['declare', 'tick', 'declare'], ['idle', 'set', 'idle'], ['idle', 'inc', 'growing'], ['growing', 'inc', 'growing'], ['growing', 'set', 'idle'], ['idle', 'dec', 'shrinking'], ['shrinking', 'dec', 'shrinking'], ['*', 'chill', 'idle']],
      //.......................................................................................................
      data: {
        tps: 5, // ticks per second
        target: 0,
        value: 0
      },
      //.......................................................................................................
      after: {
        // #.....................................................................................................
        // tick: ( d ) -> whisper '^332^', "tick", d
        //.....................................................................................................
        inc: function(timer, handler) {
          this.data.value++;
          // urge '^44445^', @EXP_dstate
          if (this.data.value >= this.data.target) {
            clearInterval(timer);
            this.chill();
            return handler();
          }
        },
        //.....................................................................................................
        dec: function(timer, handler) {
          this.data.value--;
          // urge '^44445^', @EXP_dstate
          if (this.data.value <= this.data.target) {
            clearInterval(timer);
            this.chill();
            return handler();
          }
        },
        //.....................................................................................................
        set: function(target, handler) {
          var delta, timer;
          this.stop_all_timers();
          this.data.target = target;
          delta = Math.sign(target - this.data.value);
          warn('^22332^', this.move, this.EXP_dstate);
          //...................................................................................................
          if (this.data.value === target) {
            return handler();
          }
          if (this.data.value < target) {
            timer = every(1 / this.data.tps, () => {
              return this.inc(timer, handler);
            });
          } else {
            timer = every(1 / this.data.tps, () => {
              return this.dec(timer, handler);
            });
          }
          //...................................................................................................
          this.timers.push(timer);
          return null;
        }
      },
      //.......................................................................................................
      stop_all_timers: function() {
        var i, len, ref, timer;
        ref = this.timers;
        for (i = 0, len = ref.length; i < len; i++) {
          timer = ref[i];
          clearInterval(timer);
        }
        return null;
      },
      timers: []
    };
    //---------------------------------------------------------------------------------------------------------
    return new Intermatic(fsmd);
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_regulator = function() {
    var fsm, prv_value;
    fsm = new_regulator_fsm();
    // recorder  = new Recorder fsm
    prv_value = null;
    every(0.25, function() {
      if (fsm.data.value === prv_value) {
        return;
      }
      prv_value = fsm.data.value;
      return help(fsm.EXP_dstate);
    });
    fsm.start();
    fsm.scoobydoo = function(verb, ...P) {
      var p;
      p = (require('util')).promisify;
      return (p(this[verb]))(...P);
    };
    // await ( p fsm.set ) 10
    fsm.scoobydoo('set', 10);
    after(1, function() {
      return fsm.scoobydoo('set', 3);
    });
    after(5, function() {
      return fsm.scoobydoo('set', 8);
    });
    // ( p fsm.set ) 10
    info(fsm.EXP_dstate);
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await demo_watertower()
      return (await demo_regulator());
    })();
  }

}).call(this);

//# sourceMappingURL=demo-watertower.js.map