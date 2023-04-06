(function() {
  'use strict';
  var Analyzing_attributor, Attributor, GUY, Guy_error_base_class, Isa, Wrong_use_of_abstract_base_class_method, debug, help, info, rpr, urge, warn;

  //===========================================================================================================
  GUY = require('guy');

  ({debug, info, warn, urge, help} = GUY.trm.get_loggers('INTERTYPE'));

  ({rpr} = GUY.trm);

  /*

  * **Attributor**: a `class Atr extends Accessor` that instantiates `atr = new Atr()` as a function which allows to be accessed in two ways:
    classical `atr 'acc', p, q, r...` or compressed `atr.acc p, q, r...`
  * **Accessor**: the key used as first argument to access an attributor as in `atr.acc()`, sometimes symbolized as `acc`
  * **Phrase**: list of 'words'/keys resulting from splitting the accessor by whitespace and underscores. This allows
    to build complex accessors like `isa.text_or_integer 42` (phrase: `[ 'text', 'or', 'integer', ]`)
  * **Details**: arguments used in a attributor after the accessor. Ex.: In `atr.foo_bar 3, 4, 5`, `foo_bar` is the accessor key,
    `[ 'foo', 'bar', ]` is the accessor phrase, and `3, 4, 5` are the accessor details.
  * **NCC**, *Normalized Accessor*: the `phrase` equivalent of an accessor, the words being joined with single
    `_` underscores. Ex.: All of `empty_text`, `empty text`, `empty_____text` are normalized to `empty_text`.

   * Analyzing Attributor

  class Aa extends Analyzing_attributor

  aa = new Aa
  resolution = aa

  ## To Do

  * **[–]** docs
  * **[–]** find a good name

  ## Is Done

  * **[+]** name generated functions using the NCC

   */
  //-----------------------------------------------------------------------------------------------------------
  /* TAINT move this to Guy */
  Guy_error_base_class = class Guy_error_base_class extends Error {
    constructor(ref, message) {
      super();
      if (ref === null) {
        this.message = message;
        return void 0;
      }
      this.message = `${ref} (${this.constructor.name}) ${message}`;
      this.ref = ref;
      return void 0/* always return `undefined` from constructor */;
    }

  };

  //-----------------------------------------------------------------------------------------------------------
  Wrong_use_of_abstract_base_class_method = class Wrong_use_of_abstract_base_class_method extends Guy_error_base_class {
    constructor(ref, instance, method_name) {
      var class_name;
      class_name = instance.constructor.name;
      super(ref, `not allowed to call method ${rpr(method_name)} of abstract base class ${rpr(class_name)}`);
    }

  };

  Attributor = (function() {
    var clasz;

    //===========================================================================================================
    class Attributor extends Function {
      //---------------------------------------------------------------------------------------------------------
      static create_proxy(x) {
        return new Proxy(x, {
          get: function(target, accessor, receiver) {
            if (accessor === 'constructor') {
              // info '^98-1^', rpr accessor
              /* TAINT consider to use symbols instead of underscore-prefixed strings */
              return target[accessor];
            }
            if ((accessor.startsWith != null) && accessor.startsWith('__')) {
              return target[accessor];
            }
            return function(...P) {
              return target(accessor, ...P);
            };
          }
        });
      }

      //---------------------------------------------------------------------------------------------------------
      constructor() {
        /* Trick to make this work; these are strings containing JS code: */
        super('...P', 'return this._me.__do(...P)');
        this._me = this.bind(this);
        return clasz.create_proxy(this._me);
      }

      //---------------------------------------------------------------------------------------------------------
      __do(...P) {
        /* Attributor instances are functions, and the `__do()` method is the code that they execute when being
           called. */
        throw new Wrong_use_of_abstract_base_class_method('^Attributor.__do^', this, '__do');
      }

    };

    //---------------------------------------------------------------------------------------------------------
    clasz = Attributor;

    return Attributor;

  }).call(this);

  Analyzing_attributor = (function() {
    //===========================================================================================================
    class Analyzing_attributor extends Attributor {
      //---------------------------------------------------------------------------------------------------------
      constructor() {
        var clasz;
        super();
        clasz = this.constructor;
        this.__cache = clasz.__cache != null ? new Map(clasz.__cache) : new Map();
        return void 0;
      }

      //---------------------------------------------------------------------------------------------------------
      __do(accessor, ...details) {
        return (this.__get_handler(accessor))(...details);
      }

      //---------------------------------------------------------------------------------------------------------
      __get_handler(accessor) {
        var R, ncc, phrase;
        if (this.__cache.has(accessor)) {
          /* Given a accessor, returns a method to use for that accessor, either from cache a newly generated by
             calling `__create_handler()` which must be declared in derived classes. */
          return this.__cache.get(accessor);
        }
        [ncc, phrase] = this.__get_ncc_and_phrase(accessor);
        if (this.__cache.has(ncc)) {
          R = this.__cache.get(ncc);
          this.__cache.set(accessor, R);
        } else {
          R = this.__nameit(ncc, this.__create_handler);
          this.__cache.set(ncc, R);
          this.__cache.set(accessor, R);
        }
        return R;
      }

      //---------------------------------------------------------------------------------------------------------
      __create_handler(phrase) {
        /* Given a phrase (the parts of an accessor when split), return a function that takes details as
           arguments and returns a resolution. */
        throw new Wrong_use_of_abstract_base_class_method('^Analyzing_attributor.__create_handler^', this, '__create_handler');
      }

      //---------------------------------------------------------------------------------------------------------
      __get_ncc_and_phrase(accessor) {
        /* Given an accessor (string), return a phrase (list of strings): */
        var ncc, phrase;
        phrase = accessor.split(/[\s_]+/u);
        ncc = phrase.join('_');
        return [ncc, phrase];
      }

      //---------------------------------------------------------------------------------------------------------
      /* Associate an accessor with a handler method: */
      __declare(accessor, handler) {
        /* TAINT check for overwrites? */
        this.__cache.set(accessor, handler);
        return null;
      }

      //---------------------------------------------------------------------------------------------------------
      __nameit(name, f) {
        Object.defineProperty(f, 'name', {
          value: name
        });
        return f;
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Analyzing_attributor.__cache = null;

    return Analyzing_attributor;

  }).call(this);

  Isa = (function() {
    //===========================================================================================================
    class Isa extends Analyzing_attributor {
      //---------------------------------------------------------------------------------------------------------
      __create_handler(phrase) {
        return function(details) {
          return 'Yo';
        };
      }

    };

    //---------------------------------------------------------------------------------------------------------
    Isa.__cache = new Map(Object.entries({
      null: function(x) {
        return x === null;
      },
      undefined: function(x) {
        return x === void 0;
      },
      boolean: function(x) {
        return (x === true) || (x === false);
      },
      float: function(x) {
        return Number.isFinite(x);
      }
    }));

    return Isa;

  }).call(this);

  //===========================================================================================================
  if (module === require.main) {
    (() => {
      var e, isa;
      isa = new Isa();
      debug('^98-2^', isa.__cache);
      try {
        debug('^98-3^', (new Attributor()).__do());
      } catch (error) {
        e = error;
        warn(GUY.trm.reverse(e.message));
      }
      // info '^98-4^', isa
      debug('^98-5^', isa('float', 42));
      debug('^98-6^', isa.float(42));
      debug('^98-7^', isa.float(0/0));
      debug('^98-8^', isa.float('22'));
      info('^98-9^', [...isa.__cache.keys()]);
      debug('^98-10^', isa.float_or_text(42));
      info('^98-11^', [...isa.__cache.keys()]);
      debug('^98-12^', isa.float___or_text(42));
      info('^98-13^', [...isa.__cache.keys()]);
      debug('^98-14^', isa('float   or text', 42));
      info('^98-15^', [...isa.__cache.keys()]);
      debug('^98-16^', isa.__cache.get('float_or_text'));
      debug('^98-17^', (isa.__cache.get('float___or_text')) === (isa.__cache.get('float_or_text')));
      debug('^98-18^', (isa.__cache.get('float___or_text')) === (isa.__cache.get('float   or text')));
      return debug('^98-18^', (isa.__cache.get('float_or_text')).name === 'float_or_text');
    })();
  }

}).call(this);

//# sourceMappingURL=demo-type-declarations.js.map