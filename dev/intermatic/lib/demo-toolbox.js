(function() {
  'use strict';
  var CND, Intermatic, PATH, Recorder, badge, debug, declare, demo, demo_2, echo, freeze, help, info, isa, lets, log, new_button_fsmd, new_color_fsmd, new_lamp_fsmd, new_register, new_text_fsmd, new_toolbox_fsm, pluck, rpr, test, type_of, types, urge, validate, warn, whisper;

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

  Intermatic = require('../../../apps/intermatic');

  Recorder = require('./recorder');

  //===========================================================================================================
  // TYPES
  //-----------------------------------------------------------------------------------------------------------
  declare('toolbox_button_cfg', {
    tests: {
      "x is an object": function(x) {
        return this.isa.object(x);
      }
    }
  });

  //===========================================================================================================
  // HELPERS
  //-----------------------------------------------------------------------------------------------------------
  new_register = function() {
    var register, result;
    result = [];
    register = function(...P) {
      var x;
      x = P.length === 1 ? P[0] : P;
      whisper('^2321^', rpr(x));
      return result.push(x);
    };
    return {result, register};
  };

  //-----------------------------------------------------------------------------------------------------------
  pluck = function(d, name) {
    var R;
    R = d[name];
    delete d[name];
    return R;
  };

  //===========================================================================================================
  // FACTORIES
  //-----------------------------------------------------------------------------------------------------------
  new_button_fsmd = function(cfg) {
    var R, defaults;
    // validate.toolbox_button_cfg cfg
    //.........................................................................................................
    if (cfg == null) {
      cfg = {};
    }
    defaults = {
      triggers: [['void', 'start', 'released'], ['*', 'stop', 'void'], ['released', 'press', 'pressed'], ['pressed', 'release', 'released']],
      cyclers: {
        toggle: ['released', 'pressed']
      }
    };
    //.........................................................................................................
    R = {...defaults, ...cfg};
    if (cfg.triggers != null) {
      R.triggers = [...cfg.triggers, ...R.triggers];
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  new_color_fsmd = function(cfg) {
    var R, colors, defaults;
    // validate.toolbox_button_cfg cfg
    //.........................................................................................................
    if (cfg == null) {
      cfg = {};
    }
    defaults = {
      triggers: [['void', 'start', null], ['*', 'stop', 'void']]
    };
    //.........................................................................................................
    R = {...defaults, ...cfg};
    colors = pluck(R, 'colors');
    R.triggers[0][2] = colors[0];
    (R.cyclers != null ? R.cyclers : R.cyclers = {}).toggle = colors;
    if (cfg.triggers != null) {
      R.triggers = [...cfg.triggers, ...R.triggers];
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  new_text_fsmd = function(cfg) {
    var R, defaults, texts;
    // validate.toolbox_button_cfg cfg
    //.........................................................................................................
    if (cfg == null) {
      cfg = {};
    }
    defaults = {
      triggers: [['void', 'start', null], ['*', 'stop', 'void']]
    };
    //.........................................................................................................
    R = {...defaults, ...cfg};
    texts = pluck(R, 'texts');
    R.triggers[0][2] = texts[0];
    (R.cyclers != null ? R.cyclers : R.cyclers = {}).toggle = texts;
    if (cfg.triggers != null) {
      R.triggers = [...cfg.triggers, ...R.triggers];
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  new_lamp_fsmd = function(cfg) {
    var R, defaults;
    // validate.toolbox_button_cfg cfg
    //.........................................................................................................
    if (cfg == null) {
      cfg = {};
    }
    defaults = {
      triggers: [['void', 'start', 'dark'], ['*', 'stop', 'void'], ['dark', 'turn_on', 'lit'], ['lit', 'turn_off', 'dark']],
      cyclers: {
        toggle: ['dark', 'lit']
      }
    };
    R = {...defaults, ...cfg};
    if (cfg.triggers != null) {
      R.triggers = [...cfg.triggers, ...R.triggers];
    }
    return R;
  };

  //-----------------------------------------------------------------------------------------------------------
  new_toolbox_fsm = function() {
    var fsmd, main_btn, meta_btn, register, result;
    ({result, register} = new_register());
    //---------------------------------------------------------------------------------------------------------
    main_btn = new_button_fsmd({
      goto: '*',
      enter: {
        pressed: function(s) {
          return echo(`${this.up.name}.${this.name}:${this.lstate}`, CND.yellow('🔒'));
        },
        // @up.meta_btn.lamp.tryto.turn_on()
        released: function(s) {
          return echo(`${this.up.name}.${this.name}:${this.lstate}`, CND.yellow('🔓💡🔅🔆❌⏻⏼⏽✓✅⤴⤵⏺'));
        }
      }
    });
    // @up.meta_btn.lamp.tryto.turn_off()
    // before:
    //   change: ( s ) -> register '<fsm.main_btn.before.change', s
    // after:
    //   change: ( s ) -> register '>fsm.main_btn.after.change', s

    //---------------------------------------------------------------------------------------------------------
    meta_btn = new_button_fsmd({
      goto: '*',
      enter: {
        pressed: function(s) {
          register('<fsm.meta_btn.enter.pressed', s);
          // debug '^333443^', @color.can.toggle(), @text.can.toggle()
          this.color.tryto.toggle();
          return this.text.tryto.toggle();
        }
      },
      // before:
      //   change: ( s ) ->
      //     echo "#{@up.name}.#{@name}:#{@lstate}", CND.white CND.reverse "[#{@lstate}]"
      //     register '<fsm.meta_btn.before.change', s
      //   start: ( s ) ->
      //     register '<fsm.meta_btn.before.start', s
      //     @fsms.forEach ( sub_fsm ) -> sub_fsm.start()
      //   stop: ( s ) ->
      //     register '<fsm.meta_btn.before.stop', s
      //     @fsms.forEach ( sub_fsm ) -> sub_fsm.stop()
      // after:
      //   change: ( s ) -> register '>fsm.meta_btn.after.change', s
      //   start:  ( s ) -> register '>fsm.meta_btn.after.start', s
      //   stop:   ( s ) -> register '>fsm.meta_btn.after.stop', s
      click: function() {
        this.press();
        return this.release();
      },
      //.......................................................................................................
      fsms: {
        //.....................................................................................................
        color: new_color_fsmd({
          goto: '*',
          colors: ['red', 'green']
        }),
        // before:
        //   change: ( s ) ->
        //     register '<fsm.meta_btn.color.before.change', s
        //     echo "#{@up.name}.#{@name}:#{@lstate}", ( CND[ @lstate ] ? CND.grey )  '██'
        // after:
        //   change: ( s ) -> register '>fsm.meta_btn.color.after.change', s
        //.....................................................................................................
        text: new_text_fsmd({
          goto: '*',
          texts: ['wait', 'go']
        }),
        // before:
        //   change: ( s ) ->
        //     register '<fsm.meta_btn.text.before.change', s
        //     echo "#{@up.name}.#{@name}:#{@lstate}", CND.white CND.reverse "[#{@lstate}]"
        // after:
        //   change: ( s ) -> register '>fsm.meta_btn.text.after.change', s
        //.....................................................................................................
        lamp: new_lamp_fsmd({
          goto: '*'
        })
      }
    });
    // enter:
    //   lit:    ( s ) -> echo "#{@up.name}.#{@name}:#{@lstate}", CND.yellow  '██'
    //   dark:   ( s ) -> echo "#{@up.name}.#{@name}:#{@lstate}", CND.grey    '██'
    // before:
    //   change: ( s ) -> register '<fsm.meta_btn.lamp.before.change', s
    // after:
    //   change: ( s ) -> register '>fsm.meta_btn.lamp.after.change', s

    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'toolbox',
      triggers: [['void', 'start', 'running'], ['running', 'stop', 'stopped']],
      before: {
        start: function(s) {
          // register '<fsm.before.start', s
          return this.fsms.forEach(function(sub_fsm) {
            return sub_fsm.start();
          });
        },
        stop: function(s) {
          // register '<fsm.before.stop', s
          return this.fsms.forEach(function(sub_fsm) {
            return sub_fsm.stop();
          });
        }
      },
      after: {
        start: function(s) {},
        // register '>fsm.after.start', s
        stop: function(s) {}
      },
      // register '>fsm.after.stop', s
      fsms: {meta_btn, main_btn}
    };
    //---------------------------------------------------------------------------------------------------------
    return new Intermatic(fsmd);
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo = function() {
    var fsm, n, recorder;
    fsm = new_toolbox_fsm();
    recorder = new Recorder(fsm);
    // echo '^33376^', ( require 'util' ).inspect fsm
    urge('^3334^', `FSM ${rpr(fsm.meta_btn.name)} has sub-FSMs ${((function() {
      var i, len, ref, results;
      ref = fsm.meta_btn.fsm_names;
      results = [];
      for (i = 0, len = ref.length; i < len; i++) {
        n = ref[i];
        results.push(rpr(n));
      }
      return results;
    })()).join(', ')}`);
    info('fsm.start()');
    fsm.start();
    info('fsm.main_btn.goto.released()');
    fsm.main_btn.goto.released();
    // info 'fsm.meta_btn.press()    ------'; fsm.meta_btn.press()
    // info 'fsm.meta_btn.release()  ------'; fsm.meta_btn.release()
    // info 'fsm.meta_btn.click()    ------'; fsm.meta_btn.click()
    // info 'fsm.meta_btn.click()    ------'; fsm.meta_btn.click()
    // # fsm.meta_btn.goto.void()
    // info 'fsm.main_btn.press()    ------'; fsm.main_btn.press()
    // info 'fsm.main_btn.release()  ------'; fsm.main_btn.release()
    // info 'fsm.stop()              ------'; fsm.stop()
    // info '^33378^', fsm.fsm_names
    // info '^33378^', fsm.meta_btn.fsm_names
    // fsm.fsms.forEach ( sub_fsm ) -> debug '^2327^', sub_fsm
    //---------------------------------------------------------------------------------------------------------
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  demo_2 = function() {
    var fsm, fsmd, recorder;
    fsmd = {
      name: 'simple',
      triggers: [['void', 'start', 'first']],
      cyclers: {
        step: ['first', 'second', 'third']
      },
      before: {
        any: function(s) {
          return urge(`█ ${this.path}:${s.via}`);
        },
        start: function(s) {
          return this.lamp.start();
        }
      },
      after: {
        any: function(s) {
          return whisper(this.cstate);
        }
      },
      enter: {
        second: function(s) {
          return this.lamp.toggle();
        }
      },
      fsms: {
        //.....................................................................................................
        lamp: {
          triggers: [['void', 'start', 'on']],
          cyclers: {
            toggle: ['on', 'off']
          },
          enter: {
            on: function(s) {
              return this.counter.tick();
            }
          },
          /* TAINT totally contrived */before: {
            start: function(s) {
              return this.counter.start();
            },
            any: function(s) {
              return urge(`${this.path}:${s.via}`);
            }
          },
          //...................................................................................................
          fsms: {
            counter: {
              _XXX_count: 0,
              triggers: [['void', 'start', 'active']],
              cyclers: {
                tick: ['active']
              },
              stay: {
                active: function(s) {
                  debug(this);
                  return this._XXX_count++;
                }
              }
            }
          }
        }
      }
    };
    //.........................................................................................................
    fsm = new Intermatic(fsmd);
    recorder = new Recorder(fsm);
    fsm.start();
    fsm.step();
    fsm.step();
    fsm.step();
    fsm.step();
    fsm.step();
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      await demo();
      return (await demo_2());
    })();
  }

}).call(this);

//# sourceMappingURL=demo-toolbox.js.map