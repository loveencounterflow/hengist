(function() {
  //###########################################################################################################
  var GUY, Hedge, Intertype, alert, create, debug, declare, echo, help, info, inspect, isa, log, plain, praise, rpr, rvr, truth, types, urge, validate, warn, whisper;

  GUY = require('../../../apps/guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('GUY/demo-guy-hedgerows'));

  ({rpr, inspect, echo, log} = GUY.trm);

  rvr = GUY.trm.reverse;

  truth = GUY.trm.truth.bind(GUY.trm);

  ({Intertype} = require('../../../apps/intertype'));

  types = new Intertype();

  ({declare, create, isa, validate} = types);

  //-----------------------------------------------------------------------------------------------------------
  declare.hdg_new_hedge_cfg({
    $target: 'function',
    default: {
      target: null
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  declare.hdg_get_proxy_cfg({
    $target: 'function',
    default: {
      target: null
    }
  });

  //-----------------------------------------------------------------------------------------------------------
  Hedge = class Hedge {
    //---------------------------------------------------------------------------------------------------------
    constructor(cfg) {
      var R;
      this.cfg = create.hdg_new_hedge_cfg(cfg);
      this.state = {
        hedges: null
      };
      R = this._get_hedge_proxy(true, cfg.target);
      return R;
    }

    //---------------------------------------------------------------------------------------------------------
    _get_hedge_proxy(is_top, owner) {
      var R, dsc;
      dsc = {
        //-----------------------------------------------------------------------------------------------------
        get: (target, key) => {
          var R, hedges, sub_owner;
          if (is_top) {
            this.state.hedges = [key];
          } else {
            this.state.hedges.push(key);
          }
          if ((R = target[key]) !== void 0) {
            //...................................................................................................
            return R;
          }
          hedges = [...this.state.hedges];
          //...................................................................................................
          sub_owner = (...P) => {
            return this.cfg.target(hedges, ...P);
          };
          return target[key] != null ? target[key] : target[key] = this._get_hedge_proxy(false, sub_owner);
        }
      };
      //.......................................................................................................
      return R = new Proxy(owner, dsc);
    }

  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      var _isa, error;
      //---------------------------------------------------------------------------------------------------------
      _isa = function(hedges, x) {
        var arity;
        if ((arity = arguments.length) !== 2) {
          throw new Error(`^387^ expected 2 arguments, got ${arity}`);
        }
        help('^450-5^', {hedges, x});
        return true;
      };
      //---------------------------------------------------------------------------------------------------------
      info('^450-6^', isa = new Hedge({
        target: _isa
      }));
      //.........................................................................................................
      info('^450-12^', (function() {
        try {
          return isa(1);
        } catch (error1) {
          error = error1;
          return warn(rvr(error.message));
        }
      })());
      info('^450-12^', (function() {
        try {
          return isa(1, 2, 3);
        } catch (error1) {
          error = error1;
          return warn(rvr(error.message));
        }
      })());
      //.........................................................................................................
      info('^450-12^', isa(['one'], 1));
      info('^450-12^', isa.one(1));
      info('^450-13^', isa.one.two(2));
      info('^450-14^', isa.one.two.three(3));
      info('^450-15^', isa.one.two.three.four(4));
      info('^450-16^', isa(['one', 'two', 'three', 'four', 'five'], 5));
      info('^450-16^', isa.one.two.three.four.five(5));
      //---------------------------------------------------------------------------------------------------------
      return null;
    })();
  }

}).call(this);

//# sourceMappingURL=demo-guy-hedgerows.js.map