(function() {
  'use strict';
  var GUY, Multimix, alert, debug, echo, help, hide, info, inspect, log, misfit, nameit, notavalue, plain, praise, rpr, rvr, size_of, test, tree, types, urge, warn, whisper;

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

  notavalue = Symbol('notavalue');

  misfit = Symbol('misfit');

  //---------------------------------------------------------------------------------------------------------
  size_of = function(x, fallback = misfit) {
    var R;
    if ((R = GUY.props.get(x, 'length', notavalue)) !== notavalue) {
      return R;
    }
    if ((R = GUY.props.get(x, 'size', notavalue)) !== notavalue) {
      return R;
    }
    if (fallback !== misfit) {
      return fallback;
    }
    throw new E.Intertype_ETEMPTBD('^intertype.size_of@1^', `expected an object with \`x.length\` or \`x.size\`, got a ${this.type_of(x)} with neither`);
  };

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
        list: function(x) {
          return Array.isArray(x);
        },
        set: function(x) {
          return x instanceof Set;
        },
        empty: function(x) {
          var R;
          return ((R = size_of(x, null)) != null) && R === 0;
        },
        nonempty: function(x) {
          var R;
          return ((R = size_of(x, null)) != null) && R !== 0;
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

    //-------------------------------------------------------------------------------------------------------
    _isa(props, x, level) {
      var R, advance, element, error, fn, idx, last_idx, nxt_prop, prop, props_tail;
      if (level === 0) {
        this._reset_trace();
      }
      advance = false;
      last_idx = props.length - 1;
      R = true;
      idx = -1;
      prop = null;
      nxt_prop = null;
      while (true) {
        //.....................................................................................................
        idx++;
        if (idx > last_idx) {
          return R;
        }
        [prop, nxt_prop] = [props[idx], props[idx + 1]];
        //...................................................................................................
        if (advance) {
          if (prop === 'or') {
            this._trace({
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
          if (idx === 0) {
            throw new Error(`cannot have \`or\` as first prop, got ${rpr(props.join('.'))}`);
          }
          if (idx === last_idx) {
            throw new Error(`cannot have \`or\` as last prop, got ${rpr(props.join('.'))}`);
          }
          if (nxt_prop === 'or') {
            throw new Error(`cannot have two \`or\` props in succession, got ${rpr(props.join('.'))}`);
          }
          this._trace({
            ref: '▲i2',
            level,
            prop,
            x,
            R
          });
          if (R) {
            return true;
          }
          advance = true;
          continue;
        }
        //...................................................................................................
        if (prop === 'of') {
          if (idx === 0) {
            throw new Error(`cannot have \`of\` as first prop, got ${rpr(props.join('.'))}`);
          }
          if (idx === last_idx) {
            throw new Error(`cannot have \`of\` as last prop, got ${rpr(props.join('.'))}`);
          }
          if (nxt_prop === 'of') {
            throw new Error(`cannot have two \`of\` props in succession, got ${rpr(props.join('.'))}`);
          }
          props_tail = props.slice(idx + 1);
          try {
            for (element of x) {
              if (!this._isa(props_tail, element, level + 1)) {
                return false;
              }
            }
          } catch (error1) {
            error = error1;
            if (!((error.name === 'TypeError') && (error.message === 'x is not iterable'))) {
              throw error;
            }
            throw new E.Intertype_ETEMPTBD('^intertype.isa@7^', `\`of\` must be preceded by collection name, got ${rpr(hedges[hedge_idx - 1])}`);
          }
          return true;
        }
        //...................................................................................................
        if ((fn = this.registry[prop]) == null) {
          throw new Error(`unknown type ${rpr(prop)}`);
        }
        //...................................................................................................
        R = R = fn.call(this, x);
        this._trace({
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
        advance = !R;
      }
      //.....................................................................................................
      return R;
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  this.Intertype._get_handlers = function(hub) {
    var R;
    R = {
      //-------------------------------------------------------------------------------------------------------
      isa: function(props, x) {
        var arity;
        if (!((arity = props.length) > 0)) {
          throw new Error(`expected at least one property, got ${arity}: ${rpr(props)}`);
        }
        return hub._isa(props, x, 0);
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