(function() {
  //###########################################################################################################
  var CND, GUY, Hedge, Intertype, alert, badge, create, debug, declare, echo, help, info, isa, log, rpr, types, urge, validate, warn, whisper;

  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'GUY/TESTS';

  log = CND.get_logger('plain', badge);

  info = CND.get_logger('info', badge);

  whisper = CND.get_logger('whisper', badge);

  alert = CND.get_logger('alert', badge);

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  help = CND.get_logger('help', badge);

  urge = CND.get_logger('urge', badge);

  echo = CND.echo.bind(CND);

  GUY = require('../../../apps/guy');

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
      R = this._get_top_proxy(this.cfg);
      return R;
    }

    //---------------------------------------------------------------------------------------------------------
    _get_top_proxy(cfg) {
      var R, dsc;
      dsc = {
        get: (target, key) => {
          var R, hedges, sub_target;
          this.state.hedges = [key];
          if ((R = target[key]) !== void 0) {
            return R;
          }
          hedges = [...this.state.hedges];
          // debug '^450-1^', @state
          sub_target = (...P) => {
            urge('^450-2^', {hedges, P});
            return this.cfg.target(hedges, ...P);
          };
          return target[key] != null ? target[key] : target[key] = this._get_sub_proxy({
            target: sub_target
          });
        }
      };
      return R = new Proxy(cfg.target, dsc);
    }

    //---------------------------------------------------------------------------------------------------------
    _get_sub_proxy(cfg) {
      var R, dsc;
      dsc = {
        get: (target, key) => {
          var R, hedges, sub_target;
          this.state.hedges.push(key);
          if ((R = target[key]) !== void 0) {
            return R;
          }
          hedges = [...this.state.hedges];
          // debug '^450-3^', @state
          sub_target = (...P) => {
            urge('^450-4^', {hedges, P});
            return this.cfg.target(hedges, ...P);
          };
          return target[key] != null ? target[key] : target[key] = this._get_sub_proxy({
            target: sub_target
          });
        }
      };
      return R = new Proxy(cfg.target, dsc);
    }

  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      var h, target;
      target = function(hedges, P) {
        return help('^450-5^', {hedges, P});
      };
      info('^450-6^', h = new Hedge({target}));
      // info '^450-7^', h.foo.bar
      // info '^450-8^', h.one.two.three.four.five
      // info '^450-9^', h.one.two
      // info '^450-10^', h
      // info '^450-11^', h.foo.bar                 42
      info('^450-12^', h.one(1));
      info('^450-13^', h.one.two(2));
      info('^450-14^', h.one.two.three(3));
      info('^450-14^', h.one.two.three(3));
      info('^450-15^', h.one.two.three.four(4));
      return info('^450-16^', h.one.two.three.four.five(5));
    })();
  }

  // info '^450-17^', h.one.two                 42
// info '^450-18^', h                         42

  // test_non_identity = ->
//   a = create.hdg_get_proxy_cfg()
//   b = create.hdg_get_proxy_cfg()
//   debug a
//   debug b
//   debug a is b
//   debug a.target is b.target

}).call(this);

//# sourceMappingURL=demo-guy-hedgerows.js.map