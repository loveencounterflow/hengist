(function() {
  'use strict';
  var Attributor, GUY, Isa, debug, help, info, rpr, split, urge, warn;

  //===========================================================================================================
  GUY = require('guy');

  ({debug, info, warn, urge, help} = GUY.trm.get_loggers('INTERTYPE'));

  ({rpr} = GUY.trm);

  split = function(source) {
    return source.split(/[\s_]+/u);
  };

  Attributor = (function() {
    var clasz;

    //===========================================================================================================
    class Attributor extends Function {
      static create_proxy(x) {
        return new Proxy(x, {
          get: function(target, key, receiver) {
            urge('^98-1^', {key});
            urge('^98-2^', target);
            return function(...P) {
              return target(key, ...P);
            };
          }
        });
      }

      //---------------------------------------------------------------------------------------------------------
      constructor() {
        super('...P', 'return this._me.do(...P)');
        this._me = this.bind(this);
        return clasz.create_proxy(this._me);
      }

      //---------------------------------------------------------------------------------------------------------
      do(...P) {
        info('^98-3^', P, split(P[0]));
        return 123;
      }

    };

    //---------------------------------------------------------------------------------------------------------
    clasz = Attributor;

    return Attributor;

  }).call(this);

  Isa = (function() {
    var isa;

    //===========================================================================================================
    class Isa extends Attributor {};

    //---------------------------------------------------------------------------------------------------------
    Isa.prototype.do = isa = function(...P) {
      var name;
      [name, ...P] = P;
      help('^98-4^', P, split(name));
      return 789;
    };

    return Isa;

  }).call(this);

  //===========================================================================================================
  if (module === require.main) {
    (() => {
      var isa;
      debug('^98-5^', isa = new Isa());
      info('^98-6^', isa);
      debug('^98-7^', isa('float', 42));
      debug('^98-8^', isa.float(42));
      debug('^98-9^', isa.float_or_text(42));
      debug('^98-10^', isa.float___or_text(42));
      return debug('^98-11^', isa('float   or text', 42));
    })();
  }

}).call(this);

//# sourceMappingURL=demo-type-declarations.js.map