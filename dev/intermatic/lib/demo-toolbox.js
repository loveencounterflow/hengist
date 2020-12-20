(function() {
  'use strict';
  var CND, Intermatic, PATH, Recorder, badge, debug, declare, demo_1, demo_2, demo_3, echo, freeze, help, info, isa, lets, log, new_button_fsmd, new_color_fsmd, new_lamp_fsmd, new_register, new_text_fsmd, new_toolbox_fsm, pluck, rpr, test, type_of, types, urge, validate, warn, whisper;

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
        pressed: function(...P) {
          return echo(`${this.up.name}.${this.name}:${this.lstate}`, CND.yellow('🔒'));
        },
        // @up.meta_btn.lamp.tryto.turn_on()
        released: function(...P) {
          return echo(`${this.up.name}.${this.name}:${this.lstate}`, CND.yellow('🔓💡🔅🔆❌⏻⏼⏽✓✅⤴⤵⏺'));
        }
      }
    });
    //---------------------------------------------------------------------------------------------------------
    meta_btn = new_button_fsmd({
      goto: '*',
      enter: {
        pressed: function(...P) {
          register('<fsm.meta_btn.enter.pressed');
          this.color.tryto.toggle();
          return this.text.tryto.toggle();
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
          goto: '*',
          colors: ['red', 'green']
        }),
        //.....................................................................................................
        text: new_text_fsmd({
          goto: '*',
          texts: ['wait', 'go']
        }),
        //.....................................................................................................
        lamp: new_lamp_fsmd({
          goto: '*'
        })
      }
    });
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'toolbox',
      triggers: [['void', 'start', 'running'], ['running', 'stop', 'stopped']],
      before: {
        start: function(...P) {
          return this.fsms.forEach(function(sub_fsm) {
            return sub_fsm.start();
          });
        },
        stop: function(...P) {
          return this.fsms.forEach(function(sub_fsm) {
            return sub_fsm.stop();
          });
        }
      },
      // after:
      //   start: ( P... ) ->
      //   stop: ( P... ) ->
      fsms: {meta_btn, main_btn}
    };
    //---------------------------------------------------------------------------------------------------------
    return new Intermatic(fsmd);
  };

  //===========================================================================================================

  //-----------------------------------------------------------------------------------------------------------
  demo_1 = function() {
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
        any: function(...P) {
          return urge(`█ ${this.path}:${this.verb}`);
        },
        start: function(...P) {
          return this.lamp.start();
        }
      },
      after: {
        any: function(...P) {
          return whisper(this.cstate);
        }
      },
      enter: {
        second: function(...P) {
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
            on: function(...P) {
              return this.counter.tick();
            }
          },
          /* TAINT totally contrived */before: {
            start: function(...P) {
              return this.counter.start();
            },
            any: function(...P) {
              return urge(`${this.path}:${this.verb}`);
            }
          },
          //...................................................................................................
          fsms: {
            counter: {
              data: {
                _XXX_count: 0
              },
              triggers: [['void', 'start', 'active']],
              cyclers: {
                tick: ['active']
              },
              stay: {
                active: function(...P) {
                  // debug '^33387^', @
                  return this.data._XXX_count++;
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

  //-----------------------------------------------------------------------------------------------------------
  demo_3 = function() {
    var fsmd;
    //---------------------------------------------------------------------------------------------------------
    return fsmd = {
      //=======================================================================================================
      // ACTUATABLE BUTTONS
      //-------------------------------------------------------------------------------------------------------
      grabmode_btn: {
        init: 'markscroll',
        transitions: [
          {
            name: 'toggle',
            from: 'panzoom',
            to: 'markscroll'
          },
          {
            name: 'toggle',
            from: 'markscroll',
            to: 'panzoom'
          }
        ],
        methods: {
          onEnterMarkscroll: function() {
            var ref;
            if ((ref = mkts._panzoom_instance) != null) {
              if (typeof ref.pause === "function") {
                ref.pause();
              }
            }
            return this.scrldir_lamp.goto('lit');
          },
          onEnterPanzoom: function() {
            var ref;
            if ((ref = mkts._panzoom_instance) != null) {
              if (typeof ref.resume === "function") {
                ref.resume();
              }
            }
            return this.scrldir_lamp.goto('dark');
          }
        }
      },
      //.......................................................................................................
      grabmode_lamp: {
        init: 'lit'
      },
      //-------------------------------------------------------------------------------------------------------
      scrldir_btn: {
        init: 'vert',
        transitions: [
          {
            name: 'toggle',
            from: 'vert',
            to: 'horz'
          },
          {
            name: 'toggle',
            from: 'horz',
            to: 'vert'
          }
        ],
        methods: {
          onEnterVert: function() {
            log('^334-5^', 'scrldir_btn: onEnterVert');
            return this.grabmode_btn.goto('markscroll');
          },
          onEnterHorz: function() {
            log('^334-6^', 'scrldir_btn: onEnterHorz');
            return this.grabmode_btn.goto('markscroll');
          }
        }
      },
      //.......................................................................................................
      scrldir_lamp: {
        init: 'lit',
        transitions: [
          {
            name: 'toggle',
            from: 'lit',
            to: 'dark'
          },
          {
            name: 'toggle',
            from: 'dark',
            to: 'lit'
          }
        ],
        methods: {
          onEnterLit: function() {
            return log('^334-8^', 'scrldir_lamp: onEnterLit');
          },
          onEnterDark: function() {
            return log('^334-9^', 'scrldir_lamp: onEnterDark');
          }
        }
      },
      //=======================================================================================================
      // PASSIVE BUTTONS (i.e. lamps only); observe their descriptions could be much simpler
      //-------------------------------------------------------------------------------------------------------
      shift_btn: {
        init: 'released',
        transitions: [
          {
            name: 'toggle',
            from: 'released',
            to: 'pressed'
          },
          {
            name: 'toggle',
            from: 'pressed',
            to: 'released'
          }
        ],
        methods: {
          onEnterReleased: function() {
            return this.shift_lamp.goto('dark');
          },
          onEnterPressed: function() {
            return this.shift_lamp.goto('lit');
          }
        }
      },
      //.......................................................................................................
      shift_lamp: {
        init: 'dark',
        transitions: [
          {
            name: 'toggle',
            from: 'lit',
            to: 'dark'
          },
          {
            name: 'toggle',
            from: 'dark',
            to: 'lit'
          }
        ]
      },
      //-------------------------------------------------------------------------------------------------------
      capslock_btn: {
        init: 'released',
        transitions: [
          {
            name: 'toggle',
            from: 'released',
            to: 'pressed'
          },
          {
            name: 'toggle',
            from: 'pressed',
            to: 'released'
          }
        ],
        methods: {
          onEnterReleased: function() {
            return this.capslock_lamp.goto('dark');
          },
          onEnterPressed: function() {
            return this.capslock_lamp.goto('lit');
          }
        }
      },
      //.......................................................................................................
      capslock_lamp: {
        init: 'dark',
        transitions: [
          {
            name: 'toggle',
            from: 'lit',
            to: 'dark'
          },
          {
            name: 'toggle',
            from: 'dark',
            to: 'lit'
          }
        ]
      },
      //-------------------------------------------------------------------------------------------------------
      alt_btn: {
        init: 'released',
        transitions: [
          {
            name: 'toggle',
            from: 'released',
            to: 'pressed'
          },
          {
            name: 'toggle',
            from: 'pressed',
            to: 'released'
          }
        ],
        methods: {
          onEnterReleased: function() {
            return this.alt_lamp.goto('dark');
          },
          onEnterPressed: function() {
            return this.alt_lamp.goto('lit');
          }
        }
      },
      //.......................................................................................................
      alt_lamp: {
        init: 'dark',
        transitions: [
          {
            name: 'toggle',
            from: 'lit',
            to: 'dark'
          },
          {
            name: 'toggle',
            from: 'dark',
            to: 'lit'
          }
        ]
      },
      //-------------------------------------------------------------------------------------------------------
      altgraph_btn: {
        init: 'released',
        transitions: [
          {
            name: 'toggle',
            from: 'released',
            to: 'pressed'
          },
          {
            name: 'toggle',
            from: 'pressed',
            to: 'released'
          }
        ],
        methods: {
          onEnterReleased: function() {
            return this.altgraph_lamp.goto('dark');
          },
          onEnterPressed: function() {
            _XXX_TMP_toolbox_colors.altgraph_btn = 'red';
            return this.altgraph_lamp.goto('lit');
          }
        }
      },
      /* !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! */
      //.......................................................................................................
      altgraph_lamp: {
        init: 'dark',
        transitions: [
          {
            name: 'toggle',
            from: 'lit',
            to: 'dark'
          },
          {
            name: 'toggle',
            from: 'dark',
            to: 'lit'
          }
        ]
      },
      //-------------------------------------------------------------------------------------------------------
      control_btn: {
        init: 'released',
        transitions: [
          {
            name: 'toggle',
            from: 'released',
            to: 'pressed'
          },
          {
            name: 'toggle',
            from: 'pressed',
            to: 'released'
          }
        ],
        methods: {
          onEnterReleased: function() {
            return this.control_lamp.goto('dark');
          },
          onEnterPressed: function() {
            return this.control_lamp.goto('lit');
          }
        }
      },
      //.......................................................................................................
      control_lamp: {
        init: 'dark',
        transitions: [
          {
            name: 'toggle',
            from: 'lit',
            to: 'dark'
          },
          {
            name: 'toggle',
            from: 'dark',
            to: 'lit'
          }
        ]
      },
      //-------------------------------------------------------------------------------------------------------
      meta_btn: {
        init: 'released',
        transitions: [
          {
            name: 'toggle',
            from: 'released',
            to: 'pressed'
          },
          {
            name: 'toggle',
            from: 'pressed',
            to: 'released'
          }
        ],
        methods: {
          onEnterReleased: function() {
            return this.meta_lamp.goto('dark');
          },
          onEnterPressed: function() {
            return this.meta_lamp.goto('lit');
          }
        }
      },
      //.......................................................................................................
      meta_lamp: {
        init: 'dark',
        transitions: [
          {
            name: 'toggle',
            from: 'lit',
            to: 'dark'
          },
          {
            name: 'toggle',
            from: 'dark',
            to: 'lit'
          }
        ]
      }
    };
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