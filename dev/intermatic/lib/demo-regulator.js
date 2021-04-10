(function() {
  'use strict';
  var CND, Intermatic, PATH, Recorder, after, badge, debug, declare, demo_regulator, echo, equals, every, freeze, help, info, isa, lets, log, new_regulator_fsm, rpr, sleep, test, type_of, types, urge, validate, warn, whisper;

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

  ({Intermatic} = require('../../../apps/intermatic'));

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

  //-----------------------------------------------------------------------------------------------------------
  new_regulator_fsm = function() {
    var fsmd;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'regulator',
      moves: {
        start: 'idle',
        chill: 'idle',
        stop: {
          idle: 'stopped'
        },
        tick: {
          idle: 'idle',
          growing: 'growing',
          declare: 'declare'
        },
        set: {
          idle: 'idle',
          growing: 'idle'
        },
        inc: {
          idle: 'growing',
          growing: 'growing'
        },
        inc: {
          idle: 'shrinking',
          shrinking: 'shrinking'
        }
      },
      //.......................................................................................................
      data: {
        tps: 5, // ticks per second
        delta: 10,
        target: 0,
        value: 0
      },
      //.......................................................................................................
      after: {
        // #.....................................................................................................
        // tick: ( d ) -> whisper '^332^', "tick", d
        //.....................................................................................................
        inc: function(timer, handler) {
          this.data.value += this.data.delta;
          // urge '^44445^', @EXP_dstate
          if (this.data.value >= this.data.target) {
            clearInterval(timer);
            this.chill();
            return handler();
          }
        },
        //.....................................................................................................
        dec: function(timer, handler) {
          this.data.value -= this.data.delta;
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
          // warn '^22332^', @move, @EXP_dstate
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
    var BAR, fsm, new_spinner, prv_value, spinner;
    BAR = require('../../../apps/intertext/lib/bar');
    new_spinner = require('ora');
    // spinner     = new_spinner { spinner: 'boxBounce2', }
    // spinner     = new_spinner { spinner: 'noise', }
    /* https://www.skypack.dev/view/ora */    spinner = new_spinner({
      spinner: 'growVertical'
    });
    // spinner     = new_spinner { spinner: 'moon', }
    // spinner     = new_spinner { spinner: 'bouncingBall', }
    // spinner     = new_spinner { spinner: 'material', }
    spinner.start();
    // after 1, ->
    //   spinner.color = 'yellow'
    //   # spinner.text  = 'Loading rainbows'
    fsm = new_regulator_fsm();
    // recorder  = new Recorder fsm
    prv_value = null;
    every(0.21, function() {
      var bar;
      if (fsm.data.value === prv_value) {
        return;
      }
      // spinner.succeed()
      prv_value = fsm.data.value;
      bar = BAR.percentage_bar(fsm.data.value);
      return help(bar, fsm.EXP_dstate);
    });
    fsm.start();
    fsm.scoobydoo = function(verb, ...P) {
      var p;
      p = (require('util')).promisify;
      return (p(this[verb]))(...P);
    };
    // await ( p fsm.set ) 10
    fsm.scoobydoo('set', 100);
    after(2, function() {
      return fsm.scoobydoo('set', 30);
    });
    after(5, function() {
      return fsm.scoobydoo('set', 80);
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

//# sourceMappingURL=demo-regulator.js.map