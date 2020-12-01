(function() {
  'use strict';
  var CND, Intermatic, PATH, Recorder, badge, debug, declare, demo, echo, freeze, help, info, isa, lets, log, new_button_fsmd, new_color_fsmd, new_lamp_fsmd, new_register, new_text_fsmd, new_toolbox_fsm, pluck, rpr, test, type_of, types, urge, validate, warn, whisper;

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
      enter: {
        pressed: function(s) {
          echo(`${this.up.name}.${this.name}:${this.lstate}`, CND.yellow('🔒'));
          return this.up.meta_btn.lamp.tryto.turn_on();
        },
        released: function(s) {
          echo(`${this.up.name}.${this.name}:${this.lstate}`, CND.yellow('🔓💡🔅🔆❌⏻⏼⏽✓✅⤴⤵⏺'));
          return this.up.meta_btn.lamp.tryto.turn_off();
        }
      },
      before: {
        change: function(s) {
          return register('<fsm.main_btn.before.change', s);
        }
      },
      after: {
        change: function(s) {
          return register('>fsm.main_btn.after.change', s);
        }
      }
    });
    //---------------------------------------------------------------------------------------------------------
    meta_btn = new_button_fsmd({
      enter: {
        pressed: function(s) {
          register('<fsm.meta_btn.enter.pressed', s);
          debug('^333443^', this.color.can.toggle(), this.text.can.toggle());
          this.color.tryto.toggle();
          return this.text.tryto.toggle();
        }
      },
      before: {
        change: function(s) {
          echo(`${this.up.name}.${this.name}:${this.lstate}`, CND.white(CND.reverse(`[${this.lstate}]`)));
          return register('<fsm.meta_btn.before.change', s);
        },
        start: function(s) {
          register('<fsm.meta_btn.before.start', s);
          return this.fsms.forEach(function(sub_fsm) {
            return sub_fsm.start();
          });
        },
        stop: function(s) {
          register('<fsm.meta_btn.before.stop', s);
          return this.fsms.forEach(function(sub_fsm) {
            return sub_fsm.stop();
          });
        }
      },
      after: {
        change: function(s) {
          return register('>fsm.meta_btn.after.change', s);
        },
        start: function(s) {
          return register('>fsm.meta_btn.after.start', s);
        },
        stop: function(s) {
          return register('>fsm.meta_btn.after.stop', s);
        }
      },
      click: function() {
        this.press();
        return this.release();
      },
      //.......................................................................................................
      fsms: {
        //.....................................................................................................
        color: new_color_fsmd({
          colors: ['red', 'green'],
          before: {
            change: function(s) {
              var ref;
              register('<fsm.meta_btn.color.before.change', s);
              return echo(`${this.up.name}.${this.name}:${this.lstate}`, ((ref = CND[this.lstate]) != null ? ref : CND.grey)('██'));
            }
          },
          after: {
            change: function(s) {
              return register('>fsm.meta_btn.color.after.change', s);
            }
          },
          goto: '*'
        }),
        //.....................................................................................................
        text: new_text_fsmd({
          texts: ['wait', 'go'],
          before: {
            change: function(s) {
              register('<fsm.meta_btn.text.before.change', s);
              return echo(`${this.up.name}.${this.name}:${this.lstate}`, CND.white(CND.reverse(`[${this.lstate}]`)));
            }
          },
          after: {
            change: function(s) {
              return register('>fsm.meta_btn.text.after.change', s);
            }
          },
          goto: '*'
        }),
        //.....................................................................................................
        lamp: new_lamp_fsmd({
          enter: {
            lit: function(s) {
              return echo(`${this.up.name}.${this.name}:${this.lstate}`, CND.yellow('██'));
            },
            dark: function(s) {
              return echo(`${this.up.name}.${this.name}:${this.lstate}`, CND.grey('██'));
            }
          },
          before: {
            change: function(s) {
              return register('<fsm.meta_btn.lamp.before.change', s);
            }
          },
          after: {
            change: function(s) {
              return register('>fsm.meta_btn.lamp.after.change', s);
            }
          },
          goto: '*'
        })
      }
    });
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      triggers: [['void', 'start', 'running'], ['running', 'stop', 'stopped']],
      before: {
        start: function(s) {
          register('<fsm.before.start', s);
          return this.fsms.forEach(function(sub_fsm) {
            return sub_fsm.start();
          });
        },
        stop: function(s) {
          register('<fsm.before.stop', s);
          return this.fsms.forEach(function(sub_fsm) {
            return sub_fsm.stop();
          });
        }
      },
      after: {
        start: function(s) {
          return register('>fsm.after.start', s);
        },
        stop: function(s) {
          return register('>fsm.after.stop', s);
        }
      },
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
    info('fsm.start()             ------');
    fsm.start();
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

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      return (await demo());
    })();
  }

}).call(this);

//# sourceMappingURL=demo-toolbox.js.map