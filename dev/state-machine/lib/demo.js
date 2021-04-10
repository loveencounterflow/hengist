(function() {
  'use strict';
  var CND, PATH, badge, debug, declare, echo, freeze, get_fsm_descriptions, help, info, isa, lets, log, rpr, test, type_of, types, urge, validate, warn, whisper,
    boundMethodCheck = function(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new Error('Bound instance method accessed before binding'); } };

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/STATE-ENGINE';

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
  this.demo_1 = function() {
    var ui_fsm;
    ui_fsm = new Ui_scrollmode();
    info('^445-1^', ui_fsm.get_state());
    info('^445-2^', ui_fsm.mousemode.setPanzoom());
    info('^445-3^', ui_fsm.mousemode.setPanzoom());
    info('^445-4^', ui_fsm.get_state());
    info('^445-5^', ui_fsm.mousemode.toggle());
    info('^445-6^', ui_fsm.get_state());
    info('^445-7^', ui_fsm.mousemode.toggle());
    info('^445-8^', ui_fsm.get_state());
    info('^445-9^', ui_fsm.scrl_dir.setHorz());
    info('^445-11^', ui_fsm.get_state());
    info('^445-12^', ui_fsm.scrl_dir.toggle());
    info('^445-13^', ui_fsm.get_state());
    info('^445-14^', ui_fsm.scrl_dir.toggle());
    info('^445-15^', ui_fsm.get_state());
    info('^445-14^', ui_fsm.scrl_dir.toggle());
    info('^445-15^', ui_fsm.get_state());
    //.........................................................................................................
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  get_fsm_descriptions = function() {
    var fsm_descriptions;
    //---------------------------------------------------------------------------------------------------------
    fsm_descriptions = {
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
          onAfterTransition: function() {
            return log('^334-1^', 'grabmode_btn:', this.get_state());
          },
          onEnterPanzoom: function() {
            log('^334-2^', 'grabmode_btn: onEnterPanzoom');
            return this.scrldir_lamp.goto('dark');
          },
          onEnterMarkscroll: function() {
            log('^334-3^', 'grabmode_btn: onEnterMarkscroll');
            return this.scrldir_lamp.goto('lit');
          }
        }
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
          onAfterTransition: function() {
            return log('^334-4^', 'scrldir_btn:', this.get_state());
          },
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
      //-------------------------------------------------------------------------------------------------------
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
          onAfterTransition: function() {
            return log('^334-7^', 'scrldir_lamp:', this.get_state());
          },
          onEnterLit: function() {
            return log('^334-8^', 'scrldir_lamp: onEnterLit');
          },
          onEnterDark: function() {
            return log('^334-9^', 'scrldir_lamp: onEnterDark');
          }
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    return fsm_descriptions;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_2 = function() {
    //.........................................................................................................
    global.StateMachine = require('javascript-state-machine');
    require('../../../apps/mkts-gui-toolbox-fsm');
    (()/* NOTE exports to global namespace FTTB */ => {
      var My_toolbox, fsm, show_abilities;
      //-------------------------------------------------------------------------------------------------------
      My_toolbox = class My_toolbox extends Mkts_toolbox_fsm {
        constructor() {
          super(...arguments);
          this.on_after_transition = this.on_after_transition.bind(this);
        }

        on_after_transition(lifecycle) {
          boundMethodCheck(this, My_toolbox);
          delete lifecycle.fsm;
          return debug('^34476^', lifecycle);
        }

      };
      //-------------------------------------------------------------------------------------------------------
      fsm = new My_toolbox(get_fsm_descriptions());
      help(fsm.get_state());
      show_abilities = function() {
        help("fsm.grabmode_btn.can  'init':          ", fsm.grabmode_btn.can('init'));
        help("fsm.scrldir_btn.can   'init':          ", fsm.scrldir_btn.can('init'));
        help("fsm.scrldir_lamp.can  'init':          ", fsm.scrldir_lamp.can('init'));
        help("fsm.grabmode_btn.can  'toggle':        ", fsm.grabmode_btn.can('toggle'));
        help("fsm.grabmode_btn.can  'setPanzoom':    ", fsm.grabmode_btn.can('setPanzoom'));
        return help("fsm.grabmode_btn.can  'setMarkscroll': ", fsm.grabmode_btn.can('setMarkscroll'));
      };
      show_abilities();
      info(fsm.grabmode_btn.init());
      show_abilities();
      info(fsm.scrldir_btn.init());
      show_abilities();
      info(fsm.scrldir_lamp.init());
      show_abilities();
      info(fsm.grabmode_btn.toggle());
      return info(fsm.scrldir_lamp.toggle());
    })();
    echo('----------------------------------------------------------------------');
    (() => {
      var fsm;
      fsm = new Mkts_toolbox_fsm(get_fsm_descriptions());
      help(fsm.get_state());
      info(fsm.start());
      return help(fsm.get_state());
    })();
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_visualization = function() {
    var fsm, i, len, name, ref, visualize;
    visualize = require('../../../apps/mkts-gui-toolbox-fsm/node_modules/javascript-state-machine/lib/visualize');
    fsm = new Mkts_toolbox_fsm(get_fsm_descriptions());
    ref = fsm._names;
    for (i = 0, len = ref.length; i < len; i++) {
      name = ref[i];
      echo(visualize(fsm[name]));
    }
    return null;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.demo_detect_actual_state_changes = function() {
    var My_fsm, fsm, fsm_descriptions;
    require('../../../apps/svelte-and-sapper-for-print-app2-fresh/static/equals');
    debug('^4484879^', equals({
      x: {
        x: {
          z: 42
        }
      }
    }, {
      x: {
        x: {
          z: 42
        }
      }
    }));
    globalThis.StateMachine = require('javascript-state-machine');
    require('../../../apps/mkts-gui-toolbox-fsm');
    //---------------------------------------------------------------------------------------------------------
    /* NOTE exports to global namespace FTTB */    fsm_descriptions = {
      foo_lamp: {
        init: 'lit',
        transitions: [
          {
            name: 'press',
            from: '*',
            to: 'lit'
          },
          {
            name: 'release',
            from: '*',
            to: 'dark'
          },
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
          onAfterTransition: function() {
            return log('^334-7^', 'scrldir_lamp:', this.get_state());
          },
          onEnterLit: function() {
            return log('^334-8^', 'scrldir_lamp: onEnterLit');
          },
          onEnterDark: function() {
            return log('^334-9^', 'scrldir_lamp: onEnterDark');
          }
        }
      }
    };
    //---------------------------------------------------------------------------------------------------------
    My_fsm = class My_fsm extends Mkts_toolbox_fsm {
      on_after_transition(lifecycle) {
        delete lifecycle.fsm;
        return debug('^on_after_transition@34476^', lifecycle);
      }

    };
    //---------------------------------------------------------------------------------------------------------
    fsm = new My_fsm(fsm_descriptions);
    fsm.foo_lamp.press();
    fsm.foo_lamp.press();
    fsm.foo_lamp.press();
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      // @demo_2()
      return this.demo_detect_actual_state_changes();
    })();
  }

  // @demo_visualization()

}).call(this);

//# sourceMappingURL=demo.js.map