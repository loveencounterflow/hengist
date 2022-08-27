(function() {
  'use strict';
  var GUY, Multimix, alert, debug, echo, help, hide, hub, info, inspect, log, nameit, plain, praise, rpr, rvr, test, tree, types, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('INTERTYPE/prototype'));

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

  types = new (require('../../../apps/intertype')).Intertype();

  hub = this;

  //...........................................................................................................
  hide(this, 'Multimix', (require('../../../apps/multimix')).Multimix);

  Multimix = this.Multimix;

  //-----------------------------------------------------------------------------------------------------------
  this.registry = {
    integer: function(x) {
      return (Number.isFinite(x)) && (x === Math.floor(x));
    },
    //.........................................................................................................
    even: function(x) {
      if (Number.isInteger(x)) {
        return (x % 2) === 0;
      } else if (typeof x === 'bigint') {
        return (x % 2n) === 0n;
      }
      return false;
    },
    //.........................................................................................................
    odd: function(x) {
      if (Number.isInteger(x)) {
        return (x % 2) !== 0;
      } else if (typeof x === 'bigint') {
        return (x % 2n) !== 0n;
      }
      return false;
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this.handlers = {
    //---------------------------------------------------------------------------------------------------------
    isa: function(props, x) {
      var fn, i, len, prop;
// whisper '^321-1^', '---------------------------------------'
// debug '^321-1^', { props, x, }
      for (i = 0, len = props.length; i < len; i++) {
        prop = props[i];
        // debug '^321-2^', prop
        // debug '^321-3^', hub.registry
        // debug '^321-4^', hub.registry[ prop ]
        if ((fn = hub.registry[prop]) == null) {
          throw new Error(`unknown type ${rpr(prop)}`);
        }
        if (!fn.call(hub, x)) {
          return false;
        }
      }
      return true;
    },
    //---------------------------------------------------------------------------------------------------------
    declare: function(props, isa) {
      var R, arity, name;
      if ((arity = props.length) !== 1) {
        throw new Error(`expected single property, got ${arity}: ${rpr(props)}`);
      }
      [name] = props;
      hub.registry[name] = R = nameit(name, function(props, x) {
        return isa(x);
      });
      return R;
    }
  };

  //-----------------------------------------------------------------------------------------------------------
  this.isa = new Multimix({
    hub,
    handler: this.handlers.isa
  });

  this.declare = new Multimix({
    hub,
    handler: this.handlers.declare
  });

}).call(this);

//# sourceMappingURL=intertype-prototype.js.map