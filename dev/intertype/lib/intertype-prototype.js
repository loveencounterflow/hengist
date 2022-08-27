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
    text: function(x) {
      return (typeof x) === 'string';
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
      var R, advance, arity, fn, i, idx, last_idx, len, prop;
      if (!((arity = props.length) > 0)) {
        throw new Error(`expected at least one property, got ${arity}: ${rpr(props)}`);
      }
      whisper('^321-1^', '---------------------------------------');
      debug('^445-1^', {props, x});
      advance = false;
      last_idx = props.length - 1;
      R = true;
//.......................................................................................................
      for (idx = i = 0, len = props.length; i < len; idx = ++i) {
        prop = props[idx];
        debug('^445-2^', {idx, prop, R, advance});
        if (idx > last_idx) {
          return R;
        }
        //.....................................................................................................
        if (advance) {
          debug('^445-3^');
          if (prop === 'or') {
            if (R) {
              return true;
            }
            advance = false;
          }
          continue;
        }
        //.....................................................................................................
        if (prop === 'or') {
          if (R) {
            return true;
          }
          debug('^445-4^');
          advance = true;
          continue;
        }
        //.....................................................................................................
        if ((fn = hub.registry[prop]) == null) {
          throw new Error(`unknown type ${rpr(prop)}`);
        }
        //.....................................................................................................
        if (!((R = fn.call(hub, x)) === true || R === false)) {
          /* TAINT use this library to determine type: */
          throw new Error(`expected test result to be boolean, go a ${typeof R}: ${rpr(R)}`);
        }
        debug('^445-5^', GUY.trm.reverse({idx, prop, R, advance}));
        advance = !R;
      }
      //.......................................................................................................
      return R;
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