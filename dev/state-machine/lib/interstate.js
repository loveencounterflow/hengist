(function() {
  'use strict';
  var CND, PATH, badge, debug, declare, echo, freeze, help, info, isa, lets, log, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'HENGIST/DEV/INTERSTATE';

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
  this.get_fsmd = function() {
    var fsmd;
    fsmd = {
      // eq:           ( a, b ) -> ...
      // freeze:       ( x ) -> ...
      name: 'grabmode',
      // triggers: [
      //   'start      -> markscroll'
      //   'foobar     -> stop'
      //   'panzoom    -- toggle         -> markscroll'
      //   'markscroll -- toggle         -> panzoom'
      //   'markscroll -- setPanzoom     -> panzoom'
      //   'panzoom    -- setPanzoom     -> panzoom'
      //   'markscroll -- setMarkscroll  -> markscroll'
      //   'panzoom    -- setMarkscroll  -> markscroll' ],
      triggers: [
        ['void',
        'start',
        'markscroll'],
        ['*',
        'reset',
        'void'],
        // [ 'foobar',     'stop',           void          ] # ???
        ['panzoom',
        'toggle',
        'markscroll'],
        ['markscroll',
        'toggle',
        'panzoom'],
        ['markscroll',
        'setPanzoom',
        'panzoom'],
        ['panzoom',
        'setPanzoom',
        'panzoom'],
        ['markscroll',
        'setMarkscroll',
        'markscroll'],
        ['panzoom',
        'setMarkscroll',
        'markscroll']
      ],
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
    var fsm/* NOTE exports to global namespace FTTB */;
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
    require('../../../apps/mkts-gui-toolbox-fsm/lib/interstate');
    fsm = new Interstate(this.get_fsmd());
    // debug '^34766^', JSON.stringify fsm, null, '  '
    debug('^34766^', JSON.stringify(fsm.triggers, null, '  '));
    debug('^347-1^', 'start --------------------------------------');
    debug('^347-2^', fsm.start());
    debug('^347-3^', 'toggle --------------------------------------');
    debug('^347-4^', fsm.toggle());
    debug('^347-5^', 'setMarkscroll --------------------------------------');
    debug('^347-6^', fsm.setMarkscroll());
    debug('^347-7^', 'setMarkscroll --------------------------------------');
    debug('^347-8^', fsm.setMarkscroll());
    debug('^347-9^', 'reset --------------------------------------');
    debug('^347-10^', fsm.reset());
    debug('^347-11^', 'reset --------------------------------------');
    debug('^347-12^', fsm.reset());
    debug('^347-13^', 'toggle --------------------------------------');
    debug('^347-14^', fsm.toggle());
    debug('^347-13^', 'start --------------------------------------');
    debug('^347-14^', fsm.start());
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return this.demo_2();
    })();
  }

}).call(this);

//# sourceMappingURL=interstate.js.map