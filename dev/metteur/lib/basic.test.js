(function() {
  'use strict';
  var GUY, alert, debug, echo, help, info, inspect, log, nameit, plain, praise, rpr, rvr, test, types, urge, warn, whisper;

  //###########################################################################################################
  GUY = require('guy');

  ({alert, debug, help, info, plain, praise, urge, warn, whisper} = GUY.trm.get_loggers('METTEUR/tests/basics'));

  ({rpr, inspect, echo, log} = GUY.trm);

  rvr = GUY.trm.reverse;

  nameit = function(name, f) {
    return Object.defineProperty(f, 'name', {
      value: name
    });
  };

  //...........................................................................................................
  test = require('guy-test');

  types = new (require('../../../apps/intertype')).Intertype();

  //-----------------------------------------------------------------------------------------------------------
  this.mtr_template_is_constructor = function(T, done) {
    var MTR;
    MTR = require('../../../apps/metteur');
    if (T != null) {
      T.ok(types.isa.function(MTR.Template));
    }
    if (T != null) {
      T.throws(/not a valid mtr_new_template/, function() {
        var e;
        try {
          return new MTR.Template();
        } catch (error) {
          e = error;
          warn(rvr(e.message));
          throw e;
        }
      });
    }
    // debug new MTR.Template { template: '', }
    if (T != null) {
      T.ok((new MTR.Template({
        template: ''
      })) instanceof MTR.Template);
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mtr_template_and_cfg_are_strict = function(T, done) {
    var MTR, template, tpl;
    MTR = require('../../../apps/metteur');
    template = "helo {name}.";
    tpl = new MTR.Template({template});
    if (T != null) {
      T.throws(/instance does not have property 'NONEXISTANT'/, function() {
        var e;
        try {
          return tpl.NONEXISTANT;
        } catch (error) {
          e = error;
          warn(rvr(e.message));
          throw e;
        }
      });
    }
    if (T != null) {
      T.throws(/instance does not have property 'NONEXISTANT'/, function() {
        var e;
        try {
          return tpl.cfg.NONEXISTANT;
        } catch (error) {
          e = error;
          warn(rvr(e.message));
          throw e;
        }
      });
    }
    if (T != null) {
      T.ok(Object.isFrozen(tpl.cfg));
    }
    if (T != null) {
      T.ok(Object.isFrozen(tpl._cfg));
    }
    if (T != null) {
      T.eq(tpl.cfg.open, '{');
    }
    if (T != null) {
      T.eq(tpl.cfg.close, '}');
    }
    if (T != null) {
      T.eq(tpl._cfg, {
        open: '\\{',
        close: '\\}',
        rx: /\{(?<key>[^\}]*)\}/g
      });
    }
    return typeof done === "function" ? done() : void 0;
  };

  //-----------------------------------------------------------------------------------------------------------
  this.mtr_template_defaults = function(T, done) {
    var MTR, result, template, tpl;
    MTR = require('../../../apps/metteur');
    template = "helo {name}.";
    tpl = new MTR.Template({template});
    result = tpl.fill({
      name: "world"
    });
    if (T != null) {
      T.eq(result, "helo world.");
    }
    return typeof done === "function" ? done() : void 0;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test(this);
    })();
  }

  // @mtr_template_and_cfg_are_strict()

}).call(this);

//# sourceMappingURL=basic.test.js.map