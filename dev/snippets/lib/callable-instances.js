(function() {
  'use strict';
  var CND, Fn, MMX, badge, debug, demo_2, echo, guy, help, info, isa, rpr, test, type_of, types, urge, validate, warn, whisper;

  //###########################################################################################################
  CND = require('cnd');

  rpr = CND.rpr;

  badge = 'CALLABLE-INSTANCES';

  debug = CND.get_logger('debug', badge);

  warn = CND.get_logger('warn', badge);

  info = CND.get_logger('info', badge);

  urge = CND.get_logger('urge', badge);

  help = CND.get_logger('help', badge);

  whisper = CND.get_logger('whisper', badge);

  echo = CND.echo.bind(CND);

  types = new (require('intertype')).Intertype();

  ({isa, type_of, validate} = types.export());

  MMX = require('../../../apps/multimix/lib/cataloguing');

  guy = require('../../../apps/guy');

  //-----------------------------------------------------------------------------------------------------------
  demo_2 = function() {
    var Fn, fn;
    Fn = class Fn extends Function {
      constructor() {
        var fn;
        super();
        fn = (x) => {
          var k;
          debug('^2-1^', (function() {
            var results;
            results = [];
            for (k in this) {
              results.push(k);
            }
            return results;
          }).call(this));
          debug('^2-2^', this);
          debug('^2-3^', MMX.all_keys_of(this));
          debug('^2-4^', this.other_method);
          debug('^2-5^', this.other_method());
          return x ** x;
        };
        Object.setPrototypeOf(fn, this);
        return fn;
      }

      other_method() {
        return urge('^2-6^', this);
      }

    };
    debug('^2-7^', fn = new Fn());
    debug('^2-7^', fn(42));
    debug('^2-8^', fn.other_method);
    return debug('^2-8^', fn.other_method(42));
  };

  //===========================================================================================================
  /* thx to https://stackoverflow.com/a/40878674/256361 */
  Fn = class Fn extends Function {
    //---------------------------------------------------------------------------------------------------------
    static class_method(self) {
      self.prop_10 = 'prop_10';
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    static other_class_method(dis) {
      dis._self.prop_11 = 'prop_11';
      return null;
    }

    //---------------------------------------------------------------------------------------------------------
    constructor() {
      var self;
      super('...P', 'return this._self._call(...P)');
      guy.props.def(this, 'prop_1', {
        enumerable: true,
        value: 'prop_1'
      });
      this.prop_2 = 'prop_2';
      self = this.bind(this);
      guy.props.def(this, 'prop_3', {
        enumerable: true,
        value: 'prop_3'
      });
      guy.props.def(self, 'prop_4', {
        enumerable: true,
        value: 'prop_4'
      });
      this._self = self;
      this.prop_5 = 'prop_5';
      guy.props.def(this._self, 'prop_6', {
        enumerable: true,
        value: 'prop_6'
      });
      this._self.prop_7 = 'prop_7';
      self.prop_8 = 'prop_8';
      this.constructor.class_method(self);
      this.constructor.other_class_method(this);
      return self;
    }

    //---------------------------------------------------------------------------------------------------------
    _call(a = 0, b = 0, c = 0) {
      debug('^4-1^', this);
      help('^5-1^', this.prop_1);
      help('^5-2^', this.prop_2);
      help('^5-3^', this.prop_3);
      help('^5-4^', this.prop_4);
      help('^5-5^', this.prop_5);
      help('^5-6^', this.prop_6);
      help('^5-7^', this.prop_7);
      help('^5-8^', this.prop_8);
      help('^5-10^', this.prop_10);
      help('^5-11^', this.prop_11);
      return a + b + c;
    }

    //---------------------------------------------------------------------------------------------------------
    other_method() {
      urge('^4-2^', this);
      urge('^3-1^', this.prop_1);
      urge('^3-2^', this.prop_2);
      urge('^3-3^', this.prop_3);
      urge('^3-4^', this.prop_4);
      urge('^3-5^', this.prop_5);
      urge('^3-6^', this.prop_6);
      urge('^3-7^', this.prop_7);
      urge('^3-8^', this.prop_8);
      urge('^3-10^', this.prop_10);
      return urge('^3-11^', this.prop_11);
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  test = function() {
    var fn;
    fn = new Fn();
    info('^3-1^', fn);
    info('^3-1^', fn.prop_1);
    info('^3-2^', fn.prop_2);
    info('^3-3^', fn.prop_3);
    info('^3-4^', fn.prop_4);
    info('^3-5^', fn.prop_5);
    info('^3-6^', fn.prop_6);
    info('^3-7^', fn.prop_7);
    info('^3-8^', fn.prop_8);
    info('^3-10^', fn.prop_10);
    info('^3-11^', fn.prop_11);
    info('^4-4^', fn(3, 4, 5));
    fn.other_method();
    return null;
  };

  //###########################################################################################################
  if (module === require.main) {
    (() => {
      return test();
    })();
  }

}).call(this);

//# sourceMappingURL=callable-instances.js.map