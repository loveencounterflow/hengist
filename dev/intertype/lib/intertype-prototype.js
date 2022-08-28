(function() {
  'use strict';
  var GUY, Multimix, alert, debug, echo, help, hide, info, inspect, log, nameit, plain, praise, rpr, rvr, test, tree, types, urge, warn, whisper;

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

  //...........................................................................................................
  hide(this, 'Multimix', (require('../../../apps/multimix')).Multimix);

  Multimix = this.Multimix;

  //===========================================================================================================
  this.Intertype = class Intertype {
    //---------------------------------------------------------------------------------------------------------
    constructor() {
      var clasz, handlers, hub;
      hub = this;
      clasz = this.constructor;
      handlers = clasz._get_handlers(hub);
      this.isa = new Multimix({
        hub,
        handler: handlers.isa
      });
      this.declare = new Multimix({
        hub,
        handler: handlers.declare
      });
      this.mmx = this.isa[Multimix.symbol];
      this.state = this.mmx.state;
      this.state.trace = [];
      //---------------------------------------------------------------------------------------------------------
      /* TAINT this part goes into declarations */
      this.registry = {
        integer: function(x) {
          return (Number.isFinite(x)) && (x === Math.floor(x));
        },
        text: function(x) {
          return (typeof x) === 'string';
        },
        //.......................................................................................................
        even: function(x) {
          if (Number.isInteger(x)) {
            return (x % 2) === 0;
          } else if (typeof x === 'bigint') {
            return (x % 2n) === 0n;
          }
          return false;
        },
        //.......................................................................................................
        odd: function(x) {
          if (Number.isInteger(x)) {
            return (x % 2) !== 0;
          } else if (typeof x === 'bigint') {
            return (x % 2n) !== 0n;
          }
          return false;
        }
      };
      return void 0;
    }

    //---------------------------------------------------------------------------------------------------------
    _trace({ref, level, prop, x, R}) {
      /* [ ref, level, prop, value, R, ] = checkpoint */
      // H.types.validate.nonempty_text  ref
      // H.types.validate.cardinal       level
      // H.types.validate.nonempty_text  prop
      // H.types.validate.boolean        R
      this.state.trace.push({ref, level, prop, x, R});
      return R;
    }

    //---------------------------------------------------------------------------------------------------------
    _reset_trace() {
      return this.state.trace = [];
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  this.Intertype._get_handlers = function(hub) {
    var R;
    R = {
      //-------------------------------------------------------------------------------------------------------
      isa: function(props, x) {
        var advance, arity, fn, idx, last_idx, level, nxt_prop, prop;
        if (!((arity = props.length) > 0)) {
          throw new Error(`expected at least one property, got ${arity}: ${rpr(props)}`);
        }
        // whisper '^321-1^', '---------------------------------------'
        level = 0/* !!!!!!!!!!!!!!!! */
        if (level === 0) {
          hub._reset_trace();
        }
        // debug '^445-1^', { props, x, }
        advance = false;
        last_idx = props.length - 1;
        R = true;
        idx = -1;
        // prv_prop  = null
        prop = null;
        nxt_prop = null;
        while (true) {
          //.....................................................................................................
          idx++;
          if (idx > last_idx) {
            // debug '^445-2^', { idx, prop, R, advance, }
            return R;
          }
          // [ prv_prop, prop, nxt_prop, ] = prop, props[ idx ], props[ idx + 1 ]
          [prop, nxt_prop] = [props[idx], props[idx + 1]];
          //...................................................................................................
          if (advance) {
            // debug '^445-3^'
            if (prop === 'or') {
              hub._trace({
                ref: '▲i1',
                level,
                prop,
                x,
                R
              });
              if (R) {
                return true;
              }
              advance = false;
            }
            continue;
          }
          //...................................................................................................
          if (prop === 'or') {
            if (nxt_prop === 'or') {
              throw new Error(`cannot have two \`or\` props in succession, got ${rpr(props.join('.'))}`);
            }
            hub._trace({
              ref: '▲i2',
              level,
              prop,
              x,
              R
            });
            if (R) {
              return true;
            }
            // debug '^445-4^'
            advance = true;
            continue;
          }
          //...................................................................................................
          if ((fn = hub.registry[prop]) == null) {
            throw new Error(`unknown type ${rpr(prop)}`);
          }
          //...................................................................................................
          R = R = fn.call(hub, x);
          hub._trace({
            ref: '▲i3',
            level,
            prop,
            x,
            R
          });
          if (!(R === true || R === false)) {
            /* TAINT use this library to determine type: */
            throw new Error(`expected test result to be boolean, go a ${typeof R}: ${rpr(R)}`);
          }
          // debug '^445-5^', GUY.trm.reverse { idx, prop, R, advance, }
          advance = !R;
        }
        //.....................................................................................................
        return R;
      },
      //-------------------------------------------------------------------------------------------------------
      declare: function(props, isa) {
        var arity, name;
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
    //---------------------------------------------------------------------------------------------------------
    return R;
  };

}).call(this);

//# sourceMappingURL=intertype-prototype.js.map