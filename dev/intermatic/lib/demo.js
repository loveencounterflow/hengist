(function() {
  'use strict';
  var CND, PATH, badge, debug, declare, echo, freeze, help, info, isa, lets, log, rpr, type_of, types, urge, validate, warn, whisper;

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
  // test                      = require 'guy-test'
  PATH = require('path');

  types = new (require('intertype')).Intertype();

  ({isa, validate, declare, type_of} = types.export());

  ({freeze, lets} = require('letsfreezethat'));

  /*
  Mutimix                   = require 'multimix'

  #===========================================================================================================
  class Fsm extends Multimix
    constructor: ( fsmd ) ->
   * validate.fsmd fsmd

  #===========================================================================================================
  class Compound_fsm extends Multimix
    constructor: ( fsmds ) ->
   * validate.fsmds fsmds
   */
  //-----------------------------------------------------------------------------------------------------------
  this.get_fsmd = function() {
    var fsmd;
    fsmd = {
      // eq:           ( a, b ) -> ...
      // freeze:       ( x ) -> ...
      name: 'grabmode',
      moves: {
        start: ['void', 'markscroll'],
        reset: ['any', 'void'],
        toggle: ['panzoom', 'markscroll'],
        toggle: ['markscroll', 'panzoom'],
        setPanzoom: ['markscroll', 'panzoom'],
        setPanzoom: ['panzoom', 'panzoom'],
        setMarkscroll: ['markscroll', 'markscroll'],
        setMarkscroll: ['panzoom', 'markscroll']
      },
      before: {
        trigger: function(s) {
          return info("before trigger     ", s);
        },
        change: function(s) {
          return info("before change      ", s);
        },
        state: function(s) {
          return info("before state       ", s);
        },
        start: function(s) {
          return info("before start       ", s);
        },
        stop: function(s) {
          return info("before stop        ", s);
        },
        toggle: function(s) {
          return info("before toggle      ", s);
        },
        setPanzoom: function(s) {
          return info("before setPanzoom  ", s);
        }
      },
      enter: {
        void: function(s) {
          return info("enter void         ", s);
        },
        panzoom: function(s) {
          return info("enter panzoom      ", s);
        },
        markscroll: function(s) {
          return info("enter markscroll   ", s);
        }
      },
      stay: {
        void: function(s) {
          return info("stay void          ", s);
        },
        panzoom: function(s) {
          return info("stay panzoom       ", s);
        },
        markscroll: function(s) {
          return info("stay markscroll    ", s);
        }
      },
      leave: {
        void: function(s) {
          return info("leave void         ", s);
        },
        panzoom: function(s) {
          return info("leave panzoom      ", s);
        },
        markscroll: function(s) {
          return info("leave markscroll   ", s);
        }
      },
      after: {
        trigger: function(s) {
          return info("after trigger      ", s);
        },
        change: function(s) {
          return info("after change       ", s);
        },
        state: function(s) {
          return info("after state        ", s);
        },
        start: function(s) {
          return info("after start        ", s);
        },
        stop: function(s) {
          return info("after stop         ", s);
        },
        toggle: function(s) {
          return info("after toggle       ", s);
        },
        setPanzoom: function(s) {
          return info("after setPanzoom   ", s);
        }
      },
      fail: function(s) {
        return warn("fail               ", s);
      }
    };
    //---------------------------------------------------------------------------------------------------------
    return fsmd;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_2 = function() {
    var Intermatic, fsm;
    //.........................................................................................................
    globalThis.debug = debug;
    globalThis.warn = warn;
    globalThis.info = info;
    globalThis.urge = urge;
    globalThis.help = help;
    globalThis.whisper = whisper;
    globalThis.echo = echo;
    globalThis.log = log;
    globalThis.rpr = rpr;
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(this.get_fsmd());
    // debug '^34766^', rpr @get_fsmd()
    debug('^34766^', "moves:", rpr(fsm.moves));
    urge('^347-1^', 'start --------------------------------------');
    urge('^347-2^', fsm.start());
    urge('^347-3^', 'toggle --------------------------------------');
    urge('^347-4^', fsm.toggle());
    urge('^347-5^', 'setMarkscroll --------------------------------------');
    urge('^347-6^', fsm.setMarkscroll());
    urge('^347-7^', 'setMarkscroll --------------------------------------');
    urge('^347-8^', fsm.setMarkscroll());
    urge('^347-9^', 'reset --------------------------------------');
    urge('^347-10^', fsm.reset());
    urge('^347-11^', 'reset --------------------------------------');
    urge('^347-12^', fsm.reset());
    urge('^347-13^', 'toggle --------------------------------------');
    urge('^347-14^', fsm.toggle());
    urge('^347-13^', 'start --------------------------------------');
    urge('^347-14^', fsm.start());
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.toolbox_demo = function() {
    var Intermatic, fsmd, fsmds, metalamp_fsm;
    /*
    toolbox_html   =
      grabmode_btn:
        markscroll:   'mark<br>scroll'
        panzoom:      'pan<br>zoom'
      scrldir_btn:
        vert:         'vert<br>scroll'
        horz:         'horz<br>scroll'
      shift_btn:
        released:     'shift'
        pressed:      'shift'
      capslock_btn:
        released:     'caps<br>lock'
        pressed:      'caps<br>lock'
      alt_btn:
        released:     'alt'
        pressed:      'alt'
      altgraph_btn:
        released:     'altgr'
        pressed:      'altgr'
      control_btn:
        released:     'ctrl'
        pressed:      'ctrl'
      meta_btn:
        released:     'meta'
        pressed:      'meta'
     * Compose
     * ContextMenu
    _XXX_TMP_toolbox_colors =
      altgraph_btn:   'turquoise'
     */
    //---------------------------------------------------------------------------------------------------------
    fsmds = {
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
        moves: {
          start: ['void', 'lit'],
          reset: ['any', 'void'],
          toggle: ['lit', 'dark', 'lit']
        },
        after: {
          trigger: function(s) {
            return whisper(s);
          },
          change: function(s) {
            return info(`after change: ${rpr(s)}`);
          }
        },
        fail: function(s) {
          return whisper(s);
        },
        goto: 'any'
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({Intermatic} = require('../../../apps/intermatic'));
    fsmd = {...fsmds.meta_lamp};
    /* TAINT should not be necessary */
    fsmd.name = 'meta_lamp';
    metalamp_fsm = new Intermatic(fsmd);
    urge('^445-1^', "start");
    metalamp_fsm.start();
    urge('^445-1^', "toggle");
    metalamp_fsm.toggle();
    urge('^445-1^', "reset");
    metalamp_fsm.reset();
    urge('^445-1^', "toggle");
    metalamp_fsm.toggle();
    urge('^445-1^', "goto 'lit'");
    metalamp_fsm.goto('lit');
    urge('^445-1^', "goto 'lit'");
    metalamp_fsm.goto('lit');
    urge('^445-1^', "goto 'dark'");
    metalamp_fsm.goto('dark');
    urge('^445-1^', "goto 'void'");
    metalamp_fsm.goto('void');
    urge('^445-1^', "start");
    metalamp_fsm.start();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.compound_fsm_demo = function() {
    var Intermatic, cfsmd, fsm, register, result;
    result = [];
    register = function(x) {
      whisper('^2321^', rpr(x));
      return result.push(x);
    };
    //---------------------------------------------------------------------------------------------------------
    cfsmd = {
      //.......................................................................................................
      meta_btn: {
        moves: {
          start: ['void', 'released'],
          reset: ['any', 'void'],
          press: ['released', 'pressed'],
          release: ['pressed', 'released'],
          _report_broken_lamp: ['any', 'lamp_broken'],
          break_lamp: ['any', 'lamp_broken']
        },
        enter: {
          'pressed': function(s) {
            register(`enter pressed: ${rpr(s)}`);
            return this.my.lamp.light();
          },
          'released': function(s) {
            register(`enter released: ${rpr(s)}`);
            return this.my.lamp.goto('dark');
          }
        },
        after: {
          '_report_broken_lamp': function(s) {
            return register(`after _report_broken_lamp: ${rpr(s)}`);
          },
          'break_lamp': function(s) {
            register(`after break_lamp: ${rpr(s)}`);
            return this.my.lamp.break();
          }
        },
        goto: 'any',
        //.....................................................................................................
        my: {
          lamp: {
            moves: {
              start: ['void', 'lit'],
              toggle: ['lit', 'dark'],
              toggle: ['dark', 'lit'],
              break: ['any', 'broken']
            },
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
              },
              broken: function(s) {
                register("lamp broken, switching off");
                return this.we._report_broken_lamp();
              }
            },
            goto: 'any'
          }
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
    ({Intermatic} = require('../../../apps/intermatic'));
    return fsm = new Intermatic(cfsmd);
  };

  // debug '^33478^', fsm
  // debug '^33478^', ( k for k of fsm )
  // T.eq ( Object.keys fsm ),
  // fsm.start()
  //---------------------------------------------------------------------------------------------------------
  // done()

  //-----------------------------------------------------------------------------------------------------------
  this.basics_demo = function() {
    var Intermatic, count, cstate_ansi, fsm, fsmd;
    //---------------------------------------------------------------------------------------------------------
    cstate_ansi = function() {
      var parts;
      parts = [];
      parts.push(this.stage);
      parts.push(this.verb);
      parts.push((this.dpar === this.lstate) ? CND.reverse(this.dpar) : this.dpar);
      parts.push('▶');
      parts.push((this.dest === this.lstate) ? CND.reverse(this.dest) : this.dest);
      if (this.failed) {
        parts.push(CND.reverse("failed A"));
      }
      if (this.dest === null) {
        parts.push(CND.reverse("failed B"));
      }
      if (!this.changed) {
        parts.push("(unchanged)");
      }
      return parts.join(' ');
    };
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'meta_lamp',
      moves: {
        start: ['void', 'lit'],
        reset: ['any', 'void'],
        toggle: ['lit', 'dark', 'lit'],
        brighten: ['lit', 'lit']
      },
      // noop:   'any'
      before: {
        any: function(d) {
          return info(`#${d.count}`, this.cstate_ansi());
        },
        change: function(d) {
          return info(`#${d.count}`, this.cstate_ansi());
        }
      },
      after: {
        any: function(d) {
          return help(`#${d.count}`, this.cstate_ansi());
        },
        change: function(d) {
          return help(`#${d.count}`, this.cstate_ansi());
        }
      },
      entering: {
        dark: function(d) {
          return urge(`#${d.count}`, this.cstate_ansi());
        }
      },
      leaving: {
        lit: function(d) {
          return urge(`#${d.count}`, this.cstate_ansi());
        }
      },
      fail: function(d) {
        return warn(`#${d.count}`, this.cstate_ansi());
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({Intermatic} = require('../../../apps/intermatic'));
    count = 0;
    fsm = new Intermatic(fsmd);
    fsm.cstate_ansi = cstate_ansi;
    info('^44455^', fsm.moves);
    fsm.start({
      count: ++count
    });
    fsm.brighten({
      count: ++count
    });
    fsm.toggle({
      count: ++count
    });
    // fsm.noop      { count: ++count, }
    fsm.brighten({
      count: ++count
    });
    fsm.reset({
      count: ++count
    });
    fsm.toggle({
      count: ++count
    });
    // fsm.goto 'lit'
    // fsm.goto 'lit'
    // fsm.goto 'dark'
    //---------------------------------------------------------------------------------------------------------
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.icql_dba = function() {
    var Intermatic, fsm, fsmd;
    //---------------------------------------------------------------------------------------------------------
    fsmd = {
      name: 'dbinstance',
      moves: {
        start: 'empty',
        open: ['empty', 'opening']
      }
    };
    //---------------------------------------------------------------------------------------------------------
    ({Intermatic} = require('../../../apps/intermatic'));
    fsm = new Intermatic(fsmd);
    info(fsm.move);
    fsm.start();
    info(fsm.move);
    fsm.open();
    info(fsm.move);
    //---------------------------------------------------------------------------------------------------------
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (async() => {
      // await @demo_2()
      // await @toolbox_demo()
      // await @compound_fsm_demo()
      // await @basics_demo()
      return (await this.icql_dba());
    })();
  }

}).call(this);

//# sourceMappingURL=demo.js.map