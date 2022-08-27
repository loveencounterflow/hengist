(function() {
  'use strict';
  var GUY, Intertype, Multimix, alert, debug, echo, help, hide, info, inspect, log, nameit, paragons, plain, praise, rpr, rvr, test, tree, types, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('MULTIMIX/tests/basics'));

  ({rpr, inspect, echo, log} = GUY.trm);

  ({hide, tree} = GUY.props);

  rvr = GUY.trm.reverse;

  nameit = function(name, f) {
    return Object.defineProperty(f, 'name', {
      value: name
    });
  };

  //...........................................................................................................
  test = require('guy-test');

  types = new (require('../../../../apps/intertype')).Intertype();

  ({Multimix} = require('../../../../apps/multimix'));

  //===========================================================================================================
  paragons = {
    //---------------------------------------------------------------------------------------------------------
    isa: function(props, x, ...P) {
      var R, arity, hedge, i, len;
      whisper('^450-1^', rvr('isa', {props, x, P}));
      if ((arity = arguments.length) !== 2) {
        throw new Error(`^450-2^ expected single argument, got ${arity - 1}`);
      }
      if (!(props.length > 0)) {
        throw new Error("^450-3^ expected at least one type, got none");
      }
      if (props.length === 1) {
        /* TAINT very much simplified version of `Intertype::_inner_isa()` */
        return this.isa[props[0]](null, x);
      }
      for (i = 0, len = props.length; i < len; i++) {
        hedge = props[i];
        R = this.isa[hedge](x);
        whisper('^450-4^', {
          R,
          hedge,
          handler: this.isa[hedge],
          x
        });
        if (R === false) {
          return false;
        }
        if (R !== true) {
          return R;
        }
      }
      return true;
    },
    //---------------------------------------------------------------------------------------------------------
    declare: function(props, isa) {
      var hedgecount, name;
      // if arguments.length < 2
      //   debug '^450-5^', "`declare()` called with no argument; leaving"
      //   return null
      // unless ( arity = arguments.length ) is 1
      //   throw new Error "^387^ expected no arguments, got #{arity - 1}"
      /* TAINT also check for props being a list */
      if ((hedgecount = props.length) !== 1) {
        throw new Error(`^450-6^ expected single hedge, got ${rpr(props)}`);
      }
      [name] = props;
      isa = nameit(name, isa);
      debug('^450-7^', rvr('declare', {props, isa}));
      this.registry[name] = isa;
      // handler           = ( props, x, P... ) => debug '^450-8^', { props, x, P, }; @isa.call @, props, x
      // hide @isa, name, nameit name, new Multimix { hub: @, handler, }
      return null;
    },
    //---------------------------------------------------------------------------------------------------------
    create: function(name, target) {
      debug('^450-9^', 'create', {
        name,
        target,
        isa: this.registry[name]
      });
      return null;
    }
  };

  //===========================================================================================================
  Intertype = class Intertype {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      var proxy_cfg;
      // GUY_props.hide @, 'isa', new Multimix
      proxy_cfg = {
        // create:     paragons.create.bind @
        create: true,
        strict: false,
        oneshot: true,
        delete: false,
        hide: true
      };
      hide(this, 'registry', {});
      hide(this, 'isa', nameit('isa', new Multimix({
        ...proxy_cfg,
        hub: this,
        handler: paragons.isa
      })));
      hide(this, 'declare', nameit('declare', new Multimix({
        ...proxy_cfg,
        hub: this,
        handler: paragons.declare
      })));
      hide(this, 'mmx', this.isa[Multimix.symbol]);
      return void 0;
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  this.test = function(T, done) {
    var declare, isa, t;
    t = new Intertype();
    ({declare, isa} = t);
    info('^450-10^', declare);
    info('^450-11^', declare.one);
    info('^450-12^', declare.one(function(x) {
      debug('^one^', {x});
      return (x === 1) || (x === '1');
    }));
    info('^450-13^', declare.two(function(x) {
      debug('^two^', {x});
      return (x === 2) || (x === '2');
    }));
    info('^450-14^', t.registry);
    info('^450-15^', isa.one(42));
    info('^450-16^', isa.one(1));
    if (T != null) {
      T.eq(isa.one(1), true);
    }
    if (T != null) {
      T.eq(isa.one('1'), true);
    }
    if (T != null) {
      T.eq(isa.one(2), false);
    }
    info('^450-17^', isa.one === declare.one);
    info('^450-18^', declare.one);
    info('^450-19^', t);
    info('^450-20^', isa);
    info('^450-21^', declare);
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return this.test();
    })();
  }

  // test @

}).call(this);

//# sourceMappingURL=intertype-prototype.js.map